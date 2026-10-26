"""Write docs/sfx_cues.json: one cue per overlay entrance in src/Episode.tsx, keyed to the same words."""
import json

words = json.load(open("docs/vo_words.json"))


def at(row, word, nth=0):
    hits = [w for w in words if w["row"] == row and w["word"].lower().startswith(word.lower())]
    return round(hits[nth]["start"] * 30) / 30


# (row, word, nth, voice, gain): stamps pop, boxes tick, slams thump, glitches glitch, memes swish
CUES = [
    (2, "spending", 0, "pop", 0.8),
    (4, "October", 0, "tick", 0.8), (4, "Walmart", 0, "pop", 0.8), (4, "Agent", 0, "thump", 0.9),
    (5, "Sam's", 0, "pop", 0.8),
    (6, "ChatGPT", 0, "pop", 0.8), (6, "Gemini", 0, "pop", 0.8), (6, "Meta's", 0, "pop", 0.8),
    (7, "month", 0, "tick", 0.8),
    (10, "button", 0, "swish", 0.9), (11, "skips", 0, "tick", 0.9),
    (12, "MCP", 0, "pop", 0.8), (12, "and", 0, "click", 0.6), (12, "get", 0, "click", 0.6),
    (12, "price", 0, "click", 0.6), (12, "Walmart", 0, "thump", 0.8),
    (14, "spend", 0, "tick", 0.8), (14, "limit", 0, "pop", 0.6),
    (15, "Two", 0, "click", 0.6), (15, "sure", 0, "chime", 0.5), (15, "not", 0, "tick", 0.9),
    (17, "blocked", 0, "pop", 0.8), (17, "Meta's", 0, "pop", 0.8),
    (18, "sees", 0, "tick", 0.9),
    (19, "sponsored", 0, "tick", 0.8), (19, "add-to-cart", 0, "tick", 0.8), (19, "Prime", 0, "tick", 0.8),
    (19, "upsell", 0, "swish", 0.9),
    (21, "Walmart", 0, "pop", 0.7), (21, "lose", 0, "tick", 0.8), (21, "order", 0, "thump", 0.8),
    (22, "The", 0, "glitch", 0.9), (22, "invite-only", 0, "pop", 0.8), (22, "picks", 0, "pop", 0.8),
    (25, "three", 0, "pop", 0.7), (25, "agents", 0, "pop", 0.7), (25, "to", 0, "pop", 0.7), (25, "same", 0, "pop", 0.7),
    (26, "where", 0, "click", 0.6), (26, "what", 0, "click", 0.6), (26, "whether", 0, "click", 0.6), (26, "usual", 0, "pop", 0.7),
    (27, "lost", 0, "tick", 0.9), (27, "spreadsheet", 0, "swish", 0.9),
]

cues = [{"t": at(r, w, n), "type": v, "gain": g} for r, w, n, v, g in CUES]
cues.append({"t": 6.0, "type": "whoosh", "gain": 0.8})  # into the sting
cues.append({"t": 6.6, "type": "chime", "gain": 0.4})  # mark completes
json.dump(sorted(cues, key=lambda c: c["t"]), open("docs/sfx_cues.json", "w"), indent=0)
print(len(cues), "cues")
