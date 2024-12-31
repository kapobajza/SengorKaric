import fs from "fs";
import path from "path";

import yaml from "yaml";

import { getRootPath, strToPascalCase, applyPrettier } from "@/toolkit/util";

function generateProjectNameTypes() {
  const rootPath = getRootPath();

  const pnpmWorkspace = yaml.parse(
    fs.readFileSync(path.join(rootPath, "pnpm-workspace.yaml"), "utf-8"),
  ) as {
    packages: string[];
  };

  const projectNames: string[] = [];

  for (const packageName of pnpmWorkspace.packages) {
    const directories = fs.readdirSync(
      path.join(rootPath, packageName.replace("/*", "")),
    );

    projectNames.push(...directories);
  }

  const destinationPath = path.join(
    rootPath,
    "libs/toolkit/src/types/project.types.ts",
  );

  fs.writeFileSync(
    destinationPath,
    `// This file is auto-generated, you shouldn't modify it manually\n\n
    export type ProjectName = ${projectNames.map((name) => `'${name}'`).join(" | ")};

    export const ProjectNameEnum = {
      ${projectNames.map((name) => `${strToPascalCase(name)}: '${name}',`).join(`\n`)}
    } as const;
    `,
  );
  applyPrettier(destinationPath);
  console.log(`Generated project.types.ts in ${destinationPath}`);
}

generateProjectNameTypes();
