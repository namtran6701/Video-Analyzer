import { Video } from "@remotion/media";
import { AbsoluteFill, Easing, Img, interpolate, random, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CAPTION_BASELINE, FONT, unit } from "./tokens";

export type Look = { sat?: number; contrast?: number; bright?: number; vignette?: boolean; invert?: boolean };

export const BW: Look = { sat: 0, contrast: 1.35, bright: 0.85 };

const filterOf = ({ sat = 1, contrast = 1, bright = 1, invert }: Look) =>
  `grayscale(${1 - sat}) contrast(${contrast}) brightness(${bright})${invert ? " invert(1)" : ""}`;

const Vignette = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 18%, rgba(4,4,4,.97) 62%)" }} />
);

const Frame = ({ look, scale = 1, origin = "50% 50%", blur = 0, dim = 1, children }: { look: Look; scale?: number; origin?: string; blur?: number; dim?: number; children: React.ReactNode }) => (
  <AbsoluteFill style={{ backgroundColor: C.ground, overflow: "hidden" }}>
    <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: origin, filter: `${filterOf(look)} brightness(${dim})${blur ? ` blur(${blur}px)` : ""}` }}>
      {children}
    </AbsoluteFill>
    {look.vignette && <Vignette />}
  </AbsoluteFill>
);

const media = { width: "100%", height: "100%", objectFit: "cover" } as const;

const ClipSrc = ({ id, trim }: { id: string; trim: number }) => {
  const { fps } = useVideoConfig();
  return <Video src={staticFile(`clips/${id}.mp4`)} trimBefore={Math.round(trim * fps)} muted style={media} />;
};

// Stock clip with its native motion plus a barely visible push (about 2% over the shot).
export const Clip = ({ id, trim, look = {}, push = 0.02, dimFrom, zoom = 1, origin }: { id: string; trim: number; look?: Look; push?: number; dimFrom?: number; zoom?: number; origin?: string }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = zoom * (1 + push * (f / durationInFrames));
  const dim = dimFrom === undefined ? 1 : interpolate(f, [dimFrom, dimFrom + 15], [1, 0.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Frame look={look} scale={scale} origin={origin} dim={dim}>
      <ClipSrc id={id} trim={trim} />
    </Frame>
  );
};

export const Still = ({ id, look = BW, push = 0 }: { id: string; look?: Look; push?: number }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <Frame look={look} scale={1 + push * (f / durationInFrames)}>
      <Img src={staticFile(`stills/${id}.jpg`)} style={media} />
    </Frame>
  );
};

// Arrives out of the whip zoom (blur and scale settling over `settle` frames), then holds perfectly still.
export const SettleStill = ({ id, look = BW, settle = 12 }: { id: string; look?: Look; settle?: number }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, settle], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <Frame look={look} scale={1.25 - 0.25 * p} blur={18 * (1 - p)}>
      <Img src={staticFile(`stills/${id}.jpg`)} style={media} />
    </Frame>
  );
};

export type StrobeItem = { id: string; trim?: number; invert?: boolean };

// Images back to back, `len` frames each. Items with a trim are clip frames, the rest stills.
export const Strobe = ({ items, len = 3, look = BW }: { items: StrobeItem[]; len?: number; look?: Look }) => (
  <AbsoluteFill>
    {items.map((it, i) => (
      <Sequence key={i} from={i * len} durationInFrames={len}>
        {it.trim === undefined ? <Still id={it.id} look={{ ...look, invert: it.invert }} /> : <Clip id={it.id} trim={it.trim} look={{ ...look, invert: it.invert }} push={0} />}
      </Sequence>
    ))}
  </AbsoluteFill>
);

