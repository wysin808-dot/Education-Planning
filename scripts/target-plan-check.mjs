/**
 * 单目标升学方案自检：
 *  1. 分年组合规模正确，且 Year 12 / A2 为 Year 11 / AS 的子集
 *  2. 专业的官方先修科目必须出现在方案中（本序列开设时）
 *  3. 竞赛类建议必须标为加分项，不得出现在 official 类别
 *  4. 反查页能在一页内呈现门槛、分年选课与背景准备三节
 */
import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const problems = [];

try {
  await page.goto("http://localhost:3000/wace/reverse", { waitUntil: "networkidle" });

  const report = await page.evaluate(async () => {
    const mod = await import("/src/lib/targetPlan.ts");
    const data = await import("/src/data/universities.ts");

    const cases = [];
    // 覆盖多个方向：教育、医学、工程、法律、设计
    const picks = [
      ["usyd", "usyd-education-secondary"],
      ["nus", "nus-medicine"],
      ["monash", "monash-engineering"],
      ["nus", "nus-law"],
    ];
    for (const [uni, prog] of picks) {
      const plan = mod.buildTargetPlan(uni, prog, "south");
      if (!plan) continue;
      const programme = data.UNIVERSITIES.find((u) => u.id === uni)?.programmes.find(
        (p) => p.id === prog,
      );
      cases.push({
        uni,
        prog,
        y11: plan.year11.map((s) => s.subject),
        y12: plan.year12.map((s) => s.subject),
        roles: plan.year11.map((s) => s.role),
        unavailable: plan.unavailable,
        prerequisites: programme?.prerequisites ?? [],
        extras: programme?.extras ?? [],
        prep: plan.preparation.map((p) => ({ kind: p.kind, title: p.titleZh })),
        atar: plan.requiredAtar,
      });
    }

    // A-Level 方案
    const al = await import("/src/lib/alevelMatching.ts");
    const alevelCases = [];
    for (const [uni, prog] of picks) {
      const lookup = al.alevelReverseLookup(uni, prog);
      if (!lookup) continue;
      const plan = mod.buildAlevelTargetPlan(
        uni,
        prog,
        lookup.requiredSubjects,
        lookup.recommendedSubjects,
      );
      if (!plan) continue;
      alevelCases.push({
        uni,
        prog,
        as: plan.as.map((s) => s.subject),
        a2: plan.a2.map((s) => s.subject),
        required: lookup.requiredSubjects,
        prep: plan.preparation.map((p) => p.kind),
      });
    }

    return {
      cases,
      alevelCases,
      y11Size: mod.Y11_COURSES,
      y12Size: mod.Y12_COURSES,
      asSize: mod.AS_SUBJECTS,
      a2Size: mod.A2_SUBJECTS,
    };
  });

  for (const c of report.cases) {
    if (c.y11.length !== report.y11Size) {
      problems.push(`${c.prog}: Year 11 应为 ${report.y11Size} 门，实际 ${c.y11.length}`);
    }
    if (c.y12.length !== report.y12Size) {
      problems.push(`${c.prog}: Year 12 应为 ${report.y12Size} 门，实际 ${c.y12.length}`);
    }
    if (!c.y12.every((s) => c.y11.includes(s))) {
      problems.push(`${c.prog}: Year 12 含 Year 11 未修读的科目`);
    }
    if (new Set(c.y11).size !== c.y11.length) {
      problems.push(`${c.prog}: Year 11 出现重复科目`);
    }
    // 官方先修必须被满足（除非本序列未开设）
    for (const group of c.prerequisites) {
      if (group.length === 0) continue;
      const satisfied = group.some((k) => c.y12.includes(k));
      const flagged = group.some((k) => c.unavailable.includes(k));
      if (!satisfied && !flagged) {
        problems.push(`${c.prog}: 先修组 [${group.join(" 或 ")}] 未被 Year 12 方案满足`);
      }
    }
    // 英语线必须在首位
    if (c.roles[0] !== "english") {
      problems.push(`${c.prog}: 英语线未排在方案首位`);
    }
    // 竞赛不得被标为官方要求
    const badCompetition = c.prep.find(
      (p) => p.kind === "official" && p.title.includes("竞赛"),
    );
    if (badCompetition) {
      problems.push(`${c.prog}: 竞赛被错误标为官方要求`);
    }
    // official 条目数必须与 extras 一致
    const officialCount = c.prep.filter((p) => p.kind === "official").length;
    if (officialCount !== c.extras.length) {
      problems.push(
        `${c.prog}: 官方要求条目数 ${officialCount} 与 extras ${c.extras.length} 不一致`,
      );
    }
    // 必须始终包含语言条件
    if (!c.prep.some((p) => p.kind === "language")) {
      problems.push(`${c.prog}: 缺少英语语言条件`);
    }
  }

  for (const c of report.alevelCases) {
    if (c.as.length !== report.asSize) {
      problems.push(`${c.prog}: AS 应为 ${report.asSize} 门，实际 ${c.as.length}`);
    }
    if (c.a2.length !== report.a2Size) {
      problems.push(`${c.prog}: A2 应为 ${report.a2Size} 门，实际 ${c.a2.length}`);
    }
    if (!c.a2.every((s) => c.as.includes(s))) {
      problems.push(`${c.prog}: A2 含 AS 未修读的科目`);
    }
    for (const req of c.required) {
      if (!c.a2.includes(req)) {
        problems.push(`${c.prog}: A-Level 先修 ${req} 未进入 A2 方案`);
      }
    }
    if (c.as.includes("furtherMathematics") && !c.as.includes("mathematics")) {
      problems.push(`${c.prog}: 进阶数学缺少数学配套`);
    }
  }

  // 页面层：一页内三节齐备
  const selects = page.locator("aside select");
  await selects.nth(0).selectOption("au");
  await page.waitForTimeout(250);
  await selects.nth(1).selectOption("usyd");
  await page.waitForTimeout(250);
  await selects.nth(2).selectOption("usyd-education-secondary");
  await page.waitForTimeout(500);

  const body = await page.locator("article").innerText();
  for (const [name, needle] of [
    ["所需 ATAR", "所需 ATAR"],
    ["分年选课", "为这个目标怎么选课"],
    ["Year 11", "Year 11"],
    ["Year 12", "Year 12"],
    ["背景准备", "除了成绩，还要准备什么"],
    ["加分项标注", "加分项"],
  ]) {
    if (!body.includes(needle)) {
      problems.push(`WACE 反查页缺少「${name}」一节`);
    }
  }
  if (!body.includes("80.00")) {
    problems.push("悉尼大学教育学（中学）的 ATAR 门槛未正确显示");
  }
  if (!body.includes("数学方法")) {
    problems.push("悉尼大学教育学（中学）的先修科目未出现在方案中");
  }

  // A-Level 反查页
  await page.goto("http://localhost:3000/alevel/reverse", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const alBody = await page.locator("article").innerText();
  for (const [name, needle] of [
    ["分年选课", "为这个目标怎么选课"],
    ["AS", "AS"],
    ["A2", "A2"],
    ["背景准备", "除了等级，还要准备什么"],
  ]) {
    if (!alBody.includes(needle)) {
      problems.push(`A-Level 反查页缺少「${name}」一节`);
    }
  }

  if (problems.length > 0) {
    throw new Error(`单目标方案存在问题：\n - ${problems.join("\n - ")}`);
  }

  console.log(
    `单目标升学方案验证通过：${report.cases.length} 个 WACE 目标与 ${report.alevelCases.length} 个 A-Level 目标的分年组合、先修满足、加分项标注与页面三节结构均正常。`,
  );
} finally {
  await browser.close();
}
