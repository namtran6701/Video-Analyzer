import { loadFont } from "@remotion/fonts";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { spring } from "./lib/motion";
import { color, font, FPS, photo, safe, Source, WIDTH } from "./tokens";

for (const [weight, style, file] of [
  ["400", "normal", "400-normal"],
  ["500", "normal", "500-normal"],
  ["400", "italic", "400-italic"],
  ["500", "italic", "500-italic"],
] as const) {
  loadFont({ family: font.display, url: staticFile(`fonts/cormorant-garamond-latin-${file}.woff2`), weight, style });
}
loadFont({ family: font.body, url: staticFile("fonts/jost-latin-400-normal.woff2"), weight: "400" });
loadFont({ family: font.body, url: staticFile("fonts/jost-latin-500-normal.woff2"), weight: "500" });

const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const out = Easing.bezier(0.22, 1, 0.36, 1);
const ramp = (t: number, a: number, b: number, easing = out) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

type Box = { x: number; y: number; w: number; h: number };
const mixBox = (a: Box, b: Box, p: number): Box => ({
  x: mix(a.x, b.x, p),
  y: mix(a.y, b.y, p),
  w: mix(a.w, b.w, p),
  h: mix(a.h, b.h, p),
});

// Shows a source region cropped to cover the box, zoomed around its focus point. Crop and scale only.
const Shot: React.FC<{
  s: Source;
  box: Box;
  zoom?: number;
  border?: number;
  opacity?: number;
  dx?: number;
  dy?: number;
  scale?: number;
  rotate?: number;
}> = ({ s, box, zoom = 1, border = 0, opacity = 1, dx = 0, dy = 0, scale = 1, rotate = 0 }) => {
  const [iw, ih] = s.nat;
  const [rx, ry, rw, rh] = s.region;
  const w = box.w - border * 2;
  const h = box.h - border * 2;
  const k = Math.max(w / rw, h / rh) * zoom;
  const vw = w / k;
  const vh = h / k;
  const left = clamp(s.focus[0] - vw / 2, rx, rx + rw - vw);
  const top = clamp(s.focus[1] - vh / 2, ry, ry + rh - vh);
  const media: React.CSSProperties = { position: "absolute", width: iw * k, height: ih * k, left: -left * k, top: -top * k };
  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        padding: border,
        background: color.paper,
        opacity,
        transform: `translate(${dx}px, ${dy}px) scale(${scale}) rotate(${rotate}deg)`,
        boxShadow: border > 0 ? `0 ${border * 1.6}px ${border * 4}px rgba(43, 39, 36, ${0.1 * Math.min(border / 18, 1)})` : "none",
      }}
    >
      <div style={{ position: "relative", width: w, height: h, overflow: "hidden" }}>
        {s.video ? <OffthreadVideo src={staticFile(s.src)} muted style={media} /> : <Img src={staticFile(s.src)} style={media} />}
      </div>
    </div>
  );
};

