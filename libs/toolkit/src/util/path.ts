import { spawnSync } from "child_process";
import path from "path";

import { ProjectName } from "@/toolkit/types/project.types";

export const getRootPath = () => {
  return spawnSync("git", ["rev-parse", "--show-toplevel"])
    .stdout.toString()
    .trim();
};

export const getRelativeMonoRepoPath = (projectPath: ProjectName) => {
  const projectPrefixPath: Record<ProjectName, "apps" | "libs"> = {
    api: "apps",
    toolkit: "libs",
    web: "apps",
  };

  return path.join(getRootPath(), projectPrefixPath[projectPath], projectPath);
};
