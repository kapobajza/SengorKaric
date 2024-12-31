import type { FastifyInstance } from "fastify";
import type { FromSchema, JSONSchema } from "json-schema-to-ts";
import type { FastifyEnvOptions } from "@fastify/env";
import Env from "@fastify/env";

export const envSchema = {
  type: "object",
  required: [
    "SESSION_COOKIE_NAME",
    "SESSION_COOKIE_DOMAIN",
    "SESSION_COOKIE_MAX_AGE",
    "SESSION_SECRET",
  ],
  properties: {
    SESSION_COOKIE_NAME: {
      type: "string",
    },
    SESSION_COOKIE_DOMAIN: {
      type: "string",
    },
    SESSION_COOKIE_MAX_AGE: {
      type: "integer",
    },
    PORT: {
      type: "integer",
    },
    SESSION_SECRET: {
      type: "string",
    },
  },
} as const satisfies JSONSchema;

export type EnvRecord = FromSchema<typeof envSchema>;

export const registerEnvPlugin = async (
  fastify: FastifyInstance,
  options?: FastifyEnvOptions,
) => {
  await fastify.register(Env, {
    schema: envSchema,
    ...options,
  });
};
