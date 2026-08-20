/**
 * 设计风格：Admissions Almanac
 * Cambridge A-Level 反向查询，与 /wace/reverse 严格对位：
 * 等级条件 → BCI 选课映射 / 申请附注 → AS 与 A2 分年选课 → 背景准备 → 官方来源。
 * 选定一个专业后一页读完「要什么等级 → 两年怎么选课 → 还要准备什么」。
 */
import { useEffect, useMemo, useState } from "react";
import { CalendarClock, ExternalLink, GraduationCap, Info, Star, Trophy } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { PrintHeader } from "@/components/PrintHeader";
import { PrintReportButton } from "@/components/PrintReportButton";
import { ShortlistButton } from "@/components/ShortlistButton";
import { useLang } from "@/contexts/LangContext";
import { ALEVEL_UNIVERSITY_FACTS } from "@/data/alevelResearch";
import { REGIONS, UNIVERSITIES, type Region } from "@/data/universities";
import { alevelReverseLookup, alevelSubjectLabel } from "@/lib/alevelMatching";
import {
  A2_SUBJECTS,
  AS_SUBJECTS,
  alevelTargetRoleLabel,
  buildAlevelTargetPlan,
  preparationKindLabel,
  type AlevelTargetPlanSubject,
} from "@/lib/targetPlan";
import { cn } from "@/lib/utils";

const PROFILE_LABELS = {
  published_grade: { zh: "公开等级条件", en: "Published grade profile" },
  passes_only: { zh: "Good passes / 最低资格", en: "Good passes / minimum qualification" },
  rank_conversion: { zh: "换算或排名口径", en: "Conversion or ranking basis" },
  holistic_or_case_by_case: { zh: "综合或个案审核", en: "Holistic or case-by-case review" },
  course_specific: { zh: "按课程页核定", en: "Course-specific verification" },
  unavailable: { zh: "官方未公布", en: "Not published" },
} as const;

const ROLE_STYLE: Record<AlevelTargetPlanSubject["role"], string> = {
  required: "border-tier-reach/45 bg-tier-reach/8 text-tier-reach",
  recommended: "border-brass/50 bg-brass/8 text-[oklch(0.42_0.07_74)]",
  support: "border-green/40 bg-green/8 text-green",
  filler: "border-tier-unknown/45 bg-tier-unknown/8 text-tier-unknown",
};