// Fades upward into place, leaves with a short fade.
const Line: React.FC<{
  t: number;
  at: number;
  until?: number;
  y: number;
  align?: "left" | "center";
  style: React.CSSProperties;
  children: React.ReactNode;
}> = ({ t, at, until = 99, y, align = "left", style, children }) => {
  const p = ramp(t, at, at + 0.8);
  const q = ramp(t, until, until + 0.35, inOut);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: align === "left" ? safe.left : 0,
        width: align === "left" ? safe.right - safe.left : WIDTH,
        textAlign: align,
        color: color.charcoal,
        whiteSpace: "nowrap",
        opacity: p * (1 - q),
        transform: `translateY(${(1 - p) * 26 - q * 14}px)`,
        filter: `blur(${(1 - p) * 6}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Rule: React.FC<{ t: number; at: number; until?: number; y: number; w: number }> = ({ t, at, until = 99, y, w }) => {
  const p = ramp(t, at, at + 0.9, inOut);
  const q = ramp(t, until, until + 0.35, inOut);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: (WIDTH - w * p) / 2,
        width: w * p,
        height: 2,
        background: color.champagne,
        opacity: 1 - q,
      }}
    />
  );
};

const headline: React.CSSProperties = { fontFamily: font.display, fontWeight: 500, fontSize: 96, lineHeight: 1, letterSpacing: "-0.01em" };
const accent: React.CSSProperties = { ...headline, fontStyle: "italic", fontWeight: 400 };
const caps = (size: number, spacing = "0.22em"): React.CSSProperties => ({
  fontFamily: font.body,
  fontWeight: 500,
  fontSize: size,
  letterSpacing: spacing,
  textTransform: "uppercase",
});

const FULL: Box = { x: 0, y: 0, w: 1080, h: 1920 };

const HookIntro: React.FC<{ t: number }> = ({ t }) => {
  const p1 = ramp(t, 3.0, 4.0, inOut);
  const p2 = ramp(t, 4.0, 4.9, inOut);
  const leave = ramp(t, 7.6, 8.2, inOut);
  const box = mixBox(mixBox(FULL, { x: 90, y: 398, w: 900, h: 1125 }, p1), { x: 165, y: 300, w: 750, h: 938 }, p2);
  const zoom = mix(1 + 0.08 * ramp(t, 0, 3.2, Easing.bezier(0.33, 0, 0.67, 1)), 1, p1);
  const veil = 1 - ramp(t, 2.9, 3.4, inOut);
  return (
    <>
      <Shot s={photo.hook} box={box} zoom={zoom} border={18 * p1} opacity={1 - leave} dy={-50 * leave} />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(247,242,234,0.82) 0%, rgba(247,242,234,0.55) 22%, rgba(247,242,234,0) 40%)`,
          opacity: veil,
        }}
      />
      <Line t={t} at={0.4} until={2.95} y={250} style={headline}>
        A little lash.
      </Line>
      <Line t={t} at={1.6} until={2.95} y={362} style={accent}>
        A lot of confidence.
      </Line>
      <Rule t={t} at={4.6} until={7.6} y={1290} w={220} />
      <Line t={t} at={4.9} until={7.6} y={1322} align="center" style={{ ...headline, fontSize: 104 }}>
        Lashes by Amber
      </Line>
      <Line t={t} at={5.6} until={7.6} y={1462} align="center" style={{ ...caps(28), color: color.soft }}>
        Winston-Salem, NC
      </Line>
    </>
  );
};

const CARD: Box = { x: 90, y: 330, w: 900, h: 900 };
const lookText = { y: 1290, style: headline };

const Looks: React.FC<{ t: number }> = ({ t }) => {
  const inN = spring(t - 8.0, "heavy");
  const push = spring(t - 11.0, "default");
  const bold = spring(t - 14.0, "heavy");
  const leave = ramp(t, 16.8, 17.25, inOut);
  return (
    <>
      {t < 12 && (
        <Shot s={photo.natural} box={CARD} border={18} dy={160 * (1 - inN)} dx={-1100 * push} opacity={ramp(t, 8.0, 8.5)} />
      )}
      {t >= 11 && t < 15 && (
        <Shot s={photo.wispy} box={CARD} border={18} dx={1100 * (1 - push)} opacity={1 - ramp(t, 13.9, 14.3, inOut)} />
      )}
      {t >= 14 && (
        <Shot
          s={photo.bold}
          box={CARD}
          border={18}
          scale={mix(0.9, 1, bold) - 0.03 * leave}
          zoom={mix(1.08, 1, ramp(t, 14, 15.6))}
          opacity={ramp(t, 14.0, 14.45) * (1 - leave)}
        />
      )}
      <Line t={t} at={8.4} until={10.7} {...lookText}>
        Naturally soft.
      </Line>
      <Line t={t} at={11.3} until={13.7} {...lookText}>
        A little wispy.
      </Line>
      <Line t={t} at={14.4} until={16.7} {...lookText}>
        Beautifully bold.
      </Line>
    </>
  );
};

const Details: React.FC<{ t: number }> = ({ t }) => {
  const a = spring(t - 17.0, "heavy");
  const b = spring(t - 17.12, "heavy");
  const grow = ramp(t, 19.0, 20.3, inOut);
  const leave = ramp(t, 22.6, 23.05, inOut);
  const boxB = mixBox({ x: 555, y: 330, w: 455, h: 680 }, { x: 70, y: 330, w: 940, h: 760 }, grow);
  return (
    <>
      <Shot
        s={photo.detailA}
        box={{ x: 70, y: 330, w: 455, h: 680 }}
        border={14}
        dy={90 * (1 - a)}
        dx={-520 * grow}
        opacity={ramp(t, 17.0, 17.5) * (1 - ramp(t, 19.0, 19.7))}
      />
      <Shot
        s={photo.detailB}
        box={boxB}
        border={14}
        dy={90 * (1 - b)}
        zoom={1 + 0.1 * ramp(t, 19.0, 23.0, Easing.bezier(0.33, 0, 0.67, 1))}
        opacity={ramp(t, 17.12, 17.6) * (1 - leave)}
      />
      <Line t={t} at={18.0} until={22.6} y={1180} style={headline}>
        Find your kind
      </Line>
      <Line t={t} at={19.0} until={22.6} y={1290} style={accent}>
        of beautiful.
      </Line>
    </>
  );
};

