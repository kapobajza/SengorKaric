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
    "GOOGLE_OAUTH_CLIENT_ID",
    "GOOGLE_OAUTH_CLIENT_SECRET",
    "GOOGLE_OAUTH_ALLOWED_EMAILS",
    "GOOGLE_OAUTH_STATE_SECRET",
    "GOOGLE_OAUTH_REDIRECT_URI",
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
    GOOGLE_OAUTH_CLIENT_ID: {
      type: "string",
    },
    GOOGLE_OAUTH_CLIENT_SECRET: {
      type: "string",
    },
    GOOGLE_OAUTH_ALLOWED_EMAILS: {
      type: "string",
    },
    GOOGLE_OAUTH_STATE_SECRET: {
      type: "string",
    },
    GOOGLE_OAUTH_REDIRECT_URI: {
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
