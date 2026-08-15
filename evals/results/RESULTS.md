# Results

Run with easyen 2.0.0, `--dict everyday,tech`. Re-run it yourself:

```bash
npm run build && node evals/run.mjs
```

The numbers are the same every time. There is no judging model here, and no
score to argue with — easyen reads the text and counts.

## Headline

| | baseline | with SKILL.md |
|---|---|---|
| mean `ratio` | 0.82 | **0.94** |
| mean words per sentence | 23.75 | **10.21** |
| hard words, all eight texts | 140 | **23** |
| sentences over 30 words | 6 | **0** |

**7 wins, 1 partial, 0 losses** out of 8 tasks. A win means the text got both
easier in words and shorter in sentences. One of the two counts as partial.

## Per task

| task | ratio | words/sentence | verdict |
|---|---|---|---|
| readme-intro | 0.74 → 0.98 | 25.5 → 11.38 | win |
| error-message | 0.89 → 0.81 | 24.67 → 9.33 | partial |
| getting-started | 0.84 → 0.97 | 21.8 → 7.7 | win |
| troubleshooting | 0.83 → 0.98 | 22.2 → 10.22 | win |
| release-notes | 0.81 → 0.92 | 24.25 → 10 | win |
| incident-report | 0.79 → 0.91 | 21.6 → 12.63 | win |
| runbook | 0.86 → 0.98 | 27 → 8.45 | win |
| architecture | 0.79 → 0.99 | 23 → 12 | win |

## The one that did not win

`error-message` got much shorter per sentence, but its `ratio` **fell**, from
0.89 to 0.81. That is not noise, and it is worth understanding:

```
baseline  73 words   hard: app credentials password postgre
                           reattempt remediate synchronization
skill     26 words   hard: app password postgres tablesync
```

The skill version threw away two thirds of the words. What it could not throw
away is the subject: the tool's name, the user name, the word password. Those
words are a small share of 73 words and a large share of 26.

**So `ratio` is unstable on short text.** Under about 50 words, one unavoidable
term can move it several points. Read `wordsPerSentence` and the hard-word list
instead. This is a real limit of the measure, and it belongs here rather than in
a footnote.

## What this run also found

Measuring our own claim turned up two faults in easyen itself:

1. **`PostgreSQL` is split before it is looked up.** It becomes `Postgre` and
   `SQL`, and `postgre` is not a word — even though `postgresql` is in the
   `frameworks` list. The whole word should be checked before it is taken apart.
2. **`password` and `credentials` are in no word list.** Both are ordinary in
   software writing.

Neither is fixed in the numbers above. They were found by this run, so the run
is reported as it stands, at version 2.0.0. Fixing them will lift both columns.

## What it does not show

Read the limits in [../README.md](../README.md) before quoting any of this. The
short version: one author wrote both sets and knew what easyen measures, and
this is one model on one run. Every text is in [raw/](raw/) — judge the baseline
for yourself before you trust the table.
