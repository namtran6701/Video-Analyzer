---
name: mobile-agent-video
description: Produce a calm launch film for an AI agent that lives in a phone app, in one fixed style (flat lavender stage, the app's chat UI in an oversized phone cropped by the frame, a notification cold open where the agent moves first, short serif claims built word by word between UI beats, reaction chips and result cards, a word swapped for a UI chip, a hand-drawn line that draws the logo in, a confetti payoff) from the user's brand and app UI. Ships the style spec, a 21-move motion library, an 8-act story template, brief/shotlist templates and Remotion helpers; produces it on the motion-studio pipeline (Remotion, synthesized 120 BPM bed, scored critique loop) and renders an MP4. Use when the user wants a mobile app launch video, an AI agent or assistant app promo, a chat-app feature film, or a video "like the Claude Duet one", even if they don't name this skill. Not for desktop or browser walkthroughs (claude-feature-video), kinetic-typography films (product-demo-video) or studying a reference video (video-study).
---

# Mobile Agent Video

Turn an agent app, its use cases and the user's brand into a 30 to 90s launch film in one fixed style, ending in a rendered MP4. The style is fully specified in this skill's references, so there is nothing to analyze. This skill owns the **style**; the **`motion-studio`** skill owns production (motion helpers, determinism rules, score, SFX, critique loop, delivery). Load motion-studio before step 6 and follow it wherever this file doesn't say otherwise.

The style in one paragraph: the agent makes the first move. The film opens on a single notification on a flat lavender stage, and that notification becomes the first message in an oversized phone whose edges run off the frame. From there it alternates two registers: UI beats, where the chat plays out (agent bubble, the user's short reply in a warm bubble, a reaction chip, typing dots, a result card), and claim beats, where a short serif line builds word by word on the bare stage beside or instead of the phone. The layout changes every beat (phone centered, text left and phone right, phone left and text right, one bubble floating alone) while the stage never changes color. A hand-drawn line in a darker lavender draws through the title and draws the logo in at the end. No voiceover, captions or cursor. Soft 120 BPM bed that thins under the claims; silent logo hold.

## Files and when to read them

| File | Read when |
|---|---|
| `assets/templates/brief.md` | Step 1, collecting inputs |
| `references/story_template.md` | Step 2: act budgets per runtime, act grammar in beats, claim and chat writing rules |
| `references/style_guide.md` | Step 3: palette roles, type, phone and layout geometry, timing, audio |
| `references/motion_library.md` | Step 4 (move IDs M1 to M21) and step 7 (component specs) |
| `references/toolchain.md` | Steps 5 and 6: UI kit, Remotion layout, phone rig, motion blur, confetti, render |
| `assets/remotion/tokens.ts`, `assets/remotion/line.ts` | Step 6, copy into the project |

## Workflow

Steps 1 to 4 are cheap planning. Steps 5 onward cost real tokens and time, so there's an approval gate between them.

### 1. Brief
Copy `assets/templates/brief.md` into the project as `brief.md` and fill it from what the user gave you. If runtime, the agent's use cases, the app's UI (screens or Figma) or brand basics are missing, ask once for all of them together. Defaults if they shrug: 60s, 1920x1080, 24fps, all 8 acts, default palette, Source Serif 4 for claims and the app's own UI font (Inter if there isn't one).

The user's copy wins. Use their claims, title line, CTA and chat lines verbatim; only write what they left empty, and flag which lines you wrote.

### 2. Acts and chat script
Read `references/story_template.md`. Pick the act budget for the runtime and write the chat script for every UI act: who says what, which reactions, which result card. Map use cases to acts: the best "it did this without being asked" moment goes to the Ping, the most visual result to Show it working, anything that needs the user's sign-off to Control. Invent one fictional universe (one person, their business or busy week, 3 or 4 running threads) shared by every act, unless the user supplies real demo data.

### 3. Style
Read `references/style_guide.md`. Write `docs/style_guide.md` by mapping brand values onto the roles: brand accent → `accent` (mark, logo, live edits only) and derive `bubbleUser` from it, brand serif → claim font, app UI font → UI, app mark → thread avatar, icon tile and line ending. Keep the lavender stage unless the brand has its own soft tinted mid-tone. Keep every structural rule.

### 4. Shotlist, then stop
Fill `assets/templates/shotlist.md` into `docs/shotlist.md`. Times in beats and seconds; durations must sum exactly to the runtime. Each row cites motion IDs and a layout (rest, close, split right, split left, bare, float, live edit). Something new must land every 1 to 2 beats.

Show the user the acts, chat script, style mapping and shotlist, then **stop and wait for approval**. A wrong shotlist wastes every step after it.

### 5. UI kit (gate)
Read `references/toolchain.md`. Collect the app's real UI into `public/ui/` (chat screen, both bubble styles, a result card, the notification, at 3x) and the icon, mark and fonts into `public/brand/`. Everything that animates gets rebuilt in React and matched against these references; never invent the app's UI from memory. List what you have and what's missing, and **wait for the OK**.

### 6. Scaffold
Set up per `references/toolchain.md` (motion-studio setup, `motion.ts`, this skill's `tokens.ts` and `line.ts`). Check current Remotion APIs with context7 before writing framework code. Set palette and fonts from step 3; load fonts locally via `staticFile`.

### 7. Build, one act at a time
Build only the moves the shotlist uses, then the acts in order. After each act, render stills (`npx remotion still ... --frame=<f>`) at the phone at rest, any split layout and a mid word build, and check them against the style guide: phone width and crop, claim size and gutter, UI text size, accent coverage. Put each still next to the matching `public/ui/` reference. Fix gaps before moving on and report progress per act.

### 8. Sound
Follow "Synthesizing it" in the style guide with motion-studio's `score.mjs` (try 2 or 3 seeds, keep the calmest one that still moves) and `sfx.mjs`, mix to `public/mix.wav`, add `<Audio src={staticFile('mix.wav')} />`. If the user supplies a track, measure it with `beats.py`, set its BPM in `tokens.ts`, and re-time the shotlist to it.

### 9. Critique loop
Run motion-studio's critique loop (contact sheet of stills, half-scale drafts, phone test, sound-off test, determinism, loudness, 10 scores, fix the 3 worst, log in `docs/review_log.md`, minimum 3 rounds, every score 8+). Add these to its hunt list:
- more than 2 beats with nothing new landing
- claim words appearing or leaving as a block instead of word by word
- accent on bubbles, cards, claims or banners (it belongs to the mark, logo and live edits)
- a phone fully inside the frame, or claims crowding the phone's bezel
- UI text under ~34px at rest
- motion blur on anything except phone whips, fast autoscroll and the whip scroll
- a travelling line without loops, without a moving tail, or drawn in ink
- confetti anywhere except the payoff
- music under the logo hold

### 10. Render and deliver
`npx remotion render Main out/final.mp4 --codec=h264 --crf=16`, verified with `ffprobe` (duration, resolution and fps must match the brief exactly) and loudness at about -14 LUFS. Also `out/poster.png` (a split-claim frame) and `out/contact.png`. Report what you checked, including the final scores, then send the files to the user.

## Rules that make it feel right

1. One flat lavender stage, start to finish. No gradients, grain, vignettes or dark scenes.
2. The agent moves first: open on its notification, never on a logo or the user asking.
3. Alternate registers: UI beat, claim beat, UI beat. Claims are short (2 lines, about 4 words a line) and build word by word.
4. The phone is oversized and cropped by the frame. It never sits fully in frame.
5. The agent does the talking; the user's replies are short and warm-colored. Show what it did (a card, a draft, a file), not how.
6. Accent only on the mark, the logo and text the agent is writing live.
7. Calm motion with a few fast whips: phones enter and leave fast with vertical blur, everything else eases. The only bounce is a tiny pop on reaction chips.
8. The hand-drawn line bookends the film; nothing else is decorative.
