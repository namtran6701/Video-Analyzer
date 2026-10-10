---
name: product-demo-video
description: Produce a polished product launch / demo video in one fixed, proven kinetic-typography style (dark problem acts, light solution acts, word-by-word type on a beat grid, inline icons in sentences, real product UI demo, benchmark proof, privacy beats, URL close) from the user's brand assets, fonts, colors and copy. Ships the full style spec, an 18-move motion library, a 7-act story template, and brief/shotlist templates; builds with Remotion, HyperFrames and Blender and renders an MP4. Use whenever the user wants a product demo video, launch video, SaaS/AI product promo, feature announcement film, or a text-driven promo "in our usual style" / "like the last demo video", even if they don't name this skill. Not for analyzing or copying the style of a new reference video (that's video-study).
---

# Product Demo Video

Turn the user's brand inputs (logo, font, colors, copy, product screenshots or UI specs) into a 30 to 90s launch film in one fixed style, ending in a rendered MP4. The style is fully specified in this skill's references, so there is nothing to analyze: no reference videos, no frame extraction. Your job is script, shotlist, build, render.

The style in one paragraph: no voiceover, text carries the story. Short centered sentences (max ~5 words per line) build word by word on a ~116 BPM beat grid. Acts alternate dark (problem, proof, close) and light (solution, trust), and the only hard cuts are at those flips. Inside an act, things morph, push and blur instead of cutting. Line icons sit inside sentences ("across 🌐 websites 🔑 accounts"). One accent color, used sparingly. The middle third is a real product UI demo with a cursor and a thin progress thread.

## Files and when to read them

| File | Read when |
|---|---|
| `assets/templates/brief.md` | Step 1, collecting inputs |
| `references/story_template.md` | Step 2: act structure, timings, copy rules, and how each act looks |
| `references/style_guide.md` | Step 3: default palette/type/motion/audio rules to map the brand onto |
| `references/motion_library.md` | Step 4 (motion IDs M1 to M18) and step 6 (component specs) |
| `references/toolchain.md` | Step 5: Remotion / HyperFrames / Blender split, project layout, render commands |
| `assets/look/*.jpg` | Step 6: one still per signature moment, named by act and move. Open only the one for the act you're building, as a target for scale, spacing and density |
| `assets/remotion/tokens.ts` | Step 5, copy into the project |

## Workflow

Steps 1 to 4 are cheap planning. Steps 5 onward cost real tokens and time, so there's an approval gate between them.

### 1. Brief
Copy `assets/templates/brief.md` into the project as `brief.md` and fill it from what the user gave you. If runtime, aspect ratio, product/promise, demo task, or brand basics are missing, ask once for all of them together. Defaults if they shrug: 60s, 1920x1080, 30fps, style-guide palette, Inter Display.

The user's copy wins. If they provide text, use it verbatim and fit it to the acts; only write copy for acts they left empty, and flag which lines you wrote.

### 2. Script
Read `references/story_template.md`. Fill the 7-act template, scaled by its percentages to the runtime. For 30s, merge proof+capabilities and drop the bonus act. Keep the copy rules: ≤5 words/line, "they" for the old way, product name or "you" for the new way, one human moment max.

### 3. Style
Read `references/style_guide.md`. Write `docs/style_guide.md` by mapping brand values onto the style's roles: brand dark → `dark-bg`, brand light → `light-bg`, brand primary → `accent`, brand font → headline/UI. Keep every structural rule (two neutrals + one accent, dark/light alternation, beat-locked text, cuts only at flips). If the brand has no dark neutral, fall back to `#262626`.

### 4. Shotlist, then stop
Fill `assets/templates/shotlist.md` into `docs/shotlist.md`. Times in beats and seconds; durations must sum exactly to the runtime. Each shot cites motion IDs. Use only the user's assets and copy.

Show the user the script, style mapping, and shotlist, then **stop and wait for approval**. A wrong shotlist wastes every step after it.

### 5. Scaffold
Read `references/toolchain.md`. Remotion is the default spine; HyperFrames is fine for pure-type acts; Blender (via the blender MCP) for the light-shaft logo reveal and 3D props, rendered to PNG sequences. Check current Remotion / HyperFrames APIs with context7 before writing framework code, since both change often. Copy `assets/remotion/tokens.ts` and set BPM, palette and fonts from step 3. Load brand fonts locally from the user's files.

### 6. Build, one act at a time
Build only the motion components the shotlist uses, then the acts in order. After each act, render a still (`npx remotion still ... --frame=<f>`) and compare it with the matching image in `assets/look/` for scale, spacing and density (not color or content, those come from the brand). Fix gaps before moving on, and report progress per act.

### 7. Audio
If the `motion-studio` skill is available, use it to synthesize a score at the chosen BPM (quiet intro, build, full energy from the reveal) plus UI tick / whoosh / riser SFX on shotlist cues. If the user supplies a track, ask for its BPM (or use 116) and set it in `tokens.ts`. Word lands and hard cuts sit on beats.

### 8. Render and verify
Render to `out/final.mp4` (h264, crf 18). Verify with:

```bash
ffprobe -v error -show_entries stream=width,height,r_frame_rate,duration -of default=nw=1 out/final.mp4
```

Duration, resolution and fps must match the brief exactly. Report what you checked, then send the file to the user.

## Rules that make it feel right

1. Alternate dark and light acts; problem is dark, solution is light.
2. Every word and every cut lands on the beat grid. Off-beat text is the fastest way to lose the feel.
3. Icons go inside the sentence at cap height, not beside it.
4. No cuts within an act; morph or push instead.
5. Demo uses React-built UI at real scale with a cursor, built from the user's screenshots/specs, not blurry screen recordings.
6. One accent color, on roughly 5% of pixels. No grain, no background gradients outside the reveal.
7. Never name competitors; use neutral generic props for "the old way".
