# Toolchain

Pick per act, compose in one place. Default: **Remotion is the spine**, everything else feeds it as video/PNG sequences.

## Who does what

| Need | Tool | Why |
|---|---|---|
| Kinetic type, UI mocks, charts, cursor, timeline | **Remotion** | Frame-exact React, `spring`/`interpolate`, `<Sequence>` maps 1:1 to the shotlist, renders H.264 directly |
| Fast HTML/CSS/GSAP scenes, quick iteration by Claude | **HyperFrames** | Plain HTML compositions, easy for Claude to write and preview. Good for text-only acts (1, 2, 7, 10) |
| 3D props, volumetric light, logo reveal | **Blender** (via `mcp__blender__*`) | Light shafts, laptop, glass icons. Render to PNG sequence, import into Remotion as `<Img>` sequence or `<OffthreadVideo>` |
| Deterministic HTML → H.264 with synthesized score + SFX | **`motion-studio` skill** | Already installed. Use when you want music/SFX generated and locked to the beat grid |
| Probing, cutting, muxing, verification | **ffmpeg / ffprobe** | Final checks |

Check current APIs with the context7 MCP before writing code (Remotion and HyperFrames both move fast).

## Recommended split for this style

| Act | Build in |
|---|---|
| 1 Hook, 2 Problem | Remotion (morphs, motion-blur stacks, trash physics need frame control) |
| 3 Reveal | Blender light shafts (PNG seq) + Remotion wordmark on top |
| 4 Positioning, 7 Capabilities, 10 CTA | Remotion or HyperFrames (pure type) |
| 5 Demo | Remotion with React-built UI (not screen recordings: crisper and editable) |
| 6 Proof | Remotion |
| 8 Trust | Remotion + Blender laptop render |
| Audio | `motion-studio` synthesized score, or licensed track at 114 to 118 BPM |

## Project layout

```
<project>/
  brief.md
  docs/style_guide.md        # copy of playbook/02, adjusted to brand
  docs/shotlist.md           # from templates/shotlist.md
  assets/                    # logos, product screenshots, icons, fonts, music
  blender/                   # .blend files + renders/ (PNG seqs)
  remotion/
    src/
      tokens.ts              # palette, type, beat = 30*60/BPM frames
      motion/                # M1..M18 components from 03_motion_library
      acts/                  # Act01Hook.tsx ... Act10CTA.tsx
      Root.tsx               # one <Composition>, <Sequence> per act
  out/                       # final renders
```

## Beat grid

Everything keys off `beat` in frames:

```ts
export const FPS = 30;
export const BPM = 116;
export const BEAT = (FPS * 60) / BPM; // ≈15.5 frames
export const at = (beats: number) => Math.round(beats * BEAT);
```

Shotlist times get written in beats, converted to frames with `at()`. Swap BPM and the whole film re-times.

## Render + verify

```bash
npx remotion render src/index.ts Main out/final.mp4 --codec h264 --crf 18
ffprobe -v error -show_entries stream=width,height,r_frame_rate,duration -of default=nw=1 out/final.mp4
```

The reference is 29.97fps. Use 30 unless delivering to broadcast.
