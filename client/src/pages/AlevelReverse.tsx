/** Admissions Almanac：Cambridge A-Level 反向查询，显示官方等级条件、科目、英语、截止与来源。 */
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, GraduationCap, Info, Star } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { AlevelNav, CurriculumSwitch } from "@/components/CurriculumSwitch";
import { PrintHeader } from "@/components/PrintHeader";
import { PrintReportButton } from "@/components/PrintReportButton";
import { ShortlistButton } from "@/components/ShortlistButton";
import { useLang } from "@/contexts/LangContext";
import { ALEVEL_UNIVERSITY_FACTS } from "@/data/alevelResearch";
import { FIELDS, UNIVERSITIES } from "@/data/universities";
import { alevelReverseLookup, alevelSubjectLabel } from "@/lib/alevelMatching";

const PROFILE_LABELS = {
  published_grade: { zh: "公开等级条件", en: "Published grade profile" },
  passes_only: { zh: "Good passes / 最低资格", en: "Good passes / minimum qualification" },
  rank_conversion: { zh: "换算或排名口径", en: "Conversion or ranking basis" },
  holistic_or_case_by_case: { zh: "综合或个案审核", en: "Holistic or case-by-case review" },
  course_specific: { zh: "按课程页核定", en: "Course-specific verification" },
  unavailable: { zh: "官方未公布", en: "Not published" },
} as const;

