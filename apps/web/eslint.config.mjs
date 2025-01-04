import baseConfig, {
  generateTSLanguageOptions,
} from "../../eslint.config.base.mjs";

/** @type {import('typescript-eslint').ConfigArray} */
export default [
  ...baseConfig,
  generateTSLanguageOptions(),
  {
    ignores: [".react-router"],
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    },
  },
];
