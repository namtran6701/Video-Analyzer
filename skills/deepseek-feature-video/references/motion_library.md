# Motion library

22 moves, D01-D22. Frames at 30fps; beats at 150 BPM (1 beat = 12 frames). Each ID has a look frame at `assets/look/<ID>-*.jpg`: match it. Implementation follows motion-studio's Motion and 2D-lane rules. Easing per the style guide: camera and push-throughs use `Easing.inOut(Easing.cubic)`; cursor, presses, menus, pops and the dot-to-pill use `motion.ts` springs (`snappy`); multi-target values use `track()`.

## Open and close

**D01 Smoke logo open** (0-6s, ~180f)
Black with 3-5 faint horizontal glitch lines (1px, 8% white, 0-20f). Logo mark (~36px tall) fades in at center (15-30f). Navy `smoke` gradient blooms in behind it over 40f and keeps drifting (animated noise or a slow-moving SVG blur blob). Wordmark + product pill build to the right of the mark, letters appearing left to right, 2f stagger (~75-90f). Hold 30f. Then letters vanish in random order over 15f while the smoke cuts to black (D22 in reverse).

**D02 Caret glow bar** (on black, ~30f)
A white block caret (12x34px, glow `0 0 18px 4px #fff`) appears center-left. It stretches into a 300x34px glowing bar over 6f, shrinks back to a 3px caret over 6f, then types the line (D03). Used for "Introducing" and the closing tagline.

**D21 Tagline glow wipe** (on black, ~20f)
After the tagline holds 30f, the caret becomes a glowing block that eats the text backward at ~3 chars/frame, then the block fades in 6f. Black holds 20-30f.

**D22 Logo scatter** (on `stage`, ~90f)
Cut to white with the full lockup (mark + wordmark + pill, ~570px wide) centered. Hold 30f. Wordmark letters (GSAP `SplitText`) vanish in a `random(seed)` order over 15f, leaving the mark, which slides to center over 10f. Hold 30f. Cut to black for the final 10-15f.

## Cards

**D03 Typewriter card**
Statement tier (68px) on `stage`. Left-anchored at the centered final x (measure the full line, start at `(1920 - width) / 2`). 0.6 chars per frame, blinking caret. Card lives 40-60f in total.

**D14 Lead-in + punch card**
Lead-in (44px, `inkDim`) fades up 8px over 8f, then the punch line (110-120px) types below it. If the punch is one word, it types in `ink` and accent-flips 12f later (see style guide).

**D15 Slot roll**
The accent phrase enters from 40px below with a ghost copy trailing 1 line-height under it at 40% opacity; both ease up over 8f (GSAP `power3.out`) and the ghost clips away. Used for the ladder rungs ("Or A **Sandbox Game?**").

**D18 Wave letters**
GSAP `SplitText` into chars inside `useGsapTimeline`. Each letter starts 30px down, rotated ±8°, at 0 opacity, on a sine offset (amplitude 20px, one period across the word). 1f stagger, 15f settle, `power3.out`. Use for the final 1-2 punch words only.

**D19 Blur-scale punch**
After the card holds, scale 1 → 1.25 over 8f (ease-in) with the text layer inside `<CameraMotionBlur samples={6} shutterAngle={180}>`. 2 white frames, cut.

## Hero demo (no hard cuts)

**D04 Word stack**
Product name on `stageSoft` at statement size. Hold 20f. On one frame apply a ripple (SVG `feTurbulence` + `feDisplacementMap`, scale 12). Next frame: 9-10 copies stacked at 1.0 line-height filling the frame top to bottom, `stackInk`; the bottom 3 copies use `accentSoft` with a sine warp that animates.

**D05 Stack scroll reveal** (~45f)
The stack scrolls up while the app window rises from below the frame (window at 70% frame width, centered), both eased over 45f. The window lands with its composer at frame center.

**D06 Tilted UI close-up**
The camera pushes from the window wide to a 2.5x close-up on the composer while rotating into `rotateX 10°, rotateZ -6°` over 15f. Holds with a 1-2% drift.

**D07 Cursor dropdown**
Cursor travels to a control (bezier path, 12-15f), click (3f press), dropdown opens (scale 0.96 → 1, opacity, 6f), hover moves down the items (8f each), click the target, menu closes, the control label updates.

**D08 Push-through**
Card → UI. Card text scales 1 → 2.2x and fades to 15% over 12f (ease-in), inside `<CameraMotionBlur samples={6} shutterAngle={180}>`. 3-4 white frames. The next UI element fades in from scale 0.92 over 10f.

**D09 Send close-up**
Prompt types in the composer (0.6 chars/frame). When it ends, the camera swings to a 3.5x close-up on the send button (`rotateZ -8°`) over 12f. Cursor enters, clicks; the button swaps to a stop icon on the click frame.

**D10 Dot to pill**
All UI except the button fades out over 6f while the camera eases back to flat. The button becomes a 24px accent dot at frame center (8f). The dot stretches into a 400x20px pill (`accentSoft` fill at 40%) over 8f, a label fades in ("Analyzing the request"), then the pill fill fades and the label becomes the first log line.

**D11 Agent log**
The agent's steps as rows: a small grey status icon plus a 13px grey label ("Read files, ran commands, called tools"), then a 14px ink sentence under it. New rows appear every 12-18f and the column scrolls up to keep the newest row at center. Flat camera, slow 2% push. 2-4s.

**D12 Result state flip**
Pull back to show the finished result inside the app (a plugin panel, widget, page). Something in it changes on the beat: a counter ticks, a state flips (timer → "Clocked out / Great work today."), data fills in. Hold until the flip has read for 20f.

**D13 Window on smoke**
The full app window floats on animated navy `smoke`, ~80% frame width, `rotateY 8°`, soft shadow. Camera pushes 4% over the shot. Use for "the plugin now lives in your app" moments and every escalation result.

## Escalation and montage

**D16 UI orbit cloud**
The punch word (e.g. "Everything") center. 12-16 mini UI cards (120-200px, real crops of the product) sit on an ellipse around it, each with its own small 3D tilt. They scale in from the word over 12f with 1f stagger, then drift along the ellipse ~10°/s.

**D17 Scene corners**
The punch word ("Everywhere") center, with 4 flat-color illustrated scenes (home, studio, cafe, outdoors) at the corners, each a small card that floats ±6px. They pop in (scale 0.9 → 1, 8f, 2f stagger).

**D20 Montage clip**
A real screen recording of a built thing, inside the app window (D13 framing or full-frame), 15-60f, hard cut in and out on the beat. Mix light and dark UI. Each clip shows one action (cursor click, a 3D scene rotating, a chart filling).

## Which move where

| Act | Moves |
|---|---|
| Open | D01, D02, D03 |
| Name reveal | D03, D04, D05, D06 |
| Hero demo | D07, D03, D08, D09, D10, D11, D12, D03, D07, D13, D12 |
| Escalation | D14, D13 or D20, D15, D13 or D20, D15, D20 |
| Payoff | D14, D20, D03, D16, D20, D17, D20, D18, D19 |
| Close | D02, D03, D21, D22 |
