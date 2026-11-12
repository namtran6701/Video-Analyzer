---
disable-model-invocation: true
name: app-tutorial-video
description: Make or update a narrated phone-app tutorial or "what's new" video (real app screens in a phone frame on a warm stage, a calm camera, voiceover with captions in a side column, one chapter per task, serif opener and tagline, logo close) where every screen change, tap, camera move and chapter is anchored to a spoken word, so re-voicing re-times the whole film. Covers new videos and patching an existing one (new lines spliced into the old take, music extended by whole bars, SFX re-timed) without regenerating everything, plus publishing through the app's own announcement channel. Built on claude-feature-video (style), motion-studio (pipeline) and genmedia-assets (voice, transcript, music). Use when the user wants an app tutorial, onboarding video, training video, app update or release-notes video for staff, or asks to change, re-voice, add a line to, or fix the camera in an existing tutorial video. Not for desktop feature launches with an AI panel (claude-feature-video) or kinetic-type promos (product-demo-video).
---

# App tutorial video

A 60 to 120s narrated walkthrough of a phone app, one chapter per task the viewer must learn, ending in an MP4 plus an `.srt`. This skill owns the **phone-tutorial format, the word-anchored timeline, the calm camera and the patch workflow**. It leans on:
- **`claude-feature-video`** for the visual style (stage, cards, accent wipe, chapter grammar). Read its `references/style_guide.md` once; ignore its browser window and AI panel.
- **`motion-studio`** for production (Remotion rules, SFX, mixing, critique loop, delivery). Load it before building.
- **`genmedia-assets`** for TTS, transcription and Lyria. Every generation is confirmed with the user first (what and how many).

## Files

| File | Use |
|---|---|
| `assets/remotion/PhoneTutorial.tsx`, `tokens.ts` | The whole film component. Copy to `src/`. Set `brand`, `color`, `font` in `tokens.ts` from the app. |
| `assets/scripts/resolve.mjs` | Resolves `src/<name>.src.json` against the VO transcript. Copy to `scripts/`. |
| `assets/templates/tutorial.src.json` | Timeline skeleton showing every field. |
| `references/timeline.md` | Anchor syntax, what each field does, how to run the resolver. |
| `references/camera.md` | Camera rules. Read before writing any camera key. |
| `references/patch.md` | Changing narration, adding lines or re-timing an existing video. |

## New video

1. **Brief.** Audience, the tasks to teach (simplest first), runtime, brand (accent color, fonts, logo, icon), tagline, what must never be shown (pay, other roles' screens, real people). Voiceover is on: ask the user to pick the voice once (`list_gemini_voices`), then keep it for every future video of that app.
2. **Screens.** Seed demo data locally (never production, never real names), capture each state with Chrome DevTools MCP at a 390x844 viewport, DPR 4, into `public/screens/<nn>-<name>.png`. One PNG per state the viewer must see (empty form, filled form, confirm, result). Note the CSS-pixel position of every button you'll tap.
3. **Script.** One short paragraph per chapter. Each chapter's first sentence names the screen it happens on, and that screen must be visible before the sentence starts. Say the button labels exactly as the app spells them. Lock it with the user before generating.
4. **Voice.** One TTS take of the whole script (`gemini-3.8-flash-tts`, the chosen voice, prompt `warm, friendly, unhurried tutorial narrator`) to `public/vo_take.wav`. Transcribe with word timestamps and the app's button labels in `custom_vocabulary` to `docs/vo_transcript.json`.
5. **Timeline.** Write `src/tutorial.src.json` from the template (see `references/timeline.md`, `references/camera.md`), run `node scripts/resolve.mjs tutorial`. It writes `src/tutorial.json`, `src/captions-tutorial.json`, `public/vo-tutorial.wav` (long pauses trimmed) and `out/captions-tutorial.srt`, and prints every caption page with its time. Read that list: it's the fastest check that anchors and caption breaks are right.
6. **Sound.** Music bed per motion-studio (Lyria final, synthesized for drafts), SFX cues in `docs/sfx.json` (`click` on taps, `swish` on wipes, `chime` on notifications, gain 0.3 to 0.45) rendered with `sfx.mjs`, then motion-studio's ducked voiceover mix into `public/mix.wav`.
7. **Check.** Contact sheet every 2.5s at `--scale=0.25`, LOOK at it. Then a 12-frame motion strip around each chapter start. Fix, re-render only the affected frames, then the full render. Loudness about -14 LUFS, true peak under -1.

## Rules that make it work

1. The screen a line talks about is on screen before the line starts. Anchor the screen change (and the tap that causes it) to the line's first word with a negative offset, never to a word later in the sentence.
2. Captions live in the right-hand column, never over the phone. Fix transcript spellings with `fix` (brand names, `6:00 p.m.`); use a non-breaking hyphen (U+2011) for hyphenated words so they don't split across lines.
3. One chapter per task, numbered `NN / total`. Six is plenty for 90s.
4. Accent only on the moment a request is sent: the accent tap and the wipe to the result.
5. Calm camera, always (see `references/camera.md`). If a viewer could feel motion, it's too much.

## Shipping

Deliver the MP4 and the `.srt` together; autoplay is usually muted, so captions are required. If the app has its own announcement or video channel, publishing goes through the app owner's account: hand the user both files (reveal them in Finder) and the exact steps, and say what viewers will experience (for example, a new announcement shows once to everyone in that role on their next sign-in). Never publish on the user's behalf through someone's signed-in session.
