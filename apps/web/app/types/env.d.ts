import { Env } from "@/web/env/schema";

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    ENV: Env;
  }
}
