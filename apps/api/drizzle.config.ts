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
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DB!,
    host: process.env.POSTGRES_HOST ?? "localhost",
    port: parseInt(process.env.POSTGRES_PORT ?? "5435", 10),
    ssl: false,
  },
});
