# Patterns

Recurring tasks and flows. Each builds on [foundations.md](foundations.md).

## Feedback and system status

- Every action responds within 100ms.
- Show progress for anything over 1 second; say what is happening for anything over 4 seconds.
- Confirm success where it happened, inline or with a brief toast that fades on its own.
- Errors stay until the person resolves or dismisses them.

✅ Do: turn the button itself into a sending state, then a success state.
❌ Don't: show a spinner with no context, or a success modal that must be dismissed.

## Loading

- Use skeletons that match the final layout for content, and inline spinners for actions.
- Reserve space so nothing shifts when content arrives.
- Delay loading indicators about 300ms so fast responses don't flicker.
- Use optimistic updates for low-risk actions; roll back with a clear message on failure.

❌ Don't: block the whole page for a partial update.

## Forms and input

- Every field has a visible label above it. Placeholders only show format examples.
- Mark the minority case, required or optional, not both.
- Use the correct `type`, `inputmode`, and `autocomplete`.
- Validate on blur or submit, not on every keystroke during first entry.
- Put errors next to the field, say what's wrong and how to fix it, and move focus to the first error on submit.
- Keep entered data after an error.

✅ Do: "Enter an email like name@example.com."
❌ Don't: "Invalid input", silent disabled submit buttons, or clearing the form after a failed submit.

## Actions

- One primary action per view or section; others use quieter styles.
- Label actions with a specific verb that says what happens.
- In dialogs and forms, the primary action goes last.
- Links navigate, buttons act.

❌ Don't: "OK", "Submit", or "Click here" when a specific verb fits.

## Destructive actions

- Prefer undo over confirmation.
- When an action can't be undone, confirm with a dialog that names the object and the consequence, and label the confirm button with the destructive verb.
- Destructive color goes only on the button that destroys. It is never the default focus.

✅ Do: "Delete 'Q3 report'? This removes it for everyone." with Delete and Cancel.
❌ Don't: "Are you sure?" with Yes and No.

## Interruptions

Interrupt only when the person must decide before continuing. Choose the lightest option that works:

| Need | Use |
|---|---|
| Passive status ("Saved") | Toast |
| Issue tied to one place | Inline message |
| Focused subtask without leaving context | Sheet or popover |
| Required decision | Modal dialog |

❌ Don't: stack dialogs, or open one on page load.

## Navigation and wayfinding

- People always know where they are, where they can go, and how to get back.
- Mark the current location with more than color: weight, an indicator, and `aria-current`.
- Keep navigation in the same place across views; don't hide primary navigation behind a menu on desktop.
- The back button works. Meaningful state like filters, tabs, and search lives in the URL.

## Empty, error, and edge states

- Design empty, loading, partial, error, and overflow versions of every view.
- Empty states say what will appear and offer the action that fills them.
- Error states say what went wrong in plain words and offer a way forward.
- Test with very long names, zero items, one item, and thousands.

✅ Do: "No projects yet." with a Create project button.
❌ Don't: a blank area, or a raw error code with no next step.
