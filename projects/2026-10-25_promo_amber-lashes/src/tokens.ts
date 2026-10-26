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
export type Source = { src: string; nat: [number, number]; region: Rect; focus: [number, number]; video?: boolean };

// Regions are crops of Amber's photos that exclude the text already baked into them.
export const photo = {
  hook: { src: "photos/f8c277b5.jpg", nat: [1932, 2576], region: [438, 1288, 1494, 1288], focus: [773, 2035] },
  strip: { src: "photos/f8c277b5.jpg", nat: [1932, 2576], region: [438, 1288, 1262, 1288], focus: [1100, 1960] },
  natural: { src: "photos/e281f7ec.jpg", nat: [1932, 2576], region: [412, 1288, 1288, 1288], focus: [1005, 2048] },
  wispy: { src: "photos/8e143bcf.jpg", nat: [1721, 2295], region: [330, 771, 687, 687], focus: [700, 1117] },
  bold: { src: "photos/18590ae6.jpg", nat: [1932, 2576], region: [438, 1480, 1494, 1096], focus: [900, 2030] },
  detailA: { src: "photos/94802c6a.jpg", nat: [988, 1317], region: [410, 100, 578, 590], focus: [640, 420] },
  detailB: { src: "photos/949a3f82.jpg", nat: [1258, 1677], region: [570, 260, 688, 680], focus: [800, 560] },
  sideL: { src: "photos/a89ae0d6.jpg", nat: [1932, 2576], region: [296, 1520, 1636, 980], focus: [528, 2061] },
  sideR: { src: "photos/cd71f446.jpg", nat: [1721, 2295], region: [0, 1152, 1721, 1143], focus: [608, 1883] },
  clip: { src: "clips/collage.mp4", nat: [720, 1280], region: [0, 0, 720, 1280], focus: [360, 470], video: true },
} satisfies Record<string, Source>;
