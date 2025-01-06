import { EnvRecord } from "@/api/env/util";

export function generatePostgressConnectionUri(env: EnvRecord) {
  return `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`;
}
