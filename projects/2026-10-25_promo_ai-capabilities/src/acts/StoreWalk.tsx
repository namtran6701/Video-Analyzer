import React from "react";
import { Img, staticFile } from "remotion";
import { Caret, Cursor, Icon, Mono, band, clamp01, inExpo, outExpo, pop, press, ramp, typed, useT } from "../kit";
import { spring, track } from "../lib/motion";
import { voice, warp } from "../vo";
import { bt, color, font } from "../tokens";
import { AppBar, Chapter, Payoff } from "./demo-common";

const STOPS = ["Main product", "Competitor", "Price & label", "Packaging", "End cap", "General"];
const SHOTS = [
  { src: "gallery4", store: "Walmart Supercenter — Zebulon, NC", tags: ["Shelf", "GE", "Loctite", "Properly faced"] },
  { src: "gallery2", store: "Walmart Supercenter — Zebulon, NC", tags: ["Competitor", "Brio", "Stands out"], rival: true },
  { src: "gallery5", store: "Walmart Supercenter — Zebulon, NC", tags: ["Pricing & signage", "Primo", "Lower price"] },
];
const QUERY = "end cap with sale tags";
const PITCH = "We'd love to talk about keeping Channellock's strong in-stock look consistent from store to store, especially where our field photos caught low stock and empty facings.";

const photo = (name: string) => staticFile(`brand/photos/${name}.jpg`);

