import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

try {
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  const primary = page.locator('nav[aria-label="主导航"]');
  const more = primary.getByText("更多", { exact: true });
  await more.click();
  const brochure = primary.getByRole("link", { name: "宣传册" });
  await brochure.waitFor({ state: "visible" });
  const box = await brochure.boundingBox();
  if (!box) throw new Error("“更多”菜单未显示宣传册入口");
  console.log("桌面导航验证通过：宣传册已收纳至“更多”菜单并可访问。");
} finally {
  await browser.close();
}
