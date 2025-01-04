const defaultConfig = require("../../.prettierrc");

/** @type {import('prettier').Config} */
module.exports = {
  ...defaultConfig,
  plugins: ["prettier-plugin-tailwindcss"],
};
