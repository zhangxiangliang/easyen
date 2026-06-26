/**
 * String-level cleaning steps. Each function does exactly one transform and
 * is pure: same input always gives the same output, no side effects.
 */

/** Turn curly apostrophes (’) into straight ones ('). */
export function normalizeApostrophes(text: string): string {
  return text.replace(/[’]/g, "'");
}

/**
 * Ordered contraction rules. Specials (won't, can't) must run before the
 * generic "n't" rule, otherwise "can't" would wrongly become "ca not".
 * Expansions are lower-case function words; that is fine because matching
 * is case-insensitive.
 */
const CONTRACTION_RULES: ReadonlyArray<readonly [RegExp, string]> = [
  [/\bwon't\b/gi, "will not"],
  [/\bcan't\b/gi, "can not"],
  [/\bshan't\b/gi, "shall not"],
  [/\bain't\b/gi, "be not"],
  [/n't\b/gi, " not"], // don't -> do not, isn't -> is not
  [/'re\b/gi, " are"], // they're -> they are
  [/'ve\b/gi, " have"], // I've -> I have
  [/'ll\b/gi, " will"], // we'll -> we will
  [/'m\b/gi, " am"], // I'm -> I am
  [/'d\b/gi, ""], // I'd -> I (had/would is ambiguous, keep the stem)
  [/'s\b/gi, ""], // it's / child's -> drop (is/has or possessive)
];

/**
 * Expand the common English contractions so their base words can be matched.
 * Assumes apostrophes are already straight (run `normalizeApostrophes` first).
 */
export function expandContractions(text: string): string {
  return CONTRACTION_RULES.reduce(
    (acc, [pattern, replacement]) => acc.replace(pattern, replacement),
    text
  );
}
