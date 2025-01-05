import { FastifyInstance } from "fastify";

import { FastifyCustomProp } from "@/api/types/app.types";

export function registerServicePlugin(
  fastify: FastifyInstance,
  service: Partial<FastifyInstance["service"]>,
) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!fastify[FastifyCustomProp.Service]) {
    fastify.decorate(FastifyCustomProp.Service, {
      ...fastify.service,
      ...service,
    });
    return;
  }

  fastify.service = {
    ...fastify.service,
    ...service,
  };
}
