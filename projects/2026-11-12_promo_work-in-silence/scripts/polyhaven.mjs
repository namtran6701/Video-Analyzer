#!/usr/bin/env node
// node polyhaven.mjs <slug> [res=1k] [--copy <dir>]
// Fetches a Poly Haven asset (CC0) into a shared cache, verifies md5, records it in manifest.json,
// and prints the local path. HDRI -> .hdr file; texture -> folder of jpg maps; model -> glTF folder.
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

const ROOT = process.env.POLYHAVEN_CACHE ?? join(homedir(), 'Movies/assets/polyhaven');
const API = 'https://api.polyhaven.com';
const UA = 'motion-studio/1.0';
const TYPES = ['hdri', 'texture', 'model'];
const MAPS = ['Diffuse', 'nor_gl', 'Rough', 'AO', 'arm', 'Displacement'];

const args = process.argv.slice(2);
const copyAt = args.indexOf('--copy');
const copyTo = copyAt >= 0 ? args.splice(copyAt, 2)[1] : null;
const [slug, res = '1k'] = args;
if (!slug) {
  console.error('usage: node polyhaven.mjs <slug> [res=1k] [--copy <dir>]');
  process.exit(1);
}

const getJson = async (path) => {
  const r = await fetch(API + path, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`);
  return r.json();
};

async function download({ url, md5 }, dest) {
  if (existsSync(dest) && createHash('md5').update(await readFile(dest)).digest('hex') === md5) return;
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  if (createHash('md5').update(buf).digest('hex') !== md5) throw new Error(`${url}: md5 mismatch`);
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, buf);
}

const pick = (byRes, label) => {
  if (!byRes?.[res]) throw new Error(`${slug}: no ${label} at ${res} (have ${Object.keys(byRes ?? {}).join(', ')})`);
  return byRes[res];
};

const info = await getJson(`/info/${slug}`);
const type = TYPES[info.type];
const files = await getJson(`/files/${slug}`);
let out;

if (type === 'hdri') {
  out = join(ROOT, 'hdri', `${slug}_${res}.hdr`);
  await download(pick(files.hdri, 'hdri').hdr, out);
} else if (type === 'model') {
  out = join(ROOT, 'model', `${slug}_${res}`);
  const { gltf } = pick(files.gltf, 'gltf');
  await download(gltf, join(out, `${slug}.gltf`));
  for (const [rel, f] of Object.entries(gltf.include ?? {})) await download(f, join(out, rel));
} else {
  out = join(ROOT, 'texture', `${slug}_${res}`);
  for (const map of MAPS.filter((m) => files[m])) {
    await download(pick(files[map], map).jpg, join(out, `${slug}_${map}_${res}.jpg`));
  }
}

const manifestPath = join(ROOT, 'manifest.json');
const manifest = existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, 'utf8')) : {};
manifest[`${slug}@${res}`] = {
  type,
  name: info.name,
  res,
  path: out,
  authors: Object.keys(info.authors ?? {}),
  source: `https://polyhaven.com/a/${slug}`,
  license: 'CC0',
};
await writeFile(manifestPath, JSON.stringify(manifest, null, 2));

if (copyTo) {
  const dest = join(copyTo, out.split('/').pop());
  await cp(out, dest, { recursive: true });
  out = dest;
}
console.log(out);
