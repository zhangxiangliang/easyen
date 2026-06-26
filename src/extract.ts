/**
 * Split a string into word-like pieces. One job only: break text into words.
 * It does not lower-case, judge, or look anything up.
 *
 * - Letter runs become words ("well-known" splits into "well" and "known"
 *   because the hyphen is not part of a word).
 * - Number runs ("3", "3.14", "1,000") become their own pieces.
 * - Original case is kept so callers can spot proper nouns later.
 */
const WORD_RE = /[A-Za-z]+|[0-9]+(?:[.,][0-9]+)*/g;

export function splitWords(text: string): string[] {
  return text.match(WORD_RE) ?? [];
}

/**
 * Split a word written in camelCase / PascalCase into its parts, so a code
 * identifier is not mistaken for one unknown word:
 *
 *   getUserById -> ["get", "User", "By", "Id"]
 *   backgroundColor -> ["background", "Color"]
 *   HTTPServer -> ["HTTP", "Server"]
 *
 * Only words that mix upper and lower case are split. A plain word, an
 * all-capitals word (AWS), or a lower-case word is returned unchanged.
 * Original case is kept so callers can still judge each part.
 */
export function splitCamelCase(word: string): string[] {
  if (!(/[a-z]/.test(word) && /[A-Z]/.test(word))) return [word];
  return word
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2") // getUser  -> get User
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // HTTPServer -> HTTP Server
    .split(" ");
}
