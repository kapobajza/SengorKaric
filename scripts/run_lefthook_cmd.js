const yargs = require("yargs");
const { minimatch } = require("minimatch");
const { spawnSync } = require("child_process");
const path = require("path");
const { executeCmd } = require("./util");

const args = process.argv.slice(2);

const argv = yargs(args)
  .option({
    files: {
      type: "string",
      demandOption: true,
    },
    cmd: {
      type: "string",
      demandOption: true,
    },
    args: {
      type: "string",
    },
  })
  .parse();

const res = executeCmd(argv.cmd, argv.args ? argv.args.split(" ") : [], {
  stdio: "inherit",
});

if (!res.isError) {
  executeCmd("git", ["add", ...argv.files.split(" ")], {
    stdio: "inherit",
  });
}
