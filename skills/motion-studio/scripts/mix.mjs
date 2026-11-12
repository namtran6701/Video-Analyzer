// Mix music, SFX and an optional voiceover to a loudness target:
//   node mix.mjs public/mix.wav --music public/music.wav --sfx out/sfx.wav [--vo public/vo.wav] [--i -14] [--tp -1.5]
// Measures the mix, applies one static gain, then a limiter that only touches peaks over the ceiling.
// Not loudnorm: single-pass rides the level through the film and pumps under the voiceover duck, and its
// two-pass linear mode falls back to the same thing whenever the peaks don't fit, which is most mixes.
import { spawnSync } from 'node:child_process';
import { parseArgs } from 'node:util';

const { values: o, positionals: [out = 'public/mix.wav'] } = parseArgs({
  allowPositionals: true,
  options: {
    music: { type: 'string' },
    sfx: { type: 'string' },
    vo: { type: 'string' },
    i: { type: 'string', default: '-14' },
    tp: { type: 'string', default: '-1.5' },
  },
});
if (!o.music || !o.sfx) throw new Error('--music and --sfx are required');
const target = Number(o.i);
const ceiling = Number(o.tp);

const sources = [o.music, o.sfx, ...(o.vo ? [o.vo] : [])];
const bus = o.vo
  ? '[2]asplit=2[vo][sc];[0][sc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[bed];[bed][vo][1]amix=inputs=3:normalize=0'
  : '[0][1]amix=inputs=2:normalize=0';

const ffmpeg = (files, graph, dest) => {
  const { status, stderr } = spawnSync(
    'ffmpeg',
    ['-hide_banner', '-nostats', '-y', ...files.flatMap((f) => ['-i', f]), '-filter_complex', graph, '-map', '[a]', ...dest],
    { encoding: 'utf8', maxBuffer: 1 << 26 },
  );
  if (status !== 0) throw new Error(stderr);
  return stderr;
};
const measure = (files, graph) => {
  const log = ffmpeg(files, `${graph},loudnorm=print_format=json[a]`, ['-f', 'null', '-']);
  const m = JSON.parse(log.slice(log.lastIndexOf('{'), log.lastIndexOf('}') + 1));
  return { i: Number(m.input_i), tp: Number(m.input_tp) };
};

const before = measure(sources, bus);
const gain = target - before.i;
// The limiter runs at 4x the sample rate so it catches peaks between samples (true peak).
ffmpeg(
  sources,
  `${bus},volume=${gain.toFixed(2)}dB,aresample=192000,alimiter=limit=${10 ** (ceiling / 20)}:level=false:attack=5:release=50,aresample=48000[a]`,
  [out],
);
const after = measure([out], '[0]anull');

const limited = Math.max(0, before.tp + gain - ceiling);
console.log(`${out}: ${after.i.toFixed(1)} LUFS, true peak ${after.tp.toFixed(1)} dB (gain ${gain.toFixed(1)} dB, peaks limited by ${limited.toFixed(1)} dB)`);
if (after.i < target - 0.5 || after.tp > ceiling + 0.3) {
  console.error(`WARN: missed ${target} LUFS / ${ceiling} dB true peak. A few cues are far louder than the rest: lower their gain and mix again.`);
  process.exitCode = 1;
}
