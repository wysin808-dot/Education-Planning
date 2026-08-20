/**
 * 设计风格：Admissions Almanac
 * 选课规划页：直接输出可执行的 Year 11 / Year 12 选课方案。
 * 页面顺序为「结论 → 依据 → 附录」：先给具体组合与冲突诊断，
 * 再列出科目必要度统计，最后才是与目标无关的通用参考资料。
 * 所有推荐均由目标专业的官方先修要求推导，不得凭经验虚构。
 */
import { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, ChevronDown, ListChecks } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { Stagger } from "@/components/Motion";
import { PrintHeader } from "@/components/PrintHeader";
import { PrintReportButton } from "@/components/PrintReportButton";
import { FIELDS, HEMISPHERES, SUBJECTS, type Hemisphere } from "@/data/universities";
import {
  YEAR11_SIZE,
  YEAR12_SIZE,
  buildSubjectPlan,
  groupLabel,
  planRoleLabel,
  scalingLabel,
  subjectLabelBy,
  type PlanSubject,
} from "@/lib/matching";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LangContext";
import { useShortlist } from "@/contexts/ShortlistContext";

const ROLE_STYLE: Record<PlanSubject["role"], string> = {
  english: "border-green/40 bg-green/8 text-green",
  chinese: "border-green/40 bg-green/8 text-green",
  required: "border-tier-reach/45 bg-tier-reach/8 text-tier-reach",
  choice: "border-brass/50 bg-brass/8 text-[oklch(0.42_0.07_74)]",
  filler: "border-tier-unknown/45 bg-tier-unknown/8 text-tier-unknown",
};

