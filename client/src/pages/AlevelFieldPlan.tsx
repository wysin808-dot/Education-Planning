/**
 * 设计风格：Admissions Almanac
 * Cambridge A-Level 由方向规划，与 /wace/field 严格对位：
 * 方向档案 → 院校名录与等级条件 → AS / A2 分年选课 → 背景准备 → 数据口径。
 *
 * 与 WACE 版的差异只在成绩口径：ATAR 标尺换成 Offer Grade Rule，
 * 门槛区间换成各校公开等级条件的汇总；英语一律以雅思等独立门槛呈现，不占选课名额。
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Compass, Info, Layers, Sparkles } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { QsRank } from "@/components/QsRank";
import { OfferGradeRule } from "@/components/OfferGradeRule";
import { Reveal, Stagger, Swap, Tick } from "@/components/Motion";
import { PrintHeader } from "@/components/PrintHeader";
import { PrintReportButton } from "@/components/PrintReportButton";
import { ShortlistButton } from "@/components/ShortlistButton";
import { useLang } from "@/contexts/LangContext";
import { ALEVEL_FIELD_ADVICE } from "@/data/alevel";
import { FIELDS, REGIONS, type FieldKey, type Region } from "@/data/universities";
import { fieldProfile, fieldRegionCounts, fieldTargets } from "@/lib/fieldPlan";
import {
  ALEVEL_A2_SIZE,
  ALEVEL_AS_SIZE,
  alevelPlanRoleLabel,
  alevelSubjectLabel,
  buildAlevelPlan,
  getAlevelRule,
  type AlevelPlanSubject,
} from "@/lib/alevelMatching";
import { extraLabel } from "@/lib/matching";
import { alevelFieldSupportSubjects, buildFieldPreparation, preparationKindLabel } from "@/lib/targetPlan";
import { cn } from "@/lib/utils";

const SECTION_LIMIT = 12;

const ROLE_STYLE: Record<AlevelPlanSubject["role"], string> = {
  required: "border-tier-reach/45 bg-tier-reach/8 text-tier-reach",
  recommended: "border-brass/50 bg-brass/8 text-[oklch(0.42_0.07_74)]",
  filler: "border-tier-unknown/45 bg-tier-unknown/8 text-tier-unknown",
};

const KIND_STYLE = {
  official: "border-tier-reach/45 bg-tier-reach/8 text-tier-reach",
  language: "border-green/40 bg-green/8 text-green",
  advantage: "border-brass/50 bg-brass/8 text-[oklch(0.42_0.07_74)]",
} as const;

function SubjectRow({ item, index }: { item: AlevelPlanSubject; index: number }) {
  const { lang, t } = useLang();
  return (
    <li className="flex gap-4 border-b border-border py-3 last:border-b-0">
      <span className="almanac-index mt-1 shrink-0">{String(index + 1).padStart(2, "0")}</span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-[0.9375rem] text-ink">{alevelSubjectLabel(item.subject, lang)}</span>
          <span className={cn("border px-1.5 py-0.5 text-[0.6875rem]", ROLE_STYLE[item.role])}>
            {alevelPlanRoleLabel(item.role, lang)}
          </span>
          {item.requiredBy > 0 && (
            <span className="score text-[0.75rem] text-brass">
              {t(`${item.requiredBy} 个专业指定`, `required by ${item.requiredBy}`)}
            </span>
          )}
          {item.requiredBy === 0 && item.recommendedBy > 0 && (
            <span className="score text-[0.75rem] text-muted-foreground">
              {t(`${item.recommendedBy} 个专业建议`, `recommended by ${item.recommendedBy}`)}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

export default function AlevelFieldPlan() {
  const { lang, t } = useLang();
  const [field, setField] = useState<FieldKey>("creative");
  const [region, setRegion] = useState<Region | "all">("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const regionCounts = useMemo(() => fieldRegionCounts(field), [field]);
  const profile = useMemo(() => fieldProfile(field, region), [field, region]);
  const plan = useMemo(
    () => buildAlevelPlan(fieldTargets(field, region), lang, alevelFieldSupportSubjects(field)),
    [field, region, lang],
  );
  const preparation = useMemo(
    () => buildFieldPreparation(field, profile.entries),
    [field, profile.entries],
  );

  const meta = FIELDS.find((f) => f.key === field)!;
  const advice = ALEVEL_FIELD_ADVICE[field];
  const fieldIndex = FIELDS.findIndex((f) => f.key === field) + 1;
  const empty = profile.entries.length === 0;

  /** 公开等级条件的汇总：只统计该方向下确有公开等级的院校，其余记为未公布 */
  const grades = useMemo(() => {
    const published: { abbr: string; profile: string }[] = [];
    let unpublished = 0;
    for (const university of profile.universities) {
      const rule = getAlevelRule(university.id, field);
      const value =
        rule?.fieldRule?.publishedGradeProfile ??
        (rule?.universityRule.profileType === "published_grade"
          ? rule.universityRule.generalProfile
          : null);
      if (value) published.push({ abbr: university.abbr, profile: value });
      else unpublished += 1;
    }
    return { published, unpublished };
  }, [profile.universities, field]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PrintHeader title={t("Cambridge A-Level 学科方向升学方案", "Cambridge A-Level field pathway report")} />

      <div className="border-b border-border bg-paper-deep/45">
        <div className="container flex flex-wrap items-end justify-between gap-4 py-8">
          <div>
            <p className="eyebrow text-brass">
              {t("Cambridge A-Level · 由方向规划", "Cambridge A-Level · Plan from a Field")}
            </p>
            <h1 className="mt-2 text-[1.875rem] leading-tight text-green">
              {t("先定方向，再定学校与等级", "Fix the field first, then the universities and the grades")}
            </h1>
            <p className="mt-3 max-w-[68ch] font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-muted-foreground">
              {t(
                "选定一个学科方向，本页依次给出该方向的院校名录、公开等级条件、AS 与 A2 两年选课与背景准备。英语能力以雅思等标准化考试独立呈现，不占 AS / A2 名额。",
                "Choose a field and this page gives, in order, the universities that offer it, their published grade conditions, the AS and A2 subject sets and the background preparation. English is presented as a separate standardised-test threshold and does not occupy an AS or A2 slot.",
              )}
            </p>
          </div>
          <PrintReportButton className="no-print" />
        </div>
      </div>

      <section className="container grid gap-8 py-9 lg:grid-cols-[22rem_1fr] lg:gap-12">
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
                "AS / A2 组合由该方向下全部专业的指定与建议科目合并推导，与「选课规划」页共用同一引擎。BCI 十门课程不含艺术科目，艺术方向的能力证明依靠作品集与试音。",
                "The AS and A2 sets are derived from the required and recommended subjects of every programme in the field, using the same engine as the Subject Planner. None of BCI's ten courses is an art subject, so artistic ability is evidenced by portfolio and audition.",
              )}
            </p>
          </div>
        </aside>

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
                    { k: t("等级条件未公布", "Grades unpublished"), v: grades.unpublished },
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
                    <p className="eyebrow text-brass">{t("公开等级条件", "Published grade conditions")}</p>
                    {grades.published.length === 0 ? (
                      <p className="score mt-2 text-[1.25rem] leading-tight text-green">
                        {t("官方未公布", "Not published")}
                      </p>
                    ) : (
                      <ul className="mt-2.5 space-y-1.5">
                        {grades.published.map((g) => (
                          <li key={g.abbr} className="flex items-baseline gap-3 text-[0.8125rem]">
                            <span className="score shrink-0 text-brass">{g.abbr}</span>
                            <span className="text-ink">{g.profile}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-2.5 text-[0.75rem] leading-relaxed text-muted-foreground">
                      {t(
                        `另有 ${grades.unpublished} 所院校未按本方向公布等级条件，须按其全校口径与顾问复核，不得据此推断门槛。`,
                        `A further ${grades.unpublished} universities publish no grade condition for this field; their institution-wide basis and counsellor review apply, and no threshold may be inferred.`,
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

                {/* 方向档案：与 /wace/field 同构，仅选课要义换成 A-Level 口径 */}
                <dl className="divide-y divide-border border-t border-border">
                  {[
                    {
                      k: t("方向介绍", "About this field"),
                      v: lang === "zh" ? meta.intro : meta.introEn,
                    },
                    {
                      k: t("大学阶段课程", "University coursework"),
                      v: lang === "zh" ? meta.courses : meta.coursesEn,
                    },
                    {
                      k: t("就业方向", "Where graduates go"),
                      v: lang === "zh" ? meta.careers : meta.careersEn,
                    },
                    {
                      k: t("选课要义", "What it asks of your subjects"),
                      v: lang === "zh" ? advice.zh : advice.en,
                    },
                  ].map((row) => (
                    <div key={row.k} className="grid gap-2 px-7 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
                      <dt className="eyebrow pt-0.5 text-muted-foreground">{row.k}</dt>
                      <dd className="font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-ink">
                        {row.v}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="px-7 pb-7">
                  <OfferGradeRule />
                </div>
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
                        {shown.map(({ university, programmes }) => {
                          const rule = getAlevelRule(university.id, field);
                          const gradeProfile =
                            rule?.fieldRule?.publishedGradeProfile ??
                            (rule?.universityRule.profileType === "published_grade"
                              ? rule.universityRule.generalProfile
                              : null);
                          return (
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
                                  {gradeProfile ?? t("等级条件未公布", "Grades not published")}
                                </span>
                              </div>

                              {rule?.fieldRule?.noteZh && (
                                <p className="mt-2 text-[0.75rem] leading-relaxed text-muted-foreground">
                                  {lang === "zh" ? rule.fieldRule.noteZh : rule.fieldRule.noteEn}
                                </p>
                              )}

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
                                    <ShortlistButton
                                      universityId={university.id}
                                      programmeId={programme.id}
                                      label={lang === "zh" ? programme.nameZh : programme.name}
                                      className="no-print shrink-0"
                                    />
                                  </li>
                                ))}
                              </ul>
                            </li>
                          );
                        })}
                      </Stagger>

                      {rest > 0 && (
                        <button
                          type="button"
                          onClick={() => setExpanded((prev) => ({ ...prev, [group.region]: true }))}
                          className="no-print w-full border-t border-border px-6 py-3 text-[0.8125rem] text-brass hover:bg-paper-deep/40">
                          {t(`展开其余 ${rest} 所院校`, `Show ${rest} more universities`)}
                        </button>
                      )}
                    </div>
                  );
                })}
              </Reveal>

              {/* 03 AS / A2 分年选课 */}
              <Reveal as="section" className="mt-10 border border-border bg-card">
                <div className="border-b border-border px-7 py-6">
                  <p className="almanac-index">{t("第三节", "Section III")}</p>
                  <h2 className="mt-1.5 flex items-baseline gap-3 text-[1.25rem] text-green">
                    <Compass className="h-4 w-4 shrink-0 text-brass" />
                    {t("为这个方向怎么选课", "The subject set for this field")}
                  </h2>
                  <p className="mt-2 max-w-[70ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {t(
                      `由该方向 ${plan.targetCount} 个专业的指定与建议科目合并推导。Year 12（AS）修 ${ALEVEL_AS_SIZE} 门，Year 13（A2）保留 ${ALEVEL_A2_SIZE} 门计入 offer。`,
                      `Derived from the required and recommended subjects of all ${plan.targetCount} programmes in this field. Year 12 (AS) takes ${ALEVEL_AS_SIZE} subjects and Year 13 (A2) keeps ${ALEVEL_A2_SIZE} towards the offer.`,
                    )}
                  </p>
                </div>

                <div className="grid gap-8 px-7 py-6 lg:grid-cols-2">
                  <div>
                    <p className="eyebrow text-brass">
                      {t(`Year 12 · AS ${ALEVEL_AS_SIZE} 门`, `Year 12 · AS ${ALEVEL_AS_SIZE} subjects`)}
                    </p>
                    <ul className="mt-3">
                      {plan.as.map((item, i) => (
                        <SubjectRow key={item.subject} item={item} index={i} />
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="eyebrow text-brass">
                      {t(`Year 13 · A2 ${ALEVEL_A2_SIZE} 门`, `Year 13 · A2 ${ALEVEL_A2_SIZE} subjects`)}
                    </p>
                    <ul className="mt-3">
                      {plan.a2.map((item, i) => (
                        <SubjectRow key={item.subject} item={item} index={i} />
                      ))}
                    </ul>
                  </div>
                </div>

                {plan.overflow.length > 0 && (
                  <div className="border-t border-border px-7 py-5">
                    <p className="eyebrow text-tier-reach">{t("冲突诊断", "Conflicts")}</p>
                    <ul className="mt-2 space-y-1.5 text-[0.8125rem] leading-relaxed text-ink">
                      {plan.overflow.map((item) => (
                        <li key={item.subject}>
                          {t(
                            `${alevelSubjectLabel(item.subject, lang)} 为指定科目，但 A2 名额已满，需在目标之间取舍。`,
                            `${alevelSubjectLabel(item.subject, lang)} is a required subject but the A2 slots are full; the targets must be traded off.`,
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="no-print border-t border-border px-7 py-4 text-[0.8125rem] text-muted-foreground">
                  {t("已锁定具体专业？改用 ", "Settled on a specific programme? Use ")}
                  <Link href="/alevel/reverse" className="text-brass hover:underline">
                    {t("由目标规划", "Plan from a Target")}
                  </Link>
                  {t(" 可得到只针对该专业的分年方案；已有收藏清单则可用 ", " for a plan built for that programme alone, or ")}
                  <Link href="/alevel/subjects" className="text-brass hover:underline">
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
                    "等级条件仅在院校官方明确公开时才予列出；未公布者显示为「等级条件未公布」，不以其他专业或全校口径代填。附加要求一律来自数据层登记的官方项目，竞赛与义工属加分项，不得表述为录取条件。英语能力以雅思等标准化考试独立呈现，不占 AS / A2 选课名额。逐校来源见「由目标规划」页。",
                    "Grade conditions are listed only where a university publishes them explicitly; otherwise the entry reads as not published and is never filled in from another programme or the institution-wide basis. Additional requirements come only from the officially recorded items in the data layer; competitions and volunteering are advantages, never admission conditions. English is presented as a separate standardised-test threshold and does not occupy an AS or A2 slot. Per-university sources are listed on the Plan from a Target page.",
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
