// Copy the dictionary data (and its attribution) into dist so the built
// package can load it. tsc does not copy .json/.md files to the output folder,
// so we do it here.
//
// Usage: node scripts/copy-dictionaries.mjs  (runs automatically after build)

import { readdirSync, mkdirSync, copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const SRC = join(root, "src", "dictionaries");
const OUT = join(root, "dist", "dictionaries");

mkdirSync(OUT, { recursive: true });

// Ship the data (.json) and its attribution (.md) so CC BY-SA is respected.
let copied = 0;
for (const file of readdirSync(SRC)) {
  if (!file.endsWith(".json") && !file.endsWith(".md")) continue;
  copyFileSync(join(SRC, file), join(OUT, file));
  copied += 1;
}

console.log(`Copied ${copied} dictionary file(s) to ${OUT}`);
