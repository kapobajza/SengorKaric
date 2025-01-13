import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import eslintConfigPrettier from "eslint-config-prettier";
import unusedImports from "eslint-plugin-unused-imports";

const __dirname = new URL(".", import.meta.url).pathname;

export const generateTSLanguageOptions = () => ({
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: __dirname,
    },
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
  },
});

export default tseslint.config(
  {
    files: ["**/*.{ts,tsx}"],
    extends: [tseslint.configs.strictTypeChecked],
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/only-throw-error": "off",
      "@typescript-eslint/return-await": ["off"],
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
    },
    settings: {
      react: {
        version: "detect",
      },
      formComponents: ["Form"],
      linkComponents: [
        { name: "Link", linkAttribute: "to" },
        { name: "NavLink", linkAttribute: "to" },
      ],
    },
    rules: {
      "react/display-name": "error",
      "react/jsx-no-leaked-render": "error",
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
    },
    settings: {
      react: {
        version: "detect",
      },
      formComponents: ["Form"],
      linkComponents: [
        { name: "Link", linkAttribute: "to" },
        { name: "NavLink", linkAttribute: "to" },
      ],
    },
    rules: {
      "react/display-name": "error",
      "react/jsx-no-leaked-render": "error",
    },
  },
  eslintConfigPrettier,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    extends: [importPlugin.flatConfigs.recommended],
    rules: {
      "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-nested-ternary": "error",
      "no-void": ["error", { allowAsStatement: true }],
      "no-else-return": [
        "error",
        {
          allowElseIf: false,
        },
      ],
      "no-console": "error",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "import/order": [
        "error",
        {
          pathGroups: [
            {
              // Minimatch pattern used to match against specifiers
              pattern: "@/**",
              // The predefined group this PathGroup is defined in relation to
              group: "external",
              // How matching imports will be positioned relative to "group"
              position: "after",
            },
          ],
          groups: [
            // Imports of builtins are first
            "builtin",
            "external",
            // Then index file imports
            "index",
            // Then any arcane TypeScript imports
            "object",
            // Then sibling and parent imports. They can be mingled together
            ["sibling", "parent"],
            // Then the omitted imports: internal, type, unknown
          ],
          "newlines-between": "always",
        },
      ],
      "@typescript-eslint/no-unnecessary-type-parameters": "off",
      "no-else-return": ["error", { allowElseIf: false }],
    },
    plugins: {
      "unused-imports": unusedImports,
    },
  },
);
