import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
});

try {
  const mobileContext = await browser.newContext({ viewport: { width: 375, height: 812 }, hasTouch: true });
  await mobileContext.addInitScript(() => {
    Object.defineProperty(navigator, "canShare", { configurable: true, value: () => false });
    Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
  });
  const mobile = await mobileContext.newPage();
  await mobile.goto("http://localhost:3000/reverse", { waitUntil: "networkidle" });
  const exportButton = mobile.getByRole("button", { name: "导出 PDF" }).first();
  const mobileErrors = [];
  mobile.on("pageerror", (error) => mobileErrors.push(error.message));
  mobile.on("console", (message) => {
    if (message.type() === "error") mobileErrors.push(message.text());
  });
  const popupPromise = mobileContext.waitForEvent("page", { timeout: 5000 });
  await exportButton.click();
  const popup = await popupPromise;
  await popup.waitForLoadState("domcontentloaded");
  await mobile.waitForTimeout(15000);
  const toasts = await mobile.locator("[data-sonner-toast]").allTextContents();
  const buttonState = await exportButton.getAttribute("aria-busy");
  const buttonText = await exportButton.textContent();
  const exported = popup.url().startsWith("blob:") || toasts.some((text) => text.includes("PDF 已在新窗口打开") || text.includes("PDF 已下载到设备。"));
  if (!exported) {
    throw new Error(`手机端未完成 PDF 导出：${JSON.stringify({ toasts, buttonState, buttonText, mobileErrors, popupUrl: popup.url() })}`);
  }
  await popup.close();
  await mobile.close();
  await mobileContext.close();

  const desktop = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await desktop.addInitScript(() => {
    window.print = () => {
      document.documentElement.dataset.printCalled = "yes";
    };
  });
  await desktop.goto("http://localhost:3000/forward", { waitUntil: "networkidle" });
  await desktop.getByRole("button", { name: "导出 PDF" }).first().click();
  const printCalled = await desktop.locator("html").getAttribute("data-print-called");
  if (printCalled !== "yes") throw new Error("桌面端未调用系统打印");
  await desktop.close();

  console.log("PDF 导出验证通过：手机端生成 PDF 下载并反馈状态，桌面端调用系统打印。");
} finally {
  await browser.close();
}
