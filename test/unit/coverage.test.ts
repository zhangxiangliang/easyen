/**
 * End-to-end tests for `checkCoverage`. Each scenario is one data row:
 * { text, options, expected }. Because every step is deterministic, the
 * expected total / covered / ratio / hardWords are exact, not approximate.
 */
import {
  buildDictionary,
  checkCoverage,
  CheckOptions,
  CoverageResult,
} from "../../src/index";
import { SAMPLE_WORDS } from "../fixtures/sample-words";

const dict = buildDictionary(SAMPLE_WORDS);

interface Scenario {
  name: string;
  text: string;
  options?: CheckOptions;
  expected: Pick<CoverageResult, "total" | "covered" | "ratio" | "hardWords">;
}

const scenarios: Scenario[] = [
  {
    name: "exact base words are fully covered",
    text: "I like the book",
    expected: { total: 4, covered: 4, ratio: 1, hardWords: [] },
  },
  {
    name: "inflected forms map back to their base form",
    text: "She studies books and likes walking",
    expected: { total: 6, covered: 6, ratio: 1, hardWords: [] },
  },
  {
    name: "contractions are expanded then matched",
    text: "They don't know, they're good, I can't go",
    expected: { total: 11, covered: 11, ratio: 1, hardWords: [] },
  },
  {
    name: "possessive 's is stripped",
    text: "the child's book",
    expected: { total: 3, covered: 3, ratio: 1, hardWords: [] },
  },
  {
    name: "unknown words land in hardWords, sorted",
    text: "The serendipitous discovery",
    expected: {
      total: 3,
      covered: 1,
      ratio: 1 / 3,
      hardWords: ["discovery", "serendipitous"],
    },
  },
  {
    name: "numbers are ignored by default",
    text: "I have 3 books and 100 friends",
    expected: { total: 5, covered: 5, ratio: 1, hardWords: [] },
  },
  {
    name: "spelled number words are ignored like digits",
    text: "I have two books and three friends",
    expected: { total: 5, covered: 5, ratio: 1, hardWords: [] },
  },
  {
    name: "stray single letters (from e.g., variables) are not counted",
    text: "the book e g and a list b c",
    // e, g, b, c dropped; counted: the, book, and, a, list. "list" not in sample.
    expected: { total: 5, covered: 4, ratio: 4 / 5, hardWords: ["list"] },
  },
  {
    name: "numbers are counted when ignoreNumbers is false",
    text: "I have 3 books",
    options: { ignoreNumbers: false },
    expected: { total: 4, covered: 3, ratio: 3 / 4, hardWords: ["3"] },
  },
  {
    name: "proper noun stays in hardWords by default",
    text: "I love Shakespeare",
    expected: { total: 3, covered: 2, ratio: 2 / 3, hardWords: ["shakespeare"] },
  },
  {
    name: "proper noun is dropped when ignoreProperNouns is true",
    text: "I love Shakespeare",
    options: { ignoreProperNouns: true },
    expected: { total: 2, covered: 2, ratio: 1, hardWords: [] },
  },
  {
    name: "empty text gives ratio 0, not NaN",
    text: "   ...  ",
    expected: { total: 0, covered: 0, ratio: 0, hardWords: [] },
  },
];

describe("checkCoverage", () => {
  test.each(scenarios)("$name", ({ text, options, expected }) => {
    expect(checkCoverage(text, dict, options)).toMatchObject(expected);
  });

  test("accepts a raw word list as well as a prebuilt Set", () => {
    const fromList = checkCoverage("I like the book", SAMPLE_WORDS);
    const fromSet = checkCoverage("I like the book", dict);
    expect(fromList).toEqual(fromSet);
  });

  test("details keep reading order and record the matched base form", () => {
    const result = checkCoverage("She studies", dict);
    expect(result.details).toEqual([
      { word: "she", known: true, base: "she" },
      { word: "studies", known: true, base: "study" },
    ]);
  });

  test("hardWordCounts lists unknown words most-frequent first", () => {
    const result = checkCoverage("zzz zzz qqq", dict);
    expect(result.hardWordCounts).toEqual([
      { word: "zzz", count: 2 },
      { word: "qqq", count: 1 },
    ]);
    expect(result.hardWords).toEqual(["qqq", "zzz"]); // still sorted A–Z
  });

  test("unknown all-caps acronyms are not counted", () => {
    const result = checkCoverage("The AWS and JSON setup", dict);
    // AWS / JSON dropped as acronyms; setup not in sample dict.
    expect(result.hardWords).toEqual(["setup"]);
    expect(result.total).toBe(3); // the, and, setup
  });

  test("camelCase identifiers are split into parts, not one hard word", () => {
    // "openHouse" -> open / House; both are in the sample dict.
    const result = checkCoverage("Use openHouse", dict);
    expect(result.hardWords).toEqual([]); // not "openhouse"
    expect(result.details.map((d) => d.word)).toEqual(["use", "open", "house"]);
  });
});
