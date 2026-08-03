import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    ignores: [
      "node_modules",
      "dist",
      "build",
      "coverage"
    ],

    files: ["src/**/*.ts"],

    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },

    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-explicit-any": "warn",

      "@typescript-eslint/no-require-imports": "off",

      "no-console": "off",

      "prefer-const": "warn",

      "no-debugger": "warn",
    },
  }
);