---
name: news-explainer-video
description: Produce a ~100-second, Fireship-Code-Report-style news explainer in one fixed grammar (cold-open text card, ~200 wpm deadpan narration, every claim backed by an on-screen source screenshot with highlighter bars, red boxes, pointing hands and hand-drawn arrows, stamp labels on every named person or product, reaction memes as punchlines, hard cuts on the stressed word, a constant music bed) about one AI, marketing, e-commerce or social-platform story and what it means for how businesses get customers and make money. Ships a measured style guide, a 100s story template with word budgets, a 19-move motion library, brief and production-sheet templates and Remotion tokens; researches the story, writes the script, voices it with the channel's Gemini narrator voice, builds it on the motion-studio pipeline and renders an MP4. Use whenever the user wants a tech or business news video, a "Code Report"-style or "Fireship-style" explainer, a weekly episode for their channel, or a short video breaking down an announcement, even if they don't name this skill. Not for product launch films (product-demo-video), calm feature walkthroughs (claude-feature-video) or studying a new reference video (video-study).
---

# News Explainer Video

Turn one news story into a ~100s explainer that answers three questions: what changed, how does it work, and why should someone in business care. This skill owns the **story and style**; **`motion-studio`** owns production (determinism, motion helpers, sound, critique loop, delivery) and **`genmedia-assets`** owns the TTS and transcription calls. Load both before step 6 and follow them wherever this file doesn't say otherwise.

The style in one paragraph: dark near-black base, narration at ~200 wpm delivered flat so the jokes live in the wording. The base layer is evidence (source screenshots, announcement pages, pricing tables, code, keynote stills) and cuts about every 3s. On top of it, something changes every 1 to 2s: an orange highlighter wipes under the quoted phrase, a red box lands on the exact number and a pointing hand taps it, a hand-drawn arrow goes from old price to new, a stamp label names whoever just got mentioned. A reaction meme lands as the punchline after a fact, about one every 15 to 20s. Hard cuts on the stressed word, no dissolves, nothing animates out. Cold-open text card, a sting of 2s or less after the hook, and a takeaway card at the end.

## Files and when to read them

| File | Read when |
|---|---|
| `assets/templates/brief.md` | Step 1, collecting inputs |
| `references/story_template.md` | Steps 2 and 3: topic filter, section budgets, word counts, hook and joke patterns, field note |
| `references/style_guide.md` | Step 4: measured pace, cut rhythm, palette roles, type, transitions, audio |
| `references/motion_library.md` | Step 4 (move IDs N1 to N19) and step 8 (component specs) |
| `assets/templates/shotlist.md` | Step 4, the production sheet |
| `references/toolchain.md` | Steps 5 to 9: source capture, VO pipeline, word-timed cuts, project layout, render |
| `assets/remotion/tokens.ts` | Step 7, copy into the project and set the channel's skin |

## Workflow

Steps 1 to 4 are cheap planning. From step 5 on it costs real tokens and time, so there are gates.

### 1. Brief
Copy `assets/templates/brief.md` into the project as `brief.md`. If the story, runtime or channel skin is missing, ask once for all of it. Defaults if they shrug: 100s, 1920x1080, 30fps, the channel narrator voice (project CLAUDE.md), the starter skin in `tokens.ts`. If the user asks you to pick the story, find 3 candidates from the last 7 days, run each through the topic filter in the story template, and let them choose.

### 2. Research
Collect primary sources first (announcement, docs, pricing page, filing, original data), then one or two independent reports. Record every claim in the production sheet with its source URL and a **claim type**: `company claim`, `observed` (you or a third party measured it) or `my take`. Never present a company claim as observed. Find the field note: something the user has actually tried, or a concrete test they could run. Ask the user for it if you can't infer it.

### 3. Script
Read `references/story_template.md`. Write the one-sentence argument first, then the script to the word budgets (~300 words for 100s). Every sentence does one job: fact, mechanism, consequence or joke. Draft 3 titles. Read the script at 200 wpm (words ÷ 3.33 = seconds) and cut until it fits.

