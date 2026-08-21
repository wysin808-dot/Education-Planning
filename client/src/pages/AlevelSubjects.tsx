/**
 * 设计风格：Admissions Almanac
 * A-Level 选课规划：与 WACE 选课页同构，先给出 AS（Year 11）与 A2（Year 12）
 * 的具体组合与冲突诊断，再列推导依据，最后才是课程目录与方向参考。
 * 目标来源为全站共享的收藏清单，本页只读。
 */
import { useMemo, useState } from "react";
import { AlertTriangle, ChevronDown, ChevronRight, ListChecks } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { Stagger } from "@/components/Motion";
import { PrintHeader } from "@/components/PrintHeader";
import { PrintReportButton } from "@/components/PrintReportButton";
import { useLang } from "@/contexts/LangContext";
import { useShortlist } from "@/contexts/ShortlistContext";
import { ALEVEL_FIELD_ADVICE, ALEVEL_SUBJECTS } from "@/data/alevel";
import { FIELDS } from "@/data/universities";
import {
  ALEVEL_A2_SIZE,
  ALEVEL_AS_SIZE,
  alevelPlanRoleLabel,
  alevelSubjectLabel,
  buildAlevelPlan,
  type AlevelPlanSubject,
} from "@/lib/alevelMatching";
import { cn } from "@/lib/utils";

const ROLE_STYLE: Record<AlevelPlanSubject["role"], string> = {
  required: "border-tier-reach/45 bg-tier-reach/8 text-tier-reach",
  recommended: "border-brass/50 bg-brass/8 text-[oklch(0.42_0.07_74)]",
  filler: "border-tier-unknown/45 bg-tier-unknown/8 text-tier-unknown",
};

