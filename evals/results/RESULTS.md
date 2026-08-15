# Results

Measured with `--dict everyday,tech`. Re-run it yourself:

```bash
npm run build && node evals/run.mjs
```

The numbers are the same every time. There is no judging model here, and no
score to argue with — easyen reads the text and counts.

## Headline

| | baseline | with SKILL.md |
|---|---|---|
| mean `ratio` | 0.84 | **0.97** |
| mean words per sentence | 23.75 | **10.21** |
| hard words, all eight texts | 129 | **11** |
| sentences over 30 words | 6 | **0** |

**7 wins, 1 partial, 0 losses** out of 8 tasks. A win means the text got both
easier in words and shorter in sentences. One of the two counts as partial.

## Per task

| task | ratio | words/sentence | verdict |
|---|---|---|---|
| readme-intro | 0.74 → 0.98 | 25.5 → 11.38 | win |
| error-message | 0.93 → 0.89 | 24.67 → 9.33 | partial |
| getting-started | 0.84 → 0.97 | 21.8 → 7.7 | win |
| troubleshooting | 0.83 → 1.0 | 22.2 → 10.22 | win |
| release-notes | 0.84 → 0.96 | 24.25 → 10 | win |
| incident-report | 0.83 → 0.96 | 21.6 → 12.63 | win |
| runbook | 0.89 → 1.0 | 27 → 8.45 | win |
| architecture | 0.8 → 0.99 | 23 → 12 | win |

## The one that did not win

`error-message` got much shorter per sentence, but its `ratio` **fell**, from
0.93 to 0.89. That is not noise, and it is worth understanding:

```
baseline  73 words   hard: credentials reattempt remediate synchronization
skill     26 words   hard: app tablesync
```

The skill version threw away two thirds of the words. What it could not throw
away is the subject: the tool's name and the user name. Those words are a small
share of 73 words and a large share of 26.

**So `ratio` is unstable on short text.** Under about 50 words, one unavoidable
term can move it several points. Read `wordsPerSentence` and the hard-word list
instead. This is a real limit of the measure, and it belongs here rather than in
a footnote.

## The first run, and what it changed

The first run was made with easyen 2.0.0, and it found two faults in easyen
itself:

1. **`PostgreSQL` was split before it was looked up**, into `Postgre` and `SQL`.
   `postgre` is a word in no language, so it was counted as hard — even though
   `postgresql` was in the `frameworks` list all along.
2. **`password`, `upload`, `restart` and `third` were in no word list.** The
   first three are ordinary in software writing; `third` was missing while
   `first` and `second` were present.

Both are fixed. Here is what that did to the table:

| | at 2.0.0 | after the fixes |
|---|---|---|
| mean `ratio`, baseline | 0.82 | 0.84 |
| mean `ratio`, skill | 0.94 | 0.97 |
| hard words, baseline | 140 | 129 |
| hard words, skill | 23 | 11 |
| verdicts | 7 / 1 / 0 | 7 / 1 / 0 |

Both columns rose, and no verdict changed. The result did not rest on a bug.

The old numbers are kept here on purpose: the tool that produced the table is
the same tool the table is about, so its faults are part of the record.

## What it does not show

Read the limits in [../README.md](../README.md) before quoting any of this. The
short version: one author wrote both sets and knew what easyen measures, and
this is one model on one run. Every text is in [raw/](raw/) — judge the baseline
for yourself before you trust the table.
