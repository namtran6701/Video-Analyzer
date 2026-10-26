# Toolchain

Everything here is 2D, so **Remotion is the whole pipeline**, all in motion-studio's 2D lane. No Blender, no R3F, no screen recordings. Production basics (setup, determinism rules, score, SFX, critique loop, delivery) follow the **`motion-studio`** skill; this file adds what's specific to this style.

## Setup

Per motion-studio: Node 22+, ffmpeg, `npx create-video@latest` (blank), `npx skills add remotion-dev/skills`, then `npm i -E @remotion/media` (versions pinned to the project's Remotion). Copy motion-studio's `scripts/motion.ts` → `src/lib/motion.ts`, and this skill's `tokens.ts` and `camera.ts` → `src/`. GSAP isn't needed: nothing in this style is per-character type animation.

## Who does what

| Need | Tool | Why |
|---|---|---|
| Camera, window, cards, wipe, cursor, panel, timeline | **Remotion** | Frame-exact React, `interpolate`/`Easing`, `<Sequence>` maps 1:1 to the shotlist, renders H.264 directly |
| "Before" / "after" app screens | **Screenshots** (Chrome DevTools MCP if the app runs, otherwise supplied by the user) | Pixel-sharp at 3x close-ups, trivially swappable, and the wipe between two screenshots is exactly how the transform reads |
| Anything that animates inside the UI | **React components** in Remotion | Typing, streaming, menus, toggles, file chips, working state can't be faked with a crossfade |
| Music + SFX | **Lyria** final, conformed to 90 BPM, via the **`motion-studio`** skill (synthesized bed for drafts), or a licensed ~90 BPM track | Finished-sounding music that still locks to the beat grid |
| Final checks | **ffprobe** | Verify duration, resolution, fps |

Rule of thumb: static = screenshot, changing = React. The panel's empty state can be a screenshot; its thread (bubble, step line, working, reply) is React styled to match.

## Screens

- Window content area at rest is ~1418 x 790 (window minus ~110px of browser chrome). Capture the app at that CSS viewport with **device scale factor 3** so 3x close-ups stay sharp (≈ 4254 x 2370 px).
- Per chapter, in `public/screens/`: `chNN-before.png`, `chNN-after.png`, plus any static close-up state (`chNN-menu.png`, `chNN-panel-empty.png`).
- Hide real user data, notifications and cookie banners. Use the fictional data universe from the brief.
- Chrome DevTools MCP: `new_page` with the URL, `emulate` with viewport `1418x790x3` (tested: 4254 x 2370 px), set up the state (`click`, `fill`, `evaluate_script` to hide banners), then `take_screenshot` with `filePath: "public/screens/ch01-before.png"` (relative to the working folder). Re-run `emulate` after a navigation if the size resets.
- Playwright only for a big batch you'll recapture after UI changes: `newPage({ viewport: { width: 1418, height: 790 }, deviceScaleFactor: 3 })`, same file names.

## Project layout

The project root is the Remotion project; everything loaded with `staticFile` lives in `public/`.

```
<project>/
  brief.md
  docs/style_guide.md         # mapped from references/style_guide.md
  docs/shotlist.md            # from assets/templates/shotlist.md
  docs/score.json  docs/sfx.json  docs/review_log.md
  beats.json                  # motion-studio beats.py --bpm 90
  public/
    screens/                  # chNN-before.png, chNN-after.png, close-up states
    brand/                    # logo mark + wordmark (SVG), opener icons, fonts
    score.wav  mix.wav        # or the user's track
  src/
    tokens.ts                 # palette, type, beat helpers
    camera.ts                 # world camera (keys, cuts, eased moves)
    lib/motion.ts             # from motion-studio
    stage/                    # Stage (ivory bg + camera world), Window (chrome, screenshot, shadow)
    ui/                       # Cursor, Menu, Toggle, FileDrag, Panel, Prompt, Working, Stream
    fx/                       # AccentWipe, AccentBloom, PanelGlow
    cards/                    # Opener, Tagline, LogoBuild
    Root.tsx                  # one <Composition>, <Sequence> per section, <Audio src={staticFile('mix.wav')} />
  out/
```

## Camera world

All chapter windows live in one world container; the camera transforms that container. Window `i` has its top-left at `(i * (1418 + 160), 0)`.

- Wide pose for window `i`: `{ x: i * 1578 + 709, y: 450, s: 1 }`
- Close-up on point `(px, py)` inside window `i`: `{ x: i * 1578 + px, y: py, s: 3 }`
- Carousel pan (M18): a key from window `i`'s wide pose to window `i + 1`'s.
- Punch-in (M4): a key with `cut: true`. Pull-back (M5): a normal key back to the wide pose.
- The tagline can sit in the world below the last window so M19 is just a camera move down; the opener and logo are separate `<Sequence>`s.

`assets/remotion/camera.ts` implements this: `cameraAt(keys, frame)` returns the pose, `cameraTransform(pose)` returns the CSS transform for the world container.

## Beat grid

```ts
export const FPS = 24;
export const BPM = 90;
export const BEAT = (FPS * 60) / BPM; // 16 frames
export const at = (beats: number) => Math.round(beats * BEAT);
```

Shotlist times are written in beats and converted with `at()`. Change BPM and the whole film re-times (camera keys included, if you write them with `at()`).

## Render and verify

Draft at `--scale=0.5` during the critique loop. Final:

```bash
npx remotion render Main out/final.mp4 --codec=h264 --crf=16
ffprobe -v error -show_entries stream=width,height,r_frame_rate,duration -of default=nw=1 out/final.mp4
```

16:9 only: the floating window on a stage is the style, and it doesn't survive a vertical reframe. If the user needs 9:16, say so and suggest product-demo-video instead.

Render at 24fps unless the brief says otherwise. If the brief demands 30fps, keep BPM 90 (BEAT becomes 20 frames) and scale every frame count in the motion library by 1.25.
