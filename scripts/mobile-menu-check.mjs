import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
});
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, hasTouch: true });

try {
  // 选择页不提供目录按钮，功能目录只在体系内部页面出现
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  if ((await page.getByRole("button", { name: "打开目录" }).count()) !== 0) {
    throw new Error("入口选择页不应显示目录按钮");
  }

  await page.goto("http://localhost:3000/wace", { waitUntil: "networkidle" });
  const trigger = page.getByRole("button", { name: "打开目录" });
  await trigger.click();

  const menu = page.locator('nav[aria-label="主导航"]').last();
  await menu.waitFor({ state: "visible" });
  const entryCount = await menu.locator("a").count();
  // 两个课程体系入口 + 五个 WACE 功能页 + 宣传册
  if (entryCount !== 8) {
    throw new Error(`目录入口数量异常：预期 8，实际 ${entryCount}`);
  }

  if (process.env.CAPTURE === "1") {
    await page.screenshot({ path: "/home/ubuntu/mobile-menu-open.png", fullPage: false });
  }

  await page.getByRole("button", { name: "关闭目录" }).click();
  await menu.waitFor({ state: "hidden" });
  console.log("手机目录交互验证通过：选择页无目录按钮，体系内目录可展开、含 8 个入口、可关闭。");
} finally {
  await browser.close();
}
