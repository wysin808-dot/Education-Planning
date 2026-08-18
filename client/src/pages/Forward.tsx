/**
 * 设计风格：Admissions Almanac
 * 正向查询页：左侧固定索引栏（输入条件）+ 右侧结果长栏（分层列表）。
 * 分数一律等宽右对齐；结果行以规则线分隔，不使用卡片网格。
 */
import { useMemo, useState } from "react";
import { AlertTriangle, Check, Printer, X } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { ScoreRule } from "@/components/ScoreRule";
import { TierBadge } from "@/components/TierBadge";
import { FIELDS, REGIONS, SUBJECTS, type FieldKey, type Region, type SubjectKey } from "@/data/universities";
import {
  TIER_META,
  forwardMatch,
  subjectGroupLabel,
  summarizeByTier,
  type MatchRow,
  type Tier,
} from "@/lib/matching";
import { cn } from "@/lib/utils";

const SUBJECT_GROUPS = ["数学", "科学", "商科", "科技与设计", "人文与语言"] as const;

/** 结果分组方式：年鉴式命名小节的依据 */
type GroupMode = "region" | "tier" | "band";

const BANDS: { key: string; label: string; hint: string; min: number; max: number }[] = [
  { key: "b98", label: "98 及以上", hint: "牛剑与 G5 顶尖专业区间", min: 98, max: 100 },
  { key: "b95", label: "95 至 97.99", hint: "英国 G5 主流专业与澳洲顶尖医学法律", min: 95, max: 97.99 },
  { key: "b90", label: "90 至 94.99", hint: "新加坡公立大学与港前三主力区间", min: 90, max: 94.99 },
  { key: "b85", label: "85 至 89.99", hint: "香港理工与澳洲八大热门专业", min: 85, max: 89.99 },
  { key: "b80", label: "80 至 84.99", hint: "香港八大普遍门槛与澳洲主流专业", min: 80, max: 84.99 },
  { key: "b70", label: "70 至 79.99", hint: "澳洲八大基础学位与保底选项", min: 70, max: 79.99 },
  { key: "bna", label: "官方未公布", hint: "综合评估或个案审核，需顾问评估", min: -1, max: -1 },
];

