import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import jwt from "jsonwebtoken";

import {
  createBadRequestReply,
  createInternalServerErrorReply,
  createOkReply,
} from "@/api/error/replies";
import { okResponseSchema } from "@/api/types/validation.types";
import { verifySignedState } from "@/api/util/sign";

export default function sample(
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
        querystring: z.object({
          state: z.string(),
          code: z.string(),
          scope: z.string(),
          authuser: z.string(),
          prompt: z.string(),
        }),
      },
    },
    async function (request, reply) {
      try {
        const env = fastify.getEnvs();
        const state = request.session.get("oauthstate");

        const [error] = verifySignedState({
          state: request.query.state,
          secret: env.GOOGLE_OAUTH_STATE_SECRET,
        });

        if (!state || error || state !== request.query.state) {
          console.error("Invalid state");
          return createBadRequestReply(reply, "Invalid state");
        }

        const token = await fastify.service.auth.exchangeGoogleAuthCode(
          request.query.code,
        );

        if (!token.id_token) {
          console.error("No id_token in token");
          return createBadRequestReply(reply);
        }

        const { email } = jwt.decode(token.id_token) as {
          email: string | undefined;
        };

        if (!email) {
          console.error("No email in id_token");
          return createBadRequestReply(reply);
        }

        if (!env.GOOGLE_OAUTH_ALLOWED_EMAILS.includes(email)) {
          console.error("Email not allowed");
          return createBadRequestReply(reply);
        }

        request.session.set("user", {
          accessToken: token.access_token,
          email,
          expiresIn: token.expires_in,
          refreshToken: token.refresh_token,
        });

        return createOkReply(reply);
      } catch (err) {
        console.error(err);
        return createInternalServerErrorReply(reply);
      }
    },
  );

  fastify.post("/logout", async function (request, reply) {
    request.session.set("user", undefined);
    return createOkReply(reply);
  });

  done();
}
