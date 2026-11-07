---
name: motion-studio
description: Produce deterministic, beat-locked motion films (promo videos, animated explainers, social clips, kinetic typography) in Remotion, routing each shot to the lane that fits it: 2D (React/SVG + GSAP), real-time 3D (React Three Fiber), or offline 3D (Blender plates), with Poly Haven and Adobe Stock assets, SFX synthesized in code, a Lyria score (synthesized for drafts) or the user's licensed track, and optional Gemini voiceover with burned-in captions. Covers gates, beat grid, lanes, audio, voiceover and captions, the scored critique loop and multi-format delivery. Use when the user asks for a motion piece, animated video, promo film or launch video, and always as the production layer under the style skills (product-demo-video, claude-feature-video, deepseek-feature-video, mobile-agent-video, news-explainer-video, app-tutorial-video) and video-study.
---

# Motion studio

```
gates ──► lane plan ──► assets + plates ──► Remotion build ──► score + SFX ──► critique loop ──► deliver
(OK each)  (OK)          (Poly Haven, Stock,   (2D, R3F, comp)   (Lyria final,   (3+ rounds)       (ffmpeg QA)
                          Blender)                                synth drafts)
```

## Style skills sit on top of this one
Style skills (product-demo-video, claude-feature-video, deepseek-feature-video, mobile-agent-video, news-explainer-video, app-tutorial-video, and any reference built with video-study) are direction only: palette, type, story template, motion library, look frames, tokens and the overrides they list. This skill is the production layer under all of them: gates, lanes, toolbox, build rules, sound, critique loop and delivery. When a style skill is in play, load both, run this pipeline end to end, and feed the style skill's inputs into each stage. A style skill's explicit overrides win (BPM, easing, voiceover, formats); everywhere it is silent, this skill's rules apply. Style skills don't ship their own copies of the toolbox (`motion.ts`, `camera.ts`, the audio scripts); they set parameters for them in their `tokens.ts`.

When the working repo has a CLAUDE.md, its layout and delivery conventions (project folder, workspaces install, where finals are copied) override the defaults in Setup and Deliverables.

Remotion is the single build engine and timeline. Each shot goes to the cheapest lane that still looks right; the brief decides, not a house style. Most films are mostly 2D.

| Lane | Tool | Use for | Cost |
|---|---|---|---|
| 2D | React/SVG + GSAP | type, UI, icons, charts, line draws, shape morphs | instant |
| 3D real-time | R3F in `<ThreeCanvas>` | product spins, glTF models, 3D type, camera through a scene, 3D data viz | seconds |
| 3D offline | Blender plates | volumetric light, glass and caustics, physics sims, photoreal close-ups | minutes per plate |

ffmpeg mixes, encodes and checks. Music: a Lyria track for every final cut, the synthesized score for drafts and timing passes; a licensed track from the user replaces both. Voiceover is optional and off by default: ask the user whether this film gets one before the shotlist, never assume. If yes: Gemini TTS, always with captions. If no: music and SFX only, no captions. Generated images, music and voice all go through the `genmedia-assets` skill.

**Generation is always confirmed.** Before any image, Lyria track, voiceover or paid Stock license, tell the user exactly what and how many ("3 images: hero, 2 backgrounds; 2 Lyria takes; 1 voiceover. OK?") and wait for the OK. Regenerations count too.

