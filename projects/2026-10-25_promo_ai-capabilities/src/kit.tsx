import React from "react";
import { Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { spring } from "./lib/motion";
import { bt, color, font, layout } from "./tokens";

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const outQuart = Easing.out(Easing.poly(4)); // GSAP power3.out
export const outExpo = Easing.out(Easing.exp); // GSAP expo.out
export const inExpo = Easing.in(Easing.exp);

export const useT = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  return { t: frame / fps, frame, fps, width, height, ...layout(width, height) };
};

// Seconds-based ramp: 0 before t0, 1 after t0 + d.
export const ramp = (t: number, t0: number, d: number, ease = outQuart) => ease(clamp01((t - t0) / d));

const ICONS: Record<string, string[]> = {
  calculator: ["M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z", "M8 6h8", "M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01"],
  folder: ["M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"],
  download: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"],
  sparkles: ["M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.14 1.58a.5.5 0 0 1 0 .96l-6.14 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"],
  database: ["M3 5a9 3 0 1 0 18 0a9 3 0 1 0-18 0", "M3 5v14a9 3 0 0 0 18 0V5", "M3 12a9 3 0 0 0 18 0"],
  zap: ["M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"],
  sheet: ["M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", "M14 2v4a2 2 0 0 0 2 2h4", "M8 13h2M14 13h2M8 17h2M14 17h2"],
  check: ["M20 6 9 17l-5-5"],
  search: ["M3 11a8 8 0 1 0 16 0a8 8 0 1 0-16 0", "m21 21-4.3-4.3"],
  arrow: ["M5 12h14", "m12 5 7 7-7 7"],
  camera: ["M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z", "M9 13a3 3 0 1 0 6 0a3 3 0 1 0-6 0"],
  globe: ["M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0", "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", "M2 12h20"],
  user: ["M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", "M8 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0"],
};

export const Icon: React.FC<{ name: string; size: number; stroke?: string; width?: number }> = ({ name, size, stroke = "currentColor", width = 2.25 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
    {ICONS[name].map((d) => (
      <path key={d} d={d} />
    ))}
  </svg>
);

type Tok = { text: string; icon?: string; hl?: boolean };
const parse = (s: string): Tok[] =>
  s.split(" ").map((w) => {
    const m = w.match(/^\[(\w+)\]$/);
    if (m) return { text: "", icon: m[1] };
    if (w.startsWith("*") && w.replace(/[.,]$/, "").endsWith("*")) return { text: w.replace(/\*/g, ""), hl: true };
    return { text: w };
  });

// M1 masked rise: each word slides up out of its own hard-edged slot, leaves upward the same way (+ M2 karaoke, M3 inline icons).
// Times in beats, local to the Sequence. `times` (one per word, from the VO) replaces the fixed step; an icon takes the next word's time.
export const Line: React.FC<{
  text: string;
  start: number;
  times?: number[];
  step?: number;
  exit?: number;
  mode: "dark" | "light";
  size?: number;
  karaoke?: boolean;
  weight?: number;
  style?: React.CSSProperties;
}> = ({ text, start, times, step = 0.5, exit, mode, size, karaoke = false, weight = 700, style }) => {
  const { t, headline } = useT();
  const fs = size ?? headline;
  const toks = parse(text);
  const lit = mode === "dark" ? color.darkText : color.lightText;
  const dim = mode === "dark" ? color.darkDim : "#C9CCCC";
  const beatOf: number[] = [];
  if (times) {
    let k = 0;
    for (const tok of toks) {
      beatOf.push(times[Math.min(k, times.length - 1)] - (tok.icon ? 0.25 : 0));
      if (!tok.icon) k++;
    }
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", columnGap: fs * 0.26, rowGap: fs * 0.02, fontFamily: font.display, fontWeight: weight, fontSize: fs, letterSpacing: font.tracking, lineHeight: 1.08, ...style }}>
      {toks.map((tok, i) => {
        const tw = bt(times ? beatOf[i] : start + i * step);
        // Karaoke lines sit dim from the start and light per word; others rise per word.
        const rise = karaoke ? ramp(t, bt(start) - 0.05 + i * 0.03, 0.5, outExpo) : ramp(t, tw - 0.08, 0.5, outExpo);
        const q = exit === undefined ? 0 : ramp(t, bt(exit) + i * 0.025, 0.4, inExpo);
        const light = karaoke ? ramp(t, tw, 0.18) : 1;
        const wordColor = light >= 1 ? lit : light <= 0 ? dim : mixHex(dim, lit, light);
        const hlFill = tok.hl && mode === "light";
        const hlText = tok.hl && mode === "dark";
        const bar = tok.hl ? ramp(t, tw + 0.15, 0.4, outExpo) : 0;
        return (
          <span key={i} style={{ display: "inline-flex", overflow: "hidden", padding: `${fs * 0.06}px ${fs * 0.04}px ${fs * 0.14}px`, margin: `${-fs * 0.06}px ${-fs * 0.04}px ${-fs * 0.14}px` }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                position: "relative",
                transform: `translateY(${(1 - rise) * 118 - q * 118}%) rotate(${(1 - rise) * 4}deg)`,
                transformOrigin: "0 100%",
                color: hlText && light >= 1 ? color.accent : wordColor,
                background: hlFill ? `linear-gradient(${color.accentFill}, ${color.accentFill}) no-repeat 0 0 / ${bar * 100}% 100%` : undefined,
                padding: hlFill ? `0 ${fs * 0.1}px` : undefined,
              }}
            >
              {tok.icon ? <Icon name={tok.icon} size={fs * 0.78} stroke={wordColor} width={2.4} /> : tok.text}
              {hlText ? <span style={{ position: "absolute", left: 0, right: 0, bottom: -fs * 0.06, height: fs * 0.07, background: color.accent, transform: `scaleX(${bar})`, transformOrigin: "0 50%" }} /> : null}
            </span>
          </span>
        );
      })}
    </div>
  );
};

