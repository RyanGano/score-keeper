/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 3000, open: true },
  // Azure Static Web Apps deploys `output_location: "build"` — keep CRA's directory.
  build: { outDir: "build" },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setup-tests.ts",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // The repo has no tests yet; don't fail CI until some exist.
    passWithNoTests: true,
  },
});
