/**
 * 设计风格提醒（Admissions Almanac 招生年鉴）
 * 本文件为纯逻辑层，不含视觉样式。
 *
 * 方向级反查：由一个学科方向出发，聚合该方向下的院校名录、门槛分布与常见附加要求，
 * 供「由方向规划」页依次呈现「哪些学校 → 要多少分 → 两年怎么选课 → 还要准备什么」。
 *
 * 纪律要求：
 *  - 门槛统计只使用官方公布的数值；atar 为 null 的专业计入 unpublished，
 *    绝不参与最低、最高与中位数计算，也不得以全校门槛代填。
 *  - 分年选课不另建引擎，直接复用既有的多目标规划器（buildSubjectPlan / buildAlevelPlan），
 *    确保方向页与选课规划页对同一组目标得出一致结论。
 *  - 附加要求按「本方向 N 个专业中的 M 个」呈现，不得把个别专业的作品集或试音
 *    表述为整个方向的统一门槛。
 */
import {
  REGIONS,
  UNIVERSITIES,
  type FieldKey,
  type Programme,
  type Region,
  type University,
} from "@/data/universities";

export interface FieldEntry {
  university: University;
  programme: Programme;
}

/** 方向下按地区分节的名录条目 */
export interface FieldRegionGroup {
  region: Region;
  labelZh: string;
  labelEn: string;
  universities: { university: University; programmes: Programme[] }[];
  programmeCount: number;
}

export interface FieldProfile {
  field: FieldKey;
  entries: FieldEntry[];
  /** 开设该方向的院校（去重后，按数据集原有顺序） */
  universities: University[];
  groups: FieldRegionGroup[];
  /** 官方公布门槛的专业数值，升序 */
  published: number[];
  atarMin: number | null;
  atarMax: number | null;
  atarMedian: number | null;
  /** 官方未公布门槛的专业数 */
  unpublished: number;
  /** 附加要求直方图，按出现次数降序 */
  extras: { extra: string; count: number }[];
}

/** 取出某方向（可按地区筛选）下的全部专业条目 */
export function fieldEntries(field: FieldKey, region: Region | "all" = "all"): FieldEntry[] {
  const entries: FieldEntry[] = [];
  for (const university of UNIVERSITIES) {
    if (region !== "all" && university.region !== region) continue;
    for (const programme of university.programmes) {
      if (programme.field === field) entries.push({ university, programme });
    }
  }
  return entries;
}

/** 该方向在各地区的院校覆盖数，用于地区下拉标注 */
export function fieldRegionCounts(field: FieldKey): Record<Region, number> {
  const counts = { sg: 0, hk: 0, au: 0, uk: 0 } as Record<Region, number>;
  for (const university of UNIVERSITIES) {
    if (university.programmes.some((p) => p.field === field)) counts[university.region] += 1;
  }
  return counts;
}

/**
 * 汇总一个方向的档案。
 * median 取中位数而非平均数：门槛分布常被少数极值拉偏，中位数更贴近家长要面对的实际水平。
 */
export function fieldProfile(field: FieldKey, region: Region | "all" = "all"): FieldProfile {
  const entries = fieldEntries(field, region);

  const universities: University[] = [];
  for (const { university } of entries) {
    if (!universities.some((u) => u.id === university.id)) universities.push(university);
  }

  const groups: FieldRegionGroup[] = [];
  for (const meta of REGIONS) {
    const inRegion = universities.filter((u) => u.region === meta.id);
    if (inRegion.length === 0) continue;
    const list = inRegion.map((university) => ({
      university,
      programmes: entries
        .filter((e) => e.university.id === university.id)
        .map((e) => e.programme),
    }));
    groups.push({
      region: meta.id,
      labelZh: meta.label,
      labelEn: meta.labelEn,
      universities: list,
      programmeCount: list.reduce((sum, item) => sum + item.programmes.length, 0),
    });
  }

  const published = entries
    .map((e) => e.programme.atar)
    .filter((v): v is number => v !== null)
    .sort((a, b) => a - b);

  const median =
    published.length === 0
      ? null
      : published.length % 2 === 1
        ? published[(published.length - 1) / 2]
        : (published[published.length / 2 - 1] + published[published.length / 2]) / 2;

  const extraCounts = new Map<string, number>();
  for (const { programme } of entries) {
    for (const extra of programme.extras) {
      extraCounts.set(extra, (extraCounts.get(extra) ?? 0) + 1);
    }
  }

  return {
    field,
    entries,
    universities,
    groups,
    published,
    atarMin: published[0] ?? null,
    atarMax: published[published.length - 1] ?? null,
    atarMedian: median,
    unpublished: entries.length - published.length,
    extras: Array.from(extraCounts.entries())
      .map(([extra, count]) => ({ extra, count }))
      .sort((a, b) => b.count - a.count),
  };
}

/** 方向下的目标列表，直接喂给既有的多目标选课规划器 */
export function fieldTargets(
  field: FieldKey,
  region: Region | "all" = "all",
): { universityId: string; programmeId: string }[] {
  return fieldEntries(field, region).map((e) => ({
    universityId: e.university.id,
    programmeId: e.programme.id,
  }));
}
