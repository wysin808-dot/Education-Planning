/**
 * 设计风格：Admissions Almanac
 * WACE 由方向规划：从一个学科方向出发，一页读完
 * 「这个方向有哪些学校 → 要多少分 → 两年怎么选课 → 还要准备什么」。
 *
 * 与 /wace/reverse 的关系：反查页锁定单个专业，本页锁定整个方向，
 * 两页共用同一套选课引擎与同一份数据，互为补充并在页内相互指路。
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Compass, Info, Layers, Sparkles } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { QsRank } from "@/components/QsRank";
import { ScoreRule, type RuleMarker } from "@/components/ScoreRule";
import { Reveal, Stagger, Swap, Tick } from "@/components/Motion";
import { PrintHeader } from "@/components/PrintHeader";
import { PrintReportButton } from "@/components/PrintReportButton";
import { ShortlistButton } from "@/components/ShortlistButton";
import { useLang } from "@/contexts/LangContext";
import { FIELDS, REGIONS, type FieldKey, type Region } from "@/data/universities";
import { fieldProfile, fieldRegionCounts, fieldTargets } from "@/lib/fieldPlan";
import {
  YEAR11_SIZE,
  YEAR12_COUNTED,
  YEAR12_SIZE,
  buildSubjectPlan,
  extraLabel,
  planRoleLabel,
  subjectGroupLabelBy,
  subjectLabelBy,
  type PlanSubject,
} from "@/lib/matching";
import { buildFieldPreparation, fieldSupportSubjects, preparationKindLabel } from "@/lib/targetPlan";
import { cn } from "@/lib/utils";

/** BCI 仅开设南半球序列，选课推导固定按该序列进行 */
const HEMISPHERE = "south" as const;
/** 名录每节默认展示的院校数，其余折叠，避免长列表失去结构 */
const SECTION_LIMIT = 12;

const ROLE_STYLE: Record<PlanSubject["role"], string> = {
  english: "border-green/40 bg-green/8 text-green",
  chinese: "border-green/40 bg-green/8 text-green",
  required: "border-tier-reach/45 bg-tier-reach/8 text-tier-reach",
  choice: "border-brass/50 bg-brass/8 text-[oklch(0.42_0.07_74)]",
  filler: "border-tier-unknown/45 bg-tier-unknown/8 text-tier-unknown",
};

const KIND_STYLE = {
  official: "border-tier-reach/45 bg-tier-reach/8 text-tier-reach",
  language: "border-green/40 bg-green/8 text-green",
  advantage: "border-brass/50 bg-brass/8 text-[oklch(0.42_0.07_74)]",
} as const;

function SubjectRow({ item, index }: { item: PlanSubject; index: number }) {
  const { lang, t } = useLang();
  return (
    <li className="flex gap-4 border-b border-border py-3 last:border-b-0">
      <span className="almanac-index mt-1 shrink-0">{String(index + 1).padStart(2, "0")}</span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-[0.9375rem] text-ink">{subjectLabelBy(item.subject, lang)}</span>
          <span className={cn("border px-1.5 py-0.5 text-[0.6875rem]", ROLE_STYLE[item.role])}>
            {planRoleLabel(item.role, lang)}
          </span>
          {item.requiredBy > 0 && (
            <span className="score text-[0.75rem] text-brass">
              {t(`${item.requiredBy} 个专业要求`, `required by ${item.requiredBy}`)}
            </span>
          )}
        </div>
        {item.alternatives.length > 0 && (
          <p className="mt-1 text-[0.75rem] text-muted-foreground">
            {t("组内可替换：", "Interchangeable within group: ")}
            {subjectGroupLabelBy([item.subject, ...item.alternatives], lang)}
          </p>
        )}
      </div>
    </li>
  );
}

