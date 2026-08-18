/**
 * 自检脚本：验证数据完整性与双向查询一致性。
 * 运行方式：node scripts/selfcheck.mjs
 * 由于数据源为 TypeScript，此脚本通过正则做静态检查，避免引入编译依赖。
 */
import { readFileSync } from "node:fs";

const dataSrc = readFileSync(new URL("../client/src/data/universities.ts", import.meta.url), "utf8");
const logicSrc = readFileSync(new URL("../client/src/lib/matching.ts", import.meta.url), "utf8");

const issues = [];
const notes = [];

/**
 * 仅提取 UNIVERSITIES 数组部分，避免把 REGIONS / SUBJECTS / FIELDS
 * 等同样含有 id 与 key 字段的常量误判为院校条目。
 */
const uniSectionStart = dataSrc.indexOf("export const UNIVERSITIES");
if (uniSectionStart === -1) issues.push("未找到 UNIVERSITIES 数据数组");
const uniSrc = uniSectionStart === -1 ? "" : dataSrc.slice(uniSectionStart);
const metaSrc = uniSectionStart === -1 ? dataSrc : dataSrc.slice(0, uniSectionStart);

/* 1. 院校数量与地区分布 */
const uniIds = [...uniSrc.matchAll(/^\s{4}id: "([a-z0-9-]+)",$/gm)].map((m) => m[1]);
const regionTags = [...uniSrc.matchAll(/^\s{4}region: "(sg|hk|au|uk)",$/gm)].map((m) => m[1]);
notes.push(`院校条目：${uniIds.length}`);
const regionCount = regionTags.reduce((acc, r) => ({ ...acc, [r]: (acc[r] ?? 0) + 1 }), {});
notes.push(`地区分布：${JSON.stringify(regionCount)}`);

const EXPECTED = { sg: 6, hk: 8, au: 8, uk: 9 };
for (const [k, v] of Object.entries(EXPECTED)) {
  if (regionCount[k] !== v) issues.push(`地区 ${k} 院校数为 ${regionCount[k]}，预期 ${v}`);
}

/* 2. 院校 id 唯一性 */
const dupUni = uniIds.filter((v, i) => uniIds.indexOf(v) !== i);
if (dupUni.length > 0) issues.push(`院校 id 重复：${[...new Set(dupUni)].join(", ")}`);

/* 3. 专业 id 唯一性 */
const progIds = [...uniSrc.matchAll(/^\s{8}id: "([a-z0-9-]+)",$/gm)].map((m) => m[1]);
notes.push(`专业条目：${progIds.length}`);
const dupProg = progIds.filter((v, i) => progIds.indexOf(v) !== i);
if (dupProg.length > 0) issues.push(`专业 id 重复：${[...new Set(dupProg)].join(", ")}`);

/* 4. ATAR 取值范围校验：必须为 null 或 0-99.95 */
const atarValues = [...uniSrc.matchAll(/^\s{8}atar: (null|[\d.]+),$/gm)].map((m) => m[1]);
for (const v of atarValues) {
  if (v === "null") continue;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0 || n > 99.95) issues.push(`ATAR 数值越界：${v}`);
}
notes.push(`专业 ATAR 字段：${atarValues.length}（含 null ${atarValues.filter((v) => v === "null").length} 条）`);

const minAtarValues = [...uniSrc.matchAll(/^\s{4}minAtar: (null|[\d.]+),$/gm)].map((m) => m[1]);
for (const v of minAtarValues) {
  if (v === "null") continue;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0 || n > 99.95) issues.push(`全校 minAtar 越界：${v}`);
}

