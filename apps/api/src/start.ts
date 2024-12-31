import path from "path";

import Fastify from "fastify";
import fp from "fastify-plugin";
import yargs from "yargs";

import { appEnvArgSchema, type AppEnv } from "@/api/types/app.types";
import { registerEnvPlugin } from "@/api/env/util";
import { buildApp } from "@/api/app";

const args = process.argv.slice(2);

const argv = yargs(args)
  .option({
    env: {
      type: "string",
      alias: "e",
      default: "local",
    },
  })
  .check((argv) => {
    if (!appEnvArgSchema.safeParse(argv.env).success) {
      throw new Error(`Invalid env argument: ${argv.env}`);
    }

    return true;
  }).argv;

async function main() {
  const app = Fastify({
    logger: true,
  });

  await registerEnvPlugin(app, {
    dotenv: {
      path: path.join(process.cwd(), `.env.${argv.env}`),
    },
  });

  const envs = app.getEnvs();

  await app.register(fp(buildApp), {
    env: envs,
    appEnv: argv.env as AppEnv,
  });

  app.listen(
    { port: envs.PORT ?? 5050, host: "0.0.0.0" },
    function (err, address) {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }

      console.log(`server listening on ${address}`);
    },
  );
}

void main();
