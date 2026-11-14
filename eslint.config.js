import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["build", "node_modules", "coverage"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // React Compiler-oriented rules (new in eslint-plugin-react-hooks 7). The existing
      // code works correctly with these patterns; keep them visible as warnings to fix
      // incrementally rather than blocking CI.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // JSX usage isn't visible to core no-unused-vars without eslint-plugin-react;
      // allow capitalised identifiers (components) and React itself.
      "no-unused-vars": ["error", { varsIgnorePattern: "^(React|[A-Z])", argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["**/*.test.{js,jsx}", "src/setupTests.js", "vite.config.js", "eslint.config.js"],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ["scripts/**/*.cjs"],
    languageOptions: { sourceType: "commonjs", globals: { ...globals.node } },
  },
];
