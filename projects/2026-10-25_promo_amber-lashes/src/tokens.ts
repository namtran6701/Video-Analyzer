export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const TOTAL = 38 * FPS;

export const color = {
  ivory: "#F7F2EA",
  paper: "#FBF8F3",
  charcoal: "#2B2724",
  soft: "#6E655D",
  champagne: "#C9AE82",
};

export const font = {
  display: "Cormorant Garamond",
  body: "Jost",
};

// 9:16 safe zone for type: top 10%, bottom 20%, right 12% are platform UI.
export const safe = { top: 192, bottom: 1536, left: 90, right: 950 };

type Rect = [number, number, number, number];
export type Source = { src: string; nat: [number, number]; region: Rect; focus: [number, number] };

// Regions are crops of Amber's photos that exclude the text already baked into them.
export const photo = {
  hook: { src: "photos/e6e89012.jpg", nat: [2600, 2600], region: [420, 0, 2180, 1310], focus: [1130, 693] },
  strip: { src: "photos/e6e89012.jpg", nat: [2600, 2600], region: [420, 0, 2180, 1310], focus: [1300, 693] },
  naturalBefore: { src: "photos/241aa792.jpg", nat: [1949, 2600], region: [0, 240, 1949, 1060], focus: [880, 800] },
  natural: { src: "photos/241aa792.jpg", nat: [1949, 2600], region: [0, 1520, 1949, 1060], focus: [880, 2030] },
  wispyBefore: { src: "photos/2bbb27a9.jpg", nat: [1950, 2600], region: [640, 100, 1310, 880], focus: [1531, 563] },
  wispy: { src: "photos/2bbb27a9.jpg", nat: [1950, 2600], region: [640, 1500, 1310, 880], focus: [1589, 1878] },
  boldBefore: { src: "photos/917d4334.jpg", nat: [1950, 2600], region: [300, 300, 1650, 940], focus: [790, 896] },
  bold: { src: "photos/917d4334.jpg", nat: [1950, 2600], region: [300, 1540, 1650, 940], focus: [761, 2109] },
  detailA: { src: "photos/70c87b2d.jpg", nat: [1950, 2600], region: [440, 0, 1510, 1240], focus: [708, 838] },
  detailB: { src: "photos/70c87b2d.jpg", nat: [1950, 2600], region: [440, 1500, 1510, 1100], focus: [881, 2066] },
  sideL: { src: "photos/ab3575d8.jpg", nat: [1733, 2600], region: [0, 0, 1733, 1440], focus: [500, 800] },
  sideR: { src: "photos/bc815043.jpg", nat: [1949, 2600], region: [380, 1045, 810, 810], focus: [838, 1480] },
  center: { src: "photos/06adbc83.jpg", nat: [2600, 2600], region: [1310, 1335, 1290, 1265], focus: [2060, 2000] },
} satisfies Record<string, Source>;
