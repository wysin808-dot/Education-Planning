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
  "/wace/forward": { href: "/wace/forward", zh: "WACE 分数查院校", en: "WACE score to universities" },
  "/wace/reverse": { href: "/wace/reverse", zh: "WACE 院校查门槛", en: "WACE university to ATAR" },
  "/wace/subjects": { href: "/wace/subjects", zh: "WACE 选课规划", en: "WACE subject planning" },
  "/wace/table": { href: "/wace/table", zh: "WACE 门槛总表", en: "WACE threshold table" },
  "/alevel/forward": { href: "/alevel/forward", zh: "A-Level 预测成绩查院校", en: "A-Level grades to universities" },
  "/alevel/reverse": { href: "/alevel/reverse", zh: "A-Level 院校专业查条件", en: "A-Level programme requirements" },
  "/alevel/subjects": { href: "/alevel/subjects", zh: "A-Level 选课规划", en: "A-Level subject planning" },
  "/alevel/table": { href: "/alevel/table", zh: "A-Level 门槛速查", en: "A-Level threshold reference" },
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
