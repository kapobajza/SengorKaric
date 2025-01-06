import { FastifyInstance } from "fastify";
import { beforeAll, describe, expect, it } from "vitest";
import { UserMeDto } from "@/toolkit/dto";

import { buildTestApp, doAuthenticatedRequest } from "@/api/test/util";

describe("users route", () => {
  let fastify: FastifyInstance;

  beforeAll(async () => {
    fastify = await buildTestApp();
  });

  it("should return 401 if user is not logged in", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/users/me",
    });

    expect(response.statusCode).toBe(401);
  });

  it("should return 200 if user is logged in", async () => {
    const email = "test@email.com";
    const response = await doAuthenticatedRequest(fastify, {
      method: "GET",
      url: "/users/me",
      email,
    });

    const data = response.json<UserMeDto>();

    expect(response.statusCode).toBe(200);
    expect(data.email).toBe(email);
  });
});
