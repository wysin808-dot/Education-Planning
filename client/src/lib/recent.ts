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

export const RECENT_TOOLS: Record<string, RecentTool> = {
  "/forward": { href: "/forward", zh: "分数查院校", en: "Score to universities" },
  "/reverse": { href: "/reverse", zh: "院校查门槛", en: "University to ATAR" },
  "/subjects": { href: "/subjects", zh: "选课规划", en: "Subject planning" },
  "/table": { href: "/table", zh: "门槛总表", en: "Threshold table" },
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
