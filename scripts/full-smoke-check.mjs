import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const routes = [
  ["/", /先选择你的课程体系|WACE/],
  ["/wace", /ATAR|升学/],
  ["/wace/forward", /ATAR|分数/],
  ["/wace/reverse", /院校|University/],
  ["/wace/field", /方向|Field/],
  ["/wace/timeline", /时间轴|Timeline/],
  ["/wace/subjects", /选课|Subject/],
  ["/wace/table", /门槛|Threshold/],
  ["/wace/shortlist", /清单|Shortlist/],
  ["/brochure", /宣传册|Brochure/],
  ["/alevel", /A-Level/],
  ["/alevel/field", /方向|Field/],
  ["/not-a-real-route", /404|页面|Page/],
];

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const runtimeErrors = [];

page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));
page.on("console", (message) => {
  if (message.type() === "error" && !message.text().includes("[vite]")) {
    runtimeErrors.push(`console: ${message.text()}`);
  }
});

try {
  for (const [path, expected] of routes) {
    const response = await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle" });
    if (!response?.ok()) throw new Error(`${path} 返回 HTTP ${response?.status()}`);
    const root = page.locator("#root");
    await root.waitFor({ state: "visible" });
    const text = await root.textContent();
    if (!expected.test(text ?? "")) throw new Error(`${path} 未显示预期页面内容`);
  }

  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "EN" }).click();
  await page.getByText("Start by choosing your curriculum.").waitFor({ state: "visible" });
  await page.getByRole("button", { name: "中文" }).click();
  await page.getByText("先选择你的课程体系").waitFor({ state: "visible" });

  // 选择页的两个入口必须分别通向两套系统
  await page.getByRole("link", { name: /进入 WACE 规划系统/ }).click();
  await page.waitForURL("**/wace");
  await page.goBack({ waitUntil: "networkidle" });
  await page.getByRole("link", { name: /进入 A-Level 规划系统/ }).click();
  await page.waitForURL("**/alevel");

  // 旧版根级 WACE 路径需重定向到 /wace/*
  for (const [legacy, target] of [
    ["/forward", "/wace/forward"],
    ["/reverse", "/wace/reverse"],
    ["/subjects", "/wace/subjects"],
    ["/table", "/wace/table"],
    ["/shortlist", "/wace/shortlist"],
  ]) {
    await page.goto(`${BASE_URL}${legacy}`, { waitUntil: "networkidle" });
    const url = new URL(page.url());
    if (url.pathname !== target) throw new Error(`${legacy} 未重定向到 ${target}，实际为 ${url.pathname}`);
  }

  await page.goto(`${BASE_URL}/wace/forward`, { waitUntil: "networkidle" });
  const atarInput = page.locator('input[type="number"]').first();
  await atarInput.fill("100");
  await page.getByText("ATAR 的有效区间为 0 至 99.95。").waitFor({ state: "visible" });
  await atarInput.fill("92");
  await page.getByText("ATAR 的有效区间为 0 至 99.95。").waitFor({ state: "hidden" });

  if (runtimeErrors.length > 0) {
    throw new Error(`检测到运行时错误：${runtimeErrors.join(" | ")}`);
  }

  console.log("全站烟雾测试通过：入口选择页、双体系路由、旧路径重定向、404、双语切换、正向查询边界与运行时控制台均正常。");
} finally {
  await browser.close();
}
