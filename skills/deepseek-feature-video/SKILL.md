---
name: deepseek-feature-video
description: Produce a DeepSeek-Harness-style feature launch video in one fixed "claim, then proof" style (white stage, one-line Montserrat cards typed with a caret and one blue payoff word, a cursor-driven hero demo under a tilting virtual camera with no hard cuts, prompt to send-button close-up to agent log to working result, then an escalation ladder "What about something more ADVANCED?" / "Like A ... Or A ... Even A ...", a fast montage with "Everything / Everywhere / All At Once", black caret-glow tagline and logo scatter, music only) from the user's product, screens, recordings and brand. Ships the measured style spec, a 22-move motion library with look frames, a 6-act story template, brief/shotlist templates and Remotion tokens plus a 3D-tilt camera helper; produces it on the motion-studio pipeline (Remotion, Lyria at 150 BPM conformed to the grid, synthesized drafts, SFX, scored critique loop) and renders an MP4. Use whenever the user wants a "DeepSeek-style" or "Creator Mode-style" launch video, an AI agent/builder feature video that shows prompts turning into working apps, or a video "like the DeepSeek Harness one", even if they don't name this skill. Not for calm ivory walkthroughs with an AI side panel (claude-feature-video), dark kinetic-typography launch films (product-demo-video), or studying a new reference video (video-study).
---

# DeepSeek Feature Video

Turn a feature, one hero use case, a ladder of bigger builds and the user's screens/recordings into a 45 to 100s launch film in one fixed style, ending in a rendered MP4. The style is fully specified in this skill's references (measured from the reference kept in `references/deepseek-harness/` at the repo root), so there is nothing to analyze. This skill owns the **style**; **`motion-studio`** owns production. Load motion-studio before step 6 and follow it wherever this file doesn't say otherwise.

The style in one paragraph: make a claim, then prove it. Black logo open on navy smoke, "Introducing" typed by a glowing caret, the feature name stacks into a wall and scrolls away to reveal the app. A cursor and a tilting camera run one use case end to end with no hard cuts: card ("Create Plugin, **Instantly**"), push-through into the composer, prompt typed, extreme close-up on the send click, the button collapses into a dot and a progress pill, an agent log streams, the result works and flips state. Then the ladder: "What about something more **ADVANCED?**", three rungs, each card followed by the thing working. Then "Ultimately, **Your Own ...**", a montage that speeds up through "Everything / Everywhere / All At Once", a tagline typed on black and wiped by the caret, logo scatter on white. White stage, one blue word per card, Montserrat, music only.

## Files and when to read them

| File | Read when |
|---|---|
| `assets/templates/brief.md` | Step 1 |
| `references/story_template.md` | Step 2: act budgets per runtime, hero beats, ladder, copy rules |
| `references/style_guide.md` | Step 3: palette, type tiers, rhythm, camera, transitions, audio |
| `references/motion_library.md` + `assets/look/` | Step 4 (IDs D01-D22) and step 7 (component specs; match the look frame) |
| `references/toolchain.md` | Steps 5 and 6 |
| `assets/remotion/tokens.ts`, `assets/remotion/camera.ts` | Step 6, copy into the project |

## Workflow

Steps 1-4 are cheap planning. Step 5 onward costs real tokens and time, so there are approval gates.

### 1. Brief
Copy `brief.md` into the project and fill it from what the user gave you. If runtime, feature name, the hero use case, the ladder rungs, or brand basics are missing, ask once for all of them together. Defaults: 60s, 1920x1080, 30fps, Montserrat, accent `#1d64db`, music only. The style has no voiceover; if the user asks for one, say it breaks the style once, then do it (Gemini voice per the repo's CLAUDE.md, captions low and small).

The user's copy wins. Use their lines verbatim; write only what's missing and flag it.

### 2. Story
Read `story_template.md`. Pick the act budgets for the runtime, write every card (Title Case, payoff word last), the composer prompt, the agent log lines and the ladder rungs smallest to wildest.

### 3. Style
Read `style_guide.md`. Write `docs/style_guide.md` by mapping brand values onto the roles (accent, font, logo, smoke tint). Keep every structural rule: white middle, black bookends, one accent word per card, no cuts in the hero demo, cuts accelerate after it.

### 4. Shotlist, then stop
Fill `shotlist.md` into `docs/shotlist.md`. Times in beats and seconds; durations sum exactly to the runtime. Each row cites motion IDs. List every screen and recording needed. Show the user the story, style mapping and shotlist, then **stop and wait for approval**.

### 5. Assets (gate)
Read `toolchain.md`. Gather hero-demo screens at 3x (or plan React rebuilds of those components), screen recordings for each ladder rung and the montage, orbit-cloud crops, logo and fonts. List what you have and what's missing and **wait for the OK**. Never fake a recording with a still pan; never redraw UI from memory.

### 6. Scaffold
Per `toolchain.md`: project in `projects/`, workspace install, `motion.ts`, this skill's `tokens.ts` and `camera.ts`. Load fonts locally or via `@remotion/google-fonts`.

### 7. Build, one act at a time
Build only the components the shotlist uses, then each act in order. After each act, render stills at its key frames (`npx remotion still ... --frame=<f>`) and compare them side by side with the matching `assets/look/` frames: type size and position, tilt angle, accent coverage, shadow. Fix gaps before moving on and report progress per act.

### 8. Sound
Drafts: synthesized bed via motion-studio's `score.mjs` at 150 BPM. Final: 2 Lyria takes (confirm the generation first; the user picks one), bright driving electronic, conformed to 150 BPM with motion-studio's conform steps. SFX per the style guide (key ticks, send click, push-through whoosh). Mix to `public/mix.wav`. With a licensed track, measure its BPM and re-time.

### 9. Critique loop
Run motion-studio's critique loop (minimum 3 rounds, every score 8+, log in `docs/review_log.md`). Add these to its hunt list:
- a hard cut inside the hero demo, or a frame that sits dead still
- more than one accent word on a card, or accent on idle UI
- text that re-centers while typing, or bold/pure-black type
- a claim card whose proof doesn't appear within 2s
- cuts that slow down after the ladder instead of speeding up
- soft UI in a close-up (captured below 3x or a recording used in a close-up)
- any voiceover, caption, arrow or highlight box (unless the user asked)

### 10. Render and deliver
`npx remotion render Main out/final.mp4 --codec=h264 --crf=16`, verify with ffprobe (duration, resolution, fps match the brief exactly) and loudness at about -14 LUFS. Copy to `deliverables/YYYY-MM-DD_<slug>.mp4`, plus `out/poster.png` (the first accent-flip card) and `out/contact.png`. Report the final scores, then send the file to the user.

## Rules that make it feel right

1. Claim, then proof. Every card is answered on screen within 2 seconds.
2. White middle, black bookends. Smoke only behind the logo and floated windows.
3. One blue word per card, typed in ink and flipped (early cards) or typed in blue (later cards).
4. The hero demo is one continuous camera move driven by a cursor: tilt in, swing to send, collapse, pull back.
5. Escalate the asks and accelerate the cuts. Never slow down before the close.
6. Montserrat, regular weight, Title Case, one line, centered on its final width.
7. Music only. The cuts and accent flips land on the beat.
