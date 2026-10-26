import React from "react";
import { Caret, Cursor, Icon, Mono, clamp01, outExpo, pop, press, ramp, typed, useT, wipe } from "../kit";
import { spring, track } from "../lib/motion";
import { voice } from "../vo";
import { bt, color, font } from "../tokens";
import { Logo } from "./Open";
import { AppBar, Chapter, Payoff, WIN, money } from "./demo-common";

const BRIEF = "Refresh the data center product catalog for print and digital, ready for trade show season.";
// The app's own AI_DRAFT_STAGES: one "current focus" at a time, not a checklist.
const STAGES = [
  ["Reviewing your brief", "Pulling the project goals, constraints, and requested deliverables into focus."],
  ["Matching relevant work", "Looking across similar estimating worksheets for a useful calibration point."],
  ["Drafting scope and effort", "Structuring project parts, roles, tasks, and hours."],
  ["Checking the plan structure", "Making sure the draft is complete and ready for you to edit."],
];
const TIERS = [
  { name: "GOOD", total: 58145.44, labor: 53648, costs: 4497.44 },
  { name: "BETTER", total: 72553.28, labor: 65202, costs: 7351.28 },
  { name: "BEST", total: 85192.23, labor: 71623, costs: 13569.23 },
];
const REVIEWERS = ["Account lead", "Finance", "Creative director"];

const Eyebrow: React.FC<{ children: React.ReactNode; size: number }> = ({ children, size }) => (
  <Mono size={size} color={color.emberDeep}>
    {children}
  </Mono>
);

