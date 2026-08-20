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

  // 第二层功能导航须随所处体系整体更换，不与体系入口混排
  const cases = [
    { path: "/wace", present: ["分数查院校", "门槛总表"], absent: ["预测成绩查院校", "31 校速查"] },
    { path: "/alevel", present: ["预测成绩查院校", "31 校速查"], absent: ["分数查院校", "门槛总表"] },
  ];

  for (const c of cases) {
    await page.goto(`http://localhost:3000${c.path}`, { waitUntil: "networkidle" });
    const primary = page.locator('nav[aria-label="主导航"]');
    await primary.waitFor({ state: "visible" });

    for (const label of c.present) {
      if ((await primary.getByRole("link", { name: label, exact: true }).count()) === 0) {
        throw new Error(`${c.path} 的功能导航缺少「${label}」`);
      }
    }
    for (const label of c.absent) {
      if ((await primary.getByRole("link", { name: label, exact: true }).count()) !== 0) {
        throw new Error(`${c.path} 的功能导航不应出现另一体系的「${label}」`);
      }
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
  await page.goto("http://localhost:3000/wace", { waitUntil: "networkidle" });
  await page.getByText("更多", { exact: true }).click();
  await page.getByRole("link", { name: "宣传册" }).waitFor({ state: "visible" });

  console.log("桌面导航验证通过：选择页无功能导航，体系切换与功能导航分层，功能项随体系整体更换，宣传册在「更多」菜单。");
} finally {
  await browser.close();
}

