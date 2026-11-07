# Style guide

Measured from the reference (DeepSeek Harness "Creator Mode" launch, 99.3s, 1920x1080, 30fps, kept in `references/deepseek-harness/` at the repo root). Pixel values are at 1080p. The look frames in `assets/look/` are the visual target for each motion ID.

## The idea

Make a claim, then prove it. A one-line card on white names what the product does; the next shot shows the product doing it, driven by a visible cursor under a moving camera. The claims escalate (simple, advanced, absurd, everything) and the cuts speed up with them. Black bookends, white middle, one blue word per card. Music only.

## Palette

| Role | Hex | Where |
|---|---|---|
| `stage` | `#fefefe` | Every card and the hero demo. About 75% of runtime. |
| `stageSoft` | `#f0f0f0` | Word-stack scene only (D04-D05) |
| `ink` | `#131c2c` | Card text, typed prompt. Navy-black, never pure black. |
| `inkDim` | `#131c2c` at 60% | Lead-in lines ("What about something more", "Ultimately,") |
| `stackInk` | `#485b67` | Repeated lines in the word stack |
| `accent` | `#1d64db` | The payoff word on a card, send button, active badge. Nothing else. |
| `accentSoft` | `#8098ec` | Wave-distorted bottom lines of the word stack, slot-roll ghost |
| `night` | `#000000` | Open (after the smoke), "Introducing", tagline, last frame |
| `smoke` | `#1b2b41` → `#17273a` | Animated navy smoke behind the logo open and behind floated app windows (D01, D13) |
| `success` | the product's own green | Only inside real UI (a state flip like "Clocked out") |

Rules: accent appears once per card, on the last word or phrase. The UI keeps its own colors; don't recolor screenshots.

## Type

