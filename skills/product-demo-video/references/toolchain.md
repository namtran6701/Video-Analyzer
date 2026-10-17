# Toolchain

Production runs on the **`motion-studio`** skill: Remotion is the only engine and timeline, every shot goes to a lane (2D, real-time 3D, Blender plate), and the score, SFX, critique loop and delivery come from its `scripts/`. Read motion-studio's SKILL.md before step 5. This file only adds what's specific to this style.

## Lane per act

| Act | Lane | Why |
|---|---|---|
| 1 Hook, 2 Problem | 2D | Morphs, word lighting, motion-blur stacks, trash arc. `motion.ts` + GSAP SplitText |
| 3 Reveal | Blender plate + 2D wordmark | Volumetric light shafts are the one thing R3F and CSS can't sell. Fallback below |
| 4 Positioning, 7 Capabilities, 9 Bonus, 10 CTA | 2D | Pure type and icons |
| 5 Demo | 2D | React-built UI from the captured brand screens, at real scale |
| 6 Proof | 2D | Bars, count-up, camera pull-out |
| 8 Trust | 2D + R3F laptop (M17) | The lid close is the tactile moment; a real hinge with an HDRI reads as product, a flat mock reads as a slide |

Expected: 1 Blender plate and 1 R3F shot per film. Anything else in 3D needs a one-line reason in the shotlist's lane column.

**Reveal fallback** when the Blender MCP isn't connected (and the user doesn't want to open Blender): 2D vertical stripes from `repeating-linear-gradient`, animated `background-position`, 40px blur, plus light seeded grain to hide banding. Say in the progress report that it's the fallback.

## Setup

Per motion-studio: Node 22+, ffmpeg, `npx create-video@latest` (blank), `npx skills add remotion-dev/skills`. Install only the lanes used, versions exact, `@remotion/*` pinned to the project's Remotion version:

```bash
npm i -E @remotion/gsap gsap @remotion/motion-blur @remotion/media lucide-react
npm i -E @remotion/three three @react-three/fiber @react-three/drei && npm i -E -D @types/three   # only if M17 is in 3D
```

Copy from motion-studio's `scripts/`: `motion.ts` → `src/lib/motion.ts`. Copy this skill's `assets/remotion/tokens.ts` → `src/tokens.ts`. Check current Remotion / GSAP / R3F APIs with context7 before writing framework code.

## Project layout

The project root is the Remotion project.

```
<project>/
  brief.md
  docs/style_guide.md        # mapped from references/style_guide.md
  docs/shotlist.md           # from assets/templates/shotlist.md, with lane + energy columns
  docs/score.json            # from the energy column
  docs/sfx.json              # SFX cues from the audio column
  docs/review_log.md         # critique-loop scores and fixes
  beats.json                 # beats.py output
  plates/<shot>.blend        # Blender sources (copies, never the user's session file)
  public/
    brand/                   # captured screenshots, logo, fonts (gate 1)
    plates/reveal/####.png   # Blender plate frames
    score.wav  mix.wav
  src/
    tokens.ts                # palette, type, beat grid, layout()
    lib/motion.ts            # from motion-studio
    motion/                  # M1..M18 components (only the ones the shotlist uses)
    acts/                    # Act01Hook.tsx ... Act10CTA.tsx
    Film.tsx                 # <Sequence> per act, layout from useVideoConfig()
    Root.tsx                 # one <Composition> per format, all rendering <Film>
  out/
```

## Beat grid

`tokens.ts` gives both units. Write shotlist times in beats; use `at()` for `<Sequence from>` and plate frame math, `bt()` for `motion.ts` and GSAP timeline positions (both take seconds).

```ts
export const at = (beats: number) => Math.round(beats * BEAT); // frames
export const bt = (beats: number) => (beats * 60) / BPM;        // seconds
```

Beat 0 is t = 0, same grid as `beats.py` and `score.mjs`. Every act starts on a downbeat (a multiple of 4 beats) so score energy steps land on the cuts.

## Formats

One `<Composition>` per format in the brief (`Main-16x9`, `Main-1x1`, `Main-9x16`), all rendering `<Film>`. Every size comes from `layout(width, height)` in `tokens.ts`, never fixed pixels. Per format:

- 9:16: max 3 words per line, demo UI reframed to a single column (camera follows the active element instead of showing the whole window), keep type and UI inside `layout().safe`.
- 1:1: max 4 words per line, demo window scaled to fit width.
- The reveal plate gets one render per format (framing differs); everything else is shared.

## Render

Draft at `--scale=0.5` during the critique loop. Final, per format:

```bash
npx remotion render Main-16x9 out/final-16x9.mp4 --codec=h264 --crf=16
ffprobe -v error -show_entries stream=width,height,r_frame_rate,duration -of default=nw=1 out/final-16x9.mp4
```
