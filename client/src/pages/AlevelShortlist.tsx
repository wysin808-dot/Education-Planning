/**
 * Admissions Almanac：A-Level 目标清单只读取统一收藏来源，
 * 通过 A-Level 公开等级条件和 BCI 七门课映射解释每个已收藏目标。
 */
import { ArrowRight, BookOpenCheck, Heart, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { PrintReportButton } from "@/components/PrintReportButton";
import { useLang } from "@/contexts/LangContext";
import { useShortlist } from "@/contexts/ShortlistContext";
import { alevelReverseLookup, alevelSubjectLabel } from "@/lib/alevelMatching";

export default function AlevelShortlist() {
  const { lang, t } = useLang();
  const { resolved, remove, clear } = useShortlist();

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-paper-deep/35">
          <div className="container py-9 lg:py-12">
            
            <p className="eyebrow text-brass">CAMBRIDGE A-LEVEL · SHORTLIST</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-[family-name:var(--font-serif)] text-3xl text-green sm:text-4xl">{t("A-Level 目标清单", "A-Level shortlist")}</h1>
                <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">{t("与 WACE 共用同一份收藏目标，但在这里以 Cambridge A-Level 的公开等级条件和 7 门课映射解读。", "This uses the same saved goals as WACE, but reads them through Cambridge A-Level published profiles and the seven-subject mapping.")}</p>
              </div>
              {resolved.length > 0 && (
                <div className="flex gap-2">
                  <PrintReportButton compact />
                  <button type="button" onClick={clear} className="no-print inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-[0.8125rem] text-muted-foreground hover:border-tier-reach hover:text-tier-reach"><Trash2 className="h-3.5 w-3.5" />{t("清空", "Clear")}</button>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="container py-9">
          {resolved.length ? (
            <div className="grid gap-4">
              {resolved.map((item, index) => {
                const rule = alevelReverseLookup(item.universityId, item.programmeId);
                if (!rule) return null;
                return (
                  <article key={`${item.universityId}-${item.programmeId}`} className="border border-border bg-card p-5">
                    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.8fr_1.25fr_auto]">
                      <div>
                        <p className="almanac-index">{String(index + 1).padStart(2, "0")} · {rule.university.abbr}</p>
                        <h2 className="mt-2 font-[family-name:var(--font-serif)] text-xl text-green">{lang === "zh" ? rule.programme.nameZh : rule.programme.name}</h2>
                        <p className="mt-1 text-[0.75rem] text-muted-foreground">{lang === "zh" ? rule.university.nameZh : rule.university.name}</p>
                      </div>
                      <div>
                        <p className="eyebrow text-brass">{t("公开条件", "Published profile")}</p>
                        <p className="score mt-2 text-2xl text-green">{rule.gradeProfile ?? t("顾问复核", "Review")}</p>
                      </div>
                      <div>
                        <p className="eyebrow text-muted-foreground">{t("BCI 课程映射", "BCI mapping")}</p>
                        <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">{rule.requiredSubjects.length ? rule.requiredSubjects.map((subject) => alevelSubjectLabel(subject, lang)).join(lang === "zh" ? "、" : ", ") : t("未公布可映射必修；请见顾问复核说明。", "No mappable required subjects published; see counsellor-review note.")}</p>
                        <p className="mt-2 text-[0.75rem] leading-relaxed text-muted-foreground">{lang === "zh" ? rule.noteZh : rule.noteEn}</p>
                      </div>
                      <button type="button" onClick={() => remove(item.universityId, item.programmeId)} className="no-print self-start text-[0.75rem] text-muted-foreground hover:text-tier-reach">{t("移除", "Remove")}</button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="border-l-2 border-brass bg-paper-deep/35 p-8">
              <Heart className="h-5 w-5 text-brass" />
              <h2 className="mt-3 font-[family-name:var(--font-serif)] text-2xl text-green">{t("还没有收藏的目标。", "No saved goals yet.")}</h2>
              <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">{t("从 A-Level 正向查询或院校专业查询中，把候选专业加入清单；这里会自动显示其 A-Level 等级条件与 BCI 科目映射。", "Save programmes from the A-Level forward or reverse lookup. This page will automatically show their grade conditions and BCI subject mapping.")}</p>
              <Link href="/alevel/forward" className="mt-5 inline-flex items-center gap-2 bg-green px-4 py-2.5 text-[0.8125rem] text-primary-foreground">{t("开始查询", "Start lookup")} <ArrowRight className="h-4 w-4" /></Link>
            </div>
          )}
          <Link href="/alevel/subjects" className="mt-8 inline-flex items-center gap-2 border-b border-brass pb-1 text-[0.875rem] text-green"><BookOpenCheck className="h-4 w-4" />{t("据此规划 3–4 门 A-Level", "Plan 3–4 A-Level subjects from this shortlist")}</Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
