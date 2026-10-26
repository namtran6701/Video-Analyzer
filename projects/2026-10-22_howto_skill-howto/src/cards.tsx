import { useGsapTimeline } from "@remotion/gsap";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";
import React from "react";
import { AbsoluteFill } from "remotion";
import { color, font, HEIGHT, WIDTH } from "./tokens";

gsap.registerPlugin(SplitText, DrawSVGPlugin);

const cardType: React.CSSProperties = {
  fontFamily: font.serif,
  fontWeight: font.serifWeight,
  fontSize: font.cardSize,
  lineHeight: font.cardLineHeight,
  color: color.ink,
  letterSpacing: "-0.005em",
  textAlign: "center",
};

const Doc: React.FC<{ band: string; label: string; glyph?: string }> = ({ band, label, glyph }) => (
  <svg width="140" height="172" viewBox="0 0 104 128">
    <path d="M10 2h58l32 32v84a8 8 0 0 1-8 8H10a8 8 0 0 1-8-8V10a8 8 0 0 1 8-8z" fill="#fff" stroke="#d6d3cc" strokeWidth="2" />
    <path d="M68 2v24a8 8 0 0 0 8 8h24" fill="#f3f1ec" stroke="#d6d3cc" strokeWidth="2" />
    {glyph && (
      <text x="51" y="72" textAnchor="middle" fontFamily="ui-monospace, Menlo, monospace" fontSize="26" fill="#8a877f">
        {glyph}
      </text>
    )}
    <rect x="12" y="86" width="80" height="28" rx="5" fill={band} />
    <text x="52" y="106" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontWeight="700" fontSize="16" fill="#fff">
      {label}
    </text>
  </svg>
);