// Jump cut every `every` frames: each segment skips `skip` frames of the source.
export const JumpClip = ({ id, trim, look = BW, every = 5, skip = 10, zoom, origin }: { id: string; trim: number; look?: Look; every?: number; skip?: number; zoom?: number; origin?: string }) => {
  const { durationInFrames, fps } = useVideoConfig();
  const n = Math.ceil(durationInFrames / every);
  return (
    <AbsoluteFill>
      {Array.from({ length: n }, (_, k) => (
        <Sequence key={k} from={k * every} durationInFrames={every}>
          <Clip id={id} trim={trim + (k * (every + skip)) / fps} look={look} push={0} zoom={zoom} origin={origin} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Scan slices: the same clip at several points in its run, swapping every 2 or 3 frames.
export const SliceClip = ({ id, trims, look = BW }: { id: string; trims: number[]; look?: Look }) => {
  const { durationInFrames, fps } = useVideoConfig();
  const segs: { from: number; len: number; trim: number }[] = [];
  for (let at = 0, k = 0; at < durationInFrames; k++) {
    const len = Math.min(k % 2 ? 3 : 2, durationInFrames - at);
    segs.push({ from: at, len, trim: trims[k % trims.length] + at / fps });
    at += len;
  }
  return (
    <AbsoluteFill>
      {segs.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.len}>
          <Clip id={id} trim={s.trim} look={look} push={0} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// First `frames` frames arrive as horizontally torn strips.
export const GlitchIn = ({ frames = 3, children }: { frames?: number; children: React.ReactNode }) => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  if (f >= frames) return <AbsoluteFill>{children}</AbsoluteFill>;
  const strips = 12;
  return (
    <AbsoluteFill style={{ backgroundColor: C.ground }}>
      {Array.from({ length: strips }, (_, i) => {
        const dx = (random(`glitch-${f}-${i}`) - 0.5) * width * 0.25;
        const top = (i / strips) * 100;
        return (
          <AbsoluteFill key={i} style={{ clipPath: `inset(${top}% 0 ${100 - top - 100 / strips}% 0)`, transform: `translateX(${dx}px)` }}>
            {children}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

// Whip zoom over the last `len` frames: accelerating scale with growing blur.
export const WhipOut = ({ len = 15, children }: { len?: number; children: React.ReactNode }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(f, [durationInFrames - len, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  return <AbsoluteFill style={{ transform: `scale(${1 + 3 * p})`, filter: p ? `blur(${p * 24}px)` : undefined }}>{children}</AbsoluteFill>;
};

export const Flash = () => <AbsoluteFill style={{ backgroundColor: "#fff" }} />;
export const Black = () => <AbsoluteFill style={{ backgroundColor: C.ground }} />;

// The hook counter types one character per picture cut, dead center, and leaves by cut.
export const Counter = ({ text, steps }: { text: string; steps: number[] }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const u = unit(width, height);
  const n = steps.filter((s) => f >= s).length;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 220 * u, color: C.text, letterSpacing: "-0.02em", textShadow: `0 0 ${50 * u}px rgba(0,0,0,.7)` }}>
        {text.slice(0, n)}
      </div>
    </AbsoluteFill>
  );
};

// Odometer: digit k rolls only while every lower digit is carrying, so 0,998 -> 1,000 reads like a meter.
const digitAt = (n: number, k: number) => {
  const p = 10 ** k;
  const whole = Math.floor(n / p) % 10;
  const carry = Math.max(0, (n % p) - (p - 1));
  return k === 0 ? n % 10 : whole + carry;
};

export const DayCounter = ({ from, to }: { from: number; to: number }) => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const u = unit(width, height);
  const roll = (x: number) => interpolate(x, [4, durationInFrames - 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const p = roll(f);
  const n = from + (to - from) * p;
  const speed = (to - from) * (roll(f + 1) - p);
  const size = 140 * u;
  const digit = (k: number) => {
    const v = digitAt(n, k);
    return (
      <div key={k} style={{ height: size * 1.15, overflow: "hidden", width: size * 0.62 }}>
        <div style={{ transform: `translateY(${-(v % 10) * size * 1.15}px)`, filter: speed > 0.02 && k < 2 ? `blur(${Math.min(6, speed * 40) * u}px)` : undefined }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, i) => (
            <div key={i} style={{ height: size * 1.15, lineHeight: `${size * 1.15}px`, textAlign: "center" }}>{d}</div>
          ))}
        </div>
      </div>
    );
  };
  const scale = 1 + 0.08 * (f / durationInFrames);
  return (
    <AbsoluteFill style={{ backgroundColor: C.ground, alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `scale(${scale})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 * u }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 500, fontSize: 52 * u, letterSpacing: "0.3em", color: C.label }}>DAY</div>
        <div style={{ display: "flex", fontFamily: FONT.mono, fontWeight: 500, fontSize: size, color: C.text }}>
          <div style={{ display: "flex", opacity: interpolate(digitAt(n, 3), [0.5, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            {digit(3)}
            <div style={{ height: size * 1.15, lineHeight: `${size * 1.15}px`, width: size * 0.4, textAlign: "center" }}>,</div>
          </div>
          {digit(2)}
          {digit(1)}
          {digit(0)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Card = ({ text }: { text: string }) => {
  const { width, height } = useVideoConfig();
  const u = unit(width, height);
  return (
    <AbsoluteFill style={{ backgroundColor: C.ground, alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: FONT.ui, fontWeight: 600, fontSize: 92 * u, color: C.text, letterSpacing: "-0.02em" }}>{text}</div>
    </AbsoluteFill>
  );
};

export type CaptionPage = { text: string; start: number; end: number };

// Hard-swapped phrases of 3 words or fewer, centered, baseline in the 9:16 caption band.
export const Captions = ({ pages, hide = [] }: { pages: CaptionPage[]; hide?: [number, number][] }) => {
  const f = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const u = unit(width, height);
  const t = f / fps;
  const page = pages.find((p) => t >= p.start && t < p.end);
  if (!page || hide.some(([a, b]) => f >= a && f < b)) return null;
  const size = 64 * u;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: height * CAPTION_BASELINE - size,
          textAlign: "center",
          fontFamily: FONT.display,
          fontWeight: 500,
          fontSize: size,
          lineHeight: 1,
          color: C.text,
          whiteSpace: "nowrap",
          textShadow: `0 ${2 * u}px ${12 * u}px rgba(0,0,0,.55)`,
        }}
      >
        {page.text}
      </div>
    </AbsoluteFill>
  );
};
