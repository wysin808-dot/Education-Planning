/**
 * QS 世界大学排名 · 2027 版
 *
 * 版本口径：QS World University Rankings 2027，由 Quacquarelli Symonds 于 2026 年 6 月 18 日发布，
 * 对应本工具 2026 / 2027 入学周期的数据年份。排名逐校核对 QS 官方院校页（topuniversities.com）。
 *
 * 关于未列入：
 *  - Singapore Institute of Technology (SIT) 未进入 QS 世界排名；
 *  - Singapore University of Social Sciences (SUSS) 仅见于 QS 亚洲大学排名（=627），不属于世界排名。
 * 两者一律记为 null，页面显示「未列入 QS 世界排名」，绝不以亚洲排名或其他榜单代替，
 * 以免家长把区域排名误读为世界排名。
 *
 * display 保留 QS 页面的原始写法（如 "=8" 表示并列），rank 为用于排序的纯数字。
 */

export const QS_EDITION = {
  year: 2027,
  labelZh: "QS 世界大学排名 2027",
  labelEn: "QS World University Rankings 2027",
  publishedZh: "2026 年 6 月 18 日发布",
  publishedEn: "Published 18 June 2026",
  source: "https://www.topuniversities.com/world-university-rankings",
} as const;

export type QsEntry = {
  /** 用于排序与比较的世界排名数字；未列入世界排名为 null */
  rank: number | null;
  /** QS 官方页面上的原始显示写法，如 "=8"、"10" */
  display: string | null;
  /** 数据核对来源 */
  source: string;
};

export const qsRanks: Record<string, QsEntry> = {
  nus: { rank: 10, display: "10", source: "https://www.topuniversities.com/universities/national-university-singapore-nus" },
  ntu: { rank: 12, display: "12", source: "https://www.topuniversities.com/universities/nanyang-technological-university-singapore-ntu-singapore" },
  smu: { rank: 411, display: "=411", source: "https://www.topuniversities.com/universities/singapore-management-university" },
  sutd: { rank: 266, display: "266", source: "https://www.topuniversities.com/universities/singapore-university-technology-design" },
  sit: { rank: null, display: null, source: "https://www.topuniversities.com/universities/singapore-institute-technology" },
  suss: { rank: null, display: null, source: "https://www.topuniversities.com/universities/singapore-university-social-sciences" },
  hku: { rank: 11, display: "11", source: "https://www.topuniversities.com/universities/university-hong-kong" },
  cuhk: { rank: 18, display: "18", source: "https://www.topuniversities.com/world-university-rankings?countries=hk&region=Asia" },
  hkust: { rank: 33, display: "33", source: "https://www.topuniversities.com/universities/hong-kong-university-science-technology" },
  cityu: { rank: 52, display: "=52", source: "https://www.topuniversities.com/universities/city-university-hong-kong-cityuhk" },
  polyu: { rank: 50, display: "50", source: "https://www.topuniversities.com/universities/hong-kong-polytechnic-university" },
  hkbu: { rank: 216, display: "216", source: "https://www.topuniversities.com/universities/hong-kong-baptist-university" },
  eduhk: { rank: 406, display: "=406", source: "https://www.topuniversities.com/universities/education-university-hong-kong" },
  lingnan: { rank: 581, display: "=581", source: "https://www.topuniversities.com/universities/lingnan-university-hong-kong" },
  unimelb: { rank: 22, display: "=22", source: "https://www.topuniversities.com/universities/university-melbourne" },
  usyd: { rank: 28, display: "28", source: "https://www.topuniversities.com/universities/university-sydney" },
  anu: { rank: 29, display: "29", source: "https://www.topuniversities.com/universities/australian-national-university-anu" },
  unsw: { rank: 19, display: "19", source: "https://www.topuniversities.com/universities/university-new-south-wales-unsw-sydney" },
  uq: { rank: 40, display: "=40", source: "https://www.topuniversities.com/universities/university-queensland" },
  monash: { rank: 31, display: "31", source: "https://www.monash.edu/news/articles/monash-achieves-highest-ever-position-in-qs-world-university-rankings-2027" },
  uwa: { rank: 77, display: "=77", source: "https://www.topuniversities.com/universities/university-western-australia" },
  adelaide: { rank: 79, display: "79", source: "https://www.topuniversities.com/universities/adelaide-university" },
  oxford: { rank: 4, display: "4", source: "https://www.topuniversities.com/universities/university-oxford" },
  cambridge: { rank: 6, display: "6", source: "https://www.topuniversities.com/universities/university-cambridge" },
  imperial: { rank: 2, display: "=2", source: "https://www.topuniversities.com/universities/imperial-college-london" },
  ucl: { rank: 8, display: "=8", source: "https://www.topuniversities.com/universities/ucl" },
  lse: { rank: 62, display: "62", source: "https://www.topuniversities.com/universities/london-school-economics-political-science-lse" },
  kcl: { rank: 37, display: "37", source: "https://www.topuniversities.com/universities/kings-college-london" },
  edinburgh: { rank: 35, display: "35", source: "https://www.topuniversities.com/universities/university-edinburgh" },
  manchester: { rank: 40, display: "40", source: "https://www.manchester.ac.uk/about/rankings/" },
  warwick: { rank: 68, display: "=68", source: "https://www.topuniversities.com/universities/university-warwick" },
};

/** 取得某校的 QS 记录；未收录的院校返回 null。 */
export function qsFor(universityId: string): QsEntry | null {
  return qsRanks[universityId] ?? null;
}

/**
 * 排序用的键：未列入世界排名的院校统一排到最后，
 * 而不是当作第 0 名顶到最前面。
 */
export function qsSortKey(universityId: string): number {
  const entry = qsRanks[universityId];
  return entry?.rank ?? Number.MAX_SAFE_INTEGER;
}
