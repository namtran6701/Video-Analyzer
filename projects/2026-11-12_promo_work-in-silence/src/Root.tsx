import { Composition } from "remotion";
import { Film } from "./Film";
import { DURATION, FPS } from "./tokens";

export const RemotionRoot: React.FC = () => (
  <Composition id="WorkInSilence-9x16" component={Film} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
);
