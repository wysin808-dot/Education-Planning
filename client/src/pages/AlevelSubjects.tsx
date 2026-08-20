/**
 * Admissions Almanac：A-Level 选课规划。只读取统一收藏清单，不创建第二份临时目标集合。
 */
import { BookOpenCheck, ChevronRight, CircleAlert, GraduationCap } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { useLang } from "@/contexts/LangContext";
import { useShortlist } from "@/contexts/ShortlistContext";
import { ALEVEL_FIELD_ADVICE, ALEVEL_SUBJECTS } from "@/data/alevel";
import { FIELDS } from "@/data/universities";
import { adviseAlevelSubjects, alevelSubjectLabel } from "@/lib/alevelMatching";

export default function AlevelSubjects() {
  const { lang, t } = useLang();
  const { resolved } = useShortlist();
  const advice = adviseAlevelSubjects(resolved);
  const selectedFields = Array.from(new Set(resolved.map((item) => item.programme.field)));

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-paper-deep/35">
          <div className="container py-9 lg:py-12">
            
            <p className="eyebrow text-brass">CAMBRIDGE A-LEVEL · SUBJECT PLANNER</p>
            <h1 className="mt-3 font-[family-name:var(--font-serif)] text-3xl text-green sm:text-4xl">
              {t("按目标反推 3–4 门课", "Work back to 3–4 subjects")}
            </h1>
            <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
              {t("本页读取你的统一目标清单，优先显示被目标专业要求或建议的 BCI A-Level 科目。", "This page reads your single shared shortlist and prioritises BCI A-Level subjects required or recommended by those targets.")}
            </p>
          </div>
        </section>

        <div className="container py-9">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <section>
              {resolved.length ? (
                <>
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div>
                      <p className="eyebrow text-brass">{t("收藏目标的科目优先级", "Subject priority from saved goals")}</p>
                      <p className="mt-1 text-[0.8125rem] text-muted-foreground">{t(`${resolved.length} 个目标专业`, `${resolved.length} saved programmes`)}</p>
                    </div>
                    <Link href="/alevel/shortlist" className="inline-flex items-center gap-1 border-b border-brass pb-0.5 text-[0.8125rem] text-green">
                      {t("管理清单", "Manage shortlist")} <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <div className="mt-5 space-y-3">
                    {advice.map((item) => (
                      <article key={item.subject} className="border border-border bg-card p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[1rem] text-green">{alevelSubjectLabel(item.subject, lang)}</p>
                            <p className="mt-1 text-[0.75rem] text-muted-foreground">{lang === "zh" ? item.noteZh : item.noteEn}</p>
                          </div>
                          <span className={item.level === "required" ? "border border-tier-reach/40 bg-tier-reach/8 px-2 py-1 text-[0.6875rem] text-tier-reach" : "border border-brass/50 bg-brass/8 px-2 py-1 text-[0.6875rem] text-[oklch(0.42_0.07_74)]"}>
                            {item.level === "required" ? t("必需", "Required") : t("建议", "Recommended")}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              ) : (
                <div className="border-l-2 border-brass bg-paper-deep/35 p-7">
                  <CircleAlert className="h-5 w-5 text-brass" />
                  <h2 className="mt-3 font-[family-name:var(--font-serif)] text-2xl text-green">{t("先收藏目标专业。", "Save target programmes first.")}</h2>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">{t("从 A-Level 正向或反向查询把专业加入目标清单后，本页会自动反推 7 门课程的优先顺序。", "Save programmes from the A-Level forward or reverse lookup; this page will then automatically prioritise the seven subjects.")}</p>
                  <Link href="/alevel/forward" className="mt-5 inline-flex items-center gap-2 bg-green px-4 py-2.5 text-[0.8125rem] text-primary-foreground">
                    {t("开始 A-Level 查询", "Start A-Level lookup")} <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </section>

            <aside className="border-l-2 border-brass bg-paper-deep/35 p-6">
              <BookOpenCheck className="h-5 w-5 text-brass" />
              <p className="eyebrow mt-4 text-brass">{t("BCI 已确认课程", "BCI-confirmed subjects")}</p>
              <div className="mt-4 space-y-4">
                {ALEVEL_SUBJECTS.map((subject) => (
                  <div key={subject.key} className="border-b border-border pb-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-[0.9375rem] text-green">{lang === "zh" ? subject.zh : subject.en}</h3>
                      <span className="text-[0.6875rem] text-muted-foreground">{subject.group === "数学" ? t("数学", "Mathematics") : subject.group === "科学" ? t("科学", "Sciences") : t("商科", "Business")}</span>
                    </div>
                    <p className="mt-1 text-[0.75rem] leading-relaxed text-muted-foreground">{lang === "zh" ? subject.note : subject.noteEn}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          {selectedFields.length > 0 && (
            <section className="mt-10 border-t border-border pt-7">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-brass" />
                <h2 className="font-[family-name:var(--font-serif)] text-2xl text-green">{t("目标方向的组合提示", "Combinations for your target fields")}</h2>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {selectedFields.map((fieldKey) => {
                  const field = FIELDS.find((item) => item.key === fieldKey);
                  return (
                    <article key={fieldKey} className="border border-border bg-card p-5">
                      <p className="eyebrow text-brass">{lang === "zh" ? field?.zh : field?.en}</p>
                      <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">{lang === "zh" ? ALEVEL_FIELD_ADVICE[fieldKey].zh : ALEVEL_FIELD_ADVICE[fieldKey].en}</p>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
