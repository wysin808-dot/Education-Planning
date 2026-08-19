import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const output = "/home/ubuntu/webdev-static-assets/brentvale-wace-admissions-almanac-2026-27.pdf";
await mkdir("/home/ubuntu/webdev-static-assets", { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
});

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto("http://localhost:3000/brochure", { waitUntil: "networkidle" });
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
