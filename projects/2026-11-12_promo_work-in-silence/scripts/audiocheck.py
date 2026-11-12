"""Check that the sound in a render is the sound the cue sheet asks for. The chain is
cues -> SFX stem -> mix -> render, and each link goes stale when the one before it is edited.

    uv run --with numpy --with soundfile python3 audiocheck.py out/final.mp4 \
        --mix public/mix.wav --sfx out/sfx.wav --cues docs/sfx.json --fps 30

Prints JSON and exits 1 on a failure:
  stale             a file older than the one it's built from (by modified time)
  render_offset_ms  the render's audio against mix.wav; match is their correlation once aligned
  missing           cues with no sound at their time in the stem (cut off by --dur, or never rendered)
"""
import argparse
import json
import os
import subprocess
import sys

import numpy as np
import soundfile as sf

SR = 8000


def load(path):
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-vn", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
        check=True, capture_output=True,
    ).stdout
    return np.frombuffer(raw, dtype=np.float32)


def offset(a, ref, max_lag=0.5):
    """Lag of `a` behind `ref` in ms, and their correlation at that lag."""
    n = min(len(a), len(ref))
    a, ref = a[:n], ref[:n]
    xc = np.fft.irfft(np.fft.rfft(a, 2 * n) * np.conj(np.fft.rfft(ref, 2 * n)))
    m = int(max_lag * SR)
    lag = int(np.concatenate([xc[-m:], xc[: m + 1]]).argmax()) - m
    x, y = (a[lag:], ref[: n - lag]) if lag >= 0 else (a[:lag], ref[-lag:])
    return lag / SR * 1000, float(np.corrcoef(x, y)[0, 1])


def missing_cues(stem_path, cues):
    y, sr = sf.read(stem_path, always_2d=True)
    y = np.abs(y).max(axis=1)

    def peak_db(t0, t1):
        seg = y[max(0, int(t0 * sr)) : max(0, int(t1 * sr))]
        return 20 * np.log10(seg.max() + 1e-9) if len(seg) else -180.0

    # A riser ends at t; everything else starts there.
    return [
        {"t": c["t"], "type": c["type"]}
        for c in cues
        if (peak_db(c["t"] - 0.2, c["t"]) if c["type"] == "riser" else peak_db(c["t"], c["t"] + 0.12)) < -60
    ]


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("render")
    p.add_argument("--mix", required=True)
    p.add_argument("--sfx", required=True)
    p.add_argument("--cues", required=True)
    p.add_argument("--fps", type=float, default=30)
    a = p.parse_args()

    chain = [a.cues, a.sfx, a.mix, a.render]
    stale = [f"{new} is older than {old}" for old, new in zip(chain, chain[1:]) if os.path.getmtime(new) < os.path.getmtime(old)]
    off, match = offset(load(a.render), load(a.mix))
    missing = missing_cues(a.sfx, json.load(open(a.cues)))

    fails = []
    if stale:
        fails.append("rebuild from the first stale file on: sfx.mjs, then mix.mjs, then the render")
    if abs(off) > 500 / a.fps or match < 0.9:
        fails.append("the render's audio is not mix.wav in sync: re-render with the current mix")
    if missing:
        fails.append("cues with no sound in the stem: check --dur and the cue types, run sfx.mjs again, then mix.mjs")
    print(json.dumps({"stale": stale, "render_offset_ms": round(off, 1), "match": round(match, 3), "missing": missing, "fails": fails}, indent=1))
    sys.exit(1 if fails else 0)
