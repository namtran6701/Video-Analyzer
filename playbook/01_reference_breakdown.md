# Reference Breakdown

Source: `Video/product_demo.mp4`. Times from 2fps frame extraction + scene detection (threshold 0.12).
Detected hard cuts: **4.07, 53.02, 66.57, 71.77, 72.71, 79.28s**. Everything else is a continuous move, morph, or mask/fade inside one "shot".

## Act map

| Act | Time | Len | Mode | Job |
|---|---|---|---|---|
| 1. Hook | 0.0 to 3.0 | 3.0s | Dark | Search bar morphs into headline "We killed ___" with competitor app icons sliding in |
| 2. Problem | 3.0 to 18.5 | 15.5s | Dark | Three-beat complaint ("They promised...", "Instead, they bury you in...", "Then, they stop when it gets real"), each visualized with UI props (dock, buttons, refusal chips) that get trashed |
| 3. Reveal | 18.5 to 21.5 | 3.0s | Dark to blue gradient to white | "Introducing" over dock, then logo wordmark on blue light-shaft gradient, washes out to white |
| 4. Positioning | 21.5 to 26.0 | 4.5s | Light | Logo + "A browser that gets complex work done", then "across 🌐 websites 🔑 accounts 🕘 history" with inline icons |
| 5. Demo | 26.0 to 53.0 | 27s | Light | Product UI: prompt typed, agent reasons step by step, expandable "Credit card" sources, sub-agents in parallel, result + playful user reply. A thin progress line with a blue dot threads through the whole act |
| 6. Proof | 53.0 to 56.5 | 3.5s | Dark | Benchmark bar chart, hero bar glows cyan, others grey |
| 7. Capabilities | 56.5 to 66.5 | 10s | Dark | "Anything you can do in a 🌐 browser" then "[logo] can do it for you" then "can do → sign in / messaging / internal tools / presentations" vertical slot-machine list |
| 8. Trust | 66.5 to 79.3 | 12.8s | Light | Icon morph, "everything is 🔒 private under your control", laptop prop, "runs locally, encrypted" (scramble text), password field toggles from visible to masked |
| 9. BYO | 79.3 to 84.0 | 4.7s | Dark | "Bring your own 🔑 subscription", partner model icons pop in a row then collapse into the logo |
| 10. CTA | 84.0 to 87.5 | 3.5s | Dark | "[logo] a browser that does your work", words fall away, URL remains |

## Rhythm

- Light/dark alternation is the macro-structure: **dark (problem) → light (solution) → dark (proof) → light (trust) → dark (close)**. Every mode flip is a hard cut or a fast wash. That's the only place hard cuts live.
- Inside an act, nothing cuts. Words and props morph, slide, blur in and out on a steady beat.
- One new text idea every **~1.5 to 2.5s** (3 to 5 beats at ~115 BPM).
- Demo act is the only long stretch (27s) and it's slowed down on purpose: smaller type, real UI, the camera follows a vertical scroll.

## Key frames worth looking at

`refs/contact_0..3.png` (each sheet = 22s, 6 per row, 0.5s per tile). Specific frames in `refs/frames/`:

| Frame | t | Shows |
|---|---|---|
| f_007 | 3.0s | Headline with app icons in pill |
| f_015 | 7.0s | Stacked "Connect App" buttons with motion-blur copies |
| f_035 | 17.0s | Refusal chips flying into trash |
| f_042 | 20.5s | Blue light-shaft logo reveal |
| f_050 | 24.5s | Inline-icon text "across websites accounts history" |
| f_068 | 33.5s | Expandable source list + embedded site screenshot |
| f_112 | 55.5s | Benchmark bars |
| f_128 | 63.5s | Vertical slot list "can do → ..." |
| f_150 | 74.5s | Scramble text "locally, enc9,:GRP" |
| f_156 | 77.5s | Password field eye toggle |
