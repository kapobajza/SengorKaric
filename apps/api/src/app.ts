import path from "path";

import {
  serializerCompiler as zodSerializerCompiler,
  validatorCompiler as zodValidatorCompiler,
} from "fastify-type-provider-zod";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import PrintRoutes from "fastify-print-routes";
import { type FastifyInstance } from "fastify";
import { z, ZodError } from "zod";
import FastifyMultipart from "@fastify/multipart";
import FastifyAuth from "@fastify/auth";
import FastifySecureSession from "@fastify/secure-session";
import { HttpError } from "@/toolkit/api";

import type { FastifyAppInstanceOptions } from "@/api/types/app.types";
import {
  HttpInternalServerError,
  HttpValidationError,
} from "@/api/error/throwable";

const fstErrValidationSchema = z.object({
  code: z.literal("FST_ERR_VALIDATION"),
  validation: z.array(
    z.object({
      params: z.object({
        issue: z.record(z.any()),
      }),
    }),
  ),
});

export async function buildApp(
  fastify: FastifyInstance,
  opts: FastifyAppInstanceOptions,
) {
  fastify.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      const responseError = new HttpValidationError({
        validationErrors: error.issues,
      });

      return reply.status(responseError.statusCode).send(responseError);
    }

    if (error instanceof HttpError) {
      return reply.status(error.statusCode).send(error);
    }

    const errResponse = fstErrValidationSchema.safeParse(error);

    if (errResponse.success) {
      const responseError = new HttpValidationError({
        validationErrors: errResponse.data.validation.map<z.ZodIssue>(
          (issue) => issue.params.issue as z.ZodIssue,
        ),
      });
      return reply.status(responseError.statusCode).send(responseError);
    }

    console.error(error);
    return reply.status(500).send(new HttpInternalServerError());
  });

  await fastify.register(FastifyMultipart);

  fastify.setValidatorCompiler(zodValidatorCompiler);
  fastify.setSerializerCompiler(zodSerializerCompiler);

  await fastify.register(FastifyAuth);

  if (!opts.testing) {
    await fastify.register(PrintRoutes);
  }

  if (opts.appEnv === "local") {
    const FastifyCors = await import("@fastify/cors");
    await fastify.register(FastifyCors, {
      origin: true,
      allowedHeaders: ["Origin", "Content-Type"],
      credentials: true,
    });
  }

  const sessionSecret = Buffer.from(opts.env.SESSION_SECRET, "hex");

  await fastify.register(FastifySecureSession, {
    key: sessionSecret,
    salt: opts.env.SESSION_SECRET_SALT,
    cookieName: opts.env.SESSION_COOKIE_NAME,
    cookie: {
      httpOnly: true,
      path: "/",
      domain:
        opts.appEnv === "local" ? undefined : opts.env.SESSION_COOKIE_DOMAIN,
      secure: opts.appEnv !== "local",
      sameSite: "lax",
      maxAge: opts.env.SESSION_COOKIE_MAX_AGE,
    },
  });

  const servicesAutoLoadOptions: Omit<AutoloadPluginOptions, "dir"> = {
    matchFilter: (path) => {
      return /\.service\.(t|j)s$/.test(path);
    },
    maxDepth: 2,
  };

  await fastify.register(AutoLoad, {
    ...servicesAutoLoadOptions,
    dir: path.join(__dirname, "services"),
  });

  await fastify.register(AutoLoad, {
    ...servicesAutoLoadOptions,
    dir: path.join(__dirname, "features"),
  });

  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
  });

  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, "features"),
    matchFilter: (path) => {
      return /\.route\.(t|j)s$/.test(path);
    },
    maxDepth: 2,
  });
}