- Family: **Montserrat** (geometric sans; the reference's `g`, `P`, `C` match it). Alternatives: Gilroy, Satoshi, Inter if the brand bans Montserrat.
- Weight: 400 for statements, 300 for lead-ins. Never bold.
- Case: Title Case for statements ("Create Plugin, Instantly"). ALL CAPS only for the single biggest escalation word ("ADVANCED?").
- Sizes (cap-to-descender height measured, font size derived):

| Tier | Font size | Example |
|---|---|---|
| Lead-in | 44px, `inkDim` | "What about something more" |
| Statement | 68px | "Create Plugin, Instantly" (926px wide) |
| Punch | 110-120px | "ADVANCED?", "All At Once", "Everything" |
| Tagline on black | 34px, white | "Creator Mode, Create Your Own Harness" |

- Layout: one line, centered. A lead-in sits ~90px above the statement/punch line. Max two tiers per card.
- Typing anchor: text types **left-anchored at the x where the finished line will be centered**, so the line grows rightward and ends dead-center. Never re-center while typing.

## Rhythm

Scene detection found 23 hard cuts. Measured pattern:

| Stretch | Behavior |
|---|---|
| 0-6s | Logo open, one continuous move |
| 6-42s | Hero demo: ~37s with **no** hard cuts. All change happens through camera moves, push-throughs and in-UI animation. |
| 42-64s | Escalation ladder. Card (1.3-2.0s) then result (2.0-4.5s), repeated. |
| 64-90s | Montage. Cuts 0.5-2.0s, average ~1.5s. |
| 90-99s | Close on black, then logo on white. ~9s. |

Average cut after 42s: 2.7s. Speed up toward the end; never slow down until the close.

## Camera

- A virtual 3D camera over flat UI. Two modes:
  - **Tilted close-up** (D06, D09): `rotateX ≈ 10°`, `rotateZ ≈ -6° to -8°`, scale 2.5-3.5x, slow drift. Used on the composer, dropdowns and the send button.
  - **Flat wide** (D11, D12): UI at 1x, square to camera, while the result plays.
- Move between them with eased swings of 10-20 frames (`Easing.inOut(Easing.cubic)`, via `camera.ts`). No whip pans, no shake.
- **Easing rule** (this overrides motion-studio's "springs for camera"): the camera and push-throughs use the cubic ease above; the reference camera has no overshoot. Everything physical inside the UI uses motion-studio's `motion.ts` springs: `snappy` for the cursor path, button presses, dropdown open, dot-to-pill stretch and orbit-card pops; `default` for floating windows landing. No overshoot on type. Multi-target values use `track()`.
- Floated windows (D13) sit on animated navy smoke at ~80% frame width with ~8° Y tilt and a slow push (scale +4% over the shot).
- The frame is never static. Even holds drift 1-2%.

## Cursor

macOS arrow, black with white outline, ~32px at 1x. It drives every UI step: open dropdown, hover, select, click send, open the plugin in the sidebar. Clicks get a 3-frame press (scale 0.9) and the button reacts that frame.

## Transitions (in order of use)

1. **Hard cut** card ↔ result. Most common.
2. **Push-through** (D08) card → UI: the card text scales 1 → 2.2x and fades to ~15% over 12 frames, 3-4 white frames, then the UI fades in from scale 0.92.
3. **Dot collapse** (D10) send → agent log: everything except the send button fades in 6 frames, the button (now a stop icon) becomes a centered dot, the dot stretches into a 400px progress pill ("Analyzing the request"), the pill dissolves into the first log line.
4. **Word stack scroll** (D04-D05) name → app: the product name duplicates into a full-frame stack, scrolls up while the app window rises from below, then the camera tilts into the composer.
5. **Caret glow** on black (D02, D21): a glowing white block caret. In: it widens into a bar, then shrinks back to a caret that types the line. Out: it turns into a block that eats the text backward, then fades.
6. **Blur-scale punch** (D19): the last card word scales 1 → 1.25 with motion blur, 2 white frames, cut to black.

Real motion blur on D08 and D19 only: wrap that layer in motion-studio's `<CameraMotionBlur samples={6} shutterAngle={180}>` (`@remotion/motion-blur`). Never fake it with CSS `blur()` or ghost copies, and never wrap the whole frame (it multiplies render cost).

## Texture

Clean. No grain, no vignette. The smoke is drawn from `useCurrentFrame()` with Remotion's `random(seed)` only, never `Math.random` or CSS animation, so every render is identical. Soft shadows under floating UI: `0 30px 80px rgba(19,28,44,.14), 0 2px 8px rgba(19,28,44,.06)`. The only glow in the film is the caret glow on black (`box-shadow: 0 0 18px 4px #fff`). Smoke is the only gradient.

## Text in / out

| Move | Timing |
|---|---|
| Typewriter | ~18 chars/s (0.6 chars per frame at 30fps), blinking caret (15 frames on/off), caret disappears 10 frames after the line ends |
| Accent flip | Payoff word types in `ink`, holds 12-15 frames, then switches to `accent` in one frame. Used on the first two cards; later cards type the payoff already in accent. |
| Slot roll | Accent phrase rolls up from below with a ghost copy, 8 frames |
| Wave letters | Letters enter on a sine baseline, 1-frame stagger, settle in 15 frames ("Everywhere", "All At Once") |
| Out | Hard cut, push-through, or the blur-scale punch. Text never fades out on its own. |

## Audio

- Music only. Gemini transcription found no speech. No captions.
- Mastered loud (mean -17.9 dB, peaks 0 dB). Deliver at about -14 LUFS.
- Feel: bright, driving electronic. Measured with motion-studio's `beats.py` at **146.7 BPM** (drift 58ms, so the track isn't strictly gridded). Use **150 BPM** as the grid (beat = 12 frames, bar = 48 frames at 30fps). This is above motion-studio's 100-124 promo range on purpose: the style's fast typing and short cards need it.
- Score palette for `score.mjs` drafts and the Lyria prompt: `analog` (warm synth, four-on-floor) by default, `tech` for dev-tool products. Major key.
- Energy arc (the shotlist's per-bar Energy column, which drives `score.mjs` and the riser/impact cues):

| Act | Energy |
|---|---|
| Open, "Introducing" | 1 |
| Name stack → hero demo | 2 (step on the stack's downbeat) |
| Ladder from "ADVANCED?" → payoff | 3 (step on "ADVANCED?") |
| Tagline on black | 1 |
| Logo | 0 |
- Hits land on: each card's accent flip, the send click, the start of each escalation result, every montage cut. The hero demo rides the groove without hits except the click.
- SFX: soft key ticks under typing (−24 dB under the bed), one click on send, a whoosh on push-throughs. Nothing else.

## Do / don't

1. **Do** pair every claim card with proof on screen within 2s.
2. **Do** escalate: simplest use case first, then "What about something more ADVANCED?", then 2-3 ambitious builds, then "Everything / Everywhere / All At Once".
3. **Do** keep one blue word per card and one blue element per UI shot (the send button).
4. **Do** drive the hero demo with a cursor and camera, with no hard cuts for the first ~30s.
5. **Do** bookend with black + logo; the logo comes back on white for the very end.
6. **Don't** add voiceover, captions, callouts, arrows, highlight boxes or grain.
7. **Don't** use more than two type tiers on a card, bold weights, or pure black text.
8. **Don't** show a screenshot flat and still. Tilt it, push it, or have something move inside it.
