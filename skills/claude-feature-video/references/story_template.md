# Story Template

Opener, N chapters, tagline, logo. One chapter = one use case on one screen. Budgets are in beats (90 BPM, 16 frames at 24fps, 0.667s) so they snap to the music.

## Section budgets

| Section | 30s (45 beats) | 45s (67.5) | 60s (90) | 90s (135) | Content |
|---|---|---|---|---|---|
| Opener | 5 | 6 | 7 | 8 | Product/surface icons + "Introducing [feature] for [place]" |
| Chapters | 1 × 30 | 2 × 25 | 22 + 23 + 24 | 27 + 27 + 28 + 28 | One use case each, simplest first |
| Tagline | 3 | 4 | 4 | 5 | One line, 3 to 5 words |
| Logo | 7 | 7.5 | 10 | 12 | Logo build, hold, music tail |

Every column sums to the runtime in beats (seconds × 1.5). If you change one section, take the difference out of the logo hold or a chapter's Hold step.

Max 4 chapters. A chapter under ~18 beats (12s) feels rushed; cut a chapter before squeezing all of them.

## Chapter grammar

Every chapter runs the same steps. Chapter 1 shows how to find the feature (Invoke + Open). Later chapters start with the panel already open and spend those beats on a richer Ask.

| Step | Ch 1 beats | Ch 2+ beats | Shot | What happens | Motion IDs |
|---|---|---|---|---|---|
| Establish | 3 | 1 to 2 | Wide | Window at rest showing the "before" screen. Cursor heads for the entry point | M3, M7 |
| Invoke | 5 | | Close-up (cut in) | Entry point: menu → submenu item, toolbar button, shortcut. Cursor clicks | M4, M6, M7, M8 |
| Open | 3 | | Wide (pull back) | Panel slides in with the accent glow | M5, M11 |
| Ask | 4 | 8 to 13 | Close-up (cut or snap zoom in) | The way in for this chapter: attach files, toggle a tool/connector, pick a skill, then type the prompt and send | M4, M6, M9, M10, M12, M13 |
| Working | in Ask | 3 to 4 | Close-up | Step line + "Working on it..." + reply starts streaming | M14, M15 |
| Transform | 3 | 3 | Wide (pull back) | Accent wipe (documents, sheets, pages) or bloom (a canvas or slide) turns before into after | M5, M16 or M17 |
| Hold | 2 | 3 to 4 | Wide | Result at rest; reply keeps streaming and scrolling in the panel | M15 |
| Exit | 2 | 2 | Pan | Carousel pan to the next chapter's window. Last chapter: scroll-out to the tagline instead | M18 or M19 |

### Default 60s shotlist skeleton (beats)

```
0-7     Opener card                    M1, M2 at 7
7-10    Ch1 establish (wide)           M3, M7
10-15   Ch1 invoke (close-up, cut)     M4, M8
15-18   Ch1 open panel (wide)          M5, M11
18-22   Ch1 ask + working (close-up)   M4, M13-M15
22-25   Ch1 transform (wide)           M5, M16
25-27   Ch1 hold                       M15
27-29   pan                            M18
29-31   Ch2 establish + file drag in   M10
31-39   Ch2 ask (close-up, cut)        M4, M10, M12
39-43   Ch2 send + working             M13-M15
43-46   Ch2 transform                  M5, M16
46-50   Ch2 hold
50-52   pan                            M18
52-53   Ch3 establish
53-66   Ch3 ask: tool menu, toggle, type   M4, M8, M9, M12
66-70   Ch3 send + working             M13-M15
70-73   Ch3 transform                  M5, M17
73-76   Ch3 hold
76-80   Tagline                        M19
80-90   Logo build + hold + tail       M20
```

## Ways in (pick a different one per chapter)

Order from least to most impressive. The reference went menu → file drop → connector toggle.

- Menu: app menu → extension/feature item (best for chapter 1, it answers "where is it?")
- Toolbar button or keyboard shortcut
- Drag files in from off-frame and drop them on the panel
- Plus menu → tools / connectors / data sources → toggle one on
- Slash command or saved skill from the empty-state chips
- Select something on the canvas, then ask about the selection

## Fill-in

```
OPENER ICONS:   [surface 1] [surface 2] [surface 3]   (or product mark)
OPENER LINE:    "Introducing ________ for"
                "________________"

CHAPTER n:      surface/screen: ______   way in: ______
                before screen: ______   after screen: ______
                prompt: "______________________________"
                step line: "______, ______, ______..."
                reply summary (streams during hold): ______
                transform: wipe / bloom

TAGLINE:        "________ wherever you ____"   (pattern: product + where or benefit)
LOGO:           mark file ______   wordmark ______
DATA UNIVERSE:  company ______, people ______, period ______, key numbers ______
```

## Writing rules

- **Two cards only.** Opener: "Introducing [feature]" plus where it lives, 2 lines, max ~4 words per line. Tagline: one line.
- **Prompts are the script.** Write them like a real user mid-task: specific, 60 to 130 characters, names and numbers in them ("Pull together Q3 budget vs. actuals: a tab for each team, a summary tab with a chart, and flag anything over budget.").
- **Step line** is a comma list of what the AI is doing, truncated with "..." ("Read document, rewrite executive summary, f...").
- **Reply summary** is short bullets naming concrete changes with numbers. It mostly matters as moving texture during holds, so it can run longer than the hold.
- **One fictional universe.** Same company, people and period across chapters. Realistic, never lorem ipsum, never real customer data unless the user provides it.
- The "after" screen must be visibly, structurally better than "before" (new header band, table, chart, filled slide), so the wipe reads at a glance from the wide shot.
- Never name competitors.
