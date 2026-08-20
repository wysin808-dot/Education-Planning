/**
 * 英文界面中文残留自检。
 *
 * 检查两类问题：
 * 1. 数据层：每个中文说明字段是否都有对应的 En 版本，且 En 版本不含中文字符
 * 2. 页面层：渲染中文字段时是否都做了 lang 判断（而非直接输出中文字段）
 */
import fs from "fs";

const DATA = "client/src/data/universities.ts";
const src = fs.readFileSync(DATA, "utf8");
const CJK = /[\u4e00-\u9fa5]/;
const issues = [];

// ---- 1. 数据层：中英字段成对出现 ----
const PAIRS = [
  ["minAtarNote", 31],
  ["english", 31],
  ["waceNotes", 31],
  ["applicationWindow", 31],
  ["dataYear", 31],
  ["atarNote", 651],
];

for (const [field, expected] of PAIRS) {
  // 接口定义中的 `field: string;` 声明行不计入数据条目
  const zh = (src.match(new RegExp(`^\\s*${field}:(?!\\s*(string|number))`, "gm")) ?? []).length;
  const en = (src.match(new RegExp(`^\\s*${field}En:(?!\\s*(string|number))`, "gm")) ?? []).length;
  console.log(`  · ${field}: 中文 ${zh} / 英文 ${en}`);
  if (zh !== expected) issues.push(`${field} 中文字段 ${zh} 条，预期 ${expected} 条`);
  if (en !== zh) issues.push(`${field} 英文缺失 ${zh - en} 条`);
}

// note / advice 属于科目与方向元数据
for (const field of ["note", "advice"]) {
  const zh = (src.match(new RegExp(`^\\s*${field}:(?!\\s*(string|number))`, "gm")) ?? []).length;
  const en = (src.match(new RegExp(`^\\s*${field}En:(?!\\s*(string|number))`, "gm")) ?? []).length;
  console.log(`  · ${field}: 中文 ${zh} / 英文 ${en}`);
  if (en !== zh) issues.push(`${field} 英文缺失 ${zh - en} 条`);
}

// ---- 2. 英文字段内不得残留中文 ----
const enValues = [...src.matchAll(/^\s*\w+En:\s*\n?\s*"((?:[^"\\]|\\.)*)"/gm)].map((m) => m[1]);
const dirty = enValues.filter((v) => CJK.test(v));
console.log(`  · 英文字段总数：${enValues.length}，含中文字符：${dirty.length}`);
if (dirty.length) {
  issues.push(`${dirty.length} 个英文字段仍含中文字符`);
  dirty.slice(0, 5).forEach((d) => issues.push(`    残留：${d.slice(0, 60)}`));
}

// ---- 3. 页面层：中文字段引用必须带 lang 判断 ----
const pages = fs.readdirSync("client/src/pages").filter((f) => f.endsWith(".tsx"));
const RAW_FIELDS = [
  "minAtarNote",
  "waceNotes",
  "atarNote",
  "applicationWindow",
  "dataYear",
  "\\.english",
  "\\.advice",
  "\\.note",
  "\\.scaling",
  "\\.confidence",
];
for (const p of pages) {
  const text = fs.readFileSync(`client/src/pages/${p}`, "utf8");
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    for (const f of RAW_FIELDS) {
      const re = new RegExp(`${f}(?!En)\\b`);
      if (!re.test(line)) continue;
      // 条件判断与存在性检查本身不输出文本，无需 lang 守卫
      if (/&&\s*\(\s*$|===\s*"|!==\s*"|\?\s*$|\.length|useMemo|\.some\(|\.filter\(/.test(line))
        continue;
      // 该行或相邻两行需出现 lang 判断或英文标签函数
      const ctx = lines.slice(Math.max(0, i - 2), i + 3).join(" ");
      const guarded =
        /lang === "zh"|lang,\s*\)|Label\(|LEVEL_EN|adviseSubjectsBy|reverseLookup\(/.test(ctx);
      if (!guarded) {
        issues.push(`${p}:${i + 1} 直接渲染中文字段：${line.trim().slice(0, 60)}`);
      }
    }
  });
}

console.log("");
if (issues.length === 0) {
  console.log("英文界面自检：未发现中文残留问题。");
} else {
  console.log(`英文界面自检发现 ${issues.length} 项：`);
  issues.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
}
