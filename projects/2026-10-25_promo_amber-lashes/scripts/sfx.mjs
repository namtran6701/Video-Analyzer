// Synthesize SFX from cues: node sfx.mjs cues.json out/sfx.wav [--dur 15] [--seed 1] [--key A]
// cues.json: [{ "t": 1.0, "type": "click", "gain": 1, "pitch": 0, "len": 0.05 }, ...]
// types: click | tick | pop | thump | chime | glitch | whoosh | swish | riser | impact
// pitch in semitones, len in seconds (optional). A riser ends at t, everything else starts at t.
// The seed sets the film's SFX character (register, brightness) and humanizes every cue, so repeats never
// sound identical. --key snaps pitched voices to the score's root or fifth.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { parseArgs } from 'node:util';

const { values: o, positionals: [cuesPath, outPath = 'out/sfx.wav'] } = parseArgs({
  allowPositionals: true,
  options: { dur: { type: 'string' }, seed: { type: 'string', default: '1' }, key: { type: 'string' } },
});
const SR = 48000;
const cues = JSON.parse(readFileSync(cuesPath, 'utf8'));
const dur = Number(o.dur ?? Math.max(0, ...cues.map((c) => c.t)) + 1.5);
const buf = new Float32Array(Math.ceil(dur * SR));

const BASE = Math.imul((Number(o.seed) >>> 0) ^ 0x9e3779b9, 0x85ebca6b) >>> 0;
let seed = BASE;
const rand = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32;
const noise = () => rand() * 2 - 1;

const SHIFT = [0, 7, -5, 12, -12][Math.floor(rand() * 5)];
const BRIGHT = 0.75 + 0.55 * rand();

const NOTES = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
const root = o.key == null ? null : NOTES[o.key];
if (o.key != null && root == null) throw new Error(`unknown key ${o.key}`);
const snap = (f) => {
  if (root == null) return f;
  const m = Math.round(69 + 12 * Math.log2(f / 440));
  for (let d = 0; ; d = d > 0 ? -d : 1 - d) {
    const pc = (((m + d) % 12) + 12) % 12;
    if (pc === root || pc === (root + 7) % 12) return 440 * 2 ** ((m + d - 69) / 12);
  }
};

const coef = (fc) => 1 - Math.exp((-2 * Math.PI * Math.min(fc, SR / 2.2)) / SR);
const lowpass = () => { let y = 0; return (x, fc) => (y += coef(fc) * (x - y)); };
const highpass = () => { const lp = lowpass(); return (x, fc) => x - lp(x, fc); };
const phasor = () => { let ph = 0; return (hz) => (ph += (2 * Math.PI * hz) / SR); };

// Each voice: [length s, gain, base Hz or null, sample(t, progress 0..1, f, k)] with k = per-cue filter and phase state.
const VOICES = {
  click: [0.05, 0.5, 1800, (t, p, f, k) => Math.sin(k.a(f)) * Math.exp(-t * 90)],
  tick: [0.03, 0.35, 3200, (t, p, f, k) => Math.sin(k.a(f)) * Math.exp(-t * 250) + 0.3 * noise() * Math.exp(-t * 600)],
  pop: [0.15, 0.5, 600, (t, p, f, k) => Math.sin(k.a(f * (1 + 1.5 * p))) * Math.exp(-t * 25)],
  thump: [0.5, 0.75, 90, (t, p, f, k) => Math.sin(k.a(f * (1 - 0.67 * p))) * Math.exp(-t * 8)],
  chime: [1.2, 0.3, 1320, (t, p, f, k) => Math.sin(k.a(f) + 3 * Math.exp(-t * 5) * Math.sin(k.b(f * 3.5))) * Math.exp(-t * 3.5)],
  glitch: [0.15, 0.25, 800, (t, p, f, k) => Math.sign(Math.sin(k.a(f * [1, 1.5, 0.5][Math.floor(p * 6) % 3]))) * (Math.floor(t * 90) % 2) * Math.exp(-t * 8)],
  whoosh: [0.35, 0.5, null, (t, p, f, k) => k.lp(noise(), (400 + 6000 * Math.sin(Math.PI * p)) * BRIGHT) * Math.sin(Math.PI * p)],
  swish: [0.18, 0.4, null, (t, p, f, k) => k.hp(noise(), (2000 + 6000 * p) * BRIGHT) * Math.sin(Math.PI * p) ** 2],
  riser: [1.5, 0.3, 220, (t, p, f, k) => (0.4 * Math.sin(k.a(f * 2 ** (2 * p))) + k.lp(noise(), 300 * 30 ** p * BRIGHT)) * p ** 3],
  impact: [1.4, 0.6, 50, (t, p, f, k) => Math.sin(k.a(f * (1 + 0.6 * Math.exp(-t * 6)))) * Math.exp(-t * 3) + 0.4 * k.lp(noise(), 2000 * BRIGHT) * Math.exp(-t * 10)],
};

for (const { t, type, gain = 1, pitch = 0, len } of cues) {
  // Reseed from the cue itself, so adding or editing one cue never changes how the others sound.
  seed = Math.imul(BASE ^ Math.round(t * 1000), 0x85ebca6b) ^ [...type].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261);
  const voice = VOICES[type];
  if (!voice) throw new Error(`unknown sfx type: ${type} (${Object.keys(VOICES).join(', ')})`);
  const [baseLen, g, base, fn] = voice;
  const f = base && snap(base * 2 ** ((SHIFT * (type === 'thump' || type === 'impact' ? 0 : 1) + pitch) / 12)) * 2 ** ((rand() - 0.5) * 0.02);
  const length = (len ?? baseLen) * (0.92 + 0.16 * rand());
  const amp = g * gain * 10 ** (((rand() - 0.5) * 3) / 20);
  const k = { a: phasor(), b: phasor(), lp: lowpass(), hp: highpass() };
  const at = Math.round((type === 'riser' ? t - length : t) * SR);
  const n = Math.round(length * SR);
  for (let i = 0; i < n && at + i < buf.length; i++) {
    const v = fn(i / SR, i / n, f, k) * amp;
    if (at + i >= 0) buf[at + i] += v;
  }
}

const wav = Buffer.alloc(44 + buf.length * 2);
wav.write('RIFF', 0);
wav.writeUInt32LE(36 + buf.length * 2, 4);
wav.write('WAVEfmt ', 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20); // PCM
wav.writeUInt16LE(1, 22); // mono
wav.writeUInt32LE(SR, 24);
wav.writeUInt32LE(SR * 2, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write('data', 36);
wav.writeUInt32LE(buf.length * 2, 40);
for (let i = 0; i < buf.length; i++) {
  wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, buf[i])) * 32767), 44 + i * 2);
}
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, wav);
console.log(`${outPath}: ${cues.length} cues, ${dur}s, shift ${SHIFT}, bright ${BRIGHT.toFixed(2)}`);
