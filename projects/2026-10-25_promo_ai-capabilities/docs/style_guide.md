# Style guide: SF AI capabilities film

product-demo-video grammar with the Sales Factory brand mapped onto its roles. Every structural rule stays: two neutrals + one accent, dark/light alternation, beat-locked text, hard cuts only at flips.

## Palette

| Role | Token | Hex | Brand name |
|---|---|---|---|
| Dark act bg | `darkBg` | `#1C2C2E` | Anvil |
| Dark surface (pills, inputs) | `darkSurface` | `#263A3D` | Anvil +6% white |
| Text on dark | `darkText` | `#FDFEFC` | Snow |
| Unlit word on dark | `darkDim` | `#4F6063` | Anvil tint (transient state only) |
| Light act bg | `lightBg` | `#FCFCF8` | Canvas |
| Text on light | `lightText` | `#1C2C2E` | Anvil |
| Secondary on light | `lightDim` | `#6A7171` | Concrete |
| Hairlines | `lightLine` | `#E4E4E4` | Gray 300 |
| Accent on dark | `accent` | `#A0CB05` | Lime (text allowed on Anvil) |
| Accent fill on light | `accentFill` | `#EEFF97` | Highlighter, always with Anvil text |
| Reveal shafts | gradient | `#0E1718` → `#1C2C2E` → `#495A3B` → `#A0CB05` → `#EEFF97` | Anvil → Putty → Lime → Highlighter |

Lime text never sits on light backgrounds (brand contrast matrix); on light acts the accent is a Highlighter fill behind Anvil text. Ember stays out entirely. Client brand colors (Channellock red/blue, IIP cream) appear only inside their own captured screens.

## Type

- Headlines: **Gotham Bold**, sentence case, tracking -1%, ~70 px at 1080p, logo wordmark from the SVG.
- Labels and chapter stamps: **IBM Plex Mono Medium**, uppercase, tracking 0.15em (the SF signature). Used for the app name chip at the start of each demo chapter and for stat labels.
- Rebuilt app UI: IBM Plex Sans / Plex Mono, as the apps themselves use.
- Max 5 words per line, 3 lines per card. Icons inline at cap height, Lucide line icons, stroke weight matched to Gotham Bold.

## Brand overrides to the base style

- Square corners everywhere (brand rule); pills become square chips with a 3 px Anvil or Snow stroke.
- No drop shadows on light cards; separation by 3 px strokes and hairlines, like the apps.
- Glow only on the progress dot and the hero proof bar (Lime).

## Motion

Unchanged from the base style: GSAP `power3.out` type entries, `power2.in` exits, motion.ts springs (`snappy` UI, `default` cards and camera, `heavy` logo and laptop), no overshoot on type, no bouncy eases.

## Audio

- 116 BPM, D minor, palette `glass` (AI/SaaS), seed 4127 (new).
- Lyria final (`lyria-3.5`), conformed to the grid; synthesized score for drafts.
- Voiceover: `en-us-storyteller-5` on `gemini-3.8-flash-tts`, ducked under with sidechain; captions burned in where the voice says more than the type.
