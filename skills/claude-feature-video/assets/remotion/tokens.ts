// Starter tokens. Swap accent, serif and logo per brand; keep the structure.
export const FPS = 24;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const BPM = 90;
export const BEAT = (FPS * 60) / BPM; // 16 frames
export const at = (beats: number) => Math.round(beats * BEAT);

export const color = {
  stage: "#fbf9f5",
  oat: "#efeee5",
  ink: "#0c0c0a",
  inkDim: "#70706d",
  bubble: "#efedeb",
  card: "#ffffff",
  accent: "#cc6c58",
  accentWipe: "#e8a090",
  accentGlow: "#f4d0cc",
} as const;

export const font = {
  serif: "'Source Serif 4', 'Newsreader', Georgia, serif",
  serifWeight: 400,
  cardSize: 80, // px at 1080p, opener and tagline
  cardLineHeight: 1.3,
} as const;

export const win = {
  w: 1418,
  h: 900,
  chrome: 110, // browser chrome height inside the window
  radius: 10,
  gap: 160, // between chapter windows in the camera world
  shadow: "0 28px 70px rgba(60,45,30,.16), 0 2px 8px rgba(0,0,0,.06)",
} as const;

export const motion = {
  closeUp: 3, // panels and inputs; menus up to 4
  snapZoom: 12,
  pullBack: 12,
  pan: 28,
  settleFrom: 1.06,
  settle: 8,
  wipe: 20,
  glowIn: 8,
  glowOut: 12,
  typeCharsPerFrame: 2,
} as const;
