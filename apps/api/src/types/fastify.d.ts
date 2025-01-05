import type { FastifyAuthFunction } from "@fastify/auth";

import type { EnvRecord } from "@/api/env/util";
import type { SpeechService } from "@/api/services/speech.service";
import type { FastifyCustomProp } from "@/api/types/app.types";
import { AuthService } from "@/api/features/auth/auth.service";

declare module "fastify" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface FastifyInstance {
    getEnvs(): EnvRecord;
    [FastifyCustomProp.Service]: {
      speech: SpeechService;
      auth: AuthService;
    };
    [FastifyCustomProp.VerifyUserSession]: FastifyAuthFunction;
  }
}
