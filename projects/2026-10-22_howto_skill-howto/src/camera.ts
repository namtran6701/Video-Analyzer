import { gsap } from "gsap";
import { interpolate } from "remotion";
import { HEIGHT, WIDTH, win } from "./tokens";

// x/y: world point at frame center. s: zoom. A key is the pose reached at frame f,
// eased from the previous key with its GSAP ease (default power2.inOut).
// To hold, repeat the same pose at a later frame. Keys must be sorted by f.
// Apply cameraTransform to the world container with transformOrigin "0 0".
export type Pose = { x: number; y: number; s: number };
export type Key = Pose & { f: number; ease?: string };

export const wide = (i: number): Pose => ({ x: i * (win.w + win.gap) + win.w / 2, y: win.h / 2, s: 1 });

export const closeUp = (i: number, px: number, py: number, s = 3): Pose => ({
  x: i * (win.w + win.gap) + px,
  y: py,
  s,
});

export const cameraAt = (keys: Key[], frame: number): Pose => {
  const i = keys.findIndex((k) => k.f > frame);
  if (i === -1) return keys[keys.length - 1];
  if (i === 0) return keys[0];
  const a = keys[i - 1];
  const b = keys[i];
  const t = gsap.parseEase(b.ease ?? "power2.inOut")(interpolate(frame, [a.f, b.f], [0, 1]));
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    s: a.s * Math.pow(b.s / a.s, t), // geometric zoom reads as constant speed
  };
};

export const cameraTransform = ({ x, y, s }: Pose) =>
  `translate(${WIDTH / 2}px, ${HEIGHT / 2}px) scale(${s}) translate(${-x}px, ${-y}px)`;
