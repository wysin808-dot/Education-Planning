/**
 * 动效回归：动效不得影响可读性与打印。
 * 校验三件事：
 *  1. 正常偏好下，滚动到底后所有 .reveal 区块都已显现（不残留 opacity:0）；
 *  2. prefers-reduced-motion: reduce 下，不产生任何位移或透明度动画；
 *  3. print 媒体下，所有动效元素均为完全不透明且无位移。
 */
import { chromium } from "playwright";

/** 预览服务地址，默认本地 3000；跑在其他端口时用 BASE_URL 覆盖 */
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

const BASE = `${BASE_URL}`;
const PAGES = ["/", "/wace", "/alevel", "/wace/reverse", "/wace/subjects", "/wace/field", "/alevel/field"];
const problems = [];

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
});

try {
  /* ---------- 1. 正常偏好：滚动后内容必须全部可见 ---------- */
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  for (const path of PAGES) {
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    // 逐屏滚动到底，触发所有 IntersectionObserver
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 500));
    });

    const hidden = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".reveal, .stagger > *, .swap")).filter((el) => {
        const style = getComputedStyle(el);
        return parseFloat(style.opacity) < 0.95;
      }).length,
    );
    if (hidden > 0) problems.push(`${path}：滚动到底后仍有 ${hidden} 个元素未显现`);
  }
  await page.close();

  /* ---------- 2. 减动偏好：不得有动画 ---------- */
  const reduced = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  });
  const rp = await reduced.newPage();
  for (const path of PAGES) {
    await rp.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    const bad = await rp.evaluate(() =>
      Array.from(document.querySelectorAll(".reveal, .stagger > *, .swap, .tick")).filter((el) => {
        const style = getComputedStyle(el);
        const animated = style.animationName !== "none" && style.animationDuration !== "0s";
        const faded = parseFloat(style.opacity) < 0.95;
        return animated || faded;
      }).length,
    );
    if (bad > 0) problems.push(`${path}：减动偏好下仍有 ${bad} 个元素带动画或半透明`);
  }
  await reduced.close();

  /* ---------- 3. 打印：必须完全不透明且无位移 ---------- */
  const printPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  for (const path of ["/wace/reverse", "/wace/subjects", "/wace/table"]) {
    await printPage.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    await printPage.emulateMedia({ media: "print" });
    const bad = await printPage.evaluate(() =>
      Array.from(document.querySelectorAll(".reveal, .stagger > *, .swap, .tick")).filter((el) => {
        const style = getComputedStyle(el);
        return parseFloat(style.opacity) < 0.99 || style.transform !== "none";
      }).length,
    );
    if (bad > 0) problems.push(`${path}：打印媒体下有 ${bad} 个元素仍半透明或带位移`);
    await printPage.emulateMedia({ media: "screen" });
  }
  await printPage.close();

  if (problems.length > 0) {
    throw new Error(`动效存在问题：\n - ${problems.join("\n - ")}`);
  }
  console.log(
    "动效验证通过：滚动后内容全部显现，减动偏好下无动画，打印媒体下无残留透明度与位移。",
  );
} finally {
  await browser.close();
}
