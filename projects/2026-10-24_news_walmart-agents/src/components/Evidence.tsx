import { createContext, useContext } from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { evidence, Rect } from "../evidence";
import { spring } from "../lib/motion";
import { color, HEIGHT, motion, WIDTH } from "../tokens";

const PAD = 10; // image px of white margin kept around a framed region

// Children of <Evidence> draw in the screenshot's own CSS-pixel space; `s` converts screen px to it.
const Ctx = createContext({ s: 1 });
export const useEvidenceScale = () => useContext(Ctx).s;

type Props = {
  file: string;
  region?: Rect; // part of the image to frame; defaults to the whole image
  focus?: [number, number]; // push origin in image px; defaults to region centre
  push?: number;
  fill?: boolean; // full-bleed (viewport captures) instead of a floating card
  children?: React.ReactNode;
};

export const Evidence: React.FC<Props> = ({ file, region, focus, push = motion.pushMax, fill, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const m = evidence[file];
  const [rx, ry, rw, rh] = region ?? [0, 0, m.w, m.h];
  const s = fill ? Math.max(WIDTH / rw, HEIGHT / rh) : Math.min((WIDTH * 0.94) / rw, (HEIGHT * 0.8) / rh);
  const left = (WIDTH - rw * s) / 2 - rx * s;
  const top = (HEIGHT - rh * s) / 2 - ry * s;
  const [fx, fy] = focus ?? [rx + rw / 2, ry + rh / 2];
  const p = interpolate(frame, [0, durationInFrames], [1, push], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: color.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${p})`, transformOrigin: `${left + fx * s}px ${top + fy * s}px` }}>
        {!fill && (
          <div
            style={{
              position: "absolute",
              left: left + (rx - PAD) * s,
              top: top + (ry - PAD) * s,
              width: (rw + PAD * 2) * s,
              height: (rh + PAD * 2) * s,
              borderRadius: 14,
              backgroundColor: "#fff",
              boxShadow: `0 12px 40px ${color.shadow}`,
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            left,
            top,
            width: m.w,
            height: m.h,
            transform: `scale(${s})`,
            transformOrigin: "0 0",
            // crop to the framed region so neighbouring paragraphs don't leak in
            clipPath: fill ? undefined : `inset(${ry - PAD}px ${m.w - rx - rw - PAD}px ${m.h - ry - rh - PAD}px ${rx - PAD}px round ${14 / s}px)`,
          }}
        >
          <Img src={staticFile(`evidence/${file}.png`)} style={{ width: m.w, height: m.h, display: "block" }} />
          <Ctx.Provider value={{ s }}>{children}</Ctx.Provider>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// N4: one bar per line, wiping left to right, multiplied under the text so the ink stays dark.
export const Highlight: React.FC<{ rects: Rect[]; from: number; seed?: string }> = ({ rects, from, seed = "hl" }) => {
  const frame = useCurrentFrame() - from;
  return (
    <>
      {rects.map(([x, y, w, h], i) => {
        const t = interpolate(frame - i * motion.barStagger, [0, motion.barWipe], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const pad = h * 0.075;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 3,
              top: y - pad,
              width: (w + 6) * t,
              height: h + pad * 2,
              backgroundColor: color.highlight,
              mixBlendMode: "multiply",
              transform: `rotate(${(random(`${seed}${i}`) - 0.5) * 1.2}deg)`,
              transformOrigin: "0 50%",
            }}
          />
        );
      })}
    </>
  );
};

// N5: stamp-red box drawn as a stroke reveal around the exact token.
export const RedBox: React.FC<{ rect: Rect; from: number }> = ({ rect, from }) => {
  const frame = useCurrentFrame() - from;
  const s = useEvidenceScale();
  if (frame < 0) return null;
  const pad = 6 / s;
  const sw = 4 / s;
  const [x, y, w, h] = [rect[0] - pad, rect[1] - pad, rect[2] + pad * 2, rect[3] + pad * 2];
  const per = 2 * (w + h);
  const t = interpolate(frame, [0, motion.boxDraw], [0, 1], { extrapolateRight: "clamp" });
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={3 / s}
        fill="none"
        stroke={color.stamp}
        strokeWidth={sw}
        strokeDasharray={per}
        strokeDashoffset={per * (1 - t)}
      />
    </svg>
  );
};

// N6: pointing hand popping in from the lower right, two tap bobs toward the target.
export const Hand: React.FC<{ rect: Rect; from: number }> = ({ rect, from }) => {
  const frame = useCurrentFrame() - from;
  const s = useEvidenceScale();
  const { fps } = useVideoConfig();
  if (frame < 0) return null;
  const size = (HEIGHT * 0.09) / s;
  const pop = spring(frame / fps, "playful");
  const bob = frame < 6 ? 0 : frame < 22 ? Math.abs(Math.sin(((frame - 6) / 8) * Math.PI)) * (8 / s) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: rect[0] + rect[2] * 0.6 + size * 0.15 - bob,
        top: rect[1] + rect[3] + size * 0.05 - bob,
        fontSize: size,
        lineHeight: 1,
        transform: `scale(${pop}) rotate(-20deg)`,
        transformOrigin: "20% 10%",
        filter: `drop-shadow(0 ${4 / s}px ${6 / s}px rgba(0,0,0,.5))`,
      }}
    >
      👆
    </div>
  );
};
