import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FPS } from "./tokens";

// [start, end] in film seconds, matching where each voiceover line sits in mix_vo.wav.
const lines: [number, number, string][] = [
  [0.5, 4.1, "Hey, I'm Matt. Let me show you how to use skills in ChatGPT."],
  [5.6, 9.8, "Open the ChatGPT app and switch to Codex from the menu up top."],
  [10.2, 15.5, "Click the plus button, choose Files and folders, and attach your HTML file."],
  [17.6, 21.3, "Type a slash, find the skill you need, then tell it what to do."],
  [23.2, 25.5, "Hit send, and the skill takes it from there."],
  [28.6, 31.2, "A few seconds later, your PDF is ready."],
  [31.6, 33.4, "Click it to open the preview."],
  [39.0, 43.9, "And skills work the same way in Claude. Just type a slash and pick one."],
];

const FADE = 4;

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const line = lines.find(([a, b]) => frame >= a * FPS && frame < b * FPS);
  if (!line) return null;
  const [a, b, text] = line;
  const opacity = interpolate(frame, [a * FPS, a * FPS + FADE, b * FPS - FADE, b * FPS], [0, 1, 1, 0]);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, display: "flex", justifyContent: "center", opacity }}>
      <div
        style={{
          maxWidth: 1300,
          padding: "14px 28px",
          borderRadius: 14,
          background: "rgba(20,20,18,.78)",
          color: "#fff",
          fontFamily: "-apple-system, 'Helvetica Neue', Arial, sans-serif",
          fontSize: 40,
          fontWeight: 500,
          lineHeight: 1.3,
          textAlign: "center",
        }}
      >
        {text}
      </div>
    </div>
  );
};
