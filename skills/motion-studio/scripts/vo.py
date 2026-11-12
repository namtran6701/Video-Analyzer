"""Place a voiceover take on the beat grid and build everything that hangs off it.

    python3 vo.py docs/vo.json

docs/vo.json:
    { "bpm": 116, "dur": 60, "chars": 64,
      "takes": [{ "audio": "public/vo_take.wav", "words": "docs/vo_raw.json", "gain": 0 }],
      "phrases": [{ "text": "So we built our own tools.", "beat": 25 },
                  { "text": "...", "beat": 33, "caption": "off", "tempo": 1.04, "take": 1 }] }

  takes     the TTS take(s) and their gemini_transcribe JSON (word timestamps). Pickup takes get their own entry.
  phrases   the locked script, cut where the take pauses, each with the beat its first word lands on.
            caption: "bottom" (default), "top", or "off" when the same words are on screen as type.
            tempo: speed-up to fit the slot, 1.05 at most. take: index into takes (default 0).
  chars     most characters on one caption page: 2 lines x 32 in 16:9 (default 64), x 24 for 9:16 (48).

Writes public/vo.wav (every phrase placed, padded to dur), src/vo_words.json (film time of every spoken
word, to key actions to the word that names them), src/captions.json (pages for <Captions>) and
out/captions.srt (every line, including caption "off"). Prints each word the transcript heard differently
from the script: check those for mispronunciations before going on.
"""
import difflib
import json
import os
import re
import subprocess
import sys

norm = lambda w: re.sub(r"[^a-z0-9']", "", w.lower())
sec = lambda s: float(str(s).rstrip("s"))


def align(script, asr):
    """Time for every script word from the transcript's words, plus the words it heard differently."""
    a, b = [norm(w) for w in script], [norm(w["word"]) for w in asr]
    times, heard = [None] * len(a), []
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if tag == "delete" or j2 == j1:
            continue
        span = [(sec(w["start_offset"]), sec(w["end_offset"])) for w in asr[j1:j2]]
        if tag == "insert":
            continue
        if i2 - i1 == j2 - j1:
            times[i1:i2] = span
        else:  # the transcript split or joined tokens: spread its span evenly over the script words
            s, e, n = span[0][0], span[-1][1], i2 - i1
            times[i1:i2] = [(s + (e - s) * k / n, s + (e - s) * (k + 1) / n) for k in range(n)]
        # Numbers and hyphenated words come back rewritten ($4.10 as "$4 ten"); those aren't mispronunciations.
        if tag == "replace" and "".join(a[i1:i2]) != "".join(b[j1:j2]) and not any(c.isdigit() for c in "".join(a[i1:i2])):
            heard.append((" ".join(script[i1:i2]), " ".join(w["word"] for w in asr[j1:j2]), span[0][0]))
    last = 0.0
    for i, t in enumerate(times):  # words the transcript dropped borrow the previous word's end; times only go up
        s, e = t or (last, last)
        s = max(s, last)
        times[i] = (s, max(e, s + 0.05))
        last = s + 0.01
    missing = [script[i] for i, t in enumerate(times) if t[1] - t[0] <= 0.05 and i and times[i - 1][1] >= t[0]]
    return times, heard, missing


