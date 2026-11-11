// Post-processing for R3F shots in Remotion. Copy to src/lib/post3d.tsx.
// <PostFX> replaces <EffectComposer>: the composer mounts asynchronously, so without it the first
// frames of every render (and of every --frames range) come out blank.
// It also turns the renderer's autoClear back on, which EffectComposer switches off: otherwise passes
// that draw into their own targets first (ContactShadows) pile each frame onto the last.
// <Grain> replaces postprocessing's <Noise>, which reads a wall-clock timer and changes on every render.
import { EffectComposer } from '@react-three/postprocessing';
import { useFrame, useThree } from '@react-three/fiber';
import { Effect, type EffectComposer as EffectComposerImpl } from 'postprocessing';
import { useCallback, useMemo, useState, type ComponentProps } from 'react';
import { Uniform } from 'three';
import { continueRender, delayRender, useCurrentFrame } from 'remotion';

export const PostFX = (props: ComponentProps<typeof EffectComposer>) => {
  const advance = useThree((s) => s.advance);
  const [handle] = useState(() => delayRender('EffectComposer setup'));
  useFrame(({ gl }) => {
    gl.autoClear = true;
  }, -1);
  const ref = useCallback(
    (composer: EffectComposerImpl | null) => {
      if (!composer) return;
      // Effects attach after the composer exists; draw once with them, then release the frame.
      requestAnimationFrame(() => {
        advance(performance.now());
        continueRender(handle);
      });
    },
    [advance, handle],
  );
  return <EffectComposer {...props} ref={ref} />;
};

const fragmentShader = /* glsl */ `
uniform float frame;
uniform float amount;
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 p = gl_FragCoord.xy + vec2(frame * 37.0, frame * 91.0);
  float n = fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  outputColor = vec4(inputColor.rgb + n * amount, inputColor.a);
}`;

class GrainEffect extends Effect {
  constructor() {
    super('GrainEffect', fragmentShader, {
      uniforms: new Map([['frame', new Uniform(0)], ['amount', new Uniform(0.04)]]),
    });
  }
}

// amount: 0.03 to 0.06 reads as film; more reads as an effect.
export const Grain = ({ amount = 0.04 }: { amount?: number }) => {
  const frame = useCurrentFrame();
  const effect = useMemo(() => new GrainEffect(), []);
  effect.uniforms.get('frame')!.value = frame % 1000;
  effect.uniforms.get('amount')!.value = amount;
  return <primitive object={effect} dispose={null} />;
};
