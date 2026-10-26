import { Composition } from "remotion";
import { Main } from "./Main";
import { FPS, HEIGHT, TOTAL, WIDTH } from "./tokens";

export const RemotionRoot: React.FC = () => (
  <Composition id="Main" component={Main} durationInFrames={TOTAL} fps={FPS} width={WIDTH} height={HEIGHT} />
);
