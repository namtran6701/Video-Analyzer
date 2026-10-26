import { chromium } from "playwright";
const OUT = "../../public/evidence";
const W = "https://corporate.walmart.com/news/2026/10/Making-It-Possible-for-Agents-to-Shop-on-Behalf-of-Customers";
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2, locale: "en-US" });

async function para(page, text, file) {
  const el = page.locator("p", { hasText: text }).first();
  await el.scrollIntoViewIfNeeded();
  const r = await el.boundingBox();
  await page.screenshot({ path: `${OUT}/${file}.png`, clip: { x: r.x - 40, y: r.y - 40, width: r.width + 80, height: r.height + 80 } });
  console.log(file, "ok");
}

let p = await ctx.newPage();
await p.goto(W, { waitUntil: "domcontentloaded" }); await p.waitForTimeout(3000);
await para(p, "That’s why we’re introducing", "r05-introducing");
await para(p, "conversational commerce integrations", "r06-named-agents");
await para(p, "following steps designed for people", "r09-browser-agents");
await p.close();

p = await ctx.newPage();
await p.goto("https://www.adweek.com/commerce/amazon-locks-out-metas-muse-in-agentic-shopping-standoff/", { waitUntil: "domcontentloaded" }); await p.waitForTimeout(3000);
const h = await p.locator("h1").first().boundingBox();
await p.screenshot({ path: `${OUT}/r17-adweek.png`, clip: { x: h.x - 40, y: h.y - 60, width: Math.max(h.width, 900) + 80, height: 300 } });
console.log("r17-adweek ok");
await p.close();

p = await ctx.newPage();
await p.goto("https://www.amazon.com/s?k=paper+towels", { waitUntil: "domcontentloaded" }); await p.waitForTimeout(4000);
const sp = p.getByText("Sponsored", { exact: true }).first();
if (await sp.count()) {
  await sp.scrollIntoViewIfNeeded();
  await p.evaluate(() => window.scrollBy(0, -250));
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${OUT}/r19-amazon-sponsored.png` });
  console.log("r19 sponsored ok");
} else console.log("r19 no Sponsored label found");
await b.close();
