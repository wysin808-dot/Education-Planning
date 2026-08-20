/**
 * Admissions Almanac：Cambridge International A-Level 匹配逻辑。
 * 仅在官方明确发布 A-star、A、B 等级组合时进行分层；“passes only”、rank conversion 或个案审核
 * 统一返回 review，防止把非等值口径伪装成确定录取概率。
 */
import { ALEVEL_UNIVERSITY_RULES, type AlevelSubjectKey } from "@/data/alevelRules";
import { ALEVEL_GRADE_POINTS, type AlevelGrade } from "@/data/alevel";
import { UNIVERSITIES, type FieldKey, type Programme, type Region, type University } from "@/data/universities";

export type AlevelTier = "safe" | "target" | "reach" | "review";

export const ALEVEL_TIER_META: Record<AlevelTier, { zh: string; en: string; definitionZh: string; definitionEn: string; color: string }> = {
  safe: {
    zh: "稳妥", en: "Strong", color: "#4A6B4F",
    definitionZh: "已达到公开等级条件，并留有至少两个等级积分的缓冲；仍须满足先修、英语及额外选拔。",
    definitionEn: "The published grade profile is met with at least two grade points of headroom; prerequisites, English and selection requirements still apply.",
  },
  target: {
    zh: "匹配", en: "Aligned", color: "#B4884A",
    definitionZh: "预测等级刚好达到或略高于公开等级条件，属于正常竞争区间。",
    definitionEn: "The predicted grades meet or sit just above the published profile, placing the application in the normal competitive range.",
  },
  reach: {
    zh: "冲刺", en: "Reach", color: "#9C4A3C",
    definitionZh: "预测等级未达到公开等级条件，或关键先修科目缺失。",
    definitionEn: "The predicted grades do not meet the published profile, or a key prerequisite subject is absent.",
  },
  review: {
    zh: "顾问复核", en: "Counsellor review", color: "#6B6B6B",
    definitionZh: "院校采用 good passes、个案审核、课程级动态分数表或未公布等级门槛，不能自动给出录取层级。",
    definitionEn: "The institution uses good passes, case-by-case review, dynamic course tables or unpublished grade thresholds, so an automated admissions tier would be misleading.",
  },
};

export interface AlevelPrerequisiteCheck {
  satisfied: boolean;
  missing: AlevelSubjectKey[];
}

export interface AlevelForwardQuery {
  grades: Record<AlevelSubjectKey, AlevelGrade>;
  regions: Region[];
  fields: FieldKey[];
}

export interface AlevelMatchRow {
  university: University;
  programme: Programme;
  tier: AlevelTier;
  gradeProfile: string | null;
  gradeGap: number | null;
  prerequisite: AlevelPrerequisiteCheck;
  noteZh: string;
  noteEn: string;
  englishZh: string;
  englishEn: string;
  extras: string[];
}

function profilePoints(profile: string | null): number[] | null {
  if (!profile) return null;
  const normalized = profile.replace(/\s/g, "");
  if (!/^(A\*|A|B|C|D|E){3,4}$/.test(normalized)) return null;
  const grades = normalized.match(/A\*|A|B|C|D|E/g);
  if (!grades) return null;
  return grades.map((grade) => ALEVEL_GRADE_POINTS[grade as Exclude<AlevelGrade, "">]);
}

function selectedPoints(grades: Record<AlevelSubjectKey, AlevelGrade>) {
  return Object.values(grades)
    .filter((g): g is Exclude<AlevelGrade, ""> => g !== "")
    .map((g) => ALEVEL_GRADE_POINTS[g])
    .sort((a, b) => b - a);
}

export function getAlevelRule(universityId: string, field: FieldKey) {
  const universityRule = ALEVEL_UNIVERSITY_RULES[universityId];
  if (!universityRule) return null;
  return { universityRule, fieldRule: universityRule.fields[field] };
}

function tierFor(grades: Record<AlevelSubjectKey, AlevelGrade>, profile: string | null, prerequisite: AlevelPrerequisiteCheck): { tier: AlevelTier; gap: number | null } {
  const required = profilePoints(profile);
  if (!required) return { tier: "review", gap: null };
  const current = selectedPoints(grades);
  if (current.length < required.length || !prerequisite.satisfied) return { tier: "reach", gap: null };
  const comparable = current.slice(0, required.length);
  const meetsEach = required.every((point, index) => comparable[index] >= point);
  const gap = comparable.reduce((sum, point, index) => sum + point - required[index], 0);
  if (!meetsEach) return { tier: "reach", gap };
  return { tier: gap >= 2 ? "safe" : "target", gap };
}