export default function AlevelReverse() {
  const { lang, t } = useLang();
  /** 与 WACE 反查页对位的三级定位：地区 → 院校 → 专业 */
  const [region, setRegion] = useState<Region>("sg");
  const [universityId, setUniversityId] = useState("nus");
  const regionUnis = useMemo(() => UNIVERSITIES.filter((u) => u.region === region), [region]);
  const university = useMemo(
    () => UNIVERSITIES.find((item) => item.id === universityId) ?? regionUnis[0] ?? UNIVERSITIES[0],
    [universityId, regionUnis],
  );
  const [programmeId, setProgrammeId] = useState(university.programmes[0]?.id ?? "");
  useEffect(() => setProgrammeId(university.programmes[0]?.id ?? ""), [university.id]);

  /** 切换地区时落到该地区首所院校与首个专业 */
  function selectRegion(next: Region) {
    setRegion(next);
    const first = UNIVERSITIES.find((u) => u.region === next);
    if (first) {
      setUniversityId(first.id);
      setProgrammeId(first.programmes[0]?.id ?? "");
    }
  }

  const result = alevelReverseLookup(university.id, programmeId);
  const fact = ALEVEL_UNIVERSITY_FACTS[university.id];
  const profileLabel = result ? PROFILE_LABELS[result.profileType] ?? PROFILE_LABELS.unavailable : PROFILE_LABELS.unavailable;

  /** 单目标 A-Level 方案：AS / A2 分年选课与背景准备 */
  const plan = useMemo(() => {
    if (!result) return null;
    return buildAlevelTargetPlan(
      university.id,
      result.programme.id,
      result.requiredSubjects,
      result.recommendedSubjects,
    );
  }, [university.id, result?.programme.id, result?.requiredSubjects, result?.recommendedSubjects]);

  /** 分年方案中的一行科目 */
  function PlanRow({ item, index }: { item: AlevelTargetPlanSubject; index: number }) {
    return (
      <li className="flex items-start gap-3.5 border-b border-border bg-card px-4 py-3.5 last:border-b-0">
        <span className="almanac-index mt-1 shrink-0">{String(index + 1).padStart(2, "0")}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <h4 className="text-[0.875rem] leading-snug text-green">
              {alevelSubjectLabel(item.subject, lang)}
            </h4>
            <span
              className={cn(
                "border px-1.5 py-0.5 text-[0.625rem] tracking-[0.08em]",
                ROLE_STYLE[item.role],
              )}>
              {alevelTargetRoleLabel(item.role, lang)}
            </span>
          </div>
          <p className="mt-1.5 text-[0.75rem] leading-relaxed text-muted-foreground">
            {lang === "zh" ? item.reasonZh : item.reasonEn}
          </p>
        </div>
      </li>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-paper-deep/35"><div className="container py-9 lg:py-12"><p className="eyebrow text-brass">CAMBRIDGE A-LEVEL · REVERSE LOOKUP</p><h1 className="mt-3 font-[family-name:var(--font-serif)] text-3xl text-green sm:text-4xl">{t("院校专业查条件", "Programme → requirements")}</h1><p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">{t("选择院校与专业，查看 Cambridge International A-Level 的公开等级条件、BCI 可用科目、英语、截止日期与附加选拔。", "Choose a university and programme to review published Cambridge International A-Level conditions, BCI-compatible subjects, English, deadlines and additional selection.")}</p></div></section>
        <section className="container grid gap-8 py-9 lg:grid-cols-[22rem_1fr] lg:gap-12">
          <aside className="no-print lg:sticky lg:top-24 lg:self-start">
            <div className="border border-border bg-card p-5">
              <p className="eyebrow text-brass">{t("目标定位", "Target selection")}</p>

              <label className="mt-5 block text-[0.75rem] text-muted-foreground">
                {t("地区", "Region")}
                <select
                  value={region}
                  onChange={(event) => selectRegion(event.target.value as Region)}
                  className="mt-2 w-full border border-border bg-paper px-3 py-2.5 text-[0.875rem] text-green outline-none transition-colors focus:border-brass">
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {(lang === "zh" ? r.label : r.labelEn)} ·{" "}
                      {UNIVERSITIES.filter((u) => u.region === r.id).length}
                      {t(" 所", " universities")}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-5 block text-[0.75rem] text-muted-foreground">
                {t("院校", "University")}
                <select
                  value={university.id}
                  onChange={(event) => setUniversityId(event.target.value)}
                  className="mt-2 w-full border border-border bg-paper px-3 py-2.5 text-[0.875rem] text-green outline-none transition-colors focus:border-brass">
                  {regionUnis.map((item) => (
                    <option key={item.id} value={item.id}>
                      {lang === "zh" ? item.nameZh : item.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-5 block text-[0.75rem] text-muted-foreground">
                {t("专业", "Programme")}
                <select
                  value={programmeId}
                  onChange={(event) => setProgrammeId(event.target.value)}
                  className="mt-2 w-full border border-border bg-paper px-3 py-2.5 text-[0.875rem] text-green outline-none transition-colors focus:border-brass">
                  {university.programmes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {lang === "zh" ? item.nameZh : item.name}
                    </option>
                  ))}
                </select>
              </label>

              <p className="mt-6 border-t border-border pt-4 text-[0.75rem] leading-relaxed text-muted-foreground">
                {t(
                  "提示：仅显示 BCI 当前确认的 7 门课可覆盖的科目映射；其他院校要求会保留在官方原文说明中。",
                  "Note: subject mapping is limited to BCI's seven confirmed subjects. Other university requirements remain in the official wording.",
                )}
              </p>
            </div>
          </aside>
          {result && <article className="min-w-0"><PrintHeader title={t("Cambridge A-Level 院校专业条件报告", "Cambridge A-Level programme requirements report")} /><div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5"><div><p className="almanac-index">{university.abbr} · {university.region.toUpperCase()}</p><h2 className="mt-2 font-[family-name:var(--font-serif)] text-3xl leading-tight text-green">{lang === "zh" ? result.programme.nameZh : result.programme.name}</h2><p className="mt-2 text-[0.875rem] text-muted-foreground">{lang === "zh" ? university.nameZh : university.name} · {lang === "zh" ? result.programme.name : result.programme.nameZh}</p></div><div className="no-print flex gap-2"><ShortlistButton universityId={university.id} programmeId={result.programme.id} label={t("加入目标清单", "Save to shortlist")} variant="full" /><PrintReportButton compact /></div></div>
            <div className="mt-6 grid gap-4 md:grid-cols-2"><section className="border-l-2 border-brass bg-paper-deep/35 p-5"><p className="eyebrow text-brass">{lang === "zh" ? profileLabel.zh : profileLabel.en}</p><p className="score mt-3 text-3xl text-green">{result.gradeProfile ?? (lang === "zh" ? "顾问复核" : "Counsellor review")}</p><p className="mt-3 font-[family-name:var(--font-serif)] text-[0.875rem] leading-relaxed text-muted-foreground">{lang === "zh" ? result.noteZh : result.noteEn}</p></section><section className="border border-border bg-card p-5"><p className="eyebrow text-muted-foreground">{t("官方最低资格", "General qualification")}</p><p className="mt-3 text-[0.875rem] leading-relaxed text-green">{lang === "zh" ? (fact?.generalZh ?? "官方未公布") : (result.gradeProfile ? result.gradeProfile : (result.profileType === "published_grade" ? "Published grade profile" : "See official requirement wording below"))}</p></section></div>
            <div className="mt-7 grid gap-6 lg:grid-cols-2"><section><div className="flex items-center gap-2 border-b border-border pb-3"><GraduationCap className="h-4 w-4 text-brass" /><h3 className="font-[family-name:var(--font-serif)] text-xl text-green">{t("BCI 选课映射", "BCI subject mapping")}</h3></div><div className="mt-4 space-y-4"><div><p className="eyebrow text-tier-reach">{t("已知必需", "Known required")}</p><div className="mt-2 flex flex-wrap gap-2">{result.requiredSubjects.length ? result.requiredSubjects.map((subject) => <span key={subject} className="border border-tier-reach/40 bg-tier-reach/8 px-2.5 py-1 text-[0.8125rem] text-tier-reach">{alevelSubjectLabel(subject, lang)}</span>) : <span className="text-[0.8125rem] text-muted-foreground">{t("未公布可映射的必修科目", "No mappable required subjects published")}</span>}</div></div><div><p className="eyebrow text-brass">{t("建议组合", "Recommended")}</p><div className="mt-2 flex flex-wrap gap-2">{result.recommendedSubjects.length ? result.recommendedSubjects.map((subject) => <span key={subject} className="border border-brass/50 bg-brass/8 px-2.5 py-1 text-[0.8125rem] text-[oklch(0.42_0.07_74)]">{alevelSubjectLabel(subject, lang)}</span>) : <span className="text-[0.8125rem] text-muted-foreground">{t("无额外建议", "No additional recommendations")}</span>}</div></div></div></section><section><div className="flex items-center gap-2 border-b border-border pb-3"><Info className="h-4 w-4 text-brass" /><h3 className="font-[family-name:var(--font-serif)] text-xl text-green">{t("申请附注", "Application notes")}</h3></div><dl className="mt-4 space-y-4 text-[0.875rem] leading-relaxed"><div><dt className="eyebrow text-muted-foreground">{t("英语要求", "English")}</dt><dd className="mt-1 text-muted-foreground">{lang === "zh" ? result.englishZh : result.englishEn}</dd></div><div><dt className="eyebrow text-muted-foreground">{t("申请窗口", "Application window")}</dt><dd className="mt-1 text-muted-foreground">{lang === "zh" ? result.deadlineZh : result.deadlineEn}</dd></div></dl></section></div>
            {/* 分年选课：为当前这一个目标而定 */}
            {plan && (
              <section className="mt-8 border-t border-border pt-6">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-brass" />
                  <h3 className="font-[family-name:var(--font-serif)] text-xl text-green">
                    {t("为这个目标怎么选课", "Subject plan for this target")}
                  </h3>
                </div>
                <p className="mt-3 max-w-[68ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {t(
                    `以下组合仅针对「${university.abbr} · ${result.programme.nameZh}」这一个目标推导：AS 年开局 ${AS_SUBJECTS} 门以保留余量，A2 年收拢为计入 offer 的 ${A2_SUBJECTS} 门。`,
                    `Derived for this single target — ${university.abbr} · ${result.programme.name}: ${AS_SUBJECTS} subjects in the AS year to keep options open, narrowing to the ${A2_SUBJECTS} that carry the offer at A2.`,
                  )}
                </p>

                <div className="mt-5 grid gap-6 lg:grid-cols-2">
                  <div>
                    <div className="flex items-baseline justify-between gap-3 border-b-2 border-green pb-2.5">
                      <h4 className="font-[family-name:var(--font-serif)] text-[1.125rem] text-green">
                        Year 12 · AS
                      </h4>
                      <span className="score text-[0.75rem] text-muted-foreground">
                        {plan.as.length} {t("门", "subjects")}
                      </span>
                    </div>
                    <p className="mt-2.5 text-[0.75rem] leading-relaxed text-muted-foreground">
                      {t(
                        "开局四门，为 A2 保留一门可放弃的余量。",
                        "Start with four subjects, leaving one that can be dropped at A2.",
                      )}
                    </p>
                    <ul className="mt-3 border border-border">
                      {plan.as.map((item, i) => (
                        <PlanRow key={item.subject} item={item} index={i} />
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between gap-3 border-b-2 border-green pb-2.5">
                      <h4 className="font-[family-name:var(--font-serif)] text-[1.125rem] text-green">
                        Year 13 · A2
                      </h4>
                      <span className="score text-[0.75rem] text-muted-foreground">
                        {plan.a2.length} {t("门", "subjects")}
                      </span>
                    </div>
                    <p className="mt-2.5 text-[0.75rem] leading-relaxed text-muted-foreground">
                      {t(
                        "offer 多以三门等级表述，A2 年集中在这三门。",
                        "Offers are normally expressed over three grades; the A2 year concentrates on these three.",
                      )}
                    </p>
                    <ul className="mt-3 border border-border">
                      {plan.a2.map((item, i) => (
                        <PlanRow key={item.subject} item={item} index={i} />
                      ))}
                    </ul>
                    {plan.dropped.length > 0 && (
                      <p className="mt-3 border border-dashed border-border bg-paper-deep/30 px-4 py-3 text-[0.75rem] leading-relaxed text-muted-foreground">
                        {t("A2 可放弃：", "May be dropped at A2: ")}
                        <span className="text-green">
                          {plan.dropped
                            .map((s) => alevelSubjectLabel(s.subject, lang))
                            .join(lang === "zh" ? "、" : ", ")}
                        </span>
                        {t(
                          "。该科目非本专业先修，保留 AS 成绩即可。",
                          ". Not a prerequisite for this programme; the AS result is sufficient.",
                        )}
                      </p>
                    )}
                    <Link
                      href="/alevel/subjects"
                      className="no-print mt-4 inline-flex items-center gap-2 border-b border-brass pb-0.5 text-[0.8125rem] text-green transition-colors hover:text-brass">
                      {t("合并多个目标一起规划选课", "Plan across several targets")}
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* 背景准备 */}
            {plan && plan.preparation.length > 0 && (
              <section className="mt-8 border-t border-border pt-6">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-brass" />
                  <h3 className="font-[family-name:var(--font-serif)] text-xl text-green">
                    {t("除了等级，还要准备什么", "Beyond the grades")}
                  </h3>
                </div>
                <p className="mt-3 max-w-[68ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {t(
                    "下表区分官方要求与加分项：英国与香港部分专业设有笔试或面试，属硬性条件；竞赛与课外活动通常用于佐证学术兴趣，不是录取门槛。",
                    "The table separates official requirements from advantages: some UK and Hong Kong programmes set written tests or interviews as hard conditions, while competitions and activities evidence academic interest rather than gate admission.",
                  )}
                </p>
                <ul className="mt-5 border border-border">
                  {plan.preparation.map((item, i) => (
                    <li
                      key={`${item.kind}-${i}`}
                      className="grid gap-2 border-b border-border bg-card px-4 py-4 last:border-b-0 md:grid-cols-[10rem_1fr_11rem] md:gap-5">
                      <div>
                        <span
                          className={cn(
                            "border px-1.5 py-0.5 text-[0.625rem] tracking-[0.08em]",
                            item.kind === "official"
                              ? "border-tier-reach/45 bg-tier-reach/8 text-tier-reach"
                              : item.kind === "language"
                                ? "border-green/40 bg-green/8 text-green"
                                : "border-brass/50 bg-brass/8 text-[oklch(0.42_0.07_74)]",
                          )}>
                          {preparationKindLabel(item.kind, lang)}
                        </span>
                        <p className="mt-2 text-[0.875rem] text-green">
                          {lang === "zh" ? item.titleZh : item.titleEn}
                        </p>
                      </div>
                      <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                        {lang === "zh" ? item.detailZh : item.detailEn}
                      </p>
                      <p className="flex items-start gap-1.5 text-[0.75rem] leading-relaxed text-muted-foreground">
                        <CalendarClock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass" />
                        {lang === "zh" ? item.timingZh : item.timingEn}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-8 border-t border-border pt-6"><div className="flex items-center gap-2"><Star className="h-4 w-4 text-brass" /><h3 className="font-[family-name:var(--font-serif)] text-xl text-green">{t("官方来源", "Official sources")}</h3></div><div className="mt-4 grid gap-2">{fact?.sources.map((source) => <a key={source} href={source} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 text-[0.8125rem] text-green underline decoration-brass underline-offset-4"><ExternalLink className="h-3.5 w-3.5" />{new URL(source).hostname}</a>)}</div></section>
          </article>}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
