# Style Guide

Default values for this style, measured from the reference film (16:9, 24fps: a ~58s product story and a ~10s close; the testimonial clips in between are not part of the style). Sizes are at 1920x1080. When the user supplies a brand accent, serif, UI font and mark, swap them in by role and keep everything else.

## Palette

| Token | Hex | Role |
|---|---|---|
| `stage` | `#ccc9da` | Flat lavender. Background of every frame |
| `stageLift` | `#d5d3e1` | Frosted fill of notification banners and the eyebrow pill (white at ~20% over `stage`) |
| `line` | `#afacc1` | The travelling line. A darker lavender, never ink |
| `ink` | `#100e19` | Claims, title wordmark, CTA, URL |
| `screen` | `#faf8f4` | Phone screen, warm off-white |
| `bezel` | `#141214` | Phone frame |
| `bubbleAgent` | `#f1efed` | Agent messages, left |
| `bubbleUser` | `#e9c6b8` | User messages, right, with a tail. The only warm fill on idle UI |
| `card` | `#ffffff` | Result cards, draft cards, icon tile, reaction chips |
| `uiInk` | `#0f0e0f` | Text inside the UI |
| `accent` | `#cf6f5c` | The app's mark, the logo, text the agent is writing live. Nothing else |
| Veil | `stage` at 50% | Laid over the phone in a focus lift (M14) |
| Confetti | `#d87848` `#d87878` `#d8a848` `#4878d8` `#c858a0` (approx.) | Payoff only |

Rules:
- **Two values on one tint.** Everything sits on the cool mid-tone stage and is either near-white (phone, cards, banners) or ink. That contrast is the look. If the brand replaces `stage`, keep it a soft tinted mid-tone (lightness ~78 to 84, low chroma) so both white UI and ink type pop.
- **Warmth = the user.** `bubbleUser` is the accent at ~40% over white; derive it from the brand accent the same way.
- **Accent = the agent's identity and its live hand.** Under ~2% of the frame except during a live edit. Never on claims, bubbles, banners or the line.

## Type

- **Claims, title line, CTA:** editorial text serif with soft contrast, weight 400. The reference looks like Tiempos / Copernicus; free options **Source Serif 4** or **Newsreader**. Sentence case; no italics, bold or all caps.
- **Claim size ~112px** (ascender-to-descender ink ≈ 10% of frame height), line height 1.18 (132px baseline to baseline), tracking -0.01em. One or two lines, about 4 words per line.
- **Title promise line:** one line, up to ~6 words, may run ~80% of frame width. Same size as claims.
- **Wordmark (title and end lockup):** ~155px, the product name in the claim serif (or the brand wordmark).
- **Eyebrow pill:** ~56px tall, label ~28px in the UI sans (medium), padding 0 20px, radius 10, `stageLift` fill, 1.5px border in `line`. Centered ~150px above the wordmark or CTA cap line. Label is a status word ("Early access", "Beta").
- **Alignment by layout:** centered when alone on the stage; left-aligned at x=96 (5%) beside a phone on the right; left-aligned at x=1056 (55%) beside a phone on the left. Vertically centered on the frame.
- **UI:** the app's own sans at real proportions. The phone renders a 390pt-wide screen at ~2.15x. Chat body is ~18pt with a 25pt line pitch: ~39px text and 54px pitch at rest, ~56px and 78px in close shots.
- **Notification banner text:** ~50px, app name semibold, message regular in 2 lines (~70px pitch), "now" at ~50% `uiInk`.
- **End lockup:** icon tile (~180px, radius ~40, `card` fill, mark in `accent`) + wordmark, gap ~36px, ~1000px wide together, centered at mid-height. URL in the UI sans at ~48px, `ink`, centered at ~87% of frame height (near the bottom, not tucked under the lockup).

## Phone and layouts

- **Phone:** bezel 18px, outer radius ~105px at rest, flat and front-on. Status bar (time, signal, wifi, battery) in `uiInk`. Thread header: the app's mark in a white circle (~96px at rest) centered at the top, a small date label under it. Input bar (reply field + mic + send) and a 4-icon tab bar at the bottom whenever the bottom of the screen is in frame.
- **No shadow under the phone;** the bezel separates it. Elements floating on the bare stage (banners, a lone or lifted bubble, a rising card) get a faint one: `0 12px 40px rgba(40,30,60,.10)`.

| Layout | Phone | Text | Used in |
|---|---|---|---|
| Rest | Scale 1: 874px wide (46% W), centered, top edge at y=69 (6%), bottom cropped | none | Ping, Reports back |
| Close | Scale 1.45: 1267px wide (66% W), centered, top and bottom cropped, both side bezels visible | none | Show it working, Reports back, Control |
| Split right | Close scale, inner bezel at x=1068 (55.6% W), right side cropped | left, x=96 | Claims run |
| Split left | Mirror: inner bezel at x=852 (44.4% W), left side cropped | left-aligned, x=1056 | Claims run |
| Bare | none | centered | Title, solo claim, chip claim, payoff, CTA |
| Float | none; one bubble at close scale, centered (~900px wide) | none | Reports back |
| Live edit | Scale ~1.9 around the card being edited | none | Control |

## Timing and rhythm

The reference measured ~118 BPM. Build at **120 BPM**, which at 24fps is exactly **12 frames per beat** (0.5s). Plan in beats.

