import React from "react";
import { AbsoluteFill } from "remotion";
import pages from "./captions.json";
import { useT } from "./kit";
import { color, font } from "./tokens";

// Burned-in caption pages in the bottom band (80 to 92% of height), plain, on a soft Anvil backing.
export const Captions: React.FC = () => {
  const { t, u, width, captionTop, captionBottom } = useT();
  const ms = t * 1000;
  const page = pages.find((p) => ms >= p.startMs && ms < p.endMs);
  if (!page) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: captionTop, height: captionBottom - captionTop, left: (width - width * 0.78) / 2, width: width * 0.78, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "rgba(28,44,46,0.6)", borderRadius: 10 * u, padding: `${10 * u}px ${24 * u}px`, fontFamily: font.sans, fontWeight: 500, fontSize: 44 * u, lineHeight: 1.25, color: color.darkText, textAlign: "center", textWrap: "balance" }}>{page.text}</div>
      </div>
    </AbsoluteFill>
  );
};
