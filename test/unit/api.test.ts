/**
 * The public API contract. These tests exist to protect people who already
 * depend on this package: an export that disappears, an argument that stops
 * being optional, or a default that quietly flips will fail here first.
 *
 * Adding an export is fine — add it to the list below. Removing or renaming
 * one is a breaking change, and this test is the reminder.
 */
import * as easyen from "../../src/index";
import { checkCoverage, checkSentences } from "../../src/index";
import { SAMPLE_WORDS } from "../fixtures/sample-words";

const EXPORTS = [
  "BUILTIN_DICTIONARIES",
  "IRREGULARS",
  "buildDictionary",
  "checkCoverage",
  "checkSentences",
  "combineDictionaries",
  "default",
  "expandContractions",
  "findInDictionary",
  "getDictionary",
  "isAllCapitals",
  "isCapitalized",
  "isNumber",
  "isNumberWord",
  "isSingleLetter",
  "listDictionaries",
  "normalizeApostrophes",
  "pipe",
  "possibleBaseForms",
  "splitCamelCase",
  "splitWords",
  "stripMarkdown",
];

describe("public exports", () => {
  test("nothing has gone missing", () => {
    expect(Object.keys(easyen).sort()).toEqual([...EXPORTS].sort());
  });

  test.each(EXPORTS.filter((name) => name !== "default"))("%s is defined", (name) => {
    expect(easyen[name as keyof typeof easyen]).toBeDefined();
  });

  test("the default export still runs a coverage check", () => {
    expect(typeof easyen.default.checkCoverage).toBe("function");
  });
});

describe("optional arguments stay optional", () => {
  test("checkCoverage works with just text and a dictionary", () => {
    expect(() => checkCoverage("I like the book", SAMPLE_WORDS)).not.toThrow();
  });

  test("checkCoverage accepts a built-in name", () => {
    expect(() => checkCoverage("I like the book", "everyday")).not.toThrow();
  });

  test("checkSentences works with just text", () => {
    expect(() => checkSentences("I like books.")).not.toThrow();
  });
});

describe("defaults are what they always were", () => {
  test("numbers are ignored unless you say otherwise", () => {
    const result = checkCoverage("I have 3 books", SAMPLE_WORDS);
    expect(result.hardWords).not.toContain("3");
    expect(checkCoverage("I have 3 books", SAMPLE_WORDS, { ignoreNumbers: false }).hardWords)
      .toContain("3");
  });

  test("proper nouns are counted unless you say otherwise", () => {
    expect(checkCoverage("I love Shakespeare", SAMPLE_WORDS).hardWords)
      .toContain("shakespeare");
    expect(
      checkCoverage("I love Shakespeare", SAMPLE_WORDS, { ignoreProperNouns: true }).hardWords
    ).not.toContain("shakespeare");
  });

  test("a long sentence is one over 30 words", () => {
    const thirty = Array(30).fill("word").join(" ");
    expect(checkSentences(`${thirty}.`).longSentences).toEqual([]);
    expect(checkSentences(`${thirty} more.`).longSentences).toHaveLength(1);
  });
});

describe("the result keeps every field callers read", () => {
  const result = checkCoverage("I like the book and a list", SAMPLE_WORDS);

  test.each(["total", "covered", "ratio", "hardWords", "hardWordCounts", "details"])(
    "%s is present",
    (field) => {
      expect(result).toHaveProperty(field);
    }
  );

  // The CLI stopped printing details in 2.0.0. The library never did.
  test("details is still returned by the library", () => {
    expect(Array.isArray(result.details)).toBe(true);
    expect(result.details.length).toBe(result.total);
  });

  test.each(["sentences", "wordsPerSentence", "longest", "longSentences"])(
    "sentence field %s is present",
    (field) => {
      expect(checkSentences("I like books.")).toHaveProperty(field);
    }
  );
});

describe("numbers stay in their documented range", () => {
  test("ratio is between 0 and 1", () => {
    for (const text of ["", "I like the book", "zzqq wwvv", "I like zzqq"]) {
      const { ratio } = checkCoverage(text, SAMPLE_WORDS);
      expect(ratio).toBeGreaterThanOrEqual(0);
      expect(ratio).toBeLessThanOrEqual(1);
    }
  });

  test("empty text gives zeroes, never NaN", () => {
    const result = checkCoverage("", SAMPLE_WORDS);
    expect(result.ratio).toBe(0);
    expect(result.total).toBe(0);
    expect(checkSentences("").wordsPerSentence).toBe(0);
  });
});
