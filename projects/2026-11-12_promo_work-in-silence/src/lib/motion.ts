// Closed-form motion helpers for Remotion. Pure functions of t in seconds: const t = frame / fps.
// Seeded noise comes from Remotion's random(seed), never Math.random.

type Spring = { k: number; d: number };

export const PRESETS = {
  snappy: { k: 320, d: 30 }, // buttons, toggles, leading edges
  default: { k: 170, d: 26 }, // cards, containers, camera
  title: { k: 220, d: 22 },
  stagger: { k: 260, d: 20 }, // grid stagger
  heavy: { k: 120, d: 22 }, // big type, 3D plates, logo lockups
  playful: { k: 200, d: 12 }, // mascots, stickers, visible overshoot
  trail: { k: 140, d: 22 }, // trailing edges
} satisfies Record<string, Spring>;

type Cfg = Spring | keyof typeof PRESETS;

// Progress 0 -> 1 of a unit-mass damped spring released at t = 0.
export function spring(t: number, cfg: Cfg = 'default'): number {
  if (t <= 0) return 0;
  const { k, d } = typeof cfg === 'string' ? PRESETS[cfg] : cfg;
  const w0 = Math.sqrt(k);
  const zeta = d / (2 * w0);
  if (zeta >= 1) return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
  const wd = w0 * Math.sqrt(1 - zeta * zeta);
  const a = zeta * w0;
  return 1 - Math.exp(-a * t) * (Math.cos(wd * t) + (a / wd) * Math.sin(wd * t));
}

// keys: [[t0, v0], [t1, v1], ...]. One spring per change, summed, so motion stays continuous.
export function track(t: number, keys: [number, number][], cfg?: Cfg): number {
  let v = keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    v += (keys[i][1] - keys[i - 1][1]) * spring(t - keys[i][0], cfg);
  }
  return v;
}

// stops: [[t, left, right], ...]. Leading edge stiff, trailing edge soft, so the shape stretches.
export function indicator(t: number, stops: [number, number, number][], lead: Cfg = 'snappy', trail: Cfg = 'trail') {
  const L = stops.map(([s, l]) => [s, l] as [number, number]);
  const R = stops.map(([s, , r]) => [s, r] as [number, number]);
  return {
    left: Math.min(track(t, L, lead), track(t, L, trail)),
    right: Math.max(track(t, R, lead), track(t, R, trail)),
  };
}

// Text enters after the morph starts and leaves before the next one.
export function swapAlpha(t: number, tIn: number, tOut?: number, delay = 0.08, fade = 0.12, lead = 0.1): number {
  const clamp = (x: number) => Math.max(0, Math.min(1, x));
  const fadeIn = clamp((t - tIn - delay) / fade);
  const fadeOut = tOut == null ? 1 : clamp((tOut - lead - t) / fade);
  return Math.min(fadeIn, fadeOut);
}

export const loopT = (t: number, dur: number) => ((t % dur) + dur) % dur;
