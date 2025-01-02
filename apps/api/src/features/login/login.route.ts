import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { jwtDecode } from "jwt-decode";
import { z } from "zod";

import {
  createBadRequestReply,
  createInternalServerErrorReply,
} from "@/api/error/replies";
import { okResponseSchema } from "@/api/types/validation.types";
import { verifySignedState } from "@/api/util/sign";

import { loginGoogleQueryParamsSchema } from "./login.types";

export default function sample(
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void,
) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/google/callback",
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

        const [error, queryState] = verifySignedState({
          schema: loginGoogleQueryParamsSchema,
          signedState: request.query.state,
          secret: env.GOOGLE_OAUTH_STATE_SECRET,
        });

        if (error) {
          console.error(error);
          return createBadRequestReply(reply, "redirect query param missing");
        }

        const { token } =
          await fastify.googleOauth2.getAccessTokenFromAuthorizationCodeFlow(
            request,
          );

        if (!token.id_token) {
          console.error("No id_token in token");
          return createBadRequestReply(reply);
        }

        const { email } = jwtDecode<{ email: string | undefined }>(
          token.id_token,
        );

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
          refreshToken: token.refresh_token ?? "",
        });

        return reply.redirect(queryState.redirect);
      } catch (err) {
        console.error(err);
        return createInternalServerErrorReply(reply);
      }
    },
  );

  done();
}
