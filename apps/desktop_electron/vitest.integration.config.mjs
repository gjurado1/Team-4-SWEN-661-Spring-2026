import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.integration.test.mjs"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage/integration",
      all: false,
      include: ["src/main/**/*.cjs"],
      exclude: ["renderer-dist/**", "scripts/**", "test/**"],
    },
  },
});
