import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import jwt from "jsonwebtoken";

import { okResponseSchema } from "@/api/types/validation.types";
import { verifySignedState } from "@/api/util/sign";
import { HttpBadRequestError } from "@/api/error/throwable";
import { createOkReply } from "@/api/util/replies";

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
      const env = fastify.getEnvs();
      const state = request.session.get("oauthstate");

      const [error] = verifySignedState({
        state: request.query.state,
        secret: env.GOOGLE_OAUTH_STATE_SECRET,
      });

      if (!state || error || state !== request.query.state) {
        throw new HttpBadRequestError({ message: "Invalid state" });
      }

      const token = await fastify.service.auth.exchangeGoogleAuthCode(
        request.query.code,
      );

      if (!token.id_token) {
        throw new HttpBadRequestError();
      }

      const { email } = jwt.decode(token.id_token) as {
        email: string | undefined;
      };

      if (!email) {
        throw new HttpBadRequestError();
      }

      if (!env.GOOGLE_OAUTH_ALLOWED_EMAILS.includes(email)) {
        throw new HttpBadRequestError();
      }

      request.session.set("user", {
        accessToken: token.access_token,
        email,
        expiresIn: token.expires_in,
        refreshToken: token.refresh_token,
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
