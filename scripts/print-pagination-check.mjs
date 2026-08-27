/**
 * 打印分页回归：查询类页面导出 PDF 时必须铺满整页、不横向出血。
 *
 * 固化三条来之不易的不变量（每一条都对应曾经真实发生过的版式事故）：
 *
 *  1. 屏幕标题带在打印媒体下隐藏。
 *     它只讲操作方法，打印稿的报告页眉由 PrintHeader 承担；两者并存会白占页首。
 *
 *  2. article 与 section 不得整块防断（break-inside: avoid）。
 *     曾对二者一律防断，任何高于一页的结果区都会整体跳页——
 *     「由目标规划」的第一页因此几乎全白，导出五页里有三页是浪费的。
 *     防断只允许施加在表格行与显式标记的小单元上。
 *
 *  3. 打印布局不得横向溢出。
 *     左右页边距放在 body 内边距里（在排版宽度之内），
 *     而不是 @page margin（在排版宽度之外，会把右缘推出纸面）。
 */
import { chromium } from "playwright";

/** 预览服务地址，默认本地 3000；跑在其他端口时用 BASE_URL 覆盖 */
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

/** 十二个带「打印 / 存为 PDF」的查询页 */
const PAGES = [
  "/wace/forward",
  "/wace/reverse",
  "/wace/field",
  "/wace/timeline",
  "/wace/subjects",
  "/wace/table",
  "/wace/shortlist",
  "/alevel/forward",
  "/alevel/reverse",
  "/alevel/field",
  "/alevel/subjects",
  "/alevel/table",
  "/alevel/shortlist",
];

/** A4 可打印区宽度：210mm 减去左右各 12mm，约 703 CSS px */
const CONTENT_WIDTH = 703;

const problems = [];

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
});

try {
  const page = await browser.newPage({ viewport: { width: CONTENT_WIDTH, height: 1123 } });

  for (const path of PAGES) {
    await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle" });
    await page.emulateMedia({ media: "print" });
    await page.waitForTimeout(250);

    const result = await page.evaluate(() => {
      const out = { band: 0, avoid: [], overflow: [] };

      for (const el of document.querySelectorAll(".print-title-band")) {
        if (getComputedStyle(el).display !== "none") out.band += 1;
      }

      for (const el of document.querySelectorAll("article, section")) {
        const style = getComputedStyle(el);
        if (style.breakInside === "avoid" || style.pageBreakInside === "avoid") {
          out.avoid.push(el.tagName.toLowerCase() + "." + String(el.className).slice(0, 40));
        }
      }

      const width = document.body.clientWidth;
      for (const el of document.querySelectorAll("*")) {
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") continue;
        const box = el.getBoundingClientRect();
        if (box.width === 0) continue;
        if (box.right > width + 1) {
          out.overflow.push(
            el.tagName.toLowerCase() + "." + String(el.className).slice(0, 40) + " right=" + Math.round(box.right),
          );
        }
      }
      out.width = width;
      return out;
    });

    await page.emulateMedia({ media: "screen" });

    if (result.band > 0) problems.push(`${path}：打印稿仍输出 ${result.band} 个屏幕标题带`);
    if (result.avoid.length > 0) {
      problems.push(`${path}：${result.avoid.length} 个 article/section 仍整块防断（${result.avoid[0]}）`);
    }
    if (result.overflow.length > 0) {
      problems.push(
        `${path}：${result.overflow.length} 个元素超出正文宽 ${result.width}（${result.overflow[0]}）`,
      );
    }
  }

  await page.close();

  if (problems.length) {
    console.error(`打印分页自检发现 ${problems.length} 项：`);
    problems.forEach((p, i) => console.error(`  ${i + 1}. ${p}`));
    process.exit(1);
  }

  console.log(
    `打印分页验证通过：${PAGES.length} 个查询页在打印媒体下均隐藏屏幕标题带、不整块防断、无横向溢出。`,
  );
} finally {
  await browser.close();
}
