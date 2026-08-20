/**
 * 选课方案引擎自检：在浏览器中加载页面并调用真实逻辑，
 * 验证二选一先修不重复计数、Year 11/12 组合规模与冲突诊断。
 */
import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH ?? "/usr/bin/chromium",
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const problems = [];

try {
  await page.goto("http://localhost:3000/wace/subjects", { waitUntil: "networkidle" });

  const report = await page.evaluate(async () => {
    const mod = await import("/src/lib/matching.ts");
    const data = await import("/src/data/universities.ts");

    // 找一个包含二选一先修组的专业
    let orTarget = null;
    for (const u of data.UNIVERSITIES) {
      for (const p of u.programmes) {
        if (p.prerequisites.some((g) => g.length > 1)) {
          orTarget = { universityId: u.id, programmeId: p.id, groups: p.prerequisites };
          break;
        }
      }
      if (orTarget) break;
    }

    const single = orTarget
      ? mod.buildSubjectPlan([{ universityId: orTarget.universityId, programmeId: orTarget.programmeId }], "south", "zh")
      : null;

    // 多目标场景
    const many = data.UNIVERSITIES.slice(0, 5).flatMap((u) =>
      u.programmes.slice(0, 2).map((p) => ({ universityId: u.id, programmeId: p.id })),
    );
    const multi = mod.buildSubjectPlan(many, "south", "zh");

    // 空清单场景
    const empty = mod.buildSubjectPlan([], "south", "zh");

    // 北半球序列：专业数学未开设，应产生冲突或不出现在方案中
    const northPlan = mod.buildSubjectPlan(many, "north", "zh");
    const northOffered = data.SUBJECTS.filter((s) => s.north).map((s) => s.key);

    return {
      orGroupSize: orTarget ? orTarget.groups.filter((g) => g.length > 1).length : 0,
      singleY11: single ? single.year11.map((s) => s.subject) : [],
      singleCounts: single ? single.year11.map((s) => s.requiredBy) : [],
      multiY11: multi.year11.map((s) => s.subject),
      multiY12: multi.year12.map((s) => s.subject),
      multiDropped: multi.dropped.map((s) => s.subject),
      multiTargets: multi.targetCount,
      emptyY11: empty.year11.map((s) => s.subject),
      northY11: northPlan.year11.map((s) => s.subject),
      northOffered,
      y11Size: mod.YEAR11_SIZE,
      y12Size: mod.YEAR12_SIZE,
      roles: multi.year11.map((s) => s.role),
    };
  });

  // 1. Year 11 恰好为 5 门，Year 12 恰好为 4 门
  if (report.multiY11.length !== report.y11Size) {
    problems.push(`Year 11 组合应为 ${report.y11Size} 门，实际 ${report.multiY11.length}`);
  }
  if (report.multiY12.length !== report.y12Size) {
    problems.push(`Year 12 组合应为 ${report.y12Size} 门，实际 ${report.multiY12.length}`);
  }

  // 2. 组合内不得重复
  if (new Set(report.multiY11).size !== report.multiY11.length) {
    problems.push(`Year 11 组合出现重复科目：${report.multiY11.join(", ")}`);
  }

  // 3. Year 12 必须是 Year 11 的子集
  if (!report.multiY12.every((s) => report.multiY11.includes(s))) {
    problems.push("Year 12 组合包含了 Year 11 未修读的科目");
  }

  // 4. 二选一先修：单目标时任一科目的 requiredBy 不得超过目标数 1
  if (report.orGroupSize > 0 && report.singleCounts.some((c) => c > 1)) {
    problems.push(`单目标场景出现重复计数：${JSON.stringify(report.singleCounts)}`);
  }

  // 5. 英语线始终占据一个位置
  if (!report.multiY11.includes("english") && !report.multiY11.includes("eald")) {
    problems.push("方案缺少毕业必需的英语线科目");
  }
  if (report.roles[0] !== "english") {
    problems.push("英语线未排在方案首位");
  }

  // 6. 空清单也应给出一套完整的默认组合
  if (report.emptyY11.length !== report.y11Size) {
    problems.push(`空清单时未生成完整组合，实际 ${report.emptyY11.length} 门`);
  }

  // 7. 北半球序列不得推荐该序列未开设的科目
  const illegal = report.northY11.filter((s) => !report.northOffered.includes(s));
  if (illegal.length > 0) {
    problems.push(`北半球方案包含未开设科目：${illegal.join(", ")}`);
  }

  // ---------- A-Level 方案 ----------
  await page.goto("http://localhost:3000/alevel/subjects", { waitUntil: "networkidle" });

  const alevel = await page.evaluate(async () => {
    const mod = await import("/src/lib/alevelMatching.ts");
    const data = await import("/src/data/universities.ts");

    const many = data.UNIVERSITIES.slice(0, 6).flatMap((u) =>
      u.programmes.slice(0, 2).map((p) => ({ universityId: u.id, programmeId: p.id })),
    );
    const multi = mod.buildAlevelPlan(many, "zh");
    const empty = mod.buildAlevelPlan([], "zh");

    return {
      asSize: mod.ALEVEL_AS_SIZE,
      a2Size: mod.ALEVEL_A2_SIZE,
      multiAs: multi.as.map((s) => s.subject),
      multiA2: multi.a2.map((s) => s.subject),
      multiDropped: multi.dropped.map((s) => s.subject),
      emptyAs: empty.as.map((s) => s.subject),
      overflow: multi.overflow.map((s) => s.subject),
    };
  });

  if (alevel.multiAs.length !== alevel.asSize) {
    problems.push(`A-Level AS 组合应为 ${alevel.asSize} 门，实际 ${alevel.multiAs.length}`);
  }
  if (alevel.multiA2.length !== alevel.a2Size) {
    problems.push(`A-Level A2 组合应为 ${alevel.a2Size} 门，实际 ${alevel.multiA2.length}`);
  }
  if (new Set(alevel.multiAs).size !== alevel.multiAs.length) {
    problems.push(`A-Level AS 组合出现重复科目：${alevel.multiAs.join(", ")}`);
  }
  if (!alevel.multiA2.every((s) => alevel.multiAs.includes(s))) {
    problems.push("A-Level A2 组合包含 AS 年未修读的科目");
  }
  if (alevel.emptyAs.length !== alevel.asSize) {
    problems.push(`A-Level 空清单未生成完整组合，实际 ${alevel.emptyAs.length} 门`);
  }
  // 进阶数学不得在没有数学的情况下入选
  for (const [name, set] of [
    ["AS", alevel.multiAs],
    ["空清单", alevel.emptyAs],
  ]) {
    if (set.includes("furtherMathematics") && !set.includes("mathematics")) {
      problems.push(`${name} 组合中进阶数学缺少数学配套`);
    }
  }
  // 冲突科目不得同时出现在已选组合中
  const dup = alevel.overflow.filter((s) => alevel.multiAs.includes(s));
  if (dup.length > 0) {
    problems.push(`A-Level 冲突科目与已选组合重复：${dup.join(", ")}`);
  }

  if (problems.length > 0) {
    throw new Error(`选课方案引擎存在问题：\n - ${problems.join("\n - ")}`);
  }

  console.log(
    `选课方案引擎验证通过：WACE Year 11 ${report.multiY11.length} 门 / Year 12 ${report.multiY12.length} 门，A-Level AS ${alevel.multiAs.length} 门 / A2 ${alevel.multiA2.length} 门；二选一不重复计数、英语线固定、序列限制与进阶数学依赖均生效。`,
  );
} finally {
  await browser.close();
}
