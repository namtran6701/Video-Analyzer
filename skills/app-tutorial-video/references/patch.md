# Patching an existing video

For "add a line", "reword this part", "explain X better". Keep everything the user already approved: same voice, same take, same music. Back up `src/<name>.src.json`, `src/<name>.json` and `out/<name>.mp4` to the scratchpad first.

## 1. Script

Read the real narration from the current transcript, not from the shotlist: the two drift apart. Write the change so it keeps every phrase the footage is cut to (the words that taps and screen changes are anchored on). Prefer adding a sentence to rewriting one. Show the user the exact before/after lines.

## 2. Voice: only the new lines

Confirm with the user first: one TTS call. Find the voice and prompt the old take used (ask, or check the brief), then generate all new lines in one call, separated by `<long pause>`, to `public/vo_take_vN_lines.wav`. Find the cut points:

- New lines: `ffmpeg -i lines.wav -af silencedetect=n=-40dB:d=0.3 -f null -`
- Old take: list word times from its transcript around each splice, then `silencedetect` on a window (`atrim=33:36,silencedetect=n=-40dB:d=0.15`) to cut inside real silence, never inside a breath.

Splice with one `atrim` + `concat` filter (old take up to the splice, the new line with a 0.1s fade-out, old take from after the replaced words, and so on) into `public/vo_take_vN.wav`. Same sample rate and channels as the old take.

## 3. Transcribe and re-anchor

Transcribe the spliced take (same `custom_vocabulary`) to `docs/vo_transcript_vN.json`. Point `transcript` and `take` at the new files. Then fix anchors:

- Words whose counts shifted (a new "for" makes `for#4` → `for#5`). Rename them with a small script that walks every `at` in the file; don't hand-edit 100 keys.
- Chapter starts and screen changes for the edited chapter move to its new first word (rule 1 in SKILL.md).
- Re-run the resolver. Compare old and new `dur`, chapter times and tap times to get the shift per section.

## 4. Music: extend by whole bars, no regeneration

The film got longer by roughly the inserted speech. Lengthen the conformed bed by repeating whole bars right at each insert point, so the beat never breaks and sections stay lined up with the picture. With bar length `B = 4 * 60 / bpm` and an insert at bar boundary `T`:

```
ffmpeg -i public/music.wav -filter_complex "[0]asplit=3[a][b][c];[a]atrim=0:T,asetpts=PTS-STARTPTS[p1];[b]atrim=T-B:T,asetpts=PTS-STARTPTS[p2];[c]atrim=T,asetpts=PTS-STARTPTS[p3];[p1][p2]acrossfade=d=0.03[x];[x][p3]acrossfade=d=0.03,apad=whole_dur=<new dur>" -ar 48000 public/music_vN.wav
```

Chain more splits for more inserts. Choose the number of bars so the total insert is within about 0.3s of the picture's added time.

## 5. SFX and mix

Re-time `docs/sfx.json`: a cue within 0.35s of an old tap moves with that tap; anything else moves by its section's shift. Re-render with `sfx.mjs` (same seed and key, new `--dur`), then remix with motion-studio's ducked voiceover command. Keep the old `mix.wav` as `mix_vPrev.wav`.

## 6. Check

Contact sheet of the edited chapters, LOOK for: the screen showing before its line, captions splitting a word or a phrase badly, dead stretches where nothing moves for 3s+ (add one slow push, never a new zoom pattern). Then the full render, duration and loudness check, and hand over the MP4 and the `.srt`.
