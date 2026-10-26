import { loadFont } from "@remotion/fonts";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Hook, Intro, Positioning, Problem, Reveal } from "./acts/Open";
import { Bonus, Capabilities, Close, Proof, Trust } from "./acts/Close";
import { Pricing } from "./acts/Pricing";
import { StoreWalk } from "./acts/StoreWalk";
import { Training } from "./acts/Training";
import { Captions } from "./Captions";
import { ACT, INTRO, bar, color } from "./tokens";

loadFont({ family: "Gotham", url: staticFile("fonts/Gotham-Bold.otf"), weight: "700" });
loadFont({ family: "Gotham", url: staticFile("fonts/Gotham-Black.otf"), weight: "900" });
loadFont({ family: "IBM Plex Sans", url: staticFile("fonts/IBMPlexSans-VariableFont_wdth_wght.ttf"), weight: "100 700" });
loadFont({ family: "IBM Plex Mono", url: staticFile("fonts/IBMPlexMono-Regular.ttf"), weight: "400" });
loadFont({ family: "IBM Plex Mono", url: staticFile("fonts/IBMPlexMono-Medium.ttf"), weight: "500" });

const ACTS: [keyof typeof ACT, keyof typeof ACT, React.FC][] = [
  ["hook", "problem", Hook],
  ["problem", "reveal", Problem],
  ["reveal", "positioning", Reveal],
  ["positioning", "pricing", Positioning],
  ["pricing", "storewalk", Pricing],
  ["storewalk", "training", StoreWalk],
  ["training", "proof", Training],
  ["proof", "capabilities", Proof],
  ["capabilities", "trust", Capabilities],
  ["trust", "bonus", Trust],
  ["bonus", "close", Bonus],
  ["close", "end", Close],
];

export const Main: React.FC<{ audio?: string; captions?: boolean }> = ({ audio, captions }) => (
  <AbsoluteFill style={{ background: color.darkBg }}>
    <Sequence durationInFrames={INTRO} name="intro">
      <Intro />
      <Audio src={staticFile("intro.wav")} />
    </Sequence>
    <Sequence from={INTRO} name="film">
      {ACTS.map(([from, to, C]) => (
        <Sequence key={from} from={bar(ACT[from])} durationInFrames={bar(ACT[to]) - bar(ACT[from])} name={from}>
          <C />
        </Sequence>
      ))}
      {captions ? <Captions /> : null}
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </Sequence>
  </AbsoluteFill>
);
