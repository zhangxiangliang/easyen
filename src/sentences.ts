/**
 * The second readability signal: sentence length.
 *
 * Word coverage cannot see that a text is hard because its sentences are long
 * and winding. This counts sentence length — pure measurement, no judgement.
 * The AI decides whether a long sentence should be broken up.
 */
import { splitWords } from "./extract";

/** A sentence that is longer than the limit. */
export interface LongSentence {
  text: string;
  words: number;
}

export interface SentenceCheck {
  /** How many sentences were found. */
  sentences: number;
  /** Average words per sentence (the main number; lower reads easier). */
  wordsPerSentence: number;
  /** Words in the longest sentence. */
  longest: number;
  /** Sentences over the limit, longest first. These are the ones to break up. */
  longSentences: LongSentence[];
}

export interface SentenceOptions {
  /**
   * A sentence with more words than this is "long".
   * @default 30
   */
  longSentenceWords?: number;
}

/** Split text into sentence-like pieces (on . ! ? and line breaks). */
function splitSentences(text: string): string[] {
  return text
    .split(/[.!?]+(?=\s|$)|\n+/)
    .map((piece) => piece.trim())
    .filter(Boolean);
}

export function checkSentences(
  text: string,
  options: SentenceOptions = {}
): SentenceCheck {
  const limit = options.longSentenceWords ?? 30;

  const pieces = splitSentences(text)
    .map((piece) => ({ text: piece, words: splitWords(piece).length }))
    .filter((s) => s.words > 0);

  const sentences = pieces.length;
  const totalWords = pieces.reduce((sum, s) => sum + s.words, 0);
  const longest = pieces.reduce((max, s) => Math.max(max, s.words), 0);
  const longSentences = pieces
    .filter((s) => s.words > limit)
    .sort((a, b) => b.words - a.words);

  return {
    sentences,
    wordsPerSentence: sentences === 0 ? 0 : totalWords / sentences,
    longest,
    longSentences,
  };
}
