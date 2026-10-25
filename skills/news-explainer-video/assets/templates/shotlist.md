# Production Sheet

Runtime: __s · FPS: 30 · Words: __ (target ~3.33 per second) · Argument: __

One row per sentence. Est (s) = words ÷ 3.33 until the VO exists; then replace with real durations from `vo_words.json`.

| Row | Section | Narration (exact) | Job | Claim type | Evidence (source #) | Base visual | Overlays (move IDs, on which word) | Cut on word | Est (s) | Real (s) |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Hook | | consequence / joke | my take | | N1 card | | | | |
| 2 | Sting | (none) | | | | N2 | | | 2.0 | |
| 3 | What happened | | fact | company claim | 1 | N3 announcement | N4 on "...", N8 on name | | | |
| 4 | How it works | | mechanism | observed | 2 | N3 docs | N5 + N6 on "...", N7 | | | |
| 5 | How it works | | mechanism | | | N18 chain | | | | |
| 6 | Stakes | | consequence | my take | | | N10 + meme | | | |
| 7 | Field note | | fact | observed | own test | screen of test | N5 on result | | | |
| 8 | Takeaway | | consequence | my take | | N19 card | | | | |

Job: fact, mechanism, consequence or joke. Claim type: company claim, observed or my take.

Check: Est sums to the runtime within 5%. Every fact row has evidence. Base visual changes at least every ~3s of narration (split long rows into several base visuals). Memes about one per 15 to 20s, never adjacent. Takeaway pays off the hook.

## Assets needed

| File | Row | Source | Status |
|---|---|---|---|
| public/evidence/r03-announcement.png | 3 | URL | to capture |
