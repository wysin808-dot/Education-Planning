import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
});
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, hasTouch: true });

try {
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  const trigger = page.getByRole("button", { name: "打开目录" });
  await trigger.click();

  const menu = page.locator('nav[aria-label="主导航"]').last();
  await menu.waitFor({ state: "visible" });
  const entryCount = await menu.locator("a").count();
  if (entryCount !== 7) {
    throw new Error(`目录入口数量异常：预期 7，实际 ${entryCount}`);
  }

  if (process.env.CAPTURE === "1") {
    await page.screenshot({ path: "/home/ubuntu/mobile-menu-open.png", fullPage: false });
  }

  await page.getByRole("button", { name: "关闭目录" }).click();
  await menu.waitFor({ state: "hidden" });
  console.log("手机目录交互验证通过：可展开、包含 7 个入口、可关闭。");
} finally {
  await browser.close();
}