export default function FieldPlan() {
  const { lang, t } = useLang();
  const [field, setField] = useState<FieldKey>("creative");
  const [region, setRegion] = useState<Region | "all">("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const regionCounts = useMemo(() => fieldRegionCounts(field), [field]);
  const profile = useMemo(() => fieldProfile(field, region), [field, region]);
  const plan = useMemo(
    () => buildSubjectPlan(fieldTargets(field, region), HEMISPHERE, lang, fieldSupportSubjects(field)),
    [field, region, lang],
  );
  const preparation = useMemo(
    () => buildFieldPreparation(field, profile.entries),
    [field, profile.entries],
  );

  const meta = FIELDS.find((f) => f.key === field)!;
  const fieldIndex = FIELDS.findIndex((f) => f.key === field) + 1;
  const empty = profile.entries.length === 0;

  /** 标尺标记：最低、中位与最高，同值自动合并 */
  const markers = useMemo(() => {
    if (profile.atarMin === null) return [];
    const out: RuleMarker[] = [
      { label: t(`最低 ${profile.atarMin}`, `Lowest ${profile.atarMin}`), value: profile.atarMin, tone: "green" },
    ];
    if (profile.atarMedian !== null && profile.atarMedian !== profile.atarMin) {
      out.push({
        label: t(`中位 ${profile.atarMedian}`, `Median ${profile.atarMedian}`),
        value: profile.atarMedian,
        tone: "brass",
      });
    }
    if (profile.atarMax !== null && profile.atarMax !== profile.atarMedian) {
      out.push({
        label: t(`最高 ${profile.atarMax}`, `Highest ${profile.atarMax}`),
        value: profile.atarMax,
        tone: "muted",
      });
    }
    return out;
  }, [profile, lang]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PrintHeader title={t("WACE 学科方向升学方案", "WACE field pathway report")} />

      <div className="border-b border-border bg-paper-deep/45">
        <div className="container flex flex-wrap items-end justify-between gap-4 py-8">
          <div>
            <p className="eyebrow text-brass">{t("WACE · 由方向规划", "WACE · Plan from a Field")}</p>
            <h1 className="mt-2 text-[1.875rem] leading-tight text-green">
              {t("先定方向，再定学校与分数", "Fix the field first, then the universities and the score")}
            </h1>
            <p className="mt-3 max-w-[68ch] font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-muted-foreground">
              {t(
                "选定一个学科方向，本页依次给出该方向的院校名录、门槛分布、两年选课组合与背景准备。若已经锁定了某一个专业，请改用「由目标规划」。",
                "Choose a field and this page gives, in order, the universities that offer it, the spread of thresholds, a two-year subject set and the background preparation. If a single programme is already settled, use Plan from a Target instead.",
              )}
            </p>
          </div>
          <PrintReportButton className="no-print" />
        </div>
      </div>

      <section className="container grid gap-8 py-9 lg:grid-cols-[22rem_1fr] lg:gap-12">
        {/* 方向定位侧栏 */}
        <aside className="no-print lg:sticky lg:top-24 lg:self-start">
          <div className="border border-border bg-card p-6">
            <p className="eyebrow text-brass">{t("方向定位", "Field selection")}</p>

            <label className="mt-5 block text-[0.75rem] tracking-[0.14em] text-muted-foreground">
              {t("学科方向", "Field")}
            </label>
            <div className="mt-2 flex flex-col gap-1.5">
              {FIELDS.map((item, i) => {
                const count = Object.values(fieldRegionCounts(item.key)).reduce((a, b) => a + b, 0);
                const active = item.key === field;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setField(item.key)}
                    className={cn(
                      "flex items-baseline justify-between border px-3 py-2 text-left text-[0.875rem] transition-colors",
                      active
                        ? "border-green bg-green text-primary-foreground"
                        : "border-border text-ink hover:border-green/50",
                    )}>
                    <span className="flex items-baseline gap-2">
                      <span className={cn("almanac-index", active && "text-primary-foreground/70")}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {lang === "zh" ? item.zh : item.en}
                    </span>
                    <span
                      className={cn(
                        "score text-[0.75rem]",
                        active ? "text-primary-foreground/80" : "text-muted-foreground",
                      )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <label className="mt-6 block text-[0.75rem] tracking-[0.14em] text-muted-foreground">
              {t("地区", "Region")}
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as Region | "all")}
              className="mt-2 w-full border border-border bg-paper px-3 py-2 text-[0.875rem] text-ink">
              <option value="all">
                {t(
                  `全部地区（${Object.values(regionCounts).reduce((a, b) => a + b, 0)} 校）`,
                  `All regions (${Object.values(regionCounts).reduce((a, b) => a + b, 0)} universities)`,
                )}
              </option>
              {REGIONS.map((r) => (
                <option key={r.id} value={r.id} disabled={regionCounts[r.id] === 0}>
                  {(lang === "zh" ? r.label : r.labelEn) +
                    (regionCounts[r.id] === 0
                      ? t("（无该方向专业）", " (none in this field)")
                      : t(`（${regionCounts[r.id]} 校）`, ` (${regionCounts[r.id]})`))}
                </option>
              ))}
            </select>

            <p className="mt-5 border-t border-border pt-4 text-[0.75rem] leading-relaxed text-muted-foreground">
              {t(
                "方向后的数字为开设该方向的院校数。选课组合由该方向下全部专业的先修要求合并推导，与「选课规划」页共用同一引擎。",
                "The figure beside each field is the number of universities offering it. The subject set is derived from the prerequisites of every programme in the field, using the same engine as the Subject Planner.",
              )}
            </p>
          </div>
        </aside>

        {/* 结果区 */}
        <Swap key={`${field}-${region}`} className="min-w-0">
          {/* 01 方向档案 */}
          <Reveal as="article" className="border border-border bg-card">
            <div className="border-b border-border px-7 py-6">
              <p className="almanac-index">
                {t(`第 ${fieldIndex} 向`, `Field ${String(fieldIndex).padStart(2, "0")}`)}
              </p>
              <h2 className="mt-1.5 flex flex-wrap items-baseline gap-x-3 text-[1.5rem] text-green">
                {lang === "zh" ? meta.zh : meta.en}
                <span className="text-[0.875rem] text-muted-foreground">
                  {lang === "zh" ? meta.en : meta.zh}
                </span>
              </h2>
            </div>

            {empty ? (
              <div className="px-7 py-8">
                <p className="font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-ink">
                  {t(
                    "本数据集在所选地区未收录该方向的本科专业。请切换到其他地区，或改选方向。",
                    "This dataset records no undergraduate programme in this field for the selected region. Switch region, or choose another field.",
                  )}
                </p>
              </div>
            ) : (
              <>
                <dl className="grid grid-cols-2 gap-x-8 gap-y-5 px-7 py-6 sm:grid-cols-4">
                  {[
                    { k: t("开设院校", "Universities"), v: profile.universities.length },
                    { k: t("专业条目", "Programmes"), v: profile.entries.length },
                    { k: t("覆盖地区", "Regions"), v: profile.groups.length },
                    { k: t("门槛未公布", "Unpublished"), v: profile.unpublished },
                  ].map((s) => (
                    <div key={s.k}>
                      <dd className="score text-[1.625rem] leading-none text-green">
                        <Tick>{s.v}</Tick>
                      </dd>
                      <dt className="mt-1.5 text-[0.6875rem] tracking-[0.14em] text-muted-foreground">
                        {s.k}
                      </dt>
                    </div>
                  ))}
                </dl>

                <div className="grid gap-6 border-t border-border px-7 py-6 lg:grid-cols-2">
                  <div className="border-l-2 border-brass pl-4">
                    <p className="eyebrow text-brass">{t("门槛区间", "Threshold range")}</p>
                    <p className="score mt-2 text-[1.75rem] leading-none text-green">
                      {profile.atarMin === null
                        ? t("官方未公布", "Not published")
                        : profile.atarMin === profile.atarMax
                          ? `ATAR ${profile.atarMin}`
                          : `ATAR ${profile.atarMin}–${profile.atarMax}`}
                    </p>
                    <p className="mt-2 text-[0.75rem] leading-relaxed text-muted-foreground">
                      {profile.atarMedian === null
                        ? t(
                            "该方向下无任何专业公布可用的 ATAR 门槛。",
                            "No programme in this field publishes a usable ATAR threshold.",
                          )
                        : t(
                            `中位门槛 ${profile.atarMedian}；另有 ${profile.unpublished} 个专业官方未公布门槛，未计入统计。`,
                            `Median threshold ${profile.atarMedian}. A further ${profile.unpublished} programmes publish no threshold and are excluded from these figures.`,
                          )}
                    </p>
                  </div>

                  <div>
                    <p className="eyebrow text-muted-foreground">
                      {t("本方向常见附加要求", "Common additional selection")}
                    </p>
                    {profile.extras.length === 0 ? (
                      <p className="mt-2 text-[0.8125rem] text-muted-foreground">
                        {t(
                          "该方向下的专业均未在数据层登记附加选拔要求。",
                          "No programme in this field records an additional selection requirement.",
                        )}
                      </p>
                    ) : (
                      <ul className="mt-2 space-y-1.5">
                        {profile.extras.map((item) => (
                          <li
                            key={item.extra}
                            className="flex items-baseline justify-between gap-3 text-[0.8125rem]">
                            <span className="text-ink">{extraLabel(item.extra, lang)}</span>
                            <span className="score text-[0.75rem] text-brass">
                              {item.count} / {profile.entries.length}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="border-t border-border px-7 py-6">
                  <p className="eyebrow text-muted-foreground">
                    {t("方向选课要义", "What this field asks of the subject set")}
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-ink">
                    {lang === "zh" ? meta.advice : meta.adviceEn}
                  </p>
                </div>

                {markers.length > 0 && (
                  <div className="border-t border-border px-7 py-7">
                    <p className="eyebrow text-muted-foreground">
                      {t("门槛分布", "Threshold distribution")}
                    </p>
                    <div className="mt-5">
                      <ScoreRule markers={markers} showPointer={false} />
                    </div>
                  </div>
                )}
              </>
            )}
          </Reveal>

          {!empty && (
            <>
              {/* 02 院校名录 */}
              <Reveal as="section" className="mt-8">
                <div className="flex items-baseline gap-3">
                  <Layers className="h-4 w-4 shrink-0 text-brass" />
                  <h2 className="text-[1.25rem] text-green">
                    {t("开设该方向的院校", "Universities offering this field")}
                  </h2>
                </div>

                {profile.groups.map((group, gi) => {
                  const open = expanded[group.region] ?? false;
                  const shown = open ? group.universities : group.universities.slice(0, SECTION_LIMIT);
                  const rest = group.universities.length - shown.length;
                  return (
                    <div key={group.region} className="mt-6 border border-border bg-card">
                      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border px-6 py-4">
                        <h3 className="flex items-baseline gap-2 text-[1rem] text-green">
                          <span className="almanac-index">{String(gi + 1).padStart(2, "0")}</span>
                          {lang === "zh" ? group.labelZh : group.labelEn}
                        </h3>
                        <span className="score text-[0.75rem] text-muted-foreground">
                          {t(
                            `${group.universities.length} 校 · ${group.programmeCount} 个专业`,
                            `${group.universities.length} universities · ${group.programmeCount} programmes`,
                          )}
                        </span>
                      </div>

                      <Stagger as="ul" className="divide-y divide-border">
                        {shown.map(({ university, programmes }) => (
                          <li key={university.id} className="px-6 py-4">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                              <h4 className="flex flex-wrap items-baseline gap-x-2 text-[0.9375rem] text-green">
                                {lang === "zh" ? university.nameZh : university.name}
                                <span className="text-[0.75rem] text-muted-foreground">
                                  {university.abbr}
                                </span>
                                <QsRank universityId={university.id} />
                              </h4>
                              <span className="score text-[0.8125rem] text-brass">
                                {university.minAtar === null
                                  ? t("全校门槛未公布", "No institution-wide threshold")
                                  : t(`全校 ATAR ${university.minAtar}`, `ATAR ${university.minAtar}`)}
                              </span>
                            </div>

                            <ul className="mt-2.5 space-y-1.5">
                              {programmes.map((programme) => (
                                <li
                                  key={programme.id}
                                  className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-[0.8125rem]">
                                  <span className="flex flex-wrap items-baseline gap-x-2 text-ink">
                                    {lang === "zh" ? programme.nameZh : programme.name}
                                    <span className="text-[0.75rem] text-muted-foreground">
                                      {lang === "zh" ? programme.name : programme.nameZh}
                                    </span>
                                    {programme.extras.map((extra) => (
                                      <span
                                        key={extra}
                                        className="border border-brass/50 bg-brass/8 px-1.5 py-0.5 text-[0.6875rem] text-[oklch(0.42_0.07_74)]">
                                        {extraLabel(extra, lang)}
                                      </span>
                                    ))}
                                  </span>
                                  <span className="flex shrink-0 items-baseline gap-3">
                                    <span className="score text-[0.8125rem] text-green">
                                      {programme.atar === null
                                        ? t("未公布", "n/a")
                                        : programme.atar}
                                    </span>
                                    <ShortlistButton
                                      universityId={university.id}
                                      programmeId={programme.id}
                                      label={lang === "zh" ? programme.nameZh : programme.name}
                                      className="no-print"
                                    />
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </Stagger>

                      {rest > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setExpanded((prev) => ({ ...prev, [group.region]: true }))
                          }
                          className="no-print w-full border-t border-border px-6 py-3 text-[0.8125rem] text-brass hover:bg-paper-deep/40">
                          {t(`展开其余 ${rest} 所院校`, `Show ${rest} more universities`)}
                        </button>
                      )}
                    </div>
                  );
                })}
              </Reveal>

              {/* 03 分年选课 */}
              <Reveal as="section" className="mt-10 border border-border bg-card">
                <div className="border-b border-border px-7 py-6">
                  <p className="almanac-index">{t("第三节", "Section III")}</p>
                  <h2 className="mt-1.5 flex items-baseline gap-3 text-[1.25rem] text-green">
                    <Compass className="h-4 w-4 shrink-0 text-brass" />
                    {t("为这个方向怎么选课", "The subject set for this field")}
                  </h2>
                  <p className="mt-2 max-w-[70ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {t(
                      `由该方向 ${plan.targetCount} 个专业的先修要求合并推导。Year 11 修 ${YEAR11_SIZE} 门打基础，Year 12 修 ${YEAR12_SIZE} 门、取最好的 ${YEAR12_COUNTED} 门计入 ATAR。EALD 与中文（第一语言）为锁定科目。`,
                      `Derived from the prerequisites of all ${plan.targetCount} programmes in this field. Year 11 takes ${YEAR11_SIZE} courses to build the base; Year 12 takes ${YEAR12_SIZE}, of which the best ${YEAR12_COUNTED} count towards the ATAR. EALD and Chinese (First Language) are locked.`,
                    )}
                  </p>
                </div>

                <div className="grid gap-8 px-7 py-6 lg:grid-cols-2">
                  <div>
                    <p className="eyebrow text-brass">
                      {t(`Year 11 · ${YEAR11_SIZE} 门`, `Year 11 · ${YEAR11_SIZE} courses`)}
                    </p>
                    <ul className="mt-3">
                      {plan.year11.map((item, i) => (
                        <SubjectRow key={item.subject} item={item} index={i} />
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="eyebrow text-brass">
                      {t(
                        `Year 12 · ${YEAR12_SIZE} 门取 ${YEAR12_COUNTED} 门计分`,
                        `Year 12 · ${YEAR12_SIZE} courses, best ${YEAR12_COUNTED} count`,
                      )}
                    </p>
                    <ul className="mt-3">
                      {plan.year12.map((item, i) => (
                        <SubjectRow key={item.subject} item={item} index={i} />
                      ))}
                    </ul>
                  </div>
                </div>

                {(plan.unavailable.length > 0 || plan.overflow.length > 0) && (
                  <div className="border-t border-border px-7 py-5">
                    <p className="eyebrow text-tier-reach">{t("冲突诊断", "Conflicts")}</p>
                    <ul className="mt-2 space-y-1.5 text-[0.8125rem] leading-relaxed text-ink">
                      {plan.unavailable.map((item) => (
                        <li key={item.subject}>
                          {t(
                            `${subjectLabelBy(item.subject, lang)} 在 BCI 南半球序列未开设，以下目标的先修因此无法满足：`,
                            `${subjectLabelBy(item.subject, lang)} is not offered in BCI's southern-hemisphere sequence, so the prerequisite cannot be met for: `,
                          )}
                          {item.supports.join("、")}
                        </li>
                      ))}
                      {plan.overflow.map((item) => (
                        <li key={item.subject}>
                          {t(
                            `${subjectLabelBy(item.subject, lang)} 为必需科目，但名额已满，需在目标之间取舍。`,
                            `${subjectLabelBy(item.subject, lang)} is required but there is no remaining slot; the targets must be traded off.`,
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="no-print border-t border-border px-7 py-4 text-[0.8125rem] text-muted-foreground">
                  {t("已锁定具体专业？改用 ", "Settled on a specific programme? Use ")}
                  <Link href="/wace/reverse" className="text-brass hover:underline">
                    {t("由目标规划", "Plan from a Target")}
                  </Link>
                  {t(" 可得到只针对该专业的分年方案；已有收藏清单则可用 ", " for a plan built for that programme alone, or ")}
                  <Link href="/wace/subjects" className="text-brass hover:underline">
                    {t("选课规划", "the Subject Planner")}
                  </Link>
                  {t(" 合并多个目标。", " to merge several saved targets.")}
                </div>
              </Reveal>

              {/* 04 背景准备 */}
              <Reveal as="section" className="mt-10 border border-border bg-card">
                <div className="border-b border-border px-7 py-6">
                  <p className="almanac-index">{t("第四节", "Section IV")}</p>
                  <h2 className="mt-1.5 flex items-baseline gap-3 text-[1.25rem] text-green">
                    <Sparkles className="h-4 w-4 shrink-0 text-brass" />
                    {t("还要准备什么", "What else to prepare")}
                  </h2>
                </div>
                <Stagger as="ul" className="divide-y divide-border">
                  {preparation.map((item) => (
                    <li key={item.titleZh} className="px-7 py-5">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                        <span className={cn("border px-1.5 py-0.5 text-[0.6875rem]", KIND_STYLE[item.kind])}>
                          {preparationKindLabel(item.kind, lang)}
                        </span>
                        <h3 className="text-[0.9375rem] text-green">
                          {lang === "zh" ? item.titleZh : item.titleEn}
                        </h3>
                      </div>
                      <p className="mt-2 font-[family-name:var(--font-serif)] text-[0.875rem] leading-relaxed text-muted-foreground">
                        {lang === "zh" ? item.detailZh : item.detailEn}
                      </p>
                      <p className="mt-1.5 text-[0.75rem] text-brass">
                        {t("建议时点：", "Timing: ")}
                        {lang === "zh" ? item.timingZh : item.timingEn}
                      </p>
                    </li>
                  ))}
                </Stagger>
              </Reveal>

              {/* 数据口径 */}
              <Reveal as="section" className="mt-10 border border-border bg-paper-deep/40 px-7 py-6">
                <p className="eyebrow flex items-baseline gap-2 text-muted-foreground">
                  <Info className="h-3.5 w-3.5 shrink-0" />
                  {t("数据口径", "Data basis")}
                </p>
                <p className="mt-2.5 max-w-[80ch] font-[family-name:var(--font-serif)] text-[0.8125rem] leading-relaxed text-ink">
                  {t(
                    "所列 ATAR 为各院校官方公布的最低门槛，达到门槛不构成录取保证；官方未公布统一门槛的专业标注为「未公布」，不以全校门槛代填，也不参与本页的区间与中位数计算。附加要求一律来自数据层登记的官方项目，竞赛与义工属加分项，不得表述为录取条件。逐校来源见「由目标规划」页的官方来源栏。",
                    "The ATARs shown are the minimums published by each university; meeting one does not guarantee an offer. Programmes for which no uniform threshold is published are marked as such, are never filled in from the institution-wide figure, and are excluded from the range and median on this page. Additional requirements come only from the officially recorded items in the data layer; competitions and volunteering are advantages, never admission conditions. Per-university sources are listed on the Plan from a Target page.",
                  )}
                </p>
              </Reveal>
            </>
          )}
        </Swap>
      </section>

      <SiteFooter />
    </div>
  );
}
