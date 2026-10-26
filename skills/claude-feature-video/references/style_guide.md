# Style Guide

Default values for this style, measured from the reference film (60s, 1920x1080, 24fps). When the user supplies a brand accent, serif and logo, swap them in by role and keep everything else.

## Palette

| Token | Hex | Role |
|---|---|---|
| `stage` | `#fbf9f5` | Ivory. Background of everything after the opener: wide shots, close-ups, tagline, logo |
| `oat` | `#efeee5` | Opener card background only. The first cut into a window lands on oat, the first close-up switches to ivory for good |
| `ink` | `#0c0c0a` | Serif card text, wordmark |
| `inkDim` | `#70706d` | Panel step line ("Read document, rewrite ..."), secondary panel text |
| `bubble` | `#efedeb` | User prompt bubble in the panel (only if you draw the panel yourself) |
| `card` | `#ffffff` | Panel card, input box |
| `accent` | `#cc6c58` | Working spark, logo mark. The AI's color |
| `accentWipe` | `#e8a090` | Core of the transform wipe / bloom (accent at ~70% over white) |
| `accentGlow` | `#f4d0cc` | Panel glow where it meets the stage |
| Window shadow | `#dbd9d7` at the window's bottom edge → `stage` over ~70px | Soft, warm, offset downward |

Rules:
- **Warm neutrals only.** The stage is never pure white and never a cool gray. Screenshots supply all other color.
- **Accent = AI at work.** It never appears on idle UI, text cards or the cursor. Outside the wipe it covers well under 3% of the frame.
- Brand mapping: brand accent → `accent`; derive `accentWipe` by mixing it ~70% toward white and `accentGlow` ~35%.

## Type

- **Cards (opener, tagline):** editorial text serif with soft contrast. The reference looks like Tiempos / Copernicus. Free options: **Source Serif 4** (display optical size), **Newsreader**. Use the brand serif when given.
- Weight 400. No bold, no italics, no all-caps. Sentence case.
- Size **80px at 1080p** (7.4% of frame height, ascender-to-descender ink ≈ 79px). Line height 1.3 (104px baseline to baseline). Normal to very slightly tight tracking.
- Centered. Opener: 2 lines, max ~4 words each. Tagline: 1 line, 3 to 5 words.
- **Logo lockup:** mark + wordmark, ~557px wide (29% of frame width), wordmark cap height ~94px, mark ~116px tall, optically centered.
- **UI text:** whatever the product uses, at real scale. Close-ups make it readable (panel text lands around 40px on screen). Never add your own sans display type.

## Stage and window

- **Window at rest (wide):** 1418 x 900px (74% of frame width, 83% of height), centered, browser chrome included. Corner radius ~10px. Shadow: `0 28px 70px rgba(60,45,30,.16), 0 2px 8px rgba(0,0,0,.06)`.
- Browser chrome: light, generic (traffic lights, one tab, URL bar). The tab title and URL match the screen.
- **Close-ups:** 3x for panels and inputs, up to 4x for menus. Frame the subject center-right and keep a sliver of the window edge and stage visible on one side, so the viewer never forgets it's a floating window.
- **Windows live side by side** in one world (gap 160px) so the move between chapters is a real pan, not a cut.

## Timing and rhythm

Music is 90 BPM, which at 24fps is exactly **16 frames per beat**. Plan in beats; camera moves last about one beat.

| Section | Reference | Beats |
|---|---|---|
| Opener card | 0.0 to 4.5s | 7 |
| Chapter 1 | 4.5 to 18.9s | 22 |
| Chapter 2 | 18.9 to 34.3s | 23 |
| Chapter 3 | 34.3 to 50.6s | 24 |
| Tagline | 50.6 to 53.3s | 4 |
| Logo | 53.3 to 60.0s | 10 |

Shot dwell: wide establishing 1 to 3s, close-ups 2.5 to 8.5s (the more interaction, the longer), result holds 2 to 3.5s. Cuts and moves follow the UI action; they sit near beats but aren't slaved to them.

## Transitions and camera

| Type | Where | Duration |
|---|---|---|
| Push-through cut | Opener → first window. Card scales 1 → 1.04 over its last 3 frames, cut, window enters at 1.06 and settles to 1.0 | 3 + 8 frames |
| Punch-in | Wide → close-up of the entry point or panel input. Hard cut (or a 12-frame snap zoom, ease-in-out) | 0 to 12 frames |
| Pull-back reveal | Close-up → wide, right before or as the result lands | 8 to 14 frames, ease-in-out cubic |
| Close-up drift | Continuous slow push (~1.5% scale per second) or follow the cursor | whole shot |
| Carousel pan | Chapter → chapter. Camera pans right to the next window, no scale change | 24 to 29 frames, ease-in-out |
| Scroll-out | Last chapter → tagline. Window exits up, tagline rises in from below | 16 frames |

