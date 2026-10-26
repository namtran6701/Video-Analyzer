import { Composition } from "remotion";
import { DURATION, Episode } from "./Episode";
import { FPS, HEIGHT, WIDTH } from "./tokens";

export const RemotionRoot: React.FC = () => (
  <Composition id="Main" component={Episode} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
);
