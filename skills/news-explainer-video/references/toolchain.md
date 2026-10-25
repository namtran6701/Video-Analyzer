# Toolchain

All 2D, so **Remotion is the whole pipeline**, in motion-studio's 2D lane. Production basics (setup, determinism, sound, critique loop, delivery) follow the **`motion-studio`** skill; TTS and transcription calls follow **`genmedia-assets`**. This file adds what's specific to this style: the voiceover drives the timeline.

## Setup

Per motion-studio: Node 22+, ffmpeg, `npx create-video@latest` (blank), `npx skills add remotion-dev/skills`, then `npm i -E @remotion/media` (pinned to the project's Remotion). Copy motion-studio's `scripts/motion.ts` → `src/lib/motion.ts` and this skill's `tokens.ts` → `src/`. No GSAP, R3F or Blender needed.

## Who does what

| Need | Tool | Why |
|---|---|---|
| Narration | Gemini TTS with the channel narrator voice (via genmedia-assets) | Voice and model ID are in the project's CLAUDE.md. The user's own voice clone only on explicit request. The key stays in `.env`, never printed. |
| Word timings | `gemini_transcribe` with `enable_word_timestamps: true` | Every cut and overlay keys to a word. Align the known script to the timings; never use its text. |
| Evidence | Playwright screenshots at 2x, or files from the user | Sharp under a 5% push, swappable, readable at phone size |
| Overlays, cards, diagrams | React components in Remotion | Frame-exact, keyed to word timings |
| Bed + SFX | motion-studio sound section | Constant bed under VO, pops and glitch ticks |
| Checks | ffprobe, loudness per motion-studio | Duration, resolution, fps, -14 LUFS |

## Voiceover pipeline

1. Write the final script to `docs/script.txt`, one sentence per line, numbered to match production sheet rows.
2. Generate one continuous take to `public/vo.wav`. Ask for a dry, deadpan read at a brisk pace. Check its duration with ffprobe against the runtime; if it's more than 5% over, trim words and regenerate rather than speeding up the audio.
3. Transcribe `public/vo.wav` with word timestamps. Align the script words to the returned timings in order, force timestamps to increase, and write `docs/vo_words.json`:

```json
[{ "i": 0, "row": 1, "word": "Your", "start": 0.12, "end": 0.31, "stress": false }]
```

4. Mark `stress: true` on the words the production sheet cuts on (usually the last noun of a sentence, names, numbers). Cuts land on those words' `start`.

## Using word timings

```ts
import words from "../docs/vo_words.json";
import { FPS } from "./tokens";

export const wordStart = (i: number) => Math.round(words[i].start * FPS);
export const rowStart = (row: number) => wordStart(words.findIndex((w) => w.row === row));
```

Shots are `<Sequence from={wordStart(a)} durationInFrames={wordStart(b) - wordStart(a)}>`, where `b` is the next cut's word. Overlays inside a shot use `wordStart(i) - shotStart` as their frame 0. Change the script, regenerate VO and timings, and the whole edit re-times.

## Evidence capture

- Viewport 1920 x 1080 CSS px, `deviceScaleFactor: 2`. Hide cookie banners and logged-in user data.
- For a specific element (a pricing row, a paragraph), screenshot the element with 40px padding so N4/N5 boxes can be placed from its bounding box.
- Save the source URL and capture date next to each file in `docs/sources.md`; it becomes the video description.

```ts
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
await page.goto(url);
await page.locator(selector).screenshot({ path: "public/evidence/r05-pricing.png" });
```

## Project layout

```
<project>/
  brief.md
  docs/shotlist.md  docs/script.txt  docs/vo_words.json  docs/sources.md  docs/review_log.md
  public/
    vo.wav  bed.wav  mix.wav
    evidence/          # rNN-<slug>.png, named by production sheet row
    memes/             # user-supplied or approved only
    brand/             # sting mark, fonts, pointing-hand sticker
  src/
    tokens.ts  lib/motion.ts  words.ts
    overlays/          # Highlighter, RedBox, PointHand, Arrow, Stamp, RedX, Glitch, NumberSwap
    cards/             # ColdOpen, Sting, BigWord, HeroWord, QuoteStack, Chain, Takeaway
    sections/          # Hook, WhatHappened, HowItWorks, Stakes, FieldNote, Takeaway
    Root.tsx           # one <Composition>, <Audio src={staticFile('mix.wav')} />
  out/
```

## Render and verify

Drafts at `--scale=0.5` during the critique loop. Final:

```bash
npx remotion render Main out/final.mp4 --codec=h264 --crf=18
ffprobe -v error -show_entries stream=width,height,r_frame_rate,duration -of default=nw=1 out/final.mp4
```

Default 1920x1080 at 30fps. For a 9:16 cut, stack evidence on top (fit to width) and overlays below, and add word-level captions from `vo_words.json` since vertical viewers often watch muted; the 16:9 master has no burned captions.
