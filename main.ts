// One-Line Laugh-Off — program/v1 entry.
//
// Writes exactly one original funny line to /output/entry.txt.
// Deterministic: no randomness, no clock, no network, no environment input.
// The same bytes are produced on every run.
import { mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const JOKE =
  "I asked an AI to write my wedding vows. It proposed to my fiancée instead — and she said yes before I finished reading them.";

const OUT_PATH = "/output/entry.txt";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Gate checks, mirroring the sealed scorer: UTF-8 text, 1-200 characters,
// not only white space, a single line.
const chars = [...JOKE];
if (chars.length < 1 || chars.length > 200) {
  fail(`entry is ${chars.length} characters, must be 1-200`);
}
if (JOKE.trim().length === 0) {
  fail("entry is only white space");
}
if (JOKE.includes("\n") || JOKE.includes("\r")) {
  fail("entry must be a single line");
}

mkdirSync("/output", { recursive: true });
writeFileSync(OUT_PATH, JOKE, "utf8");

const bytes = Buffer.byteLength(JOKE, "utf8");
const sha256 = createHash("sha256").update(JOKE, "utf8").digest("hex");
console.log(`wrote ${OUT_PATH}: ${chars.length} characters, ${bytes} bytes, sha256 ${sha256}`);
