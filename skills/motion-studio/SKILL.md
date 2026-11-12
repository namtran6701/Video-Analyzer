---
name: motion-studio
description: Produce deterministic, beat-locked motion films (promo videos, animated explainers, social clips, kinetic typography) in Remotion, routing each shot to the lane that fits it: 2D (React/SVG + GSAP), real-time 3D (React Three Fiber), or offline 3D (Blender plates), with Poly Haven and Adobe Stock assets, SFX synthesized in code, a Lyria score (synthesized for drafts) or the user's licensed track, and optional Gemini voiceover with burned-in captions. Covers gates, beat grid, lanes, audio, voiceover and captions, the scored critique loop and multi-format delivery. Use when the user asks for a motion piece, animated video, promo film or launch video, and always as the production layer under the style skills (product-demo-video, claude-feature-video, deepseek-feature-video, mobile-agent-video, news-explainer-video, app-tutorial-video) and video-study.
---

# Motion studio

```
gates ──► lane plan ──► assets + plates ──► Remotion build ──► score + SFX ──► critique loop ──► license + swap ──► deliver
(OK each)  (OK)          (Poly Haven, Stock,   (2D, R3F, comp)   (Lyria final,   (3+ rounds)       (Getty, per-asset   (ffmpeg QA,
                          Blender)                                synth drafts)                     OK)                 no comps)
```

## Style skills sit on top of this one
Style skills (product-demo-video, claude-feature-video, deepseek-feature-video, mobile-agent-video, news-explainer-video, app-tutorial-video, and any reference built with video-study) are direction only: palette, type, story template, motion library, look frames, tokens and the overrides they list. This skill is the production layer under all of them: gates, lanes, toolbox, build rules, sound, critique loop and delivery. When a style skill is in play, load both, run this pipeline end to end, and feed the style skill's inputs into each stage. A style skill's explicit overrides win (BPM, easing, voiceover, formats); everywhere it is silent, this skill's rules apply. Style skills don't ship their own copies of the toolbox (`motion.ts`, `camera.ts`, `kit.tsx`, `frames.tsx`, `captions.tsx`, the audio scripts); they set parameters for them in their `tokens.ts` and pass colors, sizes and fonts in as props.

When the working repo has a CLAUDE.md, its layout and delivery conventions (project folder, workspaces install, where finals are copied) override the defaults in Setup and Deliverables.

Remotion is the single build engine and timeline. Each shot goes to the cheapest lane that still looks right; the brief decides, not a house style. Most films are mostly 2D.

| Lane | Tool | Use for | Cost |
|---|---|---|---|
| 2D | React/SVG + GSAP | type, UI, icons, charts, line draws, shape morphs | instant |
| 3D real-time | R3F in `<ThreeCanvas>` | product spins, glTF models, 3D logos and type, glass, camera through a scene, 3D data viz | seconds |
| 3D offline | Blender plates | volumetric light, caustics, physics sims, photoreal close-ups | minutes per plate |

ffmpeg mixes, encodes and checks. Music: a Lyria track for every final cut, the synthesized score for drafts and timing passes; a licensed track from the user replaces both. Voiceover is optional and off by default: ask the user whether this film gets one before the shotlist, never assume. If yes: Gemini TTS, always with captions. If no: music and SFX only, no captions. Generated images, music and voice all go through the `genmedia-assets` skill.

**Generation is always confirmed.** Before any image, Lyria track, voiceover or any Stock license (Getty or Adobe), tell the user exactly what and how many ("3 images: hero, 2 backgrounds; 2 Lyria takes; 1 voiceover. OK?") and wait for the OK. Regenerations count too.

