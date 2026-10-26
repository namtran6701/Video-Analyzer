import React from "react";
import { Caret, Cursor, Icon, Mono, band, clamp01, inExpo, outExpo, pop, press, ramp, typed, useT } from "../kit";
import { spring, track } from "../lib/motion";
import { voice, warp } from "../vo";
import { bt, color, font } from "../tokens";
import { Logo } from "./Open";
import { AppBar, Chapter, Payoff } from "./demo-common";

const LESSON = "Give Your Favorite Thing a Soundtrack";
const RESEARCH = ["Industry reports", "This quarter's news", "Team requests"];
const FIELDS = [
  ["Track", "Creative · Q4 2026"],
  ["Format", "Assignment · 20–30 min"],
];
const TRACKS: [string, number, number, number][] = [
  ["Foundations", 1, 100, 1],
  ["Insights & Analytics", 2, 75, 1],
  ["Creative", 3, 75, 1],
];

export const Training: React.FC = () => {
  const { t, u } = useT();
  const vo = voice("training");
  const [industry, news, designs, lesson, assignment] = vo.seq("industry news designs lesson assignment");
  const [lands, checklist, learning] = vo.seq("land checklist learning");
  const payAt = learning + 1;
  // Original 32-beat schedule warped onto the 28-beat act, keyed to the VO.
  const w = warp([[0, 0], [0.5, 1], [3.5, lesson], [10, lands - 0.6], [11, lands], [14, checklist], [18, checklist + 0.8], [28, payAt], [32, 28]]);
  const s = (b: number) => bt(w(b));
  const swap = (b: number, ease = outExpo) => ramp(t, s(b) - 0.1, 0.55, ease);
  const chat = band(1, swap(10, inExpo));
  const hub = band(swap(10), swap(18, inExpo));
  const team = band(swap(18));
  const publishAt = bt(assignment + 0.8);
  const published = t >= publishAt;
  const done = t >= s(14.2);
  const prog = track(t, [[0, 0.5], [s(14.2), 1]], "default");
  const curX = track(t, [[0, 1300], [s(12), 1250], [s(14), 1300]], "default");
  const curY = track(t, [[0, 700], [s(12), 520], [s(14), 512]], "default");

  return (
    <Chapter k={2} beats={28} payoffAt={payAt} payoff={<Payoff big="A learning track for every team." sub="Designed by our AI team, refreshed every quarter" at={payAt} />}>
      {/* A: the AI team's research feeds a lesson they write, then publish to the track */}
      <div style={{ position: "absolute", inset: 0, background: "#F7F6F1", clipPath: chat }}>
        <div style={{ height: 64 * u, borderBottom: `1px solid ${color.lightLine}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${30 * u}px` }}>
          <div style={{ fontFamily: font.sans, fontWeight: 600, fontSize: 24 * u, color: color.lightText }}>AI team · lesson studio</div>
          <Mono size={13 * u} color={color.lightText} style={{ padding: `${6 * u}px ${12 * u}px`, border: `${2 * u}px solid ${color.lightText}` }}>
            Creative · Q4 2026
          </Mono>
        </div>
        <div style={{ display: "flex", gap: 44 * u, padding: `${40 * u}px ${120 * u}px` }}>
          <div style={{ width: 600 * u }}>
            <Mono size={15 * u} color={color.lightDim}>
              Research
            </Mono>
            <div style={{ marginTop: 16 * u, display: "flex", flexDirection: "column", gap: 14 * u }}>
              {RESEARCH.map((name, i) => {
                const b = [industry, news, designs][i];
                // Rows are on screen as soon as the window opens, then tick off on the word that names them.
                const p = spring(t - bt(1 + i * 0.4), "snappy");
                const ok = t > bt(b);
                return (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: 16 * u, padding: `${18 * u}px ${20 * u}px`, border: `${2 * u}px solid ${color.lightLine}`, background: "#fff", opacity: clamp01(p * 1.4), transform: `translateY(${(1 - p) * 14 * u}px)` }}>
                    <div style={{ width: 28 * u, height: 28 * u, background: ok ? color.accentFill : color.cloud, border: `${2 * u}px solid ${color.lightText}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{ok ? <Icon name="check" size={18 * u} stroke={color.lightText} width={3} /> : null}</div>
                    <span style={{ fontFamily: font.sans, fontSize: 26 * u, color: color.lightText }}>{name}</span>
                    <span style={{ fontFamily: font.sans, fontSize: 19 * u, color: color.lightDim, marginLeft: "auto", opacity: ok ? 1 : 0.55 + 0.45 * Math.abs(Math.sin((t - i * 0.3) * 3)) }}>{ok ? "reviewed" : "reading…"}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ flex: 1, border: `${3 * u}px solid ${color.lightText}`, background: "#fff", padding: `${26 * u}px ${30 * u}px`, opacity: ramp(t, bt(2), 0.4), transform: `translateY(${(1 - ramp(t, bt(2), 0.4, outExpo)) * 20 * u}px)` }}>
            <Mono size={14 * u} color={color.lightDim}>
              Lesson · written by the AI team
            </Mono>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 40 * u, lineHeight: 1.2, color: color.lightText, marginTop: 12 * u, minHeight: 96 * u }}>
              {t < bt(designs - 0.2)
                ? [0.9, 0.6].map((w, i) => <div key={i} style={{ width: `${w * 100}%`, height: 30 * u, marginTop: i ? 14 * u : 6 * u, background: color.cloud, opacity: 0.5 + 0.5 * Math.abs(Math.sin(t * 2.4 - i * 0.6)) }} />)
                : typed(LESSON, t, bt(designs - 0.2), bt(lesson + 0.4))}
              {t > bt(designs - 0.3) && t < bt(assignment) ? <Caret t={t} h={40 * u} /> : null}
            </div>
            {FIELDS.map(([k, v], i) => (
              <div key={k} style={{ display: "flex", gap: 20 * u, padding: `${14 * u}px 0`, borderTop: `1px solid ${color.lightLine}`, opacity: ramp(t, bt([lesson, assignment][i]), 0.3) }}>
                <Mono size={14 * u} color={color.lightDim} style={{ width: 150 * u }}>
                  {k}
                </Mono>
                <span style={{ fontFamily: font.sans, fontSize: 24 * u, color: color.lightText }}>{v}</span>
              </div>
            ))}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10 * u, marginTop: 18 * u, padding: `${12 * u}px ${20 * u}px`, background: published ? color.accentFill : "transparent", border: `${3 * u}px solid ${color.lightText}`, opacity: ramp(t, bt(assignment), 0.3), transform: `scale(${1 - press(t, publishAt) * 0.05})` }}>
              <Icon name={published ? "check" : "zap"} size={18 * u} stroke={color.lightText} width={published ? 3 : 2} />
              <Mono size={15 * u} color={color.lightText}>
                {published ? "Published to Q4 Creative" : "Publish to the track"}
              </Mono>
            </span>
          </div>
        </div>
      </div>

      {/* B: My Training (dark SF theme) */}
      <div style={{ position: "absolute", inset: 0, background: color.darkBg, clipPath: hub }}>
        <AppBar
          left={
            <>
              <Logo width={112 * u} fill={color.darkText} />
              <Mono size={15 * u} color={color.accent}>
                AI & tools
              </Mono>
            </>
          }
          right={
            <Mono size={15 * u} color={color.darkText}>
              Q4 2026 · Due Dec 31
            </Mono>
          }
        />
        <div style={{ padding: `${30 * u}px ${48 * u}px` }}>
          <Mono size={15 * u} color={color.accent}>
            Your training hub
          </Mono>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 56 * u, color: color.darkText, marginTop: 4 * u }}>Hi Demo</div>
            <div style={{ fontFamily: font.mono, fontSize: 30 * u, color: color.accent }}>{done ? "2/2" : "1/2"} required</div>
          </div>
          <div style={{ height: 8 * u, background: color.darkSurface, marginTop: 16 * u }}>
            <div style={{ height: "100%", width: `${prog * 100}%`, background: color.accent }} />
          </div>
          <div style={{ marginTop: 22 * u, border: `${2 * u}px solid ${color.accent}`, padding: `${14 * u}px ${20 * u}px`, opacity: ramp(t, s(15), 0.3), transform: `translateY(${(1 - ramp(t, s(15), 0.3)) * 10 * u}px)` }}>
            <Mono size={13 * u} color={color.accent}>
              Required training complete
            </Mono>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 32 * u, color: color.darkText }}>You got it done.</div>
          </div>
          <div style={{ marginTop: 20 * u, display: "flex", alignItems: "center", gap: 14 * u }}>
            <div style={{ width: 4 * u, height: 26 * u, background: color.accent }} />
            <span style={{ fontFamily: font.sans, fontWeight: 600, fontSize: 26 * u, color: color.darkText }}>Creative</span>
          </div>
          {(() => {
            const p = spring(t - s(11), "snappy");
            return (
              <div style={{ marginTop: 12 * u, background: color.darkSurface, padding: `${16 * u}px ${20 * u}px`, display: "flex", alignItems: "center", gap: 16 * u, opacity: clamp01(p * 1.4), transform: `translateY(${(1 - p) * -24 * u}px)`, borderLeft: `${4 * u}px solid ${color.accent}` }}>
                <div>
                  <div style={{ fontFamily: font.sans, fontWeight: 600, fontSize: 24 * u, color: color.darkText }}>{LESSON}</div>
                  <Mono size={12 * u} color="#9AA7A8">
                    Assignment · New this quarter
                  </Mono>
                </div>
                <span style={{ marginLeft: "auto", padding: `${9 * u}px ${14 * u}px`, background: done ? color.accent : "transparent", border: `${2 * u}px solid ${color.accent}`, transform: `scale(${1 - press(t, s(14)) * 0.06})` }}>
                  <Mono size={14 * u} color={done ? color.darkBg : color.accent}>
                    {done ? "Completed" : "Mark complete"}
                  </Mono>
                </span>
              </div>
            );
          })()}
        </div>
        <Cursor x={curX * u} y={curY * u} size={44 * u} press={press(t, s(14))} opacity={ramp(t, s(11.5), 0.3) * (1 - ramp(t, s(16), 0.3))} />
      </div>

      {/* C: Team Progress */}
      <div style={{ position: "absolute", inset: 0, background: color.darkBg, clipPath: team }}>
        <AppBar
          left={
            <>
              <Logo width={112 * u} fill={color.darkText} />
              <Mono size={15 * u} color={color.accent}>
                Team progress
              </Mono>
            </>
          }
          right={
            <Mono size={15 * u} color={color.darkText}>
              Q4 2026 (current)
            </Mono>
          }
        />
        <div style={{ padding: `${34 * u}px ${48 * u}px` }}>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 48 * u, color: color.darkText }}>Team Progress</div>
          <div style={{ marginTop: 22 * u, display: "flex", flexDirection: "column", gap: 16 * u }}>
            {TRACKS.map(([name, members, avg, full], i) => {
              const p = ramp(t, s(19 + i), 0.9);
              return (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: 28 * u, padding: `${18 * u}px ${22 * u}px`, background: color.darkSurface, opacity: clamp01(pop(t, s(18.5 + i * 0.5)) * 1.3) }}>
                  <div style={{ width: 4 * u, height: 40 * u, background: color.accent }} />
                  <div style={{ width: 380 * u, fontFamily: font.sans, fontWeight: 600, fontSize: 28 * u, color: color.darkText }}>{name}</div>
                  <div style={{ flex: 1, height: 10 * u, background: "#1A2627" }}>
                    <div style={{ width: `${avg * p}%`, height: "100%", background: color.accent }} />
                  </div>
                  <div style={{ width: 150 * u, fontFamily: font.mono, fontSize: 28 * u, color: color.accent, textAlign: "right" }}>{Math.round(avg * p)}%</div>
                  <Mono size={13 * u} color="#9AA7A8" style={{ width: 230 * u, textAlign: "right" }}>
                    {members} members · {full} done
                  </Mono>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Chapter>
  );
};
