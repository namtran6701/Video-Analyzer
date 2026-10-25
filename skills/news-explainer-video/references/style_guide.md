# Style Guide: fast tech-news grammar

Measured from a Fireship "Code Report" episode ("The one OpenAI announcement that can actually make you money...", Oct 1 2026, YouTube id `No-JPdFvYWU`): 1920x1080, 23.976 fps, 346.6s. Measured with ffmpeg scene detection, caption word timings and pixel sampling. Items marked *(observed)* are read from frames, not measured. The clip itself is not shipped with this skill.

This file describes the reference. The channel's own skin (palette, fonts, sting, sign-off) lives in `assets/remotion/tokens.ts`; the hex values and fonts below are what the reference uses, not what to ship. Borrow the grammar only. Never reuse Fireship's logo, "The Code Report" title card, sign-off lines, footage, or copy.

## Structure (measured)

| Time | Section | Notes |
|---|---|---|
| 0–44s | Cold open | Starts on a text card ("LAST WEEK..."), then a joke-dense recap of the setup. Ends by teasing the 3 things covered ("a model that..., an API that..., and a new tier that..."), then the date + show name line. |
| 44–47s | Title sting | ~3s logo card with glow, hand-drawn frame. Only branded moment before the sponsor. |
| 47–245s | Main story | Backstory → announcement → mechanism (pricing, API, code) → skeptical take, ~3 sub-stories. |
| 245–340s | Sponsor | ~28% of runtime, same visual grammar as editorial. |
| 340–347s | End card | Show logo + "Link below" + sponsor code. No outro speech. |

Takeaway: the cold open is a self-contained ~45s mini-video. That is the part that maps to a 100s format.

## Pacing (measured)

- **Narration: ~200 wpm, flat across the whole video** (cold open 196, main 204, sponsor 206). 1,176 words in 346s.
- Pauses over 0.6s: 99, roughly one every 3.5s. Pauses sit before punchlines and after the setup clause, not between sections.
- Delivery *(observed)*: deadpan, no pitch lift on jokes. The joke is the word choice, not the voice.
- He does say "In today's video, we'll break down..." but only as a 3-item teaser that is itself a list of jokes.

## Shot lengths (measured)

| Measure | Hard cuts (scene > 0.3) | Any visual change (scene > 0.12, incl. overlays) |
|---|---|---|
| Count | 71 shots | 147 changes |
| Mean | 4.9s | 2.4s |
| Median | 3.1s | 1.8s |
| p25 / p75 | 1.8s / 5.6s | 0.5s / 3.3s |
| Longest | 34s (sponsor UI) | 15s |

Changes per 30s window: 15, 11, 11, 11, **29**, 7, 6, 19, 14, 15, 5, 11. Density spikes on joke runs (the 120–150s window is a meme montage) and drops on screens the viewer must read (pricing tables, code).

Rhythm rule: the base layer cuts every ~3s; overlays (arrows, labels, highlights, memes) land on top every ~1–2s so the frame never sits still longer than ~2s unless there's text to read.

## Palette (sampled)

| Role | Hex | Use |
|---|---|---|
| Background | `#0f0d0e` | Near-black, warm. Text cards, letterbox around screenshots. ~40% of all pixels are within 16 of black. |
| Text primary | `#f0f0f0` | Card text, labels on dark. |
| Highlight | `#fd7428` | Orange highlighter bars behind quoted source text. |
| Accent warm | `#ffc928` | Gradient top on hero words, emoji hand, "TRY FREE" tag. |
| Accent hot | `#f5213f` | Name/keyword stamp boxes, red X, sponsor code. |
| Terminal green | ~`#3ec46d` *(observed)* | End-card pixel text only. |

Source screenshots keep their own colors. The brand palette only touches overlays and cards.

## Type *(observed, best identification)*

- **Display cards** ("LAST WEEK...", show title): heavy rounded-corner grotesk, all caps, white, ~8–10% of frame height. Close alternatives: Bungee, Luckiest Guy, Lilita One.
- **Hero words** ("ULTRAFAST"): ultra-heavy italic caps, yellow→orange vertical gradient, thick dark stroke and drop shadow, ~12% frame height. Alternatives: Anton Italic plus stroke, Bowlby One.
- **Stamp labels** (names, product names, "OSS SINCE 2024"): white bold condensed caps in a `#f5213f` box, sometimes rotated a few degrees. Alternatives: Oswald Bold, Bebas Neue.
- **Big concept words** ("bot" / "dot"): cream-white heavy geometric lowercase, ~25% of frame height, alone on black.
- **Date line**: wide, quirky slab/typewriter caps over footage. Alternative: Special Elite.
- **End card**: pixel font (Silkscreen / VT323) in terminal green.
- **Quoted words**: stacked serif italics in quotation marks with a yellow→orange gradient, added one per beat.

