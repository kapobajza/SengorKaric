import baseConfig, {
  generateTSLanguageOptions,
} from "../../eslint.config.base.mjs";

/** @type {import('typescript-eslint').ConfigArray} */
export default [
  ...baseConfig,
  generateTSLanguageOptions(),
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  {
    rules: {
      "no-console": "off",
    },
  },
];
