const { spawnSync } = require("child_process");

/**
 * @typedef {import("child_process").SpawnSyncReturns<T>} SpawnSyncReturns<T>
 * @param  {[string, string[], import("child_process").SpawnSyncOptionsWithBufferEncoding]} args
 * @returns {SpawnSyncReturns & { isError: boolean }}
 */
module.exports.executeCmd = (...args) => {
  const res = spawnSync(...args);
  const { stderr, stdout, status } = res;
  const error = stderr?.toString().trim();
  const isError = error || status !== 0;

  if (isError) {
    console.error(error);
    process.exit(status ?? 1);
  }

  const out = stdout?.toString().trim();

  if (out) {
    console.log(out);
  }

  return res;
};
