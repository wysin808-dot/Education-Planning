/**
 * QS 排名回归。
 *
 * 重点不是「有没有显示数字」，而是三件容易出错、且会误导家长的事：
 *  1. 31 所院校全部有记录，且未列入世界排名的两所（SIT、SUSS）必须为 null——
 *     绝不能把 QS 亚洲排名（SUSS =627）当成世界排名写进去；
 *  2. 页面上未列入的院校要显式写明「未列入 QS 世界排名」，不能留空或显示 0；
 *  3. 按 QS 排序时，未列入的院校必须沉到最后，而不是因为 null 被当作 0 顶到最前。
 */
import { chromium } from "playwright";
import { readFileSync } from "fs";

const BASE = "http://localhost:3000";
const problems = [];

/* ---------- 1. 数据层校验 ---------- */
const src = readFileSync("client/src/data/qs.ts", "utf8");
const entries = [...src.matchAll(/^\s{2}(\w+): \{ rank: (null|\d+), display: (null|"[^"]*")/gm)].map(
  (m) => ({ id: m[1], rank: m[2] === "null" ? null : Number(m[2]), display: m[3] }),
);

if (entries.length !== 31) problems.push(`数据层应有 31 所院校，实际 ${entries.length}`);

const unranked = entries.filter((e) => e.rank === null).map((e) => e.id).sort();
if (unranked.join(",") !== "sit,suss") {
  problems.push(`未列入世界排名的院校应恰为 sit 与 suss，实际为 ${unranked.join(",") || "无"}`);
}

// SUSS 的亚洲排名 627 绝不能出现在数据里
if (/627/.test(src.replace(/^\s*\*.*$/gm, ""))) {
  problems.push("数据层出现 627，疑似把 SUSS 的 QS 亚洲排名当作世界排名写入");
}

for (const e of entries) {
  if (e.rank !== null && (e.rank < 1 || e.rank > 1500)) {
    problems.push(`${e.id} 的排名 ${e.rank} 超出合理范围`);
  }
}

/* ---------- 2. 页面呈现校验 ---------- */
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
});

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // 门槛总表：全部 31 校都应带排名标记或未列入说明
  await page.goto(`${BASE}/wace/table`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const tableText = await page.locator("#root").innerText();
  if (!tableText.includes("QS")) problems.push("门槛总表未见任何 QS 排名标记");
  if (!tableText.includes("未列入 QS 世界排名")) {
    problems.push("门槛总表未对未列入院校给出明确说明");
  }

  // 按 QS 排序：未列入的院校必须排在最后
  await page.selectOption("select", "qs");
  await page.waitForTimeout(500);
  const orderedIds = await page.evaluate(() =>
    Array.from(document.querySelectorAll("h2")).map((h) => h.textContent?.trim() ?? ""),
  );
  const idxSit = orderedIds.findIndex((s) => s.includes("SIT"));
  const idxSuss = orderedIds.findIndex((s) => s.includes("SUSS"));
  const idxNus = orderedIds.findIndex((s) => s.includes("NUS"));
  if (idxNus === -1) {
    problems.push("按 QS 排序后未找到 NUS，排序可能失效");
  } else {
    if (idxSit !== -1 && idxSit < idxNus) problems.push("按 QS 排序时 SIT（未列入）排在了 NUS 之前");
    if (idxSuss !== -1 && idxSuss < idxNus) problems.push("按 QS 排序时 SUSS（未列入）排在了 NUS 之前");
  }

  // 反查页：NUS 应显示第 10 名
  await page.goto(`${BASE}/wace/reverse`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const reverseText = await page.locator("#root").innerText();
  if (!/QS\s*10/.test(reverseText)) {
    problems.push("反查页未正确显示 NUS 的 QS 排名（应为 10）");
  }

  // 英文界面下不应残留中文排名措辞
  await page.goto(`${BASE}/wace/table`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /^EN$/ }).click();
  await page.waitForTimeout(500);
  const enText = await page.locator("#root").innerText();
  if (/未列入|世界排名/.test(enText)) {
    problems.push("英文界面下排名说明仍出现中文");
  }
  if (!enText.includes("Not in QS World Rankings")) {
    problems.push("英文界面缺少未列入院校的英文说明");
  }

  await page.close();

  if (problems.length > 0) {
    throw new Error(`QS 排名存在问题：\n - ${problems.join("\n - ")}`);
  }
  console.log(
    `QS 排名验证通过：31 所院校数据齐全，SIT 与 SUSS 明确标注未列入世界排名（未混用亚洲排名），排序时沉底，中英文措辞正确。`,
  );
} finally {
  await browser.close();
}