def pages_of(words, limit):
    """Word-index ranges for caption pages: break at punctuation, never past `limit` characters."""
    clauses, start = [], 0
    for i, w in enumerate(words):
        if w[-1] in ".?!,;:" or i == len(words) - 1:
            clauses.append((start, i + 1))
            start = i + 1
    length = lambda a, b: len(" ".join(words[a:b]))
    out = []
    for a, b in clauses:
        if out and length(out[-1][0], b) <= limit:
            out[-1] = (out[-1][0], b)
        elif length(a, b) <= limit:
            out.append((a, b))
        else:  # one clause longer than a page: split it into even parts at word boundaries
            parts = -(-length(a, b) // limit)
            cuts = [a + round((b - a) * k / parts) for k in range(parts + 1)]
            out += [(cuts[k], cuts[k + 1]) for k in range(parts)]
    return out


def srt_time(ms):
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


if __name__ == "__main__":
    cfg = json.load(open(sys.argv[1]))
    beat = lambda b: b * 60 / cfg["bpm"]
    limit = cfg.get("chars", 64)
    phrases = cfg["phrases"]
    warnings = []

    # Align each take once against the script words of the phrases cut from it, in order.
    timed = {}
    for k, take in enumerate(cfg["takes"]):
        mine = [n for n, p in enumerate(phrases) if p.get("take", 0) == k]
        script = [w for n in mine for w in phrases[n]["text"].split()]
        asr = [w for seg in json.load(open(take["words"]))["segments"] for w in seg["words"]]
        times, heard, missing = align(script, asr)
        for said, got, at in heard:
            print(f'check take {k} at {at:.1f}s: script "{said}", heard "{got}"')
        if missing:
            warnings.append(f"take {k}: not found in the transcript: {' '.join(missing)}")
        i = 0
        for n in mine:
            count = len(phrases[n]["text"].split())
            timed[n] = times[i : i + count]
            i += count

    filters, vo_words, cues = [], [], []
    for n, p in enumerate(phrases):
        seg, tempo, words = timed[n], p.get("tempo", 1), p["text"].split()
        film = lambda x: beat(p["beat"]) + (x - seg[0][0]) / tempo
        t0, t1 = max(0, seg[0][0] - 0.04), seg[-1][1] + 0.12
        if tempo > 1.05:
            warnings.append(f'phrase {n} "{words[0]}...": tempo {tempo} is over 1.05, shorten the line instead')
        gain = cfg["takes"][p.get("take", 0)].get("gain", 0)
        filters.append(f"[{p.get('take', 0)}]atrim={t0:.3f}:{t1:.3f},asetpts=PTS-STARTPTS,atempo={tempo},volume={gain}dB,adelay={round(film(t0) * 1000)}:all=1[p{n}]")
        vo_words += [{"w": norm(w), "t": round(film(s), 3), "end": round(film(e), 3)} for w, (s, e) in zip(words, seg)]
        for a, b in pages_of(words, limit):
            cues.append({"text": " ".join(words[a:b]), "startMs": round(film(seg[a][0]) * 1000), "endMs": round((film(seg[b - 1][1]) + 0.15) * 1000), "band": p.get("caption", "bottom")})
        end = film(t1)
        nxt = beat(phrases[n + 1]["beat"]) if n + 1 < len(phrases) else cfg["dur"]
        if end > nxt:
            warnings.append(f'phrase {n} "{words[0]}..." ends at {end:.2f}s, {end - nxt:.2f}s past {"the next phrase" if n + 1 < len(phrases) else "the end of the film"}')
        print(f"phrase {n}: beat {p['beat']} at {beat(p['beat']):.2f}s, ends {end:.2f}s")

    for a, b in zip(cues, cues[1:]):
        a["endMs"] = min(a["endMs"], b["startMs"])

    for path in ("public/vo.wav", "src/vo_words.json", "src/captions.json", "out/captions.srt"):
        os.makedirs(os.path.dirname(path), exist_ok=True)
    mix = "".join(f"[p{n}]" for n in range(len(phrases)))
    graph = ";".join(filters) + f";{mix}amix=inputs={len(phrases)}:normalize=0,apad=whole_dur={cfg['dur']}[out]"
    inputs = [a for take in cfg["takes"] for a in ("-i", take["audio"])]
    subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", graph, "-map", "[out]", "-ar", "48000", "-ac", "1", "public/vo.wav"], check=True)
    json.dump(vo_words, open("src/vo_words.json", "w"))
    json.dump([c for c in cues if c["band"] != "off"], open("src/captions.json", "w"), indent=1)
    with open("out/captions.srt", "w") as f:
        for k, c in enumerate(cues):
            f.write(f"{k + 1}\n{srt_time(c['startMs'])} --> {srt_time(c['endMs'])}\n{c['text']}\n\n")

    print(f"{len(phrases)} phrases, {sum(c['band'] != 'off' for c in cues)} caption pages, {len(cues)} srt cues")
    for w in warnings:
        print("WARN:", w, file=sys.stderr)
    sys.exit(1 if warnings else 0)
