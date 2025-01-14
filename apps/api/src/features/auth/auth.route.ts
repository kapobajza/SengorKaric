import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import jwt from "jsonwebtoken";
import { HttpBadRequestError } from "@/toolkit/api";

import { okResponseSchema } from "@/api/types/validation.types";
import { createOkReply } from "@/api/util/replies";
import { users } from "@/api/db/schema";
import { generateUDID } from "@/api/util/secure";

import { googleCheckQuerySchema } from "./auth.types";

export default function auth(
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void,
) {
  fastify.get("/google/login", function (request, reply) {
    const authUriResponse = fastify.service.auth.getGoogleAuthUri();
    request.session.set("oauthstate", authUriResponse.signedState);
    return reply.redirect(authUriResponse.authorizationUrl);
  });

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/google/check",
    {
      schema: {
        response: {
          200: okResponseSchema,
        },
        querystring: googleCheckQuerySchema,
      },
    },
    async function (request, reply) {
      const env = fastify.getEnvs();
      const state = request.session.get("oauthstate");

      if (!fastify.isCsrfProtected(state, request.query.state)) {
        throw new HttpBadRequestError({ message: "Invalid state" });
      }

      const token = await fastify.service.auth.exchangeGoogleAuthCode(
        request.query.code,
      );

      if (!token.id_token) {
        throw new HttpBadRequestError();
      }

      const payload = jwt.decode(token.id_token) as {
        email: string | undefined;
        name: string | undefined;
        picture: string | undefined;
      };
      const { email, name, picture } = payload;

      if (!email) {
        throw new HttpBadRequestError();
      }

      const allowedEmails = env.GOOGLE_OAUTH_ALLOWED_EMAILS.split(",").map(
        (e) => e.trim().toLowerCase(),
      );

      if (!allowedEmails.includes(email.toLowerCase())) {
        throw new HttpBadRequestError();
      }

      const insertedUsers = await fastify.db
        .insert(users)
        .values({
          email,
          name: name ?? "Unknown",
          avatar: picture,
          id: generateUDID(),
        })
        .onConflictDoUpdate({
          target: users.email,
          set: {
            email,
          },
        })
        .returning({ id: users.id });
      const user = insertedUsers[0];

      if (!user) {
        throw new HttpBadRequestError();
      }

      request.session.set("user", {
        accessToken: token.access_token,
        email,
        expiresIn: token.expires_in,
        refreshToken: token.refresh_token,
        id: user.id,
      });

      return createOkReply(reply);
    },
  );

  fastify.post("/logout", async function (request, reply) {
    request.session.set("user", undefined);
    return createOkReply(reply);
  });

  done();
}
