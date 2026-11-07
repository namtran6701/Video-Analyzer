# Word-anchored timeline

Nothing in the film has a hard-coded time. Every event points at a spoken word, and `resolve.mjs` turns words into seconds from the transcript. Change the narration, re-run the resolver, and everything follows.

## Anchors

`{ "at": "<word>#<n>", "end": true?, "d": <seconds> }`

- `word` is the transcript word lowercased with punctuation stripped (`"Off."` → `off`, `"can't"` → `can't`, `"6:00"` → `6:00`). Hyphenated words collapse (`one-time` → `onetime`).
- `#n` is the nth occurrence in the whole script, 1-based; `#1` can be left off. Adding a sentence that repeats a word shifts every later count of that word. After any script change, list counts before editing anchors:
  `node -e 'const w=require("./docs/vo_transcript.json").segments.flatMap(s=>s.words);const c={};w.forEach(x=>{const k=x.word.toLowerCase().replace(/[^a-z0-9:\x27]/g,"");c[k]=(c[k]||0)+1;console.log(k+"#"+c[k],x.start_offset)})'`
- `end: true` uses the word's end instead of its start. `d` shifts by seconds (negative = before).
- An anchor that doesn't exist fails loudly with its hit count. Camera keys that resolve out of order are pushed one frame later and logged as a warning: treat every warning as a bug.

## Fields

| Field | What it drives |
|---|---|
| `transcript`, `take` | Transcript JSON (genmedia `gemini_transcribe` output) and the raw TTS take. |
| `maxGap` | Pauses longer than this (s) are cut down to it in the output VO; all times are remapped. |
| `tail` | Seconds of logo after `logoFrom`; sets the film length. |
| `captionChars` | Max characters per caption page (default 46). Pages also break on `. ? !` and on commas past 14 chars. |
| `fix` | Display text for transcript words: `{"word": "Text"}` or `{"word#2": "Text"}` (raw transcript spelling as key). |
| `stageFrom`, `taglineFrom`, `logoFrom` | Opener → phone, phone exit → tagline card, logo build. |
| `opener` | The two opener lines and when each appears. |
| `chapters` | `n`, `title`, start. Put each at the chapter's first word with `d: -0.7`. |
| `screens` | `src` (PNG name in `public/screens/`), `fx`: `cut`, `fade` (0.25s), `slide` (0.35s, navigating forward), `wipe` (0.85s, the result after a submit). |
| `taps` | Ring at `x,y` in screen CSS px. `hint: true` pulses for 1.4s (pointing, not pressing). `accent: true` glows (the submit moment). |
| `scroll` | Per screen, `v` = scroll offset in CSS px at each key; eased between keys. |
| `camera` | `x, y` = screen point centered in frame, `s` = zoom (1 = whole phone). See camera.md. |
| `notification` (or `notifications`) | A push banner that drops in over the phone between `from` and `to`. |

## Run

`node scripts/resolve.mjs tutorial` from the project root. Re-run after every edit to `src/tutorial.src.json`; Remotion Studio hot-reloads `src/tutorial.json`. The composition's length comes from `dur` in that file, so `Root.tsx` uses `Math.round(film.dur * FPS)`.
