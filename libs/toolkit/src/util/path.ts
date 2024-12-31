import { spawnSync } from "child_process";
import { ProjectName } from "@/toolkit/types/project.types";
import path from "path";

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
