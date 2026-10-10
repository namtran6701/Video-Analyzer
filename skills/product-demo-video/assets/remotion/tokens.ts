// Starter tokens. Swap palette and fonts per brand; keep the structure.
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const BPM = 116;
export const BEAT = (FPS * 60) / BPM;
export const at = (beats: number) => Math.round(beats * BEAT);

export const color = {
  darkBg: "#262626",
  darkSurface: "#31373c",
  darkText: "#f5f5f5",
  darkDim: "#787f81",
  lightBg: "#ffffff",
  lightText: "#141414",
  lightDim: "#a8aaab",
  lightLine: "#e7e8e9",
  accent: "#0d8cc6",
  accentGlow: "#36c8ed",
  reveal: ["#061019", "#183754", "#3b7592", "#69a4b8", "#8fbcca"],
} as const;

export const font = {
  family: "'Inter Display', 'Geist', 'Inter', system-ui, sans-serif",
  headlineWeight: 500,
  uiWeight: 400,
  headlineSize: 42, // px at 1080p; logo wordmark up to ~110
  tracking: "-0.01em",
} as const;

export const motion = {
  wordIn: 10, // frames per word
  wordStagger: 4,
  wordRise: 12, // px
  wordBlur: 8, // px
  morph: 15,
} as const;
