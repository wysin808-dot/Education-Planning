/**
 * 设计风格：Admissions Almanac
 * 根路径为全站课程体系选择页：左右两栏对称，中缝以竖向规则线分隔，
 * 分别通向 WACE 与 Cambridge International A-Level 两套独立的升学规划系统。
 * 本页不承载查询功能，仅做一次明确的体系分流；页头在此隐藏体系导航。
 * 动效：开场与各节采用滚动浮现，目录条目错落显现，统计数字滚动计数，
 * 悬停时铜金规则线自左向右延展——全部在减动偏好与打印时退化为静态。
 */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Clock3 } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { CountUp, Reveal, Stagger } from "@/components/Motion";
import { useLang } from "@/contexts/LangContext";
import { datasetStats } from "@/lib/matching";
import { REGIONS, UNIVERSITIES } from "@/data/universities";
import { ALEVEL_SUBJECTS } from "@/data/alevel";
import { getRecentTool, type RecentTool } from "@/lib/recent";

export default function Choose() {
  const { t, lang } = useLang();
  const stats = datasetStats();
  const [recentTool, setRecentTool] = useState<RecentTool | null>(null);

  useEffect(() => {
    setRecentTool(getRecentTool());
  }, []);

  const tracks = [
    {
      no: "01",
      href: "/wace",
      eyebrow: t("西澳教育证书 · ATAR", "Western Australian Certificate · ATAR"),
      title: "WACE",
      subtitle: t("以 ATAR 分数规划大学目标", "Plan university goals through an ATAR"),
      desc: t(
        "输入预计 ATAR 或先锁定目标专业，双向查阅 31 所院校的分数门槛、先修科目与附加测试，并据此规划 BCI 批准的 16 门 WACE 课程。",
        "Enter a projected ATAR or start from a target programme to read thresholds, prerequisites and additional tests across 31 universities, then plan across BCI's 16 approved WACE courses.",
      ),
      facts: [
        { k: t("成绩口径", "Score basis"), v: t("ATAR 0–99.95", "ATAR 0–99.95") },
        { k: t("批准课程", "Approved courses"), v: t("16 门", "16 courses") },
        { k: t("查询方向", "Lookup"), v: t("正向 / 反向", "Forward / Reverse") },
      ],
      index: [
        { zh: "有成绩规划", en: "Plan from grades" },
        { zh: "由目标规划", en: "Plan from a target" },
        { zh: "选课规划", en: "Subject planner" },
        { zh: "31 校速查", en: "31-university table" },
        { zh: "目标清单", en: "Shortlist" },
      ],
      cta: t("进入 WACE 规划系统", "Enter the WACE planner"),
    },
    {
      no: "02",
      href: "/alevel",
      eyebrow: t("剑桥国际 · AS & A Level", "Cambridge International · AS & A Level"),
      title: "A-Level",
      subtitle: t("以预测等级校准大学目标", "Calibrate goals through predicted grades"),
      desc: t(
        "以 3–4 门预测等级为单位，按 A*AA、AAA、AAB 等院校公开口径比对同样 31 所院校的条件，并规划 BCI 官网公布的 10 门 Cambridge 课程。",
        "Working in units of three to four predicted grades, compare A*AA, AAA and AAB style published conditions across the same 31 universities and plan the ten Cambridge subjects published on the BCI site.",
      ),
      facts: [
        { k: t("成绩口径", "Grade basis"), v: t("A*–E 等级", "Grades A*–E") },
        { k: t("可选课程", "Available subjects"), v: t(`${ALEVEL_SUBJECTS.length} 门`, `${ALEVEL_SUBJECTS.length} subjects`) },
        { k: t("查询方向", "Lookup"), v: t("正向 / 反向", "Forward / Reverse") },
      ],
      index: [
        { zh: "有成绩规划", en: "Plan from grades" },
        { zh: "由目标规划", en: "Plan from a target" },
        { zh: "选课规划", en: "Subject planner" },
        { zh: "31 校速查", en: "31-university table" },
        { zh: "目标清单", en: "Shortlist" },
      ],
      cta: t("进入 A-Level 规划系统", "Enter the A-Level planner"),
    },
  ];

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader chooser />
      <main>
        {/* 目录页开场：左为总目录题名，右为数据口径栏 */}
        <section className="border-b border-border">
          <div className="container grid gap-x-14 gap-y-8 pt-12 pb-10 lg:grid-cols-[1.25fr_0.75fr] lg:pt-16">
            <Reveal>
              <span className="eyebrow text-brass">
                {t("Brentvale 招生年鉴 · 2026/27 · 总目录", "Brentvale Admissions Almanac · 2026/27 · Contents")}
              </span>
              <h1 className="mt-5 max-w-[20ch] text-[2.5rem] leading-[1.06] text-green sm:text-[3.25rem]">
                {t("先选择你的课程体系。", "Start by choosing your curriculum.")}
              </h1>
              <p className="mt-5 max-w-[58ch] font-[family-name:var(--font-serif)] text-[1.0625rem] leading-relaxed text-muted-foreground">
                {t(
                  "博林国际学院提供两套彼此独立的升学规划系统。两者覆盖相同的 31 所目标院校与 636 条专业条目，功能一一对应，仅成绩口径与可选课程不同——请按学生正在修读的课程进入。",
                  "Brentvale College International runs two independent planning systems. Both cover the same 31 target universities and 636 programme entries with matching tools; only the grade basis and available subjects differ. Enter through the curriculum the student is actually taking.",
                )}
              </p>
            </Reveal>
            <Reveal as="aside" delay={80} className="border-l-2 border-brass pl-6 lg:mt-10">
              <p className="eyebrow text-brass">{t("数据口径", "Data basis")}</p>
              <Stagger as="dl" className="mt-4 divide-y divide-border border-y border-border">
                {[
                  { k: t("数据年份", "Data year"), v: t("2026 / 2027 入学周期", "2026 / 2027 intakes") },
                  { k: t("核验时间", "Verified"), v: t("2026 年 8 月", "August 2026") },
                  { k: t("门槛性质", "Nature"), v: t("官方最低要求", "Official minimums") },
                  { k: t("未公布条目", "Unpublished"), v: t("标为顾问复核", "Marked adviser review") },
                ].map((row) => (
                  <div key={row.k} className="flex items-baseline justify-between gap-4 py-2.5">
                    <dt className="text-[0.75rem] tracking-[0.1em] text-muted-foreground">{row.k}</dt>
                    <dd className="text-right text-[0.8125rem] text-green">{row.v}</dd>
                  </div>
                ))}
              </Stagger>
            </Reveal>
          </div>
        </section>

        {/* 双体系入口：左右对称，中缝竖向规则线 */}
        <section className="border-y border-border">
          <div className="container grid lg:grid-cols-2">
            {tracks.map((track, index) => (
              <Reveal
                key={track.href}
                delay={index * 90}
                className={index === 0 ? "" : "lg:contents"}>
              <Link
                href={track.href}
                className={[
                  "group flex h-full flex-col justify-between py-10 transition-colors duration-150 hover:bg-paper-deep/55",
                  index === 0
                    ? "border-b border-border lg:border-b-0 lg:border-r lg:pr-12"
                    : "lg:pl-12",
                ].join(" ")}>
                <div>
                  <span className="almanac-index text-brass">{track.no}</span>
                  <p className="mt-4 text-[0.6875rem] tracking-[0.18em] text-muted-foreground">
                    {track.eyebrow}
                  </p>
                  <h2 className="mt-3 flex items-baseline gap-3 font-[family-name:var(--font-serif)] text-[2.75rem] leading-none text-green sm:text-[3.25rem]">
                    {track.title}
                    <span className="h-px flex-1 origin-left translate-y-[-0.6rem] bg-brass/45 transition-opacity duration-300 group-hover:bg-brass/80" />
                  </h2>
                  <p className="mt-3 text-[1.0625rem] text-green/85">{track.subtitle}</p>
                  <p className="mt-4 max-w-[46ch] font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {track.desc}
                  </p>

                  <dl className="mt-7 grid grid-cols-3 gap-4 border-t border-border pt-5">
                    {track.facts.map((fact) => (
                      <div key={fact.k}>
                        <dt className="text-[0.6875rem] tracking-[0.12em] text-muted-foreground">
                          {fact.k}
                        </dt>
                        <dd className="score mt-1.5 text-[0.875rem] text-green">{fact.v}</dd>
                      </div>
                    ))}
                  </dl>

                  {/* 章节索引：让每个体系读起来像一册可翻检的手册 */}
                  <Stagger as="ul" className="mt-6 divide-y divide-border border-t border-border">
                    {track.index.map((entry, entryIndex) => (
                      <li
                        key={entry.en}
                        className="flex items-baseline gap-3 py-2 text-[0.8125rem] text-muted-foreground">
                        <span className="almanac-index shrink-0 text-brass">
                          {track.no}.{entryIndex + 1}
                        </span>
                        <span className="min-w-0 flex-1 truncate">
                          {lang === "zh" ? entry.zh : entry.en}
                        </span>
                        <span className="h-px min-w-6 flex-1 translate-y-[-0.25rem] bg-border" />
                      </li>
                    ))}
                  </Stagger>
                </div>

                <span className="mt-9 inline-flex items-center gap-2 self-start border-b border-brass pb-1 text-[0.9375rem] text-green transition-colors group-hover:text-brass">
                  {track.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="container py-12">
          {recentTool && (
            <Link
              href={recentTool.href}
              className="flex max-w-[34rem] items-center justify-between gap-4 border-y border-border py-3.5 text-left transition-colors hover:border-brass">
              <span className="flex min-w-0 items-center gap-2.5">
                <Clock3 className="h-4 w-4 shrink-0 text-brass" />
                <span className="min-w-0">
                  <span className="eyebrow text-muted-foreground">{t("最近使用", "Recently used")}</span>
                  <span className="mt-0.5 block truncate text-[0.875rem] text-green">
                    {lang === "zh" ? recentTool.zh : recentTool.en}
                  </span>
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-brass" />
            </Link>
          )}

          {/* 地区名录：两套系统共享的院校覆盖 */}
          <Reveal className="mt-10 border-t border-border pt-8">
            <p className="eyebrow text-brass">{t("共同覆盖的目标地区", "Shared target regions")}</p>
            <Stagger as="dl" className="mt-4 grid gap-x-10 gap-y-2.5 sm:grid-cols-2">
              {REGIONS.map((region, index) => (
                <div
                  key={region.id}
                  className="flex items-baseline gap-3 border-b border-border py-2">
                  <span className="almanac-index shrink-0 text-brass">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <dt className="min-w-0 flex-1 truncate text-[0.875rem] text-green">
                    {lang === "zh" ? region.label : region.labelEn}
                  </dt>
                  <dd className="score shrink-0 text-[0.8125rem] text-muted-foreground">
                    {UNIVERSITIES.filter((u) => u.region === region.id).length}
                  </dd>
                </div>
              ))}
            </Stagger>
          </Reveal>

          <Reveal
            as="dl"
            className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-border pt-8 sm:grid-cols-4">
            {[
              { k: t("目标院校", "Universities"), v: stats.universities },
              { k: t("专业条目", "Programmes"), v: stats.programmes },
              { k: t("覆盖地区", "Regions"), v: stats.regions },
              { k: t("课程体系", "Curricula"), v: 2 },
            ].map((item) => (
              <div key={item.k}>
                <dd className="score text-[1.75rem] leading-none text-green">
                  <CountUp value={item.v} />
                </dd>
                <dt className="mt-2 text-[0.75rem] tracking-[0.14em] text-muted-foreground">{item.k}</dt>
              </div>
            ))}
          </Reveal>

          <p className="mt-8 max-w-[70ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
            {t(
              "两套系统共用同一份目标清单：在任一体系中收藏的专业，都会出现在另一体系的清单页，便于同时比较两条路径。",
              "Both systems share one shortlist: a programme saved in either curriculum also appears in the other, so the two routes can be compared side by side.",
            )}
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
