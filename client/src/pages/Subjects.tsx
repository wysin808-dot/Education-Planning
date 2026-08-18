/**
 * 设计风格：Admissions Almanac
 * 选课规划页：目标清单（左）+ 科目必要度统计（右），底部为 WACE 科目年鉴条目。
 * 统计结果必须基于目标专业的官方先修要求，不得凭经验虚构。
 */
import { useMemo, useState } from "react";
import { AlertTriangle, Info, Plus, Trash2 } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { ScoreRule } from "@/components/ScoreRule";
import { FIELDS, HEMISPHERES, SUBJECTS, UNIVERSITIES, type Hemisphere } from "@/data/universities";
import {
  LEVEL_EN,
  adviseSubjectsBy,
  groupLabel,
  scalingLabel,
  subjectLabelBy,
  type SubjectAdvice,
} from "@/lib/matching";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LangContext";

const SUBJECTS_IMG = "/manus-storage/bv-subjects_9e541983.png";

interface Target {
  universityId: string;
  programmeId: string;
}

const LEVEL_STYLE: Record<string, string> = {
  必需: "border-tier-reach text-tier-reach bg-tier-reach/8",
  强烈建议: "border-tier-target text-[oklch(0.48_0.07_74)] bg-tier-target/10",
  可选: "border-tier-unknown text-tier-unknown bg-tier-unknown/8",
};

