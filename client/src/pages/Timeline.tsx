/**
 * 设计风格：Admissions Almanac
 *
 * WACE 升学时间轴：从 11 月考试、12 月正式 ATAR，到新加坡公立大学申请、
 * 选拔、Offer 与 8 月入学的全周期。依《BCI WACE → 新加坡公立大学升学时间图》规划稿建立。
 *
 * 与其他页面的分工：门槛与选课由「由目标规划」「由方向规划」回答，
 * 本页只回答「什么时候做什么」。因此不重复呈现 ATAR 数值，只给节点与窗口。
 *
 * 呈现纪律：官方日期与规划参考必须一眼可辨——前者用等宽数字加铜金实线，
 * 后者用常规字体加虚线边框并明写「规划参考」，绝不让家长把经验月份读成官方截止日。
 */
import { useMemo } from "react";
import { Link } from "wouter";
import { CalendarClock, Info } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { QsRank } from "@/components/QsRank";
import { Reveal, Stagger } from "@/components/Motion";
import { PrintHeader } from "@/components/PrintHeader";
import { PrintReportButton } from "@/components/PrintReportButton";
import { useLang } from "@/contexts/LangContext";
import { UNIVERSITIES } from "@/data/universities";
import {
  SG_TIMELINES,
  WACE_CYCLE,
  precisionLabel,
  type TimelinePoint,
} from "@/data/timeline";
import { cn } from "@/lib/utils";

/** 单个时间节点：官方日期与规划参考在视觉上必须可辨 */
function Point({ point }: { point: TimelinePoint | null }) {
  const { lang, t } = useLang();
  if (!point) {
    return <span className="text-[0.8125rem] text-muted-foreground">{t("未公布", "Not published")}</span>;
  }
  const isOfficial = point.precision === "official";
  return (
    <span className="inline-flex flex-col gap-1">
      <span
        className={cn(
          "text-[0.8125rem] leading-snug",
          isOfficial ? "score text-green" : "text-ink",
        )}>
        {lang === "zh" ? point.zh : point.en}
      </span>
      <span
        className={cn(
          "self-start px-1.5 py-0.5 text-[0.625rem] tracking-[0.08em]",
          isOfficial
            ? "border border-brass/60 bg-brass/10 text-[oklch(0.42_0.07_74)]"
            : "border border-dashed border-muted-foreground/50 text-muted-foreground",
        )}>
        {precisionLabel(point.precision, lang)}
      </span>
    </span>
  );
}