export function alevelForwardMatch(query: AlevelForwardQuery): AlevelMatchRow[] {
  const selectedSubjects = (Object.entries(query.grades) as [AlevelSubjectKey, AlevelGrade][])
    .filter(([, grade]) => grade !== "")
    .map(([key]) => key);
  const rows: AlevelMatchRow[] = [];
  for (const university of UNIVERSITIES) {
    if (query.regions.length && !query.regions.includes(university.region)) continue;
    const universityRule = ALEVEL_UNIVERSITY_RULES[university.id];
    if (!universityRule) continue;
    for (const programme of university.programmes) {
      if (query.fields.length && !query.fields.includes(programme.field)) continue;
      const fieldRule = universityRule.fields[programme.field];
      const requiredSubjects = fieldRule?.requiredSubjects ?? [];
      const missing = requiredSubjects.filter((subject) => !selectedSubjects.includes(subject));
      const prerequisite = { satisfied: missing.length === 0, missing };
      const explicitProfile = fieldRule?.publishedGradeProfile ?? (universityRule.profileType === "published_grade" ? universityRule.generalProfile : null);
      const outcome = tierFor(query.grades, explicitProfile, prerequisite);
      rows.push({
        university,
        programme,
        tier: outcome.tier,
        gradeProfile: explicitProfile,
        gradeGap: outcome.gap,
        prerequisite,
        noteZh: fieldRule?.noteZh ?? "官方未公布可计算等级门槛，需顾问结合完整背景复核。",
        noteEn: fieldRule?.noteEn ?? "The university has not published a computable grade threshold. Counsellor review is required in light of the full application.",
        englishZh: universityRule.englishSummaryZh,
        englishEn: universityRule.englishSummaryEn,
        extras: fieldRule?.extras ?? [],
      });
    }
  }
  const rank: Record<AlevelTier, number> = { safe: 4, target: 3, reach: 2, review: 1 };
  return rows.sort((a, b) => rank[b.tier] - rank[a.tier] || (b.gradeGap ?? -99) - (a.gradeGap ?? -99));
}

export function alevelReverseLookup(universityId: string, programmeId: string) {
  const university = UNIVERSITIES.find((item) => item.id === universityId);
  const programme = university?.programmes.find((item) => item.id === programmeId);
  if (!university || !programme) return null;
  const rule = getAlevelRule(universityId, programme.field);
  if (!rule) return null;
  return {
    university,
    programme,
    gradeProfile: rule.fieldRule?.publishedGradeProfile ?? (rule.universityRule.profileType === "published_grade" ? rule.universityRule.generalProfile : null),
    profileType: rule.universityRule.profileType,
    requiredSubjects: rule.fieldRule?.requiredSubjects ?? [],
    recommendedSubjects: rule.fieldRule?.recommendedSubjects ?? [],
    noteZh: rule.fieldRule?.noteZh ?? "官方未公布可计算等级门槛，需顾问结合完整背景复核。",
    noteEn: rule.fieldRule?.noteEn ?? "The university has not published a computable grade threshold. Counsellor review is required in light of the full application.",
    englishZh: rule.universityRule.englishSummaryZh,
    englishEn: rule.universityRule.englishSummaryEn,
    deadlineZh: rule.universityRule.applicationSummaryZh,
    deadlineEn: rule.universityRule.applicationSummaryEn,
    extras: rule.fieldRule?.extras ?? [],
  };
}

export function alevelSubjectLabel(key: AlevelSubjectKey, lang: "zh" | "en") {
  const labels: Record<AlevelSubjectKey, { zh: string; en: string }> = {
    mathematics: { zh: "数学", en: "Mathematics" },
    furtherMathematics: { zh: "进阶数学", en: "Further Mathematics" },
    physics: { zh: "物理", en: "Physics" },
    chemistry: { zh: "化学", en: "Chemistry" },
    biology: { zh: "生物", en: "Biology" },
    computerScience: { zh: "计算机科学", en: "Computer Science" },
    economics: { zh: "经济学", en: "Economics" },
    business: { zh: "商科", en: "Business" },
    accounting: { zh: "会计", en: "Accounting" },
    geography: { zh: "地理", en: "Geography" },
  };
  return labels[key][lang];
}

