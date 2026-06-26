---
name: easyen
description: Check how easy an English text is to read — its word level and its sentence length. Use it when writing or checking English that should stay simple (for learners), to find hard words to change and long sentences to break up, or to keep your own English at a chosen level.
---

# easyen

See how easy a piece of English is to read, by running `npx easyen`.
It gives you two simple signals — you decide what to change:

1. **Words** — how many of the words are in a chosen word list, and which words
   are too hard.
2. **Sentences** — the average sentence length, and which sentences are long.

easyen only reports. It does not change your text. You decide which hard words
to make simpler and which long sentences to break up.

## When to use

- You wrote some English and want it to stay simple for the reader.
- You want to find the hard words or long sentences in a text.
- You want to keep your writing at a level (everyday, academic, or technical).

## How to run

No install needed — `npx easyen` gets the package on first run. It reads text
from stdin and prints JSON. Pipe the text in, using whatever your shell offers
(this follows the Unix convention, and works on macOS, Linux, and Windows
PowerShell / cmd). `everyday` is the default word list.

```bash
cat your-doc.md | npx easyen                 # macOS / Linux
Get-Content your-doc.md | npx easyen         # Windows PowerShell
```

If piping is hard on your system, read a file directly instead:

```bash
npx easyen --file your-doc.md --dict everyday,tech
```

You can also compose with other tools — e.g. strip code first so it does not
count as hard words: `<remove code> | npx easyen --dict everyday,tech`.

### Choose a word list by reader

`everyday` is the base. The others are **add-ons** — combine them onto everyday,
like `everyday,academic`; each one only adds its own extra words.

- `everyday` — the base, about 2800 common words. Use it alone for the simplest level.
- `academic` — academic words. `--dict everyday,academic`
- `tech` — software words (api, deploy, schema ...). `--dict everyday,tech`
- `frameworks` — tool and language names (vue, vite, webpack, docker ...).
  `--dict everyday,tech,frameworks` for a frontend or server text.

Use only what the reader needs — a smaller list marks more words to change. You
can also add your own word file (one word per line), e.g. your team's product
names:

```bash
cat your-doc.md | npx easyen --dict everyday,tech,./our-product-names.txt
```

## Reading the result

The JSON has:

- `ratio` — 0 to 1, how much of the text is in the word list (higher = easier).
- `hardWords` — words not in the list, sorted A–Z. These are the ones to change.
- `hardWordCounts` — the same words with how many times each one appears, most
  first. Fix the common ones first.
- `sentences.wordsPerSentence` — the average sentence length (lower reads easier).
- `sentences.longSentences` — sentences over 30 words. These are the ones to
  break up.

## What to do with it

- A hard word may have a simpler form (verify → check) — change it — or be a
  needed term (an api name) — keep it. You decide, based on the reader.
- A long sentence can be split into shorter ones.
- Run it again after editing to check the signals got better.

## Notes

- Remove code and links from the text before you check it, so code does not
  count as hard words.
- Keep the word list small — that is the point: a small list marks more words to
  make simpler. Do not reach for a bigger list just to raise the score.
