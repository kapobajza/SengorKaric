import type { FastifyAuthFunction } from "@fastify/auth";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import type { EnvRecord } from "@/api/env/util";
import type { SpeechService } from "@/api/services/speech.service";
import type { FastifyCustomProp } from "@/api/types/app.types";
import { AuthService } from "@/api/features/auth/auth.service";
import { DbSchema } from "@/api/db/types";

declare module "fastify" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface FastifyInstance {
    getEnvs(): EnvRecord;
    [FastifyCustomProp.Service]: {
      speech: SpeechService;
      auth: AuthService;
    };
    [FastifyCustomProp.VerifyUserSession]: FastifyAuthFunction;
    [FastifyCustomProp.Db]: NodePgDatabase<DbSchema> & {
      $client: Pool;
    };
    [FastifyCustomProp.IsCsrfProtected]: (
      state: string | undefined,
      queryState: string,
    ) => boolean;
  }
}
