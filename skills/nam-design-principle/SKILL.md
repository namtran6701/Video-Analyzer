---
disable-model-invocation: true
name: nam-design-principle
description: Nam's UI design system, structured like Apple's Human Interface Guidelines (foundations, patterns, components). Use when designing, building, or reviewing any interface, page, component, form, dialog, or app screen, or when the user says "use my design principles".
---

# Nam design principles

A web design system modeled on Apple's Human Interface Guidelines. A project's own design rules or brand system override anything here, including default colors and fonts.

## Core principles

1. **Hierarchy.** The main task is obvious. Each view has one purpose and one primary action. Controls and chrome defer to content.
2. **Harmony.** Color, type, spacing, and motion come from one set of tokens, so every part feels like the same product.
3. **Consistency.** Follow conventions people already know. The same action has the same name, icon, and position everywhere.

Underneath all three: clarity without clutter. Never add text to explain what the UI already shows. Put secondary explanations in tooltips instead of on the page. Don't leave space empty: fill it with text, images, or animation, and keep whitespace only where it makes the page cleaner and easier to read.

## How to apply

**Building UI**
1. Check the project for an existing design system or component. Reuse before creating.
2. Read [foundations.md](foundations.md) for tokens: color roles, type styles, spacing, motion.
3. Read [patterns.md](patterns.md) for the flows involved: forms, loading, feedback, destructive actions, navigation.
4. Read [components.md](components.md) for each component you build or use.
5. Run the checklist below before calling it done.

**Reviewing UI**
1. Walk the checklist below, then check the Do/Don't lines in the relevant sections.
2. Report findings by severity: broken (accessibility, missing states) first, then inconsistencies, then polish.

## Index

| File | Covers |
|---|---|
| [foundations.md](foundations.md) | Color, typography, layout, whitespace, motion, icons, accessibility, writing, dark mode, materials |
| [patterns.md](patterns.md) | Feedback, loading, forms, actions, destructive actions, interruptions, navigation, edge states |
| [components.md](components.md) | Buttons, text fields, dialogs, sheets, toasts, menus, navigation bars, cards, empty states |

## Checklist

- Every relevant state exists: hover, pressed, focus, disabled, loading, empty, error, success.
- Tested with long text, zero items, one item, and many.
- Keyboard only works end to end, focus is visible, Escape dismisses overlays.
- Touch targets are at least 44 × 44px.
- Light mode only unless the user asks for dark. Text contrast is 4.5:1 (3:1 for large text) in each mode built.
- Colors come from role tokens; status color always pairs with text or an icon.
- Text uses named type styles in rem, spacing uses the scale.
- Reduced motion shows the final state.
- Reduced transparency replaces blur with the solid surface color.
- No horizontal scroll at phone width.
- No copy the UI already communicates; extra context lives in tooltips.
- No colored accent stripes (thick left or top borders) on cards, banners, or tiles.
- No empty areas without a purpose; whitespace separates, frames, or aids reading. Side-by-side boxes balance in height.