Tracking is normal to slightly tight. No body text of his own: any paragraph on screen is a source screenshot.

## Recurring visual devices *(observed)*

1. **Source screenshot + orange highlighter.** Article or doc screenshot, key phrase gets `#fd7428` bars behind it, often with a glitch/slice-in.
2. **Red box around the exact token** in code or pricing tables, then a **3D yellow pointing-hand emoji** taps it.
3. **Hand-drawn white arrows** (curved, marker style) from old value to new value. Used for price changes ("$200 → Pro 500", "20x ↓ 10x").
4. **Stamp label on a face** to name a person or product, popping on with a slight overshoot.
5. **Accumulating collage.** Labels and logos stack up one per sentence until the frame is cluttered on purpose (a list of competitors, features).
6. **Split frame.** Screenshot or footage on the left 2/3, a reaction meme on the right 1/3.
7. **Reaction meme cutaway** (0.5–2s) right after a claim, as the punchline. About 1 per 15–20s.
8. **Red X** slapped over a thing being replaced.
9. **Fake retro UI** (a loading-bar dialog) for a gag about "building" something.
10. **Keynote footage** with the brand name over the stage, used as the base layer when the story is "company announced X".

## Transitions

- **Hard cut on the word** is the default (~90% *(observed)*). Cuts land on the stressed noun.
- **Glitch/slice displacement** (horizontal bands offset for 2–4 frames) to introduce highlights and pull-quotes.
- **Blinds/scanline wipe** occasionally between two screenshots.
- No dissolves, no whip pans.

## Camera moves

- Slow digital push-in on static screenshots and stage footage *(observed scale creep across consecutive frames)*, roughly 3–8% over the shot, linear.
- Overlays pop in with a fast scale overshoot (~4–6 frames). Nothing eases out: elements are cut away, not animated off.

## Texture

- Flat and clean. No film grain, no vignette, except a radial glow behind the title sting.
- Light drop shadows on stickers/labels so they read on busy screenshots.

## Text in/out

- Display cards: hard cut in, hard cut out, held only as long as the line is spoken.
- Stamp labels and arrows: pop in with overshoot, cut out with the shot.
- Stacked words: one added per spoken word or beat, never all at once.
- Highlighter: glitch-slice in, then holds.

## Audio (measured + inferred)

- Integrated mean -26.5 dB, peak -4.8 dB. RMS per 0.25s window: p5 -31.6, median -26.9, p95 -23.5. That's only ~5 dB between pauses and speech, so a **constant music bed runs under the narration** and the mix is heavily compressed.
- Bed feel *(inferred)*: low-key lo-fi/electronic loop that never draws attention.
- SFX: fair to assume pops and whooshes on overlays, but individual SFX weren't isolated. Confirm by ear before copying.

## Do / Don't

**Do**
- Write at ~200 wpm and let the jokes live in the wording, delivered flat.
- Put evidence on screen for every claim: screenshot, highlight, red box, pointing hand.
- Cut on the stressed word. Change something on screen every 1–2s, except while the viewer reads.
- Open cold on a text card plus the setup, with no logo until after the hook.
- Keep the palette to near-black plus one hot accent and one highlighter color.

**Don't**
- Don't use dissolves, slow eases, or decorative motion with no meaning.
- Don't hold a still frame past ~3s unless it's a table or code the viewer must read.
- Don't stack memes back to back. A meme is a punchline after a fact, not filler.
- Don't animate things out. Cut them.
- Don't copy the Code Report sting, the logo frame, or the "you're watching..." sign-off line.

## Scaling to a 100s episode

Section budgets and word counts are in `story_template.md`; these are the rates that drive them.

- **Words:** 100s × 200 wpm ≈ 330 words. Start at ~300 to leave room for pauses and meme beats.
- **Visual changes:** at the measured rate, ~40 base cuts plus overlays. Budget about 20 assets for the base layer.
- **Memes:** 5–6 total. **Stamp labels:** every named person or product.
- **Sting:** 2s max, placed after the hook (around 0:08), like his 44s placement scaled down.
- **Make it yours:** swap the `#fd7428` highlighter and `#f5213f` stamps for your own accent pair, pick a different display face, and write your own sign-off line. Keep the grammar (evidence overlays, flat-delivery jokes, cut-on-word), change the skin.
