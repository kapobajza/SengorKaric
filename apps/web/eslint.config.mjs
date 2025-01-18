import pluginQuery from "@tanstack/eslint-plugin-query";

import baseConfig, {
  generateTSLanguageOptions,
} from "../../eslint.config.base.mjs";

/** @type {import('typescript-eslint').ConfigArray} */
export default [
  ...baseConfig,
  ...pluginQuery.configs["flat/recommended"],
  generateTSLanguageOptions(),
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    },
  },
  {
    ignores: ["**/.react-router/**"],
  },
];
