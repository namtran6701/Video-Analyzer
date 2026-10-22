# Motion Library

Reusable moves for this style, each a component or pattern to build once and reuse. Frame counts are at 24fps. All in Remotion, 2D lane.

Helpers: `tokens.ts` holds the beat grid, timings and `wordIn` / `wordOut`; `line.ts` builds the travelling line. Objects that move as a whole (phone, cards, chips, banners, scroll) use `motion.ts` from motion-studio: `default` for phone poses, cards, docking and scroll, `snappy` only for reaction-chip pops and the payoff punch. Never `playful` or `title`. Seeded noise via Remotion `random(seed)`; no CSS transitions. Vertical motion blur is the SVG filter in `toolchain.md`.

| # | Move | Used in |
|---|---|---|
| M1 | Notification banner | Ping, Payoff |
| M2 | Banner handoff | Ping |
| M3 | Phone whip in / out + drift | Every phone act |
| M4 | Word build | Title, claims, CTA |
| M5 | Word exit | Title, claims, CTA |
| M6 | Eyebrow pill | Title, Close |
| M7 | Travelling line | Title, Close |
| M8 | Chat bubbles | Every phone act |
| M9 | Typing dots | Show it working, Reports back |
| M10 | Reaction chip | Show it working, Reports back |
| M11 | Result card + count-up | Show it working, Reports back |
| M12 | Autoscroll | Every phone act |
| M13 | Split claim + side swap | Claims run |
| M14 | Focus lift | Claims run |
| M15 | Float and dock | Reports back |
| M16 | Word-to-chip swap | Control |
| M17 | Card rise and dock | Control |
| M18 | Live edit | Control |
| M19 | Whip scroll | Control → Payoff |
| M20 | Celebration banner + confetti | Payoff |
| M21 | Line to logo | Close |

## Specs

### M1 Notification banner
- iOS-style banner, ~1362 x 310px, centered on the frame, radius ~52px, `stageLift` fill with a 1px inner border of white at 40%, faint float shadow.
- Content: icon tile (~112px, `card` fill, mark in `accent`) at left; app name (semibold) and a 2-line message in `uiInk` at ~50px; "now" at the top right in `uiInk` at 50%.
- In: opacity 0 → 1 and a 16px drop over 8 frames (`default`). Hold with a slow ±4px vertical drift.
- Ping message: a greeting plus 2 or 3 things the agent has lined up for today. Payoff message: the outcome, with one emoji.

### M2 Banner handoff
- The banner scales 1 → 0.55 around its center over 10 frames (ease-in cubic), fading out over the last 2.
- Next frame: the phone whips in at rest (M3) with only its thread header showing.
- 4 frames after the phone settles, the banner's message fades in (3 frames) as the first agent bubble. One beat later a longer agent bubble lands (the day's brief: numbered items with bold lead-ins) and autoscroll (M12) brings it up. The act ends on an agent offer to do one task right now, which the next act picks up.

### M3 Phone whip in / out + drift
- In: from fully below the frame to its pose in 6 frames, ease-out cubic. Vertical blur scales with speed (max sigma ~24px), so the first 3 frames smear and the landing is sharp.
- Drift: while a phone layout holds, it rises ~1.5% of frame height per second, linear. Any other move takes over from the drifted position.
- Out: pose → fully above the frame in 10 to 14 frames, ease-in cubic, blur scaling with speed.
- A phone entering a close layout enters already at close scale; it never zooms after landing (except M18).

### M4 Word build
- Split the line into words (punctuation stays attached). Word `i` fades 0 → 1 over 6 frames (ease-out cubic) starting at `start + 2i` frames. No translate, blur or scale. `wordIn(frame, start, i)` in `tokens.ts`.
- Two-line claims: line 2 starts straight after line 1, or 1 to 2 beats later when a UI element enters between them (split layouts).

### M5 Word exit
- Word `i` fades 1 → 0 over 4 frames starting at `start + 2i`, left to right. Both lines run in parallel, each indexed from its own first word. `wordOut(frame, start, i)` in `tokens.ts`; multiply it with `wordIn`.

### M6 Eyebrow pill
- The status pill from the style guide, centered ~150px above the wordmark or CTA. Fades in with the first word (6 frames) and out with the text. Same label at the title and the close.

### M7 Travelling line
- One open stroke in `line`, 7px wide, round caps and joins, no fill. Shape: a long gentle wave with 2 or 3 cursive loops in the middle, spanning wider than the frame (start ~10% past the left edge, end ~10% past the right). `loopPath(from, to)` in `line.ts`; its defaults (`loops` 10, `curl` 3, `wave` 140) give three round loops about 2.5x the claim's cap height in the middle third. Put `from` and `to` ~40px below the text's baseline so the loops rise through the letters.
- The head draws along the path and the tail erases behind it: `travel(length, head, tail)` returns the stroke style. Head runs 0 → 1, tail runs 0 → 1 starting when the head reaches ~0.35, both ease-in-out. It sits above the text layer.
- Title: the head enters from the left ~1 beat after the wordmark lands, its loops pass through the letters, and it crosses in ~40 frames. Each word of the wordmark exits (M5) as the tail reaches it, and the promise line builds (M4) behind the head. The tail clears the right edge about a beat later.
- Close: see M21. Never use it anywhere else.

### M8 Chat bubbles
- Agent: left-aligned, `bubbleAgent`, radius ~20pt, max ~78% of screen width, `uiInk` text. User: right-aligned, `bubbleUser`, small curled tail at the bottom right, 2 to 8 words.
- Spacing: 8pt between bubbles from the same speaker, 16pt between speakers. Attachments ride under the agent bubble as small white file tiles (type label + filename).
- Arrive: opacity 0 → 1 over 4 frames plus an 8px rise (`default`). Each arrival drives autoscroll (M12).

