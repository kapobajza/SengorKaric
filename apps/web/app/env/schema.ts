import { z } from "zod";

export const ENV_PUBLIC_KEY_PREFIX = "PUBLIC_SK_";

type EnvSchemaRecod = Record<
  `${typeof ENV_PUBLIC_KEY_PREFIX | "PRIVATE_SK_"}${string}`,
  z.ZodTypeAny
>;

export const publicEnvSchema = z.object({
  PUBLIC_SK_API_URL: z.string(),
} satisfies EnvSchemaRecod);

export const envSchema = publicEnvSchema.extend({
  PRIVATE_SK_SESSION_COOKIE_NAME: z.string(),
} satisfies EnvSchemaRecod);

export type Env = z.infer<typeof envSchema>;
