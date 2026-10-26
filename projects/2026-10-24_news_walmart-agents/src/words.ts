import words from "../docs/vo_words.json";
import { FPS } from "./tokens";

const LEAD = 2; // cut a hair before the word so the picture lands with it

export const wordStart = (i: number) => Math.round(words[i].start * FPS);

// Frame where `word` (prefix match, case-insensitive) starts in `row`; nth for repeats.
export const at = (row: number, word: string, nth = 0) => {
  const hits = words.filter((w) => w.row === row && w.word.toLowerCase().startsWith(word.toLowerCase()));
  if (!hits[nth]) throw new Error(`no "${word}" in row ${row}`);
  return Math.round(hits[nth].start * FPS);
};

export const rowStart = (row: number) => Math.round(words.find((w) => w.row === row)!.start * FPS) - LEAD;

export const VO_END = Math.round(words[words.length - 1].end * FPS);
