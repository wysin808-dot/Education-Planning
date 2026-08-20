/**
 * Admissions Almanac：Cambridge International A-Level 正向查询。
 * 仅把官方明确公布的等级条件用于分层；其他结果保留为“顾问复核”，并显示原始口径说明。
 */
import { useMemo, useState } from "react";
import { AlertTriangle, Check, ChevronDown, Printer, SlidersHorizontal } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { AlevelNav } from "@/components/CurriculumSwitch";
import { OfferGradeRule } from "@/components/OfferGradeRule";
import { PrintHeader } from "@/components/PrintHeader";
import { PrintReportButton } from "@/components/PrintReportButton";
import { ShortlistButton } from "@/components/ShortlistButton";
import { useLang } from "@/contexts/LangContext";
import { ALEVEL_SUBJECTS, type AlevelGrade } from "@/data/alevel";
import type { AlevelSubjectKey } from "@/data/alevelRules";
import { FIELDS, REGIONS, type FieldKey, type Region } from "@/data/universities";
import { ALEVEL_TIER_META, alevelForwardMatch, alevelSubjectLabel, type AlevelTier } from "@/lib/alevelMatching";
import { cn } from "@/lib/utils";

const GRADES: { value: AlevelGrade; label: string }[] = [
  { value: "", label: "—" }, { value: "A*", label: "A*" }, { value: "A", label: "A" }, { value: "B", label: "B" }, { value: "C", label: "C" }, { value: "D", label: "D" }, { value: "E", label: "E" },
];
const ORDER: AlevelTier[] = ["safe", "target", "reach", "review"];