export default function Subjects() {
  const { t, lang } = useLang();
  /** 目标清单是全站唯一来源（收藏于本机浏览器），本页只读 */
  const { resolved: shortlist } = useShortlist();
  /** BCI 提供北半球与南半球两个课程序列，开设科目不同 */
  const [hemisphere, setHemisphere] = useState<Hemisphere>("south");
  const [showCourses, setShowCourses] = useState(false);

  const targets = useMemo(
    () =>
      shortlist.map((item) => ({
        universityId: item.universityId,
        programmeId: item.programmeId,
      })),
    [shortlist],
  );

  const plan = useMemo(
    () => buildSubjectPlan(targets, hemisphere, lang),
    [targets, hemisphere, lang],
  );

  const hemisphereMeta = HEMISPHERES.find((h) => h.id === hemisphere);
  const requiredCount = plan.year11.filter((s) => s.role === "required").length;
  const hasTargets = targets.length > 0;

  /** 方案中的一行科目 */
  function SubjectRow({ item, index }: { item: PlanSubject; index: number }) {
    const meta = SUBJECTS.find((s) => s.key === item.subject);
    return (
      <li className="flex items-start gap-4 border-b border-border bg-card px-5 py-4 last:border-b-0">
        <span className="almanac-index mt-1 shrink-0">{String(index + 1).padStart(2, "0")}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <h4 className="text-[0.9375rem] leading-snug text-green">
              {subjectLabelBy(item.subject, lang)}
            </h4>
            <span
              className={cn(
                "border px-1.5 py-0.5 text-[0.625rem] tracking-[0.08em]",
                ROLE_STYLE[item.role],
              )}>
              {planRoleLabel(item.role, lang)}
            </span>
            {meta && (
              <span className="text-[0.6875rem] text-muted-foreground">
                {groupLabel(meta.group, lang)} · scaling {scalingLabel(meta.scaling, lang)}
              </span>
            )}
          </div>

          {item.role === "english" && (
            <p className="mt-1.5 text-[0.75rem] leading-relaxed text-muted-foreground">
              {t(
                "英语非第一语言的学生按 EALD 修读，既满足 WACE 毕业的英语要求，评分对照组也更贴近自身情况，两年均须修读。",
                "Students whose first language is not English take EALD: it satisfies the WACE English graduation requirement and is assessed against a more comparable cohort. Taken across both years.",
              )}
            </p>
          )}

          {item.role === "chinese" && (
            <p className="mt-1.5 text-[0.75rem] leading-relaxed text-muted-foreground">
              {t(
                "中文母语程度的学生修读第一语言中文，是最稳定的得分来源，同时可作为香港院校中文语言要求的佐证。BCI 仅在南半球序列开设。",
                "Native-level Chinese speakers take Chinese: First Language as their most reliable source of marks; it also evidences the Chinese language requirement at Hong Kong universities. BCI offers it only in the Southern Hemisphere sequence.",
              )}
            </p>
          )}

          {item.role === "required" && item.supports.length > 0 && (
            <p className="mt-1.5 text-[0.75rem] leading-relaxed text-muted-foreground">
              {t("支撑目标：", "Required by: ")}
              {item.supports.slice(0, 4).join(lang === "zh" ? "、" : "; ")}
              {item.supports.length > 4 &&
                t(` 等 ${item.supports.length} 个`, ` and ${item.supports.length - 4} more`)}
            </p>
          )}

          {item.role === "filler" && (
            <p className="mt-1.5 text-[0.75rem] leading-relaxed text-muted-foreground">
              {t(
                "目标清单未占满名额，此科目按 scaling 表现补位，可依学生强项替换。",
                "The shortlist does not fill every slot; this course is added for its scaling and can be swapped for a personal strength.",
              )}
            </p>
          )}

          {item.alternatives.length > 0 && (
            <p className="mt-1.5 text-[0.75rem] text-muted-foreground">
              {t("组内可替换：", "Interchangeable with: ")}
              {item.alternatives.map((k) => subjectLabelBy(k, lang)).join(lang === "zh" ? "、" : ", ")}
              {t("（任选其一即可满足）", " (any one satisfies the requirement)")}
            </p>
          )}
        </div>
        {item.requiredBy > 0 && (
          <span className="score shrink-0 pt-0.5 text-[0.75rem] text-muted-foreground">
            {item.requiredBy}/{plan.targetCount}
          </span>
        )}
      </li>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />

      {/* 标题区 */}
      <section className="border-b border-border bg-paper-deep/35">
        <div className="container py-9 lg:py-12">
          <p className="eyebrow text-brass">WACE · SUBJECT PLANNER</p>
          <h1 className="mt-3 font-[family-name:var(--font-serif)] text-3xl text-green sm:text-4xl">
            {t("Year 11 与 Year 12 选课方案", "Year 11 and Year 12 subject plan")}
          </h1>
          <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
            {t(
              `本页依据目标清单中各专业的官方先修要求，直接给出两年各 ${YEAR11_SIZE} 门的具体组合，并指出无法同时满足的目标。BCI 中国学生以 EALD 与中文（第一语言）为锁定科目，Year 12 由五门中取最好的四门计入 ATAR。`,
              `Working from the official prerequisites of the shortlisted programmes, this page produces a concrete set of ${YEAR11_SIZE} courses for each year and flags targets that cannot be satisfied together. For BCI's Chinese students EALD and Chinese: First Language are locked, and the best four of the five Year 12 courses count towards the ATAR.`,
            )}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-border pt-6">
            <span className="text-[0.75rem] tracking-[0.14em] text-muted-foreground">
              {t("BCI 课程序列", "BCI course sequence")}
            </span>
            <div className="no-print flex">
              {HEMISPHERES.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setHemisphere(h.id)}
                  className={cn(
                    "border px-3 py-1.5 text-[0.8125rem] transition-colors duration-150",
                    hemisphere === h.id
                      ? "border-green bg-green text-primary-foreground"
                      : "border-input text-muted-foreground hover:border-brass hover:text-green",
                  )}>
                  {lang === "zh" ? h.label : h.labelEn}
                </button>
              ))}
            </div>
            <span className="text-[0.75rem] text-muted-foreground">
              {lang === "zh" ? hemisphereMeta?.note : hemisphereMeta?.noteEn}
            </span>
          </div>
        </div>
      </section>

      <div className="container py-9">
        <PrintHeader title={t("WACE 选课方案", "WACE subject plan")} />

        {/* 依据说明 */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <p className="text-[0.8125rem] text-muted-foreground">
            {hasTargets ? (
              <>
                {t("方案依据：目标清单中的 ", "Based on ")}
                <span className="score text-green">{plan.targetCount}</span>
                {t(" 个目标专业", " shortlisted programmes")}
              </>
            ) : (
              t(
                "目标清单为空，以下为 BCI 通用的稳妥组合，收藏目标后会按官方先修要求重新计算。",
                "The shortlist is empty, so a general BCI-safe combination is shown. Save targets and the plan recalculates from official prerequisites.",
              )
            )}
          </p>
          <div className="no-print flex gap-2">
            <Link
              href="/wace/shortlist"
              className="inline-flex items-center gap-2 border border-input px-3 py-1.5 text-[0.8125rem] text-green transition-colors hover:border-brass">
              <ListChecks className="h-3.5 w-3.5 text-brass" />
              {t("管理目标清单", "Manage shortlist")}
            </Link>
            <PrintReportButton compact />
          </div>
        </div>

        {/* 冲突诊断 */}
        {(plan.overflow.length > 0 || plan.unavailable.length > 0) && (
          <div className="mt-6 space-y-3">
            {plan.overflow.length > 0 && (
              <div className="flex items-start gap-2.5 border border-tier-reach/50 bg-tier-reach/8 px-4 py-3.5 text-[0.8125rem] leading-relaxed text-tier-reach">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-medium">
                    {t("目标之间存在选课冲突", "These targets conflict on subjects")}
                  </p>
                  <p className="mt-1">
                    {t(
                      `清单要求的先修科目超出 Year 11 可修读的名额，以下科目未能纳入：`,
                      "The shortlist demands more prerequisites than Year 11 can hold. These were left out: ",
                    )}
                    <strong>
                      {plan.overflow
                        .map((s) => subjectLabelBy(s.subject, lang))
                        .join(lang === "zh" ? "、" : ", ")}
                    </strong>
                  </p>
                  <p className="mt-1.5">
                    {t("受影响的目标：", "Affected targets: ")}
                    {Array.from(new Set(plan.overflow.flatMap((s) => s.supports))).join(
                      lang === "zh" ? "、" : "; ",
                    )}
                    {t(
                      "。若要保留这些目标，需放弃方向差异最大的其他目标。",
                      ". Keeping them means dropping the targets furthest from this direction.",
                    )}
                  </p>
                </div>
              </div>
            )}
            {plan.unavailable.length > 0 && (
              <div className="flex items-start gap-2.5 border border-brass/50 bg-brass/8 px-4 py-3.5 text-[0.8125rem] leading-relaxed text-[oklch(0.42_0.07_74)]">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-medium">
                    {t("本序列未开设所需科目", "Required course not offered in this sequence")}
                  </p>
                  <p className="mt-1">
                    {plan.unavailable
                      .map(
                        (u) =>
                          `${subjectLabelBy(u.subject, lang)}（${u.supports.join(lang === "zh" ? "、" : "; ")}）`,
                      )
                      .join(lang === "zh" ? "；" : " / ")}
                    {t(
                      `。当前为「${lang === "zh" ? hemisphereMeta?.label : hemisphereMeta?.labelEn}」，请与升学指导办公室确认替代方案或调整入学序列。`,
                      ". Confirm an alternative or a different intake sequence with the Admissions Office.",
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Year 11 / Year 12 方案 */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-10">
          <section>
            <div className="flex items-baseline justify-between gap-4 border-b-2 border-green pb-3">
              <div>
                <span className="almanac-index">{t("方案一", "Stage one")}</span>
                <h2 className="mt-0.5 font-[family-name:var(--font-serif)] text-[1.375rem] text-green">
                  Year 11
                </h2>
              </div>
              <span className="score text-[0.8125rem] text-muted-foreground">
                {plan.year11.length} {t("门", "courses")}
              </span>
            </div>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
              {t(
                "Year 11 修读五门。锁定 EALD 与中文（第一语言）之后，其余名额按目标清单的官方先修填补，避免过早关闭方向。",
                "Five courses in Year 11. With EALD and Chinese: First Language locked, the remaining slots follow the official prerequisites of the shortlist so that no pathway closes prematurely.",
              )}
            </p>
            <Stagger as="ul" className="mt-4 border border-border">
              {plan.year11.map((item, i) => (
                <SubjectRow key={item.subject} item={item} index={i} />
              ))}
            </Stagger>
          </section>

          <section>
            <div className="flex items-baseline justify-between gap-4 border-b-2 border-green pb-3">
              <div>
                <span className="almanac-index">{t("方案二", "Stage two")}</span>
                <h2 className="mt-0.5 font-[family-name:var(--font-serif)] text-[1.375rem] text-green">
                  Year 12
                </h2>
              </div>
              <span className="score text-[0.8125rem] text-muted-foreground">
                {plan.year12.length} {t("门", "courses")}
              </span>
            </div>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
              {t(
                "Year 12 同样修读五门，由其中最好的四门计入 ATAR，多出的一门为备份，可抵御单科失手。",
                "Five courses again in Year 12, with the best four counting towards the ATAR. The extra course acts as a buffer against one weak result.",
              )}
            </p>
            <Stagger as="ul" className="mt-4 border border-border">
              {plan.year12.map((item, i) => (
                <SubjectRow key={item.subject} item={item} index={i} />
              ))}
            </Stagger>

            {plan.dropped.length > 0 && (
              <div className="mt-4 border border-dashed border-border bg-paper-deep/30 px-5 py-4">
                <p className="eyebrow text-muted-foreground">
                  {t("Year 12 建议放弃", "Recommended to drop")}
                </p>
                <p className="mt-2 text-[0.875rem] text-green">
                  {plan.dropped
                    .map((s) => subjectLabelBy(s.subject, lang))
                    .join(lang === "zh" ? "、" : ", ")}
                </p>
                <p className="mt-1.5 text-[0.75rem] leading-relaxed text-muted-foreground">
                  {t(
                    "该科目未被目标专业列为先修，或被要求的次数最少，放弃后不影响清单内目标的申请资格。",
                    "This course is not a prerequisite for the shortlist, or is required least often; dropping it does not affect eligibility for the saved targets.",
                  )}
                </p>
              </div>
            )}
          </section>
        </div>

        {/* 推导依据 */}
        {hasTargets && (
          <section className="mt-12">
            <div className="flex items-baseline justify-between gap-4 border-b-2 border-green pb-3">
              <h2 className="font-[family-name:var(--font-serif)] text-[1.25rem] text-green">
                {t("推导依据", "How this was derived")}
              </h2>
              <span className="score text-[0.8125rem] text-muted-foreground">
                {requiredCount} {t("门由目标决定", "target-driven")}
              </span>
            </div>
            <div className="mt-5 grid gap-x-10 gap-y-4 md:grid-cols-2">
              <ol className="space-y-2.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
                <li className="flex gap-2.5">
                  <span className="almanac-index shrink-0">01</span>
                  {t(
                    "英语线固定占一门：英语或 EALD 为毕业与院校语言要求所必需。",
                    "The English line takes one slot: English or EALD is required for graduation and university language conditions.",
                  )}
                </li>
                <li className="flex gap-2.5">
                  <span className="almanac-index shrink-0">02</span>
                  {t(
                    "逐个读取清单内专业的官方先修要求，按被要求的目标数排序。",
                    "Each shortlisted programme's official prerequisites are read and ranked by how many targets require them.",
                  )}
                </li>
                <li className="flex gap-2.5">
                  <span className="almanac-index shrink-0">03</span>
                  {t(
                    "遇到「甲 或 乙」的要求时，组内只选一门（优先已被其他目标要求、scaling 更高者），不重复占位。",
                    "Where a requirement reads “A or B”, only one course is taken — preferring the one already required elsewhere, then the stronger scaling — so no slot is wasted.",
                  )}
                </li>
                <li className="flex gap-2.5">
                  <span className="almanac-index shrink-0">04</span>
                  {t(
                    "名额未满时，按 scaling 表现补位；名额不足时，报出冲突而非静默丢弃目标。",
                    "Remaining slots are filled by scaling strength; if slots run out, the conflict is reported rather than silently dropping a target.",
                  )}
                </li>
              </ol>
              <div className="border-l-2 border-brass bg-paper-deep/35 px-5 py-4">
                <p className="eyebrow text-brass">{t("口径声明", "Basis")}</p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {t(
                    "先修要求均引自各校官方招生页，未公布要求的专业不参与推导。scaling 为相对强弱参考，不代表官方换算公式。最终选课须经升学指导办公室确认。",
                    "Prerequisites are taken from each university's official admissions pages; programmes without published requirements do not affect the plan. Scaling is a relative indication, not an official conversion. Final choices must be confirmed with the Admissions Office.",
                  )}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 空清单引导 */}
        {!hasTargets && (
          <section className="no-print mt-10 border border-border bg-card px-6 py-7">
            <h2 className="font-[family-name:var(--font-serif)] text-[1.25rem] text-green">
              {t("让方案贴合你的目标", "Make this plan yours")}
            </h2>
            <p className="mt-2 max-w-[60ch] text-[0.875rem] leading-relaxed text-muted-foreground">
              {t(
                "上面是通用组合。在查询页收藏目标专业后，本页会按这些专业的官方先修要求重新计算两年的科目，并指出彼此冲突的目标。",
                "The plan above is generic. Save target programmes on the search pages and it will be recalculated from their official prerequisites, including any conflicts between them.",
              )}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/wace/forward"
                className="inline-flex items-center gap-2 border border-green bg-green px-4 py-2 text-[0.875rem] text-primary-foreground transition-colors duration-150 hover:bg-green-soft">
                {t("有成绩规划", "Plan with a score")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/wace/reverse"
                className="inline-flex items-center gap-2 border border-green px-4 py-2 text-[0.875rem] text-green transition-colors duration-150 hover:bg-green/5">
                {t("由目标规划", "Plan from a target")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}
      </div>

      {/* 附录：方向建议与课程目录 */}
      <section className="border-t border-border bg-paper-deep/45">
        <div className="container py-12">
          <span className="almanac-index">{t("附录 A", "Appendix A")}</span>
          <h2 className="mt-1 font-[family-name:var(--font-serif)] text-[1.5rem] text-green">
            {t("按专业方向的通用取向", "General direction by field")}
          </h2>
          <p className="mt-2 max-w-[64ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
            {t(
              "以下为不依赖具体清单的方向性参考，用于初步判断；正式选课以上方按目标推导的方案为准。",
              "A directional reference that does not depend on a shortlist, useful for orientation. The plan above, derived from actual targets, governs the final choice.",
            )}
          </p>
          <div className="mt-7 grid gap-x-12 gap-y-5 lg:grid-cols-3">
            {FIELDS.map((f, i) => (
              <div key={f.key} className="border-t border-green/25 pt-3.5">
                <h3 className="text-[0.9375rem] text-green">
                  <span className="almanac-index mr-2">{String(i + 1).padStart(2, "0")}</span>
                  {lang === "zh" ? f.zh : f.en}
                </h3>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {lang === "zh" ? f.advice : f.adviceEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container py-12">
          <button
            type="button"
            onClick={() => setShowCourses((v) => !v)}
            className="no-print flex w-full items-center justify-between gap-4 border-b border-border pb-3 text-left">
            <div>
              <span className="almanac-index">{t("附录 B", "Appendix B")}</span>
              <h2 className="mt-1 font-[family-name:var(--font-serif)] text-[1.5rem] text-green">
                {t(
                  `BCI 批准的 WACE ATAR 课程（${SUBJECTS.length} 门）`,
                  `BCI approved WACE ATAR courses (${SUBJECTS.length})`,
                )}
              </h2>
            </div>
            <ChevronDown
              className={cn(
                "h-5 w-5 shrink-0 text-brass transition-transform duration-200",
                showCourses && "rotate-180",
              )}
            />
          </button>

          {showCourses && (
            <div className="mt-6">
              <p className="max-w-[64ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
                {t(
                  "北半球序列 11 门、南半球序列 16 门。scaling 为该科目对 ATAR 贡献的相对强弱参考，用于组合选课时权衡，不代表任何官方换算公式。",
                  "Eleven courses in the Northern Hemisphere sequence and sixteen in the Southern. Scaling indicates a course's relative contribution to an ATAR for weighing combinations; it is not an official conversion.",
                )}
              </p>

              <div className="mt-6 space-y-3 md:hidden">
                {SUBJECTS.map((s) => (
                  <article key={s.key} className="border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-[0.9375rem] leading-snug text-green">
                          {lang === "zh" ? s.zh : s.en}
                        </h3>
                        <p className="mt-1 text-[0.6875rem] text-muted-foreground">
                          {lang === "zh" ? s.en : s.zh}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 border px-1.5 py-0.5 text-[0.6875rem]",
                          s.scaling === "高"
                            ? "border-tier-safe bg-tier-safe/8 text-tier-safe"
                            : s.scaling === "中"
                              ? "border-tier-target bg-tier-target/10 text-[oklch(0.48_0.07_74)]"
                              : "border-tier-unknown bg-tier-unknown/8 text-tier-unknown",
                        )}>
                        {scalingLabel(s.scaling, lang)}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-3 text-[0.75rem] text-muted-foreground">
                      <span>
                        {t("分类：", "Group: ")}
                        {groupLabel(s.group, lang)}
                      </span>
                      <span className={s.north ? "text-tier-safe" : "text-muted-foreground/55"}>
                        {t("北：", "North: ")}
                        {s.north ? "●" : "—"}
                      </span>
                      <span className={s.south ? "text-tier-safe" : "text-muted-foreground/55"}>
                        {t("南：", "South: ")}
                        {s.south ? "●" : "—"}
                      </span>
                    </div>
                    <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
                      {lang === "zh" ? s.note : s.noteEn}
                    </p>
                  </article>
                ))}
              </div>

              <div className="mt-6 hidden overflow-x-auto md:block">
                <table className="w-full min-w-[40rem] border-collapse">
                  <thead>
                    <tr className="border-b-2 border-green">
                      <th className="eyebrow py-3 pr-4 text-left text-muted-foreground">
                        {t("科目", "Course")}
                      </th>
                      <th className="eyebrow py-3 pr-4 text-left text-muted-foreground">
                        {t("分类", "Group")}
                      </th>
                      <th className="eyebrow py-3 pr-3 text-center text-muted-foreground">
                        {t("北", "North")}
                      </th>
                      <th className="eyebrow py-3 pr-4 text-center text-muted-foreground">
                        {t("南", "South")}
                      </th>
                      <th className="eyebrow py-3 pr-4 text-left text-muted-foreground">Scaling</th>
                      <th className="eyebrow py-3 text-left text-muted-foreground">
                        {t("说明", "Notes")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SUBJECTS.map((s) => (
                      <tr key={s.key} className="border-b border-border align-top">
                        <td className="py-3.5 pr-4">
                          <span className="text-[0.875rem] text-green">
                            {lang === "zh" ? s.zh : s.en}
                          </span>
                          <span className="mt-0.5 block text-[0.6875rem] text-muted-foreground">
                            {lang === "zh" ? s.en : s.zh}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 text-[0.8125rem] text-muted-foreground">
                          {groupLabel(s.group, lang)}
                        </td>
                        <td
                          className={cn(
                            "py-3.5 pr-3 text-center text-[0.875rem]",
                            s.north ? "text-tier-safe" : "text-muted-foreground/40",
                          )}>
                          {s.north ? "●" : "—"}
                        </td>
                        <td
                          className={cn(
                            "py-3.5 pr-4 text-center text-[0.875rem]",
                            s.south ? "text-tier-safe" : "text-muted-foreground/40",
                          )}>
                          {s.south ? "●" : "—"}
                        </td>
                        <td className="py-3.5 pr-4">
                          <span
                            className={cn(
                              "border px-1.5 py-0.5 text-[0.6875rem]",
                              s.scaling === "高"
                                ? "border-tier-safe text-tier-safe bg-tier-safe/8"
                                : s.scaling === "中"
                                  ? "border-tier-target text-[oklch(0.48_0.07_74)] bg-tier-target/10"
                                  : "border-tier-unknown text-tier-unknown bg-tier-unknown/8",
                            )}>
                            {scalingLabel(s.scaling, lang)}
                          </span>
                        </td>
                        <td className="py-3.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
                          {lang === "zh" ? s.note : s.noteEn}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
