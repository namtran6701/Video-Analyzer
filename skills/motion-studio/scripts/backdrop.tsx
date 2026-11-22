// Editorial layered backdrop. Copy to src/lib/backdrop.tsx, next to kit.tsx.
// Replaces a flat solid behind type and graphics on context beats: a few subject images composited as
// one layer (the "pre-comp"), tinted as one (darks to a dark grey, lights to a soft off-white, so the
// contrast stays low and never fights the foreground), then a static texture on top.
//   <Backdrop
//     layers={[{ src: 'bg/capitol.jpg' }, { src: 'bg/news_scan.jpg', x: 0.62, y: 0.1, w: 0.42, rotate: -3, opacity: 0.8 }]}
//     dark={BACKDROP.dark} light={BACKDROP.light} texture="bg/paper.jpg" />
// Style-neutral: tint colors, texture and drift come in as props from the style skill's tokens.
// Pure function of the frame: same frame, same pixels. Film grain stays in <Finish>, not here.
import { useId } from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export type BackdropLayer = {
  src: string; // path under public/
  x?: number; // left edge, fraction of frame width (omit x, y and w to cover the frame)
  y?: number; // top edge, fraction of frame height
  w?: number; // width, fraction of frame width (height follows the image)
  rotate?: number; // degrees, small (newspaper scans at -4 to 4 read as pasted, more reads as messy)
  opacity?: number; // 0 to 1, before the tint
  blend?: 'normal' | 'multiply' | 'screen' | 'lighten' | 'darken';
};

export const Backdrop = ({
  layers,
  dark = '#1e1e1e', // where black lands: a dark grey, never #000
  light = '#d9d6cf', // where white lands: brighter than the dark by a small step, not paper white
  base = dark, // fill under the layers, shows through gaps and transparent cutouts
  texture, // optional scan (paper, newsprint, concrete) under public/
  textureOpacity = 0.18,
  textureBlend = 'overlay',
  paper = 0, // 0 to 1: procedural paper fiber when there is no scan; static, not per frame
  drift = 0.006, // scale gained per second: slow push so the hold stays alive (0 = still)
  blur = 0, // px at 1080 short side; 2 to 6 when type sits right on top
}: {
  layers: BackdropLayer[];
  dark?: string;
  light?: string;
  base?: string;
  texture?: string;
  textureOpacity?: number;
  textureBlend?: 'overlay' | 'multiply' | 'soft-light' | 'screen';
  paper?: number;
  drift?: number;
  blur?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const u = Math.min(width, height) / 1080;
  const id = useId().replace(/:/g, '');
  const tintId = `bd-tint-${id}`;
  const paperId = `bd-paper-${id}`;
  const [dr, dg, db] = rgb(dark);
  const [lr, lg, lb] = rgb(light);
  const s = 1 + drift * (frame / fps);

  return (
    <AbsoluteFill style={{ backgroundColor: base, overflow: 'hidden' }}>
      <svg width={0} height={0} style={{ position: 'absolute' }}>
        {/* Tint: luminance, then remap 0..1 to dark..light per channel (After Effects' Tint, Map Black/White To). */}
        <filter id={tintId} colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues={`${dr} ${lr}`} />
            <feFuncG type="table" tableValues={`${dg} ${lg}`} />
            <feFuncB type="table" tableValues={`${db} ${lb}`} />
          </feComponentTransfer>
        </filter>
      </svg>

      {/* The pre-comp: every layer composites first, then the tint applies once to the result. */}
      <AbsoluteFill
        style={{
          filter: `url(#${tintId})${blur > 0 ? ` blur(${blur * u}px)` : ''}`,
          transform: `scale(${s})`,
          transformOrigin: '50% 50%',
        }}
      >
        <AbsoluteFill style={{ backgroundColor: base }} />
        {layers.map((l, i) => {
          const cover = l.x === undefined && l.y === undefined && l.w === undefined;
          return (
            <Img
              key={i}
              src={staticFile(l.src)}
              style={{
                position: 'absolute',
                left: cover ? 0 : (l.x ?? 0) * width,
                top: cover ? 0 : (l.y ?? 0) * height,
                width: cover ? width : (l.w ?? 1) * width,
                height: cover ? height : 'auto',
                objectFit: cover ? 'cover' : undefined,
                opacity: l.opacity ?? 1,
                mixBlendMode: l.blend ?? 'normal',
                transform: l.rotate ? `rotate(${l.rotate}deg)` : undefined,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {texture && (
        <Img
          src={staticFile(texture)}
          style={{ position: 'absolute', inset: 0, width, height, objectFit: 'cover', opacity: textureOpacity, mixBlendMode: textureBlend }}
        />
      )}
      {paper > 0 && (
        <svg width={width} height={height} style={{ position: 'absolute', inset: 0, opacity: paper * 0.5, mixBlendMode: 'soft-light' }}>
          <filter id={paperId} x="0" y="0" width="100%" height="100%">
            {/* Fixed seed: paper is a surface, it must not boil from frame to frame. */}
            <feTurbulence type="fractalNoise" baseFrequency={`${0.012 / u} ${0.6 / u}`} numOctaves="3" seed="7" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${paperId})`} />
        </svg>
      )}
    </AbsoluteFill>
  );
};

// '#rrggbb' or '#rgb' to 0..1 channels, rounded for a stable filter string.
const rgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => +(v / 255).toFixed(4)) as [number, number, number];
};
