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

export function reverseLookup(
  universityId: string,
  programmeId: string,
  lang: "zh" | "en" = "zh",
): ReverseResult | null {
  const uni = UNIVERSITIES.find((u) => u.id === universityId);
  if (!uni) return null;
  const prog = uni.programmes.find((p) => p.id === programmeId);
  if (!prog) return null;
  const requiredAtar = prog.atar ?? uni.minAtar;
  const zh = lang === "zh";
  const progNote = zh ? prog.atarNote : (prog.atarNoteEn ?? prog.atarNote);
  const uniNote = zh ? uni.minAtarNote : uni.minAtarNoteEn;
  const note =
    prog.atar !== null
      ? (progNote ??
        (zh
          ? "官方按专业公布该门槛。"
          : "This threshold is published by the university at programme level."))
      : uni.minAtar !== null
        ? `${
            zh
              ? "该专业未单列门槛，沿用全校最低要求。"
              : "No programme-level threshold is published; the institution-wide minimum applies. "
          }${uniNote}`
        : uniNote;
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
  return adviseSubjectsBy(targets, "zh");
}

/** 选课建议（可指定语言，理由文案取对应语言版本） */
export function adviseSubjectsBy(
  targets: { universityId: string; programmeId: string }[],
  lang: "zh" | "en",
): SubjectAdvice[] {
  const counter = new Map<SubjectKey, number>();
  let total = 0;
  for (const t of targets) {
    const r = reverseLookup(t.universityId, t.programmeId, lang);
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
      reason: (lang === "zh" ? meta?.note : meta?.noteEn) ?? "",
    });
  });
  return advice.sort((a, b) => b.requiredBy - a.requiredBy);
}

/** 由学科方向获取通用选课建议文案 */
export function fieldAdvice(field: FieldKey, lang: "zh" | "en" = "zh"): string {
  const f = FIELDS.find((x) => x.key === field);
  if (!f) return "";
  return lang === "zh" ? f.advice : f.adviceEn;
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
  必需: "Essential",
  强烈建议: "Strongly advised",
  可选: "Optional",
};

/**
 * 附加测试与选拔要求的英文标签。多数为国际通用缩写（UCAT / LNAT 等）
 * 保持原样，仅中文表述需要翻译。
 */
const EXTRA_EN: Record<string, string> = {
  面试: "Interview",
  笔试: "Written test",
  作品集: "Portfolio",
  试音: "Audition",
  试听: "Audition",
  医疗体检: "Medical examination",
  入学考试: "Entrance examination",
};

export function extraLabel(extra: string, lang: "zh" | "en"): string {
  if (lang === "zh") return extra;
  return EXTRA_EN[extra] ?? extra;
}

/** scaling 强度的英文标签 */
const SCALING_EN: Record<string, string> = {
  高: "Strong",
  中: "Moderate",
  一般: "Modest",
};

export function scalingLabel(scaling: string, lang: "zh" | "en"): string {
  if (lang === "zh") return scaling;
  return SCALING_EN[scaling] ?? scaling;
}

/** 数据核验信心的英文标签 */
export function confidenceLabel(confidence: string, lang: "zh" | "en"): string {
  if (lang === "zh") return confidence;
  return confidence === "高" ? "High" : confidence === "中" ? "Medium" : "Low";
}

/** 科目学科分组的英文标签 */
const GROUP_EN: Record<string, string> = {
  数学: "Mathematics",
  科学: "Science",
  科技: "Technology",
  商科: "Business",
  人文与语言: "Humanities & Languages",
};

export function groupLabel(group: string, lang: "zh" | "en"): string {
  if (lang === "zh") return group;
  return GROUP_EN[group] ?? group;
}

/* ------------------------------------------------------------------ *
 * 选课方案生成器
 *
 * 目的：把「哪门科目被几个目标要求」的统计，推进为一份可执行的选课方案。
 * 规则来自 WACE 制度与 BCI 课程序列，不引入任何虚构要求：
 *  1. 英语线：英语或 EALD 为毕业必需，二者择一，永远占一个位置。
 *  2. 二选一先修（如「数学方法 或 专业数学」）在组内只选一门，
 *     不再对组内每门各计一次，避免必需科目数虚高。
 *  3. Year 11 通常修读 4–5 门 ATAR 课程；Year 12 通常保留 4 门计入 ATAR。
 *  4. 只推荐当前课程序列（北/南半球）实际开设的科目；
 *     若某必需科目本序列未开设，作为冲突显式报出，不静默替换。
 * ------------------------------------------------------------------ */

