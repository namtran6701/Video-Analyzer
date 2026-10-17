# Motion Library

Reusable moves for this style. Build each once in `src/motion/`, only if the shotlist uses it.

All timing is in seconds (`const t = frame / fps`), positioned on the beat grid with `bt()`. Springs and `track` / `indicator` / `swapAlpha` come from `src/lib/motion.ts` (motion-studio). GSAP only inside `useGsapTimeline` from `@remotion/gsap`, plugins registered once at module level. No `interpolate` easings for physical motion, no `Math.random`, no CSS transitions.

| # | Move | Lane | Built with |
|---|---|---|---|
| M1 | Word-by-word blur rise | 2D | GSAP SplitText |
| M2 | Karaoke lighting (dim → bright per word) | 2D | GSAP SplitText |
| M3 | Inline icon in sentence | 2D | lucide-react inside the split line |
| M4 | Element morph (bar → pill → headline) | 2D | `track` + `swapAlpha` |
| M5 | Icon row pop-in + pop-out | 2D | `spring('stagger')` |
| M6 | Motion-blur stack (echo trail) | 2D | `track` sampled at past times |
| M7 | Throw into trash | 2D | closed-form arc + `CameraMotionBlur` |
| M8 | Logo reveal on light shafts | Blender plate + 2D | plate sequence, wordmark in GSAP |
| M9 | Progress thread (line + glowing dot) | 2D | DrawSVG + `track` |
| M10 | Typing prompt + cursor | 2D | char count from t, cursor on `track` |
| M11 | Agent step list with expand/collapse | 2D | `track` for height and scroll |
| M12 | Branching sub-agents | 2D | DrawSVG |
| M13 | Benchmark bar race | 2D | `spring('heavy')` + `track` camera |
| M14 | Vertical slot list | 2D | `track` per beat |
| M15 | Scramble/decode text | 2D | Remotion `random(seed)` |
| M16 | Password toggle (visible → masked) | 2D | per-char timing + `swapAlpha` |
| M17 | Laptop prop open/close | R3F | `<ThreeCanvas>`, HDRI, `spring('heavy')` |
| M18 | Words fall away to leave URL | 2D | GSAP SplitText + `track` |

## Specs

### M1 Word-by-word blur rise
- `SplitText(el, { type: 'words' })`, then `timeline.from(words, { opacity: 0, y: '0.3em', filter: 'blur(8px)', duration: 0.33, ease: 'power3.out', stagger: bt(0.25) }, bt(startBeat))`.
- Words land on half-beats. For lines where each word should hit a beat, use `stagger: bt(1)`.

### M2 Karaoke lighting
- Line renders whole in `darkDim`. `timeline.to(words, { color: darkText, duration: 0.15, stagger: bt(1) }, bt(startBeat))`, one word per beat.
- Optional: the keyword ends in `accent`.

### M3 Inline icon
- Lucide icon as an inline element inside the split line at `height: 0.8em`, `vertical-align: -0.1em`, `stroke="currentColor"`, `strokeWidth` ≈1.75 at weight 500. Give it the word class so SplitText animates it like a word.
- Icons: globe, key-round, history, lock, hard-drive, log-in, presentation.

### M4 Element morph
- One container. Width, height and radius each run `track(t, [[t0, from], [t1, to], ...], 'default')`, so a bar → pill → headline chain is continuous, never restarting a spring.
- Content inside: each state's text gets `opacity: swapAlpha(t, tIn, tOut)` so the new text enters after the morph starts and the old one leaves before it. Never crossfade at the midpoint (that's where text overlaps).

### M5 Icon row pop
- Scale 0.6 → 1 with `spring(t - i * 0.1, 'stagger')`. Exit: `track` back to 0.6 with opacity, 0.2s, staggered the same way.
- App icons: squircle, 22% radius, subtle inner highlight, shadow `0 8px 24px rgba(0,0,0,.35)` scaled by `layout().u`.

### M6 Motion-blur stack
- A deliberate stylized trail, not real blur. Render 4 to 6 echoes of the element, each placed at its own `track` position sampled at `t - k * 0.03` (k = 1..5), opacity 0.6 → 0.15, `blur(6px)` → `blur(12px)` on the trailing echoes. Because echoes follow the real path, the trail bends with the move.
- Hold the stacked state 0.2 to 0.33s.

### M7 Throw into trash
- Closed-form arc: `x` linear in t, `y = y0 + vy*t + 0.5*g*t*t`, rotate 0 → 25deg, scale 1 → 0.3. Wrap only the flying element in `<CameraMotionBlur samples={6} shutterAngle={180}>`.
- Trash lid bumps to 1.08 with `spring(t - tImpact, 'snappy')` and settles back. SFX `thump` at impact.

