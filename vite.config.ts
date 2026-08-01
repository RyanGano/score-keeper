import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 3000, open: true },
  // Azure Static Web Apps deploys `output_location: "build"` — keep CRA's directory.
  build: { outDir: "build" },
});
