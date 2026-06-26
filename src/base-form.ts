/**
 * Reduce an inflected word to a set of candidate base forms.
 *
 * "base form" = the dictionary form of a word: studies -> study, ran -> run.
 * We do NOT need the single correct base form. We only ask: "is any plausible
 * base form of this word in the dictionary?" So we generate several candidates
 * by reversing common English ending rules, plus the irregular map, and let
 * the caller test each one against the dictionary.
 */
import { IRREGULARS } from "./irregulars";

/** A consonant doubling like "stopp" (ed) or "runn" (ing) -> drop one. */
function deDouble(stem: string): string | null {
  const n = stem.length;
  if (n < 2) return null;
  const a = stem[n - 1]!;
  const b = stem[n - 2]!;
  if (a === b && !"aeiou".includes(a)) return stem.slice(0, -1);
  return null;
}

/**
 * Add a stem and its near variants (bare, +"e", de-doubled) as candidates.
 * Example: "mak" -> also "make"; "stopp" -> also "stop".
 */
function pushStemVariants(out: Set<string>, stem: string): void {
  if (stem.length >= 2) out.add(stem);
  out.add(stem + "e");
  const dd = deDouble(stem);
  if (dd && dd.length >= 2) out.add(dd);
}

/**
 * Return every possible base form for a lower-cased word, including the word
 * itself. The result is a de-duplicated array in a fixed, deterministic order
 * (insertion order), so look-ups always try the forms the same way.
 */
export function possibleBaseForms(word: string): string[] {
  const out = new Set<string>();
  out.add(word);

  const irregular = IRREGULARS[word];
  if (irregular) out.add(irregular);

  // Too short to inflect meaningfully.
  if (word.length <= 2) return [...out];

  // --- plural / 3rd person singular: -s / -es / -ies ---
  if (word.endsWith("ies") && word.length > 4) {
    out.add(word.slice(0, -3) + "y"); // studies -> study
  }
  if (word.endsWith("ves") && word.length > 4) {
    out.add(word.slice(0, -3) + "f"); // wolves -> wolf
    out.add(word.slice(0, -3) + "fe"); // knives -> knife
  }
  if (word.endsWith("es") && word.length > 3) {
    out.add(word.slice(0, -2)); // boxes -> box, goes -> go
    out.add(word.slice(0, -1)); // houses -> house
  }
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) {
    out.add(word.slice(0, -1)); // cats -> cat
  }

  // --- past tense / past participle: -ed / -ied ---
  if (word.endsWith("ied") && word.length > 4) {
    out.add(word.slice(0, -3) + "y"); // studied -> study
  }
  if (word.endsWith("ed") && word.length > 3) {
    pushStemVariants(out, word.slice(0, -2)); // walked->walk, liked->like, stopped->stop
  }

  // --- present participle / gerund: -ing ---
  if (word.endsWith("ing") && word.length > 4) {
    pushStemVariants(out, word.slice(0, -3)); // walking->walk, making->make, running->run
  }

  // --- comparative / superlative: -er / -est ---
  if (word.endsWith("ier") && word.length > 4) {
    out.add(word.slice(0, -3) + "y"); // happier -> happy
  }
  if (word.endsWith("iest") && word.length > 5) {
    out.add(word.slice(0, -4) + "y"); // happiest -> happy
  }
  if (word.endsWith("er") && word.length > 3) {
    pushStemVariants(out, word.slice(0, -2)); // bigger->big, taller->tall
  }
  if (word.endsWith("est") && word.length > 4) {
    pushStemVariants(out, word.slice(0, -3)); // biggest->big, tallest->tall
  }

  // --- adverb: -ly ---
  if (word.endsWith("ily") && word.length > 4) {
    out.add(word.slice(0, -3) + "y"); // happily -> happy
  }
  if (word.endsWith("ly") && word.length > 3) {
    out.add(word.slice(0, -2)); // quickly -> quick
  }

  return [...out];
}
