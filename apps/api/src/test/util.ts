import { spawnSync } from "child_process";

import { PostgreSqlContainer } from "@testcontainers/postgresql";
import Fastify, { FastifyInstance, InjectOptions } from "fastify";
import fp from "fastify-plugin";
import { vi } from "vitest";
import jwt from "jsonwebtoken";

import { EnvRecord, registerEnvPlugin } from "@/api/env/util";
import { buildApp } from "@/api/app";
import { GoogleCheckQuery } from "@/api/features/auth/auth.types";

export async function buildTestApp() {
  const app = Fastify();
  const postgresContainer = await new PostgreSqlContainer().start();

  const sessionSecret = Array.from({ length: 64 })
    .map(() => "1")
    .join("");

  const env: EnvRecord = {
    SESSION_COOKIE_MAX_AGE: 60 * 60 * 1000,
    SESSION_COOKIE_NAME: "test",
    SESSION_COOKIE_DOMAIN: "test",
    SESSION_SECRET: sessionSecret,
    GOOGLE_OAUTH_ALLOWED_EMAILS: "test@email.com",
    GOOGLE_OAUTH_CLIENT_ID: "test",
    GOOGLE_OAUTH_CLIENT_SECRET: "test",
    GOOGLE_OAUTH_REDIRECT_URI: "test",
    GOOGLE_OAUTH_STATE_SECRET: "test",
    PGUSER: "test",
    DB_NAME: postgresContainer.getDatabase(),
    DB_HOST: postgresContainer.getHost(),
    DB_PASSWORD: postgresContainer.getPassword(),
    DB_PORT: postgresContainer.getPort(),
    DB_USER: postgresContainer.getUsername(),
    SESSION_SECRET_SALT: "test",
  };

  // Run migrations
  const { stderr } = spawnSync("npx", ["drizzle-kit", "push"], {
    env: {
      ...process.env,
      ...(env as NodeJS.ProcessEnv),
    },
  });

  const error = stderr.toString();

  if (error) {
    throw new Error(error);
  }

  await registerEnvPlugin(app, {
    data: env,
  });

  await app.register(fp(buildApp), {
    testing: true,
    env,
    appEnv: "local",
  });

  app.addHook("onClose", async () => {
    await postgresContainer.stop();
  });

  return app;
}

export function createCsrfSpy(fastify: FastifyInstance, value: boolean) {
  const spy = vi.spyOn(fastify, "isCsrfProtected");
  spy.mockImplementationOnce(() => value);
  return spy;
}

export function createExchangeGoogleAuthCodeSpy(
  fastify: FastifyInstance,
  email: string,
) {
  const idToken = jwt.sign(
    {
      email,
    },
    "secret",
  );
  const spy = vi.spyOn(fastify.service.auth, "exchangeGoogleAuthCode");
  spy.mockImplementationOnce(async () => {
    return Promise.resolve({
      access_token: "token",
      expires_in: 3600,
      refresh_token: "refreshToken",
      id_token: idToken,
    });
  });
  return spy;
}

export async function doAuthenticatedRequest(
  app: FastifyInstance,
  opts: InjectOptions & {
    email: string;
  },
) {
  const { email, ...otherOptions } = opts;

  createExchangeGoogleAuthCodeSpy(app, email);
  createCsrfSpy(app, true);

  const authResponse = await app.inject({
    method: "GET",
    url: `/auth/google/check?${new URLSearchParams({
      authuser: "0",
      state: "state",
      scope: "email",
      code: "code",
      prompt: "consent",
    } satisfies GoogleCheckQuery).toString()}`,
  });

  return app.inject({
    ...otherOptions,
    headers: {
      ...otherOptions.headers,
      cookie: authResponse.headers["set-cookie"],
    },
  });
}
