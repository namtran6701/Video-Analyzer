---
disable-model-invocation: true
name: motivation-insta-video
description: Produce a short, dark, cinematic manifesto teaser in one fixed style (a stat counter typed over fast archival clips, a narrated one-sentence-at-a-time argument in small bottom captions, strobe montages paid off by long holds, a drain from color to black and white, the product shown only as dark drifting UI fragments, one hero button on black, then URL, audience line and logo cards) from the user's stat, script, footage and product screenshots. Ships the measured style guide, a 7-act story template and look stills; builds and renders an MP4. Use whenever the user wants a brand manifesto, launch teaser, motivational Instagram video, dark cinematic hype film, or a video "like the motivation insta one", even if they don't name this skill. Not for kinetic-typography product demos (that's product-demo-video), calm feature walkthroughs (that's claude-feature-video) or studying a new reference video (that's video-study).
---

# Manifesto Teaser Video

Turn a stat, a five-sentence argument, a pile of footage and the user's product screenshots into a 20 to 45s teaser in one fixed style, ending in a rendered MP4. The style was studied from `references/ig-DcpLuSIvaSx/` and is fully specified here, so there is nothing to analyze. This skill owns the **style**. If the `motion-studio` skill is available it owns production (build, score, SFX, critique loop, delivery); load it before step 5.

The style in one paragraph: a near-black film that opens on a number typed over fast, unrelated, full-color clips, then makes one argument in a narrator's voice, shown as tiny 2 to 3 word captions at the bottom. Cuts come in bursts (down to 1 to 3 frames) and every burst is paid off by a hold. Color drains to black and white before the product appears. The product is never explained: it is seen in tight, drifting, half-blurred UI fragments, ending on a single silver button alone on black. Three silent cards close it: URL, who it's for, the mark.

## Files and when to read them

| File | Read when |
|---|---|
| `references/story_template.md` | Step 2: the 7 acts, shares, script skeleton, footage and copy rules |
| `references/style_guide.md` | Step 3: palette, type, shot lengths, transitions, camera, text and audio rules |
| `assets/look/*.jpg` | Step 5: one still per signature moment, named by act. Compare scale, spacing and density only, never content |

## Workflow

### 1. Brief
Ask once, together, for anything missing: runtime (default 30s), aspect ratio (default 16:9; for 9:16 either letterbox the 16:9 film on `#040404` as the reference does, or reframe, user's call), the stat, the audience's name for itself, the product URL, logo, product screenshots, footage, and voiceover (the style assumes one; default yes, voice picked per the repo's narrator rules).

The user's copy wins. Only write lines they left empty, and flag which ones you wrote.

### 2. Script
Read `references/story_template.md`. Write the five beats and the two end cards fresh from the brief, in the user's words, split the narration into captions of 3 words or fewer, and scale the 7 acts to the runtime.

### 3. Style
Read `references/style_guide.md`. Write the project's `docs/style_guide.md` from it. Keep the palette as is (it has no accent, so brand color does not map in). Swap in the brand font only for the end cards and UI. Keep every structural rule: near-black ground, hard cuts only, burst then hold, color then monochrome, caption size and position.

### 4. Shotlist (gate)
Write `docs/shotlist.md`: number, start to end, duration, visual and its source file, on-screen text, camera move, transition in, audio cue. Durations sum exactly to the runtime. Every clip in acts 1 to 4 is listed individually with where it comes from.

Show the script, style guide and shotlist, then **stop and wait for approval**. Do not write build code before the OK.

### 5. Build and render
Per the repo's CLAUDE.md: a new Remotion project in `projects/YYYY-MM-DD_promo_<slug>/`, drafts in its `out/`, final copied to `deliverables/`. Build act by act, still each act at its key frame and compare with the matching `assets/look/` image. Generate the voiceover first and time captions to it, then lay cuts against the caption timings. Verify duration, resolution and frame rate with ffprobe before delivering.

Checks specific to this style:
- a dissolve, slide or animated caption anywhere
- a caption over 3 words, on two lines, or off the 91% baseline
- a burst of fast cuts with no hold after it
- any color after act 2, or any accent color in the UI
- a full UI screen at rest, or the logo before the close
- the breath and the button hold shorter than 2s

## Rules

- The reference is a style template only. Borrow the grammar, never the content. Nothing from the reference film is reused: not its footage, people, numbers, UI, URL, tagline or mark.
- No verbatim or paraphrased text from the reference: not its narration, captions, sentence patterns, stat, UI strings or end-card lines. All copy is written new for each film. The `assets/look/` stills still show the reference's text; use them for scale and spacing only and never read copy off them.
- No real people unless the user supplies the footage and has the rights to it. Never generate a real person's likeness.
- Keep the user's requested duration and aspect ratio exactly.
- Detect the toolchain from the environment before running anything.