| Act | Reference (s) | Beats @120 |
|---|---|---|
| Ping | 0.0 to 8.0 | 16 |
| Title | 8.0 to 12.7 | 9.5 |
| Show it working | 12.7 to 21.5 | 17.5 |
| Claims run | 22.0 to 34.0 | 24 |
| Reports back | 34.0 to 45.5 | 23 |
| Control | 45.7 to 54.3 | 17 |
| Payoff | 54.3 to 58.4 | 8 |
| Close | 90.5 to 100.0 | 19 |

Dwell: something new lands every 1 to 2 beats (a bubble, a word, a chip, a layout change). Claims hold 2 to 4 beats after their last word. Phone layouts hold 4 to 16 beats, kept alive by arriving messages and a slow upward drift.

## Transitions

| Type | Where | Duration |
|---|---|---|
| Phone whip in | Phone enters from below the frame | 6 frames, ease-out, vertical blur on the first 3 |
| Phone whip out | Phone leaves off the top | 10 to 14 frames, ease-in, vertical blur on the last 4 |
| Banner handoff | Notification → phone | Banner scales 1 → 0.55 over 10 frames (ease-in), phone whips in on the next frame |
| Word sweep | Claim → anything | Words fade out left to right, 4 frames each, 2-frame stagger |
| Side swap | Split right → split left | Phone slides across in 12 frames (ease-in-out) while the old claim sweeps out and the new one builds |
| Dock | Floating bubble or card → phone | Phone rises behind it in 12 frames (ease-out); the element holds still and becomes part of the thread |
| Line pass | Title wordmark → promise line; CTA → logo | The travelling line crosses in ~40 frames; text swaps as it passes |
| Whip scroll | Control → Payoff | Thread scroll accelerates over ~24 frames with growing vertical blur; hard cut at the blur peak |

No dissolves between scenes, no zoom-through cuts, no camera shake. The only hard cut is at the whip scroll's peak.

## Texture

- Flat. No grain, vignette, gradient or glow.
- Blur only as vertical motion blur on whips and fast scrolls.
- Shadows only on elements floating on the bare stage.

## Text in / out

- **Claims build (M4):** each word fades 0 → 1 over 6 frames (ease-out), 2-frame stagger. No movement, blur or scale; mid-fade words read as gray, which is the look. Line 2 starts 1 to 2 beats after line 1 when a UI element enters between them, otherwise straight after.
- **Claims exit (M5):** words fade out left to right, 4 frames each, 2-frame stagger, both lines in parallel.
- **Title wordmark** builds per word like a claim. **End wordmark** types on per letter (~2 letters every 3 frames). **URL**: domain fades in, path types ~1.5 characters per frame.
- **UI text never builds per word.** Bubbles and cards arrive whole (M8, M11). The one exception is the live edit (M18).

## Audio

- **Music:** soft, airy instrumental at ~118 BPM (measured: steady pulse, onsets every ~0.51s), starting ~0.8s in. Under UI acts it carries a light pulse and sits brighter (spectral centroid ~1.5 kHz); under text-only claims it thins out (sparse onsets, centroid ~1.0 kHz). Hard silence for the last ~5s, under the logo hold.
- **No voiceover.** The reference bed sits very low (≈ -42 dB RMS) because its testimonial voices set the level. Without them, master to motion-studio's -14 LUFS and keep the arrangement sparse instead.
- **SFX** (inferred from onsets that line up with UI moments): soft pops on banner and bubble arrivals, a light chime on the payoff. All well under the music.

### Synthesizing it (motion-studio `score.mjs` + `sfx.mjs`)

- `score.json`: `bpm` 120, palette `glass` (airy FM bells, light kit; closest to the reference) or `lofi` if the brand is casual. `major` key: the film is calm and upbeat. Fresh seed every film.
- Energy per bar (4 beats = 2s):

| Act | Energy | Effect |
|---|---|---|
| Ping | 1 | pad only |
| Title | 2 | the auto riser lands its impact on the wordmark's downbeat |
| Show it working | 2 | |
| Claims run | 1 | thins under the claims; keep it to 8 bars or fewer |
| Reports back, Control | 2 | put the floating bubble's arrival on this step's downbeat |
| Payoff | 2 | |
| Close: CTA and line | 1 | |
| Logo hold | 0 | silent tail |

- Never energy 3: there is no drop in this style.
- `sfx.json` with the score's seed and key, every cue low: `pop` (pitch -5) on banner arrivals and the first bubble of each UI act (not every bubble), `tick` every 3 to 4 frames during the live edit, `swish` on phone whips and the whip scroll, `chime` + `pop` on the payoff punch. No impact or riser cues: the score's energy steps play those.
- Mix to `public/mix.wav` with motion-studio's ffmpeg line: -14 LUFS integrated, true peak under -1.

## Do / Don't

1. **Do** open on the agent's notification on an empty stage.
2. **Do** alternate UI beats and claim beats, changing the layout every time.
3. **Do** keep the phone oversized and cropped by the frame.
4. **Do** build claims word by word and sweep them out the same way.
5. **Do** reserve the accent for the mark, the logo and live edits.
6. **Don't** add captions, callouts, arrows, cursors, tap ripples or highlight boxes.
7. **Don't** show the user typing; their replies are 2 to 8 words and arrive whole.
8. **Don't** tilt, rotate or render the phone in 3D, and don't use gradients or dark scenes.
