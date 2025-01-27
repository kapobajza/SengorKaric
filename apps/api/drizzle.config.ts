/* eslint-disable @typescript-eslint/no-non-null-assertion */
import path from "path";

import { getAppEnvArgs, getRelativeMonoRepoPath } from "@/toolkit/util";
import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

const appEnv = getAppEnvArgs();
const apiPath = getRelativeMonoRepoPath("api");

dotenv.config({
  path: path.join(apiPath, `.env.${appEnv.env}`),
});

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST ?? "localhost",
    port: parseInt(`${process.env.DB_PORT ?? 5435}`, 10),
    ssl: false,
  },
});
