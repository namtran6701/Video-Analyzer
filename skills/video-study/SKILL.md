---
disable-model-invocation: true
name: video-study
description: Study a reference video and turn its visual grammar into a style guide, then a shotlist for a new video, then build and render it. Use when the user provides a reference video (file path) and wants a new video "in that style", a style breakdown, a shotlist, or says "study this video", "match this motion style", "make a video like this".
---

# Video Study

Borrow the grammar of a reference video (palette, type, pacing, motion, sound), never its content, logos, characters, or copy. The end goal is a finished rendered video.

## Inputs

- Reference video: a local file path the user provides. Do not download anything unless the user gives a URL and asks for it.
- Brief: subject, duration, aspect ratio, and assets. If missing at step 3, ask once for all of it.

## Workflow

### 1. Extract and study

Pick a working dir (default `./refs/`). Probe first, then extract:

```bash
ffprobe -v error -show_entries stream=width,height,r_frame_rate,duration,codec_name -of default=nw=1 <video>
mkdir -p refs/frames
ffmpeg -i <video> -vf fps=2 refs/frames/f_%03d.png
```

Use `fps=2` (one frame per 0.5s). For clips under ~6s or fast cut-heavy films, use `fps=4`. Also extract a contact sheet to see rhythm at a glance:

```bash
ffmpeg -i <video> -vf "fps=2,scale=320:-1,tile=6x" -frames:v 1 refs/contact.png
```

Read the frames in order. Detect cuts with `ffmpeg -i <video> -vf "select='gt(scene,0.3)',showinfo" -f null - 2>&1 | grep pts_time` to get real shot lengths instead of guessing. If the video has audio, check it (`ffmpeg -i <video> -af volumedetect -f null -`) and describe what you can infer.

Sample hex values from the actual frames (e.g. with Python + Pillow, dominant colors and key background/text pixels). Do not eyeball hex.

### 2. Write `./docs/style_guide.md`

Cover each, with concrete numbers where possible:

- Palette: hex values with role (bg, text, accent)
- Type: family (best identification, name close alternatives), weight, size relative to frame, tracking, case
- Shot lengths: per-shot seconds from scene detection, average, rhythm pattern
- Transitions: type per cut (hard cut, whip, mask wipe, zoom, dissolve), duration in frames
- Camera moves: push-in, pan, parallax, shake, with speed and easing
- Texture and grain: noise, vignette, blur, glow, overlays
- Text in/out: how text enters and exits (per-letter, per-line, mask reveal, fade), timing, easing
- Audio: music feel and tempo, SFX style, how sound syncs to cuts
- Do / don't: the 5 or so rules that make it feel like the reference

### 3. Write `./docs/shotlist.md`

Only after the user gives the brief. Table per shot: number, start-end time, duration, visual, on-screen text, camera move, transition in, audio cue. Durations must sum to the requested length. Use only assets the user provided. Never reuse the reference's content, logos, characters, or copy.

### 4. Gate

Show the user both files in full. Stop. Do not write any build code until they say OK.

### 5. Build and render

After approval, build the video. If the `motion-studio` skill is available, use it (Remotion build, Blender plates, Lyria score conformed to the shotlist grid with synthesized drafts, SFX, scored critique loop). Ask whether the film gets a voiceover before the shotlist (default no; yes means Gemini TTS with captions). Otherwise pick the lightest toolchain that matches the shotlist (e.g. HTML + headless capture + ffmpeg). Render to `./out/`, verify duration, resolution, and frame rate with ffprobe, then send the final file to the user.

## Rules

- Detect the toolchain from the environment before running anything.
- Keep the user's requested duration and aspect ratio exactly.
- If the user restates a request after a concern, build it.
