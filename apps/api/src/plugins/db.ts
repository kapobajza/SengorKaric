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
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        host: env.DB_HOST,
        port: env.DB_PORT,
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
