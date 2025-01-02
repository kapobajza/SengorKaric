import { z } from "zod";

export const ENV_PUBLIC_KEY_PREFIX = "PUBLIC_SK_";

export const envSchema = z.object({
  PUBLIC_SK_API_URL: z.string(),
} satisfies Record<`${typeof ENV_PUBLIC_KEY_PREFIX}${string}`, z.ZodTypeAny>);

export type Env = z.infer<typeof envSchema>;
