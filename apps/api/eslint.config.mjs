import baseConfig, {
  generateTSLanguageOptions,
} from "../../eslint.config.base.mjs";

/** @type {import('typescript-eslint').ConfigArray} */
export default [
  ...baseConfig,
  generateTSLanguageOptions(),
  {
    rules: {
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
];
