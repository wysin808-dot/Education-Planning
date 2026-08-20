import { chromium } from "playwright";

/** 预览服务地址，默认本地 3000；跑在其他端口时用 BASE_URL 覆盖 */
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

try {
  await page.goto(`${BASE_URL}/wace/forward`, { waitUntil: "networkidle" });
  const saveButton = page.locator('button[title="加入目标清单"]:visible').first();
  await saveButton.click();
  await page.locator('button[title="从目标清单移除"]:visible').first().waitFor({ state: "visible" });

  await page.goto(`${BASE_URL}/wace/shortlist`, { waitUntil: "networkidle" });
  if ((await page.getByText("我的目标清单").count()) === 0) {
    throw new Error("收藏后无法进入目标清单页");
  }
  if ((await page.getByText("清单还是空的。").count()) > 0) {
    throw new Error("收藏后目标清单仍显示空态");
  }

  await page.reload({ waitUntil: "networkidle" });
  if ((await page.getByText("清单还是空的。").count()) > 0) {
    throw new Error("刷新后收藏清单未从 localStorage 恢复");
  }

  await page.goto(`${BASE_URL}/wace/subjects`, { waitUntil: "networkidle" });
  if ((await page.getByText("目标清单").count()) === 0) {
    throw new Error("选课页未读取收藏目标清单");
  }

  await page.goto(`${BASE_URL}/wace/shortlist`, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  const printHeader = page.locator(".print-header");
  await printHeader.waitFor({ state: "visible" });
  if (!(await printHeader.isVisible())) {
    throw new Error("打印模式未显示报告页眉");
  }
  await page.emulateMedia({ media: "screen" });

  console.log("核心流程验证通过：收藏、持久化、选课清单同步与打印页眉均正常。");
} finally {
  await browser.close();
}
