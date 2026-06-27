<div align="center">

# easyen

判断一段英文好不好读，帮 AI 把输出控制在读者能懂的水平。

[English](README.EN.md) · [简体中文](README.md)

[![npm](https://img.shields.io/npm/v/easyen.svg)](https://www.npmjs.com/package/easyen)
[![downloads](https://img.shields.io/npm/dm/easyen.svg)](https://www.npmjs.com/package/easyen)
[![license](https://img.shields.io/npm/l/easyen.svg)](https://github.com/zhangxiangliang/easyen/blob/main/LICENSE)
[![typescript](https://img.shields.io/badge/language-typescript-blue.svg)](https://www.typescriptlang.org)

</div>

你有没有发现，让 AI 写英文，它总爱端着——简单的意思非说得文绉绉，一个意思还换着好几种说法，读起来累人。这不怪它，是训练出来的习惯，它自己没感觉。

easyen 就帮 AI 量两件事，提醒它把话说简单点：

* **词汇** —— 哪些词超纲了，挑出来。
* **句子** —— 哪些句子太长了，挑出来。

它只量、不改。哪些词偏难、哪些句子绕，给你标得清清楚楚；至于换不换、怎么换，AI 自己拿主意。

## 如何使用

把下面这句话丢给你的 AI（比如 Claude Code），剩下的它自己搞定：

> Read and follow https://github.com/zhangxiangliang/easyen/blob/main/SKILL.md
