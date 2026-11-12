"""Beat grid for cuts and SFX, written as JSON to stdout.

Measure a supplied track (uv fetches librosa on first run):
    uv run --with librosa --with soundfile python3 beats.py track.wav > beats.json
Against a fixed grid (adds stretch = atempo ratio, max_drift_ms = worst beat off a steady tempo,
beatless_windows = 8-beat windows with no clear beat, skipped):
    uv run --with librosa --with soundfile python3 beats.py public/music.wav --grid 116
Synthesized score, no track (stdlib only):
    python3 beats.py --bpm 120 --dur 15 > beats.json

Output: {bpm, first_beat (track only: trim point), beats (state changes), downbeats (every 4th beat, big moments), hits (SFX candidates: downbeats on a grid, onsets on a track)}
"""
import argparse
import json


def grid(bpm, dur):
    step = 60 / bpm
    beats = [round(i * step, 4) for i in range(int(dur / step) + 1)]
    return {"bpm": bpm, "beats": beats, "downbeats": beats[::4], "hits": beats[::4]}


def fit_grid(env, fr, bpm_guess):
    """Best steady (bpm, offset) for the onset envelope. Sub-hop accurate, unlike librosa's tempo."""
    import numpy as np

    idx = np.arange(len(env))

    def score(bpm, offsets):
        spb = 60 / bpm
        k = np.arange(int((len(env) / fr - offsets.max()) / spb) - 1)
        pos = (offsets[:, None] + (k[None, :] + 1) * spb) * fr
        return np.interp(pos, idx, env).mean(axis=1)

    def search(bpms):
        best = (-1, 0, 0)
        for bpm in bpms:
            offs = np.arange(-15 / bpm, 45 / bpm, 1 / fr / 4)  # a beat wide, so a beat at ~0 reads as ~0
            sc = score(bpm, offs)
            if sc.max() > best[0]:
                best = (sc.max(), bpm, offs[sc.argmax()])
        return best

    _, bpm, _ = search(np.arange(bpm_guess * 0.92, bpm_guess * 1.08, 0.05))
    _, bpm, off = search(np.arange(bpm - 0.1, bpm + 0.1, 0.002))
    return bpm, off, score


def measure(path, grid_bpm=None):
    import librosa
    import numpy as np

    y, sr = librosa.load(path, sr=None, mono=True)
    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
    beats = librosa.frames_to_time(beat_frames, sr=sr)
    env = librosa.onset.onset_strength(y=y, sr=sr)
    peaks = librosa.util.peak_pick(
        env, pre_max=3, post_max=3, pre_avg=3, post_avg=5, delta=0.5, wait=10
    )
    hits = librosa.frames_to_time(peaks, sr=sr)
    fr = sr / 512
    # librosa's tempo can be far off (read 122.5 as 163); seed with the target grid when there is one.
    bpm, off, _ = fit_grid(env, fr, grid_bpm or float(np.atleast_1d(tempo)[0]))
    out = {
        "bpm": round(float(bpm), 3),
        "first_beat": round(float(off), 4),
        "beats": [round(float(t), 4) for t in beats],
        "downbeats": [round(float(t), 4) for t in beats[::4]],
        "hits": [round(float(t), 4) for t in hits],
    }
    if grid_bpm:
        stretch = grid_bpm / bpm
        while stretch > 1.5:  # fit locked to half or double time
            stretch /= 2
        while stretch < 0.75:
            stretch *= 2
        # Drift: refit the offset per 8-beat window against the global tempo. Windows without a clear
        # beat (pads, silence, tails) have nothing to drift, so they're skipped and counted.
        spb, worst, beatless = 60 / bpm, 0.0, 0
        idx = np.arange(len(env))
        local = np.arange(-spb / 4, spb / 4, 0.001)
        for w in np.arange(off, len(env) / fr - 8 * spb, 8 * spb):
            pos = (w + local[:, None] + np.arange(8)[None, :] * spb) * fr
            s = np.interp(pos, idx, env).sum(axis=1)
            if s.mean() == 0 or s.max() / s.mean() < 2.5:
                beatless += 1
                continue
            worst = max(worst, abs(local[s.argmax()]))
        out["stretch"] = round(float(stretch), 5)
        out["max_drift_ms"] = round(worst * 1000, 1)
        out["beatless_windows"] = beatless
    return out


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("track", nargs="?")
    p.add_argument("--bpm", type=float, default=120)
    p.add_argument("--dur", type=float, default=15)
    p.add_argument("--grid", type=float, help="with a track: report drift from this fixed BPM")
    args = p.parse_args()
    print(json.dumps(measure(args.track, args.grid) if args.track else grid(args.bpm, args.dur)))
