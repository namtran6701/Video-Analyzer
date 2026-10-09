# Claude Code Workflow

Each step has a gate. Don't let Claude write build code before step 3 is approved.

| Step | Do | Verify |
|---|---|---|
| 0 | Fill `templates/brief.md` | All fields filled, assets in `assets/` |
| 1 | Adapt style guide to brand | Palette/font swapped, rules unchanged |
| 2 | Generate shotlist | Durations sum to target, every shot cites a motion ID |
| 3 | **Gate**: review shotlist | You say OK |
| 4 | Scaffold Remotion + tokens + beat grid | `npx remotion studio` opens |
| 5 | Build motion components M1..M18 needed | Each previews in isolation |
| 6 | Build acts one at a time | Scrub each act in Studio, compare to reference frames |
| 7 | Blender renders (reveal, props) | PNG seq plays in Remotion |
| 8 | Audio + sync | Word lands on beats |
| 9 | Render + ffprobe | Duration, 1920x1080, 30fps exact |

## Prompts

### Step 1: style guide
```
Read playbook/02_style_guide.md and brief.md. Write docs/style_guide.md for our brand:
keep every structural rule and number, swap palette and font to the brand values in the brief.
Keep the two-neutrals-plus-one-accent rule.
```

### Step 2: shotlist
```
Using playbook/04_story_template.md, playbook/03_motion_library.md and brief.md,
write docs/shotlist.md from playbook/templates/shotlist.md.
Total runtime must be exactly <N>s. Times in beats at <BPM> BPM and in seconds.
Each shot references motion IDs (M1..M18). Use only assets in assets/.
Do not reuse any copy, logo or UI from the reference video. Stop after writing it.
```

### Step 4: scaffold
```
Scaffold a Remotion project in remotion/ per playbook/05_toolchain.md.
Create tokens.ts with palette, fonts and the beat grid. One Main composition,
1920x1080, 30fps, duration from the shotlist. Check the Remotion API with context7 first.
```

### Step 5: motion components
```
Build these motion components from playbook/03_motion_library.md: <IDs>.
One file each in src/motion/. Add a Playground composition that shows each one.
```

### Step 6: acts
```
Build Act <N> from docs/shotlist.md using the motion components.
Then render a still at <t> seconds and compare it to refs/frames/f_<xxx>.png
for layout, scale and color. List differences, fix them.
```
Useful still command: `npx remotion still src/index.ts Main out/check.png --frame=<f>`.

### Step 7: Blender
```
Using the blender MCP: build the light-shaft reveal from M8. Vertical emissive planes,
volumetric fog, colors from the reveal gradient. 1920x1080, 30fps, <n> frames.
Render PNG sequence to blender/renders/reveal/. Use `look` to check before rendering.
```

### Step 8: audio
```
Use the motion-studio skill to synthesize a <BPM> BPM electronic score matching
the energy curve in playbook/02_style_guide.md (quiet intro, build, full from the reveal),
plus UI tick / whoosh / riser SFX on the cue points in the shotlist.
```
Or drop a licensed track into `assets/music.mp3` and ask Claude to detect its BPM and retime `tokens.ts`.

### Step 9: render
```
Render out/final.mp4 (h264, crf 18). Verify with ffprobe: duration <N>s, 1920x1080, 30fps.
Extract a 2fps contact sheet of the render and compare rhythm to refs/contact_*.png.
```

## Token cost notes

- Reading frames is the expensive part. Read contact sheets first, then single frames only where needed.
- Build and review one act per turn. Don't ask Claude to build the whole film in one go.
