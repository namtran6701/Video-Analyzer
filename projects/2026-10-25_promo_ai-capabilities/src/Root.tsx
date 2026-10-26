import { Composition } from "remotion";
import { Main } from "./Main";
import { DURATION, FPS } from "./tokens";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Main-16x9" component={Main} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ audio: "mix.wav", captions: true }} />
  </>
);
