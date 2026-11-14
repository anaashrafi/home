import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
  },
  build: {
    // Keep CRA's output folder so the gh-pages deploy and CI steps stay unchanged.
    outDir: "build",
    sourcemap: false,
    target: "es2022",
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.js"],
    css: false,
  },
});
