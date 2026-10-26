"""Build the SFX cues on the VO-keyed actions (src/vo_words.json); risers and impacts on energy steps are kept."""
import json

BPM = 116
b2s = lambda b: b * 60 / BPM
words = json.load(open("src/vo_words.json"))


def w(text, after_beat):
    """Film seconds of each word of `text`, searched forward from a beat."""
    out, t0 = [], b2s(after_beat) - 1
    for n in text.split():
        t0 = next(x["t"] for x in words if x["t"] > t0 and x["w"] == n)
        out.append(t0)
    return out


def cue(t, kind, gain=0.5, **kw):
    return {"t": round(t, 3), "type": kind, "gain": gain, **kw}


beat = 60 / BPM
keep = [c for c in json.load(open("docs/sfx.json")) if c["type"] in ("riser", "impact")]
new = [cue(b2s(3), "swish", 0.6)]
# Problem: rows scan in, camera glides prop to prop, then pulls back.
estimates, store, ai, people = w("estimates store ai people", 8)
for t0 in (estimates, store, ai):
    new += [cue(t0 - 0.6 * beat + k * 0.45 * beat, "tick", 0.3) for k in range(5)]
new += [cue(store - 0.9 * beat, "swish"), cue(ai - 0.9 * beat, "swish"), cue(people + 0.8 * beat, "whoosh", 0.4)]
built, own = w("built own", 24)
new += [cue(built - beat, "swish"), cue(own + beat, "thump", 0.7)]
for i, t in enumerate(w("apps live automations", 32)):
    new.append(cue(t - 0.15 * beat, "pop", pitch=2 + i))
new.append(cue(w("automations", 32)[0] + 0.8 * beat, "swish", 0.4))
# Demo chapters: grow from the dock, UI moments, flip to the payoff, fold back.
plan1, trained, hundreds, checks, drafts, point, reviews, every, number, call, over = w("plan trained projects then drafts point reviews every number call hundreds", 40)
new += [cue(b2s(40), "swish"), cue(plan1, "click"), cue(trained, "tick"), cue(hundreds, "chime"), cue(checks, "pop", pitch=4), cue(drafts, "tick"), cue(point + 0.3 * beat, "swish", 0.4)]
new += [cue(reviews, "tick"), cue(every, "tick"), cue(number, "tick"), cue(call, "click"), cue(call + 1.2 * beat, "click"), cue(over - 0.35 * beat, "whoosh"), cue(b2s(80 - 1.6), "swish")]
tagged, english, pitch, every2 = w("tagged english pitch every", 80)
new += [cue(b2s(80), "swish"), cue(tagged, "tick"), cue(tagged + 0.5 * beat, "tick"), cue(tagged + beat, "tick"), cue(english, "click"), cue(english + beat, "chime"), cue(pitch, "click"), cue(every2 - 0.35 * beat, "whoosh"), cue(b2s(116 - 1.6), "swish")]
industry, news, designs, lesson, assignment, land, checklist, learning = w("industry news designs lesson assignment land checklist learning", 116)
new += [cue(industry, "tick"), cue(news, "tick"), cue(designs, "tick"), cue(assignment + 0.8 * beat, "click")]
new += [cue(b2s(116), "swish"), cue(lesson, "click"), cue(land, "chime"), cue(checklist, "click"), cue(learning + 0.65 * beat, "whoosh"), cue(b2s(144 - 1.6), "swish")]
# Proof: each workflow row slides in, and every step pops as it is named.
seo, content, survey, named, centralized, leads, enriched, located, weekly = w("seo content survey named centralized leads enriched located weekly", 142)
new += [cue(x - 0.6 * beat, "swish", 0.35) for x in (seo, survey, leads)]
new += [cue(x, "pop", 0.4, pitch=p) for x, p in ((content, 4), (named, 2), (centralized, 4), (enriched, 2), (located, 4), (weekly, 6))]
new += [cue(weekly + 0.1, "chime", 0.4)]
caps = w("dashboards pipelines catalog capabilities", 156)
new += [cue(t, "tick") for t in caps] + [cue(caps[-1] - 0.3 * beat, "swish", 0.4)]
# Trust: the estimate card is drafted, totalled, then approved with a click and a stamp.
ai, drafts, math, decide = w("ai drafts math decide", 176)
new += [cue(ai - 0.4 * beat, "swish", 0.4)] + [cue(drafts - 0.2 * beat + k * 0.22, "tick", 0.3) for k in range(3)]
new += [cue(math, "pop", pitch=4), cue(decide, "click"), cue(decide + 0.08, "thump", 0.7)]
team = w("months team", 188)[1]
new += [cue(team + 0.8 * beat, "swish"), cue(team + 1.2 * beat, "chime", 0.4)]
quarter = w("quarter", 196)[0]
new += [cue(quarter + 0.8 * beat, "swish"), cue(quarter + 1.8 * beat, "chime")]
json.dump(sorted(keep + new, key=lambda c: c["t"]), open("docs/sfx.json", "w"), indent=1)
print(len(keep), "kept,", len(new), "new")
