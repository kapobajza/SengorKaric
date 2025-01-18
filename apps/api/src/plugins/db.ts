import fp from "fastify-plugin";
import { drizzle } from "drizzle-orm/node-postgres";

import { DbSchema } from "@/api/db/types";

import { FastifyCustomProp } from "../types/app.types";

export default fp((fastify, _opts, done) => {
  const env = fastify.getEnvs();

  fastify.decorate(
    FastifyCustomProp.Db,
    drizzle<DbSchema>({
      connection: {
        user: env.POSTGRES_USER,
        password: env.POSTGRES_PASSWORD,
        database: env.POSTGRES_DB,
        host: env.POSTGRES_HOST,
        port: env.POSTGRES_PORT,
        ssl: false,
      },
      logger: {
        logQuery(query, params) {
          fastify.log.info(">>> DB Query ", query, params);
        },
      },
    }),
  );

  done();
});