Cuts happen only into a close-up (4 to 5 per 60s). Never cut between two wide shots; pan instead. No whips, shakes, handheld or speed ramps.

## Texture

- Clean. No grain, no vignette, no lens effects.
- The only blur in the film is the accent wipe / bloom and the panel glow.
- Soft warm drop shadow under the window; nothing else casts a shadow except native UI menus.

## Text in / out

- Opener: icons start alone at frame center at ~1.25x and settle to 1.0 while rising to make room (18 frames, ease-out). Title lines then fade in fast (4 frames each, 3-frame stagger, ~10px rise).
- Tagline: rises ~40px while fading in over 6 frames as the last window scrolls out. Out: 3-frame fade.
- Logo: dot → mark grows with a quarter turn (10 frames), then wordmark letters fade in left to right (2-frame stagger).
- Panel text: typed (input) or streamed (reply). Never fades in as a block.

## Audio

- Music: mellow, warm instrumental at **~90 BPM** (measured onset interval 0.665s), soft kick, gentle hats on the beat, round bass, keys. Pitch content suggests A minor / C major (rough estimate).
- Energy map (RMS per 2.5s): soft intro under the opener (-25 dB), full groove from the first window to ~45s (-15 to -17 dB), drums drop for the last transform (~47s), quiet outro under tagline and logo (-24 to -29 dB), silence for the last ~2.5s.
- SFX: very quiet UI clicks on cursor clicks, light keystroke ticks while typing, optional soft air whoosh on the wipe. Tucked well under the music.
- Voiceover only if the user said yes (default no). Then follow motion-studio's Voiceover and captions section: bottom band, kept clear of the window (place the wide pose so the window ends above it, and in close-ups the band covers only stage or idle UI).

### Lyria final

- Prompt: `mellow, warm instrumental, 90 BPM, soft kick, gentle hats, round bass, warm electric keys with seventh chords, calm and optimistic`, A minor (or C major), plus the energy table below as a story with times in seconds: soft keys-only open, the groove comes in with the first window, drums drop out for the final payoff, gentle ending. `negative_prompt: vocals, singing, lyrics, big drops, risers`.
- Conform to exactly 90 BPM (16 frames per beat at 24fps) with motion-studio's conform steps (Sound section), then `afade` out so the last ~2.5s are silent.
- The SFX below stay the same; the score's one riser and impact become SFX cues on the opener → first window step.

### Synthesizing it (motion-studio `score.mjs` + `sfx.mjs`, drafts)

- `score.json`: `bpm` 90, palette `glass` (FM keys, light straight kit, sevenths; closest to the reference) or `lofi` if the brand is casual (swung, dustier). `minor` key for the A minor feel, `major` for C major. Fresh seed every film.
- Energy per bar:

| Section | Energy | Effect |
|---|---|---|
| Opener | 1 | pad only |
| Chapter 1 to the last chapter's Ask | 3 | step into 3 = auto riser over the opener's last bar + impact on the first window |
| Last chapter from Transform | 2 | drums drop out, bass and keys carry the payoff |
| Tagline, logo build | 1 | |
| Last ~2.5s | 0 | silent tail |

- Energy steps sit on bars, cuts in this style don't have to. Put each step on the bar nearest its section start; if the opener → first window cut is within one beat of that bar, move the cut onto the downbeat and take the beat back from the logo hold.
- `sfx.json` with the score's seed and key, every cue low (gain well under the music): `click` on cursor clicks, `tick` every 3 to 4 frames while typing (never per character), `swish` on each wipe or bloom, `pop` (soft, pitched down) on file chips landing. No impact or riser cues: the score's single step handles it.
- Mix to `public/mix.wav` with motion-studio's ffmpeg line: -14 LUFS integrated, true peak under -1.

## Do / Don't

1. **Do** keep the whole film on the warm light stage.
2. **Do** let the prompts and the UI carry the story; two text cards total.
3. **Do** reserve the accent for the AI acting.
4. **Do** cut only into close-ups and move the camera for everything else.
5. **Do** give every chapter a different way in, in order of increasing power.
6. **Don't** add callouts, arrows, zoom circles, highlight boxes or feature lists.
7. **Don't** show real waiting. "Working" lasts 1.5 to 3s, then the result.
8. **Don't** use dark mode, gradients on the stage, or bouncy springs.
