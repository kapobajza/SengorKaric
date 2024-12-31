import { z } from "zod";

import type { EnvRecord } from "@/api/env/util";

export const appEnvArgSchema = z.union([
  z.literal("local"),
  z.literal("dev"),
  z.literal("prod"),
]);

export type AppEnv = z.infer<typeof appEnvArgSchema>;

export type FastifyAppInstanceOptions = {
  testing?: boolean;
  appEnv: AppEnv;
  env: EnvRecord;
};

export const FastifyCustomProp = {
  Service: "service",
} as const;