const Arrow: React.FC = () => (
  <svg width="72" height="31" viewBox="0 0 56 24">
    <path d="M2 12h48M40 3l10 9-10 9" fill="none" stroke="#a9a59c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Opener: React.FC = () => {
  const scope = useGsapTimeline<HTMLDivElement>(({ timeline: tl, selector }) => {
    const title = SplitText.create(selector(".title"), { type: "chars" });
    const sub = SplitText.create(selector(".sub"), { type: "words" });
    tl.from(selector(".html"), { y: 80, scale: 0.85, autoAlpha: 0, duration: 0.7, ease: "power3.out" }, 0.1)
      .from(selector(".arrow path"), { drawSVG: "0%", duration: 0.5, ease: "power2.inOut" }, 0.7)
      .from(selector(".out"), { x: -220, scale: 0.9, autoAlpha: 0, duration: 0.7, stagger: 0.12, ease: "power3.out" }, 0.8)
      .from(title.chars, { yPercent: 60, autoAlpha: 0, duration: 0.6, stagger: 0.025, ease: "power3.out" }, 1.2)
      .from(sub.words, { y: 16, autoAlpha: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" }, 1.9)
      // Push-through: the card rushes past the camera as the app window arrives.
      .to(selector(".content"), { scale: 1.8, filter: "blur(12px)", duration: 0.6, ease: "power2.in" }, 4.5)
      .to(selector(".content"), { autoAlpha: 0, duration: 0.3, ease: "power1.in" }, 4.55)
      .to(selector(".bg"), { autoAlpha: 0, duration: 0.5, ease: "power1.inOut" }, 4.65);
  });
  return (
    <AbsoluteFill ref={scope} style={{ alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill className="bg" style={{ background: color.oat }} />
      <div className="content" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 30 }}>
          <div className="html" style={{ position: "relative", zIndex: 1 }}>
            <Doc band="#6b6a66" label="HTML" glyph="</>" />
          </div>
          <div className="arrow">
            <Arrow />
          </div>
          <div className="out">
            <Doc band="#d93a2b" label="PDF" />
          </div>
          <div className="out">
            <Doc band="#d0552b" label="PPTX" />
          </div>
        </div>
        <div className="title" style={cardType}>
          How to use skills
        </div>
        <div className="sub" style={{ ...cardType, fontSize: 48, color: color.inkDim, marginTop: 10 }}>
          HTML to PDF &amp; PPTX
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Line 2 is "Type [/] to use one." with fixed side widths, so the key's resting spot is known.
const KEY = 92;
const SIDE = { l: 210, r: 430 };
const LINE = font.cardSize * font.cardLineHeight;
const GAP = 24;
const rest = { x: WIDTH / 2 + (SIDE.l - SIDE.r) / 2, y: HEIGHT / 2 + (GAP + LINE) / 2 };

export const Outro: React.FC = () => {
  const scope = useGsapTimeline<HTMLDivElement>(({ timeline: tl, selector }) => {
    const line1 = SplitText.create(selector(".l1"), { type: "chars" });
    // The key catches the shrinking window at center, presses, then glides into the sentence.
    tl.from(selector(".key"), { x: WIDTH / 2 - rest.x, y: HEIGHT / 2 - rest.y, scale: 1.63, duration: 0.8, ease: "power3.inOut" }, 2.2)
      .from(selector(".pop"), { scale: 0.85, autoAlpha: 0, duration: 0.35, ease: "power2.out" }, 0.7)
      .to(selector(".cap"), { y: 6, boxShadow: "0 0px 0 #d6d3cc", duration: 0.08, ease: "power2.in" }, 1.4)
      .to(selector(".cap"), { y: 0, boxShadow: "0 6px 0 #d6d3cc", duration: 0.3, ease: "power2.out" }, 1.48)
      .fromTo(selector(".ring"), { scale: 0.08, autoAlpha: 1 }, { scale: 1, autoAlpha: 0, duration: 1.6, ease: "power2.out" }, 1.45)
      .fromTo(selector(".halo"), { scale: 0.1, autoAlpha: 1 }, { scale: 0.7, autoAlpha: 0, duration: 1.2, ease: "power2.out" }, 1.45)
      .from(line1.chars, { yPercent: 50, autoAlpha: 0, duration: 0.6, stagger: 0.02, ease: "power3.out" }, 2.45)
      .from(selector(".w"), { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.12, ease: "power3.out" }, 2.85)
      .to(selector(".all"), { scale: 1.03, duration: 4.5, ease: "sine.inOut" }, 3.4);
  });
  const disc = (size: number): React.CSSProperties => ({
    position: "absolute",
    left: WIDTH / 2 - size / 2,
    top: HEIGHT / 2 - size / 2,
    width: size,
    height: size,
    borderRadius: "50%",
  });
  return (
    <AbsoluteFill ref={scope}>
      <AbsoluteFill className="all">
        <div className="halo" style={{ ...disc(1400), background: `radial-gradient(circle, ${color.accentGlow}, transparent 70%)` }} />
        <div className="ring" style={{ ...disc(1400), border: `6px solid ${color.accent}` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: HEIGHT / 2 - LINE - GAP / 2, ...cardType }}>
          <div className="l1" style={{ height: LINE }}>
            Skills work the same way in Claude.
          </div>
          <div style={{ display: "flex", justifyContent: "center", height: LINE, marginTop: GAP }}>
            <div className="w" style={{ width: SIDE.l, textAlign: "right" }}>
              Type
            </div>
            <div style={{ width: KEY + 44 }} />
            <div className="w" style={{ width: SIDE.r, textAlign: "left" }}>
              to use one.
            </div>
          </div>
        </div>
        <div className="key" style={{ position: "absolute", left: rest.x - KEY / 2, top: rest.y - KEY / 2, width: KEY, height: KEY }}>
          <div className="pop" style={{ width: "100%", height: "100%" }}>
            <div
              className="cap"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                borderRadius: 16,
                background: "#fff",
                border: "2px solid #d6d3cc",
                boxShadow: "0 6px 0 #d6d3cc",
                fontFamily: "ui-monospace, Menlo, monospace",
                fontSize: 56,
                color: color.ink,
              }}
            >
              /
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
