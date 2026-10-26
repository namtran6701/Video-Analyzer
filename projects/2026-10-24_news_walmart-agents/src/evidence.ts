import meta from "../public/evidence/rects.json";

export type Rect = [number, number, number, number];
type Meta = Record<string, { w: number; h: number; rects: Record<string, Rect[] | null> }>;

export const evidence = meta as unknown as Meta;

export const rects = (file: string, key: string): Rect[] => {
  const r = evidence[file]?.rects[key];
  if (!r) throw new Error(`no rect ${key} in ${file}`);
  return r;
};

// Bounding box of all line rects for a phrase.
export const bbox = (rs: Rect[]): Rect => {
  const x0 = Math.min(...rs.map((r) => r[0]));
  const y0 = Math.min(...rs.map((r) => r[1]));
  const x1 = Math.max(...rs.map((r) => r[0] + r[2]));
  const y1 = Math.max(...rs.map((r) => r[1] + r[3]));
  return [x0, y0, x1 - x0, y1 - y0];
};

// Zoom frame for a paragraph capture: full paragraph height, `w` px wide, centred on the phrases.
// Lines run off the card's sides on purpose; that is what makes the text phone-readable.
export const around = (file: string, keys: string[], w = 520): Rect => {
  const b = bbox(keys.flatMap((k) => rects(file, k)));
  const m = evidence[file];
  const x = Math.max(0, Math.min(m.w - w, b[0] + b[2] / 2 - w / 2));
  return [x, 36, w, m.h - 72];
};

export const centre = (r: Rect): [number, number] => [r[0] + r[2] / 2, r[1] + r[3] / 2];
