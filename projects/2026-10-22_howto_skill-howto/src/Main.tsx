import { loadFont } from "@remotion/fonts";
import { Audio } from "@remotion/media";
import { gsap } from "gsap";
import React from "react";
import {
  AbsoluteFill,
  Freeze,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { cameraAt, cameraTransform } from "./camera";
import { Captions } from "./captions";
import { Opener, Outro } from "./cards";
import { Clip, cameraKeys, DISSOLVE, footage, footageAt, SECTION, transforms, working } from "./timeline";
import { color, FPS, HEIGHT, motion, WIDTH, win } from "./tokens";

loadFont({ family: "Source Serif 4", url: staticFile("brand/SourceSerif4-400.woff2"), weight: "400" });

const Footage: React.FC<{ clip: Clip; src: number }> = ({ clip, src }) => (
  <Freeze frame={Math.round(src * FPS)}>
    <OffthreadVideo
      src={staticFile(`screens/${clip}.mp4`)}
      muted
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  </Freeze>
);

const wipeEase = gsap.parseEase("expo.inOut");

// Before layer on top of the live after layer; the mask moves, an accent band rides its edge.
const Transform: React.FC<{ t: (typeof transforms)[number]; frame: number }> = ({ t, frame }) => {
  if (frame < t.f || frame >= t.f + motion.wipe) return null;
  const p = wipeEase((frame - t.f) / motion.wipe);
  const edge = -20 + p * 140; // percent along a 120deg diagonal
  const mask = `linear-gradient(120deg, transparent ${edge - 6}%, black ${edge + 6}%)`;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, maskImage: mask, WebkitMaskImage: mask }}>
        <Footage clip="use_skill" src={t.beforeSrc} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(120deg, transparent ${edge - 14}%, ${color.accentWipe} ${edge}%, transparent ${edge + 10}%)`,
          filter: "blur(18px)",
          opacity: Math.sin(p * Math.PI) * 0.9,
        }}
      />
    </>
  );
};

// The frame shown just before a same-clip jump fades out over the new one.
const JumpDissolve: React.FC<{ keys: (typeof footage)[number]; frame: number }> = ({ keys, frame }) => {
  const i = keys.findIndex((k, j) => j > 0 && keys[j - 1].f === k.f && keys[j - 1].clip === k.clip && frame >= k.f && frame < k.f + DISSOLVE);
  if (i === -1) return null;
  const prev = keys[i - 1];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - (frame - prev.f) / DISSOLVE }}>
      <Footage clip={prev.clip} src={prev.src} />
    </div>
  );
};

const glowAt = (w: number, frame: number) => {
  const [a, b] = working[w - 1] ?? [0, 0];
  if (!b) return 0;
  return Math.min(
    interpolate(frame, [a, a + motion.glowIn], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [b, b + motion.glowOut], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
};

const Window: React.FC<{ i: number; frame: number }> = ({ i, frame }) => {
  const k = footageAt(footage[i], frame);
  const glow = glowAt(i, frame);
  return (
    <div
      style={{
        position: "absolute",
        left: i * (win.w + win.gap),
        top: 0,
        width: win.w,
        height: win.h,
        borderRadius: win.radius,
        overflow: "hidden",
        background: "#212121",
        boxShadow: `${win.shadow}, 0 0 ${60 * glow}px ${14 * glow}px ${color.accentGlow}`,
      }}
    >
      <Footage clip={k.clip} src={k.src} />
      <JumpDissolve keys={footage[i]} frame={frame} />
      {transforms.filter((t) => t.w === i).map((t) => <Transform key={t.f} t={t} frame={frame} />)}
      <div style={{ position: "absolute", inset: 0, borderRadius: win.radius, boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)" }} />
    </div>
  );
};

const World: React.FC<{ captions: boolean }> = ({ captions }) => {
  const frame = useCurrentFrame();
  const pose = cameraAt(cameraKeys, frame);
  // With captions, wide shots shrink and lift the window to clear a caption band; close-ups are untouched.
  const lift = captions ? interpolate(pose.s, [1, 1.45], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const p = { x: pose.x, y: pose.y + 75 * lift, s: pose.s * (1 - 0.14 * lift) };
  // Fades in under the opener's push-through, hands off to the "/" key at the end.
  const opacity = Math.min(
    interpolate(frame, [SECTION.demo[0] - 18, SECTION.demo[0] - 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [SECTION.outro[0] + 16, SECTION.outro[0] + 24], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: cameraTransform(p) }}>
        {footage.map((_, i) => (
          <Window key={i} i={i} frame={frame} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const Main: React.FC<{ audio?: string; captions?: boolean }> = ({ audio = "mix.wav", captions = false }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: color.stage, width: WIDTH, height: HEIGHT }}>
      {frame >= SECTION.demo[0] - 18 && frame < SECTION.outro[0] + 24 && <World captions={captions} />}
      <Sequence durationInFrames={SECTION.demo[0]}>
        <Opener />
      </Sequence>
      <Sequence from={SECTION.outro[0]}>
        <Outro />
      </Sequence>
      {captions && <Captions />}
      <Audio src={staticFile(audio)} />
    </AbsoluteFill>
  );
};
