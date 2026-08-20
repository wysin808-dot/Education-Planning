/**
 * Admissions Almanac：Cambridge A-Level 31 校门槛速查。
 * 长参考表按地区分章，以目录编号、规则线和通用资格摘要建立可翻检的年鉴节奏。
 */
import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { AlevelNav } from "@/components/CurriculumSwitch";
import { PrintHeader } from "@/components/PrintHeader";
import { PrintReportButton } from "@/components/PrintReportButton";
import { useLang } from "@/contexts/LangContext";
import { ALEVEL_UNIVERSITY_FACTS } from "@/data/alevelResearch";
import { ALEVEL_UNIVERSITY_RULES } from "@/data/alevelRules";
import { REGIONS, UNIVERSITIES } from "@/data/universities";

const PROFILE_TYPE_LABELS: Record<string, { zh: string; en: string }> = {
  published_grade: { zh: "公开等级条件", en: "Published grade profile" },
  passes_only: { zh: "Good passes / 最低资格", en: "Good passes / minimum qualification" },
  rank_conversion: { zh: "换算或排名口径", en: "Conversion or ranking basis" },
  holistic_or_case_by_case: { zh: "综合或个案审核", en: "Holistic or case-by-case review" },
  course_specific: { zh: "按课程页核定", en: "Course-specific verification" },
  unavailable: { zh: "官方未公布", en: "Not published" },
};

export default function AlevelTable() {
  const { lang, t } = useLang();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const rows = useMemo(
    () => UNIVERSITIES.filter((university) =>
      (region === "all" || university.region === region) &&
      `${university.name} ${university.nameZh} ${university.abbr}`.toLowerCase().includes(query.toLowerCase()),
    ),
    [query, region],
  );
  const chapters = REGIONS.map((meta) => ({ meta, universities: rows.filter((university) => university.region === meta.id) })).filter((chapter) => chapter.universities.length > 0);

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-paper-deep/35">
          <div className="container py-9 lg:py-12">
            <AlevelNav active="/alevel/table" />
            <p className="eyebrow mt-7 text-brass">CAMBRIDGE A-LEVEL · REFERENCE TABLE</p>
            <h1 className="mt-3 font-[family-name:var(--font-serif)] text-3xl text-green sm:text-4xl">{t("31 校 A-Level 口径速查", "31-university A-Level reference")}</h1>
            <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">{t("显示每校公开的 Cambridge/International A-Level 通用资格与口径类型。专业级条件请进入反向查询复核。", "Shows each university's published Cambridge/International A-Level general qualification and requirement type. Use reverse lookup for programme-level review.")}</p>
          </div>
        </section>

        <div className="container py-9">
          <PrintHeader title={t("31 校 Cambridge A-Level 口径速查", "31-university Cambridge A-Level reference")} />
          <div className="no-print flex flex-col gap-3 border-b border-border pb-5 sm:flex-row">
            <label className="flex flex-1 items-center gap-2 border border-border bg-card px-3 py-2">
              <Search className="h-4 w-4 text-brass" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("搜索院校", "Search universities")} className="w-full bg-transparent text-[0.875rem] outline-none" />
            </label>
            <select value={region} onChange={(event) => setRegion(event.target.value)} className="border border-border bg-card px-3 py-2 text-[0.8125rem] text-green">
              <option value="all">{t("全部地区", "All regions")}</option>
              {REGIONS.map((item) => <option key={item.id} value={item.id}>{lang === "zh" ? item.label : item.labelEn}</option>)}
            </select>
            <PrintReportButton compact className="w-fit shrink-0" />
          </div>

          <div className="mt-8 space-y-10">
            {chapters.map((chapter, chapterIndex) => (
              <section key={chapter.meta.id}>
                <header className="flex flex-wrap items-end justify-between gap-4 border-y border-border py-3">
                  <div>
                    <p className="almanac-index text-brass">{String(chapterIndex + 1).padStart(2, "0")} · {lang === "zh" ? chapter.meta.label : chapter.meta.labelEn}</p>
                    <p className="mt-1 max-w-3xl text-[0.75rem] leading-relaxed text-muted-foreground">{lang === "zh" ? chapter.meta.blurb : chapter.meta.blurbEn}</p>
                  </div>
                  <p className="score text-lg text-green">{chapter.universities.length} <span className="text-[0.6875rem] text-muted-foreground">{t("所", "schools")}</span></p>
                </header>
                <div className="mt-4 grid gap-4">
                  {chapter.universities.map((university, index) => {
                    const rule = ALEVEL_UNIVERSITY_RULES[university.id];
                    const fact = ALEVEL_UNIVERSITY_FACTS[university.id];
                    const type = PROFILE_TYPE_LABELS[rule?.profileType ?? "unavailable"] ?? PROFILE_TYPE_LABELS.unavailable;
                    return (
                      <article key={university.id} className="border border-border bg-card p-5">
                        <div className="grid gap-4 lg:grid-cols-[1.05fr_1.6fr_0.75fr]">
                          <div>
                            <p className="almanac-index">{String(index + 1).padStart(2, "0")} · {university.abbr}</p>
                            <h2 className="mt-2 font-[family-name:var(--font-serif)] text-xl text-green">{lang === "zh" ? university.nameZh : university.name}</h2>
                            <p className="mt-1 text-[0.75rem] text-muted-foreground">{university.programmes.length} {t("个专业", "programmes")}</p>
                          </div>
                          <div>
                            <p className="eyebrow text-brass">{t("公开通用资格", "Published general qualification")}</p>
                            <p className="mt-2 text-[0.875rem] leading-relaxed text-muted-foreground">{lang === "zh" ? fact?.generalZh : (rule?.generalProfileEn ?? "Not published")}</p>
                          </div>
                          <div>
                            <p className="eyebrow text-muted-foreground">{t("口径类型", "Requirement type")}</p>
                            <p className="mt-2 text-[0.875rem] text-green">{lang === "zh" ? type.zh : type.en}</p>
                            {fact?.sources[0] && <a href={fact.sources[0]} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-[0.75rem] text-green underline decoration-brass underline-offset-4"><ExternalLink className="h-3.5 w-3.5" />{t("官方来源", "Official source")}</a>}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
