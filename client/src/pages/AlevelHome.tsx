/**
 * Admissions Almanac：Cambridge International A-Level 首页。
 * 与 WACE 入口并列，但明确以 BCI 已确认的七门 Cambridge A-Level 课程和 3–4 门成绩结构为核心。
 * 动效与 WACE 首页对位：开场与侧栏滚动浮现，课程标签错落显现；
 * 减动偏好与打印时退化为静态。
 */
import { ArrowRight, BookOpenCheck, GraduationCap, Scale } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { Reveal, Stagger } from "@/components/Motion";
import { OfferGradeRule } from "@/components/OfferGradeRule";
import { useLang } from "@/contexts/LangContext";
import { ALEVEL_SUBJECTS } from "@/data/alevel";

export default function AlevelHome() {
  const { lang, t } = useLang();
  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main>
        <section className="container grid gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <Reveal>
            
            <p className="eyebrow text-brass">CAMBRIDGE INTERNATIONAL · AS & A LEVEL</p>
            <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-serif)] text-[2.6rem] leading-[0.98] text-green sm:text-[4rem]">
              {t("以 3–4 门 A-Level，校准你的大学目标。", "Calibrate university goals through 3–4 A-Level subjects.")}
            </h1>
            <p className="mt-6 max-w-2xl font-[family-name:var(--font-serif)] text-[1.05rem] leading-relaxed text-muted-foreground">
              {t(
                "以 BCI 已确认的 Cambridge International A-Level 课程为边界，按预测等级、指定科目与院校官方口径，反推可行的大学与专业路径。",
                "Bounded by BCI's confirmed Cambridge International A-Level subjects, this planner works back from predicted grades, required subjects and official university wording to map viable routes.",
              )}
            </p>
            <div className="mt-9 grid border-y border-border sm:grid-cols-2">
              <Link href="/alevel/forward" className="group border-b border-border p-5 transition-colors hover:bg-paper-deep sm:border-b-0 sm:border-r">
                <span className="almanac-index text-brass">01 · {t("有成绩规划", "Plan from grades")}</span>
                <span className="mt-4 flex items-center gap-2 text-[1.1rem] text-green"><Scale className="h-4 w-4" />{t("预测成绩 → 院校专业", "Predicted grades → options")}</span>
                <span className="mt-2 block text-[0.8125rem] leading-relaxed text-muted-foreground">{t("输入 3–4 门预测成绩，查看公开条件、先修匹配和顾问复核条目。", "Enter three to four predicted grades to review published conditions, subject fit and adviser-review entries.")}</span>
                <span className="mt-4 inline-flex items-center gap-1 border-b border-brass pb-0.5 text-[0.75rem] text-green">{t("按成绩查询", "Start from grades")} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
              </Link>
              <Link href="/alevel/reverse" className="group p-5 transition-colors hover:bg-paper-deep">
                <span className="almanac-index text-brass">02 · {t("由目标规划", "Plan from a target")}</span>
                <span className="mt-4 flex items-center gap-2 text-[1.1rem] text-green"><GraduationCap className="h-4 w-4" />{t("院校专业 → 条件", "Programme → requirements")}</span>
                <span className="mt-2 block text-[0.8125rem] leading-relaxed text-muted-foreground">{t("先锁定专业，再反查 A-Level 条件、BCI 7 门课映射、英语和附加选拔。", "Start with a programme, then work back to A-Level conditions, BCI's seven-subject mapping, English and additional selection.")}</span>
                <span className="mt-4 inline-flex items-center gap-1 border-b border-brass pb-0.5 text-[0.75rem] text-green">{t("按目标查询", "Start from a target")} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
              </Link>
            </div>

            <OfferGradeRule className="mt-8 max-w-3xl" />
            <div className="mt-8 border-t border-border pt-6">
              <p className="eyebrow text-muted-foreground">{t("已确认可开设课程", "BCI-confirmed subjects")}</p>
              <Stagger className="mt-4 flex flex-wrap gap-2">
                {ALEVEL_SUBJECTS.map((subject) => (
                  <span key={subject.key} className="border border-border bg-card px-3 py-1.5 text-[0.8125rem] text-green">
                    {lang === "zh" ? subject.zh : subject.en}
                  </span>
                ))}
              </Stagger>
            </div>
          </Reveal>
          <Reveal as="aside" delay={90} className="border-l-2 border-brass bg-paper-deep/40 p-7 lg:mt-8">
            <p className="eyebrow text-brass">{t("口径说明", "How this works")}</p>
            <h2 className="mt-3 font-[family-name:var(--font-serif)] text-2xl text-green">
              {t("不把不同体系硬换算。", "No forced cross-system conversion.")}
            </h2>
            <div className="mt-6 space-y-5 text-[0.875rem] leading-relaxed text-muted-foreground">
              <p>{t("英国课程通常直接以 A*AA、AAA、AAB 等 offer 表述；系统会按公开等级条件比较预测成绩。", "UK courses usually state offers directly as A*AA, AAA or AAB; the planner compares those published profiles with predicted grades.")}</p>
              <p>{t("新加坡、香港与澳洲部分院校仅写 good passes、课程级表格或综合审核。此类结果一律标为“顾问复核”，不会被伪装为确定概率。", "Some Singapore, Hong Kong and Australian institutions use good passes, course tables or holistic review. These are always marked Counsellor review rather than turned into a false probability.")}</p>
            </div>
            <Link href="/alevel/subjects" className="mt-8 inline-flex items-center gap-2 border-b border-brass pb-1 text-[0.8125rem] text-green">
              <BookOpenCheck className="h-4 w-4" /> {t("按目标规划 7 门课程", "Plan the seven subjects from goals")}
            </Link>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
