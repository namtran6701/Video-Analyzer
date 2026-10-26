## Repo layout
- Every new video is its own Remotion project in `projects/YYYY-MM-DD_<type>_<slug>/` (type: `news`, `promo`, `feature`, `howto`, `study`). Set `package.json` `name` to the slug.
- `projects/*` are npm workspaces sharing the root `node_modules`. After `npx create-video`, delete the project's `node_modules` and `package-lock.json`, pin `remotion`/`@remotion/*` to the version the other projects use, and run `npm install` from the repo root.
- Drafts and scratch renders stay in the project's `out/`. Copy each final render to `deliverables/YYYY-MM-DD_<slug>[_<ratio>].mp4`.
- Reference videos for video-study go in `references/<name>/`, not `./refs/`.
- `skills/` is the source of truth for the video skills; each is symlinked into `~/.claude/skills`. Edit them here, never in `~/.claude/skills`.

## Narrator voice
- Podcast and news-episode videos (news-explainer-video episodes) use `en-us-podcaster-4` (Podcaster 4) with model `gemini-3.8-flash-tts`, same key as below.
- Every other video: pick the Gemini voice that best fits the content (search the voice library with `list_gemini_voices`) and say which one and why.

## My Voice (Gemini voice replication)
- Never use my voice unless I explicitly ask for it in that request. When I do, use voice ID `voice_63z55ycwf22s` with model `gemini-3.8-flash-tts` (`speech_config.voice_config.voice`).
- The voice is scoped to the AI Studio project behind `GEMINI_API_KEY` in `/Users/trannn23/Documents/Video-Analyzer/.env`. Use that key, never print it.
