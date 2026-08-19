import { chromium } from "playwright";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const failures = [];
page.on("pageerror", (error) => failures.push(`pageerror: ${error.message}`));
page.on("console", (message) => {
  if (message.type() === "error") failures.push(`console: ${message.text()}`);
});

async function expectVisible(selector, description) {
  const item = page.locator(selector).first();
  if (!(await item.isVisible().catch(() => false))) throw new Error(`Missing ${description}: ${selector}`);
}

try {
  await page.goto(`${baseURL}/alevel`, { waitUntil: "networkidle" });
  await expectVisible("text=以 3–4 门 A-Level", "A-Level landing headline");
  await expectVisible("text=数学", "confirmed subject list");

  await page.goto(`${baseURL}/alevel/forward`, { waitUntil: "networkidle" });
  const selects = page.locator("select");
  await selects.nth(0).selectOption("A*");
  await selects.nth(1).selectOption("A");
  await selects.nth(2).selectOption("A");
  await expectVisible("text=公开条件", "forward match output");
  await expectVisible("text=顾问复核", "review status disclosure");

  await page.goto(`${baseURL}/alevel/reverse`, { waitUntil: "networkidle" });
  await expectVisible("text=官方来源", "reverse source section");
  await expectVisible("text=BCI 选课映射", "BCI subject mapping");
  await page.getByRole("button", { name: "EN" }).click();
  await expectVisible("text=Official sources", "English reverse interface");

  await page.goto(`${baseURL}/alevel/table`, { waitUntil: "networkidle" });
  await expectVisible("text=31-university A-Level reference", "English table heading");
  await expectVisible("text=Official source", "table source link");

  if (failures.length) throw new Error(failures.join("\n"));
  console.log("A-Level core flow check passed.");
} finally {
  await browser.close();
}
