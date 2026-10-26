// node scripts/stills.mjs <outDir> <beat,beat,...>  (beats on the 116 BPM grid)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const [outDir, beats] = process.argv.slice(2);
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "Main-16x9", browserExecutable: chrome, chromiumOptions: { gl: "angle" } });
for (const b of beats.split(",").map(Number)) {
  const frame = Math.round((b * 1800) / 116);
  const output = path.join(outDir, `b${String(b).padStart(5, "0")}.png`);
  await renderStill({ serveUrl, composition, frame, output, browserExecutable: chrome, chromiumOptions: { gl: "angle" } });
  console.log(output);
}
