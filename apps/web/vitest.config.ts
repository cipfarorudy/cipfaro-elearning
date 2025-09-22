import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./setupTests.ts"],
    include: ["app/__tests__/**/*.test.tsx"],
    globals: true,
    css: true,
    alias: {
      "@/": new URL("./", import.meta.url).pathname,
    },
  },
  esbuild: { jsx: "automatic" },
});
