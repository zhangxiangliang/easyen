/**
 * Built-in dictionaries. Callers pick one by name instead of supplying their
 * own word list.
 *
 * `everyday` is the base. `academic`, `tech` and `frameworks` are ADD-ONS —
 * each holds only its own extra words, meant to be combined onto `everyday`,
 * e.g. combineDictionaries("everyday", "academic") or `--dict everyday,tech`.
 * (An add-on used alone will flag function words; always pair it with everyday.)
 *
 * Each dictionary is a plain array of base-form words. See ./ATTRIBUTION.md for
 * the data sources and licences.
 */
import EVERYDAY_WORDS from "./everyday.json";
import ACADEMIC_WORDS from "./academic.json";
import TECH_WORDS from "./tech.json";
import FRAMEWORK_WORDS from "./frameworks.json";

export const BUILTIN_DICTIONARIES = {
  /** Base: 2801 everyday high-frequency words (includes function words like the/and). */
  everyday: EVERYDAY_WORDS as readonly string[],
  /** Add-on: 963 academic words. Combine with everyday. */
  academic: ACADEMIC_WORDS as readonly string[],
  /** Add-on: common software / technical-writing terms (api, deploy, schema ...). */
  tech: TECH_WORDS as readonly string[],
  /** Add-on: framework / library / tool names (vue, vite, webpack, docker ...). */
  frameworks: FRAMEWORK_WORDS as readonly string[],
} as const;

/** Name of a built-in dictionary. */
export type DictionaryName = keyof typeof BUILTIN_DICTIONARIES;

/** List the names of every built-in dictionary. */
export function listDictionaries(): DictionaryName[] {
  return Object.keys(BUILTIN_DICTIONARIES) as DictionaryName[];
}

/**
 * Get a built-in dictionary's word list by name.
 * Throws a clear error when the name is unknown.
 */
export function getDictionary(name: string): readonly string[] {
  const words = (BUILTIN_DICTIONARIES as Record<string, readonly string[]>)[name];
  if (!words) {
    throw new Error(
      `Unknown dictionary "${name}". Available: ${listDictionaries().join(", ")}`
    );
  }
  return words;
}
