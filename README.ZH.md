<div align="center">

# easyen

判断一段英文好不好读，帮 AI 把输出控制在读者能懂的水平。

[English](README.md) · [简体中文](README.ZH.md)

[![npm](https://img.shields.io/npm/v/easyen.svg)](https://www.npmjs.com/package/easyen)
[![downloads](https://img.shields.io/npm/dm/easyen.svg)](https://www.npmjs.com/package/easyen)
[![license](https://img.shields.io/npm/l/easyen.svg)](https://github.com/zhangxiangliang/easyen/blob/main/LICENSE)
[![typescript](https://img.shields.io/badge/language-typescript-blue.svg)](https://www.typescriptlang.org)
[![zero deps](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](https://github.com/zhangxiangliang/easyen/blob/main/package.json)

</div>

你有没有发现，让 AI 写英文，它总爱端着——简单的意思非说得文绉绉，一个意思还换着好几种说法，读起来累人。这不怪它，是训练出来的习惯，它自己没感觉。

easyen 就帮 AI 量两件事，提醒它把话说简单点：

* **词汇** —— 哪些词超纲了，挑出来。
* **句子** —— 哪些句子太长了，挑出来。

它只量、不改。哪些词偏难、哪些句子绕，给你标得清清楚楚；至于换不换、怎么换，AI 自己拿主意。

## 看一眼效果

这是 AI 写的一段话：

> Leveraging a robust and highly configurable architecture, this utility facilitates the seamless synchronization of your Postgres tables to S3, thereby enabling teams to substantially streamline their data workflows without necessitating any additional infrastructure provisioning. Comprehensive documentation is available to assist practitioners in optimizing their deployment methodology.

丢给 easyen：

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

AI 拿到这份清单，就知道该动哪里了。同样的意思，写成人话：

> This tool copies your Postgres tables to S3. It needs one config file. You do not need to set up any servers. The docs show you how to run it.

| | 改之前 | 改之后 |
|---|---|---|
| 词表覆盖率 `ratio` | 0.69 | **0.96** |
| 生词数 | 14 个 | **1 个**（`postgres`） |
| 平均句长 | 23.5 词 | **7.75 词** |
| 最长句子 | 35 词 | **9 词** |

意思一样，词少一半，谁都读得懂。

## 快速开始

### 交给你的 AI

把下面这句话丢给你的 AI（Claude Code、Cursor、Codex 都行），剩下的它自己搞定：

> Read and follow https://github.com/zhangxiangliang/easyen/blob/main/SKILL.md

之后 AI 会自己拿 easyen 量自己写的英文，改干净了再拿给你看。

### 命令行

不用装，`npx` 第一次运行会自动拉包。

```bash
cat draft.md | npx easyen                    # macOS / Linux
Get-Content draft.md | npx easyen            # Windows PowerShell
npx easyen --file draft.md                   # 任何系统，不用管道
```

| 参数 | 作用 |
|---|---|
| `-d, --dict <spec>` | 用哪个词表（默认 `everyday`）。逗号分隔可以叠加，每一项可以是内置名字，**也可以是你自己的词表文件路径**：`--dict everyday,tech,./terms.txt` |
| `-f, --file <path>` | 从文件读，不走 stdin |
| `-m, --markdown` | 按 Markdown 处理：先去掉代码块、行内代码、URL 和 HTML。**量 README 一定要加这个**——不加的话，badge 和文件路径会被当成生词。 |
| `--details` | 每个词一行明细（原形、是否认识）。默认关闭，原因见下 |
| `--proper-nouns` | 忽略大写开头的生词（人名、地名） |
| `--count-numbers` | 把数字也算进去（默认不算） |
| `-h, --help` | 看帮助 |

### 在代码里用

```bash
npm install easyen
```

```ts
import { checkCoverage, checkSentences, stripMarkdown } from "easyen";

const text = stripMarkdown(readme); // Markdown 进，纯文字出

const result = checkCoverage(text, "everyday");
if (result.ratio < 0.95) {
  console.log("太难了：", result.hardWords);
}

const flow = checkSentences(text, { longSentenceWords: 25 });
console.log(flow.wordsPerSentence, flow.longSentences);
```

可以接进 CI —— 文档变难就让构建失败。

## 词表

`everyday` 是底座，其余三个是**叠加包**：每个只装自己那部分额外的词，要跟 `everyday` 一起用。

| 名字 | 词量 | 装了什么 |
|---|---|---|
| `everyday` | 2803 | 日常高频词。底座，单独用就是最简单的级别。 |
| `academic` | 962 | 学术词。`--dict everyday,academic` |
| `tech` | 244 | 软件词：api、deploy、schema…… `--dict everyday,tech` |
| `frameworks` | 803 | 工具和库名：vue、vite、docker…… `--dict everyday,tech,frameworks` |

按读者选，够用就行。**词表越小，标出来要改的词越多**——这正是它的用意。别为了让分数好看就换个大词表。

自己的词表就是一行一个词：

```bash
cat draft.md | npx easyen --dict everyday,tech,./our-product-names.txt
```

## 输出里有什么

| 字段 | 意思 |
|---|---|
| `total` / `covered` | 一共数了多少词，其中多少在词表里 |
| `ratio` | 0 到 1，词表覆盖率。越高越好读。 |
| `hardWords` | 不在词表里的词，按字母排。要改的就是这些。 |
| `hardWordCounts` | 同样这些词，带出现次数，多的在前。先改高频的。 |
| `details` | 每个词的明细：原形、是否认识。**命令行要加 `--details` 才有** |
| `sentences.wordsPerSentence` | 平均句长，越低越好读 |
| `sentences.longest` | 最长的句子有多少词 |
| `sentences.longSentences` | 超过 30 词的句子。要拆的就是这些。 |

命令行默认不输出 `details`。一篇 420 词的 README，这些明细占输出的 95%
——约 14,900 tokens 对 700 tokens——而这个工具主要是给 AI 读的，每个 token
都要花钱。真正拿来动手的东西都在 `hardWords` 和 `hardWordCounts` 里。
库始终返回 `details`，只有命令行不打印。

## 它不做什么

* **不改你的文字。** 它只指出来，改不改你（或者 AI）说了算——有些难词，你的读者本来就认识。
* **不是语法或拼写检查。** 那个请用专门的工具。
* **不认识你的读者。** `ratio` 是个信号，不是分数线，没有必须达到的数字。
* **看不懂代码。** Markdown 用 `--markdown` 就行；其他格式要自己先去掉代码和链接。

## 设计取向

* **只量，不评判。** 两个数字、两份清单。没有五十页规则书，不夹带写作口味。
* **零运行时依赖。** 纯 TypeScript，221 个测试，92% 覆盖率。
* **小而纯的函数。** 每一步都单独导出，你可以自己拼流程。

这一页自己也过了这关，你可以自己跑一遍：

```bash
npx easyen --file README.md --dict everyday,tech --markdown
```

英文版 **`ratio` 0.95**，平均 7 词左右一句。唯一那句超过 30 词的，
就是开头引用的那段 AI 原文——故意留着的，因为这一页讲的就是它。
`SKILL.md` 没有这种示例，是 0.97，一个长句都没有。

## 许可

MIT © [zhangxiangliang](https://github.com/zhangxiangliang)
