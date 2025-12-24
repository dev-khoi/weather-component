import { defineConfig, devices } from "@playwright/test";
import path from "path";
const authFile = path.join(__dirname, "playwright/.auth/user.json");
export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: "tests",

  // Run all tests in parallel.
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only.
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: "html",

  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: "http://localhost:4173/",

    // Collect trace when retrying the failed test.
    trace: "on-first-retry",
    permissions: ["geolocation"],

    geolocation: { longitude: 12.492507, latitude: 41.889938 },
  },
  // Configure projects for major browsers.
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },

    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], storageState: authFile },
      dependencies: ["setup"],
    },
  ],
  // Run your local dev server before starting the tests.
  // webServer: {
  //   command: "docker compose up",
  //   url: "http://localhost:4173/",
  //   reuseExistingServer: !process.env.CI,
  //   stdout: "pipe",
  //   stderr: "pipe",
  //   cwd: "./frontend",
  // },
});
