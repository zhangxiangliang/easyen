/**
 * Tests for the command-line surface: how flags are read, and what the tool
 * prints. Both are contracts a user can depend on, so they are pinned here.
 */
import { rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildReport, parseArgs, resolveDictSpec } from "../../src/cli";
import { checkCoverage, checkSentences } from "../../src/index";
import { SAMPLE_WORDS } from "../fixtures/sample-words";

describe("parseArgs", () => {
  test("defaults with no flags", () => {
    expect(parseArgs([])).toEqual({
      dict: "everyday",
      options: {},
      markdown: false,
      details: false,
      help: false,
    });
  });

  test.each<[string[], Partial<ReturnType<typeof parseArgs>>]>([
    [["-d", "tech"], { dict: "tech" }],
    [["--dict", "everyday,tech"], { dict: "everyday,tech" }],
    [["-f", "a.md"], { file: "a.md" }],
    [["--file", "a.md"], { file: "a.md" }],
    [["-m"], { markdown: true }],
    [["--markdown"], { markdown: true }],
    [["--details"], { details: true }],
    [["-h"], { help: true }],
    [["--help"], { help: true }],
  ])("%j", (argv, expected) => {
    expect(parseArgs(argv)).toMatchObject(expected);
  });

  test.each<[string[], object]>([
    [["--proper-nouns"], { ignoreProperNouns: true }],
    [["--count-numbers"], { ignoreNumbers: false }],
    [["--proper-nouns", "--count-numbers"], { ignoreProperNouns: true, ignoreNumbers: false }],
  ])("%j sets check options", (argv, expected) => {
    expect(parseArgs(argv).options).toEqual(expected);
  });

  test("flags combine, in any order", () => {
    expect(parseArgs(["--details", "-f", "a.md", "-m", "-d", "tech"])).toMatchObject({
      dict: "tech",
      file: "a.md",
      markdown: true,
      details: true,
    });
  });

  test("an unknown flag is ignored, not fatal", () => {
    expect(parseArgs(["--nope", "-m"])).toMatchObject({ markdown: true });
  });

  test("--dict with no value keeps the default", () => {
    expect(parseArgs(["--dict"]).dict).toBe("everyday");
  });
});

describe("buildReport", () => {
  const coverage = checkCoverage("I like the book and a list", SAMPLE_WORDS);
  const sentences = checkSentences("I like the book and a list");

  test("leaves details out by default", () => {
    const report = buildReport(coverage, sentences, false);
    expect(report).not.toHaveProperty("details");
    expect(Object.keys(report)).toEqual([
      "total",
      "covered",
      "ratio",
      "hardWords",
      "hardWordCounts",
      "sentences",
    ]);
  });

  test("adds details when asked", () => {
    const report = buildReport(coverage, sentences, true);
    expect(report.details).toEqual(coverage.details);
    expect(Object.keys(report)).toContain("details");
  });

  test("every other field is the same either way", () => {
    const { details, ...withoutDetails } = buildReport(coverage, sentences, true);
    expect(withoutDetails).toEqual(buildReport(coverage, sentences, false));
    expect(details).toBeDefined();
  });

  test("sentences always ride along", () => {
    expect(buildReport(coverage, sentences, false).sentences).toBe(sentences);
  });
});

describe("resolveDictSpec", () => {
  test("a single built-in name is passed through, so its cached Set is reused", () => {
    expect(resolveDictSpec("everyday")).toBe("everyday");
    expect(resolveDictSpec("tech")).toBe("tech");
  });

  test("several built-ins merge into one word set", () => {
    const merged = resolveDictSpec("everyday,tech");
    expect(merged).toBeInstanceOf(Set);
    expect((merged as Set<string>).has("api")).toBe(true); // from tech
    expect((merged as Set<string>).has("book")).toBe(true); // from everyday
  });

  test("spaces and empty items are forgiven", () => {
    const merged = resolveDictSpec(" everyday , , tech ");
    expect((merged as Set<string>).has("api")).toBe(true);
  });

  test("a word-list file joins the set", () => {
    const file = join(tmpdir(), "easyen-cli-test-terms.txt");
    writeFileSync(file, "zzqq\nwwvv\n");
    try {
      const merged = resolveDictSpec(`everyday,${file}`);
      expect((merged as Set<string>).has("zzqq")).toBe(true);
      expect((merged as Set<string>).has("the")).toBe(true);
    } finally {
      rmSync(file, { force: true });
    }
  });

  test("an unreadable path fails loudly", () => {
    expect(() => resolveDictSpec("everyday,./no-such-file.txt")).toThrow();
  });
});
