# [2.0.0](https://github.com/zhangxiangliang/easyen/compare/v1.2.1...v2.0.0) (2026-08-15)


* feat!: hide details from CLI output unless --details is given ([747a716](https://github.com/zhangxiangliang/easyen/commit/747a716d048a46fee740880ddc205b2f7e144db5))


### BREAKING CHANGES

* the CLI no longer prints the `details` array by
default. Pass --details to get it back.

On a 420-word README those rows were 96% of the output — about
16,000 tokens instead of 700 — and this tool is mostly read by an
AI that pays for every one of them. Nothing actionable was lost:
hardWords and hardWordCounts already carry it.

The library is unchanged. checkCoverage() still returns details,
which costs nothing in memory; only the CLI leaves it out.

## [1.2.1](https://github.com/zhangxiangliang/easyen/compare/v1.2.0...v1.2.1) (2026-08-15)


### Bug Fixes

* keep markers that sit inside a word ([e1bbb2c](https://github.com/zhangxiangliang/easyen/commit/e1bbb2c4e56b6d772f1420fe2beab45deb9f78c5))
* stop split fragments turning into hard words ([eeb530f](https://github.com/zhangxiangliang/easyen/commit/eeb530fc0307f56129fd786f78a7c8733426867d))

# [1.2.0](https://github.com/zhangxiangliang/easyen/compare/v1.1.0...v1.2.0) (2026-08-15)


### Bug Fixes

* recognise cannot, un- words, skip and readable ([49a324d](https://github.com/zhangxiangliang/easyen/commit/49a324d9eb783b4626ab98b565488b2810ce0c5c))


### Features

* add --markdown to strip code, links and markup before counting ([b39c7ed](https://github.com/zhangxiangliang/easyen/commit/b39c7ed43c72486192643f3e124e076d9832eb55))

# [1.1.0](https://github.com/zhangxiangliang/easyen/compare/v1.0.0...v1.1.0) (2026-08-15)


### Features

* round ratio and wordsPerSentence to two decimals ([c1f89eb](https://github.com/zhangxiangliang/easyen/commit/c1f89ebac5213bfa0aeec1803f348ce04258e014))

# 1.0.0 (2026-06-27)


### Features

* easyen — check how easy English is to read ([c68da15](https://github.com/zhangxiangliang/easyen/commit/c68da1531d9c2a26cc6db90118d39e7ab5ce4f22))
