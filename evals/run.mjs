/**
 * Measure the eval texts with easyen and write the results.
 *
 * Reads every file in results/raw/, pairs baseline with skill by task id, and
 * reports the two numbers easyen produces. No judging model, no scoring
 * rubric: the same text always gives the same answer, so anyone can re-run
 * this and get these exact numbers.
 *
 *   node evals/run.mjs
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Use the built package, the same code a user installs.
const { checkCoverage, checkSentences, stripMarkdown, combineDictionaries } =
  require(join(here, "..", "dist", "index.js"));

const config = JSON.parse(readFileSync(join(here, "tasks.json"), "utf8"));
const rawDir = join(here, "results", "raw");
const dictionary = combineDictionaries(...config.dict.split(","));

function measure(file) {
  const text = stripMarkdown(readFileSync(join(rawDir, file), "utf8"));
  const coverage = checkCoverage(text, dictionary);
  const sentences = checkSentences(text);
  return {
    words: coverage.total,
    ratio: coverage.ratio,
    hardWords: coverage.hardWords.length,
    wordsPerSentence: sentences.wordsPerSentence,
    longest: sentences.longest,
    longSentences: sentences.longSentences.length,
  };
}

const files = new Set(readdirSync(rawDir));
const rows = config.tasks.map(({ id }) => {
  const baseline = `${id}__baseline.md`;
  const skill = `${id}__skill.md`;
  if (!files.has(baseline) || !files.has(skill)) {
    throw new Error(`Missing raw text for task "${id}"`);
  }
  return { id, baseline: measure(baseline), skill: measure(skill) };
});

/** A win needs both numbers to move the right way; one is a partial result. */
function verdict({ baseline, skill }) {
  const easier = skill.ratio > baseline.ratio;
  const shorter = skill.wordsPerSentence < baseline.wordsPerSentence;
  if (easier && shorter) return "win";
  if (easier || shorter) return "partial";
  return "loss";
}

const sum = (rows, side, key) => rows.reduce((n, r) => n + r[side][key], 0);
const mean = (rows, side, key) => Math.round((sum(rows, side, key) / rows.length) * 100) / 100;

const totals = {
  tasks: rows.length,
  wins: rows.filter((r) => verdict(r) === "win").length,
  partial: rows.filter((r) => verdict(r) === "partial").length,
  losses: rows.filter((r) => verdict(r) === "loss").length,
  baseline: {
    ratio: mean(rows, "baseline", "ratio"),
    wordsPerSentence: mean(rows, "baseline", "wordsPerSentence"),
    hardWords: sum(rows, "baseline", "hardWords"),
    longSentences: sum(rows, "baseline", "longSentences"),
  },
  skill: {
    ratio: mean(rows, "skill", "ratio"),
    wordsPerSentence: mean(rows, "skill", "wordsPerSentence"),
    hardWords: sum(rows, "skill", "hardWords"),
    longSentences: sum(rows, "skill", "longSentences"),
  },
};

const results = {
  dict: config.dict,
  easyen: require(join(here, "..", "package.json")).version,
  totals,
  tasks: rows.map((r) => ({ ...r, verdict: verdict(r) })),
};

writeFileSync(
  join(here, "results", "results.json"),
  JSON.stringify(results, null, 2) + "\n"
);

const pct = (a, b) => `${a > b ? "+" : ""}${Math.round((a - b) * 100) / 100}`;
const lines = [
  `easyen ${results.easyen} · --dict ${config.dict}`,
  "",
  "| task | ratio (base -> skill) | words/sentence (base -> skill) | verdict |",
  "|---|---|---|---|",
  ...results.tasks.map(
    (r) =>
      `| ${r.id} | ${r.baseline.ratio} -> ${r.skill.ratio} (${pct(r.skill.ratio, r.baseline.ratio)}) ` +
      `| ${r.baseline.wordsPerSentence} -> ${r.skill.wordsPerSentence} (${pct(r.skill.wordsPerSentence, r.baseline.wordsPerSentence)}) ` +
      `| ${r.verdict} |`
  ),
  "",
  `mean ratio           ${totals.baseline.ratio} -> ${totals.skill.ratio}`,
  `mean words/sentence  ${totals.baseline.wordsPerSentence} -> ${totals.skill.wordsPerSentence}`,
  `hard words (total)   ${totals.baseline.hardWords} -> ${totals.skill.hardWords}`,
  `sentences over 30    ${totals.baseline.longSentences} -> ${totals.skill.longSentences}`,
  `wins ${totals.wins} · partial ${totals.partial} · losses ${totals.losses} (of ${totals.tasks})`,
];
console.log(lines.join("\n"));
