import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const OUT = "../../public/evidence";
const W = "https://corporate.walmart.com/news/2026/10/Making-It-Possible-for-Agents-to-Shop-on-Behalf-of-Customers";
const shots = [
  { file: "r04-walmart-header", url: W, viewport: true },
  { file: "r05-search-checkout", url: W, text: "faster, more reliable way" },
  { file: "r06-named-agents", url: W, text: "Muse" },
  { file: "r07-agent-profiles", url: W, text: "dedicated profile" },
  { file: "r13-approval", url: W, text: "spending limit" },
  { file: "r22-beta", url: W, text: "beta for companies" },
  { file: "r02-techcrunch", url: "https://techcrunch.com/2026/10/21/while-amazon-blocks-ai-agents-walmart-rolls-out-the-welcome-mat/", viewport: true },
  { file: "r17-adweek", url: "https://www.adweek.com/commerce/amazon-locks-out-metas-muse-in-agentic-shopping-standoff/", viewport: true },
  { file: "r17b-reasons", url: "https://techrepublic.com/article/news-amazon-blocks-meta-muse", text: "identify" },
  { file: "r12-mcp", url: "https://modelcontextprotocol.io", viewport: true },
  { file: "r09-walmart-product", url: "https://www.walmart.com/search?q=paper+towels", viewport: true },
  { file: "r19-amazon-sponsored", url: "https://www.amazon.com/s?k=paper+towels", viewport: true },
];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2, locale: "en-US" });
const log = [];
for (const s of shots) {
  const page = await ctx.newPage();
  try {
    await page.goto(s.url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(3500);
    // dismiss cookie/consent banners without accepting tracking
    for (const label of [/reject/i, /decline/i, /necessary only/i, /close/i]) {
      const b = page.getByRole("button", { name: label }).first();
      if (await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); await page.waitForTimeout(500); break; }
    }
    if (s.viewport) {
      await page.screenshot({ path: `${OUT}/${s.file}.png` });
    } else {
      const el = page.locator("p, li", { hasText: s.text }).first();
      await el.scrollIntoViewIfNeeded({ timeout: 10000 });
      const box = await el.boundingBox();
      await page.screenshot({ path: `${OUT}/${s.file}.png`, clip: { x: Math.max(0, box.x - 40), y: Math.max(0, box.y - 40), width: box.width + 80, height: box.height + 80 } });
    }
    log.push(`${s.file}\tok\t${await page.title()}`);
  } catch (e) {
    log.push(`${s.file}\tFAIL\t${e.message.split("\n")[0]}`);
  }
  await page.close();
}
await browser.close();
writeFileSync(`${OUT}/capture_log.tsv`, log.join("\n") + "\n");
console.log(log.join("\n"));