const Collage: React.FC<{ t: number }> = ({ t }) => {
  const leave = ramp(t, 27.7, 28.2, inOut);
  const tile = (at: number) => ({
    dy: 90 * (1 - spring(t - at, "heavy")) - 40 * leave,
    scale: mix(1.04, 1, spring(t - at, "heavy")),
    opacity: ramp(t, at, at + 0.5) * (1 - leave),
    border: 12,
  });
  return (
    <>
      <Shot s={photo.sideL} box={{ x: 60, y: 440, w: 220, h: 520 }} {...tile(23.25)} />
      <Shot s={photo.sideR} box={{ x: 800, y: 380, w: 220, h: 520 }} {...tile(23.4)} />
      <Sequence from={23 * FPS} durationInFrames={5.3 * FPS} layout="none">
        <Shot s={photo.clip} box={{ x: 300, y: 300, w: 480, h: 800 }} {...tile(23.0)} />
      </Sequence>
      <Line t={t} at={24.5} until={27.7} y={1200} style={{ ...headline, fontSize: 84 }}>
        Your style. Your lashes.
      </Line>
      <Line t={t} at={26.0} until={27.7} y={1300} style={{ ...accent, fontSize: 84 }}>
        By Amber.
      </Line>
    </>
  );
};

const Booking: React.FC<{ t: number }> = ({ t }) => {
  const reveal = ramp(t, 28.0, 28.9, inOut);
  const h = 520 * reveal;
  const center = { align: "center" as const, t };
  return (
    <>
      {h > 0 && <Shot s={photo.strip} box={{ x: 0, y: 0, w: 1080, h }} zoom={mix(1.06, 1, ramp(t, 28, 30.5))} />}
      <Line {...center} at={28.4} y={620} style={{ ...headline, fontSize: 74, letterSpacing: "0.08em" }}>
        BOOK YOUR LASHES
      </Line>
      <Line {...center} at={28.6} y={712} style={{ ...headline, fontSize: 74, letterSpacing: "0.08em" }}>
        WITH AMBER
      </Line>
      <Rule t={t} at={29.2} y={842} w={160} />
      <Line {...center} at={30.0} y={890} style={{ fontFamily: font.body, fontWeight: 500, fontSize: 66, letterSpacing: "0.01em" }}>
        magiclashesstudio.com
      </Line>
      <Line {...center} at={30.4} y={990} style={{ fontFamily: font.body, fontWeight: 400, fontSize: 48 }}>
        Tap Booking • Choose Amber
      </Line>
      <Line {...center} at={32.0} y={1140} style={{ fontFamily: font.body, fontWeight: 400, fontSize: 42 }}>
        Questions? DM @amberlashes.nc
      </Line>
      <Line {...center} at={32.15} y={1244} style={{ ...accent, fontSize: 62 }}>
        At Magic Lash Studio
      </Line>
      <Line {...center} at={32.3} y={1330} style={{ ...caps(30), color: color.soft }}>
        Winston-Salem, NC
      </Line>
    </>
  );
};

export const Main: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{ background: color.ivory }}>
      {t < 8.3 && <HookIntro t={t} />}
      {t >= 7.9 && t < 17.3 && <Looks t={t} />}
      {t >= 16.9 && t < 23.1 && <Details t={t} />}
      {t >= 22.9 && t < 28.3 && <Collage t={t} />}
      {t >= 28 && <Booking t={t} />}
      <Line t={t} at={6.2} until={27.6} y={196} align="center" style={{ ...caps(32, "0.06em"), textTransform: "none", color: "rgba(43, 39, 36, 0.8)" }}>
        @amberlashes.nc
      </Line>
      <Audio src={staticFile("mix.wav")} />
    </AbsoluteFill>
  );
};
