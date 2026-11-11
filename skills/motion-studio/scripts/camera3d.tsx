// Virtual camera for R3F shots inside <ThreeCanvas>. Copy to src/lib/camera3d.tsx next to motion.ts.
// Same key model as camera.ts: a key is the pose reached at frame f, moved to from the previous key;
// cut: true holds the previous pose until f, then jumps. Keys sorted by f, landing on beat frames.
// pos: camera position, target: the point it looks at, fov: vertical degrees (defaults to 35).
import { PerspectiveCamera } from '@react-three/drei';
import { CatmullRomCurve3, Matrix4, Quaternion, Vector3 } from 'three';
import { Easing, interpolate } from 'remotion';
import { track, type PRESETS } from './motion';

export type Vec3 = [number, number, number];
export type Pose3 = { pos: Vec3; target: Vec3; fov: number };
export type Key3 = { f: number; pos: Vec3; target: Vec3; fov?: number; cut?: boolean };
export type CameraEase = 'cubic' | keyof typeof PRESETS;

const flat = (k: Key3) => [...k.pos, ...k.target, k.fov ?? 35];
const unflat = (v: number[]): Pose3 => ({ pos: [v[0], v[1], v[2]], target: [v[3], v[4], v[5]], fov: v[6] });

export const cameraAt3d = (keys: Key3[], frame: number, ease: CameraEase = 'cubic', fps = 30): Pose3 => {
  let start = 0;
  for (let k = keys.length - 1; k > 0; k--) if (keys[k].cut && keys[k].f <= frame) { start = k; break; }
  const next = keys.findIndex((k, i) => i > start && k.cut);
  const seg = keys.slice(start, next === -1 ? undefined : next); // never move toward an upcoming cut

  if (ease === 'cubic') {
    const i = seg.findIndex((k) => k.f > frame);
    if (i === -1) return unflat(flat(seg[seg.length - 1]));
    if (i === 0) return unflat(flat(seg[0]));
    const [a, b] = [flat(seg[i - 1]), flat(seg[i])];
    const t = interpolate(frame, [seg[i - 1].f, seg[i].f], [0, 1], { easing: Easing.inOut(Easing.cubic) });
    return unflat(a.map((v, j) => v + (b[j] - v) * t));
  }

  // Spring: each key's move starts at the previous key's frame (see camera.ts).
  const t = frame / fps;
  const at = (k: number) => (k === 0 ? seg[0].f : seg[k - 1].f) / fps;
  const vals = seg.map(flat);
  return unflat(vals[0].map((_, j) => track(t, vals.map((v, k) => [at(k), v[j]] as [number, number]), ease)));
};

// Position along a smooth path through points, progress 0..1 at constant speed.
// Key progress on the beat grid (interpolate or track), then spread into a pose: { ...pose, pos: pathAt(...) }.
export const pathAt = (points: Vec3[], progress: number, closed = false): Vec3 =>
  new CatmullRomCurve3(points.map((p) => new Vector3(...p)), closed).getPointAt(Math.min(1, Math.max(0, progress))).toArray();

// Holds never sit dead still: the camera closes `amount` of its distance to the target over len frames.
export const drift3d = (pose: Pose3, frame: number, from: number, len: number, amount = 0.015): Pose3 => {
  const k = interpolate(frame, [from, from + len], [0, amount], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return { ...pose, pos: pose.pos.map((v, j) => v + (pose.target[j] - v) * k) as Vec3 };
};

const m = new Matrix4();
const up = new Vector3(0, 1, 0);

// The scene's default camera, set from props on every frame (no useFrame, no imperative lookAt).
export const Camera3D = ({ pose, near = 0.1, far = 1000 }: { pose: Pose3; near?: number; far?: number }) => {
  m.lookAt(new Vector3(...pose.pos), new Vector3(...pose.target), up);
  const q = new Quaternion().setFromRotationMatrix(m);
  return <PerspectiveCamera makeDefault position={pose.pos} quaternion={q} fov={pose.fov} near={near} far={far} />;
};
