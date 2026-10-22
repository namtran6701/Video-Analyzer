# Toolchain

Everything here is 2D, so **Remotion is the whole pipeline**, all in motion-studio's 2D lane. No Blender, no R3F, no screen recordings. Production basics (setup, determinism rules, score, SFX, critique loop, delivery) follow the **`motion-studio`** skill; this file adds what's specific to this style.

## Setup

Per motion-studio: Node 22+, ffmpeg, `npx create-video@latest` (blank), `npx skills add remotion-dev/skills`, then `npm i -E @remotion/media` (versions pinned to the project's Remotion). Copy motion-studio's `scripts/motion.ts` → `src/lib/motion.ts`, and this skill's `tokens.ts` and `line.ts` → `src/`. GSAP isn't needed: word builds are plain opacity per word and the line is a dashed SVG stroke.

## Who does what

| Need | Tool | Why |
|---|---|---|
| Stage, phone rig, layouts, claims, line, confetti, timeline | **Remotion** | Frame-exact React, `interpolate`/`Easing`, `<Sequence>` maps 1:1 to the shotlist, renders H.264 directly |
| Bubbles, chips, cards, banners, typing dots, live edit | **React components** | Every element animates on its own; a screenshot crossfade can't do arrivals, count-ups or typing |
| What those components must look like | **The app's real UI** (screenshots or Figma exports from the user, or Playwright if the app runs locally and the user agrees) | Reference to match, not to animate. Never redraw the UI from memory |
| Music + SFX | **`motion-studio` skill**, or a licensed ~120 BPM track | Synthesized bed locked to the beat grid |
| Final checks | **ffprobe** | Duration, resolution, fps |

## UI kit (step 5)

Collect at 3x into `public/ui/`: the chat screen at rest, an agent and a user bubble, a reaction, one result card, a draft card if the app has one, the notification banner. Into `public/brand/`: app icon, mark (SVG), UI font files, claim serif files. From these, write down the real values the components need: bubble radius and padding, font sizes and weights, secondary text gray, icon set. If the app has no designed UI yet, say so and agree on a minimal chat kit with the user before building.

Emoji in reaction chips: Chrome on macOS renders Apple Color Emoji; a Linux render host needs Noto Color Emoji installed, or use the app's own icon set. Check one still before building the rest.

## Phone rig

- Build the screen at its native size, 390 x 844 CSS px, and scale it by `UI_SCALE` (~2.15) inside an 18px bezel, so every UI value from the kit is used as-is in points.
- `<Phone pose={{ x, y, s }}>`: `x, y` = the phone's top-left in frame px, `s` = scale relative to rest (1, `phone.close`, `phone.liveEdit`). Rest pose: `x = (1920 - 874) / 2`, `y = 69`. Split poses put the inner bezel at `phone.splitRightInner` / `phone.splitLeftInner`.
- The thread is laid out top-down once per act; scrolling is a `translateY` on the thread driven by `track()`. Messages render from the act's script with their arrival frames, so a docked or lifted bubble is the same element in the same position.
- Poses change only through `track()` keys (`default`) or the whip easings in `tokens.ts`, never by restarting a spring.

## Vertical motion blur

Every blur in this style is vertical, so a one-axis SVG blur is enough and much cheaper than `CameraMotionBlur`:

```tsx
// sigma from the layer's own speed: (y(frame) - y(frame - 1)) * 0.35, capped at motion.maxBlur
<svg width={0} height={0} style={{ position: "absolute" }}>
  <filter id={`vblur-${id}`} x="0" y="-20%" width="100%" height="140%">
    <feGaussianBlur stdDeviation={`0 ${sigma}`} />
  </filter>
</svg>
<div style={{ filter: sigma > 0.5 ? `url(#vblur-${id})` : undefined }}>{phone}</div>
```

Compute the speed from the same pose function at `frame - 1`, not from stored state, so any frame renders the same.

## Confetti

Closed-form, so it's deterministic and seekable: for piece `i`, draw `vx, vy, spin, color, delay` once from `random(\`confetti-${i}-...\`)`; then at time `t` after the burst, `x = x0 + vx t`, `y = y0 + vy t + 0.5 g t²`, `rotate = spin t`, and fade out over the last 6 frames. A little drag: multiply `t` by `1 - 0.25 t / T` for the x term. No physics state between frames.

## Project layout

The project root is the Remotion project; everything loaded with `staticFile` lives in `public/`.

```
<project>/
  brief.md
  docs/style_guide.md         # mapped from references/style_guide.md
  docs/shotlist.md            # from assets/templates/shotlist.md
  docs/score.json  docs/sfx.json  docs/review_log.md
  beats.json                  # motion-studio beats.py --bpm 120
  public/
    ui/                       # the app's real UI, reference only
    brand/                    # icon, mark (SVG), fonts
    score.wav  mix.wav        # or the user's track
  src/
    tokens.ts                 # palette, type, geometry, beat grid, word helpers
    line.ts                   # travelling line
    lib/motion.ts             # from motion-studio
    stage/                    # Stage, Phone (rig + pose), VBlur
    ui/                       # Banner, Bubble, Reaction, TypingDots, ResultCard, DraftCard, Thread
    type/                     # Claim (word build/exit), Pill, ChipClaim, Lockup, Url
    fx/                       # Line, Veil, Confetti
    acts/                     # Ping, Title, ShowItWorking, Claims, ReportsBack, Control, Payoff, Close
    Root.tsx                  # one <Composition>, <Sequence> per act, <Audio src={staticFile('mix.wav')} />
  out/
```

## Beat grid

```ts
export const FPS = 24;
export const BPM = 120;
export const BEAT = (FPS * 60) / BPM; // 12 frames
export const at = (beats: number) => Math.round(beats * BEAT);
```

Shotlist times are written in beats and converted with `at()`. Change BPM and the whole film re-times if every key is written with `at()`.

## Render and verify

Draft at `--scale=0.5` during the critique loop. Final:

```bash
npx remotion render Main out/final.mp4 --codec=h264 --crf=16
ffprobe -v error -show_entries stream=width,height,r_frame_rate,duration -of default=nw=1 out/final.mp4
```

16:9 only: the split layouts need the width, and an oversized phone in a vertical frame is just a screen recording. If the user needs 9:16, say so before building.

Render at 24fps unless the brief says otherwise. If the brief demands 30fps, keep BPM 120 (BEAT becomes 15 frames) and scale every frame count in the motion library by 1.25.
