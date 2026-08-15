<div align="center">

# easyen

Check how easy an English text is to read, and keep AI output at a level your reader can follow.

[English](README.md) · [简体中文](README.ZH.md)

[![npm](https://img.shields.io/npm/v/easyen.svg)](https://www.npmjs.com/package/easyen)
[![downloads](https://img.shields.io/npm/dm/easyen.svg)](https://www.npmjs.com/package/easyen)
[![license](https://img.shields.io/npm/l/easyen.svg)](https://github.com/zhangxiangliang/easyen/blob/main/LICENSE)
[![typescript](https://img.shields.io/badge/language-typescript-blue.svg)](https://www.typescriptlang.org)
[![zero deps](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](https://github.com/zhangxiangliang/easyen/blob/main/package.json)

</div>

Ever notice how AI likes to dress English up? It says simple things in hard words, and gives one idea three different ways — tiring to read. It is not the AI's fault; it is just how it was trained, and it does not feel it.

easyen checks two things in the AI's English, and reminds it to keep things simple:

* **Words** — which words are too hard, picked out for you.
* **Sentences** — which sentences are too long, picked out for you.

It only measures; it changes nothing. It shows you the hard words and the long sentences clearly. Whether to change them, and how — the AI decides.

## Quick start

### With your AI

```bash
npx skills add zhangxiangliang/easyen
```

That installs the skill into Claude Code, Cursor, Codex and other agents. From
then on the AI runs easyen on its own drafts and cleans them up before you see
them.

No CLI? Hand your AI this line instead, and it does the rest:

> Read and follow https://github.com/zhangxiangliang/easyen/blob/main/SKILL.md

### On the command line

No install needed. `npx` gets the package on first run.

```bash
cat draft.md | npx easyen                    # macOS / Linux
Get-Content draft.md | npx easyen            # Windows PowerShell
npx easyen --file draft.md                   # any OS, no pipe
```

| Option | What it does |
|---|---|
| `-d, --dict <spec>` | Word list to use (default: `everyday`). Comma-separated to combine. Each item is a built-in name **or** a path to your own word file: `--dict everyday,tech,./terms.txt` |
| `-f, --file <path>` | Read the text from a file instead of stdin |
| `-m, --markdown` | Treat the input as Markdown: drop code blocks, inline code, URLs and HTML first. **Use this on a README** — without it, badges and file paths count as hard words. |
| `--details` | Add a row per word (base form, known or not). Off by default — see below |
| `--proper-nouns` | Ignore unknown words that start with a capital (names, places) |
| `--count-numbers` | Count numbers instead of ignoring them |
| `-h, --help` | Show help |

### In your code

```bash
npm install easyen
```

```ts
import { checkCoverage, checkSentences, stripMarkdown } from "easyen";

const text = stripMarkdown(readme); // Markdown in, prose out

const result = checkCoverage(text, "everyday");
if (result.ratio < 0.95) {
  console.log("too hard:", result.hardWords);
}

const flow = checkSentences(text, { longSentenceWords: 25 });
console.log(flow.wordsPerSentence, flow.longSentences);
```

Useful in CI — fail the build when your docs get too hard to read.

## See it work

Here is a paragraph an AI wrote:

> Leveraging a robust and highly configurable architecture, this utility facilitates the seamless synchronization of your Postgres tables to S3, thereby enabling teams to substantially streamline their data workflows without necessitating any additional infrastructure provisioning. Comprehensive documentation is available to assist practitioners in optimizing their deployment methodology.

Run it through easyen:

```bash
cat draft.md | npx easyen --dict everyday,tech
```

```json
{
  "total": 45,
  "covered": 31,
  "ratio": 0.69,
  "hardWords": [
    "configurable", "facilitates", "leveraging", "methodology",
    "necessitating", "optimizing", "postgres", "practitioners",
    "robust", "seamless", "streamline", "synchronization",
    "thereby", "utility"
  ],
  "sentences": {
    "sentences": 2,
    "wordsPerSentence": 23.5,
    "longest": 35,
    "longSentences": [{ "text": "Leveraging a robust and ...", "words": 35 }]
  }
}
```

Now the AI knows what to fix. Here is the same idea, written for a reader:

> This tool copies your Postgres tables to S3. It needs one config file. You do not need to set up any servers. The docs show you how to run it.

| | Before | After |
|---|---|---|
| Words in the list (`ratio`) | 0.69 | **0.96** |
| Hard words | 14 | **1** (`postgres`) |
| Words per sentence | 23.5 | **7.75** |
| Longest sentence | 35 | **9** |

Same meaning. Half the words. Anyone can read it.

## Word lists

`everyday` is the base. The rest are **add-ons**: each one holds only its own extra words, so you combine them onto `everyday`.

| Name | Words | What is in it |
|---|---|---|
| `everyday` | 2811 | Common English. The base — use it alone for the simplest level. |
| `academic` | 962 | Academic words. `--dict everyday,academic` |
| `tech` | 255 | Software words: api, deploy, schema … `--dict everyday,tech` |
| `frameworks` | 803 | Tool and library names: vue, vite, docker … `--dict everyday,tech,frameworks` |

Pick only what your reader needs. **A smaller list marks more words to fix** — that is the point. Do not reach for a bigger list just to raise the score.

Your own word file is one word per line:

```bash
cat draft.md | npx easyen --dict everyday,tech,./our-product-names.txt
```

## What you get back

| Field | Meaning |
|---|---|
| `total` / `covered` | How many words were counted, and how many are in the list |
| `ratio` | 0 to 1 — how much of the text is in the list. Higher is easier. |
| `hardWords` | Words not in the list, A–Z. These are the ones to change. |
| `hardWordCounts` | The same words with counts, most first. Fix the common ones first. |
| `details` | Every word, with its base form and whether it is known. **CLI: only with `--details`** |
| `sentences.wordsPerSentence` | Average sentence length. Lower reads easier. |
| `sentences.longest` | Words in the longest sentence |
| `sentences.longSentences` | Sentences over 30 words. These are the ones to break up. |

The CLI hides `details` unless you ask for it. On a 420-word README those rows
are 95% of the output — roughly 14,900 tokens instead of 700 — and this tool is
mostly read by an AI that pays for every one of them. Everything you act on is
already in `hardWords` and `hardWordCounts`. The library always returns
`details`; only the CLI leaves it out.

## What it does not do

* **It does not rewrite your text.** It points; you (or your AI) choose. A hard word may be one the reader already knows.
* **It is not a grammar or spell checker.** Use a real one for that.
* **It does not know your reader.** `ratio` is a signal, not a grade. There is no score you must hit.
* **It does not read code.** Markdown is handled by `--markdown`; for other formats, strip the code and links yourself first.

## Design

* **Measure, do not judge.** Two numbers and two lists. No 50-page book of rules, no style opinions.
* **Zero runtime dependencies.** Pure TypeScript. 221 tests, 92% coverage.
* **Small pure functions.** Every step is exported, so you can build your own pipeline.

This page eats its own dog food. Check it yourself:

```bash
npx easyen --file README.md --dict everyday,tech --markdown
```

It scores **`ratio` 0.95** at about 7 words per sentence. The one sentence over
30 words is the AI paragraph quoted at the top — kept on purpose, since that is
the thing this page is about. `SKILL.md`, which has no such example, scores 0.97
with no long sentence at all.

## License

MIT © [zhangxiangliang](https://github.com/zhangxiangliang)
