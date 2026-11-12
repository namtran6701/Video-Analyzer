# Manifesto Teaser: style guide

Measured from `references/ig-DcpLuSIvaSx/reference.mp4` (720x1280, 30fps, 33.77s). The first 4.9s (handheld desk shot with a quote overlay) is a social wrapper and is not part of this style. Everything below describes the 28.87s film that follows, which plays as a 16:9 band (720x405) centered in the 9:16 frame on black.

All sizes are relative to the **band height** (405px in the reference), so they scale to any render size.

## Palette

Sampled from frames with ffmpeg rawvideo + Python, not eyeballed.

| Role | Hex | Notes |
|---|---|---|
| Background, letterbox | `#040404` | 100% of the letterbox, 60 to 99% of every dark frame. Near black, never pure `#000000` |
| Text, counter, logo | `#ffffff` | Brightest pixel in every frame |
| UI surface 1 | `#0c0c0c` | Panels, table rows |
| UI surface 2 | `#141414` | Cards (chart card is 30% of its frame at this value) |
| UI surface 3 / hairlines | `#1c1c1c` to `#242424` | Borders, dividers, inactive controls |
| Hero button top | `#b9bdc1` | Brushed silver gradient, top |
| Hero button bottom | `#707778` | Gradient bottom; soft white glow around the button |
| Secondary label | about `#949494` | Caps label beside the rolling number, placeholder text |
| B&W footage mids | `#3c3c3c` to `#545454` | Desaturated portraits sit in this range |

There is no brand accent color. Color exists only inside the full-color archival clips of acts 1 and 2 (sky `#84a4fc`, skin `#bca48c` to `#dcc4ac`, launch orange). From act 3 on the film is strictly monochrome.

## Type

| Use | Family (best match) | Weight | Size | Position | Case |
|---|---|---|---|---|---|
| Stat counter | Montserrat (alt: Gilroy, Poppins) | 700 | cap height about 11% of band, font size about 15% | Dead center | n/a |
| Captions | Montserrat (alt: Poppins, Gilroy) | 500 | font size about 3.3% of band (cap height 12px of 405) | Centered, baseline at 91% of band height | Sentence case, keeps its punctuation |
| End cards | Inter / SF Pro Display (alt: Helvetica Neue) | 500 | font size about 5.4% of band; URL line is 32% of band width | Dead center | As written |
| Rolling number | Monospace (JetBrains Mono, Geist Mono) | 500 | about 4% of band | Center | Label in caps, grey, tracked about +5% |
| UI | Inter | 400 to 600 | Real product sizes | n/a | n/a |

Tracking is default everywhere except the caps label. The counter has a faint soft shadow so it holds over bright footage. Captions have no box, no stroke, only a very light shadow.

## Shot lengths

About 50 shots in 28.87s. Average 0.58s, but the distribution is the point: bursts and holds.

| Act | Film time | Share | Shots | Pattern |
|---|---|---|---|---|
| 1 Stat hook | 0.00 to 3.50 | 12% | 5 | 0.80, 0.47, 0.67, 0.47, 1.10 |
| 2 Claim | 3.50 to 7.73 | 15% | about 14 | 0.9s strobe (1 to 4 frames per image), then 0.80, 0.50, 0.57, 0.73, 0.73 |
| 3 Naming | 7.73 to 10.10 | 8% | about 12 | 8 portraits at exactly 3 frames each, one held 0.80, 0.23 white strobe, 0.53 |
| 4 Mechanism | 10.10 to 14.27 | 14% | about 12 | 1.70 of scan slices swapping every 2 to 3 frames, 0.73, 0.63, 1.10 with a jump cut every 5 frames |
| 5 Breath | 14.27 to 16.40 | 7% | 1 | 2.13 hold, caption only on black |
| 6 Product | 16.40 to 24.13 | 27% | 9 | 0.83, 1.43, 0.60, 0.57, 0.47, 0.50, 0.70, 0.50, then a 2.13 hold |
| 7 Close | 24.13 to 28.87 | 16% | 3 | 1.40, 1.40, 1.30, then 0.47 of black |

Rhythm rule: every burst of sub-0.2s cuts is paid off by a hold of 0.8s or more. The two longest holds (2.13s each) are the emptiest frames in the film: caption on black, and one button on black.

## Transitions

