# Toolchain (style-specific additions)

Setup, fonts, determinism, the 2D lane, sound, critique loop and render all follow **motion-studio**. This file only adds what this style needs on top.

## Setup additions

- Project location and install follow the repo's CLAUDE.md (`projects/YYYY-MM-DD_promo_<slug>/`, workspace install from the root).
- Lanes: 2D only. Install motion-studio's 2D lane (`@remotion/gsap gsap`) plus `@remotion/media` (recordings, audio) and `@remotion/motion-blur` (D08, D19).
- Font: Montserrat as local files loaded per motion-studio (`@remotion/fonts` `loadFont` + `staticFile`), weights 300 and 400. Use the brand's font files instead if it has its own.
- Copy motion-studio's `motion.ts` and `camera.ts` into `src/lib/`, and this skill's `tokens.ts` into `src/` (it holds the `flat`/`tilted` poses).

## What's built how

| Need | How | Why |
|---|---|---|
| Cards, typing, caret glow, word stack, orbit, logo build | React in Remotion; per-letter moves (D15, D18, D22) with GSAP `SplitText` in `useGsapTimeline`, per motion-studio's 2D lane | Frame-exact, per-letter control |
| Hero demo UI (composer, dropdown, send button, log, result) | Rebuilt React components styled to match the 3x captures; static parts can be the screenshots | Stays sharp at 3.5x tilted close-ups; typing, cursor and state flips need to be live |
| Ladder results and montage | Screen recordings via `<Video>` from `@remotion/media` | They show real things moving. They play at 1x or D13 framing, never in a close-up, so recordings are fine here. |
| Smoke | 3-4 large blurred radial gradients on sine paths, offsets from `random(seed)` | Deterministic |
| "Everywhere" scenes | The user's illustrations, or generated via `genmedia-assets` (listed at motion-studio gate 5) | Flat pastel interiors |

Rule of thumb: anything the camera gets close to is React; anything shown at 1x that moves on its own is a recording.

## Capture specifics (gate 1)

- Hero-demo screens: viewport 1440x900 at device scale factor 3, into `public/ui/`. States to capture: empty composer, mode dropdown open, typed prompt, result before and after its state flip, the nav entry that opens the result.
- Recordings: 1920x1080 or larger, 30fps, H.264, into `public/clips/`, trimmed to one action each (1-5s). If the user can't record them, ask; never fake a recording with a still pan.

## Project layout additions

```
src/
  tokens.ts  lib/motion.ts  lib/camera.ts
  cards/   Typewriter, LeadPunch, SlotRoll, WaveLetters, BlurPunch, CaretGlow, GlowWipe
  stage/   Smoke, FloatWindow, UIPlane (perspective wrapper + cameraTransform)
  ui/      Cursor, Composer, Dropdown, SendButton, DotPill, AgentLog
  fx/      WordStack, OrbitCloud, SceneCorners, LogoBuild
  acts/    Open, Name, Hero, Ladder, Payoff, Close
public/ui/  public/clips/  public/scenes/  public/brand/
```

## Hero-demo camera

The hero demo is one `<Sequence>` with one key list for `cameraAt` (motion-studio's `camera.ts`, default `cubic` ease), so there are no hard cuts inside it. Lay the composer, log and result out on one UI plane inside a `perspective: 1800` wrapper. Push-throughs (D08) and the dot collapse (D10) are opacity/scale effects on that plane, not cuts. Write every key with `at()` so a BPM change re-times the camera too. No `will-change` on the plane (motion-studio: it blurs scaled text).
