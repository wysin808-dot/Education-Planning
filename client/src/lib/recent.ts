/**
 * Admissions Almanac：记录最近使用的查询模块，帮助家长回到上次的工作流。
 * 仅保存模块路径，不保存 ATAR、科目或任何学生个人输入；数据仅驻留当前浏览器。
 */
export type RecentTool = {
  href: string;
  zh: string;
  en: string;
};

const STORAGE_KEY = "brentvale-wace-recent-tool";

/**
 * 名称与页头导航保持同一套说法（有成绩规划 / 由目标规划 / 选课规划 / 31 校速查），
 * 仅以体系前缀区分，避免同一功能在站内出现两种叫法。
 */
export const RECENT_TOOLS: Record<string, RecentTool> = {
  "/wace/forward": { href: "/wace/forward", zh: "WACE 有成绩规划", en: "WACE · plan from grades" },
  "/wace/reverse": { href: "/wace/reverse", zh: "WACE 由目标规划", en: "WACE · plan from a target" },
  "/wace/subjects": { href: "/wace/subjects", zh: "WACE 选课规划", en: "WACE subject planning" },
  "/wace/table": { href: "/wace/table", zh: "WACE 31 校速查", en: "WACE 31-university table" },
  "/alevel/forward": { href: "/alevel/forward", zh: "A-Level 有成绩规划", en: "A-Level · plan from grades" },
  "/alevel/reverse": { href: "/alevel/reverse", zh: "A-Level 由目标规划", en: "A-Level · plan from a target" },
  "/alevel/subjects": { href: "/alevel/subjects", zh: "A-Level 选课规划", en: "A-Level subject planning" },
  "/alevel/table": { href: "/alevel/table", zh: "A-Level 31 校速查", en: "A-Level 31-university table" },
};

export function saveRecentTool(path: string) {
  if (typeof window === "undefined" || !RECENT_TOOLS[path]) return;
  window.localStorage.setItem(STORAGE_KEY, path);
}

export function getRecentTool(): RecentTool | null {
  if (typeof window === "undefined") return null;
  const path = window.localStorage.getItem(STORAGE_KEY);
  return path ? (RECENT_TOOLS[path] ?? null) : null;
}
