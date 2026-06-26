/**
 * Tests for the sentence-length signal (the second readability dimension).
 */
import { checkSentences } from "../../src/index";

describe("checkSentences", () => {
  test("counts sentences and average words", () => {
    const r = checkSentences("I like books. She reads a lot.");
    expect(r.sentences).toBe(2);
    expect(r.wordsPerSentence).toBe(3.5); // (3 + 4) / 2
    expect(r.longest).toBe(4);
    expect(r.longSentences).toEqual([]);
  });

  test("splits on ! and ? too", () => {
    const r = checkSentences("Stop! Are you ok? Yes.");
    expect(r.sentences).toBe(3);
  });

  test("flags sentences over the limit, longest first", () => {
    const seven = "one two three four five six seven"; // 7 words
    const nine = `${seven} eight nine`; // 9 words
    const r = checkSentences(`${nine}. ${seven}. short.`, {
      longSentenceWords: 7,
    });
    // only the 9-word sentence is over the limit of 7
    expect(r.longSentences.map((s) => s.words)).toEqual([9]);
  });

  test("empty text gives zeroes, not NaN", () => {
    const r = checkSentences("   ");
    expect(r.sentences).toBe(0);
    expect(r.wordsPerSentence).toBe(0);
    expect(r.longest).toBe(0);
  });

  test("line breaks also separate units (markdown lists)", () => {
    const r = checkSentences("first line\nsecond line\nthird line");
    expect(r.sentences).toBe(3);
  });
});
