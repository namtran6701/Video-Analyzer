// Film-wide finish. Copy to src/lib/finish.tsx and wrap the whole film once, outside every scene:
//   <Finish grain={GRAIN}>{scenes}</Finish>
// One layer of noise over 2D, R3F shots and plates alike, so they sit in one look, and so gradients and
// soft shadows don't band at 8 bits. Seeded by the frame: the same frame always renders the same grain.
// grain: 0.015 (default) is invisible as texture and only hides banding. 0.03 to 0.06 reads as film
// grain (same scale as <Grain> in post3d.tsx; with this on, leave <Grain> out of 3D shots). 0 is off.
import { useId, type ReactNode } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export const Finish = ({ grain = 0.015, children }: { grain?: number; children: ReactNode }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const id = useId();
  // Noise becomes black or white specks whose alpha is the distance from mid-grey, so it darkens and
  // lightens evenly instead of lifting the whole frame.
  const k = Math.min(1, grain * GAIN);
  return (
    <AbsoluteFill>
      {children}
      {grain > 0 && (
        <svg width={width} height={height} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed={frame + 1} />
            <feColorMatrix values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  1 0 0 0 0" />
            <feComponentTransfer>
              <feFuncR type="discrete" tableValues="0 1" />
              <feFuncG type="discrete" tableValues="0 1" />
              <feFuncB type="discrete" tableValues="0 1" />
              <feFuncA type="table" tableValues={`${k} 0 ${k}`} />
            </feComponentTransfer>
          </filter>
          <rect width="100%" height="100%" filter={`url(#${id})`} />
        </svg>
      )}
    </AbsoluteFill>
  );
};

// Scales `grain` so the same number gives the same strength as <Grain> in post3d.tsx.
const GAIN = 3;
