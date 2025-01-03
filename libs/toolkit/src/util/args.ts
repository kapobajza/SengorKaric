import yargs from "yargs";
import { z } from "zod";

export const appEnvArgSchema = z.union([
  z.literal("local"),
  z.literal("dev"),
  z.literal("prod"),
]);

export type AppEnv = z.infer<typeof appEnvArgSchema>;

export function getAppEnvArgs() {
  const args = process.argv.slice(2);

  const argv = yargs(args)
    .option({
      env: {
        type: "string",
        alias: "e",
        default: "local",
      },
    })
    .check((argv) => {
      if (!appEnvArgSchema.safeParse(argv.env).success) {
        throw new Error(`Invalid env argument: ${argv.env}`);
      }

      return true;
    }).argv;

  return {
    ...argv,
    env: argv.env as AppEnv,
  };
}
