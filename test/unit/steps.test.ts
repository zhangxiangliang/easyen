/**
 * Unit tests for the small, pure steps. Every block is table-driven: each
 * case is just a row of `[input, expected]` data, run through one function.
 * To add a case, add a row — no new test body needed.
 */
import {
  buildDictionary,
  expandContractions,
  findInDictionary,
  isAllCapitals,
  isCapitalized,
  isNumber,
  isNumberWord,
  isSingleLetter,
  normalizeApostrophes,
  possibleBaseForms,
  splitCamelCase,
  splitWords,
} from "../../src/index";
import { SAMPLE_WORDS } from "../fixtures/sample-words";

describe("normalizeApostrophes", () => {
  test.each<[string, string]>([
    ["don’t", "don't"],
    ["they’re", "they're"],
    ["plain text", "plain text"],
  ])("%s -> %s", (input, expected) => {
    expect(normalizeApostrophes(input)).toBe(expected);
  });
});

describe("expandContractions", () => {
  test.each<[string, string]>([
    ["don't", "do not"],
    ["isn't", "is not"],
    ["couldn't", "could not"],
    ["won't", "will not"],
    ["can't", "can not"],
    ["shan't", "shall not"],
    ["they're", "they are"],
    ["I've", "I have"],
    ["we'll", "we will"],
    ["I'm", "I am"],
    ["I'd", "I"], // ambiguous had/would -> dropped
    ["it's", "it"], // is/possessive -> dropped
    ["child's", "child"], // possessive -> dropped
    ["no contraction here", "no contraction here"],
  ])("%s -> %s", (input, expected) => {
    expect(expandContractions(input)).toBe(expected);
  });
});

describe("splitWords", () => {
  test.each<[string, string[]]>([
    ["Hi, well-known 3.14 cats!", ["Hi", "well", "known", "3.14", "cats"]],
    ["Tom runs", ["Tom", "runs"]], // original case kept
    ["1,000 dollars", ["1,000", "dollars"]],
    ["", []],
    ["...", []],
  ])("%j -> %j", (input, expected) => {
    expect(splitWords(input)).toEqual(expected);
  });
});

describe("splitCamelCase", () => {
  test.each<[string, string[]]>([
    ["getUserById", ["get", "User", "By", "Id"]],
    ["backgroundColor", ["background", "Color"]],
    ["HTTPServer", ["HTTP", "Server"]],
    ["bulkCancel", ["bulk", "Cancel"]],
    ["api", ["api"]], // all lower-case — unchanged
    ["AWS", ["AWS"]], // all upper-case — unchanged
    ["Tom", ["Tom"]], // single leading capital — unchanged
    ["word", ["word"]],
  ])("%s -> %j", (input, expected) => {
    expect(splitCamelCase(input)).toEqual(expected);
  });
});

describe("isNumber", () => {
  test.each<[string, boolean]>([
    ["3", true],
    ["3.14", true],
    ["1,000", true],
    ["cat", false],
    ["3rd", true], // starts with a digit
  ])("%s -> %s", (input, expected) => {
    expect(isNumber(input)).toBe(expected);
  });
});

describe("isCapitalized", () => {
  test.each<[string, boolean]>([
    ["Tom", true],
    ["tom", false],
    ["3", false],
  ])("%s -> %s", (input, expected) => {
    expect(isCapitalized(input)).toBe(expected);
  });
});

describe("isSingleLetter", () => {
  test.each<[string, boolean]>([
    ["b", true],
    ["e", true],
    ["x", true],
    ["a", false], // a real word
    ["i", false], // a real word
    ["I", false],
    ["go", false],
  ])("%s -> %s", (input, expected) => {
    expect(isSingleLetter(input)).toBe(expected);
  });
});

describe("isNumberWord", () => {
  test.each<[string, boolean]>([
    ["two", true],
    ["zero", true],
    ["Hundred", true],
    ["thousand", true],
    ["book", false],
    ["once", false],
  ])("%s -> %s", (input, expected) => {
    expect(isNumberWord(input)).toBe(expected);
  });
});

describe("isAllCapitals", () => {
  test.each<[string, boolean]>([
    ["AWS", true],
    ["JSON", true],
    ["SEO", true],
    ["Tom", false], // only first letter capitalised
    ["api", false], // lower-case
    ["A", false], // single letter
  ])("%s -> %s", (input, expected) => {
    expect(isAllCapitals(input)).toBe(expected);
  });
});

describe("possibleBaseForms offers the base form", () => {
  // Covers every inflection rule: -s/-es/-ies/-ves, -ed/-ied, -ing,
  // -er/-est/-ier/-iest, -ly/-ily, doubled consonants, and irregulars.
  test.each<[string, string]>([
    ["cats", "cat"],
    ["boxes", "box"],
    ["houses", "house"],
    ["studies", "study"],
    ["wolves", "wolf"],
    ["knives", "knife"],
    ["walked", "walk"],
    ["liked", "like"],
    ["stopped", "stop"],
    ["studied", "study"],
    ["walking", "walk"],
    ["making", "make"],
    ["running", "run"],
    ["taller", "tall"],
    ["bigger", "big"],
    ["happier", "happy"],
    ["tallest", "tall"],
    ["biggest", "big"],
    ["happiest", "happy"],
    ["quickly", "quick"],
    ["happily", "happy"],
    ["went", "go"], // irregular verb
    ["children", "child"], // irregular plural
    ["an", "a"], // irregular function word
    ["them", "they"],
    ["these", "this"],
    ["those", "that"],
    ["us", "we"],
  ])("%s -> contains %s", (word, base) => {
    expect(possibleBaseForms(word)).toContain(base);
  });

  test("always lists the word itself first (deterministic order)", () => {
    expect(possibleBaseForms("studies")[0]).toBe("studies");
    expect(possibleBaseForms("studies")).toEqual(possibleBaseForms("studies"));
  });
});

describe("findInDictionary", () => {
  const dict = buildDictionary(SAMPLE_WORDS);

  test.each<[string, string | null]>([
    ["book", "book"], // exact
    ["studies", "study"], // regular inflection
    ["went", "go"], // irregular
    ["children", "child"], // irregular plural
    ["serendipitous", null], // unknown
    ["xyz", null],
  ])("%s -> %s", (word, expected) => {
    expect(findInDictionary(word, dict)).toBe(expected);
  });
});

describe("buildDictionary", () => {
  test("lower-cases and trims entries", () => {
    const dict = buildDictionary([" Hello ", "WORLD", "", "  "]);
    expect(dict.has("hello")).toBe(true);
    expect(dict.has("world")).toBe(true);
    expect(dict.has("")).toBe(false);
    expect(dict.size).toBe(2);
  });
});
