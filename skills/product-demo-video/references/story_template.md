# Story Template

The 7-act launch structure. Fill the brackets. Timings in % so it scales.

| Act | % of runtime | 30s | 60s | 90s | Mode | Content rule |
|---|---|---|---|---|---|---|
| 1. Hook | 3% | 1s | 2s | 3s | Dark | One provocative line. "[We / X] [verb] [the old way]" |
| 2. Problem | 17% | 5s | 10s | 15s | Dark | 3 complaints, each as a short sentence + a visual prop that gets discarded |
| 3. Reveal | 4% | 1.5s | 2.5s | 3.5s | Dark → color → light | "Introducing" + logo moment |
| 4. Positioning | 5% | 1.5s | 3s | 4.5s | Light | One-line promise + 3 inline-icon nouns |
| 5. Demo | 30% | 9s | 18s | 27s | Light | One real task, end to end. Show steps, not features |
| 6. Proof | 4% | 1.5s | 2.5s | 3.5s | Dark | One number or one chart. Your bar wins |
| 7. Capabilities | 11% | 3s | 6s | 10s | Dark | "Anything you [do] in [place]" + slot list of 4 to 6 verbs |
| 8. Trust | 14% | 4s | 8s | 13s | Light | Privacy/security in 3 beats + one tactile UI moment |
| 9. Bonus | 5% | 1.5s | 3s | 4.5s | Dark | One differentiator (integrations, pricing, BYO) |
| 10. CTA | 4% | 1.5s | 2.5s | 3.5s | Dark | Tagline collapses into URL |

For 30s cuts: merge 6+7 and drop 9.

## How each act looks

| Act | Visual approach | Motion IDs | Look frame (`assets/look/`) |
|---|---|---|---|
| Hook | A UI element (search bar, input) morphs into a pill holding the headline; neutral app icons slide in beside it | M4, M5, M1 | `hook-headline-pill.jpg` |
| Problem | Each complaint is a centered line lit word by word, with a UI prop under it (dock, buttons, refusal chips) that gets stacked, blurred, then thrown away | M2, M6, M7 | `problem-motion-blur-stack.jpg`, `problem-throw-in-trash.jpg` |
| Reveal | "Introducing" over the last prop, then logo wordmark on blue light shafts, washing out to white | M8 | `reveal-light-shafts.jpg` |
| Positioning | Logo + one-line promise, then a line of nouns each led by an inline icon | M1, M3 | `positioning-inline-icons.jpg` |
| Demo | Real product UI at real scale: prompt typed, agent/product steps appear one per beat, a section expands with zoom, parallel branches, result line. Thin progress thread with a blue dot runs through it | M9 to M12 | `demo-agent-steps.jpg` |
| Proof | Starts tight on the hero bar glowing in the accent, pulls out to the full chart | M13 | `proof-benchmark-bars.jpg` |
| Capabilities | "Anything you can do in a [icon] place" lit word by word, then "[logo] can do" with a vertical slot list of verbs | M2, M3, M14 | `capabilities-slot-list.jpg` |
| Trust | Short lines with a lock/drive icon inline, a device prop, scrambled text resolving to "encrypted", a field toggling to masked | M15 to M17 | `trust-scramble-text.jpg`, `trust-password-toggle.jpg` |
| Bonus | One line, then partner/model icons pop in a row and collapse into the logo | M5 | |
| CTA | Logo + tagline, all words fall away except the URL | M18 | |

## Fill-in

```
HOOK:          "_______________"
PROBLEM 1:     "They _______________"            prop: ______
PROBLEM 2:     "Instead, they _______________"   prop: ______
PROBLEM 3:     "Then, they _______________"      prop: ______
REVEAL:        "Introducing" → [logo]
PROMISE:       "[Product], a ______ that ______"
ICON NOUNS:    [icon] ____  [icon] ____  [icon] ____
DEMO TASK:     user prompt: "_______________"
               steps (4 to 6): ______
               payoff line: "_______________"
               human reaction line (optional): "_______________"
PROOF:         metric/chart: ______  source: ______
CAPABILITY:    "Anything you can ____ in a [icon] ____"
SLOT LIST:     ____ / ____ / ____ / ____
TRUST 1-3:     "_______________" ×3
TRUST PROP:    ______ (password field, toggle, lock, device)
BONUS:         "_______________"
TAGLINE + URL: "_______________"  ____.com
```

## Writing rules

- Max 5 words per line, max 3 lines per card.
- Problem acts use "they" (the old way). Solution acts use the product name or "you".
- One joke or human moment max, inside the demo.
- Never name competitors in copy. Use neutral, generic props for "the old way".
