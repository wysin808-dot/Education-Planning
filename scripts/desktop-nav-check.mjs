import { chromium } from "playwright";

/** 预览服务地址，默认本地 3000；跑在其他端口时用 BASE_URL 覆盖 */
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

try {
  // 根路径为课程体系选择页，不应出现功能主导航
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  if ((await page.locator('nav[aria-label="主导航"]').count()) !== 0) {
    throw new Error("入口选择页不应显示功能主导航");
  }

  /**
   * 两套体系的功能一一对应，导航名称刻意保持完全相同，
   * 因此这里校验的是链接指向的路径前缀是否随体系整体更换，而不是名称差异。
   */
  const LABELS = ["有成绩规划", "由目标规划", "选课规划", "31 校速查", "目标清单"];
  const cases = [
    { path: "/wace", prefix: "/wace/", foreign: "/alevel/" },
    { path: "/alevel", prefix: "/alevel/", foreign: "/wace/" },
  ];

  for (const c of cases) {
    await page.goto(`${BASE_URL}${c.path}`, { waitUntil: "networkidle" });
    const primary = page.locator('nav[aria-label="主导航"]');
    await primary.waitFor({ state: "visible" });

    for (const label of LABELS) {
      const link = primary.getByRole("link", { name: label, exact: true });
      if ((await link.count()) === 0) {
        throw new Error(`${c.path} 的功能导航缺少「${label}」`);
      }
      const href = await link.first().getAttribute("href");
      if (!href?.startsWith(c.prefix)) {
        throw new Error(`${c.path} 的「${label}」应指向 ${c.prefix}，实际为 ${href}`);
      }
    }
    const foreign = await primary.locator(`a[href^="${c.foreign}"]`).count();
    if (foreign !== 0) {
      throw new Error(`${c.path} 的功能导航混入了 ${c.foreign} 的链接`);
    }

    // 体系切换器须独立于功能导航，并高亮当前体系
    const curriculum = page.locator('nav[aria-label="课程体系"]');
    const currentLabel = c.path === "/alevel" ? "A-Level" : "WACE";
    const active = curriculum.locator('a[aria-current="page"]');
    const activeText = await active.textContent();
    if (!activeText?.includes(currentLabel)) {
      throw new Error(`${c.path} 的体系切换器未高亮 ${currentLabel}`);
    }
  }

  // 宣传册收纳在「更多」菜单
  await page.goto(`${BASE_URL}/wace`, { waitUntil: "networkidle" });
  await page.getByText("更多", { exact: true }).click();
  await page.getByRole("link", { name: "宣传册" }).waitFor({ state: "visible" });

  console.log(
    "桌面导航验证通过：选择页无功能导航；两套体系使用同一套功能名称，链接随体系整体更换且不混入另一体系；宣传册在「更多」菜单。",
  );
} finally {
  await browser.close();
}