/** Year 11 建议修读的科目数上限 */
export const YEAR11_SIZE = 5;
/** Year 12 计入 ATAR 的主力科目数 */
export const YEAR12_SIZE = 4;

const SCALING_WEIGHT: Record<string, number> = { 高: 3, 中: 2, 一般: 1 };

export interface PlanSubject {
  subject: SubjectKey;
  /** 该科目被多少个目标要求（同一目标内的二选一只计一次） */
  requiredBy: number;
  /** 入选原因分类 */
  role: "english" | "required" | "choice" | "filler";
  /** 组内二选一时的备选科目 */
  alternatives: SubjectKey[];
  /** 要求该科目的目标名称，便于家长核对 */
  supports: string[];
  /** 本序列是否开设 */
  offered: boolean;
}

export interface SubjectPlan {
  /** Year 11 推荐组合 */
  year11: PlanSubject[];
  /** Year 12 推荐保留组合 */
  year12: PlanSubject[];
  /** Year 12 相对 Year 11 建议放弃的科目 */
  dropped: PlanSubject[];
  /** 因本序列未开设而无法满足的必需科目 */
  unavailable: { subject: SubjectKey; supports: string[] }[];
  /** 必需科目总数超过可用名额时的冲突提示 */
  overflow: PlanSubject[];
  /** 参与统计的目标数量 */
  targetCount: number;
}

interface PlanTarget {
  universityId: string;
  programmeId: string;
}

/**
 * 生成 Year 11 / Year 12 选课方案。
 * hemisphere 决定可选科目范围；lang 仅影响目标名称的展示语言。
 */
