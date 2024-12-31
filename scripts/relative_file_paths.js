const yargs = require("yargs");
const { minimatch } = require("minimatch");
const { spawnSync } = require("child_process");

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

console.log(filteredFiles.join(" "));
