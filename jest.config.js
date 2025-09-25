/** @type {import('jest').Config} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/apps", "<rootDir>/packages", "<rootDir>/tests"],
  testMatch: ["**/__tests__/**/*.{ts,tsx}", "**/?(*.)+(spec|test).{ts,tsx}"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        useESM: false,
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@cipfaro/scorm-runtime$": "<rootDir>/packages/scorm-runtime/src",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/jest-dom.d.ts"],
  collectCoverageFrom: [
    "apps/**/*.{ts,tsx}",
    "packages/**/*.{ts,tsx}",
    "!apps/**/*.d.ts",
    "!apps/**/node_modules/**",
    "!apps/**/dist/**",
    "!packages/**/node_modules/**",
    "!packages/**/dist/**",
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "lcov", "html"],
  verbose: true,
  projects: [
    {
      displayName: "API Tests",
      testEnvironment: "node",
      testMatch: ["<rootDir>/apps/api/**/*.{test,spec}.{ts,tsx}"],
      setupFilesAfterEnv: ["<rootDir>/tests/setup/api.setup.ts"],
    },
    {
      displayName: "Web Tests",
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/apps/web/**/*.{test,spec}.{ts,tsx}"],
      setupFilesAfterEnv: ["<rootDir>/tests/setup/web.setup.ts"],
    },
  ],
};
