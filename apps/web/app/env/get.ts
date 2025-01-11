import { isBrowser } from "@/web/lib/utils";
import type { Env } from "@/web/env/schema";

export function getEnv(): Env {
  if (isBrowser()) {
    return window.ENV;
  }

  return process.env as unknown as Env;
}

export function getEnvKey(key: keyof Env) {
  return getEnv()[key];
}
