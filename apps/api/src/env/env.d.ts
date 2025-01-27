import { EnvRecord } from "./util";

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends Partial<EnvRecord> {}
  }
}
