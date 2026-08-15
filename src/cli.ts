#!/usr/bin/env node
/**
 * Command-line interface for easyen. Reads text from stdin (the Unix way) and
 * prints JSON, so it composes with other tools across platforms:
 *
 *   cat doc.md | npx easyen --dict everyday,tech     # macOS / Linux
 *   Get-Content doc.md | npx easyen                  # Windows PowerShell
 *   type doc.md | npx easyen                         # Windows cmd
 *
 * When piping is not convenient, read a file directly:  npx easyen --file doc.md
 *
 * Zero dependencies: arguments are parsed by hand.
 */
import { readFileSync } from "node:fs";
import {
  checkCoverage,
  checkSentences,
  listDictionaries,
  combineDictionaries,
  stripMarkdown,
  CheckOptions,
  DictionarySource,
} from "./index";

interface CliArgs {
  dict: string;
  file?: string;
  markdown: boolean;
  details: boolean;
  options: CheckOptions;
  help: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    dict: "everyday",
    options: {},
    markdown: false,
    details: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    switch (argv[i]) {
      case "-h":
      case "--help":
        args.help = true;
        break;
      case "-d":
      case "--dict":
        args.dict = argv[++i] ?? args.dict;
        break;
      case "-f":
      case "--file":
        args.file = argv[++i];
        break;
      case "-m":
      case "--markdown": // drop code, links and markup before counting
        args.markdown = true;
        break;
      case "--details": // per-word rows, off by default (they are 95% of the output)
        args.details = true;
        break;
      case "--proper-nouns": // ignore likely proper nouns
        args.options.ignoreProperNouns = true;
        break;
      case "--count-numbers": // count numbers instead of ignoring them
        args.options.ignoreNumbers = false;
        break;
    }
  }

  return args;
}

const HELP = `easyen — check how easy an English text is to read. Prints JSON.

Reads text from stdin (pipe it in), the standard Unix way. Works on any shell
that supports pipes (bash, PowerShell, cmd). If piping is hard, use --file.

Usage:
  cat file.md | easyen [options]            # macOS / Linux
  Get-Content file.md | easyen [options]    # Windows PowerShell
  easyen --file file.md [options]           # any OS, no pipe

Options:
  -d, --dict <spec>   Word list to use (default: everyday). Comma-separated to
                      combine: each item is a built-in name OR a path to a
                      word-list file. e.g.  --dict everyday,tech,./terms.txt
  -f, --file <path>   Read the text from a file instead of stdin
  -m, --markdown      Treat the input as Markdown: drop code blocks, inline
                      code, URLs and HTML before counting. Use this for a
                      README, or badges and file paths count as hard words.
  --details           Add a row per word (base form, known or not). Off by
                      default: it is 95% of the output and you rarely need it.
  --proper-nouns      Ignore capitalised unknown words (names, places)
  --count-numbers     Count numbers instead of ignoring them
  -h, --help          Show this help

Built-in word lists: ${listDictionaries().join(", ")}`;

/**
 * Turn a --dict spec into a dictionary. A single built-in name is passed
 * through (so its cached Set is reused); anything else (multiple items, or a
 * file path) is read and merged into one Set.
 */
function resolveDictSpec(spec: string): DictionarySource {
  const builtins = new Set<string>(listDictionaries());
  const parts = spec.split(",").map((s) => s.trim()).filter(Boolean);

  if (parts.length === 1 && builtins.has(parts[0]!)) return parts[0]!;

  const sources: DictionarySource[] = parts.map((part) =>
    builtins.has(part) ? part : readFileSync(part, "utf8").split(/\s+/)
  );
  return combineDictionaries(...sources);
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));

  // --help, or no input at all (no --file and nothing piped): show help.
  if (args.help || (!args.file && process.stdin.isTTY)) {
    console.log(HELP);
    return;
  }

  try {
    const raw = args.file ? readFileSync(args.file, "utf8") : readStdin();
    if (!raw.trim()) {
      console.error("No text given. Pipe text in, or use --file <path>.");
      process.exitCode = 1;
      return;
    }
    const text = args.markdown ? stripMarkdown(raw) : raw;
    const { details, ...result } = checkCoverage(
      text,
      resolveDictSpec(args.dict),
      args.options
    );
    const sentences = checkSentences(text);

    // `details` is one row per word — on a 420-word README that is 95% of the
    // output, and this tool is mostly read by an AI paying for every token.
    // Everything you act on is in hardWords and hardWordCounts.
    console.log(
      JSON.stringify(
        args.details ? { ...result, details, sentences } : { ...result, sentences },
        null,
        2
      )
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

function readStdin(): string {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

main();