### 4. Production sheet, then stop
Fill `assets/templates/shotlist.md` into `docs/shotlist.md`: one row per sentence with narration, evidence, claim type, base visual, overlays (move IDs), and estimated seconds. Estimated durations must sum to the runtime. List every asset the episode needs and where it comes from.

Show the user the argument, titles, script and production sheet, then **stop and wait for approval**. A wrong script wastes everything after it.

### 5. Voiceover
Follow `references/toolchain.md`. Generate the narration with the channel narrator voice through genmedia-assets (voice and model come from the project's CLAUDE.md; never print the API key). Never use the user's own voice clone unless they explicitly ask for it in that request. One take for the whole script so the delivery stays continuous. Then transcribe it with word timestamps into `docs/vo_words.json`, aligned to the known script. Real durations now replace the estimates in the production sheet. If the take runs more than 5% over the runtime, trim words, not speed.

### 6. Assets (gate)
Capture every source screenshot at 2x with Playwright (or ask the user for it), and build the asset list: screenshots, stills, logos the user supplied, memes. Memes and third-party images are the user's call on rights: list them, say which are needed, and use only what the user supplies or approves. Never redraw a source page from memory. List what you have and what's missing, and **wait for the OK**.

### 7. Scaffold
Set up per `references/toolchain.md` (motion-studio setup, `motion.ts`, this skill's `tokens.ts`). Check current Remotion APIs with context7 before writing framework code. Set the channel skin in `tokens.ts`: palette roles, fonts, sting, sign-off.

### 8. Build, one section at a time
Build only the moves the production sheet uses, then each section (hook, what happened, how it works, stakes, field note, takeaway). Cuts and overlays are keyed to word timings from `docs/vo_words.json`, never to hand-typed frame numbers. After each section render stills at every cut and check them: evidence readable at phone size, overlays on the exact token being spoken, no frame static longer than ~2s unless it's a table being read.

### 9. Sound
Bed under the voice per the style guide (constant, ducked so VO sits ~5 dB above it, heavily compressed mix), pops on overlay entrances, one whoosh max per glitch transition. motion-studio's sound section has the tools. Mix to `public/mix.wav`.

### 10. Critique loop
Run motion-studio's critique loop (contact sheet, half-scale drafts, phone test, sound-off test, listen-only test, determinism, loudness, 10 scores, fix the 3 worst, log in `docs/review_log.md`, minimum 3 rounds, every score 8+). Add these to its hunt list:
- a claim on screen with no visible evidence, or evidence that doesn't match the claim
- a company claim presented as fact
- an overlay landing more than 3 frames off its spoken word
- a meme that isn't a punchline to the line before it, or two memes back to back
- a dissolve, slow ease, or anything animating out instead of cutting
- a frame static longer than ~2s that isn't a table or code being read
- the takeaway not paying off the hook

### 11. Render and deliver
`npx remotion render Main out/final.mp4 --codec=h264 --crf=18`, verified with `ffprobe` (duration, resolution and fps match the brief) and loudness at about -14 LUFS. Also `out/thumb.png` (the strongest single frame, one idea) and the description text with every source link. Report what you checked, including final scores, then send the files to the user.

## Rules that make it feel right

1. Evidence on screen for every claim. If you can't show it, cut the claim.
2. ~200 wpm, delivered flat. The joke is the word choice, not the voice.
3. Cut on the stressed word. Base layer every ~3s, overlays every 1 to 2s, slower only while the viewer reads.
4. A meme is a punchline after a fact, never filler. About one per 15 to 20s.
5. Nothing animates out. Pop in, cut away.
6. One story, one causal chain, one takeaway. The field note is the segment nobody else can make.
7. Borrow the grammar, never the skin: no Fireship logo, sting, sign-off or footage.
