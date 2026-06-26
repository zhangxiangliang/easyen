/**
 * Tests for the built-in dictionary registry and selecting one by name.
 */
import {
  checkCoverage,
  getDictionary,
  listDictionaries,
  combineDictionaries,
} from "../../src/index";

describe("listDictionaries", () => {
  test("includes every built-in name", () => {
    expect(listDictionaries()).toEqual(
      expect.arrayContaining(["everyday", "academic", "tech", "frameworks"])
    );
  });
});

describe("getDictionary", () => {
  test("everyday is the ~2800-word base list", () => {
    expect(getDictionary("everyday").length).toBeGreaterThan(2500);
  });

  test("everyday contains basic function words", () => {
    const everyday = getDictionary("everyday");
    for (const word of ["the", "a", "and", "to", "of"]) {
      expect(everyday).toContain(word);
    }
  });

  test("add-ons hold only their own words, not everyday's (no duplication)", () => {
    const everyday = new Set(getDictionary("everyday"));
    for (const name of ["academic", "tech", "frameworks"] as const) {
      const list = getDictionary(name);
      expect(new Set(list).size).toBe(list.length); // no internal duplicates
      const overlap = list.filter((w) => everyday.has(w));
      expect(overlap).toEqual([]); // disjoint from the base
    }
  });

  test("throws a clear error for an unknown name", () => {
    expect(() => getDictionary("does-not-exist")).toThrow(/Unknown dictionary/);
  });
});

describe("combineDictionaries", () => {
  test("combines a built-in name with a custom word list", () => {
    const merged = combineDictionaries("everyday", ["api", "endpoint"]);
    expect(merged.has("the")).toBe(true); // from everyday
    expect(merged.has("api")).toBe(true); // from custom list
    expect(merged.has("endpoint")).toBe(true);
  });

  test("lower-cases and trims, and de-duplicates across sources", () => {
    const merged = combineDictionaries(["  API ", "Api"], ["api"]);
    expect(merged.has("api")).toBe(true);
    expect(merged.size).toBe(1);
  });

  test("lets a caller allow domain words that were out-of-vocab", () => {
    const before = checkCoverage("the api endpoint", "everyday");
    expect(before.hardWords).toEqual(["api", "endpoint"]);

    const dict = combineDictionaries("everyday", ["api", "endpoint"]);
    const after = checkCoverage("the api endpoint", dict);
    expect(after.hardWords).toEqual([]);
    expect(after.ratio).toBe(1);
  });

  test("everyday + tech covers common engineering words", () => {
    const dict = combineDictionaries("everyday", "tech");
    const result = checkCoverage(
      "Deploy the api endpoint and validate the schema config.",
      dict
    );
    expect(result.hardWords).toEqual([]);
    expect(result.ratio).toBe(1);
  });

  test("the frameworks list holds tool / framework names", () => {
    const frameworks = new Set(getDictionary("frameworks"));
    for (const name of ["vue", "angular", "vite", "webpack", "eslint", "docker"]) {
      expect(frameworks.has(name)).toBe(true);
    }
  });

  test("everyday + frameworks covers a frontend-stack sentence", () => {
    const dict = combineDictionaries("everyday", "frameworks");
    const result = checkCoverage("We use vue with vite and webpack", dict);
    expect(result.hardWords).toEqual([]);
  });
});

describe("checkCoverage by dictionary name", () => {
  test("basic English is fully covered by everyday", () => {
    const result = checkCoverage(
      "The government decided to reduce the cost of the new policy.",
      "everyday"
    );
    expect(result.ratio).toBe(1);
    expect(result.hardWords).toEqual([]);
  });

  test("accepts a built-in name and equals passing the list directly", () => {
    const byName = checkCoverage("I like the book", "everyday");
    const byList = checkCoverage("I like the book", getDictionary("everyday"));
    expect(byName).toEqual(byList);
  });

  test("an unknown dictionary name throws", () => {
    expect(() => checkCoverage("hello", "nope" as never)).toThrow(
      /Unknown dictionary/
    );
  });
});
