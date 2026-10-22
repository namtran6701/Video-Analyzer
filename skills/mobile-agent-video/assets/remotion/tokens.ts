import { Easing, interpolate } from "remotion";

// Starter tokens. Swap accent, serif, UI font and mark per brand; keep the structure.
export const FPS = 24;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const BPM = 120;
export const BEAT = (FPS * 60) / BPM; // 12 frames
export const at = (beats: number) => Math.round(beats * BEAT);

export const color = {
  stage: "#ccc9da",
  stageLift: "#d5d3e1",
  line: "#afacc1",
  ink: "#100e19",
  screen: "#faf8f4",
  bezel: "#141214",
  bubbleAgent: "#f1efed",
  bubbleUser: "#e9c6b8",
  card: "#ffffff",
  uiInk: "#0f0e0f",
  accent: "#cf6f5c",
  confetti: ["#d87848", "#d87878", "#d8a848", "#4878d8", "#c858a0"],
} as const;

export const font = {
  serif: "'Source Serif 4', 'Newsreader', Georgia, serif",
  ui: "'Inter', system-ui, sans-serif",
  claimSize: 112, // px at 1080p
  claimLineHeight: 1.18,
  claimTracking: "-0.01em",
  wordmarkSize: 155,
  pillSize: 28,
  urlSize: 48,
} as const;

export const phone = {
  ptW: 390, // native screen, CSS px
  ptH: 844,
  bezel: 18,
  radius: 105,
  restW: 874, // outer width at rest, 46% of frame
  restTop: 69,
  close: 1.45, // scale vs rest
  liveEdit: 1.9,
  splitRightInner: 1068, // inner bezel x with the phone on the right
  splitLeftInner: 852,
} as const;

export const UI_SCALE = (phone.restW - 2 * phone.bezel) / phone.ptW; // ~2.15

export const layout = {
  gutter: 96, // claim x with the phone on the right
  splitTextX: 1056, // claim x with the phone on the left
  floatShadow: "0 12px 40px rgba(40,30,60,.10)",
  banner: { w: 1362, h: 310, radius: 52 },
} as const;

export const motion = {
  wordIn: 6,
  wordOut: 4,
  wordStagger: 2,
  whipIn: 6,
  whipOut: 12,
  bannerShrink: 10,
  bubbleIn: 4,
  swap: 12,
  dock: 12,
  lift: 12,
  cardRise: 16,
  lineCross: 40,
  maxBlur: 24,
} as const;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Opacity of word i in a claim whose build starts at `start` (M4). Multiply by wordOut for the exit (M5).
export const wordIn = (frame: number, start: number, i: number) =>
  interpolate(frame - start - i * motion.wordStagger, [0, motion.wordIn], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

export const wordOut = (frame: number, start: number, i: number) =>
  interpolate(frame - start - i * motion.wordStagger, [0, motion.wordOut], [1, 0], clamp);

// Whip progress 0 → 1 (M3): ease-out entering, ease-in leaving.
export const whipIn = (frame: number, start: number) =>
  interpolate(frame - start, [0, motion.whipIn], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

export const whipOut = (frame: number, start: number, dur: number = motion.whipOut) =>
  interpolate(frame - start, [0, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
