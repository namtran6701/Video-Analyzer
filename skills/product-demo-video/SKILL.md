---
name: product-demo-video
description: Produce a polished product launch / demo video in one fixed, proven kinetic-typography style (dark problem acts, light solution acts, word-by-word type on a beat grid, inline icons in sentences, real product UI demo, benchmark proof, privacy beats, URL close) from the user's brand assets, fonts, colors and copy. Ships the full style spec, an 18-move motion library, a 7-act story template, brief/shotlist templates and format-aware Remotion tokens; produces it on the motion-studio pipeline (Remotion with 2D GSAP, an R3F laptop and a Blender light-shaft plate, Lyria score conformed to the beat grid (synthesized for drafts) and SFX, scored critique loop) and renders MP4s in 16:9, 1:1 and 9:16. Use whenever the user wants a product demo video, launch video, SaaS/AI product promo, feature announcement film, or a text-driven promo "in our usual style" / "like the last demo video", even if they don't name this skill. Not for analyzing or copying the style of a new reference video (that's video-study).
---

# Product Demo Video

Turn the user's brand inputs (logo, font, colors, copy, product site or screenshots) into a 30 to 90s launch film in one fixed style, ending in rendered MP4s. The style is fully specified here, so there is nothing to analyze. This skill owns the **style**; the **`motion-studio`** skill owns production (lanes, motion helpers, score, SFX, critique loop, delivery). Load motion-studio before step 5 and follow it wherever this file doesn't say otherwise.

The style in one paragraph: no voiceover by default (ask; see the brief), text carries the story. Short centered sentences (max ~5 words per line) build word by word on a ~116 BPM beat grid. Acts alternate dark (problem, proof, close) and light (solution, trust), and the only hard cuts are at those flips, always on a downbeat. Inside an act, things morph, push and blur instead of cutting. Line icons sit inside sentences ("across 🌐 websites 🔑 accounts"). One accent color, used sparingly. The middle third is a real product UI demo with a cursor and a thin progress thread. Two moments get real depth: the logo on volumetric light shafts, and a laptop closing its lid.

## Files and when to read them

| File | Read when |
|---|---|
| `assets/templates/brief.md` | Step 1, collecting inputs |
| `references/story_template.md` | Step 3: act structure, timings, copy rules, how each act looks |
| `references/style_guide.md` | Step 4: palette, type, motion and audio rules (incl. the energy map) |
| `references/motion_library.md` | Step 5 (motion IDs M1 to M18) and step 7 (component specs) |
| `references/toolchain.md` | Step 6: lane per act, setup, project layout, formats, render |
| `assets/look/*.jpg` | Step 7: one still per signature moment, named by act and move. Open only the one for the act you're building |
| `assets/remotion/tokens.ts` | Step 6, copy into the project |

## Workflow

Steps 1 to 5 are cheap planning with two approval gates. Steps 6 onward cost real tokens and render time.

### 1. Brief
Copy `assets/templates/brief.md` into the project as `brief.md` and fill it from what the user gave you. If runtime, formats, product/promise, demo task, or brand basics are missing, ask once for all of them together, and always ask whether this film gets a voiceover (never assume). Defaults if they shrug: 60s, 16:9 only, 30fps, style-guide palette, Inter Display, `glass` palette (Lyria final, synthesized drafts), no voiceover.

The user's copy wins. Use their text verbatim and fit it to the acts; only write copy for acts they left empty, and flag which lines you wrote.

### 2. Brand capture (gate 1)
Capture the real product into `public/brand/`: site and app screenshots (Chrome DevTools MCP at device scale factor 2+ if it runs, per motion-studio gate 1), logo SVG, colors, font files. The demo act is rebuilt in React from these, so never redraw product UI from memory. List what you found and what's missing, and **wait for the OK**.

### 3. Script
Read `references/story_template.md`. Fill the 7-act template, scaled by its percentages to the runtime and rounded to whole bars. For 30s, merge proof+capabilities and drop the bonus act. Keep the copy rules: ≤5 words/line (fewer in 1:1 and 9:16), "they" for the old way, product name or "you" for the new way, one human moment max.

### 4. Style
Read `references/style_guide.md`. Write `docs/style_guide.md` by mapping brand values onto the style's roles: brand dark → `darkBg`, brand light → `lightBg`, brand primary → `accent`, brand font → headline/UI. Keep every structural rule (two neutrals + one accent, dark/light alternation, beat-locked text, cuts only at flips). If the brand has no dark neutral, fall back to `#262626`. Pick the score palette, BPM (112 to 120), key and a fresh seed.

### 5. Shotlist (gate 2)
Run motion-studio's `beats.py --bpm <bpm> --dur <runtime>` to `beats.json` (or measure the user's track with it). Fill `assets/templates/shotlist.md` into `docs/shotlist.md`: times in bars, beats and seconds summing exactly to the runtime, motion IDs, lane, energy and SFX per act. Use only the user's assets and copy.

