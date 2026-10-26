// Starter tokens. Swap palette and fonts per brand; keep the structure.
export const FPS = 30;

export const BPM = 116;
export const BEAT = (FPS * 60) / BPM;
export const at = (beats: number) => Math.round(beats * BEAT); // frames: <Sequence>, plate frames
export const bt = (beats: number) => (beats * 60) / BPM; // seconds: motion.ts, GSAP positions

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
  tracking: "-0.01em",
} as const;

// All sizes derive from the composition, never fixed pixels. Call with useVideoConfig().
export const layout = (width: number, height: number) => {
  const u = Math.min(width, height) / 1080;
  const aspect = width / height;
  const format = aspect > 1.2 ? "16x9" : aspect < 0.8 ? "9x16" : "1x1";
  const typeScale = { "16x9": 1, "1x1": 1.25, "9x16": 1.45 }[format];
  return {
    u,
    format,
    headline: 72 * u * typeScale,
    wordmark: 170 * u * typeScale,
    ui: 14 * u,
    cursor: 48 * u,
    wordsPerLine: { "16x9": 5, "1x1": 4, "9x16": 3 }[format],
    // Keep type, UI and logos inside these insets (9:16 platform overlays).
    safe:
      format === "9x16"
        ? { top: height * 0.1, bottom: height * 0.2, left: width * 0.06, right: width * 0.12 }
        : { top: height * 0.06, bottom: height * 0.06, left: width * 0.06, right: width * 0.06 },
  };
};

// Seconds. Springs come from src/lib/motion.ts presets.
export const motion = {
  wordIn: 0.33,
  wordStagger: bt(0.25),
  wordBlur: 8, // px × u
  echoStep: 0.03, // M6 trail sample spacing
} as const;