export const mixHex = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * k)).join(",")})`;
};

// Mono uppercase label, the SF signature.
export const Mono: React.FC<{ children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties }> = ({ children, size, color: c, style }) => (
  <span style={{ fontFamily: font.mono, fontWeight: 500, fontSize: size, letterSpacing: font.monoTracking, textTransform: "uppercase", color: c, ...style }}>{children}</span>
);

// Square chip with a 3px stroke.
export const Chip: React.FC<{ children: React.ReactNode; size: number; fill?: string; ink?: string; border?: string; style?: React.CSSProperties }> = ({ children, size, fill = "transparent", ink = color.lightText, border = color.lightText, style }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.5, padding: `${size * 0.45}px ${size * 0.8}px`, background: fill, border: `${Math.max(2, size * 0.16)}px solid ${border}`, ...style }}>
    <Mono size={size} color={ink}>
      {children}
    </Mono>
  </span>
);

export const Cursor: React.FC<{ x: number; y: number; size: number; press?: number; opacity?: number }> = ({ x, y, size, press = 0, opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y, opacity, transform: `scale(${1 - press * 0.15})`, transformOrigin: "0 0", filter: "drop-shadow(0 2px 3px rgba(0,0,0,.25))", zIndex: 50 }}>
    <path d="M4 2 L4 19 L8.6 14.9 L11.6 21.5 L14.6 20.2 L11.7 13.8 L18 13.6 Z" fill={color.lightText} stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

// Click press: 0..1..0 around a click time (seconds).
export const press = (t: number, tc: number) => {
  const d = t - tc;
  return d < -0.06 || d > 0.2 ? 0 : d < 0 ? (d + 0.06) / 0.06 : 1 - d / 0.2;
};

// Typed text: characters revealed between t0 and t1.
export const typed = (s: string, t: number, t0: number, t1: number) => s.slice(0, Math.round(clamp01((t - t0) / (t1 - t0)) * s.length));

export const Caret: React.FC<{ t: number; h: number; c?: string }> = ({ t, h, c = color.lightText }) => (
  <span style={{ display: "inline-block", width: Math.max(2, h * 0.08), height: h, background: c, marginLeft: 2, verticalAlign: "middle", opacity: Math.floor(t * 2.2) % 2 === 0 ? 1 : 0 }} />
);

export const pop = (t: number, t0: number) => spring(t - t0, "snappy");

// Hard-edged wipe as a clip-path: p 0..1, from the given side.
export const wipe = (p: number, from: "left" | "right" | "top" | "bottom" = "left") => {
  const r = `${(1 - clamp01(p)) * 100}%`;
  return from === "left" ? `inset(0 ${r} 0 0)` : from === "right" ? `inset(0 0 0 ${r})` : from === "top" ? `inset(0 0 ${r} 0)` : `inset(${r} 0 0 0)`;
};

// Section swap as one clip: revealed left to right by pIn, cleared left to right by pOut.
export const band = (pIn: number, pOut = 0) => `inset(0 ${(1 - clamp01(pIn)) * 100}% 0 ${clamp01(pOut) * 100}%)`;
