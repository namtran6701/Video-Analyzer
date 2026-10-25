# Motion Library

Reusable moves for this style, each a Remotion component built once and reused. Frame counts are at 30fps. Everything is keyed to a spoken word: `wordStart(i)` from `docs/vo_words.json` (see `toolchain.md`), so a move's frame 0 is the start of the word it belongs to.

Helpers: overlay pops use motion-studio's `motion.ts` with `snappy` for leading edges and `playful` for stickers (visible overshoot is part of this style). Camera pushes are linear `interpolate`. Seeded noise via Remotion `random(seed)`, no CSS transitions. Nothing has an exit animation: elements disappear on the next cut.

| # | Move | Used in |
|---|---|---|
| N1 | Cold-open text card | Hook |
| N2 | Channel sting | After hook |
| N3 | Evidence base with push | Every section |
| N4 | Highlighter bars | Quoted source text |
| N5 | Red box on token | Numbers, code, pricing |
| N6 | Pointing hand tap | After N5 |
| N7 | Hand-drawn arrow | Before → after, cause → effect |
| N8 | Stamp label | Every named person, product, company |
| N9 | Accumulating collage | Lists of competitors, features |
| N10 | Split frame | Evidence + reaction |
| N11 | Meme cutaway | Punchlines |
| N12 | Red X | Something replaced or killed |
| N13 | Big word card | One concept word |
| N14 | Hero word | Product or feature name moments |
| N15 | Stacked quoted words | Listing loaded words or phrases |
| N16 | Glitch slice | Into highlights and pull-quotes |
| N17 | Number swap | Price or metric changes |
| N18 | Cause-effect chain | How it works, Stakes |
| N19 | Takeaway card | Takeaway |

## Specs

### N1 Cold-open text card
- `bg` fill, one line in the display face, caps, `text` color, ~9% of frame height, centered, a trailing ellipsis allowed ("LAST WEEK...").
- Hard cut in at frame 0, hard cut out on the first word of the next line. Hold 0.7 to 1.5s.

### N2 Channel sting
- 2s max (60 frames). The channel's own mark: logo draws on (stroke reveal 18 frames), radial glow behind it fades in over 8 frames, hold, hard cut out.
- Never a recreation of the Code Report box logo. Design it from `tokens.ts` brand values.

### N3 Evidence base with push
- Source screenshot or still, fit to width with `bg` letterbox if needed.
- Linear scale 1.00 → 1.05 over the shot (3 to 8% depending on length). Origin on the region the narration is about.
- For tall pages: a linear vertical scroll instead of a push, max 40% of frame height per second.

### N4 Highlighter bars
- Bars in `highlight` behind the quoted phrase, one per line, 1.15× the line height, slight random rotation ±0.6° per bar (seeded).
- Starts with N16 for 3 frames, then each bar wipes left → right over 6 frames, next line starts 3 frames later.
- Text over the bar stays as in the source (usually dark). Holds to the cut.

### N5 Red box on token
- 4px `stamp` stroke, 6px padding around the exact token, corner radius 3.
- Draws as a stroke reveal over 4 frames starting on the token's spoken word.

### N6 Pointing hand tap
- 3D-style pointing-hand sticker (emoji-style asset), ~9% of frame height, with a drop shadow.
- Pops in from 0 with `playful` over ~6 frames, aimed at the N5 box from the lower right. Two tap bobs (8px toward the target, 4 frames each), then holds.

### N7 Hand-drawn arrow
- Marker-style white SVG path (`text` color), 6 to 8px stroke with rough ends, curved, arrowhead drawn last.
- Stroke draws over 7 frames, arrowhead over 3. Starts on the word for the second item ("...now", "...to").

### N8 Stamp label
- White bold condensed caps on a `stamp` box, padding 0.3em × 0.6em, rotated -3° to 3° (seeded).
- Pops with `playful`: scale 0 → ~1.1 → 1 over ~5 frames, starts on the name's first syllable. Placed near the face or logo it names, never covering it.

### N9 Accumulating collage
- Items (stamp labels, logos, mini screenshots) added one per spoken item, each with N8's pop, at seeded positions in a loose grid that gets intentionally crowded. Earlier items stay. Max ~8 items.

### N10 Split frame
- Evidence on the left ~64% of the frame, reaction image on the right ~36%, full height, no gutter, `bg` behind.
- Hard cut into the split on the punchline word. The evidence keeps its N3 push.

### N11 Meme cutaway
- Full frame, 0.5 to 2s, hard cut in on the punchline's last word, hard cut out. Optional single caption in the display face at the bottom.
- Only images the user supplied or approved. About one per 15 to 20s; never two in a row.

### N12 Red X
- Two `stamp` strokes, 10px, drawn 3 frames each (second starts on frame 2) over the replaced item.

### N13 Big word card
- One word, lowercase, heavy geometric sans, `textWarm` color, ~25% of frame height, alone on `bg`. Hard cut in, held exactly as long as the word and its follow-up. Pairs well in twos ("bot" → cut → "dot").

### N14 Hero word
- Ultra-heavy italic caps, vertical gradient `accent` → `highlight`, 6px dark stroke, hard drop shadow, ~12% of frame height, over the evidence.
- Slams in: scale 1.4 → 1 over 4 frames with `snappy`. Optional sub-stamp (N8) below it for a spec ("300 TOKENS / SECOND").

### N15 Stacked quoted words
- Serif italic words in quotation marks, gradient fill like N14, stacked left-aligned, one added per spoken word, each popping in over 4 frames. Max 4 per stack.

### N16 Glitch slice
- 6 to 10 horizontal bands, each offset ±20 to 80px (seeded) with an RGB split of 4px, for 2 to 4 frames, then clean. Also usable as a transition between two screenshots. A short digital SFX on it.

### N17 Number swap
- Old value in place, N12 or a strike line over it, N7 arrow to the new value in the display face with N8 styling. Optional multiplier tag ("20x → 10x") stacked vertically with a downward arrow.

### N18 Cause-effect chain
- 3 to 4 rounded boxes on `bg`, label inside in the display face, connected by N7 arrows. One box plus its incoming arrow appears per spoken step. The last box gets `stamp` fill. Holds while narration explains it; this is one of the few shots allowed to sit for 4 to 6s.

### N19 Takeaway card
- `bg` fill, one sentence in the display face, ~7% of frame height, max 2 lines, the key phrase in `highlight`. Sign-off line small underneath. Hard cut in, held to the end, music tail under it.
