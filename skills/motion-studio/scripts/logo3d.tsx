// Brand marks and type as extruded 3D meshes inside <ThreeCanvas>. Copy to src/lib/logo3d.tsx.
// <Logo3D src="brand/logo.svg" /> extrudes the captured SVG (fills only, strokes skipped), keeping each
// path's fill color unless `color` is set. <Type3D font="fonts/Brand.ttf" text="Launch" /> sets a line
// in the brand font (kerned, via opentype.js) and extrudes it the same way.
// Both are centered on the origin, upright, `width` world units wide, front face toward +z.
// They hold the frame until the file is loaded and drawn.
import { useThree } from '@react-three/fiber';
import { parse } from 'opentype.js';
import { useEffect, useMemo, useState } from 'react';
import { Box3, Color, ExtrudeGeometry, Vector3 } from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { cancelRender, continueRender, delayRender, staticFile } from 'remotion';

type Extrude = { width?: number; depth?: number; bevel?: number; color?: string; roughness?: number; metalness?: number };
type Part = { geometry: ExtrudeGeometry; color: Color };

const extrudeSvg = (svg: string, width: number, depth: number, bevel: number): Part[] => {
  const parts = new SVGLoader()
    .parse(svg)
    .paths.filter((p) => (p.userData?.style as { fill?: string } | undefined)?.fill !== 'none')
    .map((p) => ({
      geometry: new ExtrudeGeometry(SVGLoader.createShapes(p), {
        depth,
        bevelEnabled: bevel > 0,
        bevelThickness: bevel,
        bevelSize: bevel,
        bevelSegments: 4,
        curveSegments: 24,
      }),
      color: p.color,
    }));
  const box = new Box3();
  for (const { geometry } of parts) box.union(geometry.computeBoundingBox() ?? geometry.boundingBox!);
  const center = box.getCenter(new Vector3());
  const s = width / (box.max.x - box.min.x);
  for (const { geometry } of parts) {
    geometry.translate(-center.x, -center.y, -center.z);
    geometry.rotateX(Math.PI); // SVG y points down: a rotation (not a mirror) turns it upright, winding intact
    geometry.scale(s, s, s);
  }
  return parts;
};

// Loads a file from public/, builds meshes from it, draws them once, then releases the frame.
const useParts = <T,>(src: string, read: (r: Response) => Promise<T>, build: (data: T) => Part[]) => {
  const advance = useThree((s) => s.advance);
  const [handle] = useState(() => delayRender(`load ${src}`));
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    fetch(staticFile(src)).then(read).then(setData).catch(cancelRender);
  }, [src]);
  const parts = useMemo(() => (data == null ? null : build(data)), [data, build]);
  useEffect(() => {
    if (!parts) return;
    requestAnimationFrame(() => {
      advance(performance.now());
      continueRender(handle);
    });
  }, [parts, advance, handle]);
  return parts;
};

const Meshes = ({ parts, color, roughness = 0.3, metalness = 0 }: { parts: Part[] | null } & Extrude) => (
  <group>
    {parts?.map(({ geometry, color: fill }, i) => (
      <mesh key={i} geometry={geometry}>
        <meshPhysicalMaterial color={color ?? fill} roughness={roughness} metalness={metalness} clearcoat={0.5} />
      </mesh>
    ))}
  </group>
);

export const Logo3D = ({ src, width = 2, depth = 0.15, bevel = 0.02, ...look }: { src: string } & Extrude) => {
  const build = useMemo(() => (svg: string) => extrudeSvg(svg, width, depth, bevel), [width, depth, bevel]);
  return <Meshes parts={useParts(src, (r) => r.text(), build)} {...look} />;
};

export const Type3D = ({ font, text, width = 3, depth = 0.15, bevel = 0.02, ...look }: { font: string; text: string } & Extrude) => {
  const build = useMemo(
    () => (buf: ArrayBuffer) => {
      const d = parse(buf).getPath(text, 0, 0, 100).toPathData(3);
      return extrudeSvg(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`, width, depth, bevel);
    },
    [text, width, depth, bevel],
  );
  return <Meshes parts={useParts(font, (r) => r.arrayBuffer(), build)} {...look} />;
};
