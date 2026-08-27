/**
 * 设计风格：Admissions Almanac
 * 我的目标清单页：把收藏的专业整理成一页可打印的年鉴式报告。
 * 结构为「概览统计 → 门槛标尺 → 按地区分节的条目表 → 科目必要度」，
 * 分数一律等宽右对齐，规则线分节，不使用卡片网格。
 */
import { useMemo } from "react";
import { ArrowRight, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { Tick } from "@/components/Motion";
import { QsRank } from "@/components/QsRank";
import { PrintHeader } from "@/components/PrintHeader";
import { PrintReportButton } from "@/components/PrintReportButton";
import { ScoreRule } from "@/components/ScoreRule";
import { REGIONS, SUBJECTS } from "@/data/universities";
import {
  LEVEL_EN,
  adviseSubjectsBy,
  extraLabel,
  subjectLabelBy,
} from "@/lib/matching";
import { useLang } from "@/contexts/LangContext";
import { useShortlist } from "@/contexts/ShortlistContext";
import { cn } from "@/lib/utils";

export default function Shortlist() {
  const { t, lang } = useLang();
  const { resolved, remove, clear, count } = useShortlist();

  /** 清单内的门槛跨度：跨度越大越需要在保底与冲刺之间设置备选 */
  const thresholds = useMemo(
    () =>
      resolved
        .map((item) => item.programme.atar ?? item.university.minAtar)
        .filter((v): v is number => v !== null),
    [resolved],
  );

  const stats = useMemo(() => {
    const universities = new Set(resolved.map((r) => r.university.id));
    const regions = new Set(resolved.map((r) => r.university.region));
    const highest = thresholds.length > 0 ? Math.max(...thresholds) : null;
    const lowest = thresholds.length > 0 ? Math.min(...thresholds) : null;
    return { universities: universities.size, regions: regions.size, highest, lowest };
  }, [resolved, thresholds]);

  /** 复用选课引擎：把清单当作目标集合，统计各科目的必要度 */
  const subjectAdvice = useMemo(() => {
    if (resolved.length === 0) return [];
    return adviseSubjectsBy(
      resolved.map((r) => ({ universityId: r.university.id, programmeId: r.programme.id })),
      lang,
    );
  }, [resolved, lang]);

  /** 标尺标记：取清单内最具代表性的门槛，避免标签过密 */
  const markers = useMemo(() => {
    const uniqueByValue = new Map<number, string>();
    for (const item of resolved) {
      const value = item.programme.atar ?? item.university.minAtar;
      if (value === null) continue;
      if (!uniqueByValue.has(value)) uniqueByValue.set(value, item.university.abbr);
    }
    return Array.from(uniqueByValue.entries())
      .sort((a, b) => a[0] - b[0])
      .slice(0, 6)
      .map(([value, abbr]) => ({ label: `${abbr} ${value.toFixed(0)}`, value }));
  }, [resolved]);

  const sections = useMemo(
    () =>
      REGIONS.map((region) => ({
        region,
        rows: resolved
          .filter((r) => r.university.region === region.id)
          .sort((a, b) => {
            const av = a.programme.atar ?? a.university.minAtar ?? -1;
            const bv = b.programme.atar ?? b.university.minAtar ?? -1;
            return bv - av;
          }),
      })).filter((s) => s.rows.length > 0),
    [resolved],
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="print-title-band border-b border-border bg-paper-deep/45">
        <div className="container py-10">
          <span className="eyebrow text-brass">{t("目标清单 · Shortlist", "Shortlist")}</span>
          <h1 className="mt-3 text-[2.25rem] leading-tight text-green">
            {t("我的目标清单", "My shortlist")}
          </h1>
          <p className="mt-4 max-w-[64ch] font-[family-name:var(--font-serif)] text-[1rem] leading-relaxed text-muted-foreground">
            {t(
              "在查询页收藏的专业会汇总到这里，形成一份可打印的目标报告。清单只保存在本机浏览器，换设备不会同步。",
              "Programmes saved from the query pages are collected here as a printable target report. The shortlist is stored in this browser only and does not sync across devices.",
            )}
          </p>
        </div>
      </div>

      {count === 0 ? (
        <div className="container py-20">
          <div className="border border-dashed border-border px-8 py-20 text-center">
            <p className="font-[family-name:var(--font-serif)] text-[1rem] leading-relaxed text-muted-foreground">
              {t(
                "清单还是空的。在「有成绩规划」或「由目标规划」页点击收藏按钮，即可把候选专业加入这里。",
                "The shortlist is empty. Use the save button on the forward or reverse lookup pages to add candidate programmes.",
              )}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/wace/forward"
                className="inline-flex items-center gap-2 border border-green bg-green px-5 py-2.5 text-[0.875rem] text-primary-foreground transition-colors hover:bg-green-soft">
                {t("有成绩规划", "Plan from grades")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/wace/reverse"
                className="inline-flex items-center gap-2 border border-green px-5 py-2.5 text-[0.875rem] text-green transition-colors hover:bg-green/8">
                {t("由目标规划", "Plan from a target")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="container py-12">
          <PrintHeader
            title={t("我的目标清单", "My shortlist")}
            subtitle={t(
              `共 ${count} 个目标专业，涉及 ${stats.universities} 所院校。门槛为院校官方公布的最低要求，非录取保证。`,
              `${count} target programmes across ${stats.universities} universities. Thresholds are official published minimums and not guarantees of an offer.`,
            )}
          />

          {/* 概览统计 */}
          <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-green pb-3">
            <div>
              <span className="almanac-index">{t("概览 / OVERVIEW", "OVERVIEW")}</span>
              <h2 className="mt-1 text-[1.375rem] text-green">
                {t("清单概览", "Shortlist overview")}
              </h2>
            </div>
            <div className="no-print flex flex-wrap items-center gap-3">
              <Link
                href="/wace/subjects"
                className="inline-flex items-center gap-1.5 border border-green px-3.5 py-2 text-[0.8125rem] text-green transition-colors hover:bg-green/5">
                {t("据此规划选课", "Plan subjects from this list")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <PrintReportButton compact />
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-1.5 border border-input px-3 py-2 text-[0.8125rem] text-muted-foreground transition-colors hover:border-tier-reach hover:text-tier-reach">
                <Trash2 className="h-3.5 w-3.5" />
                {t("清空清单", "Clear all")}
              </button>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 border-b border-border pb-8 sm:grid-cols-4">
            <div>
              <dd className="score text-[1.75rem] leading-none text-green"><Tick>{count}</Tick></dd>
              <dt className="mt-1.5 text-[0.75rem] text-muted-foreground">
                {t("收藏专业", "Programmes")}
              </dt>
            </div>
            <div>
              <dd className="score text-[1.75rem] leading-none text-green"><Tick>{stats.universities}</Tick></dd>
              <dt className="mt-1.5 text-[0.75rem] text-muted-foreground">
                {t("涉及院校", "Universities")}
              </dt>
            </div>
            <div>
              <dd className="score text-[1.75rem] leading-none text-green">
                <Tick>{stats.highest === null ? "—" : stats.highest.toFixed(2)}</Tick>
              </dd>
              <dt className="mt-1.5 text-[0.75rem] text-muted-foreground">
                {t("最高门槛", "Highest threshold")}
              </dt>
            </div>
            <div>
              <dd className="score text-[1.75rem] leading-none text-green">
                <Tick>{stats.lowest === null ? "—" : stats.lowest.toFixed(2)}</Tick>
              </dd>
              <dt className="mt-1.5 text-[0.75rem] text-muted-foreground">
                {t("最低门槛", "Lowest threshold")}
              </dt>
            </div>
          </dl>

          {/* 门槛标尺 */}
          {markers.length > 0 && (
            <section className="mt-10">
              <span className="almanac-index">{t("标尺 / SCORE RULE", "SCORE RULE")}</span>
              <h2 className="mt-1 text-[1.125rem] text-green">
                {t("清单的门槛跨度", "Threshold span across the shortlist")}
              </h2>
              <div className="threshold-hairline mt-3" />
              <div className="mt-6">
                <ScoreRule markers={markers} />
              </div>
              <p className="mt-4 text-[0.75rem] leading-relaxed text-muted-foreground">
                {t(
                  "跨度越大，越需要在保底与冲刺之间保留备选。建议清单中同时包含低于预计分数 3 分以上的保底专业。",
                  "The wider the span, the more important it is to keep both safety and reach options. Include at least one programme sitting three or more points below the projected ATAR.",
                )}
              </p>
            </section>
          )}

          {/* 按地区分节的条目 */}
          <div className="mt-12 space-y-10">
            {sections.map((section, si) => (
              <section key={section.region.id}>
                <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1.5">
                  <div>
                    <span className="almanac-index">
                      {String(si + 1).padStart(2, "0")} · SECTION
                    </span>
                    <h3 className="mt-0.5 text-[1.125rem] text-green">
                      {lang === "zh" ? section.region.label : section.region.labelEn}
                      <span className="score ml-2.5 text-[0.8125rem] font-normal text-muted-foreground">
                        {section.rows.length}
                      </span>
                    </h3>
                  </div>
                  <p className="max-w-[46ch] font-[family-name:var(--font-serif)] text-[0.75rem] leading-relaxed text-muted-foreground sm:text-right">
                    {lang === "zh" ? section.region.channel : section.region.channelEn}
                  </p>
                </header>
                <div className="threshold-hairline mt-2" />

                {/* 手机端卡片 */}
                <div className="print-hide-mobile mt-3 space-y-3 md:hidden">
                  {section.rows.map((item) => {
                    const threshold = item.programme.atar ?? item.university.minAtar;
                    return (
                      <article key={`${item.universityId}-${item.programmeId}`} className="border border-border bg-card p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h4 className="text-[0.9375rem] leading-snug text-green">
                              {lang === "zh" ? item.university.nameZh : item.university.name}
                              <span className="mx-1 text-brass">·</span>
                              {lang === "zh" ? item.programme.nameZh : item.programme.name}
                            </h4>
                            <p className="mt-1 text-[0.6875rem] text-muted-foreground">
                              {item.university.abbr} · {lang === "zh" ? item.programme.name : item.programme.nameZh}
                            </p>
                            <p className="mt-1.5">
                              <QsRank universityId={item.universityId} />
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(item.universityId, item.programmeId)}
                            title={t("移除", "Remove")}
                            className="no-print shrink-0 border border-input p-1 text-muted-foreground transition-colors hover:border-tier-reach hover:text-tier-reach">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
                          <div>
                            <span className="eyebrow text-muted-foreground">{t("门槛", "Threshold")}</span>
                            <p className="score mt-1 text-[1.25rem] leading-none text-brass">
                              {threshold === null ? t("未公布", "N/A") : threshold.toFixed(2)}
                            </p>
                          </div>
                          {item.programme.extras.length > 0 && (
                            <p className="max-w-[9rem] text-right text-[0.6875rem] leading-relaxed text-[oklch(0.48_0.07_74)]">
                              {item.programme.extras.map((e) => extraLabel(e, lang)).join(lang === "zh" ? "、" : ", ")}
                            </p>
                          )}
                        </div>
                        {item.programme.atarNote && (
                          <p className="mt-3 font-[family-name:var(--font-serif)] text-[0.8125rem] leading-relaxed text-muted-foreground">
                            {lang === "zh" ? item.programme.atarNote : (item.programme.atarNoteEn ?? item.programme.atarNote)}
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>

                {/* 桌面端表格 */}
                <div className="print-show-table hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[44rem] border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="eyebrow w-10 py-2.5 pr-2 text-left text-muted-foreground">No.</th>
                        <th className="eyebrow py-2.5 pr-4 text-left text-muted-foreground">
                          {t("院校与专业", "University & programme")}
                        </th>
                        <th className="eyebrow py-2.5 pr-4 text-left text-muted-foreground">
                          {t("门槛口径与附加要求", "Basis & extras")}
                        </th>
                        <th className="eyebrow w-24 py-2.5 pr-3 text-right text-muted-foreground">
                          {t("所需 ATAR", "Required ATAR")}
                        </th>
                        <th className="eyebrow w-16 py-2.5 text-right text-muted-foreground">
                          {t("操作", "Action")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows.map((item, i) => {
                        const threshold = item.programme.atar ?? item.university.minAtar;
                        return (
                          <tr
                            key={`${item.universityId}-${item.programmeId}`}
                            className="border-b border-border/70 align-top">
                            <td className="almanac-index py-3.5 pr-2">{String(i + 1).padStart(2, "0")}</td>
                            <td className="py-3.5 pr-4">
                              <span className="text-[0.9375rem] leading-snug text-green">
                                {lang === "zh" ? item.university.nameZh : item.university.name}
                                <span className="mx-1.5 text-brass">·</span>
                                {lang === "zh" ? item.programme.nameZh : item.programme.name}
                              </span>
                              <span className="mt-0.5 block text-[0.6875rem] leading-snug text-muted-foreground">
                                {item.university.abbr} · {lang === "zh" ? item.programme.name : item.programme.nameZh}
                              </span>
                              <span className="mt-1 block">
                                <QsRank universityId={item.universityId} />
                              </span>
                            </td>
                            <td className="py-3.5 pr-4">
                              {item.programme.atarNote && (
                                <span className="block font-[family-name:var(--font-serif)] text-[0.8125rem] leading-relaxed text-muted-foreground">
                                  {lang === "zh" ? item.programme.atarNote : (item.programme.atarNoteEn ?? item.programme.atarNote)}
                                </span>
                              )}
                              {item.programme.extras.length > 0 && (
                                <span className="mt-1.5 flex flex-wrap gap-1.5">
                                  {item.programme.extras.map((e) => (
                                    <span
                                      key={e}
                                      className="border border-brass/50 bg-brass/8 px-1.5 py-0.5 text-[0.6875rem] text-[oklch(0.45_0.07_74)]">
                                      {extraLabel(e, lang)}
                                    </span>
                                  ))}
                                </span>
                              )}
                            </td>
                            <td className="score py-3.5 pr-3 text-right text-[1rem] text-ink">
                              {threshold === null ? "—" : threshold.toFixed(2)}
                            </td>
                            <td className="py-3.5 text-right">
                              <button
                                type="button"
                                onClick={() => remove(item.universityId, item.programmeId)}
                                title={t("移除", "Remove")}
                                className="no-print inline-flex border border-input p-1 text-muted-foreground transition-colors hover:border-tier-reach hover:text-tier-reach">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>

          {/* 科目必要度 */}
          {subjectAdvice.length > 0 && (
            <section className="mt-14 border-t-2 border-green pt-6">
              <span className="almanac-index">{t("附录 / SUBJECTS", "SUBJECTS")}</span>
              <h2 className="mt-1 text-[1.375rem] text-green">
                {t("清单对应的科目必要度", "Subject requirements across the shortlist")}
              </h2>
              <p className="mt-3 max-w-[64ch] font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-muted-foreground">
                {t(
                  "按清单内目标专业的先修要求统计。标记为「必需」的科目若缺失，将直接影响清单中多个目标的申请资格。",
                  "Compiled from the prerequisites of the programmes on this shortlist. Missing a course marked essential will directly affect eligibility for several targets.",
                )}
              </p>
              <div className="mt-6 grid gap-x-12 gap-y-4 md:grid-cols-2">
                {subjectAdvice.map((advice) => {
                  const meta = SUBJECTS.find((s) => s.key === advice.subject);
                  return (
                    <div
                      key={advice.subject}
                      className="flex items-start justify-between gap-4 border-b border-border pb-3">
                      <div className="min-w-0">
                        <span className="text-[0.9375rem] text-green">
                          {subjectLabelBy(advice.subject, lang)}
                        </span>
                        {meta && (
                          <span className="mt-0.5 block text-[0.6875rem] text-muted-foreground">
                            {lang === "zh" ? meta.en : meta.zh}
                          </span>
                        )}
                        <span className="mt-1 block font-[family-name:var(--font-serif)] text-[0.8125rem] leading-relaxed text-muted-foreground">
                          {advice.reason}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 border px-2 py-0.5 text-[0.6875rem]",
                          advice.level === "必需"
                            ? "border-tier-reach bg-tier-reach/8 text-tier-reach"
                            : advice.level === "强烈建议"
                              ? "border-brass bg-brass/10 text-[oklch(0.45_0.07_74)]"
                              : "border-input text-muted-foreground",
                        )}>
                        {lang === "zh" ? advice.level : LEVEL_EN[advice.level]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <p className="mt-12 border-t border-border pt-5 text-[0.75rem] leading-relaxed text-muted-foreground">
            {t(
              "说明：门槛为院校官方公布的最低要求，非录取保证。清单仅保存在当前浏览器，清除浏览数据会一并删除。建议导出 PDF 留档，并在面谈时与升学顾问逐条确认。",
              "Note: thresholds are official published minimums and not guarantees of an offer. The shortlist is stored only in this browser and will be lost if browsing data is cleared. Export the PDF for your records and confirm each entry with a counsellor.",
            )}
          </p>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
