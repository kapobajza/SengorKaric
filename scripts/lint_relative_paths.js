const yargs = require("yargs");
const { minimatch } = require("minimatch");
const { spawnSync } = require("child_process");
const path = require("path");

const args = process.argv.slice(2);

const argv = yargs(args)
  .option({
    path: {
      type: "string",
      alias: "p",
      demandOption: true,
    },
  })
  .parse();

const filesSpawn = spawnSync(
  "git",
  ["diff", "--name-only", "--staged", "--diff-filter", "ACMRT"],
  {
    encoding: "utf8",
  },
);

if (filesSpawn.status !== 0) {
  throw new Error("Failed to get modified files", filesSpawn.stderr);
}

const files = filesSpawn.stdout.trim().split("\n");

const filteredFiles = files
  .filter((path) => minimatch(path, `${argv.path}/**/*.{js,ts,jsx,tsx}`))
  .map((file) => file.replace(`${argv.path}/`, ""));

if (filteredFiles.length === 0) {
  return process.exit(0);
}

const { stderr, stdout } = spawnSync(
  "npx",
  ["eslint", ...filteredFiles, "--fix"],
  {
    cwd: path.join(process.cwd(), argv.path),
  },
);

const error = stderr?.toString().trim();

if (error) {
  console.error(error);
  process.exit(1);
}

const out = stdout?.toString().trim();

if (out) {
  console.log(out);
}
