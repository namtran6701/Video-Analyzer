# Foundations

The tokens every pattern and component is built from. Default values below are Nam's neutral house style; a project brand replaces the values, never the roles.

## Color

Name colors by role, never by value. Components reference roles only, so theming and dark mode change tokens, not code. The palette is black, white, and neutral grays; color is reserved for meaning.

| Role | Light | Dark | Use |
|---|---|---|---|
| `label` | #1d1d1d | #f5f5f5 | Primary text, primary actions |
| `secondary-label` | #6e6e6e | #a1a1a1 | Supporting text, metadata |
| `separator` | #dedede | #333333 | Dividers, borders |
| `fill` | #f1f1f1 | #262626 | Selected and pressed backgrounds, chips |
| `surface` | #ffffff | #171717 | Cards, dialogs, panels |
| `canvas` | #f5f5f5 | #0a0a0a | Page background |
| `destructive` | #d92d20 | #f97066 | Delete, irreversible actions, errors |
| `success` | #16a34a | #4ade80 | Confirmation |
| `warning` | #b45309 | #fbbf24 | Caution |
| `info` | #2563eb | #60a5fa | Neutral notices, links when needed |

- Use a status color only for that status, always paired with text or an icon. Apps get these tokens, and Tailwind classes like `text-label` and `bg-surface`, by installing the `nam-theme` registry item.
- Verify contrast for every text and background pair in both modes.

✅ Do: `color: var(--secondary-label)`.
❌ Don't: hardcode hex in components, or use destructive red for emphasis.

## Dark mode

Dark mode is its own palette, not an inversion.

- Show elevation with lighter surfaces, not shadows.
- Use #f5f5f5 for text instead of pure white, and slightly desaturated status colors.
- Respect `prefers-color-scheme` and offer a manual override.

❌ Don't: put long text on a pure #000000 background.

## Materials

Use translucent blur only for chrome that floats over content, like sticky headers, floating controls, and sheets, so people keep a sense of what is underneath.

- Keep at least 85% surface behind text so it still passes contrast.
- Never use translucency behind long text or on content itself.
- Under `prefers-reduced-transparency`, replace the material with the solid surface color.

✅ Do: a sticky header with `color-mix(in srgb, var(--surface) 85%, transparent)` and a backdrop blur.
❌ Don't: stack translucent layers, or blur behind body text.

## Typography

Font stack: `-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif`. Use named styles, never ad hoc sizes. Set sizes in rem so text follows the browser font-size setting; values below are px at the 16px default.

| Style | Size / line height | Weight | Use |
|---|---|---|---|
| Display | clamp(40px, 6vw, 64px) / 1.05 | 650 | Hero headline, once per page |
| Title 1 | 32px / 1.2 | 600 | Page or section title |
| Title 2 | 24px / 1.25 | 600 | Subsection, dialog title |
| Headline | 17px / 1.4 | 600 | Card title, list group header |
| Body | 16px / 1.6 | 400 | Running text (17–18px for long reads) |
| Callout | 15px / 1.5 | 400 | Callouts, emphasized supporting text |
| Subhead | 14px / 1.4 | 500 | Buttons, controls, tabs |
| Footnote | 13px / 1.4 | 400 | Metadata, helper text |
| Caption | 12px / 1.35 | 500 | Labels, chips, timestamps |

- Keep weights between 400 and 650. Hierarchy comes from size and weight, not color alone.
- Sentence case everywhere. Let text wrap; never truncate content people need.

## Layout and spacing

- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px. Nothing off the scale.
- Reading width around 60–70 characters.
- Prefer whitespace to decorative containers. Use subtle dividers and restrained shadows.
- Corner radius: 8px small elements, 12px controls, 20–24px cards and dialogs.
- Mobile gutters are 16px. Stack cramped columns, keep controls reachable, never scroll horizontally.

## Whitespace

Fill the page with purpose. Landing pages and views should not feel empty: use text, images, or animation to put space to work. Leave whitespace only when it earns its place, by separating groups, framing the primary action, or improving readability. Every empty area should make the page look cleaner, not unfinished. Boxes placed side by side should balance: match their heights, rebalance the content between them, or stack them, so a shorter box never leaves a gap below it.

✅ Do: pair a short headline with an image or animation that fills the space beside it.
❌ Don't: leave large blank bands between sections, center a few words in an otherwise empty viewport, or put a short card next to a much taller one.

## Motion

Motion communicates state, hierarchy, and relationships. It never decorates.

| Use | Duration |
|---|---|
| Control feedback (hover, press) | 150–250ms |
| Dialogs, sheets, popovers | 300–450ms |
| Entrances, with small staggers | 600–900ms |

- Animate `transform` and `opacity` only. Ease out on enter; exit faster than enter.
- Avoid heavy bounce. Keep ambient animation away from reading areas.
- Under `prefers-reduced-motion`, remove nonessential movement and show the final state. Feedback must still be understandable without animation.

✅ Do: grow a panel from the control that opened it.
❌ Don't: animate width or top, or loop motion near text.

## Icons

- One icon family with consistent stroke. 16px in controls, 20–24px in navigation.
- Pair icons with labels unless the meaning is universal: close, search, copy, add, delete, settings.
- Icon-only controls need an accessible name and a tooltip. Decorative icons are hidden from assistive technology.

❌ Don't: invent metaphors, or mix filled and outlined styles in one view.

## Accessibility

- Touch targets at least 44 × 44px.
- Contrast 4.5:1 for normal text, 3:1 for large text and UI boundaries.
- Visible focus on every interactive element, never hidden behind sticky headers or overlays.
- Full keyboard support; Escape dismisses dialogs, menus, and popovers.
- Accessible names on every control. Semantic HTML before ARIA.
- Never rely on color, hover, icons, or motion alone to carry meaning.
- Offer a single-pointer alternative to any drag interaction.
- Don't ask people to re-enter information they already gave in the same flow.

✅ Do: test every flow with only a keyboard, then with a screen reader.
❌ Don't: remove focus outlines or put essential actions behind hover.

## Writing

- Use sentence case, familiar words, and the shortest wording that keeps the meaning.
- Include text only when it identifies content, clarifies a choice, enables an action, or explains a necessary next step.
- Front-load the key word in labels and headings.
- Errors say what happened and how to fix it, without blaming the person.

✅ Do: "Billing settings", not "Settings for billing".
❌ Don't: use jargon, internal names, slogans, or captions that repeat the heading.
