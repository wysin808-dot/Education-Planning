import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

try {
  // 根路径为课程体系选择页，不应出现功能主导航
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  if ((await page.locator('nav[aria-label="主导航"]').count()) !== 0) {
    throw new Error("入口选择页不应显示功能主导航");
  }

  await page.goto("http://localhost:3000/wace", { waitUntil: "networkidle" });
  const primary = page.locator('nav[aria-label="主导航"]');
  const more = primary.getByText("更多", { exact: true });
  await more.click();
  const brochure = primary.getByRole("link", { name: "宣传册" });
  await brochure.waitFor({ state: "visible" });
  const box = await brochure.boundingBox();
  if (!box) throw new Error("“更多”菜单未显示宣传册入口");
  console.log("桌面导航验证通过：入口选择页无功能导航，WACE 页“更多”菜单可访问宣传册。");
} finally {
  await browser.close();
}
