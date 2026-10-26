"""Cut the VO take into phrases, land each phrase's first word on a beat, write vo.wav + caption pages + SRT."""
import json
import re
import subprocess

BPM, DUR = 116, 107.58
beat = lambda b: b * 60 / BPM

TAKES = ["public/audio/vo_take_v4.wav", "public/audio/vo_line_priced.wav", "public/audio/vo_lines_v5.wav", "public/audio/vo_lines_v6.wav"]
RAW = ["docs/vo_words_raw_v4.json", "docs/vo_words_raw_priced.json", "docs/vo_words_raw_v5lines.json", "docs/vo_words_raw_v6lines.json"]
GAIN = [0, -3.7, 0, 0]  # dB, matches the pickup takes to the main take
raw = [json.load(open(f))["segments"][0]["words"] for f in RAW]

# (take, first token, tokens, landing beat, caption pages as (script text, token count) or None when the type says it, tempo)
PHRASES = [
    (2, 0, 13, 0.5, None, 1),
    (0, 11, 4, 9, None, 1),
    (0, 15, 5, 14, None, 1),
    (0, 20, 7, 19, None, 1),
    (2, 13, 12, 25, [("So we built our own tools, to make every team more efficient.", 12)], 1),
    (2, 25, 6, 33, None, 1),
    (0, 44, 12, 41, [("SF Pricing turns a client brief into a Good, Better, Best plan.", 12)], 1),
    (3, 0, 15, 49, [("It's trained on our own projects, pricing patterns, and costs,", 10), ("then drafts a starting point.", 5)], 1),
    (0, 76, 12, 60, [("Our team reviews every number,", 5), ("and a person makes the final call.", 7)], 1),
    (1, 0, 10, 67.5, [("Hundreds of thousands of dollars of projects, priced so far.", 10)], 1),
    (0, 95, 8, 80.5, [("Store Walk turns field photos into retail evidence.", 8)], 1),
    (0, 103, 13, 88, [("Every shelf shot gets tagged,", 5), ("so anyone can search it in plain English.", 8)], 1),
    (0, 116, 16, 97, [("It drafts a pitch from what we actually saw,", 9), ("and our team takes it from there.", 7)], 1),
    (0, 132, 7, 107.5, None, 1),
    (0, 139, 8, 116.5, [("And AI Training keeps the whole team current.", 8)], 1),
    (3, 15, 16, 122, [("Our AI team tracks the industry and the news,", 9), ("then carefully designs every lesson and assignment.", 7)], 1.08),
    (0, 163, 6, 132.5, [("Lessons land in everyone's quarterly checklist.", 6)], 1),
    (0, 169, 6, 138, None, 1),
    (3, 45, 6, 143.75, [("Our automations run whole workflows, end to end:", 6)], 1.1),
    (3, 51, 15, 149.25, [("SEO content, survey media named and centralized,", 7), ("and new leads, enriched, located, and sent weekly.", 8)], 1.1),
    (0, 188, 7, 161.25, [("Same playbook everywhere:", 3), ("dashboards, pipelines, catalog audits.", 4)], 1.06),
    (3, 31, 14, 168.5, [("And we extend these capabilities to our client work,", 9), ("delivering a fantastic client experience.", 5)], 1.06),
    (0, 210, 12, 178.5, None, 1),
    (0, 222, 11, 188.5, None, 1),
    (2, 54, 11, 196.5, None, 1),
]
for k in (1, 3):
    assert sum(p[2] for p in PHRASES if p[0] == k) == len(raw[k]), k


def seg_of(k, i0, n):
    return [(float(w["start_offset"][:-1]), float(w["end_offset"][:-1])) for w in raw[k][i0 : i0 + n]]


filters, pages = [], []
for n, (k, i0, count, b, caps, tempo) in enumerate(PHRASES):
    seg = seg_of(k, i0, count)
    t0, t1 = seg[0][0] - 0.04, seg[-1][1] + 0.12
    film = lambda x: beat(b) + (x - seg[0][0]) / tempo
    if caps:
        j = 0
        for text, c in caps:
            pw = seg[j : j + c]
            pages.append({"text": text, "startMs": round(film(pw[0][0]) * 1000), "endMs": round((film(pw[-1][1]) + 0.15) * 1000)})
            j += c
        assert j == count, (n, j, count)
    filters.append(f"[{k}]atrim={t0:.3f}:{t1:.3f},asetpts=PTS-STARTPTS,atempo={tempo},volume={GAIN[k]}dB,adelay={round(film(t0) * 1000)}:all=1[p{n}]")
    print(f"phrase {n}: beat {b} at {beat(b):.2f}s, ends {film(t1):.2f}s")

for a, b in zip(pages, pages[1:]):
    a["endMs"] = min(a["endMs"], b["startMs"])
json.dump(pages, open("src/captions.json", "w"), indent=1)

# Film-time start of every spoken word, so scenes can key actions to the word that names them.
cues = []
for k, i0, count, b, _, tempo in PHRASES:
    seg = seg_of(k, i0, count)
    cues += [{"w": re.sub(r"[^a-z0-9]", "", w["word"].lower()), "t": round(beat(b) + (st - seg[0][0]) / tempo, 3)} for w, (st, _) in zip(raw[k][i0 : i0 + count], seg)]
json.dump(cues, open("src/vo_words.json", "w"))

mix = "".join(f"[p{n}]" for n in range(len(PHRASES)))
fc = ";".join(filters) + f";{mix}amix=inputs={len(PHRASES)}:normalize=0,apad=whole_dur={DUR}[out]"
subprocess.run(["ffmpeg", "-v", "error", "-y", *[a for f in TAKES for a in ("-i", f)], "-filter_complex", fc, "-map", "[out]", "-ar", "48000", "-ac", "1", "public/vo.wav"], check=True)


INTRO_MS = round(62 / 30 * 1000)  # the one-bar title card plays before the film, so the sidecar SRT starts after it


def srt_time(ms):
    ms += INTRO_MS
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


# SRT carries every spoken line, including the ones the burn-in skips.
all_lines = []
script = json.load(open("docs/vo_script_lines.json"))
for (k, i0, count, b, _, tempo), lines in zip(PHRASES, script):
    seg = seg_of(k, i0, count)
    film = lambda x: beat(b) + (x - seg[0][0]) / tempo
    j = 0
    for text, c in lines:
        pw = seg[j : j + c]
        all_lines.append((round(film(pw[0][0]) * 1000), round((film(pw[-1][1]) + 0.15) * 1000), text))
        j += c
    assert j == count, (text, j, count)
with open("out/captions.srt", "w") as f:
    for k, (a, b, text) in enumerate(all_lines):
        b = min(b, all_lines[k + 1][0]) if k + 1 < len(all_lines) else b
        f.write(f"{k + 1}\n{srt_time(a)} --> {srt_time(b)}\n{text}\n\n")
print(len(pages), "caption pages,", len(all_lines), "srt cues")
