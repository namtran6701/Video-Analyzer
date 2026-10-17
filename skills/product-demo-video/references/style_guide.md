# Style Guide

Default values for this style. When the user supplies brand colors and fonts, swap them in by role and keep everything else.

## Palette

| Token | Hex | Role |
|---|---|---|
| `--dark-bg` | `#262626` | Dark act background (flat, no gradient) |
| `--dark-surface` | `#31373c` / `#292d30` | Pills, input boxes, dock on dark |
| `--dark-text` | `#f5f5f5` to `#ffffff` | Primary text on dark |
| `--dark-dim` | `#787f81` | Words not yet "lit", exiting words |
| `--light-bg` | `#ffffff` | Light act background (pure white) |
| `--light-text` | `#141414` | Primary text on light |
| `--light-dim` | `#a8aaab` / `#bdbfc0` | Secondary UI text, ghosted words |
| `--light-line` | `#e7e8e9` | Hairlines, card borders |
| `--accent` | `#0d8cc6` | Progress dot, highlighted words (sparingly) |
| `--accent-glow` | `#36c8ed` / `#34b6ea` | Hero bar in charts, glows on dark |
| Reveal gradient | `#061019` → `#183754` → `#3b7592` → `#69a4b8` → `#8fbcca` | Logo reveal only. Vertical light shafts, bottom-dark to top-light |

Rule: **two neutrals + one blue**. Third-party brand colors appear only inside their own logos.

## Type

- Family: neo-grotesk with tight apertures. Closest free options: **Inter Display**, **Geist**, **Neue Montreal**. Use the brand font when given.
- Weight: Medium (500) for headlines, Regular (400) for UI.
- Size: hero lines ~**3.9% of the short side** at 16:9 (≈42px at 1080p, up to ~110px for the logo wordmark), larger in square and vertical (see `layout()` in `tokens.ts`). UI text ~13 to 16px × `u`, shown at real scale.
- Tracking: slightly negative on headlines (≈ -1%).
- Case: sentence case always. No all-caps.
- Layout: centered, 1 to 3 short lines, ragged. Max ~5 words per line (4 in 1:1, 3 in 9:16).
- **Inline icons**: line icons (globe, key, clock, lock, drive) sit in the text baseline at cap height, same color as text. This is the signature move.

## Shot lengths

- Hard cuts only at light/dark mode flips (about 6 in a 90s film).
- "Beats" (a new word/prop lands): every **0.5s** on the grid, bigger ideas every 1.5 to 2.5s.
- Average text card dwell: ~2s. Demo screens dwell 3 to 5s.

## Transitions

| Type | Where | Duration |
|---|---|---|
| Morph (element becomes next element) | Search bar → headline pill, dock icon → logo | 12 to 18 frames |
| Word push (old word slides/blurs out while next slides in) | All headlines | 8 to 12 frames per word |
| Hard cut | Light ↔ dark flips only | 0 frames |
| White wash / blue wash | Reveal | ~20 frames |
| Vertical scroll follow | Demo act | continuous |

## Camera

- Mostly locked. Motion comes from elements, not camera.
- Demo act: slow vertical drift following the agent output (≈ 40 to 80 px/s), plus gentle push-in (scale 1.0 → 1.08) on moments that matter.
- Snap zooms onto UI details (a button, a source card) with ease-out, 10 to 15 frames.
- No shake, no handheld.

## Texture

- Clean, no grain, no vignette. One exception: light seeded grain over the reveal plate only, to hide 8-bit banding.
- **Directional motion blur** on fast moves: the stylized echo trail (M6) for stacked props, `CameraMotionBlur` on flying elements (M7, chips). Never on type or the whole frame.
- Soft drop shadows on light UI cards (large radius, ~6% opacity).
- Glow only on the accent bar and the progress dot.

## Text in / out

- In: word-by-word. Each word fades from 0 → 1, rises ~12px, de-blurs from ~8px → 0. Stagger 3 to 5 frames.
- "Lighting": the line appears dim (`--dark-dim`) then words brighten left to right, like karaoke.
- Out: words drop to dim and slide/blur away, or the next line pushes them.
- Letter-level effects used rarely: per-letter wobble ("button**s**" letters falling), scramble text ("enc9,:GRP" → "encrypted").
- Easing: GSAP `power3.out` for type entries, `power2.in` for exits. `motion.ts` springs for everything physical: `snappy` UI, `default` pills/cards/camera, `stagger` icon rows, `heavy` logo, bars and the laptop. No overshoot on type, never bouncy or elastic.

## Audio

Synthesized with motion-studio's `score.mjs` unless the user supplies a track.

- Tempo: **112 to 120 BPM**, 116 if nothing else decides it. Each film gets its own BPM, key and seed (never reuse a seed across films).
- Palette: `glass` for SaaS / AI products (default), `analog` for a bolder consumer launch, `tech` for dev tools and infra. `minor` scale (the story is problem-led).
- Energy per act (0 to 3, one value per bar in `score.json`). Acts start on downbeats, so every step lands on a cut:

| Act | Energy | Effect |
|---|---|---|
| Hook, Problem first half | 1 | pad only, tension |
| Problem second half | 2 | the build |
| Reveal → Positioning | 3 | step into 3 = automatic riser over the previous bar + impact on the reveal downbeat |
| Demo | 2 | room for UI clicks and ticks |
| Proof, Capabilities | 3 | impact on the dark flip |
| Trust | 2 | |
| Bonus | 3 | impact on the flip |
| CTA | 1, then 0 under the URL hold | |

- SFX via `sfx.mjs` with the score's seed and key. Cues: `click` on cursor clicks, `swish` on morphs (M4, M18), `pop` on icon rows (M5), `thump` on trash impact (M7), `tick` on agent steps and slot moves (sparingly, not every row), `glitch` on scramble lock (M15), `chime` when the progress dot hits 100% and on the URL land. No SFX on word lands. No riser or impact cues where the score already steps up.
- Mix: score + SFX → `public/mix.wav` at -14 LUFS, true peak under -1 (motion-studio's ffmpeg line).
- No voiceover. Text carries the story, so the film must read fully with sound off.
- Sync: every word land and every hard cut sits on a beat.

## Do / Don't

1. **Do** alternate dark and light acts. Problem is dark, solution is light.
2. **Do** put an icon inside the sentence instead of next to it.
3. **Do** land every word on the beat grid. Off-beat text kills the feel.
4. **Do** show the real product UI at real scale in the demo, with a cursor.
5. **Do** keep one accent color and use it for maybe 5% of pixels.
6. **Don't** cut inside an act. Morph or push instead.
7. **Don't** use more than ~5 words on screen at a time outside the demo.
8. **Don't** add grain, gradients on backgrounds, or 3D outside the reveal plate and the trust laptop.
