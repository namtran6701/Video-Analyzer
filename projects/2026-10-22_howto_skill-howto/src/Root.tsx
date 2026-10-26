import { Composition } from "remotion";
import { Main } from "./Main";
import { TOTAL } from "./timeline";
import { FPS, HEIGHT, WIDTH } from "./tokens";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Main" component={Main} durationInFrames={TOTAL} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="MainVO" component={Main} defaultProps={{ audio: "mix_vo.wav" }} durationInFrames={TOTAL} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition
        id="MainVOCaptions"
        component={Main}
        defaultProps={{ audio: "mix_vo.wav", captions: true }}
        durationInFrames={TOTAL}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
