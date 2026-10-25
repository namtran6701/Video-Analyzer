## Narrator voice
- Podcast and news-episode videos (news-explainer-video episodes) use `en-us-podcaster-4` (Podcaster 4) with model `gemini-3.8-flash-tts`, same key as below.
- Every other video: pick the Gemini voice that best fits the content (search the voice library with `list_gemini_voices`) and say which one and why.

## My Voice (Gemini voice replication)
- Never use my voice unless I explicitly ask for it in that request. When I do, use voice ID `voice_63z55ycwf22s` with model `gemini-3.8-flash-tts` (`speech_config.voice_config.voice`).
- The voice is scoped to the AI Studio project behind `GEMINI_API_KEY` in `/Users/trannn23/Documents/Video-Analyzer/.env`. Use that key, never print it.