export default function AlevelSubjects() {
  const { lang, t } = useLang();
  const { resolved } = useShortlist();
  const [showCourses, setShowCourses] = useState(false);

  const targets = useMemo(
    () =>
      resolved.map((item) => ({
        universityId: item.universityId,
        programmeId: item.programmeId,
      })),
    [resolved],
  );
  const plan = useMemo(() => buildAlevelPlan(targets, lang), [targets, lang]);
  const selectedFields = Array.from(new Set(resolved.map((item) => item.programme.field)));
  const hasTargets = targets.length > 0;
  const requiredCount = plan.as.filter((s) => s.role === "required").length;

  function SubjectRow({ item, index }: { item: AlevelPlanSubject; index: number }) {
    const meta = ALEVEL_SUBJECTS.find((s) => s.key === item.subject);
    const groupLabel =
      meta?.group === "数学"
        ? t("数学", "Mathematics")
        : meta?.group === "科学"
          ? t("科学", "Sciences")
          : t("商科", "Business");
    return (
      <li className="flex items-start gap-4 border-b border-border bg-card px-5 py-4 last:border-b-0">
        <span className="almanac-index mt-1 shrink-0">{String(index + 1).padStart(2, "0")}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <h4 className="text-[0.9375rem] leading-snug text-green">
              {alevelSubjectLabel(item.subject, lang)}
            </h4>
            <span
              className={cn(
                "border px-1.5 py-0.5 text-[0.625rem] tracking-[0.08em]",
                ROLE_STYLE[item.role],
              )}>
              {alevelPlanRoleLabel(item.role, lang)}
            </span>
            <span className="text-[0.6875rem] text-muted-foreground">{groupLabel}</span>
          </div>

          {item.supports.length > 0 ? (
            <p className="mt-1.5 text-[0.75rem] leading-relaxed text-muted-foreground">
              {item.role === "required" ? t("支撑目标：", "Required by: ") : t("院校建议：", "Recommended by: ")}
              {item.supports.slice(0, 4).join(lang === "zh" ? "、" : "; ")}
              {item.supports.length > 4 &&
                t(` 等 ${item.supports.length} 个`, ` and ${item.supports.length - 4} more`)}
            </p>
          ) : (
            <p className="mt-1.5 text-[0.75rem] leading-relaxed text-muted-foreground">
              {lang === "zh" ? meta?.note : meta?.noteEn}
            </p>
          )}
        </div>
        {(item.requiredBy > 0 || item.recommendedBy > 0) && (
          <span className="score shrink-0 pt-0.5 text-[0.75rem] text-muted-foreground">
            {item.requiredBy > 0 ? item.requiredBy : item.recommendedBy}/{plan.targetCount}
          </span>
        )}
      </li>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main>
        <section className="print-title-band border-b border-border bg-paper-deep/35">
          <div className="container py-9 lg:py-12">
            <p className="eyebrow text-brass">{t("A-Level · 选课规划", "A-Level · Subject Planner")}</p>
            <h1 className="mt-3 font-[family-name:var(--font-serif)] text-3xl text-green sm:text-4xl">
              {t("Year 11 与 Year 12 选课方案", "Year 11 and Year 12 subject plan")}
            </h1>
            <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
              {t(
                `本页依据目标清单中各专业的官方先修与建议科目，直接给出 AS 年开局的 ${ALEVEL_AS_SIZE} 门与 A2 年保留的 ${ALEVEL_A2_SIZE} 门具体组合，并指出无法同时满足的目标。`,
                `Working from the official prerequisites and recommendations of the shortlisted programmes, this page produces a concrete set of ${ALEVEL_AS_SIZE} AS subjects and the ${ALEVEL_A2_SIZE} carried to A2, and flags targets that cannot be satisfied together.`,
              )}
            </p>
          </div>
        </section>

        <div className="container py-9">
          <PrintHeader title={t("Cambridge A-Level 选课方案", "Cambridge A-Level subject plan")} />

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
                  "目标清单为空，以下为 BCI 十门课中学术通用性最高的组合，收藏目标后会按官方要求重新计算。",
                  "The shortlist is empty, so the most broadly accepted combination of BCI's ten subjects is shown. Save targets and the plan recalculates from official requirements.",
                )
              )}
            </p>
            <div className="no-print flex gap-2">
              <Link
                href="/alevel/shortlist"
                className="inline-flex items-center gap-2 border border-input px-3 py-1.5 text-[0.8125rem] text-green transition-colors hover:border-brass">
                <ListChecks className="h-3.5 w-3.5 text-brass" />
                {t("管理目标清单", "Manage shortlist")}
              </Link>
              <PrintReportButton compact />
            </div>
          </div>

          {plan.overflow.length > 0 && (
            <div className="mt-6 flex items-start gap-2.5 border border-tier-reach/50 bg-tier-reach/8 px-4 py-3.5 text-[0.8125rem] leading-relaxed text-tier-reach">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-medium">
                  {t("目标之间存在选课冲突", "These targets conflict on subjects")}
                </p>
                <p className="mt-1">
                  {t(
                    "清单要求的先修科目超出 AS 年可开局的门数，以下科目未能纳入：",
                    "The shortlist demands more prerequisites than the AS year can hold. These were left out: ",
                  )}
                  <strong>
                    {plan.overflow
                      .map((s) => alevelSubjectLabel(s.subject, lang))
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

          <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-10">
            <section>
              <div className="flex items-baseline justify-between gap-4 border-b-2 border-green pb-3">
                <div>
                  <span className="almanac-index">{t("方案一", "Stage one")}</span>
                  <h2 className="mt-0.5 font-[family-name:var(--font-serif)] text-[1.375rem] text-green">
                    Year 11 · AS
                  </h2>
                </div>
                <span className="score text-[0.8125rem] text-muted-foreground">
                  {plan.as.length} {t("门", "subjects")}
                </span>
              </div>
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
                {t(
                  "AS 年建议开局四门，为 A2 保留一门可放弃的余量，避免过早关闭方向。",
                  "Four subjects in the AS year leave one to drop at A2, so no pathway closes prematurely.",
                )}
              </p>
              <Stagger as="ul" className="mt-4 border border-border">
                {plan.as.map((item, i) => (
                  <SubjectRow key={item.subject} item={item} index={i} />
                ))}
              </Stagger>
            </section>

            <section>
              <div className="flex items-baseline justify-between gap-4 border-b-2 border-green pb-3">
                <div>
                  <span className="almanac-index">{t("方案二", "Stage two")}</span>
                  <h2 className="mt-0.5 font-[family-name:var(--font-serif)] text-[1.375rem] text-green">
                    Year 12 · A2
                  </h2>
                </div>
                <span className="score text-[0.8125rem] text-muted-foreground">
                  {plan.a2.length} {t("门", "subjects")}
                </span>
              </div>
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
                {t(
                  "院校 offer 多以三门等级表述（如 A*AA、AAA），A2 年集中在这三门以保证等级质量。",
                  "Offers are normally expressed over three grades (A*AA, AAA), so the A2 year concentrates on these three.",
                )}
              </p>
              <Stagger as="ul" className="mt-4 border border-border">
                {plan.a2.map((item, i) => (
                  <SubjectRow key={item.subject} item={item} index={i} />
                ))}
              </Stagger>

              {plan.dropped.length > 0 && (
                <div className="mt-4 border border-dashed border-border bg-paper-deep/30 px-5 py-4">
                  <p className="eyebrow text-muted-foreground">
                    {t("A2 建议放弃", "Recommended to drop at A2")}
                  </p>
                  <p className="mt-2 text-[0.875rem] text-green">
                    {plan.dropped
                      .map((s) => alevelSubjectLabel(s.subject, lang))
                      .join(lang === "zh" ? "、" : ", ")}
                  </p>
                  <p className="mt-1.5 text-[0.75rem] leading-relaxed text-muted-foreground">
                    {t(
                      "该科目未被目标专业列为先修，或被要求的次数最少；保留 AS 成绩即可，不影响清单内目标的申请资格。",
                      "This subject is not a prerequisite for the shortlist, or is required least often. Keeping the AS result is sufficient and does not affect eligibility.",
                    )}
                  </p>
                </div>
              )}
            </section>
          </div>

          {hasTargets ? (
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
                      "先纳入被目标专业明确列为先修的科目，按被要求的目标数排序。",
                      "Subjects listed as explicit prerequisites come first, ranked by how many targets require them.",
                    )}
                  </li>
                  <li className="flex gap-2.5">
                    <span className="almanac-index shrink-0">02</span>
                    {t(
                      "其次纳入院校建议或学术匹配的科目，补足 AS 年的四门。",
                      "Recommended or academically aligned subjects follow, completing the four AS subjects.",
                    )}
                  </li>
                  <li className="flex gap-2.5">
                    <span className="almanac-index shrink-0">03</span>
                    {t(
                      "进阶数学不替代数学，仅在数学已入选时追加，避免出现无效组合。",
                      "Further Mathematics never replaces Mathematics; it is added only once Mathematics is in the set.",
                    )}
                  </li>
                  <li className="flex gap-2.5">
                    <span className="almanac-index shrink-0">04</span>
                    {t(
                      "先修要求超出四门时，报出冲突并列出受影响目标，而非静默丢弃。",
                      "Where prerequisites exceed four subjects, the conflict and affected targets are reported rather than silently dropped.",
                    )}
                  </li>
                </ol>
                <div className="border-l-2 border-brass bg-paper-deep/35 px-5 py-4">
                  <p className="eyebrow text-brass">{t("口径声明", "Basis")}</p>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {t(
                      "先修与建议科目均引自各校官方招生页，且只映射到 BCI 官网公布的十门可选课程；其他院校要求保留在反查页的官方原文中。最终选课须经升学指导办公室确认。",
                      "Prerequisites and recommendations are taken from each university's official admissions pages and mapped only to BCI's seven confirmed subjects; other requirements remain in the official wording on the reverse lookup page. Final choices must be confirmed with the Admissions Office.",
                    )}
                  </p>
                </div>
              </div>
            </section>
          ) : (
            <section className="no-print mt-10 border border-border bg-card px-6 py-7">
              <h2 className="font-[family-name:var(--font-serif)] text-[1.25rem] text-green">
                {t("让方案贴合你的目标", "Make this plan yours")}
              </h2>
              <p className="mt-2 max-w-[60ch] text-[0.875rem] leading-relaxed text-muted-foreground">
                {t(
                  "上面是通用组合。在 A-Level 查询页收藏目标专业后，本页会按这些专业的官方要求重新计算两年的科目，并指出彼此冲突的目标。",
                  "The plan above is generic. Save target programmes on the A-Level search pages and it will be recalculated from their official requirements, including any conflicts between them.",
                )}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/alevel/forward"
                  className="inline-flex items-center gap-2 border border-green bg-green px-4 py-2 text-[0.875rem] text-primary-foreground transition-colors duration-150 hover:bg-green-soft">
                  {t("有成绩规划", "Plan with grades")}
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/alevel/reverse"
                  className="inline-flex items-center gap-2 border border-green px-4 py-2 text-[0.875rem] text-green transition-colors duration-150 hover:bg-green/5">
                  {t("由目标规划", "Plan from a target")}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          )}
        </div>

        {selectedFields.length > 0 && (
          <section className="border-t border-border bg-paper-deep/45">
            <div className="container py-12">
              <span className="almanac-index">{t("附录 A", "Appendix A")}</span>
              <h2 className="mt-1 font-[family-name:var(--font-serif)] text-[1.5rem] text-green">
                {t("目标方向的组合提示", "Combinations for your target fields")}
              </h2>
              <div className="mt-7 grid gap-x-12 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
                {selectedFields.map((fieldKey) => {
                  const field = FIELDS.find((item) => item.key === fieldKey);
                  return (
                    <div key={fieldKey} className="border-t border-green/25 pt-3.5">
                      <h3 className="text-[0.9375rem] text-green">
                        {lang === "zh" ? field?.zh : field?.en}
                      </h3>
                      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
                        {lang === "zh"
                          ? ALEVEL_FIELD_ADVICE[fieldKey].zh
                          : ALEVEL_FIELD_ADVICE[fieldKey].en}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <section className="border-t border-border">
          <div className="container py-12">
            <button
              type="button"
              onClick={() => setShowCourses((v) => !v)}
              className="no-print flex w-full items-center justify-between gap-4 border-b border-border pb-3 text-left">
              <div>
                <span className="almanac-index">
                  {selectedFields.length > 0 ? t("附录 B", "Appendix B") : t("附录 A", "Appendix A")}
                </span>
                <h2 className="mt-1 font-[family-name:var(--font-serif)] text-[1.5rem] text-green">
                  {t(
                    `BCI 官网公布的 Cambridge A-Level 可选课程（${ALEVEL_SUBJECTS.length} 门）`,
                    `Cambridge A-Level subjects published on the BCI site (${ALEVEL_SUBJECTS.length})`,
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
              <div className="mt-6 grid gap-x-12 gap-y-5 md:grid-cols-2">
                {ALEVEL_SUBJECTS.map((subject) => (
                  <div key={subject.key} className="border-t border-border pt-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-[0.9375rem] text-green">
                        {lang === "zh" ? subject.zh : subject.en}
                      </h3>
                      <span className="text-[0.6875rem] text-muted-foreground">
                        {subject.group === "数学"
                          ? t("数学", "Mathematics")
                          : subject.group === "科学"
                            ? t("科学", "Sciences")
                            : t("商科", "Business")}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
                      {lang === "zh" ? subject.note : subject.noteEn}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
