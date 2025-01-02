import path from "path";

import Fastify from "fastify";
import fp from "fastify-plugin";
import { getAppEnvArgs } from "@/toolkit/util";

import { registerEnvPlugin } from "@/api/env/util";
import { buildApp } from "@/api/app";

const argv = getAppEnvArgs();

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
    appEnv: argv.env,
  });

  app.listen(
    { port: envs.PORT ?? 5050, host: "api.sengor.local.ba" },
    function (err, address) {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }

      // eslint-disable-next-line no-console
      console.log(`server listening on ${address}`);
    },
  );
}

void main();
