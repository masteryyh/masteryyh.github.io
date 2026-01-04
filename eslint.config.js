import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores(["dist"]),
    {
        files: ["**/*.{js,mjs,cjs}"],
        extends: [js.configs.recommended],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            indent: ["error", 4, { SwitchCase: 1 }],
            quotes: ["error", "double", { avoidEscape: true }],
            semi: ["error", "always"],
        },
    },
    {
        files: ["**/*.{ts,tsx}"],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            globals: globals.browser,
        },
        rules: {
            // Enforce 4-space indentation across the project.
            // JSX indentation is intentionally ignored here to avoid false positives.
            indent: [
                "error",
                4,
                {
                    SwitchCase: 1,
                    ignoredNodes: [
                        "JSXElement",
                        "JSXElement *",
                        "JSXAttribute",
                        "JSXSpreadAttribute",
                        "JSXOpeningElement",
                        "JSXClosingElement",
                        "JSXFragment",
                        "JSXFragment *",
                    ],
                },
            ],
            quotes: ["error", "double", { avoidEscape: true }],
            semi: ["error", "always"],
            "jsx-quotes": ["error", "prefer-double"],
        },
    },
]);
