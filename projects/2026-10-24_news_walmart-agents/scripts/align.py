import difflib, json, re, sys

STING_AFTER_ROW, STING_S = 2, 2.05
rows = [1, 2] + list(range(4, 30))
lines = open("docs/script.txt").read().split("\n")
lines = [l for l in lines if l.strip()]
assert len(lines) == len(rows)

script = [(r, w) for r, l in zip(rows, lines) for w in l.split()]
asr = json.load(open(sys.argv[1]))["segments"][0]["words"]
norm = lambda w: re.sub(r"[^a-z0-9']", "", w.lower().replace("-", ""))
sec = lambda s: float(s.rstrip("s"))

a = [norm(w) for _, w in script]
b = [norm(w["word"]) for w in asr]
times = [None] * len(script)
sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == "equal" or (i2 - i1) == (j2 - j1):
        for k in range(i2 - i1):
            times[i1 + k] = (sec(asr[j1 + k]["start_offset"]), sec(asr[j1 + k]["end_offset"]))
    elif j2 > j1:
        # spread the ASR span evenly over the script words it replaced
        s, e = sec(asr[j1]["start_offset"]), sec(asr[j2 - 1]["end_offset"])
        n = i2 - i1
        for k in range(n):
            times[i1 + k] = (s + (e - s) * k / n, s + (e - s) * (k + 1) / n)

for i, t in enumerate(times):  # words ASR dropped: borrow neighbours
    if t is None:
        prev = times[i - 1][1] if i else 0.0
        times[i] = (prev, prev)

last = 0.0
out = []
for i, ((row, word), (s, e)) in enumerate(zip(script, times)):
    s = max(s, last); e = max(e, s + 0.05); last = s + 0.01
    if row > STING_AFTER_ROW:
        s += STING_S; e += STING_S
    is_last = i + 1 == len(script) or script[i + 1][0] != row
    out.append({"i": i, "row": row, "word": word, "start": round(s, 3), "end": round(e, 3), "stress": is_last})
json.dump(out, open("docs/vo_words.json", "w"), indent=0)
print(len(out), "words; end", out[-1]["end"])
cut = next(w for w in out if w["row"] == 4)["start"] - STING_S
print("sting gap at", cut)
