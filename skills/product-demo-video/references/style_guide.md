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
- Size: hero lines ~**3.5 to 4% of frame height** (≈40px at 1080p for multi-word lines, up to ~110px for the logo wordmark). UI text ~13 to 16px, shown at real scale.
- Tracking: slightly negative on headlines (≈ -1%).
- Case: sentence case always. No all-caps.
- Layout: centered, 1 to 3 short lines, ragged. Max ~5 words per line.
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

- Clean, no grain, no vignette.
- **Directional motion blur** on fast moves (stacked "Connect App" copies, flying chips). Blur trails, not a filter on the whole frame.
- Soft drop shadows on light UI cards (large radius, ~6% opacity).
- Glow only on the accent bar and the progress dot.

## Text in / out

- In: word-by-word. Each word fades from 0 → 1, rises ~12px, de-blurs from ~8px → 0. Stagger 3 to 5 frames.
- "Lighting": the line appears dim (`--dark-dim`) then words brighten left to right, like karaoke.
- Out: words drop to dim and slide/blur away, or the next line pushes them.
- Letter-level effects used rarely: per-letter wobble ("button**s**" letters falling), scramble text ("enc9,:GRP" → "encrypted").
- Easing: ease-out cubic for entries, ease-in for exits. Springs (low bounce) for icons and pills.

## Audio

- Music: modern electronic/pop instrumental, **~114 to 118 BPM** (dominant onset interval 0.50 to 0.55s).
- Energy curve (RMS per 5s): quiet intro 0 to 10s, builds 10 to 20s, full from the reveal (~20s) to the end, small dips at act changes.
- No voiceover. Text carries the story.
- SFX: soft UI ticks on word lands and clicks, whooshes on morphs, a riser into the reveal.
- Sync: every word land and every hard cut sits on a beat.

## Do / Don't

1. **Do** alternate dark and light acts. Problem is dark, solution is light.
2. **Do** put an icon inside the sentence instead of next to it.
3. **Do** land every word on the beat grid. Off-beat text kills the feel.
4. **Do** show the real product UI at real scale in the demo, with a cursor.
5. **Do** keep one accent color and use it for maybe 5% of pixels.
6. **Don't** cut inside an act. Morph or push instead.
7. **Don't** use more than ~5 words on screen at a time outside the demo.
8. **Don't** add grain, gradients on backgrounds, or 3D unless it's the reveal.
