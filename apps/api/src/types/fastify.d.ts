import type { EnvRecord } from "@/api/env/util";
import type { SpeechService } from "@/api/services/speech.service";
import type { FastifyCustomProp } from "@/api/types/app.types";

declare module "fastify" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface FastifyInstance {
    getEnvs(): EnvRecord;
    [FastifyCustomProp.Service]: {
      speech: SpeechService;
    };
  }
}
