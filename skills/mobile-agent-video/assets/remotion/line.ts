// Travelling line (M7, M21): one open stroke whose head draws on while its tail erases.
// The shape is a trochoid riding a slow wave: it loops wherever the loop radius beats the
// forward advance per radian, and sin² keeps the loops in the middle with plain waves at the ends.
export type Pt = [number, number];
export type LinePath = { d: string; length: number };

export const loopPath = (
  from: Pt,
  to: Pt,
  loops = 10, // turns along the whole path; only the middle few close into loops
  curl = 3, // > 1 loops in the middle, < 1 stays a wave
  wave = 140, // px, slow undulation along the whole path
  steps = 480,
): LinePath => {
  const turns = loops * 2 * Math.PI;
  const advance = (to[0] - from[0]) / turns;
  const pts: Pt[] = [];
  for (let k = 0; k <= steps; k++) {
    const u = k / steps;
    const t = u * turns;
    const r = curl * advance * Math.sin(Math.PI * u) ** 2;
    pts.push([
      from[0] + (to[0] - from[0]) * u - r * Math.sin(t),
      from[1] + (to[1] - from[1]) * u - r * Math.cos(t) + wave * Math.sin(3 * Math.PI * u),
    ]);
  }
  let length = 0;
  for (let k = 1; k < pts.length; k++) {
    length += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
  }
  const d = pts.map(([x, y], k) => `${k ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return { d, length };
};

// head and tail run 0 → 1 along the path; the visible stroke spans tail to head.
// Spread the result onto the <path> style with strokeLinecap "round".
export const travel = (length: number, head: number, tail: number) => {
  const seg = Math.max(0, head - tail) * length;
  return {
    strokeDasharray: `${seg} ${length}`,
    strokeDashoffset: -tail * length,
    opacity: seg > 0.5 ? 1 : 0, // a zero-length dash with round caps still draws a dot
  };
};
