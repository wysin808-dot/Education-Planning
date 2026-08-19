import { readFile } from "node:fs/promises";

const root = "/home/ubuntu/brentvale-wace-planner";
const rulesSource = await readFile(`${root}/client/src/data/alevelRules.ts`, "utf8");
const appSource = await readFile(`${root}/client/src/App.tsx`, "utf8");
const subjectsSource = await readFile(`${root}/client/src/data/alevel.ts`, "utf8");
const start = rulesSource.indexOf("= {");
const end = rulesSource.lastIndexOf(" as const;");
if (start < 0 || end < 0) throw new Error("Cannot parse A-Level rules module.");
const rules = JSON.parse(rulesSource.slice(start + 2, end));
const expectedSubjects = new Set(["mathematics", "furtherMathematics", "physics", "chemistry", "biology", "economics", "business"]);
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
for (const route of ["/alevel", "/alevel/forward", "/alevel/reverse", "/alevel/subjects", "/alevel/table", "/alevel/shortlist"]) {
  if (!appSource.includes(`path="${route}"`)) failures.push(`Missing A-Level route ${route}.`);
}
if (failures.length) throw new Error(failures.join("\n"));
console.log("A-Level data integrity check passed: 31 universities, seven BCI subjects, bilingual rules and six routes.");
