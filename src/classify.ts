/**
 * Tiny predicates over a single token. Each answers one yes/no question and
 * is pure.
 */

/** True when the word is a number like "3", "3.14" or "1,000". */
export function isNumber(token: string): boolean {
  return /^[0-9]/.test(token);
}

/** True when the token starts with an upper-case letter. */
export function isCapitalized(token: string): boolean {
  return /^[A-Z]/.test(token);
}

/**
 * True for a single-letter token that is not a real word. "a" and "i" are
 * words; every other lone letter (b, e, g, x ...) comes from abbreviations,
 * list markers or variable names and is not vocabulary.
 */
export function isSingleLetter(token: string): boolean {
  if (token.length !== 1) return false;
  const lower = token.toLowerCase();
  return lower !== "a" && lower !== "i";
}

/** Spelled-out cardinal numbers and magnitudes. Treated like digits. */
const NUMBER_WORDS = new Set<string>([
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
  "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "thirty",
  "forty", "fifty", "sixty", "seventy", "eighty", "ninety",
  "hundred", "thousand", "million", "billion", "trillion",
]);

/** True when the token is a spelled-out number word ("two", "zero"). */
export function isNumberWord(token: string): boolean {
  return NUMBER_WORDS.has(token.toLowerCase());
}

/**
 * True for an all-caps token of 2+ letters (AWS, JSON, SEO). These are
 * acronyms, not vocabulary. Used only when the token is also unknown, so a
 * normal word written in capitals (NOTE) still counts via its lower-case form.
 */
export function isAllCapitals(token: string): boolean {
  return token.length >= 2 && /^[A-Z]+$/.test(token);
}