/* 5. 每所院校必须至少有一个专业条目 */
const uniBlocks = uniSrc.split(/\n  \{\n    id: "/).slice(1);
uniBlocks.forEach((block) => {
  const id = block.slice(0, block.indexOf('"'));
  if (!/programmes: \[\s*\n\s*\{/.test(block)) issues.push(`院校 ${id} 缺少专业条目`);
  if (!/sources: \[\s*\n?\s*"https:\/\//.test(block)) issues.push(`院校 ${id} 缺少官方来源链接`);
  if (!/dataYear: "/.test(block)) issues.push(`院校 ${id} 缺少数据年份`);
  // english 字段可能因过长而换行书写，需同时匹配 `english:` 后换行的情形
  if (!/english:\s*\n?\s*"/.test(block)) issues.push(`院校 ${id} 缺少英语要求`);
});
notes.push(`逐校字段完整性检查：${uniBlocks.length} 所`);

/* 6. 来源链接必须为 https 官方域名 */
const sourceUrls = [...dataSrc.matchAll(/"(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
const httpOnly = sourceUrls.filter((u) => u.startsWith("http://"));
if (httpOnly.length > 0) notes.push(`提示：${httpOnly.length} 条来源为 http（非 https）`);
notes.push(`来源链接总数：${sourceUrls.length}`);

/* 7. 先修科目引用的 SubjectKey 必须已定义 */
// SUBJECTS 与 FIELDS 都使用 key 字段，需按区段分别提取
const subjectsStart = metaSrc.indexOf("export const SUBJECTS");
const fieldsStart = metaSrc.indexOf("export const FIELDS");
const subjectsSrc = metaSrc.slice(subjectsStart, fieldsStart > subjectsStart ? fieldsStart : undefined);
const subjectKeys = [...subjectsSrc.matchAll(/^\s{4}key: "([a-zA-Z]+)",$/gm)].map((m) => m[1]);
notes.push(`已定义 WACE 科目：${subjectKeys.length}`);
const referenced = new Set();
for (const m of uniSrc.matchAll(/prerequisites: \[(.*?)\],\n/gs)) {
  for (const k of m[1].matchAll(/"([a-zA-Z]+)"/g)) referenced.add(k[1]);
}
const undefinedRefs = [...referenced].filter((k) => !subjectKeys.includes(k));
if (undefinedRefs.length > 0) issues.push(`先修科目引用了未定义的科目键：${undefinedRefs.join(", ")}`);
notes.push(`被引用的科目键：${referenced.size}`);

/* 8. 分层逻辑：TARGET_BAND 与界面说明文字必须一致（均为 5 分） */
const band = logicSrc.match(/const TARGET_BAND = (\d+);/);
if (!band) {
  issues.push("未找到 TARGET_BAND 定义");
} else {
  const n = Number(band[1]);
  notes.push(`匹配区间带宽 TARGET_BAND = ${n}`);
  const safeDef = logicSrc.match(/definition: "预计 ATAR 高出官方最低门槛 (\d+) 分及以上/);
  const targetDef = logicSrc.match(/高出幅度在 (\d+) 分以内/);
  if (!safeDef || Number(safeDef[1]) !== n) issues.push("稳妥档说明文字与 TARGET_BAND 不一致");
  if (!targetDef || Number(targetDef[1]) !== n) issues.push("匹配档说明文字与 TARGET_BAND 不一致");
}

/* 9. 反向查询回退逻辑必须存在（专业无门槛时沿用全校门槛） */
if (!/prog\.atar \?\? uni\.minAtar/.test(logicSrc)) {
  issues.push("reverseLookup 缺少专业门槛回退到全校门槛的逻辑");
}
if (!/prog\.atar \?\? uni\.minAtar/.test(logicSrc.split("forwardMatch")[1] ?? "")) {
  notes.push("提示：请确认 forwardMatch 同样使用了门槛回退逻辑");
}

/* 10. 数据口径措辞检查：不得出现录取保证类表述 */
// 仅拦截作出承诺的表述；「不保证录取」属于必要的免责说明，须排除
const banned = ["一定能录取", "百分百录取", "100% 录取", "确保录取", "包录取"];
for (const w of banned) {
  if (dataSrc.includes(w)) issues.push(`数据文件含有不当承诺表述：${w}`);
}
// 反向检查：必须存在免责性质的口径说明
if (!/不保证录取/.test(dataSrc)) {
  notes.push("提示：数据文件未包含「不保证录取」类免责说明，建议补充");
}

console.log("=== Brentvale WACE 规划器 · 数据自检 ===\n");
notes.forEach((n) => console.log(`  · ${n}`));
console.log("");
if (issues.length === 0) {
  console.log("检查结果：未发现数据一致性问题。");
} else {
  console.log(`检查结果：发现 ${issues.length} 处问题`);
  issues.forEach((i) => console.log(`  ! ${i}`));
  process.exitCode = 1;
}
