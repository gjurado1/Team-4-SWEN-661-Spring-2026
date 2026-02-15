/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  testMatch: ["**/?(*.)+(test).[tj]s?(x)"],
  testPathIgnorePatterns: ["<rootDir>/e2e/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/types.ts",
    "!src/**/navigation/types.ts",
  ],
  coverageReporters: ["text", "lcov"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
