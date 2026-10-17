---
name: claude-feature-video
description: Produce a calm, Claude-launch-style feature introduction video in one fixed style (warm ivory stage, the product's real UI in a floating browser window, a virtual camera that punches into details and pulls back to reveal results, an AI side panel with typed prompt, working state and streamed reply, an accent wipe that turns the "before" screen into the "after", serif opener and tagline cards, logo build) from the user's screenshots, brand and use cases. Ships the style spec, a 20-move motion library, a chapter template (one use case per chapter), brief/shotlist templates and Remotion tokens plus a camera helper; produces it on the motion-studio pipeline (Remotion, synthesized 90 BPM bed and UI SFX, scored critique loop) and renders an MP4. Use whenever the user wants a feature intro, feature walkthrough video, in-app AI assistant demo, "Claude-style" / "Anthropic-style" product video, or a video "like the Claude for Workspace one", even if they don't name this skill. Not for kinetic-typography launch films (that's product-demo-video) or for studying a new reference video (that's video-study).
---

# Claude Feature Video

Turn a feature, its use cases and the user's screenshots into a 30 to 90s intro film in one fixed style, ending in a rendered MP4. The style is fully specified in this skill's references, so there is nothing to analyze. This skill owns the **style**; the **`motion-studio`** skill owns production (motion helpers, determinism rules, score, SFX, critique loop, delivery). Load motion-studio before step 6 and follow it wherever this file doesn't say otherwise.

The style in one paragraph: no voiceover and almost no on-screen copy. The product's real UI tells the story. A browser window floats on a warm ivory stage and a virtual camera moves over it: hard cut into a close-up of where you invoke the feature, eased pull-back to show what happened. Each chapter is one use case with the same grammar (establish, invoke, ask, working, transform, hold), and each one shows a different way in (menu, file drop, tool toggle). One accent color appears only when the AI acts: the panel glow, the working spark, and a soft diagonal wipe that rewrites the screen. Serif cards bookend it: "Introducing ..." up front, one tagline and a logo build at the end. Mellow 90 BPM bed.

## Files and when to read them

| File | Read when |
|---|---|
| `assets/templates/brief.md` | Step 1, collecting inputs |
| `references/story_template.md` | Step 2: section budgets per runtime, chapter grammar in beats, copy and prompt rules |
| `references/style_guide.md` | Step 3: palette roles, type, stage and window geometry, camera rules, audio |
| `references/motion_library.md` | Step 4 (motion IDs M1 to M20) and step 7 (component specs) |
| `references/toolchain.md` | Steps 5 and 6: screen capture, Remotion layout, camera world, render commands |
| `assets/remotion/tokens.ts`, `assets/remotion/camera.ts` | Step 6, copy into the project |

## Workflow

Steps 1 to 4 are cheap planning. Steps 5 onward cost real tokens and time, so there's an approval gate between them.

### 1. Brief
Copy `assets/templates/brief.md` into the project as `brief.md` and fill it from what the user gave you. If runtime, the feature, its use cases, the surfaces/screens, or brand basics are missing, ask once for all of them together. Defaults if they shrug: 60s, 1920x1080, 24fps, 3 chapters, default palette, Source Serif 4.

The user's copy wins. Use their opener line, tagline and prompts verbatim; only write what they left empty, and flag which lines you wrote.

### 2. Chapters
Read `references/story_template.md`. Pick the chapter count for the runtime, order use cases from simplest to most impressive, give each a different "way in", and write each chapter's prompt (or action), step line and reply summary. Invent one consistent fictional data universe (company, people, numbers) shared by all chapters, unless the user supplies real demo data.

### 3. Style
Read `references/style_guide.md`. Write `docs/style_guide.md` by mapping brand values onto the roles: brand accent → `accent` (and derive `accentWipe` / `accentGlow` from it), brand serif → card font, brand logo → logo build. Keep the warm neutrals unless the brand has its own light neutral. Keep every structural rule (one light stage, accent only when the AI acts, cuts only into close-ups, two text cards).

### 4. Shotlist, then stop
Fill `assets/templates/shotlist.md` into `docs/shotlist.md`. Times in beats and seconds; durations must sum exactly to the runtime. Each shot cites motion IDs and says wide or close-up. List the screenshots each chapter needs (before, after, any close-up states).

Show the user the chapters, style mapping and shotlist, then **stop and wait for approval**. A wrong shotlist wastes every step after it.

### 5. Screens (gate)
Read `references/toolchain.md`. Get a "before" and "after" screenshot per chapter into `public/screens/`, plus anything static the close-ups show (menus, empty panel), and the logo and fonts into `public/brand/`. If the app runs locally and the user agrees, capture them with Playwright at device scale factor 3; otherwise ask the user for them at the sizes in the toolchain. Never redraw UI from memory and never use screen recordings, they go soft in close-ups and can't be beat-timed. List what you have and what's missing, and **wait for the OK**.

### 6. Scaffold
Set up per `references/toolchain.md` (motion-studio setup, `motion.ts`, this skill's `tokens.ts` and `camera.ts`). Check current Remotion APIs with context7 before writing framework code. Set palette and fonts from step 3, load brand fonts locally via `staticFile`.

### 7. Build, one chapter at a time
Build only the motion components the shotlist uses, then the opener, each chapter, and the close. After each section, render stills (`npx remotion still ... --frame=<f>`) at the wide shot, the close-up and mid-wipe, and check them against the geometry in the style guide: window size and position, close-up scale, card type size, accent coverage. Fix gaps before moving on and report progress per section.

### 8. Sound
Follow "Synthesizing it" in the style guide with motion-studio's `score.mjs` (try 2 or 3 seeds, keep the calmest one that still moves) and `sfx.mjs`, mix to `public/mix.wav`, add `<Audio src={staticFile('mix.wav')} />`. If the user supplies a track, measure it with `beats.py`, set its BPM in `tokens.ts`, and re-time the shotlist to it.

### 9. Critique loop
Run motion-studio's critique loop (contact sheet of stills, half-scale drafts, phone test, sound-off test, determinism, loudness, 10 scores, fix the 3 worst, log in `docs/review_log.md`, minimum 3 rounds, every score 8+). Add these to its hunt list:
- a cut between two wide shots, or any camera move that isn't eased (whip, overshoot, linear zoom)
- accent on idle UI, text cards or the cursor
- a transform that starts before the camera settles on the wide shot
- an "after" screen that doesn't read as better from the wide shot
- close-ups where the screenshot goes soft (captured below 3x), or no window edge visible
- panel dead during a hold (reply not streaming)
- clicks or keystrokes audible over the bed

### 10. Render and deliver
`npx remotion render Main out/final.mp4 --codec=h264 --crf=16`, verified with `ffprobe` (duration, resolution and fps must match the brief exactly) and loudness at about -14 LUFS. Also `out/poster.png` (a mid-wipe frame) and `out/contact.png`. Report what you checked, including the final scores, then send the files to the user.

## Rules that make it feel right

1. One warm light stage for the whole film. No dark scenes, no background gradients, no grain.
2. The UI is the script. Only two text cards (opener, tagline) plus the logo. No captions, callouts, arrows or highlight boxes over the UI.
3. The accent shows up only when the AI acts: panel glow, working spark, wipe/bloom, logo mark.
4. Cut only into a close-up. Everything else is an eased camera move of about one beat.
5. Same chapter grammar every time, different way in every time.
6. Keep the panel alive during holds: the reply keeps streaming while the result sits on screen.
7. Calm over clever: no whips, shakes, speed ramps or bouncy springs.
