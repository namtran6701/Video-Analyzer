// Starter skin. Swap highlight, stamp, fonts and the sting per channel; keep the roles.
// Deliberately not the reference's orange/red pair so the channel doesn't read as a Fireship clone.
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const WPM = 200;
export const wordsToSeconds = (words: number) => (words * 60) / WPM;

export const color = {
  bg: "#0f0d0e",
  text: "#f0f0f0",
  textWarm: "#f3ead6", // big word cards
  highlight: "#2fe6c8", // highlighter bars, hero gradient end
  accent: "#ffd23f", // hero gradient start, pointing hand tint
  stamp: "#ff3b6b", // stamp labels, red boxes, red X
  shadow: "rgba(0,0,0,.55)",
} as const;

export const font = {
  display: "'Lilita One', 'Bungee', system-ui, sans-serif",
  label: "'Oswald', 'Bebas Neue', system-ui, sans-serif",
  hero: "'Anton', 'Bowlby One', system-ui, sans-serif",
  word: "'Inter', system-ui, sans-serif", // N13, weight 900
  quote: "'Playfair Display', Georgia, serif", // N15, italic
} as const;

export const size = {
  coldOpen: 0.09, // fraction of frame height
  hero: 0.12,
  bigWord: 0.25,
  takeaway: 0.07,
  hand: 0.09,
} as const;

export const motion = {
  pushMax: 1.05,
  glitchFrames: 3,
  barWipe: 6,
  barStagger: 3,
  boxDraw: 4,
  arrowDraw: 7,
  arrowHead: 3,
  stampPop: 5,
  stingMax: 60,
  memeMin: 15,
  memeMax: 60,
} as const;

export const channel = {
  name: "",
  signOff: "",
} as const;
