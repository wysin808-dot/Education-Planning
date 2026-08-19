/**
 * 本轮新增功能自检：手机端已选条件摘要、收藏清单、单页 PDF 导出。
 * 只做静态接线校验，覆盖容易漏改的接入点与双语覆盖。
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(resolve(root, p), "utf8");

const issues = [];
const check = (cond, msg) => {
  if (!cond) issues.push(msg);
};

const forward = read("client/src/pages/Forward.tsx");
const reverse = read("client/src/pages/Reverse.tsx");
const table = read("client/src/pages/TableView.tsx");
const subjects = read("client/src/pages/Subjects.tsx");
const shortlist = read("client/src/pages/Shortlist.tsx");
const ctx = read("client/src/contexts/ShortlistContext.tsx");
const btn = read("client/src/components/ShortlistButton.tsx");
const printHeader = read("client/src/components/PrintHeader.tsx");
const brand = read("client/src/components/Brand.tsx");
const app = read("client/src/App.tsx");
const css = read("client/src/index.css");

// 1. 已选条件摘要
check(forward.includes("summaryChips"), "Forward 缺少已选条件摘要 summaryChips");
check(
  /!filtersOpen &&[\s\S]{0,400}md:hidden/.test(forward),
  "已选条件摘要未限定为折叠状态且仅手机端显示",
);
check(
  forward.includes('t("未填写", "not set")') || forward.includes('"not set"'),
  "摘要未处理 ATAR 未填写状态",
);

// 2. 收藏功能
check(ctx.includes("bci-wace-shortlist"), "收藏 Context 缺少 localStorage 键名");
check(ctx.includes("try {") && ctx.includes("catch"), "收藏 Context 未对 localStorage 做容错");
check(
  ctx.includes("UNIVERSITIES.find") && ctx.includes("programmes.find"),
  "收藏 Context 未回数据层解析，可能导致清单过期",
);
check(app.includes("ShortlistProvider"), "App 未挂载 ShortlistProvider");
check(app.includes('path="/shortlist"'), "App 未注册 /shortlist 路由");
check(brand.includes('href: "/shortlist"'), "导航缺少目标清单入口");
check(brand.includes("count > 0"), "导航缺少收藏数量角标");
for (const [name, src] of [
  ["Forward", forward],
  ["Reverse", reverse],
  ["TableView", table],
]) {
  check(src.includes("ShortlistButton"), `${name} 未接入收藏按钮`);
}
check(btn.includes("aria-pressed"), "收藏按钮缺少 aria-pressed 无障碍状态");
check(btn.includes('t("已收藏", "Saved")'), "收藏按钮文案缺少英文版");

// 3. 单页 PDF 导出
check(css.includes("size: A4 portrait"), "打印样式缺少 A4 纵向设置");
check(css.includes("break-inside: avoid"), "打印样式未防止条目跨页断裂");
check(css.includes(".print-header"), "缺少打印页眉样式");
check(printHeader.includes("BRENTVALE COLLEGE INTERNATIONAL"), "打印页眉缺少校名");
check(printHeader.includes("toLocaleDateString"), "打印页眉缺少导出日期");
for (const [name, src] of [
  ["Forward", forward],
  ["Shortlist", shortlist],
]) {
  check(src.includes("PrintHeader"), `${name} 未接入打印页眉`);
  check(src.includes("window.print()"), `${name} 缺少导出 PDF 触发`);
}
check(
  forward.includes("print-hide-mobile") && forward.includes("print-show-table"),
  "Forward 打印时未让手机卡片让位给表格",
);
check(
  table.includes("print-hide-mobile") && table.includes("print-show-table"),
  "TableView 打印时未让手机卡片让位给表格",
);

// 4. 去重（方案 A）：目标清单必须只有一个来源
check(
  !/useState<Target\[\]>/.test(subjects) && !/interface Target/.test(subjects),
  "选课页仍自维护一份目标清单状态，与目标清单页重复",
);
check(
  subjects.includes("useShortlist") && subjects.includes("resolved: shortlist"),
  "选课页未从收藏清单读取目标",
);
check(
  !subjects.includes("addTarget") && !subjects.includes("removeTarget"),
  "选课页仍保留目标增删控件，应统一到目标清单页",
);
check(
  subjects.includes('href="/shortlist"') || subjects.includes('href="/forward"'),
  "选课页缺少指向清单页或查询页的衔接入口",
);
check(shortlist.includes('href="/subjects"'), "清单页缺少指向选课规划页的衔接入口");
check(
  !brand.includes('t("开始规划"'),
  "页头仍保留与导航重复的「开始规划」按钮",
);

// 4. 双语覆盖：新增文件不得出现无 t() 包裹的裸中文 JSX 文本
for (const [name, src] of [
  ["Shortlist.tsx", shortlist],
  ["ShortlistButton.tsx", btn],
  ["PrintHeader.tsx", printHeader],
]) {
  const lines = src.split("\n");
  lines.forEach((line, i) => {
    // 跳过注释与双语数据对象
    if (/^\s*(\/\/|\/\*|\*)/.test(line)) return;
    if (/lang === "zh"/.test(line) || /t\(/.test(line) || /LEVEL_EN/.test(line)) return;
    if (/advice\.level === "/.test(line)) return; // 等级键名比较，非展示文本
    if (/>\s*[\u4e00-\u9fa5]/.test(line)) {
      issues.push(`${name}:${i + 1} 存在未双语化的中文文本：${line.trim().slice(0, 50)}`);
    }
  });
}

if (issues.length === 0) {
  console.log("功能自检：摘要、收藏与 PDF 导出的接线均正常。");
} else {
  console.log(`功能自检发现 ${issues.length} 个问题：`);
  issues.forEach((m, i) => console.log(`  ${i + 1}. ${m}`));
  process.exitCode = 1;
}
