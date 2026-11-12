// Beat-locked score synthesizer, no deps: node score.mjs plan.json out/score.wav
// plan.json: { "bpm": 116, "dur": 60, "key": "A", "scale": "minor", "palette": "analog", "seed": 1,
//              "sections": [{ "bar": 0, "energy": 1 }, { "bar": 8, "energy": 2 }, { "bar": 12, "energy": 3 }] }
// palette: analog | glass | cinematic | lofi | tech (instruments, kit, groove, space). Optional "progression": 0-4.
// energy 0 silence, 1 pad, 2 pad + bass + arp + hats, 3 full kit with sidechain pump.
// Stepping up into energy 2+ adds a riser over the previous bar and an impact on the downbeat.
// The seed picks the progression and arp pattern and humanizes velocities.
// Beat 0 is t = 0, the same grid as `beats.py --bpm`. Rhythms are 16-step strings, one char per 16th.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const PALETTES = {
  analog: {
    pad: { wave: 'saw', detune: [-9, 0, 9], cut: [0, 900, 1800, 3200], gain: 0.07, attack: [0.5, 0.05] },
    bass: { wave: 'sub', 2: ['x.......x.......', 1], 3: ['x.x.x.x.x.x.x.x.', 0.9] },
    arp: { wave: 'saw', octave: 1, 2: 'x.x.x.x.x.x.x.x.', 3: 'xxxxxxxxxxxxxxxx', len: 0.3, decay: 9, cut: true, echo: true, gain: 0.09 },
    kit: { kick: [45, 110, 7], snare: 'clap', kickAt: 'x...x...x...x...', snareAt: '....x.......x...', hats: ['..x...x...x...x.', 'xxxxxxxxxxxxxxxx'], hatDecay: 40 },
    swing: 0, duck: 0.55, verb: [0.84, 0.2, 0.015], riser: 'noise',
  },
  glass: {
    pad: { wave: 'tri', detune: [-6, 6], cut: [0, 2500, 4000, 6000], gain: 0.06, attack: [1.2, 0.4] },
    bass: { wave: 'sine', 2: ['x.......x.......', 1], 3: ['x...x...x...x...', 0.8] },
    arp: { wave: 'bell', octave: 2, 2: 'x.x.x.x.x.x.x.x.', 3: 'x.xxx.xxx.xxx.xx', len: 0.9, decay: 5, cut: false, echo: true, gain: 0.07 },
    kit: { kick: [48, 90, 8], snare: 'rim', kickAt: 'x.........x.....', snareAt: '....x.......x...', hats: ['..x...x...x...x.', 'x.x.x.x.x.x.x.x.'], hatDecay: 90 },
    sevenths: true, swing: 0, duck: 0.3, verb: [0.9, 0.3, 0.022], riser: 'swell',
  },
  cinematic: {
    pad: { wave: 'saw', detune: [-12, -4, 4, 12], cut: [0, 500, 900, 1600], gain: 0.07, attack: [1.5, 0.8] },
    bass: { wave: 'saw', cut: 700, 2: ['x.x.x.x.x.x.x.x.', 0.45], 3: ['xxxxxxxxxxxxxxxx', 0.5] },
    arp: { wave: 'tri', octave: 2, 2: 'x...x...x...x...', 3: 'x.x.x.x.x.x.x.x.', len: 0.7, decay: 4, cut: false, echo: true, gain: 0.08 },
    kit: { kick: [38, 60, 3.5], kickLen: 1.2, snare: 'none', kickAt: 'x.....x.x.....x.', snareAt: '', hats: ['..x...x...x...x.', 'x.x.x.x.x.x.x.x.'], hatDecay: 120 },
    swing: 0, duck: 0.2, verb: [0.92, 0.35, 0.025], riser: 'swell',
  },
  lofi: {
    pad: { wave: 'keys', detune: [-4, 4], cut: [0, 2500, 3000, 3500], gain: 0.08, attack: [0.01, 0.01], decay: 1.2, at: 'x.....x...x.....' },
    bass: { wave: 'sine', 2: ['x.....x...x.....', 0.85], 3: ['x.....x...x...x.', 0.8] },
    arp: { wave: 'keys', octave: 1, 2: 'x...x..x..x.....', 3: 'x..x..x.x.x..x..', len: 0.6, decay: 5, cut: false, echo: false, gain: 0.07 },
    kit: { kick: [50, 80, 9], snare: 'snare', kickAt: 'x......x..x.....', snareAt: '....x.......x...', hats: ['x.x.x.x.x.x.x.x.', 'x.x.x.x.x.x.x.xx'], hatDecay: 50 },
    sevenths: true, swing: 0.55, duck: 0.25, verb: [0.8, 0.45, 0.012], riser: 'noise', lofi: true,
  },
  tech: {
    pad: { wave: 'square', detune: [-5, 5], cut: [0, 700, 1400, 2600], gain: 0.045, attack: [0.4, 0.02] },
    bass: { wave: 'square', cut: 500, 2: ['x.x.x.x.x.x.x.x.', 0.5], 3: ['..x...x...x...x.', 0.7] },
    arp: { wave: 'square', octave: 1, 2: 'xxxxxxxxxxxxxxxx', 3: 'xxxxxxxxxxxxxxxx', len: 0.12, decay: 22, cut: true, echo: true, gain: 0.06 },
    kit: { kick: [50, 140, 10], snare: 'rim', kickAt: 'x...x...x...x...', snareAt: '....x.......x..x', hats: ['..x...x...x...x.', 'xxxxxxxxxxxxxxxx'], hatDecay: 80 },
    swing: 0, duck: 0.5, verb: [0.75, 0.2, 0.01], riser: 'noise',
  },
};
// Scale degrees from the tonic. minor: i VI III VII, i iv v i, i VI iv v, i VII VI VII, VI VII i i
const PROGS = {
  minor: [[0, 5, 2, 6], [0, 3, 4, 0], [0, 5, 3, 4], [0, 6, 5, 6], [5, 6, 0, 0]],
  major: [[0, 4, 5, 3], [0, 3, 4, 4], [5, 3, 0, 4], [0, 5, 3, 4], [3, 0, 4, 5]],
};
const PATTERNS = [[0, 1, 2, 3, 2, 1], [0, 2, 1, 3], [0, 1, 2, 3], [3, 2, 1, 0], [0, 2, 3, 1, 2, 0, 3, 1], [0, 0, 2, 1, 3, 2]];

