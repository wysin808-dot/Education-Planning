/**
 * 设计风格提醒（Admissions Almanac 招生年鉴）
 * 本文件为纯逻辑层。所有分层标签定义必须与界面展示的说明文字一致，
 * 且不得对「官方未公布门槛」的专业给出确定性结论。
 */

import {
  FIELDS,
  Programme,
  SUBJECTS,
  SubjectKey,
  UNIVERSITIES,
  University,
  type FieldKey,
  type Region,
} from "@/data/universities";

/** 机会分层：与界面标签定义严格对应 */
export type Tier = "reach" | "target" | "safe" | "unknown";

export const TIER_META: Record<
  Tier,
  { label: string; short: string; definition: string; definitionEn: string; color: string }
> = {
  safe: {
    label: "稳妥",
    short: "Safe",
    definition: "预计 ATAR 高出官方最低门槛 5 分及以上，在满足先修科目的前提下把握较大。",
    definitionEn:
      "The projected ATAR sits at least 5 points above the official minimum. With prerequisites met, the prospects are strong.",
    color: "#4A6B4F",
  },
  target: {
    label: "匹配",
    short: "Target",
    definition: "预计 ATAR 达到官方最低门槛，且高出幅度在 5 分以内，属于正常竞争区间。",
    definitionEn:
      "The projected ATAR meets the official minimum but by less than 5 points, placing it in the normal competitive range.",
    color: "#B4884A",
  },
  reach: {
    label: "冲刺",
    short: "Reach",
    definition: "预计 ATAR 低于官方最低门槛，需要提分、更换专业或考虑其他入学路径。",
    definitionEn:
      "The projected ATAR falls below the official minimum. It calls for score improvement, a different programme, or an alternative pathway.",
    color: "#9C4A3C",
  },
  unknown: {
    label: "待评估",
    short: "Review",
    definition: "该专业官方未公布 ATAR 门槛，采用综合评估或个案审核，需由顾问结合完整背景判断。",
    definitionEn:
      "This programme publishes no ATAR threshold and is assessed holistically or case by case, so a counsellor must weigh the full profile.",
    color: "#6B6B6B",
  },
};

/** 分层标签的英文名，供英文界面直接使用 */
export function tierLabel(tier: Tier, lang: "zh" | "en"): string {
  return lang === "zh" ? TIER_META[tier].label : TIER_META[tier].short;
}

export function tierDefinition(tier: Tier, lang: "zh" | "en"): string {
  return lang === "zh" ? TIER_META[tier].definition : TIER_META[tier].definitionEn;
}

/** 差额多少分以内算作「匹配」区间 */
const TARGET_BAND = 5;

export function classifyTier(atar: number, threshold: number | null): Tier {
  if (threshold === null) return "unknown";
  const gap = atar - threshold;
  if (gap < 0) return "reach";
  if (gap < TARGET_BAND) return "target";
  return "safe";
}

export interface PrerequisiteCheck {
  /** 是否全部满足 */
  satisfied: boolean;
  /** 未满足的科目组，每组内任一科目达标即可 */
  missing: SubjectKey[][];
}

/**
 * 校验先修科目。prerequisites 为二维数组：外层为「必须全部满足的组」，
 * 内层为「组内任选其一即可」。
 */
export function checkPrerequisites(
  programme: Programme,
  selected: SubjectKey[],
): PrerequisiteCheck {
  const missing: SubjectKey[][] = [];
  for (const group of programme.prerequisites) {
    if (group.length === 0) continue;
    const ok = group.some((s) => selected.includes(s));
    if (!ok) missing.push(group);
  }
  return { satisfied: missing.length === 0, missing };
}

export interface MatchRow {
  university: University;
  programme: Programme;
  tier: Tier;
  /** 预计 ATAR 与门槛的差值，门槛未知时为 null */
  gap: number | null;
  prerequisite: PrerequisiteCheck;
}

export interface ForwardQuery {
  atar: number;
  subjects: SubjectKey[];
  regions: Region[];
  fields: FieldKey[];
}

/**
 * 正向查询：由预计 ATAR 与已选科目，反推可申请的院校与专业。
 * 结果按「门槛由高到低」排序，便于家长看到最高可及目标。
 */
export function forwardMatch(query: ForwardQuery): MatchRow[] {
  const rows: MatchRow[] = [];
  for (const uni of UNIVERSITIES) {
    if (query.regions.length > 0 && !query.regions.includes(uni.region)) continue;
    for (const prog of uni.programmes) {
      if (query.fields.length > 0 && !query.fields.includes(prog.field)) continue;
      const threshold = prog.atar ?? uni.minAtar;
      const tier = classifyTier(query.atar, threshold);
      rows.push({
        university: uni,
        programme: prog,
        tier,
        gap: threshold === null ? null : Number((query.atar - threshold).toFixed(2)),
        prerequisite: checkPrerequisites(prog, query.subjects),
      });
    }
  }
  return rows.sort((a, b) => {
    const ta = a.programme.atar ?? a.university.minAtar ?? -1;
    const tb = b.programme.atar ?? b.university.minAtar ?? -1;
    return tb - ta;
  });
}