## Toolbox (bundled in `scripts/`, copy, don't rewrite)
- `motion.ts` → `src/lib/motion.ts`: closed-form `spring`, `track`, `indicator`, `swapAlpha`, `loopT`. Pure functions of seconds, call with `frame / fps`.
- `camera.ts` → `src/lib/camera.ts`: virtual camera over a flat 2D world (UI, screenshots, type). `cameraAt(keys, frame, ease?, fps?)` with keys `{ f, x, y, s, rx?, ry?, rz?, cut? }`: geometric zoom, optional 3D tilt, hard cuts. `ease` is `'cubic'` (default; no overshoot, lands exactly on each key) or a `motion.ts` preset (a spring via `track`). `drift()` keeps holds alive (+1.5% scale), `cameraTransform(pose, width, height)` gives the CSS transform for the world container (`transformOrigin: "0 0"`, a `perspective: 1800` wrapper for tilts). Style skills define their named poses (wide, close-up, tilted) in `tokens.ts`, never their own camera.
- `camera3d.tsx` → `src/lib/camera3d.tsx`: the same camera for R3F shots. `cameraAt3d(keys, frame, ease?, fps?)` with keys `{ f, pos, target, fov?, cut? }` (fov defaults to 35), same eases and cut rules as `camera.ts`. `pathAt(points, progress)` moves along a smooth curve at constant speed (key `progress` on the grid, then `{ ...pose, pos: pathAt(...) }`), `drift3d()` keeps holds alive (closes 1.5% of the distance to the target), `<Camera3D pose={pose} />` inside `<ThreeCanvas>` makes it the scene camera.
- `post3d.tsx` → `src/lib/post3d.tsx`: `<PostFX>` (use it in place of `<EffectComposer>`) and `<Grain amount={0.04} />` (in place of `<Noise>`). See 3D real-time lane.
- `logo3d.tsx` → `src/lib/logo3d.tsx`: `<Logo3D src="brand/logo.svg" width depth bevel color? />` extrudes the SVG captured at the brand gate (fills only, each path keeps its fill unless `color` is set). `<Type3D font="fonts/<brand>.ttf" text="..." />` sets a kerned line in the brand font and extrudes it the same way (needs `opentype.js`). Both come out centered, upright, `width` units wide, facing +z, and hold the frame until loaded.
- `polyhaven.mjs`: `node polyhaven.mjs <slug> [res=1k] [--copy public/]`. Fetches a CC0 asset into `~/Movies/assets/polyhaven/{hdri,texture,model}/`, verifies md5, logs it in `manifest.json`, prints the path. HDRI → `.hdr`, texture → folder of jpg maps, model → glTF folder.
- `score.mjs`: `node score.mjs plan.json public/score.wav`. Beat-locked original score from an energy-per-bar plan in one of 5 palettes (instruments, kit, groove, space), with auto risers and impacts. The seed picks the progression and arp pattern. Same plan, same file.
- `sfx.mjs`: `node sfx.mjs cues.json out/sfx.wav --dur N --seed <score seed> --key <score key>`. Voices: click, tick, pop, thump, chime, glitch, whoosh, swish, riser (ends at `t`), impact. Per cue `pitch` (semitones) and `len`. The seed sets the film's SFX register and brightness and humanizes each hit; `--key` tunes pitched voices to the score.
- `mix.mjs`: `node mix.mjs public/mix.wav --music <bed> --sfx out/sfx.wav [--vo public/vo.wav]`. One static gain to -14 LUFS, then a limiter on the peaks over -1.5 dB true peak. With `--vo` it ducks the music under the voice.
- `audiocheck.py`: `uv run --with numpy --with soundfile python3 audiocheck.py out/final.mp4 --mix public/mix.wav --sfx out/sfx.wav --cues docs/sfx.json --fps <fps>`. Fails when a file in the chain cues → SFX stem → mix → render is older than the one it's built from, when the render's audio isn't `mix.wav` in sync, or when a cue has no sound in the stem.
- `finish.tsx` → `src/lib/finish.tsx`: `<Finish grain={GRAIN}>` wraps the whole film once. See Remotion build.
- `kit.tsx` → `src/lib/kit.tsx`: the 2D primitives, all pure functions of `t` in seconds. `ramp`, `typed` (typewriter), `press`, `wipe` and `band` (clip-paths); `cursorAt(keys, t)` with keys `{ t, x, y, click? }` where `t` is the arrival, so clicks sit on the beat, and `<Cursor>` whose tip is at `(x, y)`; `<Caret>`; `<Words>` for a line built word by word: `enter` is `'rise'` (kinetic, each word out of its own slot), `'fade'` (calm, in place) or `'light'` (dim line, each word lights at its time), with `[name]` inline icons, `*accent*` words, a fixed `step` or per-word `times` from the voiceover, and an `exit`.
- `frames.tsx` → `src/lib/frames.tsx`: `<BrowserWindow width height title url>` (light generic chrome; children fill the area under it) and `<PhoneFrame>` (screen in app points, bezel outside it). Static boxes for the camera world: `camera.ts` moves them.
- `captions.tsx` → `src/lib/captions.tsx`: `captionBand(width, height, 'bottom' | 'top')` and `<Captions pages fontFamily>` (`debug` outlines the active band). See `references/voiceover.md`.
- `vo.py`: `python3 vo.py docs/vo.json`. Aligns the locked script to the take's transcript, lands each phrase on its beat, and writes `public/vo.wav`, `src/vo_words.json`, `src/captions.json` and `out/captions.srt`. Prints the words the transcript heard differently. See `references/voiceover.md`.
- `beats.py`: `python3 beats.py --bpm 116 --dur 60 > beats.json` → bpm, beats, downbeats, hits (= downbeats). Same grid as `score.mjs` (beat 0 at t = 0). For a track, `uv run --with librosa --with soundfile python3 beats.py track.wav [--grid <bpm>] > beats.json` measures it (uv fetches librosa, nothing global): `bpm` from a steady-grid fit (accurate to about 0.05 BPM), `first_beat` (trim point), hits are its onsets. With `--grid` it adds `stretch` (the atempo ratio to that BPM) and `max_drift_ms` (worst beat off a steady tempo). It finds beats, not bar lines: beat 1 is assumed to be the first beat.

