export const FPS = 30;

export const BPM = 116;
export const BEAT = (FPS * 60) / BPM;
export const at = (beats: number) => Math.round(beats * BEAT); // frames
export const bt = (beats: number) => (beats * 60) / BPM; // seconds
export const BARS = 52;
// A one-bar title card plays before the act grid; ACT starts are measured after it.
export const INTRO = at(4);
export const DURATION = at(BARS * 4) + INTRO;

export const color = {
  darkBg: "#1C2C2E",
  darkSurface: "#263A3D",
  darkText: "#FDFEFC",
  darkDim: "#4F6063",
  lightBg: "#FCFCF8",
  lightText: "#1C2C2E",
  lightDim: "#6A7171",
  lightLine: "#E4E4E4",
  cloud: "#E9EFEF",
  accent: "#A0CB05",
  accentFill: "#EEFF97",
  putty: "#495A3B",
  emberDeep: "#AE4200",
} as const;

export const font = {
  display: "Gotham, 'IBM Plex Sans', sans-serif",
  sans: "'IBM Plex Sans', sans-serif",
  mono: "'IBM Plex Mono', monospace",
  tracking: "-0.01em",
  monoTracking: "0.15em",
} as const;

export const layout = (width: number, height: number) => {
  const u = Math.min(width, height) / 1080;
  return {
    u,
    headline: 72 * u,
    wordmark: 170 * u,
    // Bottom caption band (16:9): 80 to 92% of height. Nothing important goes here.
    captionTop: height * 0.8,
    captionBottom: height * 0.92,
  };
};

// Act starts in bars (shotlist.md)
export const ACT = {
  hook: 0,
  problem: 2,
  reveal: 6,
  positioning: 8,
  pricing: 10,
  storewalk: 20,
  training: 29,
  proof: 36,
  capabilities: 40.25,
  trust: 44.5,
  bonus: 47,
  close: 49,
  end: 52,
} as const;

export const bar = (n: number) => at(n * 4);
