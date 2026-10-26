import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  // 1. Vyloučení složky node_modules z kontroly
  {
    ignores: ["node_modules/**"],
  },
  // 2. Základní doporučená pravidla ze zadání
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      // vlastní pravidla
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  // 3. Speciální nastavení pro Node.js skripty (řeší 'process')
  {
    files: ["scripts/**"],
    languageOptions: {
      globals: globals.node,
    },
  },
  prettierConfig,
);
