# Components

Each component lists when to use it, when not to, its required states, and accessibility. Build from [foundations.md](foundations.md) tokens and follow [patterns.md](patterns.md).

## Buttons

- **Use:** primary for the single most important action, secondary for supporting actions, ghost or outline for low emphasis like Cancel.
- **Avoid:** more than one primary per section; buttons that navigate (use a link styled as a button).
- **States:** default, hover, pressed, focus, disabled, loading.
- **A11y:** 44px target; icon-only buttons need `aria-label` and a tooltip; width stays stable when the label switches to loading.

## Text fields

- **Use:** short free-form input with a visible label above.
- **Avoid:** placeholder-only labels; text fields for fixed choices (use select, radio, or segmented control).
- **States:** default, focus, filled, disabled, read-only, error with message, success where useful.
- **A11y:** `<label for>`; errors linked with `aria-describedby`; `aria-invalid` on error; correct `autocomplete`.

## Dialogs

- **Use:** a required decision or a short, focused task that blocks the flow.
- **Avoid:** passive messages (toast), long forms (page or sheet), opening on page load.
- **States:** open, closing, loading on confirm, error inside the dialog.
- **A11y:** native `<dialog>` with `showModal()` or equivalent focus trap; labeled by its title; Escape closes; focus returns to the trigger.

## Sheets and popovers

- **Use:** a subtask or extra options without leaving context. Sheets from the bottom on mobile, popovers anchored to a control on desktop.
- **Avoid:** critical decisions (dialog), content people need to compare with the page behind.
- **States:** closed, open, dragging (sheets), loading.
- **A11y:** trigger has `aria-expanded`; focus moves in on open and back on close; Escape and outside click dismiss.

## Toasts

- **Use:** brief, passive confirmation of something the person just did.
- **Avoid:** errors that need action, anything longer than one line plus one action.
- **States:** entering, visible, with optional Undo, dismissing.
- **A11y:** `role="status"` (or `alert` for urgent); dismiss button; stays at least 5 seconds and pauses on hover and focus.

## Menus

- **Use:** a list of actions or options tied to one control.
- **Avoid:** primary actions people need constantly; navigation between pages (use nav).
- **States:** closed, open, item hover and focus, disabled item, destructive item last and separated.
- **A11y:** arrow keys move between items, Enter selects, Escape closes, focus returns to the trigger.

## Navigation bars and sidebars

- **Use:** persistent movement between top-level sections. Sidebar on wide screens, top bar or bottom tabs on mobile.
- **Avoid:** more than about 7 top-level items; hiding primary navigation on desktop.
- **States:** default, hover, current, focus, collapsed (mobile).
- **A11y:** `<nav>` with a label; current item has `aria-current="page"` plus a visual indicator beyond color.

## Cards

- **Use:** grouping a self-contained item with a title and at most one or two actions.
- **Avoid:** cards inside cards; dense data that belongs in a table.
- **Don't:** add a colored accent stripe (thick `border-left` or `border-top` in a brand or segment color) to cards, banners, callouts, or stat tiles. It's decoration that reads as AI-generated boilerplate. Separate cards with surface color, a 1px `separator` border, or spacing. If a card needs identity (segment, status), put the color in content that carries meaning: an icon, a badge, the key number, or a chart mark.
- **States:** default, hover (if interactive), focus, selected, loading skeleton.
- **A11y:** title is a real heading; if the whole card is clickable, make it one link and don't nest other controls.

## Empty states

- **Use:** first use, cleared content, zero search or filter results.
- **Avoid:** errors or permission problems (say what went wrong), content that's still loading (skeleton).
- **States:** first use, cleared, no results with a reset action.
- **A11y:** title is a heading at the right level; decorative illustration is hidden; the action is a real button with a specific verb.
