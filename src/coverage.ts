/**
 * The top-level pipeline. `checkCoverage` only wires the small pure steps
 * together; every real piece of logic lives in its own single-purpose
 * function (normalize -> expand -> extract -> match -> summarize).
 */
import { pipe } from "./pipe";
import { normalizeApostrophes, expandContractions } from "./normalize";
import { splitWords, splitCamelCase } from "./extract";
import {
  isAllCapitals,
  isCapitalized,
  isNumber,
  isNumberWord,
  isSingleLetter,
} from "./classify";
import { buildDictionary, findInDictionary } from "./dictionary";
import { getDictionary, DictionaryName } from "./dictionaries";

/** What you can pass as the dictionary argument. */
export type DictionarySource =
  | DictionaryName // a built-in dictionary, by name
  | Iterable<string> // your own word list
  | ReadonlySet<string>; // a prebuilt look-up set

export interface CheckOptions {
  /**
   * Ignore pure-number tokens ("3", "3.14"). Numbers are not vocabulary, so
   * they are excluded from the ratio by default.
   * @default true
   */
  ignoreNumbers?: boolean;
  /**
   * Ignore capitalised words that are not in the dictionary (likely proper
   * nouns such as names or places). Note: this is a simple, position-free
   * heuristic — with a small dictionary it may also drop a sentence-initial
   * normal word. Use a full dictionary for best results.
   * @default false
   */
  ignoreProperNouns?: boolean;
}

export interface WordResult {
  /** Lower-cased word that was checked. */
  word: string;
  /** Whether a base form of this word is in the dictionary. */
  known: boolean;
  /** The matching dictionary entry, if found (may differ from `word`). */
  base?: string;
}

/** A hard word and how many times it appears in the text. */
export interface HardWord {
  word: string;
  count: number;
}

export interface CoverageResult {
  /** Number of counted words (after the ignore filters). */
  total: number;
  /** Number of counted words found in the dictionary. */
  covered: number;
  /** covered / total, in [0, 1]. Is 0 when there are no counted words. */
  ratio: number;
  /** Hard words (not in the dictionary), unique and sorted A–Z. Reword these. */
  hardWords: string[];
  /** Hard words with how many times each appears, most frequent first. */
  hardWordCounts: HardWord[];
  /** Per-word result, in reading order. */
  details: WordResult[];
}

/** Clean raw text into a space-separated, contraction-free string. */
const prepare = pipe<string>(normalizeApostrophes, expandContractions);

/** Turn one extracted token into a WordResult, or null if it is filtered out. */
function classifyToken(
  token: string,
  dict: ReadonlySet<string>,
  options: Required<CheckOptions>
): WordResult | null {
  // Numbers and spelled-out number words are not vocabulary to grade.
  if (isNumber(token) || isNumberWord(token)) {
    return options.ignoreNumbers ? null : { word: token.toLowerCase(), known: false };
  }

  // A lone letter (b, e, g, x ...) is never a word; never count it.
  if (isSingleLetter(token)) return null;

  const lower = token.toLowerCase();
  const base = findInDictionary(lower, dict);

  if (base === null) {
    // Unknown all-capitals word (AWS, JSON) is a short form, not vocabulary.
    if (isAllCapitals(token)) return null;
    if (options.ignoreProperNouns && isCapitalized(token)) return null;
    return { word: lower, known: false };
  }

  return { word: lower, known: true, base };
}

/**
 * Combine several dictionary sources (built-in names, word lists, or Sets)
 * into one lower-cased look-up Set. Lets a caller compose their own
 * vocabulary — e.g. the everyday list plus a list of allowed domain words:
 *
 *   const dict = combineDictionaries("everyday", ["api", "endpoint"]);
 *   checkCoverage(text, dict);
 */
export function combineDictionaries(...sources: DictionarySource[]): Set<string> {
  const set = new Set<string>();
  for (const source of sources) {
    const words = typeof source === "string" ? getDictionary(source) : source;
    for (const word of words) {
      const trimmed = word.trim().toLowerCase();
      if (trimmed) set.add(trimmed);
    }
  }
  return set;
}

/**
 * Turn any accepted dictionary source into a fast look-up set. Built-in
 * dictionaries are built once and cached, so repeated calls are cheap.
 */
const builtinCache = new Map<string, ReadonlySet<string>>();
function resolveDictionary(source: DictionarySource): ReadonlySet<string> {
  if (typeof source === "string") {
    const cached = builtinCache.get(source);
    if (cached) return cached;
    const set = buildDictionary(getDictionary(source));
    builtinCache.set(source, set);
    return set;
  }
  if (source instanceof Set) return source as ReadonlySet<string>;
  return buildDictionary(source);
}

/** Fold per-word results into the final coverage summary. */
function summarize(results: WordResult[]): CoverageResult {
  const counts = new Map<string, number>();
  let covered = 0;

  for (const result of results) {
    if (result.known) covered += 1;
    else counts.set(result.word, (counts.get(result.word) ?? 0) + 1);
  }

  // Most frequent first; ties sorted A–Z for a stable, deterministic order.
  const hardWordCounts: HardWord[] = [...counts.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));

  const total = results.length;
  return {
    total,
    covered,
    ratio: total === 0 ? 0 : covered / total,
    hardWords: [...counts.keys()].sort(),
    hardWordCounts,
    details: results,
  };
}

/**
 * Check what fraction of a text's words are covered by a vocabulary.
 *
 * @param text       The text to check.
 * @param dictionary A built-in dictionary name, a word list (base forms
 *                   only), or a prebuilt Set.
 * @param options    See {@link CheckOptions}.
 */
export function checkCoverage(
  text: string,
  dictionary: DictionarySource,
  options: CheckOptions = {}
): CoverageResult {
  const settings: Required<CheckOptions> = {
    ignoreNumbers: options.ignoreNumbers ?? true,
    ignoreProperNouns: options.ignoreProperNouns ?? false,
  };
  const dict = resolveDictionary(dictionary);

  const results = splitWords(prepare(text))
    .flatMap(splitCamelCase) // getUserById -> get / User / By / Id
    .map((token) => classifyToken(token, dict, settings))
    .filter((result): result is WordResult => result !== null);

  return summarize(results);
}
