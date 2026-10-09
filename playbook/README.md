# Product Launch Video Playbook

Reverse-engineered from `Video/product_demo.mp4` (87.5s, 1920x1080, 29.97fps, H.264 + AAC stereo).
Style: kinetic-typography launch film. Problem, reveal, live demo, proof, capabilities, trust, CTA.

We copy the **grammar** (pacing, palette logic, motion, sound sync), never the reference's copy, logos, product UI or brand.

## Files

| File | What it's for |
|---|---|
| `01_reference_breakdown.md` | Second-by-second map of the reference, act by act |
| `02_style_guide.md` | Palette, type, motion, texture, audio, with measured numbers |
| `03_motion_library.md` | Every reusable move, how to build it, which tool |
| `04_story_template.md` | The 7-act structure as a fill-in template, scalable to 30/60/90s |
| `05_toolchain.md` | Remotion vs HyperFrames vs Blender: which does what |
| `06_claude_code_workflow.md` | Step-by-step run with Claude Code, prompts included |
| `templates/brief.md` | Fill this in first |
| `templates/shotlist.md` | Shotlist skeleton Claude fills from the brief |

## Quick start

1. Copy `templates/brief.md` into your new project, fill it in.
2. In Claude Code: `/video-study` on the reference (or skip, this playbook is the output), then point Claude at this folder and the brief.
3. Follow `06_claude_code_workflow.md`. Gate on the shotlist before any build code.

## Re-analysis commands (if you swap the reference)

```bash
ffprobe -v error -show_entries stream=width,height,r_frame_rate,duration,codec_name -of default=nw=1 <video>
ffmpeg -i <video> -vf fps=2 refs/frames/f_%03d.png
ffmpeg -i <video> -vf "select='gt(scene,0.12)',showinfo" -f null - 2>&1 | grep -o 'pts_time:[0-9.]*'
for i in 0 1 2 3; do ffmpeg -y -ss $((i*22)) -t 22 -i <video> -vf "fps=2,scale=320:-1,tile=6x8" -frames:v 1 refs/contact_$i.png; done
```

Use threshold `0.12`, not `0.3`. This style has almost no hard cuts (only 5 at 0.3), so a high threshold hides the structure.
