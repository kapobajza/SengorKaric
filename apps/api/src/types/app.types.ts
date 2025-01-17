import { AppEnv } from "@/toolkit/util";

import type { EnvRecord } from "@/api/env/util";

export type FastifyAppInstanceOptions = {
  testing?: boolean;
  appEnv: AppEnv;
  env: EnvRecord;
};

export const FastifyCustomProp = {
  Service: "service",
  VerifyUserSession: "verifyUserSession",
  Db: "db",
  IsCsrfProtected: "isCsrfProtected",
} as const;
