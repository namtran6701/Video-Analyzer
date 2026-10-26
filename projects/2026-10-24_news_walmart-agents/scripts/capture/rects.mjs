// Recaptures evidence and records where key phrases sit in each image (CSS px; images are 2x).
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const OUT = "../../public/evidence";
const W = "https://corporate.walmart.com/news/2026/10/Making-It-Possible-for-Agents-to-Shop-on-Behalf-of-Customers";
const jobs = [
  { url: W, shots: [
    { file: "r04-walmart-header", viewport: true, phrases: { date: "Oct. 21, 2026" } },
    { file: "r05-introducing", para: "That’s why we’re introducing", phrases: { hl: "shop with Walmart and Sam’s Club through the apps and agents they choose" } },
    { file: "r06-named-agents", para: "conversational commerce integrations", phrases: { hl: "conversational commerce integrations with Muse, ChatGPT, Gemini and others" } },
    { file: "r07-agent-profiles", para: "Agent Profiles, launching", phrases: { hl: "authorize each AI agent with a dedicated profile", month: "launching in the next month" } },
    { file: "r09-browser-agents", para: "following steps designed for people", phrases: { people: "following steps designed for people", slow: "slow and error-prone", beta: "beta for companies and developers", mcp: "faster, more reliable way to shop" } },
    { file: "r13-approval", para: "require approval for every purchase", phrases: { approve: "require approval for every purchase", limits: "$50, $100 or $200" } },
  ] },
  { url: "https://modelcontextprotocol.io", shots: [
    { file: "r12-mcp", viewport: true, phrases: { usbc: "Think of MCP like a USB-C port for AI applications", title: "What is the Model Context Protocol (MCP)?" } },
  ] },
  { url: "https://www.adweek.com/commerce/amazon-locks-out-metas-muse-in-agentic-shopping-standoff/", shots: [
    { file: "r17-adweek", h1clip: true, phrases: { disclosed: "never disclosed", identify: "without identifying itself", title: "Amazon Locks Out Meta's Muse" } },
  ] },
  { url: "https://techcrunch.com/2026/10/21/while-amazon-blocks-ai-agents-walmart-rolls-out-the-welcome-mat/", shots: [
    { file: "r02-techcrunch", viewport: true, phrases: { title: "While Amazon blocks AI agents" } },
  ] },
  { url: "https://www.amazon.com/s?k=paper+towels", shots: [
    { file: "r19-amazon-sponsored", sponsored: true, phrases: { sponsored: "Sponsored", prime: "Join Prime", cart: "Add to cart" } },
  ] },
];

function findRects(phrases) {
  const norm = (s) => s.replace(/[’']/g, "'");
  const out = {};
  for (const [key, phrase] of Object.entries(phrases)) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let hit = null;
    for (let n = walker.nextNode(); n && !hit; n = walker.nextNode()) {
      const i = norm(n.nodeValue).indexOf(norm(phrase));
      if (i < 0) continue;
      const el = n.parentElement;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || getComputedStyle(el).visibility === "hidden") continue;
      const range = document.createRange();
      range.setStart(n, i); range.setEnd(n, i + phrase.length);
      hit = [...range.getClientRects()].filter((q) => q.width > 1).map((q) => [q.x, q.y, q.width, q.height]);
    }
    out[key] = hit;
  }
  return out;
}

const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2, locale: "en-US" });
const meta = {};
for (const job of jobs) {
  const p = await ctx.newPage();
  await p.goto(job.url, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(3500);
  for (const s of job.shots) {
    let clip = { x: 0, y: 0, width: 1920, height: 1080 };
    if (s.para) {
      const el = p.locator("p", { hasText: s.para }).first();
      await el.scrollIntoViewIfNeeded();
      const r = await el.boundingBox();
      clip = { x: r.x - 40, y: r.y - 40, width: r.width + 80, height: r.height + 80 };
    } else if (s.h1clip) {
      const h = await p.locator("h1").first().boundingBox();
      clip = { x: h.x - 40, y: h.y - 60, width: Math.max(h.width, 900) + 80, height: 360 };
    } else if (s.sponsored) {
      const sp = p.getByText("Sponsored", { exact: true }).first();
      if (!(await sp.count())) { console.log(s.file, "no Sponsored label, keeping old image"); continue; }
      await sp.scrollIntoViewIfNeeded();
      await p.evaluate(() => window.scrollBy(0, -250));
      await p.waitForTimeout(800);
    }
    const rects = await p.evaluate(findRects, s.phrases);
    for (const k in rects) if (rects[k]) rects[k] = rects[k].map(([x, y, w, h]) => [+(x - clip.x).toFixed(1), +(y - clip.y).toFixed(1), +w.toFixed(1), +h.toFixed(1)]);
    await p.screenshot({ path: `${OUT}/${s.file}.png`, clip });
    meta[s.file] = { w: clip.width, h: clip.height, rects };
    console.log(s.file, JSON.stringify(rects));
  }
  await p.close();
}
await b.close();
writeFileSync(`${OUT}/rects.json`, JSON.stringify(meta, null, 1));
