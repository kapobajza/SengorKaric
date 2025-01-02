import { isBrowser } from "@/web/util/util";
import { Env } from "@/web/env/schema";

export function getEnv(): Env {
  if (isBrowser()) {
    return (window as Window).ENV;
  }

  return process.env as unknown as Env;
}
