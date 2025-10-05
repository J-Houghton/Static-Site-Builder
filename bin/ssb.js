#!/usr/bin/env node
import { build } from "../src/build.js";
import fs from "node:fs";
import path from "node:path";

const [,, cmd, pagePath, ...rest] = process.argv;
const outIdx = rest.indexOf("--out");
const outDir = outIdx >= 0 ? rest[outIdx + 1] : "./dist";

if (cmd !== "build" || !pagePath) {
  console.error("Usage: ssb build <page.json> --out <dir>");
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
await build({
  pagePath: path.resolve(pagePath),
  layoutPath: path.resolve("./site/layout.json"),
  tokensPath: path.resolve("./theme/tokens.css"),
  themePath: path.resolve("./theme/theme.css"),
  outDir: path.resolve(outDir)
});
console.log(`Built ${outDir}/index.html`);