export default function Forward() {
  const [atarInput, setAtarInput] = useState("92");
  const [subjects, setSubjects] = useState<SubjectKey[]>(["english", "mathMethods", "chemistry", "physics"]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [fields, setFields] = useState<FieldKey[]>([]);
  const [tierFilter, setTierFilter] = useState<Tier | "all">("all");
  const [groupMode, setGroupMode] = useState<GroupMode>("region");

  /** 解析并校验 ATAR 输入：ATAR 取值区间为 0 至 99.95 */
  const parsed = useMemo(() => {
    const raw = atarInput.trim();
    if (raw === "") return { value: null as number | null, error: "请输入预计 ATAR 分数。" };
    const n = Number(raw);
    if (!Number.isFinite(n)) return { value: null, error: "请输入有效数字，例如 92 或 92.35。" };
    if (n < 0 || n > 99.95) return { value: null, error: "ATAR 的有效区间为 0 至 99.95。" };
    return { value: n, error: null as string | null };
  }, [atarInput]);

  const rows = useMemo(() => {
    if (parsed.value === null) return [];
    return forwardMatch({ atar: parsed.value, subjects, regions, fields });
  }, [parsed.value, subjects, regions, fields]);

  const summary = useMemo(() => summarizeByTier(rows), [rows]);
  const visibleRows = useMemo(
    () => (tierFilter === "all" ? rows : rows.filter((r) => r.tier === tierFilter)),
    [rows, tierFilter],
  );

  /** 按所选模式把结果切分为命名小节 */
  const sections = useMemo(() => {
    const out: { key: string; title: string; hint: string; rows: MatchRow[] }[] = [];
    if (groupMode === "region") {
      for (const r of REGIONS) {
        const subset = visibleRows.filter((row) => row.university.region === r.id);
        if (subset.length > 0) out.push({ key: r.id, title: r.label, hint: r.blurb, rows: subset });
      }
    } else if (groupMode === "tier") {
      for (const t of ["safe", "target", "reach", "unknown"] as Tier[]) {
        const subset = visibleRows.filter((row) => row.tier === t);
        if (subset.length > 0)
          out.push({ key: t, title: TIER_META[t].label, hint: TIER_META[t].definition, rows: subset });
      }
    } else {
      for (const b of BANDS) {
        const subset = visibleRows.filter((row) => {
          const th = row.programme.atar ?? row.university.minAtar;
          if (b.min === -1) return th === null;
          return th !== null && th >= b.min && th <= b.max;
        });
        if (subset.length > 0) out.push({ key: b.key, title: b.label, hint: b.hint, rows: subset });
      }
    }
    return out;
  }, [visibleRows, groupMode]);

  function toggle<T>(list: T[], value: T, setter: (v: T[]) => void) {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="border-b border-border bg-paper-deep/45">
        <div className="container py-10">
          <span className="eyebrow text-brass">正向查询 · Forward Match</span>
          <h1 className="mt-3 text-[2.25rem] leading-tight text-green">按预计 ATAR 查可申请的院校与专业</h1>
          <p className="mt-4 max-w-[64ch] font-[family-name:var(--font-serif)] text-[1rem] leading-relaxed text-muted-foreground">
            输入预计 ATAR 与已修读的 WACE 科目，系统会按官方最低门槛分出稳妥、匹配、冲刺三档，并逐条校验先修科目是否满足。
          </p>
        </div>
      </div>

      <div className="container grid gap-10 py-12 lg:grid-cols-[17.5rem_1fr] lg:gap-12">
        {/* 左侧索引栏 */}
        <aside className="no-print lg:sticky lg:top-28 lg:self-start">
          <div className="border border-border bg-card p-5">
            <span className="almanac-index">查询条件 / QUERY</span>
            <div className="mt-4 border-t border-border pt-5">
            <label htmlFor="atar" className="eyebrow block text-brass">
              预计 ATAR
            </label>
            <input
              id="atar"
              type="number"
              inputMode="decimal"
              min={0}
              max={99.95}
              step={0.05}
              value={atarInput}
              onChange={(e) => setAtarInput(e.target.value)}
              className={cn(
                "score mt-3 w-full border bg-paper px-3 py-2.5 text-[1.5rem] text-green outline-none transition-colors duration-150 focus:border-brass",
                parsed.error ? "border-tier-reach" : "border-input",
              )}
            />
            {parsed.error ? (
              <p className="mt-2 flex items-start gap-1.5 text-[0.75rem] leading-relaxed text-tier-reach">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {parsed.error}
              </p>
            ) : (
              <p className="mt-2 text-[0.75rem] text-muted-foreground">有效区间 0 至 99.95，可精确到小数。</p>
            )}
            </div>

            <div className="mt-7 border-t border-border pt-6">
              <span className="eyebrow text-brass">已选 WACE 科目</span>
              <p className="mt-2 text-[0.75rem] leading-relaxed text-muted-foreground">
                用于校验先修要求。ATAR 通常取最好的四门科目，建议至少勾选四门。
              </p>
              {subjects.length > 0 && subjects.length < 4 && (
                <p className="mt-2 flex items-start gap-1.5 text-[0.75rem] leading-relaxed text-[oklch(0.48_0.07_74)]">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  目前仅选 {subjects.length} 门，WACE 计算 ATAR 需要至少 4 门 ATAR 科目。
                </p>
              )}
              <div className="mt-4 space-y-4">
                {SUBJECT_GROUPS.map((group) => (
                  <div key={group}>
                    <span className="text-[0.6875rem] tracking-[0.16em] text-muted-foreground">{group}</span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {SUBJECTS.filter((s) => s.group === group).map((s) => {
                        const on = subjects.includes(s.key);
                        return (
                          <button
                            key={s.key}
                            type="button"
                            onClick={() => toggle(subjects, s.key, setSubjects)}
                            title={s.note}
                            className={cn(
                              "border px-2 py-1 text-[0.75rem] transition-colors duration-150",
                              on
                                ? "border-green bg-green text-primary-foreground"
                                : "border-input text-muted-foreground hover:border-brass hover:text-green",
                            )}>
                            {s.zh}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 border-t border-border pt-6">
              <span className="eyebrow text-brass">地区</span>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {REGIONS.map((r) => {
                  const on = regions.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => toggle(regions, r.id, setRegions)}
                      className={cn(
                        "border px-2 py-1 text-[0.75rem] transition-colors duration-150",
                        on
                          ? "border-green bg-green text-primary-foreground"
                          : "border-input text-muted-foreground hover:border-brass hover:text-green",
                      )}>
                      {r.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[0.75rem] text-muted-foreground">不勾选则包含全部地区。</p>
            </div>

            <div className="mt-7 border-t border-border pt-6">
              <span className="eyebrow text-brass">专业方向</span>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {FIELDS.map((f) => {
                  const on = fields.includes(f.key);
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => toggle(fields, f.key, setFields)}
                      className={cn(
                        "border px-2 py-1 text-[0.75rem] transition-colors duration-150",
                        on
                          ? "border-green bg-green text-primary-foreground"
                          : "border-input text-muted-foreground hover:border-brass hover:text-green",
                      )}>
                      {f.zh}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[0.75rem] text-muted-foreground">不勾选则包含全部方向。</p>
            </div>

            {(regions.length > 0 || fields.length > 0) && (
              <button
                type="button"
                onClick={() => {
                  setRegions([]);
                  setFields([]);
                }}
                className="mt-6 inline-flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground transition-colors hover:text-green">
                <X className="h-3.5 w-3.5" />
                清除筛选条件
              </button>
            )}
          </div>

          {/* 分层定义速查，作为手册式说明栏 */}
          <div className="mt-5 border border-border bg-paper-deep/40 p-5">
            <span className="almanac-index">分层口径 / LEGEND</span>
            <dl className="mt-4 space-y-3 border-t border-border pt-4">
              {(["safe", "target", "reach", "unknown"] as Tier[]).map((t) => (
                <div key={t}>
                  <dt>
                    <TierBadge tier={t} />
                  </dt>
                  <dd className="mt-1.5 font-[family-name:var(--font-serif)] text-[0.75rem] leading-relaxed text-muted-foreground">
                    {TIER_META[t].definition}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>

        {/* 右侧结果长栏 */}
        <main>
          {parsed.value === null ? (
            <div className="border border-dashed border-border px-8 py-20 text-center">
              <p className="font-[family-name:var(--font-serif)] text-[1rem] text-muted-foreground">
                请先在左侧输入有效的预计 ATAR 分数。
              </p>
            </div>
          ) : (
            <>
              <div className="border border-border bg-card px-6 pb-8 pt-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="text-[1.25rem] text-green">分数定位</h2>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="no-print inline-flex items-center gap-1.5 border border-input px-3 py-1.5 text-[0.8125rem] text-muted-foreground transition-colors hover:border-brass hover:text-green">
                    <Printer className="h-3.5 w-3.5" />
                    打印结果
                  </button>
                </div>
                <div className="mt-8">
                  <ScoreRule
                    atar={parsed.value}
                    markers={[
                      { label: "80", value: 80, tone: "muted" },
                      { label: "85", value: 85, tone: "muted" },
                      { label: "90", value: 90 },
                      { label: "96", value: 96 },
                      { label: "98.5", value: 98.5, tone: "green" },
                    ]}
                  />
                </div>
              </div>

              {/* 分档统计 */}
              <div className="mt-8 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
                {summary.map((s) => {
                  const active = tierFilter === s.tier;
                  return (
                    <button
                      key={s.tier}
                      type="button"
                      onClick={() => setTierFilter(active ? "all" : s.tier)}
                      className={cn(
                        "bg-card px-5 py-5 text-left transition-colors duration-150",
                        active ? "bg-green/8" : "hover:bg-paper-deep/50",
                      )}>
                      <TierBadge tier={s.tier} />
                      <p className="score mt-3 text-[1.75rem] leading-none text-green">{s.count}</p>
                      <p className="mt-1.5 text-[0.75rem] text-muted-foreground">
                        个专业 · {s.universities} 所院校
                      </p>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-[0.75rem] text-muted-foreground">
                点击上方任一档位可筛选结果，再次点击取消筛选。
                {tierFilter !== "all" && (
                  <span className="ml-1 text-green">当前筛选：{TIER_META[tierFilter].label}</span>
                )}
              </p>

              {/* 结果列表 */}
              <div className="mt-10">
                <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b-2 border-green pb-3">
                  <div>
                    <span className="almanac-index">名录 / REGISTER</span>
                    <h2 className="mt-1 text-[1.375rem] text-green">匹配结果</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="no-print flex items-center gap-1.5">
                      <span className="text-[0.75rem] text-muted-foreground">分节方式</span>
                      {(
                        [
                          { k: "region", l: "按地区" },
                          { k: "band", l: "按门槛区间" },
                          { k: "tier", l: "按机会档位" },
                        ] as { k: GroupMode; l: string }[]
                      ).map((opt) => (
                        <button
                          key={opt.k}
                          type="button"
                          onClick={() => setGroupMode(opt.k)}
                          className={cn(
                            "border px-2 py-1 text-[0.75rem] transition-colors duration-150",
                            groupMode === opt.k
                              ? "border-green bg-green text-primary-foreground"
                              : "border-input text-muted-foreground hover:border-brass hover:text-green",
                          )}>
                          {opt.l}
                        </button>
                      ))}
                    </div>
                    <span className="score text-[0.8125rem] text-muted-foreground">
                      {visibleRows.length} / {rows.length} 条
                    </span>
                  </div>
                </div>

                {visibleRows.length === 0 ? (
                  <div className="border-x border-b border-border px-8 py-16 text-center">
                    <p className="font-[family-name:var(--font-serif)] text-[0.9375rem] text-muted-foreground">
                      当前条件下没有匹配的专业。请尝试放宽地区或专业方向筛选。
                    </p>
                  </div>
                ) : (
                  <div className="space-y-10">
                    {sections.map((section, si) => (
                      <section key={section.key}>
                        {/* 小节标题：年鉴式编号 + 铜金门槛虚线 */}
                        <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1.5 pt-2">
                          <div>
                            <span className="almanac-index">
                              {String(si + 1).padStart(2, "0")} · SECTION
                            </span>
                            <h3 className="mt-0.5 text-[1.125rem] text-green">{section.title}</h3>
                          </div>
                          <p className="max-w-[46ch] text-right font-[family-name:var(--font-serif)] text-[0.75rem] leading-relaxed text-muted-foreground">
                            {section.hint}
                          </p>
                        </header>
                        <div className="threshold-hairline mt-2" />

                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[46rem] border-collapse">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="eyebrow w-10 py-2.5 pr-2 text-left text-muted-foreground">No.</th>
                                <th className="eyebrow py-2.5 pr-4 text-left text-muted-foreground">
                                  院校与专业
                                </th>
                                <th className="eyebrow py-2.5 pr-4 text-left text-muted-foreground">
                                  先修与附加要求
                                </th>
                                <th className="eyebrow w-20 py-2.5 pr-3 text-right text-muted-foreground">
                                  门槛
                                </th>
                                <th className="eyebrow w-16 py-2.5 pr-3 text-right text-muted-foreground">
                                  差值
                                </th>
                                <th className="eyebrow w-20 py-2.5 text-right text-muted-foreground">档位</th>
                              </tr>
                            </thead>
                            <tbody>
                              {section.rows.map((row, i) => {
                                const threshold = row.programme.atar ?? row.university.minAtar;
                                return (
                                  <tr
                                    key={`${row.university.id}-${row.programme.id}`}
                                    className="border-b border-border/70 align-top transition-colors duration-150 hover:bg-paper-deep/30">
                                    <td className="almanac-index py-3.5 pr-2">
                                      {String(i + 1).padStart(2, "0")}
                                    </td>
                                    <td className="py-3.5 pr-4">
                                      <span className="text-[0.9375rem] leading-snug text-green">
                                        {row.university.nameZh}
                                        <span className="mx-1.5 text-brass">·</span>
                                        {row.programme.nameZh}
                                      </span>
                                      <span className="mt-0.5 block text-[0.6875rem] leading-snug text-muted-foreground">
                                        {row.university.abbr} · {row.programme.name}
                                      </span>
                                    </td>
                                    <td className="py-3.5 pr-4">
                                      <span className="block font-[family-name:var(--font-serif)] text-[0.8125rem] leading-relaxed text-muted-foreground">
                                        {row.programme.prerequisiteNote}
                                      </span>
                                      {row.prerequisite.satisfied ? (
                                        row.programme.prerequisites.length > 0 && (
                                          <span className="mt-1 inline-flex items-center gap-1.5 text-[0.75rem] text-tier-safe">
                                            <Check className="h-3.5 w-3.5" />
                                            已选科目满足先修
                                          </span>
                                        )
                                      ) : (
                                        <span className="mt-1 flex items-start gap-1.5 text-[0.75rem] leading-relaxed text-tier-reach">
                                          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                          尚缺 {row.prerequisite.missing.map(subjectGroupLabel).join("；")}
                                        </span>
                                      )}
                                      {row.programme.extras.length > 0 && (
                                        <span className="mt-1.5 flex flex-wrap gap-1.5">
                                          {row.programme.extras.map((e) => (
                                            <span
                                              key={e}
                                              className="border border-brass/50 bg-brass/8 px-1.5 py-0.5 text-[0.6875rem] text-[oklch(0.45_0.07_74)]">
                                              {e}
                                            </span>
                                          ))}
                                        </span>
                                      )}
                                    </td>
                                    <td className="score py-3.5 pr-3 text-right text-[1rem] text-ink">
                                      {threshold === null ? "—" : threshold.toFixed(2)}
                                    </td>
                                    <td
                                      className={cn(
                                        "score py-3.5 pr-3 text-right text-[0.875rem]",
                                        row.gap === null
                                          ? "text-muted-foreground"
                                          : row.gap >= 0
                                            ? "text-tier-safe"
                                            : "text-tier-reach",
                                      )}>
                                      {row.gap === null
                                        ? "—"
                                        : `${row.gap > 0 ? "+" : ""}${row.gap.toFixed(2)}`}
                                    </td>
                                    <td className="py-3.5 text-right">
                                      <TierBadge tier={row.tier} />
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
                )}
              </div>

              <p className="mt-6 border-t border-border pt-5 text-[0.75rem] leading-relaxed text-muted-foreground">
                说明：所需 ATAR 为院校官方公布的最低门槛。若院校未按专业单列门槛，则沿用全校最低要求，热门专业的实际竞争分数通常显著更高。达到门槛不构成录取保证。
              </p>
            </>
          )}
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