export default function Subjects() {
  const { t, lang } = useLang();
  const [targets, setTargets] = useState<Target[]>([
    { universityId: "nus", programmeId: "nus-computer-science" },
    { universityId: "unimelb", programmeId: UNIVERSITIES.find((u) => u.id === "unimelb")!.programmes[0].id },
    { universityId: "ucl", programmeId: UNIVERSITIES.find((u) => u.id === "ucl")!.programmes[0].id },
  ]);
  const [pickUni, setPickUni] = useState("hku");
  const [pickProg, setPickProg] = useState(
    UNIVERSITIES.find((u) => u.id === "hku")!.programmes[0].id,
  );
  /** BCI 提供北半球与南半球两个课程序列，开设科目不同 */
  const [hemisphere, setHemisphere] = useState<Hemisphere>("south");

  const pickedUni = useMemo(() => UNIVERSITIES.find((u) => u.id === pickUni), [pickUni]);
  const advice = useMemo(() => adviseSubjectsBy(targets, lang), [targets, lang]);

  /** 当前课程序列开设的科目 */
  const availableSubjects = useMemo(
    () => SUBJECTS.filter((s) => (hemisphere === "north" ? s.north : s.south)),
    [hemisphere],
  );
  const availableKeys = useMemo(
    () => new Set(availableSubjects.map((s) => s.key)),
    [availableSubjects],
  );
  /** 目标要求但当前序列未开设的科目，需要提前预警 */
  const unavailableRequired = useMemo(
    () => advice.filter((a) => a.level === "必需" && !availableKeys.has(a.subject)),
    [advice, availableKeys],
  );

  function addTarget() {
    if (!pickedUni) return;
    const progId = pickedUni.programmes.some((p) => p.id === pickProg)
      ? pickProg
      : pickedUni.programmes[0]?.id;
    if (!progId) return;
    const exists = targets.some(
      (tgt) => tgt.universityId === pickUni && tgt.programmeId === progId,
    );
    if (exists) return;
    setTargets([...targets, { universityId: pickUni, programmeId: progId }]);
  }

  function removeTarget(i: number) {
    setTargets(targets.filter((_, idx) => idx !== i));
  }

  /** 必需科目数量用于提示是否超出四门主力科目 */
  const mustCount = advice.filter((a) => a.level === "必需").length;

  /** 目标清单对应的门槛，用于在标尺上呈现分数跨度 */
  const targetMarkers = useMemo(
    () =>
      targets
        .map((tgt) => {
          const u = UNIVERSITIES.find((x) => x.id === tgt.universityId);
          const p = u?.programmes.find((x) => x.id === tgt.programmeId);
          if (!u || !p) return null;
          const th = p.atar ?? u.minAtar;
          if (th === null) return null;
          return { label: `${u.abbr} ${th}`, value: th, tone: "brass" as const };
        })
        .filter((m): m is { label: string; value: number; tone: "brass" } => m !== null)
        .sort((a, b) => a.value - b.value),
    [targets],
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="border-b border-border bg-paper-deep/45">
        <div className="container py-10">
          <span className="eyebrow text-brass">{t("选课规划 · Subject Planner", "Subject Planner")}</span>
          <h1 className="mt-3 text-[2.25rem] leading-tight text-green">
            {t(
              "从目标专业倒推 WACE 选课组合",
              "Derive a WACE subject set from your target programmes",
            )}
          </h1>
          <p className="mt-4 max-w-[64ch] font-[family-name:var(--font-serif)] text-[1rem] leading-relaxed text-muted-foreground">
            {t(
              "把候选目标加入清单，系统会统计各科目在这些目标中的出现频率，区分「必需」「强烈建议」与「可选」，帮助学生在 Year 11 选课时避免走错方向。",
              "Add candidate programmes to a shortlist and the planner counts how often each subject appears as a prerequisite, sorting them into required, strongly recommended and optional so Year 11 choices do not close doors.",
            )}
          </p>

          {/* 课程序列切换：BCI 批准课程分北半球与南半球两套 */}
          <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-border pt-6">
            <span className="text-[0.75rem] tracking-[0.14em] text-muted-foreground">
              {t("BCI 课程序列", "BCI course sequence")}
            </span>
            <div className="flex">
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
              {lang === "zh"
                ? HEMISPHERES.find((h) => h.id === hemisphere)?.note
                : HEMISPHERES.find((h) => h.id === hemisphere)?.noteEn}
            </span>
          </div>
        </div>
      </div>

      {/* 目标门槛跨度标尺 */}
      {targetMarkers.length > 0 && (
        <div className="border-b border-border bg-card">
          <div className="container py-9">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1.5">
              <div>
                <span className="almanac-index">{t("标尺 / SCORE RULE", "SCORE RULE")}</span>
                <h2 className="mt-0.5 text-[1.125rem] text-green">
                  {t("目标清单的门槛跨度", "Threshold spread across the shortlist")}
                </h2>
              </div>
              <p className="max-w-[48ch] text-right font-[family-name:var(--font-serif)] text-[0.75rem] leading-relaxed text-muted-foreground">
                {t(
                  "虚线为清单内各目标的官方最低门槛。跨度越大，越需要在保底与冲刺之间设置备选。",
                  "Dashed lines mark the official minimum for each shortlisted target. A wider spread calls for more intermediate options between safety and reach.",
                )}
              </p>
            </div>
            <div className="threshold-hairline mt-2" />
            <div className="mt-7">
              <ScoreRule markers={targetMarkers} showPointer={false} />
            </div>
          </div>
        </div>
      )}

      <div className="container grid gap-12 py-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        {/* 目标清单 */}
        <section>
          <div className="flex items-baseline justify-between gap-4 border-b-2 border-green pb-3">
            <h2 className="text-[1.25rem] text-green">{t("目标清单", "Shortlist")}</h2>
            <span className="score text-[0.8125rem] text-muted-foreground">
              {targets.length} {t("个目标", "targets")}
            </span>
          </div>

          {targets.length === 0 ? (
            <p className="border-x border-b border-border px-6 py-12 text-center font-[family-name:var(--font-serif)] text-[0.9375rem] text-muted-foreground">
              {t("请在下方添加至少一个目标专业。", "Add at least one target programme below.")}
            </p>
          ) : (
            <ul className="divide-y divide-border border-x border-b border-border">
              {targets.map((tgt, i) => {
                const u = UNIVERSITIES.find((x) => x.id === tgt.universityId);
                const p = u?.programmes.find((x) => x.id === tgt.programmeId);
                if (!u || !p) return null;
                const threshold = p.atar ?? u.minAtar;
                return (
                  <li
                    key={`${tgt.universityId}-${tgt.programmeId}`}
                    className="flex items-start gap-4 bg-card px-5 py-4">
                    <span className="almanac-index mt-1">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex-1">
                      <h3 className="text-[0.9375rem] leading-snug text-green">
                        {lang === "zh" ? u.nameZh : u.name}
                        <span className="mx-1.5 text-brass">·</span>
                        {lang === "zh" ? p.nameZh : p.name}
                      </h3>
                      <p className="mt-1 text-[0.75rem] text-muted-foreground">
                        {t("所需 ATAR ", "Required ATAR ")}
                        <span className="score">
                          {threshold === null ? t("官方未公布", "not published") : threshold.toFixed(2)}
                        </span>
                        {(() => {
                          const n = lang === "zh" ? p.atarNote : (p.atarNoteEn ?? p.atarNote);
                          return n ? ` · ${n}` : "";
                        })()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTarget(i)}
                      aria-label={t("移除该目标", "Remove this target")}
                      className="no-print mt-0.5 shrink-0 text-muted-foreground transition-colors hover:text-tier-reach">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {/* 添加目标 */}
          <div className="no-print mt-6 border border-border bg-card p-5">
            <span className="eyebrow text-brass">{t("添加目标", "Add a target")}</span>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <select
                value={pickUni}
                onChange={(e) => {
                  setPickUni(e.target.value);
                  const u = UNIVERSITIES.find((x) => x.id === e.target.value);
                  setPickProg(u?.programmes[0]?.id ?? "");
                }}
                className="border border-input bg-paper px-3 py-2 text-[0.875rem] text-ink outline-none focus:border-brass">
                {UNIVERSITIES.map((u) => (
                  <option key={u.id} value={u.id}>
                    {lang === "zh" ? u.nameZh : u.name}
                  </option>
                ))}
              </select>
              <select
                value={pickProg}
                onChange={(e) => setPickProg(e.target.value)}
                className="border border-input bg-paper px-3 py-2 text-[0.875rem] text-ink outline-none focus:border-brass">
                {pickedUni?.programmes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {lang === "zh" ? p.nameZh : p.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={addTarget}
              className="mt-4 inline-flex items-center gap-2 border border-green bg-green px-4 py-2 text-[0.875rem] text-primary-foreground transition-colors duration-150 hover:bg-green-soft">
              <Plus className="h-4 w-4" />
              {t("加入清单", "Add to shortlist")}
            </button>
          </div>
        </section>

        {/* 科目必要度 */}
        <section>
          <div className="flex items-baseline justify-between gap-4 border-b-2 border-green pb-3">
            <h2 className="text-[1.25rem] text-green">
              {t("科目必要度统计", "How essential each subject is")}
            </h2>
            <span className="score text-[0.8125rem] text-muted-foreground">
              {advice.length} {t("门相关", "subjects")}
            </span>
          </div>

          {advice.length === 0 ? (
            <p className="border-x border-b border-border px-6 py-12 text-center font-[family-name:var(--font-serif)] text-[0.9375rem] text-muted-foreground">
              {t(
                "所选目标均无硬性科目先修要求，或清单为空。此时建议以 scaling 较高的科目与个人强项组合选课。",
                "None of the shortlisted targets sets a hard subject prerequisite, or the shortlist is empty. Build the subject set around strong-scaling courses and personal strengths.",
              )}
            </p>
          ) : (
            <>
              {unavailableRequired.length > 0 && (
                <div className="mt-4 flex items-start gap-2 border border-tier-reach/50 bg-tier-reach/8 px-4 py-3 text-[0.8125rem] leading-relaxed text-tier-reach">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    {t(
                      `以下必需科目未在当前「${HEMISPHERES.find((h) => h.id === hemisphere)?.label}」序列开设：`,
                      `The following required subjects are not offered in the current ${HEMISPHERES.find((h) => h.id === hemisphere)?.labelEn} sequence: `,
                    )}
                    <strong>
                      {unavailableRequired
                        .map((a) => subjectLabelBy(a.subject, lang))
                        .join(lang === "zh" ? "、" : ", ")}
                    </strong>
                    {t(
                      "。请与升学指导办公室确认替代方案或调整入学序列。",
                      ". Confirm an alternative or a different intake sequence with the Admissions Office.",
                    )}
                  </span>
                </div>
              )}
              <ul className="divide-y divide-border border-x border-b border-border">
                {advice.map((a) => {
                  const offered = availableKeys.has(a.subject);
                  return (
                    <li key={a.subject} className="bg-card px-5 py-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="flex flex-wrap items-center gap-2 text-[0.9375rem] text-green">
                          {subjectLabelBy(a.subject, lang)}
                          {!offered && (
                            <span className="border border-tier-unknown px-1.5 py-0.5 text-[0.625rem] tracking-[0.08em] text-tier-unknown">
                              {t("本序列未开设", "Not in this sequence")}
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="score text-[0.8125rem] text-muted-foreground">
                            {a.requiredBy} / {targets.length} {t("个目标要求", "targets require")}
                          </span>
                          <span
                            className={cn(
                              "border px-2 py-0.5 text-[0.6875rem] tracking-[0.08em]",
                              LEVEL_STYLE[a.level],
                            )}>
                            {lang === "zh" ? a.level : LEVEL_EN[a.level]}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 font-[family-name:var(--font-serif)] text-[0.8125rem] leading-relaxed text-muted-foreground">
                        {a.reason}
                      </p>
                    </li>
                  );
                })}
              </ul>

              {mustCount > 4 && (
                <p className="mt-4 flex items-start gap-2 border border-brass/50 bg-brass/8 px-4 py-3 text-[0.8125rem] leading-relaxed text-[oklch(0.42_0.07_74)]">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  {t(
                    `当前清单产生了 ${mustCount} 门必需科目，超出 ATAR 通常计入的四门主力科目。建议收窄目标方向，或与顾问确认哪些目标可以取舍。`,
                    `This shortlist generates ${mustCount} required subjects, more than the four that normally count towards an ATAR. Narrow the direction, or agree with a counsellor which targets can be dropped.`,
                  )}
                </p>
              )}

              <p className="mt-4 text-[0.75rem] leading-relaxed text-muted-foreground">
                {t(
                  "统计口径：某科目被列为目标专业先修要求即计一次。若某组要求为「A 或 B」，组内两科均各计一次，因此实际只需满足其中之一。",
                  "Counting rule: a subject scores one point each time it appears as a prerequisite. Where a requirement reads \u201cA or B\u201d, both subjects are counted, so satisfying either one is sufficient.",
                )}
              </p>
            </>
          )}
        </section>
      </div>

      {/* 按方向的通用建议 */}
      <section className="border-t border-border bg-paper-deep/45">
        <div className="container py-14">
          <span className="almanac-index">{t("附录 A", "Appendix A")}</span>
          <h2 className="mt-1 text-[1.75rem] text-green">
            {t("按专业方向的选课建议", "Subject guidance by field")}
          </h2>
          <div className="mt-8 grid gap-x-14 gap-y-7 lg:grid-cols-2">
            {FIELDS.map((f, i) => (
              <div key={f.key} className="border-t border-green/25 pt-4">
                <h3 className="text-[1rem] text-green">
                  <span className="almanac-index mr-2">{String(i + 1).padStart(2, "0")}</span>
                  {lang === "zh" ? f.zh : f.en}
                </h3>
                <p className="mt-2 font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {lang === "zh" ? f.advice : f.adviceEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WACE 科目年鉴 */}
      <section className="border-t border-border">
        <div className="container grid gap-12 py-14 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div>
            <span className="almanac-index">{t("附录 B", "Appendix B")}</span>
            <h2 className="mt-1 text-[1.75rem] text-green">
              {t("BCI 批准的 WACE ATAR 课程", "BCI approved WACE ATAR courses")}
            </h2>
            <p className="mt-3 max-w-[60ch] font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-muted-foreground">
              {t(
                "以下为 Brentvale College International 批准开设的 ATAR 课程。北半球序列 11 门、南半球序列 16 门。scaling 一栏为该科目对 ATAR 贡献的相对强弱参考，用于组合选课时权衡，不代表任何官方换算公式。",
                "The ATAR courses approved for delivery at Brentvale College International: 11 in the Northern Hemisphere sequence and 16 in the Southern. The scaling column is a relative indication of a course's contribution to an ATAR, offered to help weigh combinations; it is not an official conversion.",
              )}
            </p>
            <div className="mt-8 overflow-x-auto">
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
                      <td className="py-3.5 font-[family-name:var(--font-serif)] text-[0.8125rem] leading-relaxed text-muted-foreground">
                        {lang === "zh" ? s.note : s.noteEn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="lg:sticky lg:top-28">
            <img
              src={SUBJECTS_IMG}
              alt={t(
                "WACE 选课规划的索引卡与书籍俯拍",
                "Index cards and reference books laid out for WACE subject planning",
              )}
              className="w-full object-cover"
            />
            <p className="mt-3 text-[0.75rem] leading-relaxed text-muted-foreground">
              {t(
                "Year 11 选课通常需确定四至五门 ATAR 科目，其中英语或 EALD 为毕业必需。建议在确定目标专业先修要求后再定选课。",
                "Year 11 normally requires four to five ATAR courses, with English or EALD compulsory for graduation. Settle the prerequisites of the target programmes before committing to a combination.",
              )}
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
