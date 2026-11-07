import { Easing, interpolate } from "remotion";
import { HEIGHT, WIDTH } from "./tokens";

// x/y: point on the flat UI plane at frame center. s: zoom. rx/rz: tilt in degrees.
// A key is the pose reached at frame f, eased from the previous key; cut: true jumps at f.
// Repeat a pose at a later frame to hold. Keys must be sorted by f.
// Wrap the UI plane in a div with style={{ perspective: 1800 }} and apply cameraTransform
// to the plane with transformOrigin "0 0".
export type Pose = { x: number; y: number; s: number; rx?: number; rz?: number };
export type Key = Pose & { f: number; cut?: boolean };

export const flat = (x: number, y: number, s = 1): Pose => ({ x, y, s, rx: 0, rz: 0 });
export const tilted = (x: number, y: number, s: number, rx = 10, rz = -6): Pose => ({ x, y, s, rx, rz });

export const cameraAt = (keys: Key[], frame: number): Pose => {
  const i = keys.findIndex((k) => k.f > frame);
  if (i === -1) return keys[keys.length - 1];
  if (i === 0) return keys[0];
  const a = keys[i - 1];
  const b = keys[i];
  if (b.cut) return a;
  const t = interpolate(frame, [a.f, b.f], [0, 1], { easing: Easing.inOut(Easing.cubic) });
  const lerp = (p = 0, q = 0) => p + (q - p) * t;
  return {
    x: lerp(a.x, b.x),
    y: lerp(a.y, b.y),
    s: a.s * Math.pow(b.s / a.s, t), // geometric zoom reads as constant speed
    rx: lerp(a.rx, b.rx),
    rz: lerp(a.rz, b.rz),
  };
};

// Slow drift so holds never sit dead still: ~1.5% over the hold.
export const drift = (pose: Pose, frame: number, from: number, len: number): Pose => ({
  ...pose,
  s: pose.s * interpolate(frame, [from, from + len], [1, 1.015], { extrapolateRight: "clamp" }),
});

export const cameraTransform = ({ x, y, s, rx = 0, rz = 0 }: Pose) =>
  `translate(${WIDTH / 2}px, ${HEIGHT / 2}px) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${s}) translate(${-x}px, ${-y}px)`;