export default function AlevelReverse() {
  const { lang, t } = useLang();
  const [universityId, setUniversityId] = useState("nus");
  const university = useMemo(() => UNIVERSITIES.find((item) => item.id === universityId) ?? UNIVERSITIES[0], [universityId]);
  const [programmeId, setProgrammeId] = useState(university.programmes[0]?.id ?? "");
  useEffect(() => setProgrammeId(university.programmes[0]?.id ?? ""), [university.id]);
  const result = alevelReverseLookup(university.id, programmeId);
  const fact = ALEVEL_UNIVERSITY_FACTS[university.id];
  const profileLabel = result ? PROFILE_LABELS[result.profileType] ?? PROFILE_LABELS.unavailable : PROFILE_LABELS.unavailable;

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-paper-deep/35"><div className="container py-9 lg:py-12"><CurriculumSwitch active="alevel" /><AlevelNav active="/alevel/reverse" /><p className="eyebrow mt-7 text-brass">CAMBRIDGE A-LEVEL · REVERSE LOOKUP</p><h1 className="mt-3 font-[family-name:var(--font-serif)] text-3xl text-green sm:text-4xl">{t("院校专业查条件", "Programme → requirements")}</h1><p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">{t("选择院校与专业，查看 Cambridge International A-Level 的公开等级条件、BCI 可用科目、英语、截止日期与附加选拔。", "Choose a university and programme to review published Cambridge International A-Level conditions, BCI-compatible subjects, English, deadlines and additional selection.")}</p></div></section>
        <section className="container grid gap-8 py-9 lg:grid-cols-[22rem_1fr] lg:gap-12">
          <aside className="no-print lg:sticky lg:top-24 lg:self-start"><div className="border border-border bg-card p-5"><p className="eyebrow text-brass">{t("目标定位", "Target selection")}</p><label className="mt-5 block text-[0.75rem] text-muted-foreground">{t("院校", "University")}<select value={university.id} onChange={(event) => setUniversityId(event.target.value)} className="mt-2 w-full border border-border bg-paper px-3 py-2.5 text-[0.875rem] text-green">{UNIVERSITIES.map((item) => <option key={item.id} value={item.id}>{lang === "zh" ? item.nameZh : item.name}</option>)}</select></label><label className="mt-5 block text-[0.75rem] text-muted-foreground">{t("专业", "Programme")}<select value={programmeId} onChange={(event) => setProgrammeId(event.target.value)} className="mt-2 w-full border border-border bg-paper px-3 py-2.5 text-[0.875rem] text-green">{university.programmes.map((item) => <option key={item.id} value={item.id}>{lang === "zh" ? item.nameZh : item.name}</option>)}</select></label><p className="mt-6 border-t border-border pt-4 text-[0.75rem] leading-relaxed text-muted-foreground">{t("提示：仅显示 BCI 当前确认的 7 门课可覆盖的科目映射；其他院校要求会保留在官方原文说明中。", "Note: subject mapping is limited to BCI's seven confirmed subjects. Other university requirements remain in the official wording.")}</p></div></aside>
          {result && <article className="min-w-0"><PrintHeader title={t("Cambridge A-Level 院校专业条件报告", "Cambridge A-Level programme requirements report")} /><div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5"><div><p className="almanac-index">{university.abbr} · {university.region.toUpperCase()}</p><h2 className="mt-2 font-[family-name:var(--font-serif)] text-3xl leading-tight text-green">{lang === "zh" ? result.programme.nameZh : result.programme.name}</h2><p className="mt-2 text-[0.875rem] text-muted-foreground">{lang === "zh" ? university.nameZh : university.name} · {lang === "zh" ? result.programme.name : result.programme.nameZh}</p></div><div className="no-print flex gap-2"><ShortlistButton universityId={university.id} programmeId={result.programme.id} label={t("加入目标清单", "Save to shortlist")} variant="full" /><PrintReportButton compact /></div></div>
            <div className="mt-6 grid gap-4 md:grid-cols-2"><section className="border-l-2 border-brass bg-paper-deep/35 p-5"><p className="eyebrow text-brass">{lang === "zh" ? profileLabel.zh : profileLabel.en}</p><p className="score mt-3 text-3xl text-green">{result.gradeProfile ?? (lang === "zh" ? "顾问复核" : "Counsellor review")}</p><p className="mt-3 font-[family-name:var(--font-serif)] text-[0.875rem] leading-relaxed text-muted-foreground">{lang === "zh" ? result.noteZh : result.noteEn}</p></section><section className="border border-border bg-card p-5"><p className="eyebrow text-muted-foreground">{t("官方最低资格", "General qualification")}</p><p className="mt-3 text-[0.875rem] leading-relaxed text-green">{lang === "zh" ? (fact?.generalZh ?? "官方未公布") : (result.gradeProfile ? result.gradeProfile : (result.profileType === "published_grade" ? "Published grade profile" : "See official requirement wording below"))}</p></section></div>
            <div className="mt-7 grid gap-6 lg:grid-cols-2"><section><div className="flex items-center gap-2 border-b border-border pb-3"><GraduationCap className="h-4 w-4 text-brass" /><h3 className="font-[family-name:var(--font-serif)] text-xl text-green">{t("BCI 选课映射", "BCI subject mapping")}</h3></div><div className="mt-4 space-y-4"><div><p className="eyebrow text-tier-reach">{t("已知必需", "Known required")}</p><div className="mt-2 flex flex-wrap gap-2">{result.requiredSubjects.length ? result.requiredSubjects.map((subject) => <span key={subject} className="border border-tier-reach/40 bg-tier-reach/8 px-2.5 py-1 text-[0.8125rem] text-tier-reach">{alevelSubjectLabel(subject, lang)}</span>) : <span className="text-[0.8125rem] text-muted-foreground">{t("未公布可映射的必修科目", "No mappable required subjects published")}</span>}</div></div><div><p className="eyebrow text-brass">{t("建议组合", "Recommended")}</p><div className="mt-2 flex flex-wrap gap-2">{result.recommendedSubjects.length ? result.recommendedSubjects.map((subject) => <span key={subject} className="border border-brass/50 bg-brass/8 px-2.5 py-1 text-[0.8125rem] text-[oklch(0.42_0.07_74)]">{alevelSubjectLabel(subject, lang)}</span>) : <span className="text-[0.8125rem] text-muted-foreground">{t("无额外建议", "No additional recommendations")}</span>}</div></div></div></section><section><div className="flex items-center gap-2 border-b border-border pb-3"><Info className="h-4 w-4 text-brass" /><h3 className="font-[family-name:var(--font-serif)] text-xl text-green">{t("申请附注", "Application notes")}</h3></div><dl className="mt-4 space-y-4 text-[0.875rem] leading-relaxed"><div><dt className="eyebrow text-muted-foreground">{t("英语要求", "English")}</dt><dd className="mt-1 text-muted-foreground">{lang === "zh" ? result.englishZh : result.englishEn}</dd></div><div><dt className="eyebrow text-muted-foreground">{t("申请窗口", "Application window")}</dt><dd className="mt-1 text-muted-foreground">{lang === "zh" ? result.deadlineZh : result.deadlineEn}</dd></div></dl></section></div>
            <section className="mt-8 border-t border-border pt-6"><div className="flex items-center gap-2"><Star className="h-4 w-4 text-brass" /><h3 className="font-[family-name:var(--font-serif)] text-xl text-green">{t("官方来源", "Official sources")}</h3></div><div className="mt-4 grid gap-2">{fact?.sources.map((source) => <a key={source} href={source} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 text-[0.8125rem] text-green underline decoration-brass underline-offset-4"><ExternalLink className="h-3.5 w-3.5" />{new URL(source).hostname}</a>)}</div></section>
          </article>}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
