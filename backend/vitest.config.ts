// vite.config.ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    coverage: {
      reporter: ["text", "json-summary"],
    },
    includeSource: ["src/**/*.{js,ts}"],
  },
});
