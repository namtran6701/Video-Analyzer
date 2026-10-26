import React from "react";
import { AbsoluteFill, Img, random, staticFile } from "remotion";
import { Icon, Line, Mono, clamp01, inExpo, mixHex, outExpo, ramp, typed, useT, wipe } from "../kit";
import { APPS, Tile, dockRect } from "./demo-common";
import { spring, track } from "../lib/motion";
import { LOGO_D } from "../logo-path";
import { bt, color, font } from "../tokens";
import { voice } from "../vo";

export const Logo: React.FC<{ width: number; fill: string; markOnly?: boolean; style?: React.CSSProperties }> = ({ width, fill, markOnly, style }) => {
  const vbW = markOnly ? 39 : 206;
  return (
    <svg width={width} height={(width * 64) / vbW} viewBox={`0 0 ${vbW} 64`} style={{ display: "block", ...style }}>
      <path d={LOGO_D} fill={fill} />
    </svg>
  );
};

const GRID = [
  ["ROLE", "HRS", "RATE", "TOTAL"],
  ["Strategist", "24", "185", "4,440"],
  ["Designer", "40", "150", "6,000"],
  ["Copywriter", "18", "140", "2,520"],
  ["Account lead", "12", "165", "1,980"],
];

// Act 1: a lone Lime cell opens into the headline box as the words rise (M4).
export const Hook: React.FC = () => {
  const { t, u, width, height } = useT();
  const vo = voice("hook");
  const l1 = vo.seq("even in early 2026");
  const l2 = vo.seq("our work still lived in spreadsheets");
  const cell = { w: 300 * u, h: 76 * u };
  const end = { w: 1420 * u, h: 300 * u };
  const m = spring(t - bt(l1[0] - 0.3), "default");
  const w = cell.w + (end.w - cell.w) * m;
  const h = cell.h + (end.h - cell.h) * m;
  return (
    <AbsoluteFill style={{ background: color.darkBg }}>
      <div style={{ position: "absolute", left: (width - w) / 2, top: (height - h) / 2, width: w, height: h, border: `${3 * u}px solid ${mixHex(color.accent, color.darkText, m)}`, background: `rgba(38,58,61,${m})`, opacity: ramp(t, 0, 0.12), boxSizing: "border-box" }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 10 * u, flexDirection: "column" }}>
        <Line text="Even in early 2026," start={l1[0]} times={l1} mode="dark" />
        <Line text="our work still lived in spreadsheets." start={l2[0]} times={l2} mode="dark" />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const PROPS: { line: string; vo: string; title: string; rows: string[][] }[] = [
  {
    line: "Estimates priced [calculator] from memory.",
    vo: "estimates priced from memory",
    title: "ESTIMATING WORKSHEET · v7 FINAL (2).xlsx",
    rows: GRID.slice(1).map((r) => [r[0], r[1], "$" + r[2], "$" + r[3]]).concat([["Total", "", "", "=SUM(?)"]]),
  },
  {
    line: "Store [camera] photos nobody could search.",
    vo: "store photos nobody could search",
    title: "CAMERA ROLL · STORE VISITS",
    rows: [["IMG_4381.jpeg", "no tags"], ["IMG_4383 (1).jpeg", "no tags"], ["PXL_20260116_210335350.jpg", "no tags"], ["IMG_4402.HEIC", "no tags"], ["Search “end cap”", "!0 results"]],
  },
  {
    line: "AI [sparkles] know-how, stuck with a few people.",
    vo: "ai knowhow stuck with a few people",
    title: "TEAM CHAT · #ASK-ANYTHING",
    rows: [["“How did you make that video?”"], ["“Which AI tool do we use for this?”"], ["“Can you show me later?”"], ["“Is there a guide somewhere?”"], ["!No replies yet"]],
  },
];

const PROP_W = 1240;
const PROP_GAP = 220;

// A problem prop that builds itself: frame draws on, title types, rows wipe in behind a scan line.
const Prop: React.FC<{ p: (typeof PROPS)[number]; t0: number }> = ({ p, t0 }) => {
  const { t, u } = useT();
  const frame = ramp(t, t0 - 0.3, 0.6, outExpo);
  const rowH = 59 * u;
  return (
    <div style={{ position: "relative", width: PROP_W * u, background: color.darkSurface, padding: 28 * u, boxSizing: "border-box", clipPath: wipe(frame, "top") }}>
      <div style={{ position: "absolute", inset: 0, border: `${3 * u}px solid #3A5154` }} />
      <Mono size={24 * u} color="#7E9093">
        {typed(p.title, t, t0 - 0.2, t0 + 0.4)}
      </Mono>
      <div style={{ marginTop: 18 * u }}>
        {p.rows.map((row, i) => {
          const a = ramp(t, t0 + 0.2 + bt(0.45 * i), 0.4, outExpo);
          const scan = a > 0 && a < 1;
          return (
            <div key={i} style={{ position: "relative", height: rowH, display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid #33494C`, fontFamily: font.mono, fontSize: 34 * u, color: "#C9D4D5" }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", clipPath: wipe(a) }}>
                {row.map((c, j) => (
                  <span key={j} style={{ flex: j === 0 ? 2 : 1, textAlign: j === 0 ? "left" : "right", color: c.includes("?") || c.startsWith("!") ? "#E7A07F" : undefined }}>
                    {c.replace(/^!/, "")}
                  </span>
                ))}
              </div>
              {scan ? <div style={{ position: "absolute", top: 4 * u, bottom: 4 * u, left: `${a * 100}%`, width: 3 * u, background: color.accent, boxShadow: `0 0 ${12 * u}px ${color.accent}` }} /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Act 2: the three complaints sit side by side on one long strip; the camera glides from one to the next
// on the VO, then pulls back to show all three before they fold into app tiles in the reveal.
export const Problem: React.FC = () => {
  const { t, u, width, height } = useT();
  const vo = voice("problem");
  const times = PROPS.map((p) => vo.seq(p.vo));
  const step = (PROP_W + PROP_GAP) * u;
  const pullAt = times[2][times[2].length - 1] + 0.8;
  const cam = track(t, [[0, 0], [bt(times[1][0] - 0.9), 1], [bt(times[2][0] - 0.9), 2], [bt(pullAt), 1]], "heavy");
  const pull = spring(t - bt(pullAt), "heavy");
  const scale = 1 - 0.62 * pull;
  return (
    <AbsoluteFill style={{ background: color.darkBg, perspective: 1800 * u }}>
      <div style={{ position: "absolute", left: width / 2, top: height * 0.58, transform: `scale(${scale}) translateX(${-cam * step}px)`, transformOrigin: "0 0" }}>
        {PROPS.map((p, k) => {
          const d = k - cam;
          const focus = clamp01(1 - Math.abs(d)) * (1 - pull) + pull;
          return (
            <div key={k} style={{ position: "absolute", left: k * step - (PROP_W * u) / 2, top: 0, transform: `translateY(-50%) rotateY(${-d * 18 * (1 - pull)}deg) scale(${0.86 + 0.14 * focus})`, opacity: 0.35 + 0.65 * focus, transformOrigin: d > 0 ? "0 50%" : "100% 50%" }}>
              <Prop p={p} t0={bt(times[k][0] - 0.6)} />
            </div>
          );
        })}
      </div>
      {PROPS.map((p, k) => {
        const next = k < 2 ? times[k + 1][0] - 1.2 : pullAt - 0.4;
        if (t > bt(next) + 0.6) return null;
        return (
          <div key={k} style={{ position: "absolute", top: height * 0.12, left: 0, right: 0 }}>
            <Line text={p.line} start={times[k][0]} times={times[k]} mode="dark" karaoke exit={next} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Grain: React.FC<{ opacity: number }> = ({ opacity }) => {
  const { frame } = useT();
  return (
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity, mixBlendMode: "overlay" }}>
      <filter id={`g${frame}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={Math.floor(random(`grain${frame}`) * 1000)} />
      </filter>
      <rect width="100%" height="100%" filter={`url(#g${frame})`} />
    </svg>
  );
};

// Act 3: "So we built our own." The three problem props fold into the three app tiles,
// the tiles converge into the logo on light shafts (M8), washing to Canvas.
export const Reveal: React.FC = () => {
  const { t, frame, u, width, height } = useT();
  const words = voice("reveal").seq("so we built our own tools");
  const exit = words[5] + 1;
  const plateIn = ramp(t, bt(exit - 1), bt(1.5));
  const fold = spring(t - bt(words[2] - 1), "default");
  const merge = spring(t - bt(exit), { k: 200, d: 26 });
  const logo = spring(t - bt(exit + 0.5), "heavy");
  const wash = ramp(t, bt(6.5), bt(1.5), (x) => x * x);
  const idx = Math.min(124, frame + 1);
  const step = (PROP_W + PROP_GAP) * u;
  const s0 = 0.38;
  const tw = 300 * u;
  const th = 64 * u;
  const s1 = tw / (PROP_W * u);
  const propH = 399 * u;
  return (
    <AbsoluteFill style={{ background: color.darkBg }}>
      <AbsoluteFill style={{ opacity: plateIn }}>
        <Img src={staticFile(`plates/reveal/${String(idx).padStart(4, "0")}.png`)} style={{ width: "100%", height: "100%" }} />
        <Grain opacity={0.08} />
      </AbsoluteFill>
      {PROPS.map((p, k) => {
        const sc = s0 + (s1 - s0) * fold;
        const fromX = width / 2 + s0 * (k - 1) * step;
        const toX = width / 2 + (k - 1) * (tw + 24 * u);
        const x = fromX + (toX - fromX) * fold + (width / 2 - toX) * merge;
        const y = height * 0.58 + (height * 0.7 - height * 0.58) * fold + (height * 0.5 - height * 0.7) * merge;
        const visH = propH + (th / sc - propH) * fold;
        const clipY = Math.max(0, (propH - visH) / 2);
        const face = clamp01((fold - 0.25) / 0.35);
        return (
          <div key={k} style={{ position: "absolute", left: x, top: y, width: PROP_W * u, height: propH, transform: `translate(-50%, -50%) scale(${sc * (1 - merge * 0.9)})`, clipPath: `inset(${clipY}px 0 ${clipY}px 0)`, opacity: 1 - clamp01((merge - 0.6) / 0.3) }}>
            <Prop p={p} t0={-100} />
            <div style={{ position: "absolute", left: 0, right: 0, top: clipY, bottom: clipY, background: color.darkSurface, border: `${3 / sc}px solid ${color.darkText}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", gap: 14 / sc * u, opacity: face }}>
              <Icon name={APPS[k][1]} size={(26 / sc) * u} stroke={color.darkText} />
              <Mono size={(17 / sc) * u} color={color.darkText}>
                {APPS[k][0]}
              </Mono>
            </div>
          </div>
        );
      })}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `translateY(${-height * 0.08 * (1 - merge)}px)` }}>
        <Line text="So we built our own tools." start={0} times={words.map((w) => Math.max(0, w))} mode="dark" exit={exit} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ clipPath: wipe(logo, "bottom"), transform: `scale(${0.94 + 0.06 * logo})` }}>
          <Logo width={620 * u} fill={color.darkText} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: color.lightBg, opacity: wash }} />
    </AbsoluteFill>
  );
};

// Act 4: promise line + inline-icon nouns, then the three app tiles rise into the dock the demos grow out of.
export const Positioning: React.FC = () => {
  const { t, u, width, height } = useT();
  const lift = spring(t, "default");
  const nounAt = voice("positioning").seq("apps live automations");
  const nouns: [string, string][] = [
    ["sparkles", "smart apps"],
    ["database", "live data"],
    ["zap", "automations"],
  ];
  const out = nounAt[2] + 0.8;
  return (
    <AbsoluteFill style={{ background: color.lightBg }}>
      <div style={{ position: "absolute", left: "50%", top: height * (0.5 - 0.3 * lift), transform: `translate(-50%, -50%) scale(${1 - 0.55 * lift})`, clipPath: wipe(1 - ramp(t, bt(out), 0.4, inExpo), "top") }}>
        <Logo width={620 * u} fill={color.lightText} />
      </div>
      <div style={{ position: "absolute", top: height * 0.38, left: 0, right: 0 }}>
        <Line text="Built in-house. Built for *efficiency*." start={0.5} mode="light" exit={out} />
      </div>
      <div style={{ position: "absolute", top: height * 0.56, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 56 * u }}>
        {nouns.map(([icon, label], i) => {
          const p = ramp(t, bt(nounAt[i] - 0.15), 0.5, outExpo);
          const q = ramp(t, bt(out) + i * 0.04, 0.4, inExpo);
          return (
            <div key={label} style={{ overflow: "hidden", padding: `${6 * u}px 0` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 * u, transform: `translateY(${(1 - p) * 120 - q * 120}%)`, fontFamily: font.display, fontWeight: 700, fontSize: 52 * u, color: color.lightText }}>
                <Icon name={icon} size={44 * u} stroke={color.lightText} />
                {label}
              </div>
            </div>
          );
        })}
      </div>
      {APPS.map((_, k) => {
        const r = dockRect(k, u, width);
        const p = spring(t - bt(out + k * 0.15), "default");
        const y = height * 0.62 + (r.y - height * 0.62) * p;
        return <Tile key={k} k={k} state={k === 0 && t > bt(7.6) ? "active" : "idle"} style={{ position: "absolute", left: r.x, top: y, width: r.w, height: r.h, clipPath: wipe(ramp(t, bt(out + k * 0.15) - 0.1, 0.35, outExpo), "bottom") }} />;
      })}
    </AbsoluteFill>
  );
};

// Title card, fully composed on frame 0 so players that show the first frame get a real thumbnail.
// It holds on the light shafts for a bar, then the type drops away into the dark hook.
export const Intro: React.FC = () => {
  const { t, u, height } = useT();
  const out = ramp(t, bt(2.8), bt(1.15), inExpo);
  const push = 1 + 0.03 * clamp01(t / bt(4));
  return (
    <AbsoluteFill style={{ background: color.darkBg }}>
      <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${push})` }}>
        <Img src={staticFile("plates/reveal/0124.png")} style={{ width: "100%", height: "100%" }} />
        <AbsoluteFill style={{ background: "rgba(28,44,46,0.35)" }} />
        <Grain opacity={0.08} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", clipPath: wipe(1 - out, "top") }}>
        <Logo width={330 * u} fill={color.darkText} style={{ marginTop: height * 0.13 }} />
        <Mono size={22 * u} color={color.accent} style={{ marginTop: 46 * u }}>
          AI capabilities · 2026
        </Mono>
        <div style={{ marginTop: 22 * u, textAlign: "center", fontFamily: font.display, fontWeight: 900, fontSize: 128 * u, lineHeight: 1.04, letterSpacing: font.tracking, color: color.darkText }}>
          Built in-house.
          <br />
          Built for <span style={{ color: color.accent }}>efficiency.</span>
        </div>
        <div style={{ marginTop: 64 * u, display: "flex", gap: 22 * u }}>
          {APPS.map((_, k) => (
            <Tile key={k} k={k} state="idle" style={{ width: 300 * u, height: 68 * u }} />
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 14 * u, padding: `0 ${22 * u}px`, height: 68 * u, boxSizing: "border-box", border: `${3 * u}px solid ${color.lightText}`, background: color.accentFill }}>
            <Icon name="zap" size={26 * u} stroke={color.lightText} />
            <Mono size={17 * u} color={color.lightText}>
              Automations
            </Mono>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