const [planPath, outPath = 'out/score.wav'] = process.argv.slice(2);
const plan = JSON.parse(readFileSync(planPath, 'utf8'));
const { bpm = 116, dur, key = 'A', scale = 'minor', seed = 1, palette = 'analog', sections } = plan;
if (!dur || !sections?.length) throw new Error('plan needs dur and sections');
const P = PALETTES[palette];
if (!P) throw new Error(`unknown palette ${palette}: ${Object.keys(PALETTES).join(', ')}`);

const SR = 48000;
const N = Math.ceil(dur * SR);
const BEAT = 60 / bpm;
const BAR = BEAT * 4;
const STEP = BEAT / 4;
const BARS = Math.ceil(dur / BAR);

let s = Math.imul((seed >>> 0) ^ 0x9e3779b9, 0x85ebca6b) ^ 0xc2b2ae35; // spread nearby seeds apart
const rand = () => {
  s = (s + 0x6d2b79f5) | 0;
  let r = Math.imul(s ^ (s >>> 15), 1 | s);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rand() * 2 - 1;

const progIndex = plan.progression ?? Math.floor(rand() * PROGS[scale].length);
const PROG = PROGS[scale][progIndex];
const PATTERN = PATTERNS[Math.floor(rand() * PATTERNS.length)];

const NOTES = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
const STEPS = { minor: [0, 2, 3, 5, 7, 8, 10], major: [0, 2, 4, 5, 7, 9, 11] }[scale];
const BASE = 48 + NOTES[key]; // pad register around C3-A3
const hz = (m) => 440 * 2 ** ((m - 69) / 12);
const deg = (d) => STEPS[d % 7] + 12 * Math.floor(d / 7);
const chord = (b) => {
  const d = PROG[b % 4];
  return (P.sevenths ? [d, d + 2, d + 4, d + 6] : [d, d + 2, d + 4]).map(deg);
};
const hits = (pattern) => [...pattern].flatMap((c, i) => (c === 'x' ? [i] : []));
// 16th step -> seconds within the bar, with the off-8ths pushed late by the swing amount.
const at = (step) => step * STEP + (step % 4 === 2 ? P.swing * STEP : 0);

const sorted = [...sections].sort((a, b) => a.bar - b.bar);
const energyAt = (b) => sorted.findLast((x) => x.bar <= b)?.energy ?? 0;

const dryL = new Float32Array(N), dryR = new Float32Array(N);
const duckL = new Float32Array(N), duckR = new Float32Array(N);
const sendL = new Float32Array(N), sendR = new Float32Array(N);
const DUCK = new Float32Array(N).fill(1);

// Writes one voice; fn(t, progress) is called once per sample in order, so it may hold filter state.
function note(t0, len, pan, gain, fn, { send = 0, duck = false } = {}) {
  const s0 = Math.round(t0 * SR);
  const n = Math.round(len * SR);
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  const [L, R] = duck ? [duckL, duckR] : [dryL, dryR];
  for (let i = 0; i < n && s0 + i < N; i++) {
    if (s0 + i < 0) continue;
    const v = fn(i / SR, i / n);
    const j = s0 + i;
    L[j] += v * gl;
    R[j] += v * gr;
    sendL[j] += v * gl * send;
    sendR[j] += v * gr * send;
  }
}

const coef = (fc) => 1 - Math.exp((-2 * Math.PI * fc) / SR);
const lowpass = () => { let y = 0; return (x, fc) => (y += coef(fc) * (x - y)); };
const highpass = () => { const lp = lowpass(); return (x, fc) => x - lp(x, fc); };
const blep = (p, dt) => {
  if (p < dt) { p /= dt; return p + p - p * p - 1; }
  if (p > 1 - dt) { p = (p - 1) / dt; return p * p + p + p + 1; }
  return 0;
};
const TAU = 2 * Math.PI;
const LEVEL = { saw: 1, square: 0.6, sine: 1.2, tri: 1.1, sub: 1, bell: 0.8, keys: 0.9 };

// Oscillator returning (t) => sample, t in seconds since note start (FM voices use it for their index decay).
function osc(wave, f) {
  let p = rand();
  const dt = f / SR;
  const tick = () => { p += dt; if (p >= 1) p -= 1; return p; };
  const g = LEVEL[wave];
  switch (wave) {
    case 'saw': return () => { const q = tick(); return g * (2 * q - 1 - blep(q, dt)); };
    case 'square': return () => { const q = tick(); return g * ((q < 0.5 ? 1 : -1) + blep(q, dt) - blep((q + 0.5) % 1, dt)); };
    case 'sine': return () => g * Math.sin(TAU * tick());
    case 'tri': return () => g * (4 * Math.abs(tick() - 0.5) - 1);
    case 'sub': {
      const sw = osc('saw', f), lp = lowpass();
      return () => g * (Math.sin(TAU * tick()) + 0.3 * lp(sw(), 380));
    }
    case 'bell': {
      let m = rand();
      return (t) => { m = (m + 3.5 * dt) % 1; return g * Math.sin(TAU * tick() + 4 * Math.exp(-t * 6) * Math.sin(TAU * m)); };
    }
    case 'keys': {
      let m = rand();
      return (t) => {
        m = (m + dt) % 1;
        const q = tick();
        return g * (Math.sin(TAU * q + (1.6 * Math.exp(-t * 12) + 0.3) * Math.sin(TAU * m)) + 0.15 * Math.sin(2 * TAU * q));
      };
    }
  }
  throw new Error(`unknown wave ${wave}`);
}
const env = (t, len, a, r) => Math.max(0, Math.min(1, t / a, (len - t) / r));

function kick(t0) {
  const [f, sweep, decay] = P.kit.kick;
  const len = P.kit.kickLen ?? 0.5;
  let ph = 0;
  note(t0, len, 0, 0.9, (t) => {
    ph += (TAU * (f + sweep * Math.exp(-t * 30))) / SR;
    return Math.sin(ph) * Math.exp(-t * decay) + 0.2 * noise() * Math.exp(-t * 400);
  }, { send: P.kit.kickLen ? 0.3 : 0 });
}

function snare(t0, vel) {
  const hp = highpass(), lp = lowpass();
  if (P.kit.snare === 'clap') {
    note(t0, 0.35, 0, 0.3 * vel, (t) => {
      let a = 0.6 * Math.exp(-t * 18);
      for (let f = 0; f < 3; f++) if (t >= f * 0.011) a += Math.exp(-(t - f * 0.011) * 180);
      return lp(hp(noise(), 800), 3000) * a;
    }, { send: 0.35 });
  } else if (P.kit.snare === 'snare') {
    let ph = 0;
    note(t0, 0.3, 0, 0.35 * vel, (t) => {
      ph += (TAU * 185) / SR;
      return 0.5 * Math.sin(ph) * Math.exp(-t * 20) + lp(hp(noise(), 1000), 5000) * Math.exp(-t * 14);
    }, { send: 0.25 });
  } else if (P.kit.snare === 'rim') {
    let ph = 0;
    note(t0, 0.08, 0.1, 0.3 * vel, (t) => {
      ph += (TAU * 1700) / SR;
      return (Math.sin(ph) + 0.5 * hp(noise(), 2000)) * Math.exp(-t * 60);
    }, { send: 0.3 });
  }
}

const kicks = [];

for (let b = 0; b < BARS; b++) {
  const e = energyAt(b);
  if (!e) continue;
  const t0 = b * BAR;
  const c = chord(b);

  // Pad: closed voicing inside one octave for smooth voice leading, plus the root an octave down.
  const padHits = hits(P.pad.at ?? 'x...............');
  padHits.forEach((st, k) => {
    const len = ((padHits[k + 1] ?? 16) - st) * STEP + 0.6;
    for (const m of [BASE - 12 + c[0], ...c.map((x) => BASE + (x % 12))]) {
      for (const cents of P.pad.detune) {
        const o = osc(P.pad.wave, hz(m) * 2 ** (cents / 1200));
        const lp1 = lowpass(), lp2 = lowpass();
        const attack = P.pad.attack[e === 1 ? 0 : 1];
        const vel = 0.9 + 0.1 * rand();
        note(t0 + at(st), len, cents / 12, P.pad.gain * vel * (e === 1 ? 1 : 0.85), (t) => {
          const fc = P.pad.cut[e] * (1 + 0.15 * Math.sin(TAU * 0.1 * (t0 + t)));
          const decay = P.pad.decay ? Math.exp(-t * P.pad.decay) : 1;
          return lp2(lp1(o(t), fc), fc) * env(t, len, attack, 0.6) * decay;
        }, { send: 0.45, duck: true });
      }
    }
  });

  if (e >= 2) {
    const [pattern, gate] = P.bass[e];
    const bassHits = hits(pattern);
    const m = BASE - 24 + c[0];
    bassHits.forEach((st, k) => {
      const len = ((bassHits[k + 1] ?? 16) - st) * STEP * gate;
      const o = osc(P.bass.wave, hz(m));
      const lp = lowpass();
      note(t0 + at(st), len, 0, 0.32 * (0.9 + 0.1 * rand()), (t) => {
        const v = o(t);
        return (P.bass.cut ? lp(v, P.bass.cut * (1 + 2 * Math.exp(-t * 20))) : v) * env(t, len, 0.005, 0.03);
      }, { duck: true });
    });

    // Arp: chord tones in the palette's register, in the seed's pattern order.
    const tones = c.map((x) => BASE + 12 * P.arp.octave + (x % 12)).sort((x, y) => x - y);
    tones.push(tones[0] + 12);
    hits(P.arp[e]).forEach((st, k) => {
      const m2 = tones[PATTERN[(b * 16 + k) % PATTERN.length] % tones.length];
      const vel = 0.8 + 0.2 * rand();
      const pan = k % 2 ? 0.35 : -0.35;
      const taps = P.arp.echo ? [[0, 1, pan], [0.75, 0.35, -pan], [1.5, 0.15, pan]] : [[0, 1, pan]];
      for (const [delay, g, p] of taps) {
        const o = osc(P.arp.wave, hz(m2));
        const lp = lowpass();
        note(t0 + at(st) + delay * BEAT, P.arp.len, p, P.arp.gain * vel * g, (t) => {
          const v = o(t);
          return (P.arp.cut ? lp(v, 300 + 3500 * Math.exp(-t * 18)) : v) * Math.exp(-t * P.arp.decay) * env(t, P.arp.len, 0.002, 0.02);
        }, { send: 0.35, duck: true });
      }
    });

    for (const st of hits(P.kit.hats[e - 2])) {
      const accent = st % 4 === 2;
      const hp = highpass();
      const decay = accent ? P.kit.hatDecay : P.kit.hatDecay * 1.8;
      note(t0 + at(st), 0.2, accent ? 0.2 : -0.2, (accent ? 0.07 : 0.035) * (0.75 + 0.25 * rand()),
        (t) => hp(noise(), 7000) * Math.exp(-t * decay), { send: 0.1 });
    }
  }

  if (e === 3) {
    for (const st of hits(P.kit.kickAt)) {
      kicks.push(t0 + at(st));
      kick(t0 + at(st));
    }
    for (const st of hits(P.kit.snareAt)) snare(t0 + at(st), 0.85 + 0.15 * rand());
  }

  // Riser into, and impact on, any step up to energy 2+.
  if (b > 0 && e >= 2 && e > energyAt(b - 1)) {
    if (P.riser === 'noise') {
      const lpL = lowpass(), lpR = lowpass();
      let side = 0;
      note(t0 - BAR, BAR, 0, 0.25, (t, p) => {
        side ^= 1;
        return (side ? lpL : lpR)(noise(), 300 * 30 ** p) * p * p;
      }, { send: 0.3 });
    } else {
      // Swell: the incoming chord fading in under a rising airy noise, like a reversed cymbal.
      for (const x of c) {
        const o = osc('saw', hz(BASE + (x % 12))), lp = lowpass();
        note(t0 - BAR, BAR, 0, 0.05, (t, p) => lp(o(t), 200 + 3000 * p * p) * p ** 3, { send: 0.6 });
      }
      const hp = highpass();
      note(t0 - BAR, BAR, 0, 0.12, (t, p) => hp(noise(), 3000) * p ** 4, { send: 0.6 });
    }
    let ph = 0;
    note(t0, 1.4, 0, 0.7, (t) => {
      ph += (TAU * (35 + 20 * Math.exp(-t * 6))) / SR;
      return Math.sin(ph) * Math.exp(-t * 3);
    });
    const lp = lowpass();
    note(t0, 0.6, 0, 0.25, (t) => lp(noise(), 2000) * Math.exp(-t * 8), { send: 0.8 });
  }
}

// Sidechain: everything on the duck bus dips under each kick and recovers within half a beat.
const duckLen = Math.round(0.5 * BEAT * SR);
for (const tk of kicks) {
  const s0 = Math.round(tk * SR);
  for (let i = 0; i < duckLen && s0 + i < N; i++) {
    const d = 1 - P.duck * Math.min(1, i / (0.004 * SR)) * (1 - i / duckLen) ** 2;
    DUCK[s0 + i] = Math.min(DUCK[s0 + i], d);
  }
}

// Freeverb-style plate on the send bus. verb: [feedback, damping, input level].
function reverb(input, spread) {
  const [fb, damp, level] = P.verb;
  const out = new Float32Array(N);
  const mk = (d) => ({ buf: new Float32Array(Math.round(((d + spread) * SR) / 44100)), i: 0, y: 0 });
  const combs = [1116, 1188, 1277, 1356, 1422, 1491].map(mk);
  const aps = [556, 441, 341].map(mk);
  for (let n = 0; n < N; n++) {
    const x = input[n] * level;
    let acc = 0;
    for (const c of combs) {
      const o = c.buf[c.i];
      c.y = o * (1 - damp) + c.y * damp;
      c.buf[c.i] = x + c.y * fb;
      c.i = (c.i + 1) % c.buf.length;
      acc += o;
    }
    for (const a of aps) {
      const o = a.buf[a.i];
      a.buf[a.i] = acc + o * 0.5;
      a.i = (a.i + 1) % a.buf.length;
      acc = o - acc;
    }
    out[n] = acc;
  }
  return out;
}
const wetL = reverb(sendL, 0), wetR = reverb(sendR, 23);

const L = new Float32Array(N), R = new Float32Array(N);
const mlL = lowpass(), mlR = lowpass(), crackle = lowpass();
let peak = 0;
for (let i = 0; i < N; i++) {
  L[i] = dryL[i] + duckL[i] * DUCK[i] + wetL[i];
  R[i] = dryR[i] + duckR[i] * DUCK[i] + wetR[i];
  if (P.lofi) {
    // Tape-dark top end, hiss and vinyl crackle.
    const on = energyAt(Math.floor(i / SR / BAR)) > 0 ? 1 : 0;
    const dust = crackle((rand() < 6 / SR ? noise() * 6 : 0) + noise() * 0.01, 2500) * 0.02 * on;
    L[i] = mlL(L[i], 5500) + dust;
    R[i] = mlR(R[i], 5500) + dust;
  }
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}

// Glue with a soft clip, land peaks at -1 dBFS, fade the last 0.25s.
const DRIVE = P.lofi ? 2 : 1.3;
const fadeN = Math.round(0.25 * SR);
const wav = Buffer.alloc(44 + N * 4);
wav.write('RIFF', 0);
wav.writeUInt32LE(36 + N * 4, 4);
wav.write('WAVEfmt ', 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(2, 22);
wav.writeUInt32LE(SR, 24);
wav.writeUInt32LE(SR * 4, 28);
wav.writeUInt16LE(4, 32);
wav.writeUInt16LE(16, 34);
wav.write('data', 36);
wav.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  const fade = Math.min(1, (N - i) / fadeN);
  for (const [ch, buf] of [[0, L], [1, R]]) {
    const v = (Math.tanh((DRIVE * buf[i]) / (peak || 1)) / Math.tanh(DRIVE)) * 0.89 * fade;
    wav.writeInt16LE(Math.round(v * 32767), 44 + i * 4 + ch * 2);
  }
}
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, wav);
console.log(`${outPath}: ${dur}s, ${bpm} BPM, ${key} ${scale}, ${palette}, progression ${progIndex}, pattern ${PATTERNS.indexOf(PATTERN)}, ${BARS} bars, ${kicks.length} kicks`);