export interface AlevelSubjectAdvice {
  subject: AlevelSubjectKey;
  requiredBy: number;
  recommendedBy: number;
  level: "required" | "recommended" | "optional";
  noteZh: string;
  noteEn: string;
}

/** 由同一份收藏目标清单反推 BCI 可开设的七门 A-Level 课程。 */
export function adviseAlevelSubjects(targets: { universityId: string; programmeId: string }[]): AlevelSubjectAdvice[] {
  const required = new Map<AlevelSubjectKey, number>();
  const recommended = new Map<AlevelSubjectKey, number>();
  for (const target of targets) {
    const result = alevelReverseLookup(target.universityId, target.programmeId);
    if (!result) continue;
    result.requiredSubjects.forEach((subject) => required.set(subject, (required.get(subject) ?? 0) + 1));
    result.recommendedSubjects.forEach((subject) => recommended.set(subject, (recommended.get(subject) ?? 0) + 1));
  }
  const all = new Set<AlevelSubjectKey>([...Array.from(required.keys()), ...Array.from(recommended.keys())]);
  return Array.from(all)
    .map((subject) => {
      const requiredBy = required.get(subject) ?? 0;
      const recommendedBy = recommended.get(subject) ?? 0;
      const level: AlevelSubjectAdvice["level"] = requiredBy > 0 ? "required" : recommendedBy > 0 ? "recommended" : "optional";
      return {
        subject,
        requiredBy,
        recommendedBy,
        level,
        noteZh: requiredBy > 0
          ? `被 ${requiredBy} 个收藏目标列为官方先修。`
          : `被 ${recommendedBy} 个收藏目标列为建议或学术匹配科目。`,
        noteEn: requiredBy > 0
          ? `Listed as a known prerequisite by ${requiredBy} saved target${requiredBy === 1 ? "" : "s"}.`
          : `Listed as a recommended or academically aligned subject by ${recommendedBy} saved target${recommendedBy === 1 ? "" : "s"}.`,
      };
    })
    .sort((a, b) => b.requiredBy - a.requiredBy || b.recommendedBy - a.recommendedBy);
}

/* ------------------------------------------------------------------ *
 * A-Level 选课方案生成器
 *
 * 规则来自 Cambridge International 的常规修读结构与 BCI 已确认的七门课程：
 *  1. AS（Year 12）通常开局四门，为 A2 保留一门可放弃的余量。
 *  2. A2（Year 13）保留三门作为 offer 计分主体（A*AA、AAA 等口径均按三门给出）。
 *  3. 必修科目优先入选，其次为被建议的科目，最后按学术通用性补位。
 *  4. Further Mathematics 不替代 Mathematics，只在 Mathematics 已入选后追加。
 * ------------------------------------------------------------------ */

/** AS（Year 12）建议开局的科目数 */
export const ALEVEL_AS_SIZE = 4;
/** A2（Year 13）保留并计入 offer 的科目数 */
export const ALEVEL_A2_SIZE = 3;

/** 无目标时的通用优先序：学术通用性由高到低 */
const ALEVEL_GENERAL_ORDER: AlevelSubjectKey[] = [
  "mathematics",
  "physics",
  "chemistry",
  "economics",
  "biology",
  "furtherMathematics",
  "computerScience",
  "business",
  "accounting",
  "geography",
];

export interface AlevelPlanSubject {
  subject: AlevelSubjectKey;
  requiredBy: number;
  recommendedBy: number;
  role: "required" | "recommended" | "filler";
  supports: string[];
}

export interface AlevelSubjectPlan {
  /** AS 年（Year 12）建议开局组合 */
  as: AlevelPlanSubject[];
  /** A2 年（Year 13）建议保留组合 */
  a2: AlevelPlanSubject[];
  /** A2 相对 AS 建议放弃的科目 */
  dropped: AlevelPlanSubject[];
  /** 必修科目超出名额时的冲突 */
  overflow: AlevelPlanSubject[];
  targetCount: number;
}

