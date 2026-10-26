import { at, FPS } from "./tokens";
import { closeUp, Key, wide } from "./camera";

export type Clip = "use_skill" | "pdf_skill_result";

// A footage key: at film frame f the window shows `clip` at `src` seconds.
// Between two keys of the same clip the source time runs linearly; a clip change is a hard switch.
type FKey = { f: number; clip: Clip; src: number };

const build = (start: number, clip: Clip, src: number) => {
  const keys: FKey[] = [{ f: start, clip, src }];
  let f = start;
  const last = () => keys[keys.length - 1];
  const b = {
    hold(frames: number) {
      f += frames;
      keys.push({ ...last(), f });
      return b;
    },
    play(to: number, rate = 1) {
      f += Math.round(((to - last().src) * FPS) / rate);
      keys.push({ f, clip: last().clip, src: to });
      return b;
    },
    jump(clip: Clip, src: number) {
      keys.push({ f, clip, src });
      return b;
    },
    keys,
    end: () => f,
  };
  return b;
};

const DEMO = at(8);

// One window, one continuous take. Pauses where the cursor sits still are skipped
// with same-clip jumps; each jump dissolves over a few frames.
const w = build(DEMO, "use_skill", 2.9)
  .hold(16)
  .play(9.9)
  .jump("use_skill", 15.6)
  .play(22.5)
  .jump("use_skill", 28.1)
  .play(31.0)
  .jump("use_skill", 44.7)
  .play(49.5);
const WIPE = w.end();
w.jump("pdf_skill_result", 0.5).play(6.3, 1.2).play(8.3).play(11.0, 0.8);
const OUTRO = Math.ceil((w.end() + 8) / at(1)) * at(1);
w.hold(OUTRO + 30 - w.end());

export const SECTION = {
  opener: [0, DEMO],
  demo: [DEMO, OUTRO],
  outro: [OUTRO, OUTRO + at(12)],
} as const;
export const TOTAL = SECTION.outro[1];

export const footage = [w.keys];

export const footageAt = (keys: FKey[], frame: number) => {
  let i = keys.findIndex((k) => k.f > frame);
  if (i === -1) return keys[keys.length - 1];
  if (i === 0) return keys[0];
  // Several keys can share a frame (jumps); use the latest one at or before `frame`.
  const a = keys[i - 1];
  const b = keys[i];
  if (a.clip !== b.clip || b.f === a.f) return a;
  const p = (frame - a.f) / (b.f - a.f);
  return { f: frame, clip: a.clip, src: a.src + (b.src - a.src) * p };
};

// Film frame at which window w shows source second `src` of `clip`.
export const ev = (w: number, src: number, clip: Clip = "use_skill") => {
  const keys = footage[w];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (a.clip !== clip || b.clip !== clip || b.src === a.src) continue;
    if (src >= a.src && src <= b.src) return Math.round(a.f + ((src - a.src) / (b.src - a.src)) * (b.f - a.f));
  }
  throw new Error(`src ${src} of ${clip} not in window ${w}`);
};

export const DISSOLVE = 5;

// Transforms: the accent acts only where the AI delivers.
type Transform = { w: number; f: number; beforeSrc: number };
export const transforms: Transform[] = [{ w: 0, f: WIPE, beforeSrc: 49.5 }];

// AI working: window glow from send to result.
export const working = [[ev(0, 46.1), WIPE + 10]];

const pose = (f: number, p: { x: number; y: number; s: number }, ease?: string): Key => ({ f, ...p, ease });
const PDF = "pdf_skill_result";
const pdf = (src: number) => ev(0, src, PDF);
const IN = 22;
const OUT = 20;
const drift = "sine.inOut";

export const cameraKeys: Key[] = [
  // Push-through from the opener lands straight on the model menu.
  pose(DEMO - 18, { ...wide(0), s: 0.62 }),
  pose(DEMO + 26, closeUp(0, 240, 150, 1.9), "power3.inOut"),
  pose(ev(0, 5.2), closeUp(0, 260, 160, 1.95), drift),
  pose(ev(0, 5.2) + OUT, wide(0)),
  // + menu -> Files and folders -> pick the file
  pose(ev(0, 6.7), wide(0)),
  pose(ev(0, 6.7) + IN, closeUp(0, 560, 640, 1.8), "power3.inOut"),
  pose(ev(0, 9.0), closeUp(0, 580, 630, 1.85), drift),
  pose(ev(0, 9.0) + 18, closeUp(0, 710, 330, 1.5)),
  pose(ev(0, 17.7), closeUp(0, 720, 330, 1.55), drift),
  pose(ev(0, 17.7) + OUT, wide(0)),
  // /html -> pick the skill -> "convert to pdf" -> send
  pose(ev(0, 19.3), wide(0)),
  pose(ev(0, 19.3) + IN, closeUp(0, 700, 690, 1.85), "power3.inOut"),
  pose(ev(0, 30.9), closeUp(0, 720, 700, 1.9), drift),
  pose(ev(0, 30.9) + 18, closeUp(0, 860, 700, 1.45)),
  pose(ev(0, 45.4), closeUp(0, 870, 700, 1.47), drift),
  pose(ev(0, 45.4) + OUT, wide(0)),
  // Working: a slow push keeps the wait alive
  pose(WIPE, { ...wide(0), s: 1.06 }, drift),
  // Result card -> PDF preview
  pose(pdf(1.6), { ...wide(0), s: 1.06 }),
  pose(pdf(1.6) + IN, closeUp(0, 850, 360, 1.85), "power3.inOut"),
  pose(pdf(5.3), closeUp(0, 870, 365, 1.9), drift),
  pose(pdf(5.3) + OUT, wide(0)),
  pose(pdf(8.3), wide(0)),
  pose(OUTRO, closeUp(0, 1125, 450, 1.35), drift),
  // Outro: the window shrinks into the "/" key
  pose(OUTRO + 24, { ...wide(0), s: 0.1 }, "power3.inOut"),
];
