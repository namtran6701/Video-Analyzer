import words from "./vo_words.json";
import { ACT, BPM, FPS, bar } from "./tokens";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(" ").filter(Boolean);

// Spoken-word cues for one act, in beats local to its Sequence, so actions land on the word that names them.
export const voice = (act: keyof typeof ACT) => {
  const t0 = bar(ACT[act]) / FPS;
  const toBeats = (s: number) => ((s - t0) * BPM) / 60;
  let from = words.findIndex((w) => w.t >= t0 - 1);
  // Each word of `text` in order, searched forward from the previous match (and from earlier calls).
  const seq = (text: string) =>
    norm(text).map((n) => {
      const i = words.findIndex((w, k) => k >= from && w.w === n);
      if (i < 0) throw new Error(`VO word "${n}" not found after ${act}`);
      from = i + 1;
      return toBeats(words[i].t);
    });
  const at = (text: string) => seq(text)[0];
  return { seq, at };
};

// Piecewise-linear time warp: maps an act's original beat schedule onto VO-keyed beats.
export const warp = (pairs: [number, number][]) => (b: number) => {
  for (let i = 1; i < pairs.length; i++) {
    const [a0, b0] = pairs[i - 1];
    const [a1, b1] = pairs[i];
    if (b <= a1 || i === pairs.length - 1) return b0 + ((b - a0) * (b1 - b0)) / (a1 - a0);
  }
  return b;
};