/**
 * 生成 AS / A2 两年的 A-Level 选课方案。
 * lang 仅用于目标名称的展示语言。
 */
export function buildAlevelPlan(
  targets: { universityId: string; programmeId: string }[],
  lang: "zh" | "en" = "zh",
): AlevelSubjectPlan {
  const required = new Map<AlevelSubjectKey, { count: number; supports: string[] }>();
  const recommended = new Map<AlevelSubjectKey, { count: number; supports: string[] }>();
  let targetCount = 0;

  for (const target of targets) {
    const result = alevelReverseLookup(target.universityId, target.programmeId);
    if (!result) continue;
    targetCount += 1;
    const label = `${result.university.abbr} · ${
      lang === "zh" ? result.programme.nameZh : result.programme.name
    }`;
    result.requiredSubjects.forEach((subject) => {
      const entry = required.get(subject) ?? { count: 0, supports: [] };
      entry.count += 1;
      entry.supports.push(label);
      required.set(subject, entry);
    });
    result.recommendedSubjects.forEach((subject) => {
      const entry = recommended.get(subject) ?? { count: 0, supports: [] };
      entry.count += 1;
      entry.supports.push(label);
      recommended.set(subject, entry);
    });
  }

  const build = (
    subject: AlevelSubjectKey,
    role: AlevelPlanSubject["role"],
  ): AlevelPlanSubject => ({
    subject,
    requiredBy: required.get(subject)?.count ?? 0,
    recommendedBy: recommended.get(subject)?.count ?? 0,
    role,
    supports:
      role === "required"
        ? (required.get(subject)?.supports ?? [])
        : (recommended.get(subject)?.supports ?? []),
  });

  const chosen: AlevelPlanSubject[] = [];
  const taken = new Set<AlevelSubjectKey>();

  const push = (subject: AlevelSubjectKey, role: AlevelPlanSubject["role"]) => {
    if (taken.has(subject)) return;
    // Further Mathematics 只在 Mathematics 已入选时才有意义
    if (subject === "furtherMathematics" && !taken.has("mathematics")) return;
    chosen.push(build(subject, role));
    taken.add(subject);
  };

  // 1. 必修科目按被要求次数排序
  const requiredSorted = Array.from(required.entries()).sort((a, b) => b[1].count - a[1].count);
  const overflow: AlevelPlanSubject[] = [];
  for (const [subject] of requiredSorted) {
    if (chosen.length >= ALEVEL_AS_SIZE) {
      overflow.push(build(subject, "required"));
      continue;
    }
    push(subject, "required");
  }

  // 2. 建议科目补位
  const recommendedSorted = Array.from(recommended.entries()).sort((a, b) => b[1].count - a[1].count);
  for (const [subject] of recommendedSorted) {
    if (chosen.length >= ALEVEL_AS_SIZE) break;
    push(subject, "recommended");
  }

  // 3. 仍有空位时按学术通用性补齐
  for (const subject of ALEVEL_GENERAL_ORDER) {
    if (chosen.length >= ALEVEL_AS_SIZE) break;
    push(subject, "filler");
  }
  // Further Mathematics 因依赖 Mathematics 可能被跳过，此处兜底补齐
  for (const subject of ALEVEL_GENERAL_ORDER) {
    if (chosen.length >= ALEVEL_AS_SIZE) break;
    if (taken.has(subject)) continue;
    chosen.push(build(subject, "filler"));
    taken.add(subject);
  }

  const as = chosen.slice(0, ALEVEL_AS_SIZE);
  const a2 = as.slice(0, ALEVEL_A2_SIZE);
  const dropped = as.slice(ALEVEL_A2_SIZE);

  return { as, a2, dropped, overflow, targetCount };
}

/** A-Level 方案中科目的入选说明 */
export function alevelPlanRoleLabel(role: AlevelPlanSubject["role"], lang: "zh" | "en") {
  const map: Record<AlevelPlanSubject["role"], [string, string]> = {
    required: ["目标先修", "Target prerequisite"],
    recommended: ["院校建议", "University recommended"],
    filler: ["学术通用", "Broadly accepted"],
  };
  return lang === "zh" ? map[role][0] : map[role][1];
}