export default function Timeline() {
  const { lang, t } = useLang();

  const rows = useMemo(
    () =>
      SG_TIMELINES.map((tl) => ({
        tl,
        university: UNIVERSITIES.find((u) => u.id === tl.universityId)!,
      })).filter((r) => r.university),
    [],
  );

  const officialCount = useMemo(
    () =>
      SG_TIMELINES.reduce(
        (n, tl) =>
          n +
          [tl.applicationOpen, tl.applicationDeadline, tl.assessmentWindow, tl.offerWindow, tl.matriculation].filter(
            (p) => p?.precision === "official",
          ).length,
        0,
      ),
    [],
  );
  const totalPoints = SG_TIMELINES.length * 5;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PrintHeader title={t("WACE 升学时间轴", "WACE progression timeline")} />

      <div className="print-title-band border-b border-border bg-paper-deep/45">
        <div className="container flex flex-wrap items-end justify-between gap-4 py-8">
          <div>
            <p className="eyebrow text-brass">{t("WACE · 升学时间轴", "WACE · Progression timeline")}</p>
            <h1 className="mt-2 text-[1.875rem] leading-tight text-green">
              {t("12 月出分之后，每一步在什么时候", "What happens when, from the December results onwards")}
            </h1>
            <p className="mt-3 max-w-[70ch] font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-muted-foreground">
              {t(
                "BCI 的 WACE 学生 11 月完成考试、12 月取得正式 ATAR，以最终成绩申请，不依赖预估成绩。本页给出从考试到入学的完整节点，以及新加坡六所公立大学各自的申请窗口。",
                "BCI's WACE students sit their examinations in November and receive the official ATAR in December, applying on final results rather than predictions. This page sets out every stage from examination to matriculation, alongside the application window of each of the six Singapore public universities.",
              )}
            </p>
          </div>
          <PrintReportButton className="no-print" />
        </div>
      </div>

      {/* 01 主周期 */}
      <section className="border-b border-border">
        <Reveal className="container py-12">
          <span className="almanac-index">{t("第一节", "Section I")}</span>
          <h2 className="mt-1 flex items-baseline gap-3 text-[1.5rem] text-green">
            <CalendarClock className="h-5 w-5 shrink-0 text-brass" />
            {t("一个学年的主周期", "The cycle of one academic year")}
          </h2>

          <Stagger as="ol" className="mt-9 border-t border-border">
            {WACE_CYCLE.map((stage, i) => (
              <li
                key={stage.stageZh}
                className="grid gap-2 border-b border-border py-5 sm:grid-cols-[9rem_10rem_1fr] sm:gap-6">
                <span className="score flex items-baseline gap-2.5 text-[0.875rem] text-brass">
                  <span className="almanac-index">{String(i + 1).padStart(2, "0")}</span>
                  {lang === "zh" ? stage.windowZh : stage.windowEn}
                </span>
                <span className="text-[0.9375rem] leading-snug text-green">
                  {lang === "zh" ? stage.stageZh : stage.stageEn}
                </span>
                <span className="font-[family-name:var(--font-serif)] text-[0.875rem] leading-relaxed text-muted-foreground">
                  {lang === "zh" ? stage.focusZh : stage.focusEn}
                </span>
              </li>
            ))}
          </Stagger>
        </Reveal>
      </section>

      {/* 02 六校申请地图 */}
      <section className="border-b border-border bg-paper-deep/40">
        <Reveal className="container py-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="almanac-index">{t("第二节", "Section II")}</span>
              <h2 className="mt-1 text-[1.5rem] text-green">
                {t("新加坡六所公立大学的申请窗口", "Application windows at the six Singapore public universities")}
              </h2>
            </div>
            <p className="score text-[0.75rem] text-muted-foreground">
              {t(
                `${officialCount} / ${totalPoints} 项为官方日期`,
                `${officialCount} of ${totalPoints} points are official dates`,
              )}
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[54rem] border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-green">
                  {[
                    t("院校", "University"),
                    t("申请开放", "Opens"),
                    t("申请截止", "Deadline"),
                    t("选拔窗口", "Assessment"),
                    t("Offer 阶段", "Offers"),
                    t("入学", "Matriculation"),
                  ].map((h) => (
                    <th key={h} className="eyebrow px-3 py-2.5 text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ tl, university }) => (
                  <tr key={tl.universityId} className="border-b border-border align-top print-keep">
                    <td className="px-3 py-4">
                      <span className="block text-[0.9375rem] leading-snug text-green">
                        {lang === "zh" ? university.nameZh : university.name}
                      </span>
                      <span className="mt-1 flex flex-wrap items-baseline gap-x-2 text-[0.75rem] text-muted-foreground">
                        {university.abbr}
                        <QsRank universityId={university.id} />
                      </span>
                    </td>
                    <td className="px-3 py-4"><Point point={tl.applicationOpen} /></td>
                    <td className="px-3 py-4"><Point point={tl.applicationDeadline} /></td>
                    <td className="px-3 py-4"><Point point={tl.assessmentWindow} /></td>
                    <td className="px-3 py-4"><Point point={tl.offerWindow} /></td>
                    <td className="px-3 py-4"><Point point={tl.matriculation} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 max-w-[80ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
            {t(
              "标为「官方日期」的条目取自院校官网并逐校核验，可作为申请排期依据；标为「规划参考」的条目来自 BCI 内部规划稿的经验月份，仅供安排节奏，不构成院校承诺。每一招生年度开放后必须重新核验，不得沿用上一年度的日期。",
              "Entries marked as official dates are taken from the universities' own admissions pages and verified institution by institution; they can be relied on for scheduling. Entries marked as planning estimates come from BCI's internal planning draft and indicate rhythm only — they are not commitments by any university. Every intake cycle must be re-verified once it opens; last year's dates must never be carried forward.",
            )}
          </p>
        </Reveal>
      </section>

      {/* 03 出分之后 */}
      <section>
        <Reveal className="container py-12">
          <span className="almanac-index">{t("第三节", "Section III")}</span>
          <h2 className="mt-1 text-[1.5rem] text-green">
            {t("12 月出分之后到 8 月入学之间", "Between the December results and the August intake")}
          </h2>
          <p className="mt-4 max-w-[74ch] font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-muted-foreground">
            {t(
              "家长最关心的往往不是「能不能申请」，而是这八个月里学生具体在做什么。主路径是以正式 ATAR 申请新加坡公立大学；与此同时应当同步准备一条备选路径，而不是等结果出来再想办法。",
              "The question that matters most to parents is rarely whether an application can be made, but what the student is actually doing across these eight months. The main route is applying to the Singapore public universities on the official ATAR; a fallback should be prepared in parallel rather than improvised once outcomes arrive.",
            )}
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="border-l-2 border-brass bg-paper-deep/35 p-6">
              <p className="eyebrow text-brass">{t("主路径", "Main route")}</p>
              <ol className="mt-4 space-y-3">
                {[
                  t("12 月：取得正式 ATAR，确定可申请的院校与专业范围。", "December: receive the official ATAR and settle the range of reachable universities and programmes."),
                  t("1—3 月：在各校窗口内完成申请，逐项核对先修与英语要求。", "January to March: apply within each university's window, checking prerequisites and English requirements item by item."),
                  t("3—5 月：完成面试、笔试或作品集评审等附加考核。", "March to May: complete interviews, written tests or portfolio reviews where required."),
                  t("4—7 月：分批收到结果，比较 Offer 并在截止前确认。", "April to July: receive outcomes in batches, compare offers and confirm before the deadline."),
                  t("8 月：办理学生准证与注册，进入新学年。", "August: arrange the Student's Pass and registration, and begin the academic year."),
                ].map((line, i) => (
                  <li key={line} className="flex gap-3 text-[0.875rem] leading-relaxed text-ink">
                    <span className="almanac-index mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="border border-border bg-card p-6">
              <p className="eyebrow text-muted-foreground">{t("备选路径的口径", "How to talk about fallbacks")}</p>
              <p className="mt-4 font-[family-name:var(--font-serif)] text-[0.875rem] leading-relaxed text-ink">
                {t(
                  "备选路径应当在 12 月出分时就同步确认，而不是等到 Offer 不理想时才启动。但在对家长说明之前，任何衔接课程的开课时间、最短修读时长、学生准证安排、中途退出规则，以及与目标大学之间是否存在正式的升学衔接，都必须先取得书面确认。",
                  "A fallback should be settled alongside the December results rather than started once offers disappoint. Before any of it is described to parents, however, the start dates, minimum duration, Student's Pass arrangements and withdrawal terms of any pathway programme — and whether a formal progression agreement with the target university actually exists — must be confirmed in writing.",
                )}
              </p>
              <p className="mt-4 border-t border-border pt-4 text-[0.8125rem] leading-relaxed text-tier-reach">
                {t(
                  "未取得书面确认的衔接安排，不得作为招生承诺出现在任何面谈或宣传材料中。",
                  "A pathway arrangement without written confirmation must never appear as a recruitment commitment in any meeting or promotional material.",
                )}
              </p>
            </div>
          </div>

          <div className="no-print mt-8 border-t border-border pt-5 text-[0.8125rem] text-muted-foreground">
            {t("要看具体专业的门槛与选课，请用 ", "For a programme's threshold and subject plan, use ")}
            <Link href="/wace/reverse" className="text-brass hover:underline">
              {t("由目标规划", "Plan from a Target")}
            </Link>
            {t("；只定了方向还没定专业，请用 ", "; if only the field is settled, use ")}
            <Link href="/wace/field" className="text-brass hover:underline">
              {t("由方向规划", "Plan from a Field")}
            </Link>
            {t("。", ".")}
          </div>
        </Reveal>
      </section>

      {/* 数据口径 */}
      <section className="border-t border-border bg-paper-deep/40">
        <Reveal className="container py-8">
          <p className="eyebrow flex items-baseline gap-2 text-muted-foreground">
            <Info className="h-3.5 w-3.5 shrink-0" />
            {t("数据口径", "Data basis")}
          </p>
          <p className="mt-2.5 max-w-[80ch] font-[family-name:var(--font-serif)] text-[0.8125rem] leading-relaxed text-ink">
            {t(
              "申请窗口逐校取自院校官方招生页面，核验时间为 2026 年 8 月，对应 2026 / 2027 入学周期。选拔、Offer 与入学月份目前只有内部规划稿的经验值，已全部标为「规划参考」；这些字段在各校公布当年安排后应替换为官方日期。达到最低申请资格不等于录取保证。",
              "Application windows are taken from each university's official admissions pages, verified in August 2026 for the 2026/2027 intake. Assessment, offer and matriculation months are currently only internal planning estimates and are labelled as such; they should be replaced with official dates once each university publishes its schedule for the cycle. Meeting a minimum requirement does not guarantee an offer.",
            )}
          </p>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
