---
name: genmedia-assets
description: Generates images, voiceovers, music, transcripts and audio mixes through the local Google Genmedia MCP servers (genmedia-nanobanana, genmedia-gemini, genmedia-lyria, genmedia-avtool) without wasted calls, duplicate outputs or cloud uploads. Use when creating assets for a Remotion video or website, or when the user asks to generate an image, voiceover, narration, music bed, captions, or to mix audio.
---

# Genmedia Assets

Four local MCP servers backed by Vertex AI (project `sf-internal-495418`). Every call is billed. Outputs are **local only**: no bucket is configured.

## Hard rules

1. **Relative paths only.** Output dirs must be relative to the folder Claude Code was launched in. Absolute paths fail with `must be relative to the output root`. In Remotion, write to `public/images/`, `public/audio/`.
2. **Always pass an output location.** Without one, TTS and Lyria return raw base64 audio into context. TTS/image: `output_directory`. Lyria: `local_path`. avtool: `output_local_dir`.
3. **Never pass `gcs_bucket_uri` / `output_gcs_bucket`** unless the user asks for a cloud copy.
4. **Use the path the tool returns, not the one you requested.** Extensions are forced to the real media type (asking for `hero.png` can produce `hero.jpg`). Multiple outputs get `_1`, `_2` suffixes.
5. **Same filename overwrites silently.** Use distinct names per variant (`hero-v2`).
6. **One request, one asset.** Don't fan out parallel variants or retry a successful call. Before generating anything (images, voiceover, music), tell the user what and how many, and wait for the OK. Regenerations count too.
7. Video generation (`omni_video_generation`) is denied by settings. Don't attempt it.

## Images: `nanobanana_image_generation`

**Check Adobe Stock first** when the Adobe MCP is connected and the image is a generic photo (objects, places, people, textures): `asset_search`, and use a result only if it fits and licenses free. Generate here when Stock has nothing good or free (don't stop to ask about paid Stock unless it's clearly better), or the image must be specific (the product, a brand scene, an edit of a reference).

**Always use the newest top model**, drafts included: `gemini-nano-banana-2.1` (Oct 2026; leads `gemini-3-pro-image` on Google's preference benchmarks). Use `gemini-3-pro-image` only when the user asks for it or a 2.1 result falls short on a hard edit. Never use the lite or older flash tiers. Model lineups change fast: check the current docs before trusting this list.

**Duplicate risk:** thinking image models return **2 images for one request**, doubling cost (`gemini-nano-banana-2.1` did it on 4 of 4 calls on 2026-10-24, even with the line below). Include the count of 2 when you tell the user the cost. To limit it:
- End every prompt with: `Generate exactly one image. Do not produce variations.`
- After the call, count the returned paths. If there are more than 1, keep `_1`, tell the user, and don't regenerate.

- Always set `aspect_ratio` (`16:9` video, `9:16` vertical, `1:1` social). Default is `1:1`.
- Leave `image_size` unset (1K) unless the user needs 2K/4K.
- To edit or keep a product consistent, pass reference files in `images` (relative paths, up to 14).
- Use `genmedia-nanobanana`, not `gemini_image_generation` on the gemini server. They do the same job, and a single tool avoids confusion.

## Voice: `gemini_audio_tts`

- Always `gemini-3.8-flash-tts` (the best TTS model), never the lite tier. Two-speaker dialogue uses `speakers` + `turns`.
- `text` is read **verbatim**: no stage directions, speaker labels or headings inside it.
- `prompt` is a **short** style only: `warm, confident narrator`.
- Inline vocal events use angle brackets: `<short pause>`, `<laugh>`, `<sigh>`.
- 3.8 outputs WAV (`LINEAR16`) only. Convert with avtool if MP3 is required.
- Browse voices with `list_gemini_voices` (default voice: `Callirrhoe`). With no arguments it lists the 30 prebuilt voices; pass `language_code` (`en-US`) and `search` (`warm`, `narrator`) to search the Extended Voice Library, whose IDs (`achird`, `en-us-concierge-12`) work with 3.8 models only. Offer the user 2 or 3 picks with one line each. Keep one voice per project.

## Music: `lyria-3.5`

- Always use `lyria-3.5` (Google's flagship since Sept 2026, 44.1 kHz stereo). It's on the Gemini API only, not on the Vertex-backed `lyria_generate_music` tool, so run `python3 -I ~/.claude/skills/genmedia-assets/scripts/lyria.py "<prompt>" public/music_raw_a.wav` (WAV out; key from `GEMINI_API_KEY` or the project's `.env`, never printed). Only if no Gemini key exists, fall back to the MCP tool with `model_id: lyria-3-pro-preview`. Never use `lyria-3-clip-preview` or `lyria-002`.
- For background beds, say `instrumental, no vocals` in `prompt` (Lyria 3.x doesn't support `negative_prompt`).
- Prompt with genre, instruments, mood and tempo: `upbeat acoustic, soft guitar, light percussion, 100 BPM, optimistic`.
- `lyria.py` writes WAV. The MCP fallback always writes MP3 whatever extension you ask for; use the returned path and convert with ffmpeg.
- There is no tempo or length parameter: BPM and duration in the prompt are hints, and takes can miss both (tested: 122.5 BPM and 58 s for a 116 BPM, 34 s ask). Measure before using.
- `content_blocked` ("Request blocked for an unspecified policy reason") can hit a harmless prompt that succeeded seconds earlier. Reword once with plainer genre words and no brand or product context; don't retry the identical prompt.

## Captions: `gemini_transcribe`

- Run on the final voiceover with `enable_word_timestamps: true` and `language_codes: ["en-US"]` to get per-word timings that drive Remotion captions.
- Timings only, never caption text: it normalizes words (`four dollars ten` → `$4 ten`, `single-origin` → `single origin`), times in 100 ms steps, and can return a word whose end is before its start. Align the known script to it and force timestamps to increase.
- `smart_formatting` can't be combined with timestamps or diarization.
- Pass brand names in `custom_vocabulary`.

## Audio mixing: avtool (free, local ffmpeg)

For motion-studio films, skip this section: its sidechain-ducked ffmpeg mix replaces it. This is for quick one-off mixes outside motion-studio.

`ffmpeg_layer_audio_files` mixes at **full volume**, so music drowns the voice. Duck the music first:
1. `ffmpeg_adjust_volume` the music by `-12` dB (tested: voice stays clear).
2. `ffmpeg_layer_audio_files` with `[voice, quiet-music]`. The mix lasts as long as the longest input.

In Remotion, it's usually better to keep voice and music as separate `<Audio>` tracks and set `volume` there. Only pre-mix when a single file is required.

## Remotion workflow

In a motion-studio film, its Sound and Voiceover sections set the order and file names: Lyria takes to `public/music_raw_a` / `_b` (WAV from `lyria.py`; resample to 48 kHz before beat measuring and the conform), voiceover to `public/vo.wav` only if the user said yes to one, word timings to `docs/vo_words.json`, images to `public/images/`. Reference everything with `staticFile()`, using the paths the tools returned.
