// Resolves a word-anchored timeline (src/<name>.src.json) against the voiceover transcript.
// Shortens long pauses in the take, writes public/vo-<name>.wav, src/<name>.json, src/captions-<name>.json and out/captions-<name>.srt.
// Usage: node scripts/resolve.mjs tutorial
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const name = process.argv[2] ?? 'tutorial';
const src = JSON.parse(readFileSync(`src/${name}.src.json`, 'utf8'));
const raw = JSON.parse(readFileSync(src.transcript, 'utf8'));
const sec = (s) => parseFloat(s);

let last = 0;
const words = raw.segments.flatMap((s) => s.words).map((w) => {
  const start = Math.max(sec(w.start_offset), last);
  const end = Math.max(sec(w.end_offset), start + 0.08);
  last = end;
  return { word: w.word, start, end };
});

// Keep ranges of the take: every pause longer than maxGap is cut down to maxGap around its middle.
const cuts = [];
for (let i = 1; i < words.length; i++) {
  const gap = words[i].start - words[i - 1].end;
  if (gap > src.maxGap) {
    const mid = (words[i].start + words[i - 1].end) / 2;
    cuts.push([mid - (gap - src.maxGap) / 2, mid + (gap - src.maxGap) / 2]);
  }
}
const remap = (t) => t - cuts.reduce((acc, [a, b]) => acc + (t >= b ? b - a : t > a ? t - a : 0), 0);
for (const w of words) {
  w.start = remap(w.start);
  w.end = remap(w.end);
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9':]/g, '').replace(/^'|'$/g, '');
const find = ({ at, end, d = 0 }) => {
  const [key, n = '1'] = at.split('#');
  const hits = words.filter((w) => norm(w.word) === key);
  const w = hits[Number(n) - 1];
  if (!w) throw new Error(`anchor not found: ${at} (${hits.length} hits)`);
  return +((end ? w.end : w.start) + d).toFixed(3);
};
const strip = ({ at, end, d, ...rest }) => rest;
const resolve = (list) => list.map((e) => ({ t: find(e), ...strip(e) })).sort((a, b) => a.t - b.t);

// Camera keys keep their authored order: a key that resolves at or before the previous one moves to one frame after it.
const inOrder = (list) => {
  let prev = -1;
  return list.map((e) => {
    let t = find(e);
    if (t <= prev) {
      console.warn(`camera key ${e.at}${e.end ? ' end' : ''} ${e.d ?? 0}: ${t} -> ${(prev + 1 / 24).toFixed(3)}`);
      t = +(prev + 1 / 24).toFixed(3);
    }
    prev = t;
    return { t, ...strip(e) };
  });
};

const logoFrom = find(src.logoFrom);
const dur = Math.ceil((logoFrom + src.tail) * 24) / 24;
const film = {
  dur,
  stageFrom: find(src.stageFrom),
  taglineFrom: find(src.taglineFrom),
  logoFrom,
  opener: src.opener.map((o) => ({ text: o.text, t: find(o) })),
  screens: resolve(src.screens),
  scroll: Object.fromEntries(Object.entries(src.scroll ?? {}).map(([k, keys]) => [k, resolve(keys).map((e) => [e.t, e.v])])),
  camera: inOrder(src.camera),
  taps: resolve(src.taps),
  notifications: (src.notifications ?? (src.notification ? [src.notification] : [])).map((n) => ({ ...n, from: find(n.from), to: find(n.to) })),
  chapters: resolve(src.chapters),
  phone: src.phone && { from: find(src.phone.from), to: find(src.phone.to), screens: resolve(src.phone.screens), taps: resolve(src.phone.taps) },
};
writeFileSync(`src/${name}.json`, JSON.stringify(film, null, 1));

// Voiceover with the pauses removed.
let keep = [];
let from = 0;
for (const [a, b] of cuts) {
  keep.push([from, a]);
  from = b;
}
keep.push([from, null]);
const parts = keep.map(([a, b], i) => `[0]atrim=start=${a.toFixed(3)}${b === null ? '' : `:end=${b.toFixed(3)}`},asetpts=PTS-STARTPTS[p${i}]`);
const filter = `${parts.join(';')};${keep.map((_, i) => `[p${i}]`).join('')}concat=n=${keep.length}:v=0:a=1,aresample=48000,apad=whole_dur=${dur}[a]`;
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src.take, '-filter_complex', filter, '-map', '[a]', '-ac', '2', `public/vo-${name}.wav`]);

// Caption pages, with UI labels in the app's own casing.
const label = { schedule: 'schedule', requests: 'requests', time: 'time', off: 'off', availability: 'availability', coverage: 'coverage' };
const seen = {};
const display = words.map((w, i) => {
  const nth = `${w.word}#${(seen[w.word] = (seen[w.word] ?? 0) + 1)}`;
  let text = (src.fix?.[nth] ?? src.fix?.[w.word] ?? w.word).replace(/^'|'$/g, '').replace('6:00', '6').replace('p.m.', 'PM');
  const prev = words[i - 1]?.word.toLowerCase() ?? '';
  const bare = text.replace(/[.,?!]/g, '');
  if (/^(my|team|request|update|time)$/.test(prev.replace(/[.,?!']/g, '')) && label[bare.toLowerCase()] && bare[0] === bare[0].toUpperCase()) {
    text = text[0].toLowerCase() + text.slice(1);
  }
  return { text, startMs: Math.round(w.start * 1000), endMs: Math.round(w.end * 1000) };
});

const pages = [];
let cur = [];
const flush = () => {
  if (!cur.length) return;
  pages.push({ text: cur.map((w) => w.text).join(' '), startMs: cur[0].startMs, endMs: cur.at(-1).endMs });
  cur = [];
};
for (const [i, w] of display.entries()) {
  cur.push(w);
  const next = display[i + 1]?.text ?? '';
  const tailOnly = /[.?!]$/.test(next) && next.length <= 5;
  const len = cur.map((x) => x.text).join(' ').length;
  if (/[.?!]$/.test(w.text) || (/,$/.test(w.text) && len > 14 && !tailOnly) || len > (src.captionChars ?? 46)) flush();
}
flush();
pages.forEach((p, i) => {
  const next = pages[i + 1];
  p.endMs = Math.min(p.endMs + 400, next ? next.startMs : p.endMs + 400);
});
writeFileSync(`src/captions-${name}.json`, JSON.stringify(pages, null, 1));
const ts = (ms) => new Date(ms).toISOString().slice(11, 23).replace('.', ',');
writeFileSync(`out/captions-${name}.srt`, pages.map((p, i) => `${i + 1}\n${ts(p.startMs)} --> ${ts(p.endMs)}\n${p.text}\n`).join('\n'));

console.log(`dur ${dur}s, stage ${film.stageFrom}, tagline ${film.taglineFrom}, logo ${logoFrom}, cut ${cuts.length} pauses`);
console.log(pages.map((p) => `${(p.startMs / 1000).toFixed(1)} ${p.text}`).join('\n'));
