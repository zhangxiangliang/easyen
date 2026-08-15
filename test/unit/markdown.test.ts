/**
 * Tests for the Markdown stripper. The rule it follows: markup, code and URLs
 * go; every word a reader would read stays.
 */
import { checkCoverage, stripMarkdown } from "../../src/index";
import { SAMPLE_WORDS } from "../fixtures/sample-words";

const words = (md: string) => stripMarkdown(md).split(/\s+/).filter(Boolean);

describe("stripMarkdown removes", () => {
  test.each([
    ["fenced code", "keep this\n```js\nconst x = 1;\n```\nand this", "const"],
    ["tilde-fenced code", "keep\n~~~\nconst x = 1;\n~~~\nthis", "const"],
    ["an unclosed fence", "keep this\n```\nconst x = 1;", "const"],
    ["inline code", "run `npm install easyen` now", "npm"],
    ["a double-backtick span", "use ``a ` b`` here", "b"],
    ["html tags", '<div align="center">text</div>', "align"],
    ["html comments", "text <!-- a hidden note --> here", "hidden"],
    ["a link target", "see [the docs](https://example.com/a/b)", "example"],
    ["a bare url", "see https://img.shields.io/npm/v.svg here", "svg"],
    ["a www url", "see www.npmjs.com/package/easyen here", "npmjs"],
    ["a link reference definition", "text\n[id]: https://example.com\n", "example"],
    ["an image target", "![npm](https://img.shields.io/npm/v.svg)", "shields"],
    ["a footnote marker", "a claim[^1] here", "1"],
    ["a table rule row", "| a | b |\n|---|---|\n| c | d |", "---"],
  ])("%s", (_name, md, gone) => {
    expect(words(md)).not.toContain(gone);
  });
});

describe("stripMarkdown keeps", () => {
  test.each([
    ["heading text", "## How to use", "use"],
    ["link text", "see [the docs](https://example.com)", "docs"],
    ["image alt text", "![the logo](https://example.com/l.png)", "logo"],
    ["list item text", "- first point\n* second\n1. third", "point"],
    ["table cell text", "| name | what it does |\n|---|---|\n| a | reads files |", "reads"],
    ["block quote text", "> a quoted line", "quoted"],
    ["emphasised words", "**bold** and _quiet_ and ~~gone~~", "bold"],
    ["text around code", "keep this\n```\ncode\n```\nand this", "this"],
  ])("%s", (_name, md, kept) => {
    expect(words(md)).toContain(kept);
  });
});

test("frontmatter is dropped, the body is not", () => {
  const out = words("---\nname: easyen\n---\n\nthe body text");
  expect(out).not.toContain("name:");
  expect(out).toContain("body");
});

test("emphasis markers go without splitting the word", () => {
  expect(stripMarkdown("**word**")).toBe("word");
  expect(stripMarkdown("_quiet_ and ~~gone~~")).toBe("quiet and gone");
});

// A marker inside a word is part of the word, not markup. Removing it would
// invent a hard word ("maxretrycount") that nobody wrote.
test.each([
  "Set the max_retry_count value.",
  "Read snake_case names in this file.",
  "The value is 5 - 3 today.",
  "A well-known problem happens a lot.",
])("prose is left alone: %s", (prose) => {
  expect(stripMarkdown(prose)).toBe(prose);
});

// A marker at a word edge is markup, and Markdown itself reads it that way:
// __dunder__ renders as bold. Write it in backticks to keep it whole.
test("a word wrapped in markers is treated as markup", () => {
  expect(stripMarkdown("Read __dunder__ names.")).toBe("Read dunder names.");
  expect(stripMarkdown("Read `__dunder__` names.")).toBe("Read names.");
});

test("a README-shaped sample loses the noise, not the prose", () => {
  const md = [
    "# easyen",
    "",
    "[![npm](https://img.shields.io/npm/v/easyen.svg)](https://www.npmjs.com/package/easyen)",
    "",
    "It is a good book.",
    "",
    "```bash",
    "cat draft.md | npx easyen --dict everyday,tech",
    "```",
  ].join("\n");

  const result = checkCoverage(stripMarkdown(md), SAMPLE_WORDS);
  expect(result.hardWords).toEqual(["easyen", "npm"]);
});
