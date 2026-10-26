import React from "react";
import { AbsoluteFill, Img, random, staticFile } from "remotion";
import { Cursor, Icon, Line, Mono, clamp01, mixHex, outExpo, press, ramp, typed, useT, wipe } from "../kit";
import { spring, track } from "../lib/motion";
import { bt, color, font } from "../tokens";
import { voice } from "../vo";
import { Logo } from "./Open";

// Act 6: three automated workflows stack up; each step lights on the word that names it.
export const Proof: React.FC = () => {
  const { t, u, width, height } = useT();
  const vo = voice("proof");
  const head = vo.seq("our automations run whole workflows");
  const [seo, content, survey, , named, centralized] = vo.seq("seo content survey media named centralized");
  const [leads, enriched, located, , weekly] = vo.seq("leads enriched located sent weekly");
  const rows: [string, string, [string, number][]][] = [
    ["search", "SEO content", [["Hours", seo], ["Minutes", content]]],
    ["camera", "Survey media", [["Collected", survey], ["Named", named], ["Centralized", centralized]]],
    ["user", "New leads", [["Enriched", enriched], ["Located", located], ["Sent weekly", weekly]]],
  ];
  const starts = [seo, survey, leads];
  const rowW = 1360 * u;
  const rowH = 128 * u;
  return (
    <AbsoluteFill style={{ background: color.darkBg }}>
      <div style={{ position: "absolute", top: height * 0.12, left: 0, right: 0 }}>
        <Line text="Our automations run whole *workflows.*" start={head[0]} times={head} mode="dark" />
      </div>
      {rows.map(([icon, name, steps], i) => {
        const p = spring(t - bt(starts[i] - 0.6), "snappy");
        const lit = ramp(t, bt(starts[i] - 0.2), 0.3);
        return (
          <div key={name} style={{ position: "absolute", left: (width - rowW) / 2, top: height * 0.33 + i * (rowH + 22 * u), width: rowW, height: rowH, display: "flex", alignItems: "center", gap: 26 * u, padding: `0 ${34 * u}px`, boxSizing: "border-box", background: color.darkSurface, borderLeft: `${6 * u}px solid ${mixHex(color.darkDim, color.accent, lit)}`, opacity: clamp01(p * 1.4), transform: `translateY(${(1 - p) * 30 * u}px)` }}>
            <Icon name={icon} size={44 * u} stroke={mixHex(color.darkDim, color.darkText, lit)} />
            <div style={{ width: 380 * u, fontFamily: font.display, fontWeight: 700, fontSize: 44 * u, color: color.darkText }}>{name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 * u, marginLeft: "auto" }}>
              {steps.map(([label, b], j) => {
                const on = ramp(t, bt(b - 0.15), 0.25);
                // The SEO row's first chip is the old way: it dims and strikes out once "minutes" lands.
                const old = i === 0 && j === 0 ? ramp(t, bt(steps[1][1] - 0.15), 0.25) : 0;
                return (
                  <React.Fragment key={label}>
                    {j > 0 ? <Icon name="arrow" size={26 * u} stroke={mixHex(color.darkDim, color.darkText, on)} /> : null}
                    <span style={{ padding: `${10 * u}px ${18 * u}px`, border: `${2 * u}px solid ${mixHex(color.darkDim, color.accent, on * (1 - old))}`, background: on * (1 - old) > 0.5 ? color.accentFill : "transparent", transform: `scale(${0.92 + 0.08 * on})`, textDecoration: old > 0.5 ? "line-through" : "none" }}>
                      <Mono size={20 * u} color={on * (1 - old) > 0.5 ? color.lightText : mixHex(color.darkDim, "#9AA7A8", on)}>
                        {label}
                      </Mono>
                    </span>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Verbs in VO order; the last lands on "capabilities", when the cards stack up.
const VERBS = ["Report", "Sync", "Audit", "Build"];
// Client builds; labels stay generic so no client tool is named.
const CARDS: [string, string][] = [
  ["montage-iip-02.png", "Client dashboard"],
  ["montage-chan-02.png", "Client data pipeline"],
  ["montage-salsify-01.png", "Client catalog audit"],
];

// Act 7: vertical verb slot list (M14) beside a card deck of client builds that stacks up on "capabilities".
export const Capabilities: React.FC = () => {
  const { t, u, width, height } = useT();
  const vo = voice("capabilities");
  const head = vo.seq("same playbook everywhere");
  const said = vo.seq("dashboards pipelines catalog");
  const [ext, caps] = vo.seq("extend capabilities");
  const client = vo.seq("to our client work");
  const T = [...said, caps];
  const pos = track(t, T.map((b, i) => [bt(b), i] as [number, number]), "default");
  const listIn = ramp(t, bt(T[0] - 0.8), 0.6, outExpo);
  const fan = spring(t - bt(caps - 0.3), "default");
  const slotH = 110 * u;
  const cardW = 860 * u;
  const cardH = 484 * u;
  return (
    <AbsoluteFill style={{ background: color.darkBg }}>
      <div style={{ position: "absolute", top: height * 0.1, left: 0, right: 0 }}>
        <Line text="Same *playbook* everywhere." start={head[0]} times={head} mode="dark" size={64 * u} exit={ext - 0.6} />
      </div>
      <div style={{ position: "absolute", top: height * 0.1, left: 0, right: 0 }}>
        <Line text="Extended to our *client* work." start={ext} times={[ext, ...client]} mode="dark" size={64 * u} />
      </div>
      <div style={{ position: "absolute", left: width * 0.07, top: height * 0.34, width: 520 * u, height: slotH * 3, overflow: "hidden", clipPath: wipe(listIn, "bottom") }}>
        {VERBS.map((verb, i) => {
          const d = i - pos;
          const lit = clamp01(1 - Math.abs(d));
          return (
            <div key={verb} style={{ position: "absolute", left: 0, top: slotH * (1 + d), height: slotH, display: "flex", alignItems: "center", fontFamily: font.display, fontWeight: 700, fontSize: 104 * u, letterSpacing: font.tracking, color: mixHex(color.darkDim, color.darkText, lit) }}>
              {verb}
              <span style={{ color: color.accent, opacity: lit }}>.</span>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: width * 0.62, top: height * 0.58 }}>
        {CARDS.map(([src, label], i) => {
          const d = i - Math.min(pos, 2);
          const enter = spring(t - bt(T[0] - 1 + i * 0.15), "default");
          const ad = Math.abs(d);
          // Stacked: the front card bottom-left, the others stepping up and right behind it.
          const back = 2 - i;
          const dx = d * (d < 0 ? 110 : 240) * u;
          const x = dx + (1 - enter) * 900 * u + (back * 120 * u - dx) * fan;
          const y = -back * 70 * u * fan;
          const ry = -Math.sign(d) * Math.min(ad, 1) * 30 * (1 - fan) - 10 * fan;
          const sc = (1 - 0.14 * Math.min(ad, 1)) * (1 - fan) + (0.9 - back * 0.04) * fan;
          return (
            <div key={src} style={{ position: "absolute", left: -cardW / 2, top: -cardH / 2, width: cardW, height: cardH, zIndex: 10 - Math.round(ad * 2), transform: `translate(${x}px, ${y}px) perspective(${2200 * u}px) rotateY(${ry}deg) scale(${sc})`, opacity: clamp01(2.4 - ad) * clamp01(enter * 1.5), border: `${3 * u}px solid ${color.darkText}`, background: color.darkSurface, overflow: "hidden", boxShadow: `0 ${30 * u}px ${70 * u}px rgba(0,0,0,0.35)` }}>
              <Img src={staticFile(`brand/${src}`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top left" }} />
              <div style={{ position: "absolute", inset: 0, background: color.darkBg, opacity: Math.min(ad, 1) * 0.55 * (1 - fan) + back * 0.12 * fan }} />
              <div style={{ position: "absolute", left: 0, bottom: 0, padding: `${8 * u}px ${14 * u}px`, background: color.darkBg }}>
                <Mono size={14 * u} color={color.accent}>
                  {label}
                </Mono>
              </div>
              <div style={{ position: "absolute", right: 0, top: 0, padding: `${8 * u}px ${14 * u}px`, background: color.accentFill }}>
                <Mono size={14 * u} color={color.lightText}>
                  Built for a client
                </Mono>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const ROWS: [string, number][] = [
  ["Strategy & planning", 0.34],
  ["Creative production", 0.42],
  ["In-store activation", 0.24],
];
const SEG = [color.lightText, color.putty, color.darkDim];

// Act 8: the rule, acted out on one estimate: AI drafts it, code totals it, a person approves it.
export const Trust: React.FC = () => {
  const { t, u, width, height } = useT();
  const vo = voice("trust");
  const lines: [string, number[]][] = [
    ["AI drafts.", vo.seq("ai drafts")],
    ["Code does the *math.*", vo.seq("code does the math")],
    ["People decide.", vo.seq("people decide")],
  ];
  const [ai, drafts] = lines[0][1];
  const math = lines[1][1][3];
  const [people, decide] = lines[2][1];
  const s = (b: number) => bt(b);
  const cardIn = spring(t - s(ai - 0.4), "default");
  const solid = ramp(t, s(lines[1][1][0]), 0.5, outExpo);
  const sum = spring(t - s(math), "default");
  const foot = ramp(t, s(people - 0.3), 0.45, outExpo);
  const click = s(decide);
  const approved = t >= click;
  const stamp = spring(t - click - 0.08, { k: 420, d: 22 });
  const step = t < s(lines[1][1][0]) ? 0 : t < s(people) ? 1 : 2;
  const cw = 820 * u;
  const pad = 40 * u;
  const barMax = 300 * u;
  const curX = cw - 230 * u + (1 - ramp(t, s(people), s(decide - people) - 0.1, outExpo)) * 160 * u;
  const curY = 560 * u + (1 - ramp(t, s(people), s(decide - people) - 0.1, outExpo)) * 120 * u;
  return (
    <AbsoluteFill style={{ background: color.lightBg }}>
      {lines.map(([l, times], i) => (
        <div key={l} style={{ position: "absolute", left: width * 0.07, top: height * (0.26 + i * 0.15), width: width * 0.4 }}>
          <Line text={l} start={times[0]} times={times} mode="light" size={62 * u} style={{ justifyContent: "flex-start" }} />
        </div>
      ))}
      <div style={{ position: "absolute", left: width * 0.69 - cw / 2, top: height * 0.5 - 330 * u, width: cw, clipPath: wipe(cardIn, "bottom"), transform: `translateY(${(1 - cardIn) * 60 * u}px) scale(1.12)`, background: "#fff", border: `${3 * u}px solid ${color.lightText}`, boxShadow: `0 ${30 * u}px ${80 * u}px rgba(28,44,46,0.16)` }}>
        <div style={{ height: 70 * u, background: color.darkBg, borderBottom: `${4 * u}px solid ${color.accent}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${pad}px` }}>
          <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 26 * u, color: color.darkText }}>Client estimate</span>
          <div style={{ display: "flex", gap: 10 * u }}>
            {[["sparkles", "Draft"], ["calculator", "Math"], ["user", "Decision"]].map(([ic, l], i) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 8 * u, padding: `${6 * u}px ${12 * u}px`, background: i === step ? color.accent : "transparent", color: i === step ? color.lightText : i < step ? color.darkText : color.darkDim, border: `${2 * u}px solid ${i <= step ? color.accent : color.darkDim}` }}>
                <Icon name={ic} size={18 * u} />
                <Mono size={13 * u}>{l}</Mono>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: `${pad * 0.8}px ${pad}px 0` }}>
          {ROWS.map(([label, share], i) => {
            const t0 = s(drafts - 0.2) + i * 0.22;
            const segIn = clamp01(sum * 1.2 - i * 0.1);
            return (
              <div key={label} style={{ height: 76 * u, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `${1.5 * u}px solid ${color.lightLine}` }}>
                <span style={{ fontFamily: font.sans, fontWeight: 500, fontSize: 26 * u, color: color.lightText }}>
                  {typed(label, t, t0, t0 + 0.45)}
                </span>
                <div style={{ width: barMax, height: 22 * u, display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ width: barMax * share * (0.6 + 0.4 * solid) + (1 - solid) * barMax * 0.15, height: "100%", clipPath: wipe(ramp(t, t0 + 0.2, 0.4, outExpo), "right"), border: `${2 * u}px ${solid > 0.5 ? "solid" : "dashed"} ${solid > 0.5 ? SEG[i] : color.lightDim}`, background: solid > 0.5 ? SEG[i] : "transparent", opacity: 1 - 0.65 * segIn }} />
                </div>
              </div>
            );
          })}
          <div style={{ height: 100 * u, display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `${3 * u}px solid ${color.lightText}`, marginTop: -1.5 * u }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 * u }}>
              <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 28 * u, color: color.lightText }}>Total</span>
              <div style={{ clipPath: wipe(ramp(t, s(math + 0.6), 0.4, outExpo)), display: "flex", alignItems: "center", gap: 6 * u, color: color.putty }}>
                <Icon name="check" size={20 * u} />
                <Mono size={14 * u} color={color.putty}>
                  Calculated in code
                </Mono>
              </div>
            </div>
            <div style={{ width: barMax, height: 34 * u, display: "flex", border: `${2 * u}px solid ${sum > 0.02 ? color.lightText : color.lightLine}` }}>
              {ROWS.map(([label, share], i) => (
                <div key={label} style={{ width: `${share * 100}%`, height: "100%", background: SEG[i], transformOrigin: "left", transform: `scaleX(${clamp01(sum * 1.2 - i * 0.1)})` }} />
              ))}
            </div>
          </div>
        </div>
        <div style={{ height: 112 * u, marginTop: 10 * u, background: color.cloud, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${pad}px`, clipPath: wipe(foot, "top") }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 * u }}>
            <div style={{ width: 56 * u, height: 56 * u, borderRadius: "50%", background: color.lightText, color: color.darkText, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="user" size={28 * u} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 * u }}>
              <span style={{ fontFamily: font.sans, fontWeight: 600, fontSize: 22 * u, color: color.lightText }}>Account lead</span>
              <Mono size={13 * u} color={color.lightDim}>
                Final call
              </Mono>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 * u, padding: `${14 * u}px ${26 * u}px`, background: approved ? color.accent : color.lightText, color: approved ? color.lightText : color.darkText, transform: `scale(${1 - press(t, click) * 0.06})` }}>
            {approved && <Icon name="check" size={22 * u} />}
            <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 22 * u }}>{approved ? "Approved" : "Approve"}</span>
          </div>
        </div>
        <Cursor x={curX} y={curY} size={44 * u} press={press(t, click)} opacity={foot * (1 - ramp(t, click + 0.6, 0.3))} />
        <div style={{ position: "absolute", left: "50%", top: "44%", transform: `translate(-50%, -50%) rotate(-8deg) scale(${2.2 - 1.2 * stamp})`, opacity: clamp01(stamp * 3), border: `${6 * u}px solid ${color.accent}`, background: "rgba(238,255,151,0.85)", padding: `${10 * u}px ${34 * u}px`, fontFamily: font.display, fontWeight: 700, fontSize: 64 * u, letterSpacing: "0.04em", color: color.lightText, whiteSpace: "nowrap" }}>
          APPROVED
        </div>
      </div>
    </AbsoluteFill>
  );
};

const MONTHS = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];

// Act 9: a work calendar fills week by week across the line, then folds into the SF mark.
export const Bonus: React.FC = () => {
  const { t, u, width, height } = useT();
  const said = voice("bonus").seq("behind every app is months of work from our own team");
  const end = said[said.length - 1];
  const collapse = spring(t - bt(end + 0.8), "default");
  const mark = spring(t - bt(end + 1.2), "heavy");
  const cols = 26;
  const rows = 5;
  const cell = 34 * u;
  const gap = 8 * u;
  const gw = cols * (cell + gap) - gap;
  const x0 = (width - gw) / 2;
  const y0 = height * 0.5;
  const fill = ramp(t, bt(said[0]), bt(end - said[0]), (x) => x);
  return (
    <AbsoluteFill style={{ background: color.darkBg }}>
      <div style={{ position: "absolute", top: height * 0.24, left: 0, right: 0 }}>
        <Line text="Behind every app: *months* of work from our own team." start={said[0]} times={said.filter((_, i) => i !== 3)} mode="dark" size={60 * u} exit={end + 0.6} />
      </div>
      {MONTHS.map((m, i) => (
        <div key={m} style={{ position: "absolute", left: x0 + (i * gw) / MONTHS.length, top: y0 - 44 * u, clipPath: wipe(ramp(t, bt(said[0]) + i * 0.08, 0.4, outExpo), "bottom"), opacity: 1 - collapse }}>
          <Mono size={16 * u} color="#7E9093">
            {m}
          </Mono>
        </div>
      ))}
      {Array.from({ length: cols * rows }).map((_, n) => {
        const c = Math.floor(n / rows);
        const r = n % rows;
        const on = fill * cols > c + random(`w${n}`) * 0.9;
        const busy = random(`b${n}`);
        const x = x0 + c * (cell + gap);
        const y = y0 + r * (cell + gap);
        const cx = width / 2 - cell / 2;
        const cy = height / 2 - cell / 2;
        const k = clamp01(collapse * 1.1 - random(`c${n}`) * 0.1);
        return <div key={n} style={{ position: "absolute", left: x + (cx - x) * k, top: y + (cy - y) * k, width: cell, height: cell, background: on ? mixHex(color.darkSurface, color.accent, 0.35 + 0.65 * busy) : color.darkSurface, opacity: 1 - clamp01((collapse - 0.7) / 0.3), transform: `scale(${1 - 0.6 * k})` }} />;
      })}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", clipPath: wipe(mark, "bottom"), transform: `scale(${0.85 + 0.15 * mark})` }}>
        <Logo width={150 * u} fill={color.accent} markOnly />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Act 10: the three-line close rises out of masks, words fall away (M18), logo holds.
export const Close: React.FC = () => {
  const { t, u, height, headline } = useT();
  const lines = ["Built by our team.", "Sharpened by AI.", "More productive every quarter."];
  const said = voice("close").seq(lines.join(" "));
  const fallAt = said[said.length - 1] + 0.8;
  const logo = spring(t - bt(fallAt + 1), "heavy");
  return (
    <AbsoluteFill style={{ background: color.darkBg }}>
      {lines.map((l, li) => (
        <div key={l} style={{ position: "absolute", top: height * (0.3 + li * 0.13), left: 0, right: 0, display: "flex", justifyContent: "center", gap: headline * 0.26 }}>
          {l.split(" ").map((w, wi) => {
            const idx = lines.slice(0, li).reduce((n, x) => n + x.split(" ").length, 0) + wi;
            const p = ramp(t, bt(said[idx]) - 0.08, 0.5, outExpo);
            const tf = t - bt(fallAt + (li * 3 + wi) * 0.12);
            const fall = tf > 0 ? tf : 0;
            return (
              <span key={wi} style={{ overflow: fall > 0 ? "visible" : "hidden", display: "inline-flex", padding: `${headline * 0.06}px 0 ${headline * 0.14}px` }}>
                <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: headline, color: li === 1 && w.startsWith("AI") ? color.accent : color.darkText, letterSpacing: font.tracking, opacity: 1 - clamp01(fall / 0.7), transform: `translateY(${(1 - p) * 118}%) translateY(${2400 * fall * fall * u}px) rotate(${fall * (wi % 2 ? 40 : -30)}deg)` }}>{w}</span>
              </span>
            );
          })}
        </div>
      ))}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", clipPath: wipe(logo, "bottom"), transform: `scale(${0.94 + 0.06 * logo})` }}>
        <Logo width={560 * u} fill={color.darkText} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
