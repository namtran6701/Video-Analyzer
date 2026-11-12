import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Finish } from "./lib/finish";
import { Black, BW, Captions, Card, Clip, Counter, DayCounter, Flash, GlitchIn, JumpClip, SettleStill, SliceClip, Still, Strobe, WhipOut, type CaptionPage } from "./shots";
import { C, FONT } from "./tokens";
import voWords from "./vo_words.json";

loadFont({ family: FONT.display, url: staticFile("fonts/Montserrat-Variable.ttf"), weight: "100 900" });
loadFont({ family: FONT.ui, url: staticFile("fonts/Inter-Variable.ttf"), weight: "100 900" });
loadFont({ family: FONT.mono, url: staticFile("fonts/JetBrainsMono-Variable.ttf"), weight: "100 800" });

// Caption text comes from the script; timing from the placed take. [text, first word, last word] by word index.
const PHRASES: [string, number, number][] = [
  ["A thousand mornings.", 0, 2],
  ["Nobody saw them.", 3, 5],
  ["No posts,", 6, 7],
  ["no updates,", 8, 9],
  ["no applause.", 10, 11],
  ["They'll call it...", 12, 14],
  ["overnight success.", 15, 16],
  ["But the quiet", 17, 19],
  ["work never stops.", 20, 22],
  ["It keeps...", 23, 24],
  ["compounding...", 25, 25],
  ["Don't announce it.", 26, 28],
  ["Don't explain it.", 29, 31],
  ["Finish it.", 32, 33],
];
const HOLD = 1.2;
const pages: CaptionPage[] = PHRASES.map(([text, a, b], i) => {
  const next = PHRASES[i + 1];
  const end = voWords[b].end + HOLD;
  return { text, start: voWords[a].t, end: next ? Math.min(end, voWords[next[1]].t) : end };
});

const BW_V: typeof BW = { ...BW, vignette: true };

// [from, duration, node]. Frames on the 30 fps grid, durations sum to 900.
const SHOTS: [number, number, React.ReactNode][] = [
  // Act 1: hook, full color
  [0, 24, <Clip id="2170666953" trim={2} />],
  [24, 14, <Clip id="2238076658" trim={6.2} />],
  [38, 20, <Clip id="2156829185" trim={3} />],
  [58, 14, <Clip id="2231985948" trim={5} />],
  [72, 36, <Clip id="2238580508" trim={3} dimFrom={21} />],
  // Act 2: claim, color drains
  [108, 27, <Strobe items={[
    { id: "2265528712" }, { id: "1199009757" }, { id: "2238076658", trim: 3, invert: true },
    { id: "1347710295" }, { id: "1401994449" }, { id: "2265500327", trim: 4 },
    { id: "1199283481", invert: true }, { id: "2161001759" }, { id: "2296937235", trim: 2 },
  ]} />],
  [135, 24, <Clip id="1558303799" trim={3} look={{ sat: 0.6 }} />],
  [159, 15, <Clip id="1430705871" trim={5} look={{ sat: 0.4 }} />],
  [174, 18, <Clip id="1453394745" trim={1} look={{ sat: 0.25, contrast: 1.1 }} />],
  [192, 30, <Clip id="2227925964" trim={4} look={{ sat: 0.1, contrast: 1.2 }} />],
  [222, 30, <Clip id="2284718357" trim={2} look={BW} push={0.04} />],
  // Act 3: naming
  [252, 24, <Strobe items={["1082490010", "184996512", "643187788", "1255984157", "1338372896", "2173470741", "1740359778", "1461662187"].map((id) => ({ id }))} />],
  [276, 17, <Still id="1461662187" push={0.02} />],
  [293, 7, <Flash />],
  [300, 42, <Clip id="2218881745" trim={2} look={BW} zoom={1.18} origin="50% 35%" />],
  // Act 4: mechanism
  [342, 30, <SliceClip id="2215843891" trims={[2, 7, 11]} />],
  [372, 18, <Clip id="2198008264" trim={8} look={{ ...BW_V, bright: 1 }} />],
  [390, 15, <GlitchIn><Clip id="1469856918" trim={4} look={BW} /></GlitchIn>],
  [405, 27, <JumpClip id="2269621829" trim={16} skip={45} zoom={2.3} origin="50% 62%" look={{ ...BW, bright: 1.1 }} />],
  // Act 5: breath
  [432, 72, <Black />],
  // Act 6: results
  [504, 25, <Clip id="909533362" trim={10.2} look={{ ...BW, contrast: 1.5, bright: 0.85 }} push={0.08} />],
  [529, 61, <DayCounter from={998} to={1000} />],
  [590, 17, <Clip id="146113610" trim={11} look={BW} push={0.05} />],
  [607, 14, <Clip id="2248020305" trim={2} look={BW_V} push={0} />],
  [621, 15, <Clip id="2242455296" trim={2} look={BW_V} push={0} />],
  [636, 21, <WhipOut><Clip id="2282025715" trim={2} look={{ ...BW, bright: 0.6 }} push={0} /></WhipOut>],
  [657, 99, <SettleStill id="2193461623_hold" look={{ ...BW, contrast: 1.2, bright: 1.3 }} />],
  // Act 7: close
  [756, 56, <Card text="Work in silence." />],
  [812, 73, <Card text="Let the results speak." />],
  [885, 15, <Black />],
];

export const Film: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.ground }}>
    <Finish>
      {SHOTS.map(([from, dur, node]) => (
        <Sequence key={from} from={from} durationInFrames={dur} premountFor={30}>
          {node}
        </Sequence>
      ))}
      <Sequence durationInFrames={108}>
        <Counter text="1,000" steps={[0, 24, 38, 58, 72]} />
      </Sequence>
      <Captions pages={pages} hide={[[293, 300]]} />
    </Finish>
    <Audio src={staticFile("mix.wav")} />
  </AbsoluteFill>
);
