# Calm camera

Viewers watch these on phones, often while learning something stressful. The first version of this format zoomed to 2 to 2.45x, panned in 0.15 to 0.6s, drifted during holds and went back to wide after every sentence. The feedback was that it gave people a headache and didn't zoom to the right place. These rules fix that.

## Rules

1. **Zoom 1.5x maximum** (1.4 for a frame that must hold three targets). At 1.5 the phone fills the frame top to bottom and the UI is readable; more than that is never needed.
2. **x stays 195** (the phone's center). Only y moves. At 1.5x or less the whole phone width is visible, so nothing is lost, and the sideways clamp that keeps the phone out of the caption column never kicks in (above 1.5 it pushes the framing off the target).
3. **Keep the framing inside the phone.** Half the visible height is `1080 / (2 * (880/844) * s)` CSS px: 345 at 1.5x, 370 at 1.4x. So `y` goes from 345 to 499 at 1.5x and 370 to 474 at 1.4x. Pick the y in that range that shows every target of the step.
4. **Every move takes about 1 second** (two keys 0.8 to 1.0s apart), eased in and out. No cuts on the camera, no moves shorter than 0.8s.
5. **Hold dead still between moves.** A hold is two keys with identical x, y, s. No drift keys (2.30 → 2.34): with an ease on every segment they read as shake.
6. **One move in per task, back to wide only between chapters.** Inside a chapter, re-frame with a y move at the same zoom (card → form → submit button). Never wide-close-wide inside one task.
7. **Move before the line, not on it.** Start the move about 1s before the word it's for (`d: -1.0` to `-0.5`) so the camera has settled when the word is spoken.
8. **Wide while the screen changes context.** Take the camera back to wide about 1s after a chapter's last word, and push in again about 1s into the next chapter, once its screen is showing.

## Pattern for one chapter

```json
{ "at": "<first word>", "d": 0.4, "x": 195, "y": 422, "s": 1 },
{ "at": "<first word>", "d": 1.4, "x": 195, "y": 345, "s": 1.5 },
{ "at": "<step 2 word>", "d": -0.5, "x": 195, "y": 345, "s": 1.5 },
{ "at": "<step 2 word>", "d": 0.5, "x": 195, "y": 499, "s": 1.5 },
{ "at": "<last word>", "end": true, "d": 0.3, "x": 195, "y": 499, "s": 1.5 },
{ "at": "<last word>", "end": true, "d": 1.3, "x": 195, "y": 422, "s": 1 }
```

After writing camera keys, run the resolver and print the resolved keys (`t:y@s`) to check every move is at least 0.8s long and there are no warnings.
