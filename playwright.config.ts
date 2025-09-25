import { defineConfig, devices } from "@playwright/test";

/**
 * Configuration des tests E2E avec Playwright
 * Tests des parcours utilisateur complets sur CIPFARO V2
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html"],
    ["json", { outputFile: "playwright-report/results.json" }],
    ["junit", { outputFile: "playwright-report/results.xml" }],
  ],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },

  // Note: Démarrez manuellement les services avec `pnpm dev` avant de lancer les tests
  // webServer: [],

  expect: {
    // Augmenter les timeouts pour les applications lentes
    timeout: 10000,
  },

  timeout: 30000,

  outputDir: "test-results/",
});
