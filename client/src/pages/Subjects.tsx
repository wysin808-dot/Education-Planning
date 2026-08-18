/**
 * 设计风格：Admissions Almanac
 * 选课规划页：目标清单（左）+ 科目必要度统计（右），底部为 WACE 科目年鉴条目。
 * 统计结果必须基于目标专业的官方先修要求，不得凭经验虚构。
 */
import { useMemo, useState } from "react";
import { AlertTriangle, Plus, Trash2 } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { ScoreRule } from "@/components/ScoreRule";
import { FIELDS, SUBJECTS, UNIVERSITIES } from "@/data/universities";
import { adviseSubjects, subjectLabel } from "@/lib/matching";
import { cn } from "@/lib/utils";

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
  const [targets, setTargets] = useState<Target[]>([
    { universityId: "nus", programmeId: "nus-cs" },
    { universityId: "usyd", programmeId: "usyd-computing" },
    { universityId: "ucl", programmeId: "ucl-cs" },
  ]);
  const [pickUni, setPickUni] = useState("unimelb");
  const [pickProg, setPickProg] = useState("unimelb-comm");

  const pickedUni = useMemo(() => UNIVERSITIES.find((u) => u.id === pickUni), [pickUni]);
  const advice = useMemo(() => adviseSubjects(targets), [targets]);

  function addTarget() {
    if (!pickedUni) return;
    const progId = pickedUni.programmes.some((p) => p.id === pickProg)
      ? pickProg
      : pickedUni.programmes[0]?.id;
    if (!progId) return;
    const exists = targets.some((t) => t.universityId === pickUni && t.programmeId === progId);
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
        .map((t) => {
          const u = UNIVERSITIES.find((x) => x.id === t.universityId);
          const p = u?.programmes.find((x) => x.id === t.programmeId);
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
          <span className="eyebrow text-brass">选课规划 · Subject Planner</span>
          <h1 className="mt-3 text-[2.25rem] leading-tight text-green">从目标专业倒推 WACE 选课组合</h1>
          <p className="mt-4 max-w-[64ch] font-[family-name:var(--font-serif)] text-[1rem] leading-relaxed text-muted-foreground">
            把候选目标加入清单，系统会统计各科目在这些目标中的出现频率，区分「必需」「强烈建议」与「可选」，帮助学生在 Year 11 选课时避免走错方向。
          </p>
        </div>
      </div>

      {/* 目标门槛跨度标尺 */}
      {targetMarkers.length > 0 && (
        <div className="border-b border-border bg-card">
          <div className="container py-9">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1.5">
              <div>
                <span className="almanac-index">标尺 / SCORE RULE</span>
                <h2 className="mt-0.5 text-[1.125rem] text-green">目标清单的门槛跨度</h2>
              </div>
              <p className="max-w-[48ch] text-right font-[family-name:var(--font-serif)] text-[0.75rem] leading-relaxed text-muted-foreground">
                虚线为清单内各目标的官方最低门槛。跨度越大，越需要在保底与冲刺之间设置备选。
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
            <h2 className="text-[1.25rem] text-green">目标清单</h2>
            <span className="score text-[0.8125rem] text-muted-foreground">{targets.length} 个目标</span>
          </div>

          {targets.length === 0 ? (
            <p className="border-x border-b border-border px-6 py-12 text-center font-[family-name:var(--font-serif)] text-[0.9375rem] text-muted-foreground">
              请在下方添加至少一个目标专业。
            </p>
          ) : (
            <ul className="divide-y divide-border border-x border-b border-border">
              {targets.map((t, i) => {
                const u = UNIVERSITIES.find((x) => x.id === t.universityId);
                const p = u?.programmes.find((x) => x.id === t.programmeId);
                if (!u || !p) return null;
                const threshold = p.atar ?? u.minAtar;
                return (
                  <li key={`${t.universityId}-${t.programmeId}`} className="flex items-start gap-4 bg-card px-5 py-4">
                    <span className="almanac-index mt-1">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex-1">
                      <h3 className="text-[0.9375rem] leading-snug text-green">
                        {u.nameZh}
                        <span className="mx-1.5 text-brass">·</span>
                        {p.nameZh}
                      </h3>
                      <p className="mt-1 text-[0.75rem] text-muted-foreground">
                        所需 ATAR{" "}
                        <span className="score">{threshold === null ? "官方未公布" : threshold.toFixed(2)}</span>
                        {" · "}
                        {p.prerequisiteNote}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTarget(i)}
                      aria-label="移除该目标"
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
            <span className="eyebrow text-brass">添加目标</span>
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
                    {u.nameZh}
                  </option>
                ))}
              </select>
              <select
                value={pickProg}
                onChange={(e) => setPickProg(e.target.value)}
                className="border border-input bg-paper px-3 py-2 text-[0.875rem] text-ink outline-none focus:border-brass">
                {pickedUni?.programmes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nameZh}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={addTarget}
              className="mt-4 inline-flex items-center gap-2 border border-green bg-green px-4 py-2 text-[0.875rem] text-primary-foreground transition-colors duration-150 hover:bg-green-soft">
              <Plus className="h-4 w-4" />
              加入清单
            </button>
          </div>
        </section>

        {/* 科目必要度 */}
        <section>
          <div className="flex items-baseline justify-between gap-4 border-b-2 border-green pb-3">
            <h2 className="text-[1.25rem] text-green">科目必要度统计</h2>
            <span className="score text-[0.8125rem] text-muted-foreground">{advice.length} 门相关</span>
          </div>

          {advice.length === 0 ? (
            <p className="border-x border-b border-border px-6 py-12 text-center font-[family-name:var(--font-serif)] text-[0.9375rem] text-muted-foreground">
              所选目标均无硬性科目先修要求，或清单为空。此时建议以 scaling 较高的科目与个人强项组合选课。
            </p>
          ) : (
            <>
              <ul className="divide-y divide-border border-x border-b border-border">
                {advice.map((a) => (
                  <li key={a.subject} className="bg-card px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-[0.9375rem] text-green">{subjectLabel(a.subject)}</h3>
                      <div className="flex items-center gap-3">
                        <span className="score text-[0.8125rem] text-muted-foreground">
                          {a.requiredBy} / {targets.length} 个目标要求
                        </span>
                        <span
                          className={cn(
                            "border px-2 py-0.5 text-[0.6875rem] tracking-[0.08em]",
                            LEVEL_STYLE[a.level],
                          )}>
                          {a.level}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 font-[family-name:var(--font-serif)] text-[0.8125rem] leading-relaxed text-muted-foreground">
                      {a.reason}
                    </p>
                  </li>
                ))}
              </ul>

              {mustCount > 4 && (
                <p className="mt-4 flex items-start gap-2 border border-brass/50 bg-brass/8 px-4 py-3 text-[0.8125rem] leading-relaxed text-[oklch(0.42_0.07_74)]">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  当前清单产生了 {mustCount} 门必需科目，超出 ATAR 通常计入的四门主力科目。建议收窄目标方向，或与顾问确认哪些目标可以取舍。
                </p>
              )}

              <p className="mt-4 text-[0.75rem] leading-relaxed text-muted-foreground">
                统计口径：某科目被列为目标专业先修要求即计一次。若某组要求为「A 或 B」，组内两科均各计一次，因此实际只需满足其中之一。
              </p>
            </>
          )}
        </section>
      </div>

      {/* 按方向的通用建议 */}
      <section className="border-t border-border bg-paper-deep/45">
        <div className="container py-14">
          <span className="almanac-index">附录 A</span>
          <h2 className="mt-1 text-[1.75rem] text-green">按专业方向的选课建议</h2>
          <div className="mt-8 grid gap-x-14 gap-y-7 lg:grid-cols-2">
            {FIELDS.map((f, i) => (
              <div key={f.key} className="border-t border-green/25 pt-4">
                <h3 className="text-[1rem] text-green">
                  <span className="almanac-index mr-2">{String(i + 1).padStart(2, "0")}</span>
                  {f.zh}
                </h3>
                <p className="mt-2 font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {f.advice}
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
            <span className="almanac-index">附录 B</span>
            <h2 className="mt-1 text-[1.75rem] text-green">WACE ATAR 科目一览</h2>
            <p className="mt-3 max-w-[60ch] font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-muted-foreground">
              scaling 一栏为该科目对 ATAR 贡献的相对强弱参考，用于组合选课时权衡，不代表任何官方换算公式。
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse">
                <thead>
                  <tr className="border-b-2 border-green">
                    <th className="eyebrow py-3 pr-4 text-left text-muted-foreground">科目</th>
                    <th className="eyebrow py-3 pr-4 text-left text-muted-foreground">分类</th>
                    <th className="eyebrow py-3 pr-4 text-left text-muted-foreground">Scaling</th>
                    <th className="eyebrow py-3 text-left text-muted-foreground">说明</th>
                  </tr>
                </thead>
                <tbody>
                  {SUBJECTS.map((s) => (
                    <tr key={s.key} className="border-b border-border align-top">
                      <td className="py-3.5 pr-4">
                        <span className="text-[0.875rem] text-green">{s.zh}</span>
                        <span className="mt-0.5 block text-[0.6875rem] text-muted-foreground">{s.en}</span>
                      </td>
                      <td className="py-3.5 pr-4 text-[0.8125rem] text-muted-foreground">{s.group}</td>
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
                          {s.scaling}
                        </span>
                      </td>
                      <td className="py-3.5 font-[family-name:var(--font-serif)] text-[0.8125rem] leading-relaxed text-muted-foreground">
                        {s.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="lg:sticky lg:top-28">
            <img src={SUBJECTS_IMG} alt="WACE 选课规划的索引卡与书籍俯拍" className="w-full object-cover" />
            <p className="mt-3 text-[0.75rem] leading-relaxed text-muted-foreground">
              Year 11 选课通常需确定四至五门 ATAR 科目，其中英语为毕业必需。建议在确定目标专业先修要求后再定选课。
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
