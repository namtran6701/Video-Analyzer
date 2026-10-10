# Motion Library

Reusable moves for this style. Each one is a component to build once and reuse.
Tool column: **R** = Remotion, **H** = HyperFrames, **B** = Blender.

| # | Move | Tool |
|---|---|---|
| M1 | Word-by-word blur rise | R / H |
| M2 | Karaoke lighting (dim → bright per word) | R / H |
| M3 | Inline icon in sentence | R / H |
| M4 | Element morph (bar → pill → headline) | R |
| M5 | Icon row pop-in + pop-out | R / H |
| M6 | Motion-blur stack (duplicated element trail) | R |
| M7 | Throw into trash (physics-ish arc) | R |
| M8 | Logo reveal on light shafts | B (or R with shader) |
| M9 | Progress thread (line + glowing dot) | R / H |
| M10 | Typing prompt + cursor | R / H |
| M11 | Agent step list with expand/collapse | R |
| M12 | Branching sub-agents | R |
| M13 | Benchmark bar race | R / H |
| M14 | Vertical slot list | R / H |
| M15 | Scramble/decode text | R / H |
| M16 | Password toggle (visible → masked) | R / H |
| M17 | Laptop prop open/close | B (render PNG seq) or R with images |
| M18 | Words fall away to leave URL | R / H |

## Specs

### M1 Word-by-word blur rise
- Per word: opacity 0→1, translateY 12px→0, blur 8px→0.
- 10 frames per word, stagger 4 frames, ease-out cubic.
- Remotion: `interpolate(frame - i*4, [0,10], [0,1], {extrapolateLeft:'clamp', extrapolateRight:'clamp', easing: Easing.out(Easing.cubic)})`.

### M2 Karaoke lighting
- Line renders whole in `--dark-dim`. Each word tweens color to `--dark-text` on its beat.
- Optional: one keyword ends in `--accent`.

### M3 Inline icon
- Icon is an inline SVG at `height: 0.8em`, `vertical-align: -0.1em`, stroke = currentColor, stroke-width matched to type weight (≈1.75 at 500 weight).
- Enters with M1 like a word. Use Lucide icons (globe, key-round, history, lock, hard-drive, log-in, presentation).

### M4 Element morph
- Animate width, height, border-radius and content crossfade on one container. Text inside crossfades at the midpoint.
- 15 frames, spring({damping: 200}).

### M5 Icon row pop
- Scale 0.6→1 with spring (damping 12, mass 0.6), stagger 3 frames. Exit is reverse with ease-in, 6 frames.
- App icons: squircle, 22% radius, subtle inner highlight, drop shadow 0 8px 24px rgba(0,0,0,.35).

### M6 Motion-blur stack
- Render 4 to 6 copies of the element offset along the motion vector, opacity 0.15 to 0.6, plus CSS blur 6 to 12px on the trailing copies. Hold 6 to 10 frames.

### M7 Throw into trash
- Parabolic arc: x linear, y = quadratic. Rotate 0→25deg, scale 1→0.3 on the way in. Trash lid bumps (scale 1.08) on impact, SFX tick.

### M8 Logo reveal on light shafts
- Blender: vertical emissive planes with noise-driven intensity, volumetric fog, camera static, 2 to 3s. Render PNG sequence with alpha off, color graded to the reveal gradient.
- Lighter option: Remotion with a CSS `repeating-linear-gradient` of vertical stripes, animated `background-position`, plus big blur. Good enough at 1080p.
- Wordmark: blur 20px→0, letter-spacing 0.1em→-0.01em, over 20 frames.
- Exit: wash to white over 15 frames.

### M9 Progress thread
- 1px line in `--light-line`, the trailing 30% gradients into `--accent`. Dot 12px `--accent` with white 3px ring and blue glow (0 4px 12px rgba(13,140,198,.4)).
- Dot position tied to "progress" through the demo act. Line continues across screens so cuts don't feel like cuts.

### M10 Typing prompt
- 2 chars/frame for long prompts, 1 char/frame for short. Caret blinks at 0.5s (on-beat). Real I-beam cursor moves in first.

### M11 Agent steps
- Each step: icon + 13px text, fades in on a beat. Expandable section: header grows from 16px to 40px (zoom-in emphasis), list items stagger in, then collapses back.
- Camera follows with translateY on the container (smooth scroll), not by moving each item.

### M12 Branching sub-agents
- Tree lines draw with `stroke-dashoffset` (12 frames), then each branch label pops in. Parallel branches start 3 frames apart.

### M13 Benchmark bars
- Bars grow from 0 width, staggered 4 frames, ease-out. Numbers count up with the bar. Hero bar = `--accent-glow` with outer glow, others `#3a3a3a`. Starts zoomed on hero bar, pulls out to reveal the chart.

### M14 Vertical slot list
- Fixed prefix ("can do") on the left. Right side is a column of items that scrolls up one row per beat. Active row white, others fade to 20% and blur with distance.

### M15 Scramble text
- Each char cycles random glyphs for N frames, then locks left-to-right. ~2 frames per char lock.

### M16 Password toggle
- Field shows plain text, cursor clicks eye icon, text swaps to `•••` per char left-to-right (1 frame each), icon swaps eye → eye-off.

### M17 Laptop prop
- Blender for a custom 3D laptop, or use a flat front-on PNG mock with the screen as a layer. Lid close = scaleY of screen layer toward the hinge + darken.

### M18 Words fall away
- All words except the URL go dim, translateY +20px, blur, staggered. URL slides to center.

## Cursor

- Oversized macOS-style hand / arrow, black fill, white outline, ~48px at 1080p. Moves with ease-in-out bezier paths, clicks = scale 0.9 for 3 frames + SFX.
