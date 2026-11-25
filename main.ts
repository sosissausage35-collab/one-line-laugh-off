// One-Line Laugh-Off — program/v1 entry.
//
// Writes exactly one original funny line to /output/entry.txt.
// Deterministic: no randomness, no clock, no network, no environment input.
// The same bytes are produced on every run.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const JOKE =
  "I asked an AI to write my wedding vows. It proposed to my fiancée instead — and she said yes before I finished reading them.";

const OUT_PATH = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Validation gate, mirroring the sealed scorer: UTF-8 text, 1-200
// characters, not only white space, a single line. Collects every
// violation instead of stopping at the first, so a bad line reports
// all of its problems at once.
function validateEntry(line: string): string[] {
  const problems: string[] = [];
  const chars = [...line];
  if (chars.length < MIN_CHARS || chars.length > MAX_CHARS) {
    problems.push(`entry is ${chars.length} characters, must be ${MIN_CHARS}-${MAX_CHARS}`);
  }
  if (line.trim().length === 0) {
    problems.push("entry is only white space");
  }
  if (line.includes("\n") || line.includes("\r")) {
    problems.push("entry must be a single line");
  }
  // Reject text that does not survive a UTF-8 round-trip (e.g. a lone
  // surrogate), which the scorer could not read as plain text.
  if (Buffer.from(line, "utf8").toString("utf8") !== line) {
    problems.push("entry is not valid UTF-8 text");
  }
  return problems;
}

const problems = validateEntry(JOKE);
if (problems.length > 0) {
  fail(problems.join("; "));
}

mkdirSync("/output", { recursive: true });
writeFileSync(OUT_PATH, JOKE, "utf8");

// Verify what landed on disk: re-read the file and confirm it is
// byte-identical to the validated line before reporting success.
const written = readFileSync(OUT_PATH, "utf8");
if (written !== JOKE) {
  fail("written entry does not match the validated line");
}

const chars = [...JOKE];
const bytes = Buffer.byteLength(JOKE, "utf8");
const sha256 = createHash("sha256").update(JOKE, "utf8").digest("hex");
console.log(`wrote ${OUT_PATH}: ${chars.length} characters, ${bytes} bytes, sha256 ${sha256}`);
