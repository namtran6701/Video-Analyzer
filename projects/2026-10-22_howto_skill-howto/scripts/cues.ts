// Writes docs/sfx.json from footage events so SFX stay locked to the picture.
import { writeFileSync } from "node:fs";
import { ev, SECTION, transforms } from "../src/timeline";
import { FPS } from "../src/tokens";

const s = (f: number) => +(f / FPS).toFixed(3);
const click = (f: number) => ({ t: s(f), type: "click", gain: 0.35 });
const press = SECTION.outro[0] + Math.round(1.4 * FPS);
const cues = [
  ...[3.6, 4.95, 7.65, 8.9, 16.15, 17.7, 20.4, 28.6, 45.25].map((t) => click(ev(0, t))),
  click(ev(0, 6.25, "pdf_skill_result")),
  ...[21.0, 21.95, 22.2, 29.6, 30.0, 30.4].map((t) => ({ t: s(ev(0, t)), type: "tick", gain: 0.25 })),
  { t: s(ev(0, 17.8)), type: "pop", gain: 0.3, pitch: -5 },
  { t: s(Math.round(0.8 * FPS)), type: "pop", gain: 0.25, pitch: -2 },
  { t: s(SECTION.demo[0] - 20), type: "whoosh", gain: 0.35 },
  ...transforms.map((t) => ({ t: s(t.f), type: "swish", gain: 0.3 })),
  { t: s(press), type: "click", gain: 0.3 },
];
writeFileSync("docs/sfx.json", JSON.stringify(cues.sort((a, b) => a.t - b.t), null, 1));