export function buildSubjectPlan(
  targets: PlanTarget[],
  hemisphere: "north" | "south",
  lang: "zh" | "en" = "zh",
): SubjectPlan {
  const offeredKeys = new Set(
    SUBJECTS.filter((s) => (hemisphere === "north" ? s.north : s.south)).map((s) => s.key),
  );
  const zh = lang === "zh";

  // 逐目标收集先修组，二选一在组内择优后只计一次
  const counts = new Map<SubjectKey, { count: number; supports: string[]; alts: Set<SubjectKey> }>();
  const unavailable = new Map<SubjectKey, string[]>();
  let targetCount = 0;

  const score = (key: SubjectKey) => {
    const meta = SUBJECTS.find((s) => s.key === key);
    const scaling = SCALING_WEIGHT[meta?.scaling ?? "一般"] ?? 1;
    // 已被其他目标要求的科目优先，其次看 scaling
    return (counts.get(key)?.count ?? 0) * 10 + scaling;
  };

  for (const target of targets) {
    const uni = UNIVERSITIES.find((u) => u.id === target.universityId);
    const prog = uni?.programmes.find((p) => p.id === target.programmeId);
    if (!uni || !prog) continue;
    targetCount += 1;
    const label = `${zh ? uni.abbr : uni.abbr} · ${zh ? prog.nameZh : prog.name}`;

    for (const group of prog.prerequisites) {
      if (group.length === 0) continue;
      const openInSequence = group.filter((k) => offeredKeys.has(k));
      if (openInSequence.length === 0) {
        // 整组都不在本序列开设，报为冲突而非静默忽略
        const key = group[0];
        unavailable.set(key, [...(unavailable.get(key) ?? []), label]);
        continue;
      }
      // 组内择优：优先已被其他目标要求的科目，其次 scaling 更高者
      const picked = openInSequence.slice().sort((a, b) => score(b) - score(a))[0];
      const entry = counts.get(picked) ?? { count: 0, supports: [], alts: new Set<SubjectKey>() };
      entry.count += 1;
      entry.supports.push(label);
      openInSequence.filter((k) => k !== picked).forEach((k) => entry.alts.add(k));
      counts.set(picked, entry);
    }
  }

  const toPlanSubject = (
    subject: SubjectKey,
    role: PlanSubject["role"],
  ): PlanSubject => {
    const entry = counts.get(subject);
    return {
      subject,
      requiredBy: entry?.count ?? 0,
      role,
      alternatives: Array.from(entry?.alts ?? []),
      supports: entry?.supports ?? [],
      offered: offeredKeys.has(subject),
    };
  };

  // 1. 英语线：毕业必需，EALD 与英语二选一
  const englishKey: SubjectKey = offeredKeys.has("english") ? "english" : "eald";
  const englishSlot: PlanSubject = {
    ...toPlanSubject(englishKey, "english"),
    alternatives: offeredKeys.has("eald") && englishKey !== "eald" ? ["eald"] : [],
  };

  // 2. 目标要求的科目，按被要求次数与 scaling 排序
  const requiredSorted = Array.from(counts.entries())
    .filter(([key]) => key !== englishKey && key !== "eald")
    .sort((a, b) => {
      if (b[1].count !== a[1].count) return b[1].count - a[1].count;
      const sa = SCALING_WEIGHT[SUBJECTS.find((s) => s.key === a[0])?.scaling ?? "一般"] ?? 1;
      const sb = SCALING_WEIGHT[SUBJECTS.find((s) => s.key === b[0])?.scaling ?? "一般"] ?? 1;
      return sb - sa;
    })
    .map(([key]) => toPlanSubject(key, "required"));

  const capacity = YEAR11_SIZE - 1; // 英语占一个位置
  const takenRequired = requiredSorted.slice(0, capacity);
  const overflow = requiredSorted.slice(capacity);

  // 3. 名额未满时，用 scaling 较高且方向相容的科目补位
  const chosen = new Set<SubjectKey>([englishSlot.subject, ...takenRequired.map((s) => s.subject)]);
  const fillers: PlanSubject[] = [];
  if (takenRequired.length < capacity) {
    // 已占用的学科分组：同一分组内不重复补位，
    // 避免出现「数学方法 + 专业数学 + 应用数学」这类实际不会同时修读的组合。
    const usedGroups = new Set<string>();
    Array.from(chosen).forEach((k) => {
      const g = SUBJECTS.find((s) => s.key === k)?.group;
      if (g) usedGroups.add(g);
    });
    const pool = SUBJECTS.filter(
      (s) => offeredKeys.has(s.key) && !chosen.has(s.key) && s.key !== "eald",
    ).sort((a, b) => (SCALING_WEIGHT[b.scaling] ?? 1) - (SCALING_WEIGHT[a.scaling] ?? 1));

    // 第一轮：优先补入尚未覆盖的学科分组，保证方案横跨数学、科学与商科
    for (const meta of pool) {
      if (takenRequired.length + fillers.length >= capacity) break;
      if (usedGroups.has(meta.group)) continue;
      fillers.push(toPlanSubject(meta.key, "filler"));
      chosen.add(meta.key);
      usedGroups.add(meta.group);
    }
    // 第二轮：分组已全部覆盖仍有空位时，再按 scaling 补齐
    for (const meta of pool) {
      if (takenRequired.length + fillers.length >= capacity) break;
      if (chosen.has(meta.key)) continue;
      fillers.push(toPlanSubject(meta.key, "filler"));
      chosen.add(meta.key);
    }
  }

  const year11 = [englishSlot, ...takenRequired, ...fillers];

  // 4. Year 12 保留四门：英语线 + 被要求最多的科目；补位科目最先让出
  const year12Pool = [englishSlot, ...takenRequired, ...fillers];
  const year12 = year12Pool.slice(0, YEAR12_SIZE);
  const dropped = year12Pool.slice(YEAR12_SIZE);

  return {
    year11,
    year12,
    dropped,
    unavailable: Array.from(unavailable.entries()).map(([subject, supports]) => ({
      subject,
      supports,
    })),
    overflow,
    targetCount,
  };
}

/** 方案中每门科目的入选说明 */
export function planRoleLabel(role: PlanSubject["role"], lang: "zh" | "en"): string {
  const map: Record<PlanSubject["role"], [string, string]> = {
    english: ["毕业必需", "Graduation requirement"],
    required: ["目标先修", "Target prerequisite"],
    choice: ["组内择优", "Chosen within group"],
    filler: ["提分补位", "Scaling filler"],
  };
  return lang === "zh" ? map[role][0] : map[role][1];
}
