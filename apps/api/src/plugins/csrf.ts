import fp from "fastify-plugin";

import { FastifyCustomProp } from "@/api/types/app.types";
import { verifySignedState } from "@/api/util/sign";

export default fp((fastify, _opts, done) => {
  fastify.decorate(FastifyCustomProp.IsCsrfProtected, (state, queryState) => {
    const env = fastify.getEnvs();

    const [error] = verifySignedState({
      state: queryState,
      secret: env.GOOGLE_OAUTH_STATE_SECRET,
    });

    if (!state || error || state !== queryState) {
      return false;
    }

    return true;
  });
  done();
});