export default function AlevelForward() {
  const { lang, t } = useLang();
  const [grades, setGrades] = useState<Record<AlevelSubjectKey, AlevelGrade>>(() => Object.fromEntries(ALEVEL_SUBJECTS.map((s) => [s.key, ""])) as Record<AlevelSubjectKey, AlevelGrade>);
  const [regions, setRegions] = useState<Region[]>([]);
  const [fields, setFields] = useState<FieldKey[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [open, setOpen] = useState<Set<AlevelTier>>(new Set());
  const selectedCount = Object.values(grades).filter(Boolean).length;
  const rows = useMemo(() => selectedCount >= 3 ? alevelForwardMatch({ grades, regions, fields }) : [], [grades, regions, fields, selectedCount]);

  const toggle = <T,>(list: T[], item: T, setter: (value: T[]) => void) => setter(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  const gradeText = ALEVEL_SUBJECTS.filter((subject) => grades[subject.key]).map((subject) => `${lang === "zh" ? subject.zh : subject.en} ${grades[subject.key]}`).join(" · ");

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-paper-deep/35">
          <div className="container py-9 lg:py-12">
            <AlevelNav active="/alevel/forward" />
            <p className="eyebrow mt-7 text-brass">CAMBRIDGE A-LEVEL · FORWARD MATCH</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-[family-name:var(--font-serif)] text-3xl text-green sm:text-4xl">{t("预测成绩查院校", "Predicted grades → universities")}</h1>
                <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">{t("输入至少 3 门预测 A-Level 成绩。公开等级条件会被分层；未公布等级的课程保留为顾问复核。", "Enter predicted grades for at least three A-Level subjects. Published grade profiles are tiered; unpublished thresholds remain for counsellor review.")}</p>
                <OfferGradeRule compact className="mt-5 max-w-3xl" />
              </div>
              {selectedCount >= 3 && <PrintReportButton compact />}
            </div>
          </div>
        </section>
        <div className="container grid gap-8 py-9 lg:grid-cols-[19rem_1fr] lg:gap-12">
          <aside className="no-print lg:sticky lg:top-24 lg:self-start">
            <button type="button" onClick={() => setFiltersOpen((v) => !v)} className="flex w-full items-center justify-between border border-green bg-green px-4 py-3 text-[0.8125rem] text-primary-foreground lg:hidden">
              <span className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" /> {t("成绩与筛选", "Grades & filters")}</span><ChevronDown className={cn("h-4 w-4 transition-transform", filtersOpen && "rotate-180")} />
            </button>
            <div className={cn("border border-border bg-card p-5 lg:block", !filtersOpen && "hidden")}>
              <p className="eyebrow text-brass">{t("预测成绩", "Predicted grades")}</p>
              <div className="mt-4 space-y-3">
                {ALEVEL_SUBJECTS.map((subject) => (
                  <label key={subject.key} className="flex items-center justify-between gap-3 text-[0.8125rem] text-green">
                    <span>{lang === "zh" ? subject.zh : subject.en}</span>
                    <select value={grades[subject.key]} onChange={(event) => setGrades((prev) => ({ ...prev, [subject.key]: event.target.value as AlevelGrade }))} className="w-16 border border-border bg-paper px-2 py-1.5 text-center text-green">
                      {GRADES.map((grade) => <option key={grade.value} value={grade.value}>{grade.label}</option>)}
                    </select>
                  </label>
                ))}
              </div>
              <p className={cn("mt-4 border-t border-border pt-3 text-[0.75rem]", selectedCount >= 3 ? "text-tier-safe" : "text-tier-reach")}>{t(`已填 ${selectedCount}/3–4 门`, `${selectedCount}/3–4 subjects entered`)}</p>
              <div className="mt-6 border-t border-border pt-5">
                <p className="eyebrow text-muted-foreground">{t("目标地区", "Regions")}</p>
                <div className="mt-3 flex flex-wrap gap-2">{REGIONS.map((region) => <button key={region.id} type="button" onClick={() => toggle(regions, region.id, setRegions)} className={cn("border px-2 py-1 text-[0.75rem]", regions.includes(region.id) ? "border-green bg-green text-primary-foreground" : "border-border text-muted-foreground")}>{lang === "zh" ? region.label : region.labelEn}</button>)}</div>
              </div>
              <div className="mt-5 border-t border-border pt-5">
                <p className="eyebrow text-muted-foreground">{t("专业方向", "Fields")}</p>
                <div className="mt-3 flex flex-wrap gap-2">{FIELDS.map((field) => <button key={field.key} type="button" onClick={() => toggle(fields, field.key, setFields)} className={cn("border px-2 py-1 text-[0.75rem]", fields.includes(field.key) ? "border-green bg-green text-primary-foreground" : "border-border text-muted-foreground")}>{lang === "zh" ? field.zh : field.en}</button>)}</div>
              </div>
            </div>
          </aside>
          <section>
            <PrintHeader title={t("Cambridge A-Level 升学匹配报告", "Cambridge A-Level match report")} />
            {selectedCount < 3 ? (
              <div className="border-l-2 border-brass bg-paper-deep/35 p-7"><p className="eyebrow text-brass">{t("开始前", "Before you begin")}</p><h2 className="mt-3 font-[family-name:var(--font-serif)] text-2xl text-green">{t("请先填入至少 3 门预测成绩。", "Enter at least three predicted subjects.")}</h2><p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">{t("BCI 的 Cambridge A-Level 规划以 3–4 门课程为单位。系统会先判断公开等级条件，再检查课程先修。", "BCI's Cambridge A-Level planning is built around three to four subjects. The system checks published grade profiles before subject prerequisites.")}</p><OfferGradeRule className="mt-7" /></div>
            ) : (
              <>
                <div className="no-print flex flex-wrap items-center justify-between gap-3 border-y border-border py-3"><p className="text-[0.8125rem] text-muted-foreground">{t("已选：", "Entered: ")}{gradeText}</p><p className="text-[0.75rem] text-muted-foreground">{t(`${rows.length} 个专业结果`, `${rows.length} programme results`)}</p></div>
                <div className="mt-6 space-y-8">
                  {ORDER.map((tier) => {
                    const group = rows.filter((row) => row.tier === tier);
                    if (!group.length) return null;
                    const meta = ALEVEL_TIER_META[tier];
                    const expanded = open.has(tier);
                    const shown = expanded ? group : group.slice(0, 8);
                    return <section key={tier}>
                      <div className="flex items-end justify-between gap-4 border-b border-border pb-3"><div><p className="eyebrow" style={{ color: meta.color }}>{lang === "zh" ? meta.zh : meta.en}</p><p className="mt-1 max-w-2xl text-[0.8125rem] leading-relaxed text-muted-foreground">{lang === "zh" ? meta.definitionZh : meta.definitionEn}</p></div><span className="score text-xl" style={{ color: meta.color }}>{group.length}</span></div>
                      <div className="mt-4 grid gap-3 xl:grid-cols-2">{shown.map((row) => <article key={`${row.university.id}-${row.programme.id}`} className="border border-border bg-card p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="almanac-index">{row.university.abbr}</p><h3 className="mt-1 text-[0.9375rem] leading-snug text-green">{lang === "zh" ? row.programme.nameZh : row.programme.name}</h3><p className="mt-1 text-[0.6875rem] text-muted-foreground">{lang === "zh" ? row.university.nameZh : row.university.name}</p></div><ShortlistButton universityId={row.university.id} programmeId={row.programme.id} label={t("收藏", "Save")} variant="icon" /></div><div className="mt-4 flex items-center justify-between border-t border-border pt-3"><div><p className="eyebrow text-muted-foreground">{t("公开条件", "Published profile")}</p><p className="score mt-1 text-lg text-green">{row.gradeProfile ?? t("顾问复核", "Review")}</p></div>{row.gradeGap !== null && <p className={cn("score text-[0.8125rem]", row.gradeGap >= 0 ? "text-tier-safe" : "text-tier-reach")}>{t("等级积分", "Grade points")} {row.gradeGap > 0 ? "+" : ""}{row.gradeGap}</p>}</div><p className="mt-3 font-[family-name:var(--font-serif)] text-[0.8125rem] leading-relaxed text-muted-foreground">{lang === "zh" ? row.noteZh : row.noteEn}</p>{row.prerequisite.satisfied ? row.prerequisite.missing.length === 0 && <p className="mt-3 inline-flex items-center gap-1.5 text-[0.75rem] text-tier-safe"><Check className="h-3.5 w-3.5" /> {t("已满足已知先修", "Known prerequisites met")}</p> : <p className="mt-3 flex items-start gap-1.5 text-[0.75rem] leading-relaxed text-tier-reach"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />{t("缺少：", "Missing: ")}{row.prerequisite.missing.map((subject) => alevelSubjectLabel(subject, lang)).join(lang === "zh" ? "、" : ", ")}</p>}</article>)}</div>
                      {group.length > 8 && <button type="button" onClick={() => setOpen((prev) => { const next = new Set(prev); expanded ? next.delete(tier) : next.add(tier); return next; })} className="no-print mt-4 border-b border-brass pb-1 text-[0.8125rem] text-green">{expanded ? t("收起本组", "Collapse section") : t(`查看其余 ${group.length - 8} 项`, `View ${group.length - 8} more`)}</button>}
                    </section>;
                  })}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