export interface TierSummary {
  tier: Tier;
  count: number;
  universities: number;
}

export function summarizeByTier(rows: MatchRow[]): TierSummary[] {
  const order: Tier[] = ["safe", "target", "reach", "unknown"];
  return order.map((tier) => {
    const subset = rows.filter((r) => r.tier === tier);
    return {
      tier,
      count: subset.length,
      universities: new Set(subset.map((r) => r.university.id)).size,
    };
  });
}

/** 反向查询：选定院校与专业后，汇总所需分数、科目与附加要求 */
export interface ReverseResult {
  university: University;
  programme: Programme;
  requiredAtar: number | null;
  requiredAtarNote: string;
  requiredSubjectGroups: SubjectKey[][];
  extras: string[];
}

export function reverseLookup(universityId: string, programmeId: string): ReverseResult | null {
  const uni = UNIVERSITIES.find((u) => u.id === universityId);
  if (!uni) return null;
  const prog = uni.programmes.find((p) => p.id === programmeId);
  if (!prog) return null;
  const requiredAtar = prog.atar ?? uni.minAtar;
  const note =
    prog.atar !== null
      ? (prog.atarNote ?? "官方按专业公布该门槛。")
      : uni.minAtar !== null
        ? `该专业未单列门槛，沿用全校最低要求。${uni.minAtarNote}`
        : uni.minAtarNote;
  return {
    university: uni,
    programme: prog,
    requiredAtar,
    requiredAtarNote: note,
    requiredSubjectGroups: prog.prerequisites,
    extras: prog.extras,
  };
}

/** 选课建议：由目标专业方向反推推荐科目组合 */
export interface SubjectAdvice {
  subject: SubjectKey;
  /** 该科目在所选目标中被要求的次数 */
  requiredBy: number;
  /** 该科目是「必需」还是「建议」 */
  level: "必需" | "强烈建议" | "可选";
  reason: string;
}

/**
 * 依据一组目标专业，统计各科目的必要程度。
 * requiredBy 统计该科目出现在多少个目标专业的先修要求中。
 */
export function adviseSubjects(targets: { universityId: string; programmeId: string }[]): SubjectAdvice[] {
  const counter = new Map<SubjectKey, number>();
  let total = 0;
  for (const t of targets) {
    const r = reverseLookup(t.universityId, t.programmeId);
    if (!r) continue;
    total += 1;
    const flat = new Set<SubjectKey>();
    for (const group of r.requiredSubjectGroups) {
      for (const s of group) flat.add(s);
    }
    Array.from(flat).forEach((s) => counter.set(s, (counter.get(s) ?? 0) + 1));
  }
  const advice: SubjectAdvice[] = [];
  Array.from(counter.entries()).forEach(([subject, requiredBy]) => {
    const meta = SUBJECTS.find((s) => s.key === subject);
    const ratio = total === 0 ? 0 : requiredBy / total;
    const level: SubjectAdvice["level"] = ratio >= 0.75 ? "必需" : ratio >= 0.4 ? "强烈建议" : "可选";
    advice.push({
      subject,
      requiredBy,
      level,
      reason: meta?.note ?? "",
    });
  });
  return advice.sort((a, b) => b.requiredBy - a.requiredBy);
}

/** 由学科方向获取通用选课建议文案 */
export function fieldAdvice(field: FieldKey): string {
  return FIELDS.find((f) => f.key === field)?.advice ?? "";
}

/** 统计数据集规模，用于界面展示与自检 */
export function datasetStats() {
  const programmes = UNIVERSITIES.flatMap((u) => u.programmes);
  const withAtar = programmes.filter((p) => (p.atar ?? null) !== null).length;
  return {
    universities: UNIVERSITIES.length,
    programmes: programmes.length,
    programmesWithAtar: withAtar,
    programmesWithoutAtar: programmes.length - withAtar,
    subjects: SUBJECTS.length,
    regions: new Set(UNIVERSITIES.map((u) => u.region)).size,
  };
}

export function subjectLabel(key: SubjectKey): string {
  const s = SUBJECTS.find((x) => x.key === key);
  return s ? s.zh : key;
}

export function subjectGroupLabel(group: SubjectKey[]): string {
  return group.map(subjectLabel).join(" 或 ");
}

/** 双语版科目标签 */
export function subjectLabelBy(key: SubjectKey, lang: "zh" | "en"): string {
  const s = SUBJECTS.find((x) => x.key === key);
  if (!s) return key;
  return lang === "zh" ? s.zh : s.en;
}

export function subjectGroupLabelBy(group: SubjectKey[], lang: "zh" | "en"): string {
  return group.map((k) => subjectLabelBy(k, lang)).join(lang === "zh" ? " 或 " : " or ");
}

/** 建议等级的英文对照 */
export const LEVEL_EN: Record<SubjectAdvice["level"], string> = {
  必需: "Required",
  强烈建议: "Strongly advised",
  可选: "Optional",
};
