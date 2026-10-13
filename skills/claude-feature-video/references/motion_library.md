# Motion Library

Reusable moves for this style, each a component or a camera pattern to build once and reuse. Frame counts are at 24fps. All in Remotion.

| # | Move | Used in |
|---|---|---|
| M1 | Opener settle (icons + title) | Opener |
| M2 | Push-through cut | Opener → chapter 1 |
| M3 | Floating window | Every chapter |
| M4 | Punch-in | Invoke, Ask |
| M5 | Pull-back reveal | Open, Transform |
| M6 | Close-up drift | Every close-up |
| M7 | Cursor | Everywhere in the UI |
| M8 | Menu and submenu | Invoke, Ask |
| M9 | Toggle | Ask (tools / connectors) |
| M10 | File drag and drop | Ask |
| M11 | Panel open with accent glow | Open (chapter 1) |
| M12 | Typing prompt | Ask |
| M13 | Send reframe | Ask → Working |
| M14 | Working state | Working |
| M15 | Streamed reply with autoscroll | Working, Transform, Hold |
| M16 | Accent wipe | Transform (documents, sheets, pages) |
| M17 | Accent bloom | Transform (a canvas or slide) |
| M18 | Carousel pan | Between chapters |
| M19 | Scroll-out to tagline | Last chapter → tagline |
| M20 | Logo build | Close |

## Specs