export const StoreWalk: React.FC = () => {
  const { t, u } = useT();
  const vo = voice("storewalk");
  const [every, tagsAt, searchAt, drafts, pitch, payAt, searchable] = vo.seq("every tagged search drafts pitch every searchable");
  // Original beat schedule warped so each phase starts on the word that names it.
  const w = warp([[0, 0], [8, every - 0.6], [9, tagsAt], [14, searchAt - 0.8], [24, drafts - 0.6], [26, pitch], [32, payAt], [36, 36]]);
  const s = (b: number) => bt(w(b));
  const phase = (a: number, b: number) => band(ramp(t, s(a) - 0.1, 0.55, outExpo), ramp(t, s(b) - 0.1, 0.45, inExpo));
  const walk = band(1, ramp(t, s(8) - 0.1, 0.45, inExpo));
  const tags = phase(8, 14);
  const search = phase(14, 24);
  const insight = band(ramp(t, s(24) - 0.1, 0.55, outExpo));
  const zoom = track(t, [[0, 1], [s(9), 1.1], [s(13.5), 1], [s(26), 1.16], [s(31), 1]], "default");
  const stop = Math.min(2, Math.floor(t / s(2)));
  const walkerX = track(t, [[0, 120], [s(1), 300], [s(3), 520], [s(5), 740]], "default");
  const nav = ["Gallery", "Timeline", "AI insights", "Guide"];
  const activeNav = t < s(24) ? 0 : 2;

  const curX = track(t, [[0, 900], [s(14), 620], [s(17), 1420], [s(25), 1280]], "default");
  const curY = track(t, [[0, 700], [s(14), 190], [s(17), 190], [s(25), 205]], "default");
  const pr = press(t, s(17.5)) + press(t, s(26));

  return (
    <Chapter k={1} beats={36} payoffAt={payAt} zoom={zoom} focus={t < s(20) ? [0.5, 0.8] : [1, 0.6]} payoff={<Payoff big="Every store walk, searchable." sub="Photos, tags and pitches in one place" at={payAt} subAt={searchable} />}>
      <AppBar
        left={
          <>
            <div style={{ fontFamily: font.display, fontWeight: 900, fontSize: 24 * u, lineHeight: 0.9, color: color.darkText }}>
              STORE
              <br />
              WALK
            </div>
            <div style={{ display: "flex", gap: 40 * u, marginLeft: 70 * u }}>
              {nav.map((n, i) => (
                <Mono key={n} size={17 * u} color={i === activeNav ? color.accentFill : "#9AA7A8"}>
                  {n}
                </Mono>
              ))}
            </div>
          </>
        }
      />

      {/* A: guided aisle walk */}
      <div style={{ position: "absolute", left: 40 * u, top: 100 * u, right: 40 * u, clipPath: walk }}>
        <Mono size={16 * u} color={color.lightDim}>
          Stop {stop + 1} / 6 · {STOPS[stop]}
        </Mono>
        <div style={{ display: "flex", gap: 28 * u, marginTop: 16 * u }}>
          <div style={{ position: "relative", width: 1020 * u, height: 400 * u, background: color.cloud, border: `${3 * u}px solid ${color.lightText}`, overflow: "hidden" }}>
            {[0, 1, 2].map((r) => (
              <div key={r} style={{ position: "absolute", left: 30 * u, right: 30 * u, top: (60 + r * 110) * u, height: 90 * u, display: "flex", gap: 10 * u, borderBottom: `${4 * u}px solid ${color.lightText}` }}>
                {Array.from({ length: 12 }).map((_, c) => {
                  const bay = Math.floor(c / 4);
                  const hot = bay === stop;
                  const rival = stop === 1 && bay === 1 && r === 1;
                  return <div key={c} style={{ flex: 1, background: hot ? color.accentFill : "#fff", border: `${2 * u}px solid ${rival ? "#C21212" : color.lightDim}`, alignSelf: "flex-end", height: (60 + ((c * 7 + r * 3) % 4) * 8) * u }} />;
                })}
              </div>
            ))}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 40 * u, borderTop: `${2 * u}px dashed ${color.lightDim}` }} />
            <div style={{ position: "absolute", left: walkerX * u, bottom: 22 * u, width: 36 * u, height: 36 * u, borderRadius: "50%", background: color.lightText, border: `${4 * u}px solid ${color.accent}` }} />
            {[1, 3, 5].map((b) => {
              const f = ramp(t, s(b + 0.9), 0.08) * (1 - ramp(t, s(b + 1), 0.25));
              return <div key={b} style={{ position: "absolute", inset: 0, background: "#fff", opacity: f * 0.7 }} />;
            })}
          </div>
          <div style={{ flex: 1 }}>
            <Mono size={15 * u} color={color.lightText}>
              Captured
            </Mono>
            {SHOTS.map((sh, i) => {
              const p = spring(t - s(2 + 2 * i), "snappy");
              return (
                <div key={sh.src} style={{ marginTop: 14 * u, height: 112 * u, border: `${3 * u}px solid ${sh.rival ? "#C21212" : color.lightText}`, overflow: "hidden", opacity: clamp01(p * 1.5), transform: `translate(${(1 - p) * -200 * u}px, 0) scale(${0.8 + 0.2 * p})` }}>
                  <Img src={photo(sh.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 * u, marginTop: 18 * u }}>
          {STOPS.map((st, i) => (
            <span key={st} style={{ padding: `${7 * u}px ${12 * u}px`, border: `${2 * u}px solid ${color.lightText}`, background: i < stop + (t > s(6.9) ? 1 : 0) ? color.lightText : i === stop ? color.accentFill : "transparent" }}>
              <Mono size={13 * u} color={i < stop + (t > s(6.9) ? 1 : 0) ? color.darkText : color.lightText}>
                {i + 1} {st}
              </Mono>
            </span>
          ))}
        </div>
      </div>

      {/* B: AI suggests metadata */}
      <div style={{ position: "absolute", left: 40 * u, top: 110 * u, right: 40 * u, display: "flex", gap: 28 * u, clipPath: tags }}>
        {SHOTS.map((sh, i) => (
          <div key={sh.src} style={{ flex: 1, border: `${3 * u}px solid ${color.lightText}`, background: "#fff" }}>
            <div style={{ height: 300 * u, overflow: "hidden", position: "relative" }}>
              <Img src={photo(sh.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ padding: 18 * u }}>
              <div style={{ fontFamily: font.sans, fontWeight: 600, fontSize: 20 * u, color: color.lightText }}>{sh.store}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 * u, marginTop: 12 * u }}>
                <Icon name="sparkles" size={18 * u} stroke={color.lightText} />
                <Mono size={13 * u} color={color.lightDim}>
                  AI suggest metadata
                </Mono>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 * u, marginTop: 12 * u, minHeight: 80 * u }}>
                {sh.tags.map((tag, j) => {
                  const p = pop(t, s(9 + i * 0.5 + j * 0.5));
                  return (
                    <span key={tag} style={{ padding: `${5 * u}px ${10 * u}px`, background: j === 0 ? color.lightText : color.cloud, opacity: clamp01(p * 1.4), transform: `scale(${0.7 + 0.3 * p})` }}>
                      <Mono size={14 * u} color={j === 0 ? color.darkText : color.lightText}>
                        {tag}
                      </Mono>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* C: plain-English search */}
      <div style={{ position: "absolute", left: 40 * u, top: 100 * u, right: 40 * u, clipPath: search }}>
        <div style={{ display: "flex", gap: 14 * u }}>
          <div style={{ flex: 1, height: 64 * u, border: `${3 * u}px solid ${color.lightText}`, background: "#fff", display: "flex", alignItems: "center", gap: 14 * u, padding: `0 ${20 * u}px` }}>
            <Icon name="search" size={24 * u} stroke={color.lightText} />
            <span style={{ fontFamily: font.sans, fontSize: 26 * u, color: color.lightText }}>
              {typed(QUERY, t, s(14.5), s(16.8))}
              {t < s(17.5) ? <Caret t={t} h={28 * u} /> : null}
            </span>
          </div>
          <div style={{ width: 150 * u, background: color.accentFill, border: `${3 * u}px solid ${color.lightText}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - press(t, s(17.5)) * 0.05})` }}>
            <Mono size={17 * u} color={color.lightText}>
              Search
            </Mono>
          </div>
        </div>
        <Mono size={17 * u} color={color.lightDim} style={{ display: "block", marginTop: 22 * u, opacity: ramp(t, s(18), 0.2) }}>
          100 matches
        </Mono>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 * u, marginTop: 14 * u }}>
          {[1, 2, 3, 4, 5, 6].map((n, i) => {
            const p = spring(t - s(18.5 + i * 0.5), "stagger");
            return (
              <div key={n} style={{ height: 178 * u, border: `${3 * u}px solid ${color.lightText}`, overflow: "hidden", opacity: clamp01(p * 1.3), transform: `translateY(${(1 - p) * 30 * u}px)` }}>
                <Img src={photo(`search${n}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* D: AI insights + generate pitch */}
      <div style={{ position: "absolute", left: 40 * u, top: 100 * u, right: 40 * u, clipPath: insight }}>
        <Mono size={15 * u} color={color.lightDim}>
          Field intelligence · May – Oct 2026
        </Mono>
        <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 44 * u, color: color.lightText, marginTop: 6 * u }}>AI Insights</div>
        <div style={{ marginTop: 18 * u, border: `${3 * u}px solid ${color.lightText}`, background: "#fff", display: "flex" }}>
          <div style={{ width: 520 * u, padding: 26 * u, borderRight: `${3 * u}px solid ${color.lightText}` }}>
            <div style={{ fontFamily: font.sans, fontWeight: 700, fontSize: 34 * u, color: color.lightText }}>Channellock</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 * u, marginTop: 18 * u }}>
              {[
                ["15", "Stores"],
                ["56", "Photos"],
                ["18", "Walks"],
                ["16", "Walkers"],
                ["2", "States"],
              ].map(([v, k], i) => (
                <div key={k} style={{ opacity: ramp(t, s(24.5 + i * 0.25), 0.25) }}>
                  <div style={{ fontFamily: font.mono, fontWeight: 500, fontSize: 40 * u, color: color.lightText }}>{v}</div>
                  <Mono size={12 * u} color={color.lightDim}>
                    {k}
                  </Mono>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 22 * u, display: "inline-block", padding: `${6 * u}px ${12 * u}px`, background: color.lightText }}>
              <Mono size={14 * u} color={color.accentFill}>
                Evidence strength · Strong
              </Mono>
            </div>
          </div>
          <div style={{ flex: 1, padding: 26 * u, minHeight: 330 * u }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10 * u, padding: `${12 * u}px ${18 * u}px`, border: `${3 * u}px solid ${color.lightText}`, background: t > s(26) ? color.lightText : color.accentFill, transform: `scale(${1 - press(t, s(26)) * 0.05})` }}>
              <Icon name="sparkles" size={20 * u} stroke={t > s(26) ? color.accentFill : color.lightText} />
              <Mono size={15 * u} color={t > s(26) ? color.accentFill : color.lightText}>
                Generate pitch
              </Mono>
            </div>
            <Mono size={13 * u} color={color.emberDeep} style={{ display: "block", marginTop: 22 * u, opacity: ramp(t, s(26.5), 0.2) }}>
              Pitch angle · opener
            </Mono>
            <div style={{ fontFamily: font.sans, fontSize: 25 * u, lineHeight: 1.45, color: color.lightText, marginTop: 10 * u }}>
              {typed(PITCH, t, s(26.5), s(31))}
              {t > s(26.5) && t < s(32) ? <Caret t={t} h={26 * u} /> : null}
            </div>
          </div>
        </div>
      </div>
      <Cursor x={curX * u} y={curY * u} size={44 * u} press={pr} opacity={ramp(t, s(13.5), 0.3) * (1 - ramp(t, s(27), 0.3))} />
    </Chapter>
  );
};
