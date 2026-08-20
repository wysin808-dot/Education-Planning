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

  for (const [start, firstGroup] of [
    ["/wace", "WACE"],
    ["/alevel", "A-Level"],
  ]) {
    await page.goto(`http://localhost:3000${start}`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "打开目录" }).click();

    const menu = page.locator('nav[aria-label="主导航"]').last();
    await menu.waitFor({ state: "visible" });

    // 目录须按体系分组，且当前体系排在最前并标注「当前」
    const groups = await menu.locator("section").count();
    if (groups !== 2) throw new Error(`${start} 目录分组数量异常：预期 2，实际 ${groups}`);

    const firstHeading = await menu.locator("section").first().textContent();
    if (!firstHeading?.includes(firstGroup) || !firstHeading.includes("当前")) {
      throw new Error(`${start} 目录首个分组应为标注「当前」的 ${firstGroup}`);
    }

    // 每个体系六项功能页，另加宣传册
    const entryCount = await menu.locator("a").count();
    if (entryCount !== 13) {
      throw new Error(`${start} 目录入口数量异常：预期 13，实际 ${entryCount}`);
    }

    await page.getByRole("button", { name: "关闭目录" }).click();
    await menu.waitFor({ state: "hidden" });
  }

  console.log("手机目录交互验证通过：选择页无目录按钮，体系内目录按 WACE / A-Level 分组、当前体系置顶、可展开可关闭。");
} finally {
  await browser.close();
}