### M1 Opener settle
- Background `oat`. Up to 3 surface icons in a row, ~180px each, ~165px gaps, or a single product mark.
- Frame 0: icons already visible at frame center, scale 1.25. Over 18 frames (ease-out cubic) they scale to 1.0 and rise ~140px so icons + title end up optically centered as a group.
- From frame ~18: title line 1 fades 0 → 1 over 4 frames with a 10px rise; line 2 starts 3 frames later. Hold to the end of the opener.
- Icons are soft, slightly glossy gradient versions of the surfaces (or the user's own icons). Never use a third party's logo the user didn't supply.

### M2 Push-through cut
- Opener's last 3 frames: whole card scales 1 → 1.04 (ease-in).
- Cut. First window enters at scale 1.06 and settles to 1.0 over 8 frames (ease-out cubic).

### M3 Floating window
- 1418 x 900, centered at rest, radius 10px, warm shadow (see style guide). Generic light browser chrome: traffic lights, one tab with favicon + title, URL bar.
- Content = the chapter's screenshot, swapped or wiped between states. During holds the window can drift ±4px vertically over the whole hold; otherwise it's still.

### M4 Punch-in
- Default: hard cut from wide to a close-up at 3x (panels, inputs) or up to 4x (menus). Cut on the cursor's arrival at the target.
- Alternative: a 12-frame snap zoom, ease-in-out cubic, when the eye needs to travel (wide panel → its input).
- Frame the target center-right; keep a sliver of window edge and stage visible.

### M5 Pull-back reveal
- Close-up → wide in 8 to 14 frames, ease-in-out cubic. Interpolate zoom geometrically (log scale) so it doesn't feel like it accelerates at the end.
- Time it so the transform (M16/M17) starts 4 to 8 frames after the camera settles. The viewer must see "before" in the wide shot for a moment.

### M6 Close-up drift
- Add a camera key at the end of every close-up: scale +1.5% per second, or a slow pan that keeps the cursor or the newest line in frame. Ease-in-out across the whole shot.

### M7 Cursor
- macOS arrow; switches to pointing hand over clickable items. Black fill, white outline. It lives in the window (world space), so it scales with the camera: small in wide shots, big in close-ups.
- Moves on eased curves (ease-in-out, slight arc), ~0.5 to 1 beat per move, pauses ~6 frames before clicking.
- Click: item highlight appears on the click frame, quiet click SFX. No ripple, no scale bounce.

### M8 Menu and submenu
- Dropdown appears with a 3-frame fade and 4px drop. Hover row = light gray rounded pill that follows the cursor.
- Submenu opens to the side (or replaces the menu with a "Back" header) with the same 3-frame fade.
- Rows: icon + label + chevron or check. Built in React matching the app, or a screenshot per state crossfaded in 2 frames.

### M9 Toggle
- Cursor clicks, knob slides over 6 frames (ease-in-out), track fills with the app's own "on" color (not the film accent).

### M10 File drag and drop
- A small stack of 1 to 3 file icons with filename labels (selected-label style) and a "+" badge, carried by the cursor from beyond the frame's right edge toward the panel. Starts in the wide shot.
- Cut to close-up as the stack reaches the panel: drop overlay appears (file-plus icon + "Drop files here ..."), panel content dimmed behind it.
- On drop: overlay fades over 6 frames; file chips pop into the input (scale 0.92 → 1 and fade, 8 frames, 3-frame stagger).

### M11 Panel open with accent glow
- Panel slides in from the window's right edge over 7 frames (ease-out cubic), overlapping the app content like a floating card.
- Glow: outer blur in `accentGlow` / `accentWipe`, ~60px spread (`box-shadow: 0 0 60px 14px rgba(232,140,120,.45)`). In over 8 frames, one gentle pulse over ~1 beat, out over 12 frames before the next punch-in.
- Empty state: product icon, "How can I help ...", 4 to 6 suggestion chips, input at the bottom.

### M12 Typing prompt
- ~2 characters per frame for prompts over 100 characters, ~1.5 for shorter ones. Caret visible, blinking every 12 frames when idle.
- Input grows as lines wrap. Send button switches from disabled to active on the first character.
- Quiet keystroke ticks, not one per character: roughly every 3 to 4 frames.

### M13 Send reframe
- On send (12 to 18 frames): input clears, the prompt becomes a right-aligned bubble (`bubble` fill, ~16px radius) at the top of the thread, the empty state slides up and out, and the camera re-centers on the bubble + working line.
- Attached files move with the message as small cards above the bubble.

### M14 Working state
- Step line in `inkDim` under the bubble: comma list of actions, truncated with "...", trailing chevron.
- Below it: the accent spark (or the user's AI mark) rotating ~1 turn per 1.5s, plus "Working on it..." with a shimmer: a lighter highlight band sweeps left to right across the text every ~24 frames.
- Lasts 1.5 to 3s, then the reply starts streaming. Never longer.

### M15 Streamed reply with autoscroll
- Reply streams in line by line (~1 line every 2 to 3 frames): short paragraph, then bold section labels with bullets naming concrete changes.
- The thread autoscrolls to keep the newest line ~70% down the panel. Keep it streaming through pull-back, transform and hold; it's what keeps holds alive.
- Ends with a reply input ("Reply, or ...") at the bottom.

### M16 Accent wipe (transform)
- A diagonal soft band of `accentWipe`, tilted ~20° (top leaning right), ~38% of the content area wide, edges feathered with ~80px blur, ~85% opacity at its core.
- Travels left to right across the app's content area (below the toolbar, not over the panel) in ~20 frames, ease-in-out. It may bleed a little past the page edges.
- Behind the band: the "after" screenshot, with a white veil that fades out over the trailing ~15% of the sweep. Ahead of it: "before".
- Implementation: two stacked screenshots; the "after" layer uses a CSS `mask-image: linear-gradient(110deg, ...)` driven by progress, and the band is a blurred, rotated div riding the mask edge.
- Secondary detail (tabs, thumbnails, totals) can get a tiny second sweep or stagger in right after.

### M17 Accent bloom (transform)
- For a contained canvas (a slide, a chart, an image): a radial `accentWipe` glow grows from the canvas center to fill it (8 frames), the "after" content fades in under it, and the glow dissolves (12 frames).
- Then dependent UI fills in top to bottom with 2 to 3 frame stagger (slide thumbnails, a list, a sidebar).

### M18 Carousel pan
- Next chapter's window sits to the right in world space (gap 160px). Camera pans from the current window to the next over 24 to 29 frames, ease-in-out cubic, scale stays 1.
- Land on the next window's "before" state with the cursor already in it.

### M19 Scroll-out to tagline
- The last window moves up and out of frame over 16 frames (ease-in), as if the camera tilts down.
- The tagline enters ~40px below its rest position and rises into place while fading in over 6 frames, landing as the window clears. Hold ~2.5s, then a 3-frame fade out.

### M20 Logo build
- Empty `stage` for ~3 frames after the tagline leaves.
- A dot in `accent` appears at the mark's center, grows into the full mark with a quarter turn over 10 frames (ease-out).
- The mark slides left to its lockup position while the wordmark letters fade in left to right (each 4 frames, 2-frame stagger). Settled ~1.5 beats after the dot.
- Hold still to the end. Music fades under the hold; the last ~2.5s are silent.
