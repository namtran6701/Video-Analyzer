---
name: deepseek-feature-video
description: Style direction for a DeepSeek-Harness-style feature launch video, produced on the motion-studio pipeline. One fixed "claim, then proof" style (white stage, one-line Montserrat cards typed with a caret and one blue payoff word, a cursor-driven hero demo under a tilting virtual camera with no hard cuts, prompt to send-button close-up to agent log to working result, then an escalation ladder "What about something more ADVANCED?" / "Like A ... Or A ... Even A ...", a fast montage with "Everything / Everywhere / All At Once", black caret-glow tagline and logo scatter, music only). Ships the measured style spec, a 22-move motion library with look frames, a 6-act story template, brief/shotlist templates and Remotion tokens plus a 3D-tilt camera helper; motion-studio does the production (gates, build, score, SFX, critique loop, delivery). Use whenever the user wants a "DeepSeek-style" or "Creator Mode-style" launch video, an AI agent/builder feature video that shows prompts turning into working apps, or a video "like the DeepSeek Harness one", even if they don't name this skill. Not for calm ivory walkthroughs with an AI side panel (claude-feature-video), dark kinetic-typography launch films (product-demo-video), or studying a new reference video (video-study).
---

# DeepSeek Feature Video

**motion-studio is the production skill. This skill is the style direction.** Load motion-studio first and run its pipeline end to end (gates, lane plan, build, sound, critique loop, deliverables). This skill only says what to feed into each of its stages so the film comes out in this style. Wherever this skill is silent, motion-studio's rules apply. Where they conflict, the overrides listed below win, and only those.

The style in one paragraph: make a claim, then prove it. Black logo open on navy smoke, "Introducing" typed by a glowing caret, the feature name stacks into a wall and scrolls away to reveal the app. A cursor and a tilting camera run one use case end to end with no hard cuts: card ("Create Plugin, **Instantly**"), push-through into the composer, prompt typed, extreme close-up on the send click, the button collapses into a dot and a progress pill, an agent log streams, the result works and flips state. Then the ladder: "What about something more **ADVANCED?**", three rungs, each card followed by the thing working. Then "Ultimately, **Your Own ...**", a montage that speeds up through "Everything / Everywhere / All At Once", a tagline typed on black and wiped by the caret, logo scatter on white. White stage, one blue word per card, Montserrat, music only.

## Files

| File | Feeds |
|---|---|
| `assets/templates/brief.md` | Before motion-studio's gates: what to collect from the user |
| `references/story_template.md` | Gate 3 (shotlist): acts, budgets, hero beats, ladder, copy rules |
| `references/style_guide.md` | Gate 2 (style guide) and the build: palette, type, rhythm, camera, easing, transitions, audio and energy arc |
| `references/motion_library.md` + `assets/look/` | Gate 3 (motion IDs) and the build (component specs; each ID has a look frame to match) |
| `references/toolchain.md` | Gate 1, lane plan and build: what's React vs screenshot vs recording, capture specifics, the hero-demo camera |
| `assets/templates/shotlist.md` | Gate 3: motion-studio's shotlist with this style's columns filled in |
| `assets/remotion/tokens.ts`, `camera.ts` | Build: copy next to motion-studio's `motion.ts` |

## What to add at each motion-studio stage

**Before the gates: brief.** Fill `brief.md` from what the user gave you. If runtime, feature name, the hero use case, the ladder rungs or brand basics are missing, ask once for all of them together. Defaults: 60s, 1920x1080, 30fps, Montserrat, accent `#1d64db`. When motion-studio asks about a voiceover, the style answer is no; if the user wants one anyway, say once that it breaks the style, then follow motion-studio's voiceover section. The user's copy wins; flag every line you wrote.

**Gate 1, brand.** Capture per motion-studio, plus this style's needs from `toolchain.md`: hero-demo screens at 3x, screen recordings for each ladder rung and the montage, 12-16 crops for the orbit cloud, logo lockup parts (mark, wordmark, pill).

**Gate 2, style guide.** Write `docs/style_guide.md` from `references/style_guide.md`, mapping brand accent, font, logo and smoke tint onto its roles. Keep every structural rule.

**Gate 3, shotlist.** Use `story_template.md` for the acts and copy, `assets/templates/shotlist.md` for the table (it already has motion-studio's Energy and Lane columns, pre-filled with this style's energy arc). BPM 150, palette `analog`.

**Gate 4, lane plan.** Everything is 2D. Montage and ladder results are screen recordings inside the 2D comp.

**Gate 5, generation list.** Typically: 2 Lyria takes, and 4 "Everywhere" scene illustrations if the user has none. Nothing else in this style is generated.

**Build.** Copy `tokens.ts` and `camera.ts` beside `motion.ts`. Build one act at a time; after each act render stills at its key frames and compare them side by side with the matching `assets/look/` frames (type size and position, tilt, accent coverage, shadow).

**Sound.** motion-studio's sound section, with this style's palette, BPM and energy arc from `style_guide.md`. SFX limited to key ticks, the send click and push-through whooshes, plus the riser/impact cues motion-studio adds on energy steps.

**Critique loop.** motion-studio's loop, plus this hunt list:
- a hard cut inside the hero demo, or a frame that sits dead still
- more than one accent word on a card, or accent on idle UI
- text that re-centers while typing, or bold/pure-black type
- a claim card whose proof doesn't appear within 2s
- cuts that slow down after the ladder instead of speeding up
- soft UI in a close-up (captured below 3x, or a recording used in a close-up)
- any voiceover, caption, arrow or highlight box the user didn't ask for

**Deliverables.** motion-studio's, plus the repo convention: copy the final to `deliverables/YYYY-MM-DD_<slug>.mp4`. Poster frame = the first accent-flip card.

## Overrides of motion-studio defaults (only these)

| motion-studio default | This style | Why |
|---|---|---|
| BPM 100-124 for promos | 150 | Reference measures 146.7; the short cards and fast typing need it |
| Hook in the first 2s | 3-6s logo open on smoke | It's the style's signature open; keep it to 3-4s at 60s and under |
| Springs for camera | Cubic ease-in-out camera (`camera.ts`); springs stay for UI, cursor and cards | The reference camera never overshoots |
| Voiceover asked, open either way | Music only by default | The cards carry the story; the sound-off test passes by design |
| All formats laid out | 16:9 native; 9:16 only as a stated adaptation | The tilted-window camera doesn't survive vertical |

## Rules that make it feel right

1. Claim, then proof. Every card is answered on screen within 2 seconds.
2. White middle, black bookends. Smoke only behind the logo and floated windows.
3. One blue word per card, typed in ink and flipped (early cards) or typed in blue (later cards).
4. The hero demo is one continuous camera move driven by a cursor: tilt in, swing to send, collapse, pull back.
5. Escalate the asks and accelerate the cuts. Never slow down before the close.
6. Montserrat, regular weight, Title Case, one line, centered on its final width.
7. Music only. The cuts and accent flips land on the beat.
