import { readFile } from "node:fs/promises";

import { fileURLToPath } from "node:url";
import path from "node:path";

/** 项目根目录：由脚本自身位置推导，避免绑定到某台机器的绝对路径 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rulesSource = await readFile(`${root}/client/src/data/alevelRules.ts`, "utf8");
const appSource = await readFile(`${root}/client/src/App.tsx`, "utf8");
const subjectsSource = await readFile(`${root}/client/src/data/alevel.ts`, "utf8");
const start = rulesSource.indexOf("= {");
const end = rulesSource.lastIndexOf(" as const;");
if (start < 0 || end < 0) throw new Error("Cannot parse A-Level rules module.");
const rules = JSON.parse(rulesSource.slice(start + 2, end));
// BCI 官网课程页公布的可选课程（2026-08-20 核对）。
// English Language 虽为官网核心科目，但按招生总监确认改以雅思门槛呈现，不占选课名额，故不列入。
const expectedSubjects = new Set([
  "mathematics",
  "furtherMathematics",
  "physics",
  "chemistry",
  "biology",
  "computerScience",
  "economics",
  "business",
  "accounting",
  "geography",
]);
const chinese = /[\u3400-\u9fff]/;
const failures = [];

if (Object.keys(rules).length !== 31) failures.push(`Expected 31 university rules; found ${Object.keys(rules).length}.`);
for (const [university, rule] of Object.entries(rules)) {
  for (const field of Object.values(rule.fields)) {
    for (const subject of [...field.requiredSubjects, ...field.recommendedSubjects]) {
      if (!expectedSubjects.has(subject)) failures.push(`${university} references unsupported BCI subject ${subject}.`);
    }
    if (!field.noteEn || chinese.test(field.noteEn)) failures.push(`${university} has missing or non-English field note.`);
  }
  for (const key of ["generalProfileEn", "englishSummaryEn", "applicationSummaryEn"]) {
    if (!rule[key] || chinese.test(rule[key])) failures.push(`${university} has missing or non-English ${key}.`);
  }
}
for (const subject of expectedSubjects) if (!subjectsSource.includes(`key: "${subject}"`)) failures.push(`A-Level subject module is missing ${subject}.`);
// 英语不得作为可选课程出现在选课体系中（一律按雅思门槛处理）
for (const banned of ["englishLanguage", "english"]) {
  if (subjectsSource.includes(`key: "${banned}"`)) failures.push(`English must be handled as an IELTS gate, not a selectable subject (${banned}).`);
}
for (const route of ["/alevel", "/alevel/forward", "/alevel/reverse", "/alevel/subjects", "/alevel/table", "/alevel/shortlist"]) {
  if (!appSource.includes(`path="${route}"`)) failures.push(`Missing A-Level route ${route}.`);
}
if (failures.length) throw new Error(failures.join("\n"));
console.log(`A-Level data integrity check passed: 31 universities, ${expectedSubjects.size} BCI subjects, English as IELTS gate, bilingual rules and six routes.`);
