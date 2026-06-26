/**
 * Dictionary building and single-word look-up. Both functions are pure.
 */
import { possibleBaseForms } from "./base-form";

/** Build a fast, lower-cased look-up set from any word list. */
export function buildDictionary(words: Iterable<string>): Set<string> {
  const set = new Set<string>();
  for (const word of words) {
    const trimmed = word.trim().toLowerCase();
    if (trimmed) set.add(trimmed);
  }
  return set;
}

/**
 * Find a lower-cased word in the dictionary, trying its base-form candidates
 * in order. Returns the matched dictionary entry, or null. Deterministic:
 * candidates are tried in a fixed order, so the first hit is always the same.
 */
export function findInDictionary(word: string, dict: ReadonlySet<string>): string | null {
  for (const form of possibleBaseForms(word)) {
    if (dict.has(form)) return form;
  }
  return null;
}
