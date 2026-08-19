import { chromium } from "playwright";

const BASE_URL = "http://localhost:3000";
const routes = [
  ["/", /ATAR|升学/],
  ["/forward", /ATAR|分数/],
  ["/reverse", /院校|University/],
  ["/subjects", /选课|Subject/],
  ["/table", /门槛|Threshold/],
  ["/shortlist", /清单|Shortlist/],
  ["/brochure", /宣传册|Brochure/],
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
  await page.getByText("An ATAR of 92 is not one university.").waitFor({ state: "visible" });
  await page.getByRole("button", { name: "中文" }).click();
  await page.getByText("ATAR 92 能进的不是一所大学").waitFor({ state: "visible" });

  await page.goto(`${BASE_URL}/forward`, { waitUntil: "networkidle" });
  const atarInput = page.locator('input[type="number"]').first();
  await atarInput.fill("100");
  await page.getByText("ATAR 的有效区间为 0 至 99.95。").waitFor({ state: "visible" });
  await atarInput.fill("92");
  await page.getByText("ATAR 的有效区间为 0 至 99.95。").waitFor({ state: "hidden" });

  if (runtimeErrors.length > 0) {
    throw new Error(`检测到运行时错误：${runtimeErrors.join(" | ")}`);
  }

  console.log("全站烟雾测试通过：核心路由、404、双语切换、正向查询边界与运行时控制台均正常。");
} finally {
  await browser.close();
}
