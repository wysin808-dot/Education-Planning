import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

/** 预览服务地址，默认本地 3000；跑在其他端口时用 BASE_URL 覆盖 */
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

import { fileURLToPath } from "node:url";
import path from "node:path";

/** 输出目录：默认落在项目内 dist/brochure，部署环境用 BROCHURE_OUT_DIR 覆盖 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = process.env.BROCHURE_OUT_DIR ?? path.join(root, "dist", "brochure");
const output = path.join(outDir, "brentvale-wace-admissions-almanac-2026-27.pdf");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
});

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${BASE_URL}/brochure`, { waitUntil: "networkidle" });
  await page.evaluate(async () => document.fonts.ready);
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: output,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
  console.log(`固定宣传册 PDF 已生成：${output}`);
} finally {
  await browser.close();
}
