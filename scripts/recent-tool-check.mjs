import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

try {
  await page.goto("http://localhost:3000/forward", { waitUntil: "networkidle" });
  await page.waitForTimeout(80);
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

  const recentLink = page.getByRole("link", { name: /最近使用/ });
  await recentLink.waitFor({ state: "visible" });
  const href = await recentLink.getAttribute("href");
  const text = await recentLink.textContent();
  if (href !== "/forward" || !text?.includes("分数查院校")) {
    throw new Error(`最近使用入口异常：${JSON.stringify({ href, text })}`);
  }
  console.log("最近使用入口验证通过：访问正向查询后可从首页回到对应模块。");
} finally {
  await browser.close();
}
