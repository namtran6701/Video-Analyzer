// Virtual camera over a flat 2D world (UI, screenshots, type). Copy to src/lib/camera.ts next to motion.ts.
// x/y: world point at frame center. s: zoom. rx/ry/rz: tilt in degrees (needs a perspective wrapper).
// A key is the pose reached at frame f, moved to from the previous key; cut: true holds the previous
// pose until f, then jumps. Repeat a pose at a later frame to hold. Keys must be sorted by f.
// Apply cameraTransform to the world container with transformOrigin "0 0"; for tilts wrap it in
// a div with style={{ perspective: 1800 }}. No will-change on it (blurs scaled text).
import { Easing, interpolate } from 'remotion';
import { track, type PRESETS } from './motion';

export type Pose = { x: number; y: number; s: number; rx?: number; ry?: number; rz?: number };
export type Key = Pose & { f: number; cut?: boolean };
// 'cubic' (default): eased in-out, no overshoot, lands exactly on each key's frame.
// A motion.ts preset: a spring released at the previous key's frame (via track), so moves can
// overlap and settle on their own. Use 'default' or 'heavy' for camera; others overshoot.
export type CameraEase = 'cubic' | keyof typeof PRESETS;

const AXES = ['x', 'y', 'rx', 'ry', 'rz'] as const;

export const cameraAt = (keys: Key[], frame: number, ease: CameraEase = 'cubic', fps = 30): Pose => {
  let start = 0;
  for (let k = keys.length - 1; k > 0; k--) if (keys[k].cut && keys[k].f <= frame) { start = k; break; }
  const next = keys.findIndex((k, i) => i > start && k.cut);
  const seg = keys.slice(start, next === -1 ? undefined : next); // never move toward an upcoming cut

  if (ease === 'cubic') {
    const i = seg.findIndex((k) => k.f > frame);
    if (i === -1) return seg[seg.length - 1];
    if (i === 0) return seg[0];
    const a = seg[i - 1];
    const b = seg[i];
    if (b.cut) return a;
    const t = interpolate(frame, [a.f, b.f], [0, 1], { easing: Easing.inOut(Easing.cubic) });
    const pose: Pose = { x: 0, y: 0, s: a.s * Math.pow(b.s / a.s, t) }; // geometric zoom = constant speed
    for (const ax of AXES) pose[ax] = (a[ax] ?? 0) + ((b[ax] ?? 0) - (a[ax] ?? 0)) * t;
    return pose;
  }

  // Spring: each key's move starts at the previous key's frame. Zoom springs in log space.
  const t = frame / fps;
  const at = (k: number) => (k === 0 ? seg[0].f : seg[k - 1].f) / fps;
  const run = (v: (p: Pose) => number) => track(t, seg.map((p, k) => [at(k), v(p)] as [number, number]), ease);
  const pose: Pose = { x: 0, y: 0, s: Math.exp(run((p) => Math.log(p.s))) };
  for (const ax of AXES) pose[ax] = run((p) => p[ax] ?? 0);
  return pose;
};

// Holds never sit dead still: scale grows by `amount` (default 1.5%) over len frames from `from`.
export const drift = (pose: Pose, frame: number, from: number, len: number, amount = 0.015): Pose => ({
  ...pose,
  s: pose.s * interpolate(frame, [from, from + len], [1, 1 + amount], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
});

export const cameraTransform = ({ x, y, s, rx = 0, ry = 0, rz = 0 }: Pose, width: number, height: number) =>
  `translate(${width / 2}px, ${height / 2}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s}) translate(${-x}px, ${-y}px)`;
