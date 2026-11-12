// Burned-in captions. Copy to src/lib/captions.tsx. Pages come from vo.py (src/captions.json).
//   <Captions pages={pages} fontFamily={font.sans} />   once, over every scene
// captionBand() is also the layout rule: reserve the band before laying out any scene that plays under a page.
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

export type CaptionPage = { text: string; startMs: number; endMs: number; band?: 'bottom' | 'top' };

// Bands as fractions of height. 9:16 sits higher to clear the platform overlays.
export const captionBand = (width: number, height: number, pos: 'bottom' | 'top' = 'bottom') => {
  const [a, b] = height > width ? (pos === 'bottom' ? [0.62, 0.78] : [0.11, 0.24]) : pos === 'bottom' ? [0.8, 0.92] : [0.06, 0.18];
  return { top: height * a, height: height * (b - a) };
};

// `debug` outlines the active band, for the critique loop's "nothing important inside it" check.
export const Captions = ({ pages, fontFamily, color = '#fff', backing = 'rgba(20,24,26,.6)', debug = false }: { pages: CaptionPage[]; fontFamily: string; color?: string; backing?: string; debug?: boolean }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const page = pages.find((p) => ms >= p.startMs && ms < p.endMs);
  if (!page) return null;
  const u = Math.min(width, height) / 1080;
  const { top, height: h } = captionBand(width, height, page.band);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top, height: h, left: width * 0.11, width: width * 0.78, display: 'flex', alignItems: 'center', justifyContent: 'center', outline: debug ? '3px dashed magenta' : undefined }}>
        <div style={{ background: backing, borderRadius: 10 * u, padding: `${8 * u}px ${24 * u}px`, fontFamily, fontWeight: 500, fontSize: 46 * u, lineHeight: 1.2, color, textAlign: 'center', textWrap: 'balance' }}>{page.text}</div>
      </div>
    </AbsoluteFill>
  );
};
