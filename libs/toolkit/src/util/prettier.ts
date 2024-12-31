import { spawnSync } from "child_process";

export const applyPrettier = (path: string) => {
  return spawnSync("npx", ["prettier", "--write", path], { stdio: "inherit" });
};