export const Pricing: React.FC = () => {
  const { t, u } = useT();
  const vo = voice("pricing");
  // Every action below is keyed to the word that names it (local beats).
  const [brief, best, plan1] = vo.seq("brief best plan");
  const [history, projects, costs] = vo.seq("trained projects costs");
  const [checks, drafts, point] = vo.seq("then drafts point");
  const [teammate, reviews, every, number] = vo.seq("team reviews every number");
  const [person, finalCall, call] = vo.seq("person final call");
  const [over, priced] = vo.seq("hundreds priced");
  const plan2 = point;

  const s = (b: number) => bt(b);
  const generating = t >= s(plan1);
  const panel = ramp(t, s(plan1 + 0.15), 0.5, outExpo);
  // The page scrolls so the generation panel sits under the tabs, as it does in the app.
  const scroll = ramp(t, s(plan1 + 0.3), 0.7, outExpo) * 230;
  const review = ramp(t, s(plan2 + 0.3), 0.6, outExpo);
  // Working total stays at $0 while the AI drafts, then fills as the plan lands.
  const count = ramp(t, s(plan2 - 0.7), 0.6, (x) => 1 - Math.pow(1 - x, 3));
  const stageAt = [plan1 + 0.15, history, checks, drafts + 0.9];
  const stage = stageAt.filter((b) => t >= s(b)).length - 1;
  const elapsed = Math.max(0, Math.floor((t - s(plan1)) * 4));
  const tabs = ["Setup", "Scope", "Labor", "Hard costs", "Review"];
  const activeTab = t < s(plan2 + 0.3) ? 0 : 4;
  // Camera: push into the brief and the history match, pull back for the review.
  const zoom = track(t, [[0, 1], [s(brief - 1.5), 1.18], [s(plan1 - 0.3), 1], [s(history), 1.12], [s(drafts), 1.14], [s(plan2 - 0.8), 1], [s(teammate - 0.3), 1.12], [s(person - 0.4), 1]], "default");
  const fx = track(t, [[0, 0], [s(drafts), 0], [s(plan2 - 0.8), 0.5], [s(teammate - 0.3), 1], [s(person - 0.4), 0.5]], "default");
  const fy = track(t, [[0, 0.5], [s(plan1 - 0.3), 0.5], [s(history), 0.8], [s(drafts), 0.8], [s(plan2 - 0.8), 0.5]], "default");
  const marketOn = ramp(t, s(checks - 0.3), 0.5, outExpo);
  const marketReady = t >= s(drafts - 0.3);
  const selectAt = call;
  const sendAt = call + 1.2;

  const curX = track(t, [[0, 900], [s(0.5), 520], [s(plan1 - 1), 520], [s(plan1 - 0.4), 560], [s(plan1 + 0.3), 560], [s(plan1 + 1.2), 980], [s(person - 1), 980], [s(person), 560], [s(call + 0.5), 560], [s(sendAt - 0.5), 300]], "default");
  const curY = track(t, [[0, 760], [s(0.5), 380], [s(plan1 - 1), 380], [s(plan1 - 0.4), 470], [s(plan1 + 0.3), 470], [s(plan1 + 1.2), 300], [s(person - 1), 300], [s(person), 400], [s(call + 0.5), 400], [s(sendAt - 0.5), 540]], "default");
  const pr = press(t, s(plan1)) + press(t, s(selectAt)) + press(t, s(sendAt));

  const W = WIN.w * u;
  const rail = 400 * u;
  const strip = 470 * u;
  return (
    <Chapter k={0} beats={40} payoffAt={over} zoom={zoom} focus={[fx, fy]} payoff={<Payoff big="Hundreds of thousands priced." sub="Every number reviewed by our team" at={over} subAt={priced} />}>
      <AppBar
        left={
          <>
            <Logo width={112 * u} fill={color.darkText} />
            <div style={{ width: 3 * u, height: 32 * u, background: color.putty }} />
            <Mono size={15 * u} color={color.darkText}>
              Project pricing estimator
            </Mono>
          </>
        }
      />
      <div style={{ display: "flex", height: 54 * u, borderBottom: `${3 * u}px solid ${color.lightText}` }}>
        {tabs.map((tab, i) => (
          <div key={tab} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 * u, background: i === activeTab ? color.cloud : "transparent", borderBottom: i === activeTab ? `${4 * u}px solid ${color.emberDeep}` : "none", borderRight: `1px solid ${color.lightLine}` }}>
            <Mono size={13 * u} color={i === activeTab ? color.darkText : color.lightDim} style={{ background: i === activeTab ? color.lightText : "transparent", border: i === activeTab ? "none" : `2px solid ${color.lightDim}`, padding: `${3 * u}px ${6 * u}px` }}>
              0{i + 1}
            </Mono>
            <Mono size={15 * u} color={i === activeTab ? color.lightText : color.lightDim}>
              {tab}
            </Mono>
          </div>
        ))}
      </div>

      {/* Setup: brief, plan mode, Generate, then the "AI draft in progress" panel (left) */}
      <div style={{ position: "absolute", left: 0, top: 118 * u, width: W - rail, bottom: 0, overflow: "hidden", clipPath: wipe(1 - review, "right") }}>
        <div style={{ position: "absolute", left: 52 * u, top: (32 - scroll) * u, width: W - rail - 104 * u }}>
          <Eyebrow size={16 * u}>Step 01 — Setup</Eyebrow>
          <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 50 * u, color: color.lightText, marginTop: 10 * u }}>Let's price a project.</div>
          <div style={{ marginTop: 20 * u, background: color.cloud, border: `${3 * u}px solid ${color.lightText}`, padding: 24 * u }}>
            <Eyebrow size={15 * u}>Draft with AI</Eyebrow>
            <div style={{ fontFamily: font.mono, fontSize: 14 * u, letterSpacing: "0.15em", marginTop: 14 * u, color: color.lightText }}>PROJECT DESCRIPTION *</div>
            <div style={{ marginTop: 8 * u, background: generating ? color.lightLine : "#fff", border: `${3 * u}px solid ${color.putty}`, height: 96 * u, padding: 16 * u, boxSizing: "border-box", fontFamily: font.sans, fontSize: 22 * u, color: generating ? color.lightDim : color.lightText, lineHeight: 1.4 }}>
              {typed(BRIEF, t, s(brief - 1.2), s(best))}
              {t > s(brief - 1.4) && !generating ? <Caret t={t} h={24 * u} /> : null}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 * u, marginTop: 18 * u }}>
              <div style={{ display: "flex", border: `${3 * u}px solid ${color.putty}` }}>
                {["Good / Better / Best", "Single plan"].map((m, i) => (
                  <Mono key={m} size={14 * u} color={i === 0 ? color.darkText : color.putty} style={{ padding: `${10 * u}px ${16 * u}px`, background: i === 0 ? color.lightText : "#fff" }}>
                    {m}
                  </Mono>
                ))}
              </div>
              <span style={{ padding: `${12 * u}px ${20 * u}px`, background: generating ? color.lightLine : color.accentFill, border: `${3 * u}px solid ${color.lightText}`, transform: `scale(${1 - press(t, s(plan1)) * 0.05})` }}>
                <Mono size={15 * u} color={generating ? color.lightDim : color.lightText}>
                  {generating ? "Generating…" : "Generate plan →"}
                </Mono>
              </span>
            </div>
          </div>
          <div style={{ marginTop: 16 * u, border: `${3 * u}px solid ${color.lightText}`, background: "#fff", clipPath: wipe(panel, "top") }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `${14 * u}px ${20 * u}px`, background: color.lightText }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 * u }}>
                <div style={{ width: 14 * u, height: 14 * u, border: `${2 * u}px solid ${color.accentFill}`, background: Math.sin(t * 3.9) > 0 ? color.accentFill : color.lightText }} />
                <Mono size={15 * u} color={color.accentFill}>
                  AI draft in progress
                </Mono>
              </div>
              <Mono size={13 * u} color={color.cloud}>
                0:{String(elapsed).padStart(2, "0")} elapsed
              </Mono>
            </div>
            <div style={{ height: 6 * u, background: color.putty, overflow: "hidden" }}>
              <div style={{ width: "28%", height: "100%", background: color.accentFill, transform: `translateX(${(((t / 1.8) % 1) * 460 - 100).toFixed(1)}%)` }} />
            </div>
            <div style={{ padding: `${20 * u}px ${24 * u}px` }}>
              <Eyebrow size={13 * u}>Current focus</Eyebrow>
              {stage >= 0 ? (
                <div key={stage} style={{ marginTop: 8 * u, opacity: ramp(t, s(stageAt[stage]), 0.18), transform: `translateY(${(1 - ramp(t, s(stageAt[stage]), 0.18)) * 6 * u}px)` }}>
                  <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 34 * u, lineHeight: 1.15, color: color.lightText }}>{STAGES[stage][0]}</div>
                  <div style={{ fontFamily: font.sans, fontSize: 20 * u, lineHeight: 1.5, color: color.putty, marginTop: 6 * u }}>{STAGES[stage][1]}</div>
                </div>
              ) : null}
              <div style={{ display: "flex", alignItems: "center", gap: 8 * u, marginTop: 16 * u }}>
                {([["Using your brief", brief], ["Pricing catalog", costs], ["Similar work", projects]] as [string, number][]).map(([label, at], i) => {
                  const on = t >= s(at) && stage >= 1;
                  return (
                    <React.Fragment key={label}>
                      {i > 0 ? <Mono size={14 * u} color={color.emberDeep}>·</Mono> : null}
                      <Mono size={14 * u} color={color.lightText} style={{ padding: `${3 * u}px ${6 * u}px`, background: on && i > 0 ? color.accentFill : "transparent", transform: `scale(${on && i > 0 ? 0.92 + 0.08 * pop(t, s(at)) : 1})` }}>
                        {label}
                      </Mono>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Estimate rail, with the reference-only market comparison card */}
      <div style={{ position: "absolute", right: 0, top: 118 * u, bottom: 0, width: rail, borderLeft: `${3 * u}px solid ${color.lightText}`, padding: `${28 * u}px ${30 * u}px`, boxSizing: "border-box", background: color.lightBg, transform: `translateX(${review * rail}px)` }}>
        <Eyebrow size={15 * u}>Live estimate</Eyebrow>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 30 * u, marginTop: 8 * u, color: color.lightText }}>Data Center Catalog</div>
        <div style={{ marginTop: 18 * u, background: color.accentFill, border: `${3 * u}px solid ${color.lightText}`, padding: 18 * u }}>
          <Mono size={14 * u} color={color.lightText}>
            Working total
          </Mono>
          <div style={{ fontFamily: font.mono, fontWeight: 500, fontSize: 38 * u, marginTop: 6 * u, color: color.lightText }}>{money(72553.28 * count)}</div>
        </div>
        <div style={{ marginTop: 18 * u, border: `${3 * u}px solid ${color.lightText}`, padding: 18 * u, background: "#fff", clipPath: wipe(marketOn, "top") }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 * u }}>
            <Icon name="globe" size={20 * u} stroke={color.lightText} />
            <Mono size={14 * u} color={color.lightDim}>
              Market comparison
            </Mono>
            {marketReady ? (
              <span style={{ marginLeft: "auto", transform: `scale(${pop(t, s(drafts - 0.3))})` }}>
                <Icon name="check" size={22 * u} stroke={color.lightText} width={3} />
              </span>
            ) : null}
          </div>
          <div style={{ fontFamily: font.sans, fontSize: 19 * u, lineHeight: 1.4, marginTop: 10 * u, color: marketReady ? color.lightText : color.putty }}>
            {marketReady ? "For reference only. Not used in the price." : "Loading comparison…"}
          </div>
        </div>
      </div>

      {/* Review: Good / Better / Best (left) + reviewer feedback (right) */}
      <div style={{ position: "absolute", left: 52 * u, width: W - strip - 130 * u, top: 146 * u, clipPath: wipe(review, "left") }}>
        <Eyebrow size={16 * u}>Step 05 — Review</Eyebrow>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 50 * u, color: color.lightText, marginTop: 10 * u }}>Review the estimate.</div>
        <div style={{ marginTop: 26 * u, border: `${3 * u}px solid ${color.lightText}` }}>
          <div style={{ background: color.darkBg, color: color.darkText, fontFamily: font.sans, fontWeight: 600, fontSize: 24 * u, padding: `${14 * u}px ${24 * u}px` }}>Data Center Catalog</div>
          <div style={{ display: "flex" }}>
            {TIERS.map((tier, i) => {
              const p = spring(t - s(plan2 + 0.5 + i * 0.5), "snappy");
              const sel = i === 1 && t >= s(selectAt);
              const selP = ramp(t, s(selectAt), 0.25);
              return (
                <div key={tier.name} style={{ flex: 1, padding: `${20 * u}px ${20 * u}px`, borderRight: i < 2 ? `${3 * u}px solid ${color.lightText}` : "none", background: i === 1 ? `rgba(238,255,151,${selP})` : "#fff", opacity: clamp01(p * 1.3), transform: `translateY(${(1 - p) * -30 * u}px)`, position: "relative", height: 170 * u, boxSizing: "border-box" }}>
                  <Mono size={17 * u} color={color.lightText}>
                    {tier.name}
                  </Mono>
                  {sel ? (
                    <span style={{ position: "absolute", right: 18 * u, top: 16 * u, border: `${2 * u}px solid ${color.lightText}`, padding: `${3 * u}px ${8 * u}px`, transform: `scale(${0.6 + 0.4 * pop(t, s(selectAt))})` }}>
                      <Mono size={12 * u} color={color.lightText}>
                        Selected
                      </Mono>
                    </span>
                  ) : null}
                  <div style={{ fontFamily: font.mono, fontWeight: 500, fontSize: 38 * u, color: color.lightText, marginTop: 12 * u }}>{money(tier.total)}</div>
                  <div style={{ fontFamily: font.mono, fontSize: 14 * u, color: color.lightDim, marginTop: 10 * u }}>
                    Labor {money(tier.labor, false)} · Costs {money(tier.costs, false)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10 * u, marginTop: 26 * u, padding: `${14 * u}px ${22 * u}px`, border: `${3 * u}px solid ${color.lightText}`, background: t > s(sendAt) ? color.lightText : color.accentFill, opacity: ramp(t, s(finalCall - 0.5), 0.3), transform: `scale(${1 - press(t, s(sendAt)) * 0.05})` }}>
          <Icon name={t > s(sendAt) ? "check" : "arrow"} size={20 * u} stroke={t > s(sendAt) ? color.accentFill : color.lightText} />
          <Mono size={16 * u} color={t > s(sendAt) ? color.accentFill : color.lightText}>
            {t > s(sendAt) ? "Sent for approval · ClickUp" : "Send for approval"}
          </Mono>
        </div>
      </div>
      <div style={{ position: "absolute", right: 52 * u, top: 150 * u, width: strip, border: `${3 * u}px solid ${color.lightText}`, background: "#fff", clipPath: wipe(ramp(t, s(teammate - 0.5), 0.5, outExpo), "top") }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `${16 * u}px ${22 * u}px`, borderBottom: `${2 * u}px solid ${color.lightLine}` }}>
          <Mono size={15 * u} color={color.lightDim}>
            Feedback
          </Mono>
          <Mono size={15 * u} color={color.lightText}>
            ✓ {[reviews, every, number].filter((b) => t >= s(b)).length} ○ {[reviews, every, number].filter((b) => t < s(b)).length}
          </Mono>
        </div>
        {REVIEWERS.map((r, i) => {
          const at = [reviews, every, number][i];
          const ok = t >= s(at);
          return (
            <div key={r} style={{ display: "flex", alignItems: "center", gap: 16 * u, padding: `${16 * u}px ${22 * u}px`, borderBottom: i < 2 ? `1px solid ${color.lightLine}` : "none", background: ok ? `rgba(238,255,151,${0.6 * (1 - ramp(t, s(at) + 0.4, 0.5))})` : "transparent" }}>
              <div style={{ width: 30 * u, display: "flex", justifyContent: "center" }}>
                {ok ? (
                  <span style={{ transform: `scale(${pop(t, s(at))})` }}>
                    <Icon name="check" size={26 * u} stroke={color.lightText} width={3} />
                  </span>
                ) : (
                  <div style={{ width: 18 * u, height: 18 * u, borderRadius: "50%", border: `${2 * u}px solid ${color.lightText}` }} />
                )}
              </div>
              <Icon name="user" size={22 * u} stroke={color.lightDim} />
              <span style={{ fontFamily: font.sans, fontSize: 24 * u, color: color.lightText }}>{r}</span>
              <span style={{ marginLeft: "auto", opacity: ok ? 1 : 0 }}>
                <Mono size={13 * u} color={color.lightDim}>
                  Looks good
                </Mono>
              </span>
            </div>
          );
        })}
      </div>
      <Cursor x={curX * u} y={curY * u} size={44 * u} press={pr} opacity={1 - ramp(t, s(over - 0.8), 0.3)} />
    </Chapter>
  );
};
