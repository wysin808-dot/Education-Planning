import { chromium } from "playwright";

const routes = ["/forward", "/reverse", "/table", "/brochure"];
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
});

try {
  for (const route of routes) {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 }, hasTouch: true });
    const page = await context.newPage();
    await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
    const button = page.getByRole("button", { name: "导出 PDF" }).first();
    const popupPromise = context.waitForEvent("page", { timeout: 5000 });
    await button.click();
    const popup = await popupPromise;
    await popup.waitForTimeout(20000);
    if (!popup.url().startsWith("blob:")) {
      const errors = await page.locator("[data-sonner-toast]").allTextContents();
      throw new Error(`${route} 未生成 Blob PDF：${JSON.stringify({ url: popup.url(), errors })}`);
    }
    await popup.close();
    await context.close();
    console.log(`${route}：移动端 PDF 预览生成成功`);
  }
  console.log("四类 PDF 页面均通过移动端导出回归测试。");
} finally {
  await browser.close();
}