### M8 Logo reveal on light shafts
- Blender plate per motion-studio's plate rules: own scene, vertical emissive planes with noise-driven intensity, volumetric fog, static camera, 2 to 3s, EEVEE, AgX, motion blur on, color graded to the reveal gradient. Keyframe the intensity peak on the reveal downbeat (`round(bt(beat) * fps)` from the plate start). Output `public/plates/reveal/####.png`.
- In Remotion: `<Img>` sequence inside `<Sequence from={at(revealBeat)}>`, light seeded grain over the plate only (it bands at 8-bit). Fallback without Blender: see `toolchain.md`.
- Wordmark (2D, over the plate): `blur(20px)` → 0 and letter-spacing 0.1em → -0.01em over 0.66s, GSAP `power3.out`, landing on the downbeat.
- Exit: wash to white over 0.5s into the light Positioning act (this is a cut point, so the wash ends exactly on the next act's downbeat).

### M9 Progress thread
- 1px line (scaled) in `lightLine`, the trailing 30% gradients into `accent`. Draw it on with DrawSVG as the demo starts.
- Dot: 12px `accent`, white 3px ring, glow `0 4px 12px` of `accent` at 40%. Position = `track(t, [[bt(b0), 0], [bt(b1), 0.25], ...], 'default')` along the path, one key per demo step, so it eases to each milestone instead of crawling linearly.
- The line continues across screens so internal demo changes don't feel like cuts.

### M10 Typing prompt
- Visible chars = `Math.floor((t - tStart) * rate)`, rate 60 chars/s for long prompts, 30 for short. Caret blinks on beats: visible when `Math.floor(t / bt(1)) % 2 === 0` while idle.
- Cursor enters first on a `track` path (`'default'`), then the click (M-cursor below).

### M11 Agent steps
- Each step: icon + UI-size text, enters with `spring(t - bt(beat), 'snappy')` on its beat.
- Expandable section: header height `track` from 16 to 40 (×`u`) for the zoom-in emphasis, list items stagger in with `'stagger'`, then `track` back to collapsed.
- Camera follows by translating the container with `track` (scroll keys on the beats where content grows), never by moving each item.

### M12 Branching sub-agents
- Tree lines draw with DrawSVG (`drawSVG: '0%'` → `'100%'`, 0.4s, `power2.out`), branch labels pop with `spring('snappy')`. Parallel branches start 0.1s apart.

### M13 Benchmark bars
- Bar width = `target * spring(t - tStart - i * 0.13, 'heavy')`. Numbers count up from the same spring value, rounded for display. Hero bar `accentGlow` with outer glow, others `#3a3a3a`.
- Camera: `track` on scale and x from tight on the hero bar to the full chart, `'heavy'`, starting one beat after the hero bar lands.

### M14 Vertical slot list
- Fixed prefix ("can do") on the left. The column's offset is `track(t, keys, 'snappy')` with one key per beat, each moving one row.
- Per row, distance `d` from the active slot: opacity `1 - 0.8 * min(d, 1)`, blur `4 * d` px, active row white.

### M15 Scramble/decode text
- Don't use GSAP ScrambleTextPlugin: it calls `Math.random` and breaks the determinism check.
- Char `i` locks at `tLock = tStart + i * 0.066`. Before that, show `GLYPHS[Math.floor(random(`scr-${i}-${frame}`) * GLYPHS.length)]` using Remotion's `random`. Same frame, same glyph, every render.

### M16 Password toggle
- Cursor clicks the eye icon (M-cursor). From the click, char `i` swaps to `•` at `tClick + i / fps` (one frame each), left to right. Icon swap eye → eye-off via `swapAlpha`.

### M17 Laptop prop (R3F)
- `<ThreeCanvas width={width} height={height} gl={{ toneMapping: THREE.AgXToneMapping }}>` with drei `<Environment files={staticFile('<studio_small slug>_1k.hdr')} />` (fetched through `polyhaven.mjs`).
- Procedural laptop: two drei `RoundedBox`es (base, lid) in `meshPhysicalMaterial` (aluminium: metalness 1, roughness 0.3, light clearcoat), the lid's inner face a plane textured with the product screen from `public/brand/`. A user-supplied glTF beats this if they have one.
- Lid close: hinge rotation `track(t, [[t0, open], [t1, closed]], 'heavy')`, screen emissive dims with the same value. Animate only from frame-derived props, never `useFrame`.
- Fallback if 3D isn't wanted: flat front-on PNG mock, screen as a layer, lid close = `scaleY` toward the hinge + darken.

### M18 Words fall away
- SplitText words except the URL: `timeline.to(others, { color: darkDim, y: '0.5em', filter: 'blur(6px)', opacity: 0, duration: 0.4, ease: 'power2.in', stagger: 0.05 }, bt(beat))`.
- URL x and scale on `track(..., 'title')` to center, landing on the next downbeat.

## Cursor

- Oversized macOS-style hand / arrow, black fill, white outline, `48 * u` px. Position on `track` with `'default'` (keys per target, so paths ease and settle), never linear.
- Click: scale `1 - 0.1 * pulse` where pulse is a 0.1s up/down from the click time, plus SFX `click`.
