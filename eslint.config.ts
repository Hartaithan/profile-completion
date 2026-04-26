import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import skipFormatting from "eslint-config-prettier/flat";
import pluginOxlint from "eslint-plugin-oxlint";
import pluginVue from "eslint-plugin-vue";
import { globalIgnores } from "eslint/config";

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },
  globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/coverage/**", "**/.local/**"]),
  ...pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  ...pluginOxlint.buildFromOxlintConfigFile(".oxlintrc.json"),
  skipFormatting,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "no-console": ["error", { allow: ["info", "error"] }],
      "vue/multi-word-component-names": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-restricted-imports": [
        "error",
        { patterns: [{ regex: "^\\.", message: "Use @ alias instead of relative import" }] },
      ],
    },
  },
  {
    files: ["src/ui/**"],
    rules: { "no-restricted-imports": "off" },
  },
);