Setup: Node 22+, ffmpeg, a Remotion project (`npx create-video@latest`, blank template) and Remotion's own agent skills (`npx skills add remotion-dev/skills`). Install only the lanes the lane plan uses, versions exact, `@remotion/*` pinned to the project's Remotion version: `@remotion/gsap gsap` for 2D, `@remotion/three three @react-three/fiber @react-three/drei` (+ `-D @types/three`) for real-time 3D (+ `@react-three/postprocessing postprocessing` when a 3D shot uses post-processing, `opentype.js` + `-D @types/opentype.js` for `Type3D`), `@remotion/fonts` always, plus any package from the Tool menu below that the shotlist needs. Check current APIs with context7 before writing framework code. For Blender, call `mcp__blender__get_addon_status` first. If it can't connect, don't wait on the user: write the plate as a bpy script and render it headless (see Blender plates). The MCP is for live iteration, not a requirement.

## Gates (wait for the user's OK at each)
1. **Brand:** capture the real site into `public/brand/` (screenshots, logo, colors, fonts). Screenshots with the Chrome DevTools MCP (`emulate` with viewport `<w>x<h>x<dpr>`, then `take_screenshot` to a path relative to the working folder; it can't write outside it), at device scale factor 2+ (3 when the camera goes in close). Its own Chrome profile allows one instance: if it reports the profile is in use, kill the processes whose command line contains `chrome-devtools-mcp/chrome-profile` and retry. If the first `new_page` vanishes ("No page found" on the next call), open it again. Same pixels as Playwright (both drive Chrome over the DevTools protocol), but no install and states (open menus, typed prompts, hidden banners) are set up by looking at the page. Use a Playwright script only for a large batch that will be recaptured after UI changes. Screen recordings (a real app doing something at 1x: montage clips, results playing on their own): `screencast_start` / `screencast_stop` from the same MCP while driving the page, or the user's own recordings; 1080p+, 30fps, H.264 (`ffmpeg -c:v libx264 -r 30 -pix_fmt yuv420p`), trimmed to one action each into `public/clips/`. Recordings go soft when the camera pushes in, so anything shown closer than 1.2x is rebuilt in React from 3x screenshots instead. Never fake a recording with a pan over a still. List findings. Never redraw product UI from memory.
2. **Reference (if supplied):** extract frames with ffmpeg, write `docs/style_guide.md` (grammar only, never content, logos or characters).
3. **Shotlist:** pick BPM (100 to 124 for promos) and fps (the style skill's `FPS`; without one, 30, or 24 when the brief wants a film feel; never 60 unless asked). Prefer a pair where a beat is a whole number of frames (`fps * 60 / bpm`: 120 or 100 at 30, 120 or 90 at 24), so cuts don't round off the grid. Run `beats.py`, write `docs/shotlist.md` as a state list on the beat grid: what is on screen at each beat, not a vibe. Hook in the first 2s, payoff every 3 to 5s, start on a downbeat. Add the energy column (0 to 3 per bar) that drives the score. With a voiceover: write the script in a VO column next to the shots it plays over, and a caption column (`bottom`, `top`, or `off` when the same words are on screen as type).
4. **Lane plan:** a lane column in the shotlist, with one line of why for every shot not in 2D, plus the Poly Haven assets each 3D shot needs. Pick 3D only when depth, light or material is the point of the shot. Blender only when R3F can't sell it (volumetrics, caustics, sims, photoreal; glass refraction stays in R3F); 0 to 3 plates per film.
5. **Generation list:** every asset to generate (images, 2 Lyria takes, voiceover) and every stock shot (count, photo or footage), with what each is for. Nothing is generated before this OK. Stock picks and licenses get their own confirmations (see Stock sourcing).

## Remotion build
- Everything derives from `useCurrentFrame()`; `const t = frame / fps`. No CSS transitions or animations, no `setTimeout`, no state carried between frames. Seeded noise only: Remotion's `random(seed)`, never `Math.random`.
- Fonts local (`staticFile`, loaded with `@remotion/fonts` `loadFont`) and loaded before render. Use the same font files the brand's site uses: if it loads a variable font (a Google Fonts URL with `opsz` or `wdth` axes, or `font-variation-settings` in its CSS), install the `@fontsource-variable/*` file, not the static weights, or rebuilt UI wraps and widths won't match the capture. Copy the site's `text-wrap` (`balance`, `pretty`) on rebuilt headings for the same reason. No `will-change` on camera-scaled elements (blurs text).
- One `Composition` per format (16:9, 1:1, 9:16) sharing one component; lay scenes out with a function of `useVideoConfig()` width and height, never fixed pixels. Reframe type and UI per format; never crop 16:9 into vertical.
- Sizes in `u = Math.min(width, height) / 1080`: one unit is 1 px on the short side of a 1080 frame, so type and spacing hold across formats and resolutions. Define it once in the layout code (style skills' `tokens.ts` may already).
- Type floor: text the viewer has to read is 36 px × `u` or larger (captions 46). Product UI text smaller than that gets a camera push-in, not a bigger font.
- 9:16 safe zone: keep type, UI and logos out of the bottom 20% and the right 12% (Reels/TikTok/Shorts overlays) and the top 10%. Backgrounds can bleed.
- With captions, the caption bands are reserved like the safe zone, before any scene is laid out (see Voiceover and captions).
- Motion blur: wrap only fast-moving layers in `<CameraMotionBlur samples={6} shutterAngle={180}>` from `@remotion/motion-blur`; it multiplies render cost by the sample count.
- Build from the toolbox first: cursor, caret, typed text, word-by-word lines, browser window, phone frame and captions come from `kit.tsx`, `frames.tsx` and `captions.tsx`, skinned with the style skill's tokens. Write a new component only for what they don't cover.
- Finish: the whole film sits inside one `<Finish>` from `finish.tsx`. Its default grain (0.015) doesn't read as texture; it's there so gradients and soft shadows don't band at 8 bits. 0.03 to 0.06 is visible film grain, a style decision: only when the style skill sets `GRAIN` in `tokens.ts` or the brief asks, and then leave `<Grain>` out of the 3D shots so they aren't grained twice.
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
- Camera through `camera3d.tsx`, keys on beat frames from `beats.json`, like 2D shots. Never a hand-rolled camera, never `OrbitControls`, `CameraShake` or other drei rigs that move the camera on their own.
- Light with an HDRI: `<Environment files={staticFile('<slug>_1k.hdr')} />` from drei; `background` only when the HDRI is the visible backdrop (then 4k+). Add one key light only if the HDRI alone is flat.
- Product, logo and type shots on a plain stage: a studio built from drei `Lightformer`s inside `<Environment resolution={256}>` instead (a big soft key, a thin rim strip behind, a top strip; 2 to 4 in all, aimed with `target`). They shape the highlights an HDRI room can't. `Environment` bakes once (`frames={1}`, the default), so lights that move need `frames={Infinity}`.
- Ground every object that sits near a floor with drei `<ContactShadows>` (soft, `opacity` 0.5 to 0.8, `blur` 2 to 3). Not `AccumulativeShadows`: it builds the shadow over successive frames, so a `--frames` range renders different shadows than the full film.
- Models: Poly Haven glTF in `public/`, loaded with drei `useGLTF`. Suspense is handled: ThreeCanvas delays the render until loaders resolve.
- Physical materials (`meshPhysicalMaterial`, clearcoat) read as product; default standard grey reads as a demo.
- Glass: drei `<MeshTransmissionMaterial>` (`transmission={1}`, `thickness`, `ior` about 1.45, a little `chromaticAberration`, `samples={6}`, `resolution={1024}`, `backside` for thick glass). Keep `temporalDistortion` at 0: it runs on the R3F clock. Glass only reads with something behind it to bend (the logo, type, UI); in front of a plain backdrop it's an outline. It re-renders the scene per glass object, so 1 or 2 per shot.
- Tone mapping AgX in both 3D lanes so R3F shots and Blender plates match: `<ThreeCanvas gl={{ toneMapping: THREE.AgXToneMapping }}>` here, `view_settings.view_transform = 'AgX'` in Blender.
- Set `Config.setChromiumOpenGlRenderer('angle')` in `remotion.config.ts`; if a render shows black or flickering canvases, add `--concurrency=1`.
- Post-processing (`@react-three/postprocessing`) is what makes R3F read as filmed instead of raw WebGL. Use it when a 3D shot is the hero, skip it on small inset 3D. Rules:
  - Always `<PostFX>` from `post3d.tsx`, never a bare `<EffectComposer>`: the composer mounts late, so a bare one renders the first frames of every render and every `--frames` range blank. It also switches the renderer's `autoClear` off, which makes `ContactShadows` pile each frame onto the last; `PostFX` turns it back on.
  - `<ToneMapping mode={ToneMappingMode.AGX} />` (from `postprocessing`) is in the chain, followed only by `Grain`. The composer ignores the renderer's tone mapping, so without it highlights clip and stop matching the Blender plates. Grain goes after it so it reads evenly in darks and highlights.
  - Grain only through `<Grain>`. Postprocessing's `Noise`, and any effect that animates on its own, advances on a wall-clock timer and fails the determinism check.
  - The set: `DepthOfField` with `target={pose.target}` so focus follows the camera key, `Bloom` with `luminanceThreshold={1}` and `mipmapBlur` so only emissive or HDR-bright parts glow, a light `Vignette`, then `ToneMapping`, then `Grain`. One look per film: same values on every 3D shot, and the same grain amount over the plates.
  - No `ChromaticAberration`, `Glitch` or heavy `Bloom` as a default look; only when the brief asks for it.

## Blender plates (offline 3D lane)
Only when the lane plan has a plate (0 to 3 per film): read `references/blender.md` before building it. It covers building with or without the Blender MCP, beat-frame keyframes, render settings that match the R3F lane (AgX, 180° motion blur, RGBA PNG) and playing the sequence in Remotion.

## Assets (Poly Haven)
- All CC0: no attribution needed, but don't redistribute the raw files as an asset pack. `manifest.json` keeps author and source anyway.
- Everything goes through `polyhaven.mjs` into the shared cache, then `--copy` into `public/`. Never download straight into a project, so assets are reused across films.
- Resolution: 1k to 2k HDRIs for lighting and reflections, 4k+ only when visible as background; 1k textures and models unless the camera gets close. A missing res errors with the available list.
- Blender can also pull them via the MCP's `search_assets` / `import_asset` once Poly Haven is on.
- Browse at polyhaven.com; `studio_small_*` HDRIs are the safe default for product shots.

## Stock sourcing (Getty + Adobe, photos and footage)
Only when the generation list has a stock photo or clip, or a shot needs an Adobe tool (cutout, vectorize, generative expand, speech cleanup): read `references/stock.md` first. Every stock shot searches both Getty and Adobe Stock (Adobe: free results only), the user picks from a contact sheet, Getty comps are built with and licensed per asset after the critique loop, and each asset is logged in `docs/stock_manifest.json`.

Before the first Getty call, if `~/.claude/skills/getty-images/SKILL.md` exists, read it for how the Getty MCP tools behave (search filters, comps, licensing rules and tricks). Read the file directly: that skill is manual-only, so it can't be loaded with the Skill tool. Where it conflicts with `references/stock.md`, the stock steps win.

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
- With a supplied track: skip `score.json`, measure it with `beats.py`, cut the shotlist to its beats and sections, and use it as the `--music` input of the mix. Don't pass `--key` to `sfx.mjs` unless the user gives the track's key.
- The `--music` input is `public/music.wav` (conformed Lyria); for drafts `public/score.wav`, with a supplied track that file.
- Mix with `mix.mjs`, never a bare `loudnorm`: `node mix.mjs public/mix.wav --music public/music.wav --sfx out/sfx.wav`, plus `--vo public/vo.wav` to duck the music under a voiceover. It applies one static gain to -14 LUFS and limits only the peaks over the ceiling. `loudnorm` rides the level through the film instead (3 to 7 dB of gain drift measured on past mixes), and its two-pass linear mode falls back to that whenever the peaks don't fit.
- The ceiling is -1.5 dB true peak, not -1: the AAC encode adds a few tenths of overshoot. If `mix.mjs` warns, a few cues are far louder than the rest: lower their gains and mix again.

## Voiceover and captions
Only when the user said yes to a voiceover for this film: read `references/voiceover.md` before the shotlist. It covers the Gemini voice, `vo.py` (transcript alignment, placing phrases on the beat grid, caption pages, the SRT), the burned-in `<Captions>`, and the caption bands reserved per format before any scene is laid out.

## Critique loop (before showing the user anything)
1. One still per beat: `npx remotion render <Comp> out/stills --sequence --frames=<beat frames, comma-separated> --image-format=png`, tile with `ffmpeg -pattern_type glob -i 'out/stills/*.png' -vf scale=270:-1,tile=6x5 out/contact.png`. LOOK at it. With captions, also render the stills with `<Captions debug>` (it outlines the active band) and check that nothing important sits inside it.
2. Draft renders at `--scale=0.5`. After a full render also check:
   - Contact: `ffmpeg -i out/final.mp4 -vf fps=2,scale=270:-1,tile=6x5 -frames:v 1 out/contact.png`
   - Motion strip (12 frames around a suspect moment): `-ss 4.0 -i out/final.mp4 -vf scale=270:-1,tile=12x1 -frames:v 1 out/strip.png`
   - Phone test: `-vf fps=1,scale=360:-1,tile=5x3 -frames:v 1 out/phone.png`
   - Sound-off test: watch the phone contact muted. The story must read from on-screen text alone (most autoplay is muted).
   - Loop seam: `ffmpeg -stream_loop 1 -i out/final.mp4 -c copy out/loop_check.mp4`
   - Determinism: render the same stills twice and compare md5. Covers GSAP and R3F shots too. If one differs, measure it (`ffmpeg -i a.png -i b.png -filter_complex "blend=all_mode=difference,format=gray,signalstats,metadata=print:key=lavfi.signalstats.YMAX:file=-" -f null -`): a max of 1 or 2 out of 255 is compositor rounding (blend modes, blur filters) and passes; more is real nondeterminism to fix.
   - Audio chain: `audiocheck.py` (toolbox) passes: nothing stale, the render's audio is the mix in sync, every cue sounds.
   - Loudness: `ffmpeg -i out/final.mp4 -af ebur128=peak=true -f null -` reads about -14 LUFS, true peak under -1.
3. Score 1 to 10, by a reviewer that didn't build the film: hook in first 2s, readability at phone size, works with sound off, motion quality, variety, composition, depth, brand accuracy, sound sync, polish; plus voice and caption readability when there's a voiceover. Never score your own build. After each draft render, start a fresh subagent (Agent tool, not a fork) with only: the MP4 path, `docs/shotlist.md`, the style guide (or the style skill's name), this score list and the hunt list below. It pulls its own frames: the phone sheet, a contact sheet, and a 12-frame strip at full frame rate across every cut and every move the shotlist names, which is where easing, overshoot and sliding show. It returns each score with a one-line reason and the 3 worst problems with timestamps. Don't give it your scores, the review log or what you just fixed. Log its numbers as they come; overrule a finding only with a frame that shows it's wrong. It can't hear: score sound sync from `audiocheck.py` and the loudness read, and the voice from the transcript diff in `references/voiceover.md`.
4. Hunt list: text overlapping during swaps, anything sliding instead of springing, corner labels, centered-on-gradient shots, blurry scaled text, dead beats, loop-seam stutter, 3D that adds nothing a 2D shot wouldn't, flat-lit or plastic-looking 3D, depth of field focused off the subject, bloom on UI or type, objects floating with no contact shadow, glass with nothing behind it to bend, plates with edges that don't sit in the comp, plates strobing next to blurred layers, banding in plates, type or UI inside the 9:16 overlay zones, SFX on every beat, music energy fighting the picture, captions covering UI, type, a logo or a face, captions repeating on-screen type, cuts mid-word, music masking the voice.
5. Fix the 3 worst problems (with timestamps). Re-render only affected frames with `--frames=<from>-<to>`. Log scores and fixes in `docs/review_log.md`.
6. Minimum 3 rounds. Repeat until every score is 8+, then the full render.
7. Then show the user. Their notes are a new round: log them with timestamps in `docs/review_log.md`, fix, re-render only the affected frames, and rerun the step 2 checks the change touches (an audio change: mix, `audiocheck.py`, loudness; a copy change: the sound-off test). A regenerated asset is confirmed like a new one.

## Look
- Banned defaults: centered title on gradient, everything fading in, corner labels and frame borders, glow on UI chrome, generic particle bursts, bouncy easing, dead time, 3D for its own sake.
- One display face, one UI face. One accent color unless the brief says otherwise.
- Every 2 to 4 seconds something new must happen on screen.

## Deliverables
No comps ship: before the final render, every entry in `docs/stock_manifest.json` still in the cut is `licensed` and its `file` is the licensed one; then check the final contact sheet for watermarks. Per format: `npx remotion render <Comp> out/final-<format>.mp4 --codec=h264 --crf=16 --color-space=bt709`, verified with `ffprobe -v error -show_entries stream=width,height,r_frame_rate,duration,pix_fmt,color_space,color_range -of default=nw=1`: `yuv420p`, `bt709`, `tv`. Without the flag Remotion 4 writes full-range BT.601 (`yuvj420p`, `bt470bg`), which many players and platforms show with shifted color and contrast. A ProRes master (`--codec=prores --prores-profile=hq` to `out/master-<format>.mov`) only when the film goes on to an editor. Plus `out/poster.png`, `out/contact.png`, `out/loop_check.mp4` for loops, `out/captions.srt` with a voiceover, clean source.
