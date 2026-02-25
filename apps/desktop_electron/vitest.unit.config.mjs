import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.mjs"],
    exclude: ["test/**/*.integration.test.mjs"],
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage/unit",
      all: false,
      include: ["src/main/**/*.cjs"],
      exclude: ["renderer-dist/**", "scripts/**", "test/**"],
    },
  },
});
