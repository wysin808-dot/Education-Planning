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

  // 九个学科方向都必须给出新加坡本地义工建议，且归入加分项
  const fieldReport = await page.evaluate(async () => {
    const mod = await import("/src/lib/targetPlan.ts");
    const data = await import("/src/data/universities.ts");
    const seen = new Map();
    for (const u of data.UNIVERSITIES) {
      for (const p of u.programmes) {
        if (seen.has(p.field)) continue;
        const plan = mod.buildTargetPlan(u.id, p.id, "south");
        if (!plan) continue;
        const vol = plan.preparation.find((item) => item.titleZh.includes("义工"));
        seen.set(p.field, {
          field: p.field,
          hasVolunteering: Boolean(vol),
          kind: vol?.kind ?? null,
          mentionsSingaporeZh: Boolean(vol && vol.detailZh.includes("新加坡")),
          mentionsSingaporeEn: Boolean(vol && /Singapore/.test(vol.detailEn)),
          distinct: vol?.detailZh ?? "",
        });
      }
    }
    return Array.from(seen.values());
  });

  const allFields = [
    "medicine",
    "law",
    "computing",
    "engineering",
    "business",
    "science",
    "design",
    "arts",
    "education",
  ];
  for (const field of allFields) {
    const entry = fieldReport.find((f) => f.field === field);
    if (!entry) {
      problems.push(`方向 ${field} 未被覆盖到`);
      continue;
    }
    if (!entry.hasVolunteering) problems.push(`方向 ${field} 缺少新加坡义工建议`);
    if (entry.kind !== "advantage") {
      problems.push(`方向 ${field} 的义工建议被标为 ${entry.kind}，应为加分项`);
    }
    if (!entry.mentionsSingaporeZh) problems.push(`方向 ${field} 的中文义工建议未提及新加坡`);
    if (!entry.mentionsSingaporeEn) problems.push(`方向 ${field} 的英文义工建议未提及 Singapore`);
  }
  // 各方向义工建议不得雷同
  const texts = fieldReport.map((f) => f.distinct).filter(Boolean);
  if (new Set(texts).size !== texts.length) {
    problems.push("不同学科方向的义工建议出现重复文案");
  }

  /*
   * 中国学生的锁定科目规则：
   *  - 南半球序列：EALD + 中文（第一语言）+ 数学 三门必在，且两年均保留
   *  - 北半球序列：BCI 不开设中文，须显式提示且不计入锁定
   *  - 数学强项：仅当目标专业无其他非数学先修时才双数学（先修优先）
   *  - A-Level：雅思为独立门槛，不占 AS / A2 名额
   */
  const lockReport = await page.evaluate(async () => {
    const mod = await import("/src/lib/targetPlan.ts");
    const data = await import("/src/data/universities.ts");
    const MATHS = ["mathMethods", "mathSpecialist", "mathApplications"];
    const rows = [];
    const picks = [
      ["usyd", "usyd-education-secondary"],
      ["nus", "nus-computer-science"],
      ["cambridge", "cambridge-engineering"],
      ["nus", "nus-medicine"],
    ];
    for (const [uni, prog] of picks) {
      for (const strong of [false, true]) {
        for (const hemi of ["south", "north"]) {
          const plan = mod.buildTargetPlan(uni, prog, hemi, strong);
          if (!plan) continue;
          const programme = data.UNIVERSITIES.find((u) => u.id === uni)?.programmes.find(
            (p) => p.id === prog,
          );
          const y11 = plan.year11.map((s) => s.subject);
          const y12 = plan.year12.map((s) => s.subject);
          rows.push({
            key: `${uni}/${prog} strong=${strong} ${hemi}`,
            hemi,
            strong,
            y11,
            y12,
            doubleMath: plan.doubleMath,
            blocked: plan.doubleMathBlockedBy,
            chineseAvailable: plan.chineseAvailable,
            unavailable: plan.unavailable,
            counted: plan.counted.map((s) => s.subject),
            backup: plan.backup.map((s) => s.subject),
            countedRoles: plan.counted.map((s) => s.role),
            mathCountY12: y12.filter((k) => MATHS.includes(k)).length,
            // 该专业的非数学先修（本序列开设的）
            nonMathPrereqs: (programme?.prerequisites ?? [])
              .filter((g) => g.length && !g.some((k) => MATHS.includes(k)))
              .map((g) => g[0]),
            prereqGroups: programme?.prerequisites ?? [],
          });
        }
      }
    }
    return rows;
  });

  for (const row of lockReport) {
    // EALD 与数学两年均须锁定
    if (!row.y11.includes("eald")) problems.push(`${row.key}：Year 11 缺少 EALD`);
    if (!row.y12.includes("eald")) problems.push(`${row.key}：Year 12 缺少 EALD`);
    if (row.mathCountY12 < 1) problems.push(`${row.key}：Year 12 未锁定数学`);

    if (row.hemi === "south") {
      if (!row.chineseAvailable) problems.push(`${row.key}：南半球序列应开设中文（第一语言）`);
      if (!row.y11.includes("chineseFL")) problems.push(`${row.key}：Year 11 缺少中文（第一语言）`);
      if (!row.y12.includes("chineseFL")) problems.push(`${row.key}：Year 12 缺少中文（第一语言）`);
    } else {
      if (row.chineseAvailable) problems.push(`${row.key}：北半球序列不应开设中文`);
      if (row.y11.includes("chineseFL")) problems.push(`${row.key}：北半球序列不应把中文计入方案`);
      if (!row.unavailable.includes("chineseFL")) {
        problems.push(`${row.key}：北半球序列缺少中文未开设的提示`);
      }
    }

    /*
     * 先修优先规则：Year 12 修五门，锁定三门后尚余名额，
     * 仅当非数学先修占满这些名额时，双数学才须让位并给出说明。
     */
    const lockedCount = 1 + (row.chineseAvailable ? 1 : 0) + 1;
    const roomAfterPrereqs = row.y12.length - lockedCount - row.nonMathPrereqs.length;
    if (row.strong && roomAfterPrereqs < 1) {
      if (row.doubleMath) {
        problems.push(`${row.key}：名额不足却仍采用双数学，违反先修优先规则`);
      }
      if (row.blocked.length === 0) {
        problems.push(`${row.key}：双数学被让位却未说明原因`);
      }
    }
    if (row.doubleMath && row.mathCountY12 !== 2) {
      problems.push(`${row.key}：标记为双数学但 Year 12 数学门数为 ${row.mathCountY12}`);
    }
    // Year 12 必须是 Year 11 的子集
    for (const k of row.y12) {
      if (!row.y11.includes(k)) problems.push(`${row.key}：Year 12 的 ${k} 不在 Year 11 组合中`);
    }

    // 五门取四门：计分四门 + 备份一门，且资格类科目必须计入
    if (row.counted.length !== 4) {
      problems.push(`${row.key}：计入 ATAR 的科目应为 4 门，实际 ${row.counted.length}`);
    }
    if (row.counted.length + row.backup.length !== row.y12.length) {
      problems.push(`${row.key}：计分与备份之和不等于 Year 12 门数`);
    }
    for (const item of row.countedRoles) {
      // 仅校验存在性，具体角色组合由下方资格校验覆盖
      if (!item) problems.push(`${row.key}：计分科目缺少角色标记`);
    }
    /*
     * EALD 与数学线必须计入；先修组按「多选一」校验，
     * 组内只要有一门计入即视为满足，其余按支撑科目处理。
     */
    const MATH_KEYS = ["mathMethods", "mathSpecialist", "mathApplications"];
    for (const k of row.y12) {
      if (k !== "eald" && !MATH_KEYS.includes(k)) continue;
      if (!row.counted.includes(k)) {
        problems.push(`${row.key}：资格类科目 ${k} 未计入 ATAR 的四门`);
      }
    }
    for (const group of row.prereqGroups ?? []) {
      if (!group || group.length === 0) continue;
      const inPlan = group.filter((k) => row.y12.includes(k));
      if (inPlan.length === 0) continue; // 本序列未开设，另有 unavailable 提示
      if (!inPlan.some((k) => row.counted.includes(k))) {
        problems.push(`${row.key}：先修组 [${group.join(" 或 ")}] 无任何科目计入 ATAR 的四门`);
      }
    }
  }

  // A-Level 的英语门槛必须独立于选课
  const alGate = await page.evaluate(async () => {
    const mod = await import("/src/lib/targetPlan.ts");
    const al = await import("/src/lib/alevelMatching.ts");
    const lookup = al.alevelReverseLookup("nus", "nus-computer-science");
    const plan = mod.buildAlevelTargetPlan(
      "nus",
      "nus-computer-science",
      lookup?.requiredSubjects ?? [],
      lookup?.recommendedSubjects ?? [],
    );
    if (!plan) return null;
    return {
      hasGate: Boolean(plan.englishGate?.detailZh),
      noteZh: plan.englishGate?.noteZh ?? "",
      asSubjects: plan.as.map((s) => s.subject),
      a2Subjects: plan.a2.map((s) => s.subject),
    };
  });

  if (!alGate) {
    problems.push("A-Level 方案未能生成，无法校验英语门槛");
  } else {
    if (!alGate.hasGate) problems.push("A-Level 方案缺少独立的英语门槛字段");
    if (!alGate.noteZh.includes("不占")) {
      problems.push("A-Level 英语门槛未说明不占选课名额");
    }
    // 七门 Cambridge 课程中不含英语，选课列表里不应出现英语类科目
    const englishLike = [...alGate.asSubjects, ...alGate.a2Subjects].filter((k) =>
      /english|ielts/i.test(k),
    );
    if (englishLike.length > 0) {
      problems.push(`A-Level 选课列表中出现英语类科目：${englishLike.join(", ")}`);
    }
  }

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
    ["新加坡义工", "新加坡本地义工服务"],
    ["锁定说明", "锁定基础"],
    ["EALD", "第二语言或方言"],
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

  // 地区选择必须与 WACE 对位：三个下拉，切换地区后院校随之更换
  const alSelects = page.locator("aside select");
  const selectCount = await alSelects.count();
  if (selectCount !== 3) {
    problems.push(`A-Level 反查页应有地区/院校/专业三个下拉，实际 ${selectCount} 个`);
  } else {
    await alSelects.nth(0).selectOption("uk");
    await page.waitForTimeout(400);
    const uniValue = await alSelects.nth(1).inputValue();
    const ukIds = ["oxford", "cambridge", "imperial", "lse", "ucl", "kcl", "manchester", "edinburgh", "warwick"];
    if (!ukIds.includes(uniValue)) {
      problems.push(`切换到英国后院校未同步更新，当前为 ${uniValue}`);
    }
    await alSelects.nth(0).selectOption("sg");
    await page.waitForTimeout(400);
  }

  const alBody = await page.locator("article").innerText();
  for (const [name, needle] of [
    ["分年选课", "为这个目标怎么选课"],
    ["AS", "AS"],
    ["A2", "A2"],
    ["背景准备", "除了等级，还要准备什么"],
    ["新加坡义工", "新加坡本地义工服务"],
    ["雅思门槛", "英语门槛"],
    ["不占名额说明", "不占 AS / A2 选课名额"],
  ]) {
    if (!alBody.includes(needle)) {
      problems.push(`A-Level 反查页缺少「${name}」一节`);
    }
  }

  if (problems.length > 0) {
    throw new Error(`单目标方案存在问题：\n - ${problems.join("\n - ")}`);
  }

  console.log(
    `单目标升学方案验证通过：${report.cases.length} 个 WACE 目标与 ${report.alevelCases.length} 个 A-Level 目标的分年组合、先修满足与页面结构正常；${fieldReport.length} 个学科方向均含差异化的新加坡本地义工建议；${lockReport.length} 组场景确认 EALD 与数学两年锁定、南半球加修中文、北半球给出未开设提示，且先修优先于双数学；A-Level 雅思门槛独立于 AS / A2 选课名额。`,
  );
} finally {
  await browser.close();
}
