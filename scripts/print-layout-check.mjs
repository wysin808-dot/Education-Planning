import { chromium } from "playwright";

/** 预览服务地址，默认本地 3000；跑在其他端口时用 BASE_URL 覆盖 */
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
});

try {
  const mobileContext = await browser.newContext({ viewport: { width: 375, height: 812 }, hasTouch: true });
  const mobile = await mobileContext.newPage();
  await mobile.goto(`${BASE_URL}/wace/forward`, { waitUntil: "networkidle" });
  await mobile.getByRole("button", { name: "打印 / 存为 PDF" }).click();
  await mobile.getByText("请用浏览器菜单打印或存储为 PDF").waitFor({ state: "visible" });
  await mobileContext.close();

  const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await desktopContext.addInitScript(() => {
    window.print = () => {
      document.documentElement.dataset.printCalled = "yes";
    };
  });
  const desktop = await desktopContext.newPage();
  await desktop.goto(`${BASE_URL}/wace/reverse`, { waitUntil: "networkidle" });
  await desktop.getByRole("button", { name: "打印 / 存为 PDF" }).click();
  if ((await desktop.locator("html").getAttribute("data-print-called")) !== "yes") {
    throw new Error("桌面动态报告未调用系统打印");
  }

  await desktop.goto(`${BASE_URL}/brochure`, { waitUntil: "networkidle" });
  const href = await desktop.getByRole("link", { name: "打开固定版 PDF" }).getAttribute("href");
  if (!href?.endsWith(".pdf")) throw new Error(`宣传册固定 PDF 链接无效：${href}`);
  const response = await desktop.request.get(new URL(href, desktop.url()).toString());
  if (!response.ok()) throw new Error(`宣传册固定 PDF 无法访问：HTTP ${response.status()}`);

  await desktopContext.close();
  console.log("打印版式验证通过：手机端显示原生打印指引、桌面端调用系统打印、固定宣传册 PDF 可访问。");
} finally {
  await browser.close();
}
