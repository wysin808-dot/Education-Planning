/**
 * 内部工具定位回归：校验全站注入 noindex/nofollow、robots.txt 禁止收录，
 * 且 WACE 与 A-Level 双体系入口均正常呈现。
 */
import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const fail = [];

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
});
const page = await browser.newPage();

for (const path of ["/", "/wace", "/alevel", "/wace/reverse", "/alevel/subjects"]) {
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  const robots = await page.getAttribute('meta[name="robots"]', "content").catch(() => null);
  if (robots !== "noindex, nofollow") fail.push(`${path} 缺少 noindex：${robots}`);
}

// robots.txt
const res = await page.request.get(BASE + "/robots.txt");
const body = await res.text();
if (!body.includes("Disallow: /")) fail.push("robots.txt 未禁止收录");

// 双体系入口
await page.goto(BASE + "/", { waitUntil: "networkidle" });
for (const href of ["/wace", "/alevel"]) {
  const n = await page.locator(`a[href="${href}"]`).count();
  if (n === 0) fail.push(`入口选择页缺少 ${href} 入口`);
}

// 页头体系行含两个体系
await page.goto(BASE + "/wace", { waitUntil: "networkidle" });
const headerWace = await page.locator('header a[href="/wace"]').count();
const headerAlevel = await page.locator('header a[href="/alevel"]').count();
if (headerWace === 0 || headerAlevel === 0) fail.push("页头未同时呈现 WACE 与 A-Level");

// 内部使用标识
const badge = await page.locator("footer", { hasText: "内部使用" }).count();
if (badge === 0) fail.push("页脚缺少内部使用标识");

await browser.close();

if (fail.length) {
  console.error("FAIL\n" + fail.map((f) => " - " + f).join("\n"));
  process.exit(1);
}
console.log("internal-only-check PASS：全站 noindex、robots.txt 生效，双体系入口与内部标识齐备");
