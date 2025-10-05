// client/vite.config.js
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(fileURLToPath(new URL(import.meta.url)));
const repoRoot = path.resolve(rootDir, "..");

export default defineConfig({
  root: rootDir,
  // Root is the folder containing this config (client/)
  server: {
    port: 5173,
    open: true,
    fs: { allow: [repoRoot] },
  },
  build: { outDir: "dist", emptyOutDir: true },
  preview: {
    port: 4173,
    open: true,
    fs: { allow: [repoRoot] },
  },
});