## Toolbox (bundled in `scripts/`, copy, don't rewrite)
- `motion.ts` → `src/lib/motion.ts`: closed-form `spring`, `track`, `indicator`, `swapAlpha`, `loopT`. Pure functions of seconds, call with `frame / fps`.
- `camera.ts` → `src/lib/camera.ts`: virtual camera over a flat 2D world (UI, screenshots, type). `cameraAt(keys, frame, ease?, fps?)` with keys `{ f, x, y, s, rx?, ry?, rz?, cut? }`: geometric zoom, optional 3D tilt, hard cuts. `ease` is `'cubic'` (default; no overshoot, lands exactly on each key) or a `motion.ts` preset (a spring via `track`). `drift()` keeps holds alive (+1.5% scale), `cameraTransform(pose, width, height)` gives the CSS transform for the world container (`transformOrigin: "0 0"`, a `perspective: 1800` wrapper for tilts). Style skills define their named poses (wide, close-up, tilted) in `tokens.ts`, never their own camera.
- `polyhaven.mjs`: `node polyhaven.mjs <slug> [res=1k] [--copy public/]`. Fetches a CC0 asset into `~/Movies/assets/polyhaven/{hdri,texture,model}/`, verifies md5, logs it in `manifest.json`, prints the path. HDRI → `.hdr`, texture → folder of jpg maps, model → glTF folder.
- `score.mjs`: `node score.mjs plan.json public/score.wav`. Beat-locked original score from an energy-per-bar plan in one of 5 palettes (instruments, kit, groove, space), with auto risers and impacts. The seed picks the progression and arp pattern. Same plan, same file.
- `sfx.mjs`: `node sfx.mjs cues.json out/sfx.wav --dur N --seed <score seed> --key <score key>`. Voices: click, tick, pop, thump, chime, glitch, whoosh, swish, riser (ends at `t`), impact. Per cue `pitch` (semitones) and `len`. The seed sets the film's SFX register and brightness and humanizes each hit; `--key` tunes pitched voices to the score.
- `beats.py`: `python3 beats.py --bpm 116 --dur 60 > beats.json` → bpm, beats, downbeats, hits (= downbeats). Same grid as `score.mjs` (beat 0 at t = 0). For a track, `uv run --with librosa --with soundfile python3 beats.py track.wav [--grid <bpm>] > beats.json` measures it (uv fetches librosa, nothing global): `bpm` from a steady-grid fit (accurate to about 0.05 BPM), `first_beat` (trim point), hits are its onsets. With `--grid` it adds `stretch` (the atempo ratio to that BPM) and `max_drift_ms` (worst beat off a steady tempo). It finds beats, not bar lines: beat 1 is assumed to be the first beat.

Setup: Node 22+, ffmpeg, a Remotion project (`npx create-video@latest`, blank template) and Remotion's own agent skills (`npx skills add remotion-dev/skills`). Install only the lanes the lane plan uses, versions exact, `@remotion/*` pinned to the project's Remotion version: `@remotion/gsap gsap` for 2D, `@remotion/three three @react-three/fiber @react-three/drei` (+ `-D @types/three`) for real-time 3D, `@remotion/captions` when there's a voiceover, `@remotion/fonts` always, plus any package from the Tool menu below that the shotlist needs. Check current APIs with context7 before writing framework code. For Blender, call `mcp__blender__get_addon_status` first. If it can't connect, don't wait on the user: write the plate as a bpy script and render it headless (see Blender plates). The MCP is for live iteration, not a requirement.