### M9 Typing dots
- Three 6pt dots in `uiInk` inside a small `bubbleAgent` pill. Each dot rises 3pt and brightens in a wave: offset `sin(2π(t / 0.6 - i / 6))`.
- Shows 1 to 2 beats before an agent reply, then the reply replaces it in place.

### M10 Reaction chip
- White circle (~22pt) with one emoji, hanging off the bubble's bottom corner (bottom left on agent bubbles, bottom right on user bubbles), 1px border at `rgba(0,0,0,.06)`.
- Pop: scale 0 → 1 with `snappy` (tiny overshoot, settled in ~6 frames). One per exchange: the user reacts to the agent (thumbs up, heart, eyes) or the agent reacts to the user's decision (star).

### M11 Result card + count-up
- White card at full thread width, radius ~16pt, 1px border at `rgba(0,0,0,.06)`. Footer row: small icon, title + a freshness line in two lines, pin icon, chevron.
- Body variants: a 2x2 KPI grid (small dim label, large value, small dim delta), or a summary (1 to 2 lines, then a dim meta line like "4 items · due Friday").
- Arrive like a bubble over 6 frames. KPI values tick from ~95% of their final value to final over ~2s (ease-out), rounded to display precision, while the freshness line reads as just updated, so the card looks live while it holds.

### M12 Autoscroll
- The thread scrolls so the newest element's bottom sits ~78% down the visible phone. Scroll position runs through `track()` with `default`, one key per arrival.
- When the scroll moves faster than ~40px per frame, apply vertical blur scaled to speed.

### M13 Split claim + side swap
- Split right: line 1 builds at x=96; the phone (close scale) slides in from beyond the right edge over 12 frames (ease-out) to its split pose with a new agent message landing; line 2 builds on the next beat.
- Side swap: the old claim sweeps out (M5); the phone slides from the right pose to the left pose over 12 frames (ease-in-out); the new claim builds at x=1056 as the phone settles.
- The phone stays live during claims: one new agent message per claim, showing the claim's behavior (it noticed something, drafted something, put something off).
- Claims 1 and 2 read as one sentence across the swap: claim 2 starts with "and".

### M14 Focus lift
- On a split or rest layout: the veil (`stage` at 50%) fades over the phone in 12 frames, except one bubble, which lifts: scale 1 → 1.12 around its center, fill → `card`, float shadow in, all over 12 frames (`default`). Hold at least 2 beats.
- Use it when the claim is about one specific message.

### M15 Float and dock
- One agent bubble at close scale fades in alone on the bare stage (4 frames + 8px rise), centered. 1 to 2 beats later a reaction chip pops (M10).
- Dock: the phone (close scale) rises from below behind the bubble over 12 frames (ease-out), ending with the bubble exactly in its thread position; the thread header and earlier messages fade in over the last 4 frames. The conversation then continues (M9, M8, M11).
- Build trick: lay the thread out first and float the bubble at its thread position; the dock only translates the phone up to meet it.

### M16 Word-to-chip swap
- A one-line claim on the bare stage. One word fades to 30% over 6 frames, then to 0 over 3. Its neighbors part to open a gap the chip's width over 4 frames (`default`), and a real agent bubble rises 12px into the gap while fading in over 4 frames.
- The chip uses the UI font at ~40% of the claim's size, vertically centered on the claim's x-height. Pick the word so the chip *is* the thing the sentence talks about (it replaces "reply" in "Every reply waits for you").

### M17 Card rise and dock
- ~2 beats after M16 lands: a draft card (header row with icon, type label and two action icons; dim recipient and subject rows; body; attachment row; an outlined dismiss button and a primary action button filled in `uiInk`) rises from below the frame into the lower half over 16 frames (ease-out), at close scale, cropped by the frame bottom.
- Dock: the claim and chip slide up and out while the phone (close scale) rises around the card over 12 frames; the card ends as a message in the thread. Then the user's short edit request arrives (M8).

### M18 Live edit
- Scale the phone group to ~1.9x around the card body over 12 frames (`default`).
- New words type into the body in `accent` (~3 words per 4 frames) and each turns `uiInk` ~12 frames after it lands. Wrapping pushes the attachment row and buttons down (`default`). About 1s for 8 words.

### M19 Whip scroll
- Back at close scale, the thread scrolls up with ease-in over ~24 frames as the wrap-up messages stream past (the approval, the agent's confirmation). Vertical blur grows with speed to ~30px sigma. Hard cut to the bare stage at the blur peak.

### M20 Celebration banner + confetti
- A banner (M1) lands at normal size on the bare stage with the outcome message.
- ~1 beat later: punch to 1.6x over 3 frames (`snappy`), its right side running off the frame. Same frame: ~60 confetti pieces (6 x 12px rectangles, palette colors) burst from the banner's right third, with velocities fanned upward and outward in a ~120° cone, gravity, spin and drag, falling out of frame over ~36 frames. Seeded, closed-form (see `toolchain.md`).
- Hold ~1 beat after the burst, then cut to the close.

### M21 Line to logo
- CTA (2 lines) builds on the bare stage with the eyebrow pill (M4, M6); hold ~3 beats.
- The line (M7) starts under the CTA's last word and draws right. The stage group pans left to follow the head over ~24 frames (ease-in-out), carrying the CTA off the left edge.
- Where the head stops, the icon tile pops in (`snappy`, 4 frames). The wordmark types on letter by letter to its right while the pan settles with the lockup centered. The tail catches up and the line fades out over 8 frames under the lockup.
- About a beat later the URL lands near the bottom: domain fades in (4 frames), path types ~1.5 characters per frame.
- Hold still and silent to the end (~4s).
