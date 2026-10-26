import React from "react";
import { AbsoluteFill } from "remotion";
import { Icon, Mono, clamp01, outExpo, ramp, useT, wipe } from "../kit";
import { spring } from "../lib/motion";
import { bt, color, font } from "../tokens";

export const WIN = { x: 160, y: 140, w: 1600, h: 600 };
const BASE_ZOOM = 1.12;

// The three hero apps as a dock: tiles the opener folds into, and each chapter grows out of and folds back into.
export const APPS: [string, string][] = [
  ["SF Pricing", "calculator"],
  ["Store Walk", "camera"],
  ["AI Training", "sparkles"],
];
export const dockRect = (k: number, u: number, width: number) => {
  const w = 300 * u;
  const gap = 24 * u;
  return { x: width / 2 - w / 2 + (k - 1) * (w + gap), y: 34 * u, w, h: 64 * u };
};

export const Tile: React.FC<{ k: number; state: "idle" | "active" | "done"; style?: React.CSSProperties }> = ({ k, state, style }) => {
  const { u } = useT();
  const [name, icon] = APPS[k];
  const dark = state === "active";
  const ink = dark ? color.darkText : color.lightText;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 * u, padding: `0 ${18 * u}px`, boxSizing: "border-box", border: `${3 * u}px solid ${color.lightText}`, background: dark ? color.lightText : state === "done" ? color.accentFill : color.lightBg, ...style }}>
      <Icon name={state === "done" ? "check" : icon} size={26 * u} stroke={ink} width={state === "done" ? 3 : 2.25} />
      <Mono size={17 * u} color={ink}>
        {name}
      </Mono>
    </div>
  );
};

export const Dock: React.FC<{ active: number; opacity?: number }> = ({ active, opacity = 1 }) => {
  const { u, width } = useT();
  return (
    <>
      {APPS.map((_, k) => {
        const r = dockRect(k, u, width);
        return <Tile key={k} k={k} state={k < active ? "done" : k === active ? "active" : "idle"} style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, opacity }} />;
      })}
    </>
  );
};

// One demo chapter. The window grows out of its dock tile (container transform), the camera can push in,
// the payoff is printed on the window's back and revealed by a 3D flip, then the card folds back into the tile.
export const Chapter: React.FC<{ k: number; beats: number; payoffAt: number; payoff: React.ReactNode; children: React.ReactNode; zoom?: number; focus?: [number, number] }> = ({ k, beats, payoffAt, payoff, children, zoom = 1, focus = [0.5, 0.5] }) => {
  const { t, u, width } = useT();
  const W = WIN.w * u * BASE_ZOOM;
  const H = WIN.h * u * BASE_ZOOM;
  const cx = (WIN.x + WIN.w / 2) * u;
  const cy = (WIN.y + WIN.h / 2) * u + 12 * u;
  const tile = dockRect(k, u, width);
  const grow = spring(t - 0.05, "default");
  const fold = spring(t - bt(beats - 1.6), { k: 220, d: 28 });
  const m = grow * (1 - fold);
  // Uniform scale from tile width, height cropped by clip so the box keeps the tile's shape at m = 0.
  const s0 = tile.w / W;
  const sc = s0 + (1 - s0) * m;
  const visH = tile.h / sc + (H - tile.h / sc) * m;
  const clipY = Math.max(0, (H - visH) / 2);
  const x = tile.x + tile.w / 2 + (cx - tile.x - tile.w / 2) * m;
  const y = tile.y + tile.h / 2 + (cy - tile.y - tile.h / 2) * m;
  const flip = spring(t - bt(payoffAt - 0.6), { k: 200, d: 26 });
  const faceAlpha = 1 - clamp01((m - 0.04) / 0.18);
  return (
    <AbsoluteFill style={{ background: color.lightBg }}>
      <Dock active={k} opacity={1} />
      <div style={{ position: "absolute", left: x - W / 2, top: y - H / 2, width: W, height: H, transform: `scale(${sc})`, clipPath: `inset(${clipY}px 0 ${clipY}px 0)`, perspective: 2400 * u }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${flip * 180}deg)` }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", border: `${3 * u}px solid ${color.lightText}`, overflow: "hidden", background: color.lightBg, boxShadow: `0 ${30 * u * m}px ${80 * u * m}px rgba(28,44,46,${0.18 * m})` }}>
            <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%` }}>
              <div style={{ position: "absolute", left: (W - WIN.w * u) / 2, top: (H - WIN.h * u) / 2, width: WIN.w * u, height: WIN.h * u, transform: `scale(${BASE_ZOOM})` }}>{children}</div>
            </div>
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", border: `${3 * u}px solid ${color.lightText}`, background: color.lightBg, display: "flex", alignItems: "center", justifyContent: "center" }}>{payoff}</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: clipY, bottom: clipY, display: "flex", alignItems: "center", justifyContent: "center", opacity: faceAlpha }}>
          <Tile k={k} state={fold > 0.5 ? "done" : "active"} style={{ flex: "none", width: tile.w, height: tile.h, transform: `scale(${1 / sc})` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Payoff on the back of the window: a masked headline with a Lime wipe and a mono sub line.
export const Payoff: React.FC<{ big: string; sub: string; at: number; subAt?: number }> = ({ big, sub, at, subAt = at + 1 }) => {
  const { t, u, headline } = useT();
  const p = ramp(t, bt(at), 0.6, outExpo);
  const bar = ramp(t, bt(at) + 0.2, 0.5, outExpo);
  const s = ramp(t, bt(subAt), 0.5, outExpo);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 * u }}>
      <div style={{ overflow: "hidden", padding: `${6 * u}px ${10 * u}px` }}>
        <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: headline * 1.15, color: color.lightText, letterSpacing: font.tracking, transform: `translateY(${(1 - p) * 120}%)`, background: `linear-gradient(${color.accentFill}, ${color.accentFill}) no-repeat 0 0 / ${bar * 100}% 100%`, padding: `0 ${14 * u}px` }}>{big}</div>
      </div>
      <div style={{ clipPath: wipe(s), display: "flex", alignItems: "center", gap: 14 * u }}>
        <div style={{ width: 28 * u, height: 3 * u, background: color.emberDeep }} />
        <Mono size={24 * u} color={color.lightDim}>
          {sub}
        </Mono>
      </div>
    </div>
  );
};

// App top bar: Anvil with a Lime rule underneath, as in the captures.
export const AppBar: React.FC<{ left: React.ReactNode; right?: React.ReactNode; h?: number }> = ({ left, right, h = 64 }) => {
  const { u } = useT();
  return (
    <div style={{ height: h * u, background: color.darkBg, borderBottom: `${4 * u}px solid ${color.accent}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${28 * u}px` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 * u }}>{left}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 22 * u }}>{right}</div>
    </div>
  );
};

export const money = (v: number, cents = true) => "$" + v.toLocaleString("en-US", { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 });