- **Hard cut** is the default. No dissolves anywhere.
- **Strobe**: 1 to 4 frame images back to back, some inverted to white. Used twice (start of act 2, the reveal of the name in act 3).
- **Dim to black**: the last clip of act 1 fades to about 10% brightness over 15 frames while the counter stays full white. This is the only fade in the film.
- **White flash**: 2 to 7 frames of blown-out white before a reveal.
- **Glitch in**: the HUD shot arrives with 2 to 3 frames of horizontal tearing.
- **Whip zoom with motion blur**: about 15 frames, used once, to fly from a full UI screen into the hero button.
- **Cut to black** between end cards. Text is simply there on the next frame.

## Camera moves

- Archival clips keep their native motion. No added moves except a barely visible push (about 2% over the shot).
- Earth: cut from small and centered to a tight crop bottom-left. It reads as a jump in, with a slow rotation inside each shot.
- UI shots are always moving: slow drift up or sideways (about 3 to 5% of band per second) plus a continuous push-in (about 5 to 10% per second), ease-out. The UI is cropped hard. A full screen is never shown at rest.
- UI depth of field: the element in focus is sharp, everything else in the same UI is blurred and dimmed to about 20%.
- Hero button: fully static for 2.13s. The stillness is the move.

## Texture and grain

- Archival footage keeps its own grain, compression and softness. Do not clean it up.
- B&W treatment from act 3: fully desaturated, crushed blacks, some shots pushed to pure two-tone.
- Heavy vignette on macro shots (the mouse click falls to black on all sides).
- Soft bloom around bright UI elements and the hero button (glow radius about 10% of band height, low opacity).
- No overlay grain, no light leaks, no borders. The letterbox bars are the only frame.

## Text in and out

- **Counter**: types on one character at a time (a five-character stat takes five steps), each new character landing on or just after a picture cut. It stays centered and never moves. It leaves with a hard cut.
- **Captions**: 2 to 3 words at a time, phrase replaced by a hard swap with no animation. Phrases follow the voice, not the cuts, so a caption often spans several shots. A sentence ends with its period. A sentence left hanging ends in `...`.
- **End cards**: appear by cut, hold 1.4s, leave by cut.
- **Logo**: two corner brackets start apart and rotated, spin about 90 degrees and close into the mark over about 20 frames with ease-out, then hold about 0.8s. Mark size is 16.5% of band height.
- **Rolling number**: last digits flicker with vertical motion blur while the leading digits stay readable. Label sits still to its right.
- **Typed UI text**: about one character every 2 frames with a blinking caret.

## Audio

Measured: mean -17 dB, peak 0 dB. The opener is silent, sound starts on the first film frame. Level builds through acts 1 to 4, the single loudest moment sits on the cut into act 6 (the product reveal), and the level drops by more than half for act 7, where only sparse hits remain, one per end card.

Inferred, not verified by ear: a narrated voiceover drives the film (the captions are its transcript, in spoken phrases), over a tense cinematic bed that swells rather than a beat-driven track. Autocorrelation gave weak tempo candidates near 100 and 132 BPM, so do not treat the film as cut to a strict beat grid. The fixed cut intervals (3 frames, 5 frames) are frame-counted, not beat-counted.

Sound design to plan for: a hit on each counter character, a riser into each strobe, near silence under the "breath" caption, an impact on the product reveal, soft UI clicks and key ticks in act 6, one clean click for the hero button, a low hit per end card.

## Do

1. Open on a number, not a sentence. One stat, typed on over fast unrelated footage.
2. Let one sentence run across many shots, in 2 to 3 word captions at the bottom.
3. Drain the color. Start in full color, be fully black and white before the product appears.
4. Follow every burst with a hold. Give the two key ideas an almost empty black frame each.
5. Show the product only in fragments: tight, drifting, dark, with everything out of focus except one control.
6. End on one button, then three silent cards: URL, who it's for, mark.

## Don't

1. No dissolves, slides or animated caption entrances.
2. No accent color, no gradients except the silver button.
3. No full-screen UI at rest, no device frames, no feature list.
4. No logo before the last 2 seconds.
5. No more than 3 words in a caption, and never two caption lines.
6. Never reuse the reference's footage, people, numbers, UI, URL, tagline or mark.
7. Never reuse or paraphrase the reference's script or captions. The reference is a template for style only.
