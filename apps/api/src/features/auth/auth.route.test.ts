import { FastifyInstance } from "fastify";
import { beforeAll, describe, expect, it } from "vitest";
import { HttpErrorStatus } from "@/toolkit/api";
import { eq } from "drizzle-orm";

import {
  buildTestApp,
  createCsrfSpy,
  createExchangeGoogleAuthCodeSpy,
} from "@/api/test/util";
import { users } from "@/api/db/schema";

import { GoogleCheckQuery } from "./auth.types";

describe("auth route", () => {
  let fastify: FastifyInstance;

  const queryParams = new URLSearchParams({
    authuser: "0",
    state: "invalid",
    scope: "email",
    code: "invalid",
    prompt: "consent",
  } satisfies GoogleCheckQuery);

  beforeAll(async () => {
    fastify = await buildTestApp();
  });

  it("should return 422 if query params are missing", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/auth/google/check",
    });

    expect(response.statusCode).toBe(HttpErrorStatus.UnprocessableEntity);
  });

  it("should return 400 if CSRF state is invalid", async () => {
    createCsrfSpy(fastify, false);

    const response = await fastify.inject({
      method: "GET",
      url: `/auth/google/check?${queryParams.toString()}`,
    });

    expect(response.statusCode).toBe(HttpErrorStatus.BadRequest);
  });

  it("should return 400 if user is not allowed to sign in", async () => {
    createCsrfSpy(fastify, true);
    createExchangeGoogleAuthCodeSpy(fastify, "malicious_user@example.com");

    const response = await fastify.inject({
      method: "GET",
      url: `/auth/google/check?${queryParams.toString()}`,
    });

    expect(response.statusCode).toBe(HttpErrorStatus.BadRequest);
  });

  it("should return 200 and session cookie if user is allowed to sign in", async () => {
    const env = fastify.getEnvs();
    const validEmail = env.GOOGLE_OAUTH_ALLOWED_EMAILS.split(",")[0] ?? "";

    createExchangeGoogleAuthCodeSpy(fastify, validEmail);
    createCsrfSpy(fastify, true);

    const response = await fastify.inject({
      method: "GET",
      url: `/auth/google/check?${new URLSearchParams({
        authuser: "0",
        state: "state",
        scope: "email",
        code: "code",
        prompt: "consent",
      } satisfies GoogleCheckQuery).toString()}`,
    });

    const user = await fastify.db
      .select({
        id: users.id,
      })
      .from(users)
      .where(eq(users.email, validEmail))
      .limit(1);

    expect(response.statusCode).toBe(200);
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(user.length).toBe(1);
  });
});
