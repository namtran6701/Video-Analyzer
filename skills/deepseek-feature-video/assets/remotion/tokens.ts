// Starter tokens from the reference. Swap accent, font and logo per brand; keep the structure.
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const BPM = 150;
export const BEAT = (FPS * 60) / BPM; // 12 frames
export const at = (beats: number) => Math.round(beats * BEAT);

export const color = {
  stage: "#fefefe",
  stageSoft: "#f0f0f0",
  ink: "#131c2c",
  inkDim: "rgba(19,28,44,.6)",
  stackInk: "#485b67",
  accent: "#1d64db",
  accentSoft: "#8098ec",
  night: "#000000",
  smoke: ["#1b2b41", "#17273a", "#2e4a6e"],
} as const;

export const font = {
  family: "'Montserrat', 'Gilroy', 'Satoshi', sans-serif",
  weight: 400,
  leadWeight: 300,
  lead: 44,
  statement: 68,
  punch: 116,
  tagline: 34,
  leadGap: 90, // lead-in baseline to main line
} as const;

export const shadow = {
  float: "0 30px 80px rgba(19,28,44,.14), 0 2px 8px rgba(19,28,44,.06)",
  glow: "0 0 18px 4px #fff",
} as const;

export const motion = {
  typeCharsPerFrame: 0.6,
  caretBlink: 15,
  accentFlipHold: 12,
  pushThrough: 12,
  pushScale: 2.2,
  whiteGap: 3,
  swing: 15, // camera between flat wide and tilted close-up
  closeUp: 2.5,
  sendCloseUp: 3.5,
  tilt: { rx: 10, rz: -6 },
  slotRoll: 8,
  waveSettle: 15,
  click: 3,
} as const;
