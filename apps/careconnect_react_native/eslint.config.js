const js = require("@eslint/js");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const securityPlugin = require("eslint-plugin-security");
const globals = require("globals");

module.exports = [
  // Ignore first so ESLint doesn't try to lint generated folders/configured outputs
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/__tests__/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
      },
    },
  },

  {
    ignores: ["node_modules/**", "dist/**", "build/**"],
  },

  // Base JS recommended
  js.configs.recommended,
  {
    files: ["**/*.web.ts", "**/*.web.tsx"],
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
      },
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/__tests__/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.jest,
     },
    },
  },
  // ✅ Node/CommonJS config files (Babel/Metro/other *.config.js)
  {
    files: ["babel.config.js", "metro.config.js", "*.config.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
        process: "readonly",
      },
    },
    
    rules: {
      // optional: allow console in config files
      "no-console": "off",
    },
  },

  // TypeScript/React rules (only for TS/TSX)
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      security: securityPlugin,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...securityPlugin.configs.recommended.rules,

      // RN/Expo pragmatic tweaks
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "security/detect-object-injection": "off",
    },
  },
];
