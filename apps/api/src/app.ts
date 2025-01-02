import path from "path";

import {
  serializerCompiler as zodSerializerCompiler,
  validatorCompiler as zodValidatorCompiler,
} from "fastify-type-provider-zod";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import PrintRoutes from "fastify-print-routes";
import { type FastifyInstance } from "fastify";
import { ZodError } from "zod";
import FastifyMultipart from "@fastify/multipart";
import FastifyCors from "@fastify/cors";
import FastifyOauth2 from "@fastify/oauth2";
import FastifySecureSession from "@fastify/secure-session";

import { createValidationErrorReply } from "@/api/error/replies";
import type { FastifyAppInstanceOptions } from "@/api/types/app.types";
import { loginGoogleQueryParamsSchema } from "@/api/features/login/login.types";

import { generateSignedState } from "./util/sign";

export async function buildApp(
  fastify: FastifyInstance,
  opts: FastifyAppInstanceOptions,
) {
  fastify.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return createValidationErrorReply(reply, error.issues);
    }

    return reply.status(500).send(error);
  });

  await fastify.register(FastifyMultipart);

  fastify.setValidatorCompiler(zodValidatorCompiler);
  fastify.setSerializerCompiler(zodSerializerCompiler);

  // TODO: Uncomment when we get to plugins implementation
  // await fastify.register(AutoLoad, {
  //   dir: path.join(__dirname, "plugins"),
  // });

  if (!opts.testing) {
    await fastify.register(PrintRoutes);
  }

  if (opts.appEnv === "local") {
    await fastify.register(FastifyCors, {
      origin: true,
      allowedHeaders: ["Origin", "Content-Type"],
      credentials: true,
    });
  }

  const sessionSecret = Buffer.from(opts.env.SESSION_SECRET, "hex");

  await fastify.register(FastifySecureSession, {
    key: sessionSecret,
    cookieName: opts.env.SESSION_COOKIE_NAME,
    cookie: {
      httpOnly: true,
      path: "/",
      domain: opts.env.SESSION_COOKIE_DOMAIN,
      secure: opts.appEnv !== "local",
      sameSite: opts.appEnv === "local" ? "none" : "lax",
      maxAge: opts.env.SESSION_COOKIE_MAX_AGE,
    },
  });

  const redirectStateCookieName = "oauth2-redirect-state";

  await fastify.register(FastifyOauth2, {
    name: "googleOauth2",
    credentials: {
      client: {
        id: opts.env.GOOGLE_OAUTH_CLIENT_ID,
        secret: opts.env.GOOGLE_OAUTH_CLIENT_SECRET,
      },
      auth: FastifyOauth2.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: "/login/google",
    callbackUri: (req) => {
      const port = opts.appEnv === "local" ? `:${req.port}` : "";
      return `${req.protocol}://${req.hostname}${port}/login/google/callback`;
    },
    scope: ["email"],
    callbackUriParams: {
      access_type: "offline", // will tell Google to send a refreshToken too
      prompt: "consent", // will force the user to consent and send the refreshToken again
    },
    pkce: "S256",
    generateStateFunction(req) {
      const queryParsed = loginGoogleQueryParamsSchema.safeParse(req.query);
      return generateSignedState(
        queryParsed.success ? queryParsed.data : {},
        opts.env.GOOGLE_OAUTH_STATE_SECRET,
      );
    },
    checkStateFunction(req) {
      const query = req.query as Record<string, string>;
      const stateCookie = req.cookies[redirectStateCookieName];

      if (query.state !== stateCookie) {
        throw new Error("Invalid state");
      }

      return true;
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
    dir: path.join(__dirname, "features"),
    matchFilter: (path) => {
      return /\.route\.(t|j)s$/.test(path);
    },
    maxDepth: 2,
  });
}
