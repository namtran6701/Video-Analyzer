import { chromium } from "playwright";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage();
await p.goto(process.argv[2], { waitUntil: "domcontentloaded" });
await p.waitForTimeout(3000);
const ps = await p.locator("main p, article p, p").allInnerTexts();
ps.forEach((t, i) => t.trim() && console.log(i, t.trim().slice(0, 400)));
await b.close();
