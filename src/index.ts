/**
 * easyen — check how much of a text is covered by a given vocabulary.
 *
 * The package is built from small, pure, single-purpose functions. The main
 * entry is `checkCoverage`, but every step is exported so you can compose
 * your own pipeline.
 *
 *   import { checkCoverage } from "easyen";
 *
 *   const result = checkCoverage(text, "everyday");
 *   if (result.ratio < 0.98) {
 *     console.log("could be simpler:", result.hardWords);
 *   }
 */

// Main pipeline
import { checkCoverage } from "./coverage";

export { checkCoverage };
export { combineDictionaries } from "./coverage";

// Second signal: sentence length
export { checkSentences } from "./sentences";
export type {
  SentenceCheck,
  SentenceOptions,
  LongSentence,
} from "./sentences";
export type {
  CheckOptions,
  CoverageResult,
  WordResult,
  HardWord,
  DictionarySource,
} from "./coverage";

// Built-in dictionaries (pick one by name)
export {
  BUILTIN_DICTIONARIES,
  listDictionaries,
  getDictionary,
} from "./dictionaries";
export type { DictionaryName } from "./dictionaries";

// Individual steps (composable / testable on their own)
export { pipe } from "./pipe";
export { normalizeApostrophes, expandContractions } from "./normalize";
export { splitWords, splitCamelCase } from "./extract";
export {
  isNumber,
  isCapitalized,
  isNumberWord,
  isSingleLetter,
  isAllCapitals,
} from "./classify";
export { possibleBaseForms } from "./base-form";
export { buildDictionary, findInDictionary } from "./dictionary";
export { IRREGULARS } from "./irregulars";

export default { checkCoverage };