## Gates (wait for the user's OK at each)
1. **Brand:** capture the real site into `public/brand/` (screenshots, logo, colors, fonts). Screenshots with the Chrome DevTools MCP (`emulate` with viewport `<w>x<h>x<dpr>`, then `take_screenshot` to a path relative to the working folder; it can't write outside it), at device scale factor 2+ (3 when the camera goes in close). Its own Chrome profile allows one instance: if it reports the profile is in use, kill the processes whose command line contains `chrome-devtools-mcp/chrome-profile` and retry. If the first `new_page` vanishes ("No page found" on the next call), open it again. Same pixels as Playwright (both drive Chrome over the DevTools protocol), but no install and states (open menus, typed prompts, hidden banners) are set up by looking at the page. Use a Playwright script only for a large batch that will be recaptured after UI changes. Screen recordings (a real app doing something at 1x: montage clips, results playing on their own): `screencast_start` / `screencast_stop` from the same MCP while driving the page, or the user's own recordings; 1080p+, 30fps, H.264 (`ffmpeg -c:v libx264 -r 30 -pix_fmt yuv420p`), trimmed to one action each into `public/clips/`. Recordings go soft when the camera pushes in, so anything shown closer than 1.2x is rebuilt in React from 3x screenshots instead. Never fake a recording with a pan over a still. List findings. Never redraw product UI from memory.
2. **Reference (if supplied):** extract frames with ffmpeg, write `docs/style_guide.md` (grammar only, never content, logos or characters).
3. **Shotlist:** pick BPM (100 to 124 for promos), run `beats.py`, write `docs/shotlist.md` as a state list on the beat grid: what is on screen at each beat, not a vibe. Hook in the first 2s, payoff every 3 to 5s, start on a downbeat. Add the energy column (0 to 3 per bar) that drives the score. With a voiceover: write the script in a VO column next to the shots it plays over, and a caption column (`bottom`, `top`, or `off` when the same words are on screen as type).
4. **Lane plan:** a lane column in the shotlist, with one line of why for every shot not in 2D, plus the Poly Haven assets each 3D shot needs. Pick 3D only when depth, light or material is the point of the shot. Blender only when R3F can't sell it (volumetrics, refraction, sims, photoreal); 0 to 3 plates per film.
5. **Generation list:** every asset to generate or license (images, 2 Lyria takes, voiceover, paid Stock), with a count and what each is for. Nothing is generated before this OK.

## Remotion build
- Everything derives from `useCurrentFrame()`; `const t = frame / fps`. No CSS transitions or animations, no `setTimeout`, no state carried between frames. Seeded noise only: Remotion's `random(seed)`, never `Math.random`.
- Fonts local (`staticFile`, loaded with `@remotion/fonts` `loadFont`) and loaded before render. Use the same font files the brand's site uses: if it loads a variable font (a Google Fonts URL with `opsz` or `wdth` axes, or `font-variation-settings` in its CSS), install the `@fontsource-variable/*` file, not the static weights, or rebuilt UI wraps and widths won't match the capture. Copy the site's `text-wrap` (`balance`, `pretty`) on rebuilt headings for the same reason. No `will-change` on camera-scaled elements (blurs text).
- One `Composition` per format (16:9, 1:1, 9:16) sharing one component; lay scenes out with a function of `useVideoConfig()` width and height, never fixed pixels. Reframe type and UI per format; never crop 16:9 into vertical.
- 9:16 safe zone: keep type, UI and logos out of the bottom 20% and the right 12% (Reels/TikTok/Shorts overlays) and the top 10%. Backgrounds can bleed.
- With captions, the caption bands are reserved like the safe zone, before any scene is laid out (see Voiceover and captions).
- Motion blur: wrap only fast-moving layers in `<CameraMotionBlur samples={6} shutterAngle={180}>` from `@remotion/motion-blur`; it multiplies render cost by the sample count.
- Audio: `<Audio src={staticFile('mix.wav')} />` from `@remotion/media`, so the studio preview plays in sync.

## Motion
- Springs from `motion.ts` for UI, cards and anything physical. Camera through `camera.ts` (springs with the `default`/`heavy` preset, or its `cubic` ease when a style skill wants no overshoot). Tiny overshoot on UI, none on type.
- Presets: `snappy` UI and leading edges, `default` cards and camera, `title`, `stagger` grids, `heavy` big type, logos and 3D objects, `playful` mascots.
- GSAP eases are fine for type and graphic moves where a spring reads wrong (a `power3`/`power4` out on a type slam, `expo` on a wipe). Linear only for constant spins, scrolls and tickers. Never bouncy or elastic eases.
- Any value with more than one target uses `track(t, [[t0,v0],[t1,v1],...])`, never restarting a spring.
- Moving highlights and tabs use `indicator()` so leading and trailing edges stretch.
- Text in morphing elements uses `swapAlpha()`: enters after the morph starts, leaves before the next.
- Loops: `loopT`, and the last frame must equal the first, including cursor position and velocity.

## 2D lane (GSAP)
- Use GSAP for what it does better than hand-rolled code: `SplitText` (per-char, word, line), `MorphSVGPlugin`, `DrawSVGPlugin`, `MotionPathPlugin`. All plugins ship in `gsap`; `gsap.registerPlugin(...)` once at module level.
- Only through `useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => ...)` from `@remotion/gsap`, with `ref={scope}` on the container. It builds a paused timeline and seeks it to the frame, replaying from 0, so any frame renders identically. Never `gsap.to` outside it, never `play()`, no ScrollTrigger.
- Timeline positions in seconds on the beat grid: `timeline.from(chars, {...}, beatTime)`.

## Tool menu (2D, all pinned to the project's Remotion version)
Pick per shot; install only what the shotlist uses. Check the API with context7 before first use.
| Need | Package | Use |
|---|---|---|
| Scene-to-scene transitions | `@remotion/transitions` | `<TransitionSeries>` with `linearTiming({ durationInFrames, easing })` or `springTiming()`; presentations `fade`, `slide`, `wipe`, `flip`, `clockWipe`, `iris` (each from `@remotion/transitions/<name>`). Hard cuts need nothing. |
| Line draws, path motion, shape morphs | `@remotion/paths` | `evolvePath(progress, d)` for draw-ons, `getPointAtLength` / `getLength` for cursors and objects on a path, `interpolatePath(t, a, b)` for simple morphs (`MorphSVGPlugin` for hard ones) |
| Fit and measure type | `@remotion/layout-utils` | `measureText` (anchor a typewriter so the finished line ends centered), `fitText` (largest size within a width), `fillTextBox` (line breaks for captions and cards). Load the font first. |
| Organic drift, smoke, wobble | `@remotion/noise` | `noise2D(seed, x, y)` / `noise3D(seed, x, y, t)`: seeded, deterministic, smooth (not `random()`, which jumps every frame) |
| Primitive shapes as SVG | `@remotion/shapes` | `<Circle>`, `<Rect>`, `<Triangle>`, `<Star>`, `<Pie>` and `make*()` paths to animate with `@remotion/paths` |
| Designer-made animations | `@remotion/lottie` | `<Lottie animationData={...}>` for icon or mascot loops a designer supplies; never for core type or UI |
| Light leaks over cuts | `@remotion/light-leaks` | Warm overlay on a cut or reveal, only when the style wants film texture |
| Video clips and audio | `@remotion/media` | `<Video>` for screen recordings and footage (trim, `playbackRate`), `<Audio>` for the mix |
| Motion blur | `@remotion/motion-blur` | `<CameraMotionBlur>` on fast layers only (see Remotion build) |
| Per-letter type, SVG draw/morph | `gsap` via `@remotion/gsap` | See 2D lane |

## 3D real-time lane (R3F)
- `<ThreeCanvas width={width} height={height} camera={...}>` from `@remotion/three`; width and height are required.
- Animate only from `useCurrentFrame()` props (rotation, position, material values). Never R3F's `useFrame`, never `clock`.
- Light with an HDRI: `<Environment files={staticFile('<slug>_1k.hdr')} />` from drei; `background` only when the HDRI is the visible backdrop (then 4k+). Add one key light only if the HDRI alone is flat.
- Models: Poly Haven glTF in `public/`, loaded with drei `useGLTF`. Suspense is handled: ThreeCanvas delays the render until loaders resolve.
- Physical materials (`meshPhysicalMaterial`, clearcoat, transmission sparingly) read as product; default standard grey reads as a demo.
- Tone mapping AgX in both 3D lanes so R3F shots and Blender plates match: `<ThreeCanvas gl={{ toneMapping: THREE.AgXToneMapping }}>` here, `view_settings.view_transform = 'AgX'` in Blender.
- Set `Config.setChromiumOpenGlRenderer('angle')` in `remotion.config.ts`; if a render shows black or flickering canvases, add `--concurrency=1`.

## Blender plates (offline 3D lane)
1. With the MCP: `get_scene_info`, then build the shot with `execute_blender_code`. Without it: write `plates/<shot>.py` (a new scene, objects linked to it, `sys.argv` after `--` for the output folder and an optional single test frame) and run `/Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup --python plates/<shot>.py -- public/plates/<shot> [frame]`. Same rules either way; `--factory-startup` never loads the user's prefs or file. Follow the MCP's rules: shader nodes by type, read enum identifiers instead of hardcoding (EEVEE's id differs across versions).
2. Scene fps = project fps. Keyframe key moments on beat frames: `round(beat_time * fps)` relative to the plate's start, from `beats.json`.
3. Physics and particles: fixed seeds, bake before rendering.
4. Check composition and light before rendering everything: `look` at small `max_size` with the MCP, or render 2 test frames (mid-shot and end) headless and view them downscaled.
5. Output: EEVEE (Cycles only for refraction or caustics that need it), film transparent, PNG RGBA, resolution = composition size, `frame_start = 1`, to `public/plates/<shot>/####.png`. AgX view transform. Motion blur on (`render.use_motion_blur = True`, `motion_blur_shutter = 0.5`, i.e. 180°) so plates match `CameraMotionBlur` layers. Keep `render.dither_intensity` at 1+; volumetric or gradient plates band at 8-bit, so add light grain over them in the comp. Build each plate in its own new scene (never touch the user's open scene) and set `scene.blendermcp_use_polyhaven = True` on it (the toggle is per scene). `os.makedirs` the folder first (Blender won't create it), and save with `bpy.ops.wm.save_as_mainfile(filepath=..., copy=True)` so the user's session file is untouched. Render headless from the shell so the MCP connection stays free: `/Applications/Blender.app/Contents/MacOS/Blender -b plates/<shot>.blend -S <scene> -a`. Remove the scene from the live session afterwards.
6. In Remotion, play the sequence inside a `<Sequence from={start}>` with `<Img src={staticFile(`plates/<shot>/${String(frame + 1).padStart(4, '0')}.png`)} />` and composite type and UI over it.
7. A plate that needs different framing per format gets one render per format; otherwise render once at the largest size.

## Assets (Poly Haven)
- All CC0: no attribution needed, but don't redistribute the raw files as an asset pack. `manifest.json` keeps author and source anyway.
- Everything goes through `polyhaven.mjs` into the shared cache, then `--copy` into `public/`. Never download straight into a project, so assets are reused across films.
- Resolution: 1k to 2k HDRIs for lighting and reflections, 4k+ only when visible as background; 1k textures and models unless the camera gets close. A missing res errors with the available list.
- Blender can also pull them via the MCP's `search_assets` / `import_asset` once Poly Haven is on.
- Browse at polyhaven.com; `studio_small_*` HDRIs are the safe default for product shots.

## Assets (Adobe, optional)
Only when the Adobe MCP is connected; call `adobe_mandatory_init` once per conversation (it returns ~6k tokens of routing docs, so never again). Poly Haven stays the source for 3D, HDRIs and textures.
- Photos and footage: Adobe Stock first. `asset_search` → `asset_preview_file` → `asset_license_and_download_stock`. Use it only if a result fits the shot and licenses free. If the only good results cost credits, generate instead; ask about the paid one only when it's clearly better than anything generated would be. Log the Stock ID in `manifest.json`.
- No good free Stock option, or the shot needs something Stock can't have (the product itself, a specific brand scene): generate it with the `genmedia-assets` skill.
- Cutouts for layered or parallax shots: `image_remove_background` (transparent PNG).
- Logos, icons and simple flat shapes to animatable SVG: `image_vectorize`. Not for photos; auto-traced photos morph badly.
- Fill a format without bad crops: `image_generative_expand` (16:9 ↔ 9:16).
- Halftone, glitch, color and grain tools to bake a look into a photo or plate before it's animated. Film grain over moving frames still goes in the comp.
- Recorded voiceover cleanup: `media_enhance_speech` (see Voiceover and captions).
- Not for animation: Remotion does that, and `animate_design` is too basic.

## Sound
- Final music is Lyria (`lyria-3.5`, per `genmedia-assets`). **Timing wins:** the approved shotlist never moves to fit the music; the music is conformed to the shotlist's grid.
- Prompt from the brief and shotlist: palette mood and instruments, the shotlist BPM, key, `instrumental`, and the energy arc with times in seconds ("quiet pad until 0:08, build 0:08 to 0:16, full from 0:16, settle at 0:52"). Ask for the film's length plus about 2 bars.
- Generate 2 takes (`public/music_raw_a`, `_b`; part of the confirmed count). `lyria.py` writes 44.1 kHz WAV, so resample each to 48 kHz first (`ffmpeg -i public/music_raw_a.wav -ar 48000 public/music_a.wav`), then measure both with `beats.py --grid <bpm>` and let the user pick by ear. Recommend the one with the smaller stretch and drift.
- Lyria treats BPM and length as hints: in testing, one take came back at 122.5 BPM and 58 s for a 116 BPM, 34 s ask, so never assume a take matches the prompt. If only one take passes the checks below, recommend it and say why the other failed. A take refused with `content_blocked` on a harmless prompt: reword once (plainer genre words, no brand or product context); a refused call isn't a take and doesn't count against the confirmed number.
- Conform the pick: `ffmpeg -i public/music_raw_a.wav -af "atrim=start=<max(first_beat, 0)>,asetpts=PTS-STARTPTS,atempo=<stretch>,atrim=0:<dur>,afade=t=out:st=<dur - one bar>:d=<one bar>" public/music.wav` (where the style wants a silent tail, end the fade at the tail's start instead).
- Re-run `beats.py public/music.wav --grid <bpm>` to confirm: `stretch` within 0.1% of 1 and `max_drift_ms` under one frame (42 ms at 24 fps, 33 at 30). Drift is measured only on 8-beat windows with a clear beat; `beatless_windows` counts the skipped pads, breaks and tails (a few is normal, most of the track means the take has no usable pulse). Fails: stretch more than 3% off (audible) or drift over a frame (the take wanders) means that take can't be used; say so and ask before generating another.
- Lyria won't put its builds and drops exactly on the shotlist's energy steps, so every energy step into 2+ gets a `riser` and `impact` SFX cue on its downbeat (that's what sells the hit on the cut), whatever the take does there.
- The synthesized score below is for drafts and timing passes before the Lyria track exists, or the final when the user asks for it.
- Write `docs/score.json` from the shotlist's energy column: `{ bpm, dur, key, scale, palette, seed, sections: [{ bar, energy }] }`. 0 silence, 1 pad, 2 pad + bass + arp + hats, 3 full kit with sidechain pump. Stepping up into 2+ automatically gets a riser over the previous bar and an impact on the downbeat, so put big reveals on those steps.
- Palette from the brief or the reference's audio: `analog` (warm synth, four-on-floor, launch promos), `glass` (FM bells, airy, light kit; clean SaaS, design tools), `cinematic` (slow swells, staccato ostinato, taiko booms, big space; reveals, trailers), `lofi` (keys with sevenths, swung boom-bap, dusty; casual, lifestyle, creators), `tech` (square waves, rolling 16ths, offbeat bass, dry; dev tools, data, infra).
- No two films get the same sound: never reuse a seed, and vary key and BPM between films in a series. Only keep the palette fixed across a deliberate series.
- `minor` for tension and problem-led stories, `major` for upbeat. Never sit at energy 1 for more than 8 bars. End on 1 or 0 under the logo.
- Try 2 or 3 seeds and keep the one whose progression and arp fit (the script prints both); pin it with `"progression": n` if only the arp should change.
- SFX on the shotlist's cuts, reveals and UI moments via `sfx.mjs`, passing the score's seed and key. `hits` are candidates, not a to-do list: never one per beat. Skip impact and riser cues on energy steps, the score already plays them there (with Lyria or a supplied track, add them yourself). Pick voices to match the palette (chime and swish for glass, glitch and tick for tech, impact and riser for cinematic).
- With a supplied track: skip `score.json`, measure it with `beats.py`, cut the shotlist to its beats and sections, and use it in place of `score.wav` in the mix below. Don't pass `--key` to `sfx.mjs` unless the user gives the track's key.
- The music input below is `public/music.wav` (conformed Lyria); for drafts use `public/score.wav`, with a supplied track use that file.
- TP is -1.5 in the mixes below, not -1: the AAC encode adds a few tenths of overshoot, and -1 measured -0.9 after render.
- Mix into the Remotion project: `ffmpeg -i public/music.wav -i out/sfx.wav -filter_complex "[0][1]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5[a]" -map "[a]" -ar 48000 public/mix.wav`
- With a voiceover, duck the music under it: `ffmpeg -i public/music.wav -i public/vo.wav -i out/sfx.wav -filter_complex "[1]asplit=2[vo][sc];[0][sc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[bed];[bed][vo][2]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5[a]" -map "[a]" -ar 48000 public/mix.wav`

## Voiceover and captions
Only when the user said yes to a voiceover for this film; skip this whole section otherwise.
- Voice is Gemini TTS through `genmedia-assets` (model, voice and prompt rules live there). One voice per project; pick it with the user from `list_gemini_voices`. Lock the script before generating, one take for the whole script, and regenerate only lines the user flags.
- A recorded human voiceover gets Adobe `media_enhance_speech` before the mix.
- Transcribe the final VO with `gemini_transcribe` (word timestamps, brand names in `custom_vocabulary`) into `docs/vo_words.json`. Use it for timing only: it rewrites words (`$4.10` came back as `$4 ten`, `single-origin` as two words), times in 100 ms steps, and has returned a word ending before it starts. Align the locked script to it word by word, re-join split tokens, force timestamps to increase, and take caption text from the script.
- Timing wins here too: the TTS take runs at its own pace and the shotlist doesn't move. Cut the take at its pauses into phrases, one per shot or act in the VO column, and place each so its first word lands on a beat: per phrase `atrim` (40 ms before the first word, 120 ms after the last) and `adelay`, then `amix=normalize=0,apad=whole_dur=<film dur>` into `public/vo.wav` (keep the take as `public/vo_take.wav`). A phrase too long for its slot may be sped up by at most 5% (`atempo=1.05`); past that, shorten the line and regenerate only it. No phrase crosses a hard cut mid-word. Shift each word's timings by the same placement and tempo for the captions.
- Captions are burned in whenever there's a voiceover, built with `@remotion/captions` (pinned with the other `@remotion/*`; follow the captions guide in Remotion's agent skills, check the API with context7). Convert `vo_words.json` to `Caption[]`: each word's `text` with a leading space (the package splits on it), `startMs`, `endMs`, `timestampMs: null`, `confidence: null`. Set `pageBreakAfter: true` on words ending in `. ? ! , ;` and wherever the phrase would pass 2 lines (about 32 characters per line in 16:9, 24 in 9:16; the package doesn't count characters). Then `createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: 10000, breakOnSilenceAfterMilliseconds: 250 })`: the combine value caps a page at that many ms from its first word, so 3000 cuts sentences mid-phrase; `pageBreakAfter` does the breaking. Each page shows from its first word to its last word plus 150 ms, clipped to the next page's start, and clipped at the start of any scene whose caption band differs (a bottom page must not run into a shot that owns the bottom). Box about 78% of frame width with `text-wrap: balance` (no widowed last word), text about 46 px × `u` so it reads on a phone. Remotion's own captions skill points at its Basic Captions element; use this page component instead, since the bands and page rules live here. Word-by-word highlight (accent on the active token) only when the brief wants a social, energetic feel; otherwise plain. Display face or UI face, never a third font, on a soft backing (rounded, about 60% of the dark neutral) so it reads on any frame.
- Also write `out/captions.srt` with `serializeSrt` and deliver it next to each MP4: platforms take it as an uploaded caption track viewers can toggle. It holds every spoken line, including those whose caption column is `off` (only the burn-in skips them), built with the same page rules so cues never overlap. Run the script with `npx -y tsx` so it can import the caption code and JSON.
- Caption bands, reserved per format before layout (`captionBand(width, height, 'bottom' | 'top')` in the layout code):
  - 16:9 and 1:1: bottom band 80 to 92% of height, top band 6 to 18%.
  - 9:16: bottom band 62 to 78% (above the platform overlay zone), top band 11 to 24%.
- Nothing important goes in the active band: product UI, key type, logos, faces, the cursor, demo moments. Lay scenes out around it from the start. When a shot needs the bottom of the frame, its caption column says `top`. When the same words are on screen as type, the caption column says `off`.

## Critique loop (before showing the user anything)
1. One still per beat: `npx remotion render <Comp> out/stills --sequence --frames=<beat frames, comma-separated> --image-format=png`, tile with `ffmpeg -pattern_type glob -i 'out/stills/*.png' -vf scale=270:-1,tile=6x5 out/contact.png`. LOOK at it. With captions, also render the stills with a debug outline on the active caption band and check that nothing important sits inside it.
2. Draft renders at `--scale=0.5`. After a full render also check:
   - Contact: `ffmpeg -i out/final.mp4 -vf fps=2,scale=270:-1,tile=6x5 -frames:v 1 out/contact.png`
   - Motion strip (12 frames around a suspect moment): `-ss 4.0 -i out/final.mp4 -vf scale=270:-1,tile=12x1 -frames:v 1 out/strip.png`
   - Phone test: `-vf fps=1,scale=360:-1,tile=5x3 -frames:v 1 out/phone.png`
   - Sound-off test: watch the phone contact muted. The story must read from on-screen text alone (most autoplay is muted).
   - Loop seam: `ffmpeg -stream_loop 1 -i out/final.mp4 -c copy out/loop_check.mp4`
   - Determinism: render the same stills twice and compare md5. Covers GSAP and R3F shots too. If one differs, measure it (`ffmpeg -i a.png -i b.png -filter_complex "blend=all_mode=difference,format=gray,signalstats,metadata=print:key=lavfi.signalstats.YMAX:file=-" -f null -`): a max of 1 or 2 out of 255 is compositor rounding (blend modes, blur filters) and passes; more is real nondeterminism to fix.
   - Loudness: `ffmpeg -i out/final.mp4 -af ebur128=peak=true -f null -` reads about -14 LUFS, true peak under -1.
3. Score 1 to 10: hook in first 2s, readability at phone size, works with sound off, motion quality, variety, composition, depth, brand accuracy, sound sync, polish; plus voice and caption readability when there's a voiceover.
4. Hunt list: text overlapping during swaps, anything sliding instead of springing, corner labels, centered-on-gradient shots, blurry scaled text, dead beats, loop-seam stutter, 3D that adds nothing a 2D shot wouldn't, flat-lit or plastic-looking 3D, plates with edges that don't sit in the comp, plates strobing next to blurred layers, banding in plates, type or UI inside the 9:16 overlay zones, SFX on every beat, music energy fighting the picture, captions covering UI, type, a logo or a face, captions repeating on-screen type, cuts mid-word, music masking the voice.
5. Fix the 3 worst problems (with timestamps). Re-render only affected frames with `--frames=<from>-<to>`. Log scores and fixes in `docs/review_log.md`.
6. Minimum 3 rounds. Repeat until every score is 8+, then the full render.

## Look
- Banned defaults: centered title on gradient, everything fading in, corner labels and frame borders, glow on UI chrome, generic particle bursts, bouncy easing, dead time, 3D for its own sake.
- One display face, one UI face. One accent color unless the brief says otherwise.
- Every 2 to 4 seconds something new must happen on screen.

## Deliverables
Per format: `npx remotion render <Comp> out/final-<format>.mp4 --codec=h264 --crf=16`, verified with `ffprobe -v error -show_entries stream=width,height,r_frame_rate,duration -of default=nw=1`. Plus `out/poster.png`, `out/contact.png`, `out/loop_check.mp4` for loops, `out/captions.srt` with a voiceover, clean source.
