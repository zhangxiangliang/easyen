# evals

Does `SKILL.md` actually make an AI write simpler English? This folder answers
that with numbers, and shows every word behind them.

## The claim under test

> Give an AI `SKILL.md`, and the English it writes gets easier to read.

Until now that was a promise with nothing behind it.

## Method

Eight writing tasks, each done twice about the same fictional tool:

* **baseline** — the task alone.
* **skill** — the task plus `SKILL.md`.

Both sets are then measured with easyen itself:

```bash
node evals/run.mjs
```

Two numbers per text, using `--dict everyday,tech` (a fair list for technical
writing, since api and deploy should not count as hard):

* `ratio` — how much of the text is in the word list. Higher is easier.
* `wordsPerSentence` — average sentence length. Lower reads easier.

Plus a count of sentences over 30 words.

## Written down before the results were seen

* Every baseline text was written first, in one pass, and **was not edited
  afterwards**. No text was rewritten once its score was known.
* A win means `ratio` goes up **and** `wordsPerSentence` goes down. One of the
  two moving is a partial result, and is reported as such.
* Whatever came out is published here, including a null or negative result.

## What this is not

**This is a self-run, not an independent benchmark.** Be aware of two limits
before you read anything into the numbers:

1. **The same author wrote both sets, and knew what easyen measures.** That is
   the weak point of this study. The raw text is published in full so you can
   judge whether the baseline is a fair picture of default AI writing, or a
   straw man. Read it before you trust the table.
2. **One model, one run.** No cross-model comparison, no repeats, no judge.
   Nothing here says anything about how other models behave.

A stronger version would generate both sets from a model with no knowledge of
the tool, across several models, several times each. That is worth doing. This
is the first step, not the last.

## Files

```
tasks.json        the eight tasks
run.mjs           measures the raw text, writes results
results/
  RESULTS.md      the table and what it means
  results.json    the same numbers, machine-readable
  raw/            all sixteen texts, unedited
```