Show the user the script, style mapping and shotlist, then **stop and wait for approval**. A wrong shotlist wastes every step after it.

### 6. Scaffold
Read `references/toolchain.md` and set up per it: motion-studio setup, lane packages, `motion.ts` from motion-studio, this skill's `tokens.ts` with BPM, palette and fonts from step 4, one `<Composition>` per format. Fonts local via `staticFile`. If the shotlist uses the Blender plate, call `mcp__blender__get_addon_status`; if it can't connect, render the plate headless per motion-studio's Blender plates section (no need to open Blender). Use the 2D fallback only when Blender isn't installed. Fetch the HDRI for M17 with `polyhaven.mjs`.

### 7. Build, one act at a time
Build only the motion components the shotlist uses, then the acts in order. Render the Blender plate early (it's the slowest asset) per motion-studio's plate rules. After each act, render a still at its key beat (`npx remotion still Main-16x9 --frame=<f>`) and compare it with the matching image in `assets/look/` for scale, spacing and density (not color or content, those come from the brand). In multi-format films, also still the 9:16 frame and check the safe zone. Fix gaps before moving on, and report progress per act.

### 8. Sound
Per motion-studio's Sound section. Drafts: `docs/score.json` from the shotlist's energy column (see the energy map in the style guide), `score.mjs` (try 2 or 3 seeds, keep the best). Final: 2 Lyria takes (the user picks one) prompted from the style guide's Audio section, conformed to the film's BPM with motion-studio's conform steps (Sound section) (confirm the generation first). Then `docs/sfx.json` from the SFX column, `sfx.mjs` with the score's seed and key, mix to `public/mix.wav`, and add `<Audio src={staticFile('mix.wav')} />`. With a supplied track, cut to its measured beats and skip both.

### 9. Critique loop
Run motion-studio's critique loop (beat contact sheet, half-scale drafts, phone test, sound-off test, determinism, loudness, 10 scores, fix the 3 worst, log in `docs/review_log.md`, minimum 3 rounds, every score 8+). Add these to its hunt list:
- a word or cut off the beat grid; an act not starting on a downbeat
- a cut inside an act, or a cut that isn't a light/dark flip
- accent on more than ~5% of pixels, or a second accent color
- an icon beside the sentence instead of inside it, or not at cap height
- demo UI that doesn't match the captured brand screens, or isn't at real scale
- a line longer than the format's words-per-line
- the reveal plate banding or its edges not sitting in the comp; the laptop reading as plastic

### 10. Render and deliver
Per format: `npx remotion render Main-<format> out/final-<format>.mp4 --codec=h264 --crf=16`, verified with `ffprobe` (duration, resolution and fps must match the brief exactly) and loudness at about -14 LUFS. Also `out/poster.png` (the reveal frame) and `out/contact.png`. Report what you checked, including the final scores, then send the files to the user.

## Rules that make it feel right

1. Alternate dark and light acts; problem is dark, solution is light.
2. Every word lands on the beat grid and every act starts on a downbeat. Off-beat text is the fastest way to lose the feel.
3. Icons go inside the sentence at cap height, not beside it.
4. No cuts within an act; morph or push instead.
5. Demo uses React-built UI at real scale with a cursor, rebuilt from the captured brand screens, not screen recordings.
6. One accent color, on roughly 5% of pixels. No grain or background gradients outside the reveal.
7. 3D only where depth is the point: the reveal plate and the trust laptop.
8. Never name competitors; use neutral generic props for "the old way".
