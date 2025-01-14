import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import fp from "fastify-plugin";
import { HttpUnauthorizedError } from "@/toolkit/api";

import { UserSession } from "@/api/features/auth/auth.types";
import { FastifyCustomProp } from "@/api/types/app.types";

export default fp((fastify, _opts, done) => {
  type FastifyAuthParams = Parameters<typeof fastify.auth>;

  const fastifyAuth = () => {
    return fastify.auth.bind(fastify) as (...args: FastifyAuthParams) => {
      (
        request: FastifyRequest,
        reply: FastifyReply,
        done: HookHandlerDoneFunction,
      ): void;
    };
  };

  const hasTokenExpired = (session: UserSession) => {
    const now = Date.now();
    const { expiresIn } = session;

    return now > now + expiresIn * 1000;
  };

  const isUserAuthenticated = async (request: FastifyRequest) => {
    try {
      const session = request.session.get("user");

      if (!session) {
        return false;
      }

      if (hasTokenExpired(session)) {
        const { refreshToken } = session;
        const data =
          await fastify.service.auth.refreshGoogleAccessToken(refreshToken);

        request.session.set("user", {
          ...session,
          ...data,
        });
      }

      return true;
    } catch {
      return false;
    }
  };

  const verifyUserSession = async (request: FastifyRequest) => {
    const isAuthenticated = await isUserAuthenticated(request);

    if (!isAuthenticated) {
      request.session.delete();
      throw new HttpUnauthorizedError();
    }
  };

  fastify.decorate(
    FastifyCustomProp.VerifyUserSession,
    (
      request: FastifyRequest,
      reply: FastifyReply,
      done: HookHandlerDoneFunction,
    ) => {
      const auth = fastifyAuth();
      auth([verifyUserSession])(request, reply, done);
    },
  );

  done();
});
