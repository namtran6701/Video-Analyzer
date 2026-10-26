import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
const p = await (await b.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 })).newPage();
await p.goto("https://www.adweek.com/commerce/amazon-locks-out-metas-muse-in-agentic-shopping-standoff/", { waitUntil: "domcontentloaded" }); await p.waitForTimeout(3000);
const h = await p.locator("h1").first().boundingBox();
await p.screenshot({ path: "../../public/evidence/r17-adweek.png", clip: { x: h.x - 40, y: h.y - 60, width: Math.max(h.width, 900) + 80, height: 360 } });
await b.close();
