/**
 * Strip Markdown down to the prose a reader actually reads.
 *
 * Running a README through easyen without this counts code blocks, URLs and
 * HTML attributes as words. On this project's own README that pulled the
 * ratio from 0.97 down to 0.83, and filled `hardWords` with fragments like
 * `svg`, `brightgreen` and `npmjs`. Every user hit this and wrote the same
 * strip script, so the tool does it.
 *
 * What goes: fenced and inline code, HTML tags, URLs, image targets, and the
 * markers that make a heading a heading.
 * What stays: headings, list items, table cells, block quotes — they are all
 * text on the page, so they all count.
 */

/** Remove Markdown syntax, code and URLs, keeping the prose. */
export function stripMarkdown(text: string): string {
  return (
    text
      // YAML frontmatter (SKILL.md and friends)
      .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")
      // Fenced code: ``` or ~~~
      .replace(/^[ \t]*(```|~~~)[\s\S]*?^[ \t]*\1[ \t]*$/gm, "")
      // An unclosed fence runs to the end of the file
      .replace(/^[ \t]*(```|~~~)[\s\S]*$/m, "")
      // Inline code, longest run of backticks first
      .replace(/(`+)[^`]*?\1/g, " ")
      // HTML comments, then tags with their attributes
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]*>/g, " ")
      // Images: the alt text is prose, the target is not
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/!\[([^\]]*)\]\[[^\]]*\]/g, "$1")
      // Links: keep the text, drop the target
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]*)\]\[[^\]]*\]/g, "$1")
      // Link reference definitions:  [id]: https://...
      .replace(/^[ \t]*\[[^\]]*\]:.*$/gm, "")
      // Bare and angle-bracket URLs, then bare domains
      .replace(/<?\b(?:https?|ftp|mailto):\S+>?/gi, " ")
      .replace(/\b(?:www\.)[^\s)]+/gi, " ")
      // Table rule rows:  |---|:--:|
      .replace(/^[ \t]*\|?[ \t]*:?-{2,}:?[ \t]*(\|[ \t]*:?-{2,}:?[ \t]*)*\|?[ \t]*$/gm, "")
      // Table cell walls (the text in the cells stays)
      .replace(/\|/g, " ")
      // Thematic breaks: --- *** ___
      .replace(/^[ \t]*([-*_])(?:[ \t]*\1){2,}[ \t]*$/gm, "")
      // Heading markers, block quote markers, list bullets and numbers
      .replace(/^[ \t]*#{1,6}[ \t]+/gm, "")
      .replace(/^[ \t]*>[ \t]?/gm, "")
      .replace(/^[ \t]*(?:[-*+]|\d+[.)])[ \t]+/gm, "")
      // Emphasis and strikethrough markers
      .replace(/(\*\*|__|~~|[*_])/g, "")
      // Footnote markers
      .replace(/\[\^[^\]]*\]/g, " ")
      // Collapse the holes we just made
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}
