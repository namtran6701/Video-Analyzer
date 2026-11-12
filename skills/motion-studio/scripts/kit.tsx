// 2D scene primitives every film needs. Copy to src/lib/kit.tsx, next to motion.ts.
// Style-neutral: colors, sizes and fonts come in as props from the style skill's tokens.
// Everything is a pure function of t in seconds (const t = frame / fps), local to its Sequence.
import type { CSSProperties, ReactNode } from 'react';
import { Easing } from 'remotion';
import { track } from './motion';

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const outQuart = Easing.out(Easing.poly(4)); // GSAP power3.out
export const outExpo = Easing.out(Easing.exp); // GSAP expo.out
export const inExpo = Easing.in(Easing.exp);

// 0 before t0, 1 after t0 + d.
export const ramp = (t: number, t0: number, d: number, ease = outQuart) => ease(clamp01((t - t0) / d));

// Characters of s revealed between t0 and t1.
export const typed = (s: string, t: number, t0: number, t1: number) => s.slice(0, Math.round(clamp01((t - t0) / (t1 - t0)) * s.length));

// Click press 0..1..0 around a click at tc.
export const press = (t: number, tc: number) => {
  const d = t - tc;
  return d < -0.06 || d > 0.2 ? 0 : d < 0 ? (d + 0.06) / 0.06 : 1 - d / 0.2;
};

// Hard-edged wipe as a clip-path, p 0..1 from the given side.
export const wipe = (p: number, from: 'left' | 'right' | 'top' | 'bottom' = 'left') => {
  const r = `${(1 - clamp01(p)) * 100}%`;
  return from === 'left' ? `inset(0 ${r} 0 0)` : from === 'right' ? `inset(0 0 0 ${r})` : from === 'top' ? `inset(0 0 ${r} 0)` : `inset(${r} 0 0 0)`;
};

// Section swap as one clip: revealed left to right by pIn, cleared left to right by pOut.
export const band = (pIn: number, pOut = 0) => `inset(0 ${(1 - clamp01(pIn)) * 100}% 0 ${clamp01(pOut) * 100}%)`;

export type CursorKey = { t: number; x: number; y: number; click?: boolean };

// Each key's t is when the cursor arrives (and clicks, with `click`), so put t on the beat.
// It leaves for the key `travel` seconds earlier and springs there without overshoot.
export const cursorAt = (keys: CursorKey[], t: number, travel = 0.5) => ({
  x: track(t, keys.map((k, i) => [i ? k.t - travel : k.t, k.x])),
  y: track(t, keys.map((k, i) => [i ? k.t - travel : k.t, k.y])),
  press: Math.max(0, ...keys.filter((k) => k.click).map((k) => press(t, k.t))),
});

// The arrow's tip sits at (x, y).
export const Cursor = ({ x, y, size, press: p = 0, opacity = 1, fill = '#1b1b1b', stroke = '#fff' }: { x: number; y: number; size: number; press?: number; opacity?: number; fill?: string; stroke?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{ position: 'absolute', left: x - size / 6, top: y - size / 12, opacity, transform: `scale(${1 - p * 0.15})`, transformOrigin: '16.7% 8.3%', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.25))', zIndex: 50 }}
  >
    <path d="M4 2 L4 19 L8.6 14.9 L11.6 21.5 L14.6 20.2 L11.7 13.8 L18 13.6 Z" fill={fill} stroke={stroke} strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

// Text caret, blinking at about 1 Hz. Hold it solid while typing by passing blink={false}.
export const Caret = ({ t, h, color, blink = true }: { t: number; h: number; color: string; blink?: boolean }) => (
  <span style={{ display: 'inline-block', width: Math.max(2, h * 0.08), height: h, background: color, marginLeft: 2, verticalAlign: 'middle', opacity: !blink || Math.floor(t * 2.2) % 2 === 0 ? 1 : 0 }} />
);

// A line of type built word by word.
//   enter 'rise'  each word slides up out of its own hard-edged slot (kinetic type)
//   enter 'fade'  each word fades in place, no movement (calm styles)
//   enter 'light' the line sits dim from `start` and each word lights at its time (karaoke under a voiceover)
// In the text, "[name]" is an inline icon from `icons` and "*word*" takes the accent color.
// Word times are start + i * step, or `times` (one per word, an icon shares the next word's) from the voiceover.
export const Words = ({
  text,
  t,
  start,
  step = 0.25,
  times,
  exit,
  enter = 'rise',
  size,
  color,
  dim = color,
  accent = color,
  icons = {},
  style,
}: {
  text: string;
  t: number;
  start: number;
  step?: number;
  times?: number[];
  exit?: number;
  enter?: 'rise' | 'fade' | 'light';
  size: number;
  color: string;
  dim?: string;
  accent?: string;
  icons?: Record<string, (size: number, color: string) => ReactNode>;
  style?: CSSProperties;
}) => {
  const toks = text.split(' ').map((w) => {
    const icon = w.match(/^\[(\w+)\]$/)?.[1];
    const hl = w.startsWith('*') && w.replace(/[.,!?]$/, '').endsWith('*');
    return { text: hl ? w.replace(/\*/g, '') : w, icon, hl };
  });
  let k = 0;
  const at = toks.map((tok, i) => {
    if (!times) return start + i * step;
    const tw = times[Math.min(k, times.length - 1)];
    if (!tok.icon) k++;
    return tw;
  });
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', columnGap: size * 0.26, rowGap: size * 0.02, fontSize: size, lineHeight: 1.08, ...style }}>
      {toks.map((tok, i) => {
        const tw = at[i];
        const rise = enter === 'rise' ? ramp(t, tw - 0.08, 0.5, outExpo) : enter === 'light' ? ramp(t, start - 0.05 + i * 0.03, 0.5, outExpo) : 1;
        const out = exit === undefined ? 0 : ramp(t, exit + i * 0.025, 0.4, enter === 'fade' ? outQuart : inExpo);
        const lit = enter === 'light' ? ramp(t, tw, 0.18) : 1;
        const ink = tok.hl ? accent : color;
        const c = lit >= 1 ? ink : lit <= 0 ? dim : `color-mix(in srgb, ${dim}, ${ink} ${lit * 100}%)`;
        const moves = enter !== 'fade';
        return (
          // The slot clips the word while it rises; the padding keeps descenders and italics from being cut.
          <span key={i} style={{ display: 'inline-flex', overflow: moves ? 'hidden' : undefined, padding: `${size * 0.06}px ${size * 0.04}px ${size * 0.14}px`, margin: `${-size * 0.06}px ${-size * 0.04}px ${-size * 0.14}px` }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                color: c,
                opacity: moves ? 1 : ramp(t, tw, 0.25) * (1 - out),
                transform: moves ? `translateY(${(1 - rise) * 118 - out * 118}%) rotate(${(1 - rise) * 4}deg)` : undefined,
                transformOrigin: '0 100%',
              }}
            >
              {tok.icon ? icons[tok.icon]?.(size * 0.78, c) : tok.text}
            </span>
          </span>
        );
      })}
    </div>
  );
};
