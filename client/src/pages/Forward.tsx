/**
 * 设计风格：Admissions Almanac
 * 正向查询页：左侧固定索引栏（输入条件）+ 右侧结果长栏（分层列表）。
 * 分数一律等宽右对齐；结果行以规则线分隔，不使用卡片网格。
 */
import { useMemo, useState } from "react";
import { AlertTriangle, Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { Tick } from "@/components/Motion";
import { QsRank } from "@/components/QsRank";
import { qsSortKey } from "@/data/qs";
import { PrintHeader } from "@/components/PrintHeader";
import { PrintReportButton } from "@/components/PrintReportButton";
import { ScoreRule } from "@/components/ScoreRule";
import { TierBadge } from "@/components/TierBadge";
import { ShortlistButton } from "@/components/ShortlistButton";
import { FIELDS, REGIONS, SUBJECTS, type FieldKey, type Region, type SubjectKey } from "@/data/universities";
import {
  forwardMatch,
  extraLabel,
  subjectGroupLabelBy,
  summarizeByTier,
  tierDefinition,
  tierLabel,
  type MatchRow,
  type Tier,
} from "@/lib/matching";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LangContext";
import { useIsMobile } from "@/hooks/useMobile";

const SUBJECT_GROUPS = ["数学", "科学", "商科", "科技", "人文与语言"] as const;

const GROUP_EN: Record<(typeof SUBJECT_GROUPS)[number], string> = {
  数学: "Mathematics",
  科学: "Sciences",
  商科: "Business",
  科技: "Technology",
  人文与语言: "Humanities & Languages",
};

/** 结果分组方式：年鉴式命名小节的依据 */
type GroupMode = "region" | "tier" | "band";
/**
 * 节内排序方式。QS 排名是参考坐标而非录取门槛，因此做成「节内排序」而不是分节维度：
 * 家长仍按地区／门槛／档位理解结构，只是在每一节里换个先后顺序看。
 */
type SortMode = "threshold" | "qs";

const BANDS: {
  key: string;
  label: string;
  labelEn: string;
  hint: string;
  hintEn: string;
  min: number;
  max: number;
}[] = [
  {
    key: "b98",
    label: "98 及以上",
    labelEn: "98 and above",
    hint: "牛剑与 G5 顶尖专业区间",
    hintEn: "Oxbridge and the most selective G5 programmes",
    min: 98,
    max: 100,
  },
  {
    key: "b95",
    label: "95 至 97.99",
    labelEn: "95 to 97.99",
    hint: "英国 G5 主流专业与澳洲顶尖医学法律",
    hintEn: "Mainstream G5 programmes and top Australian medicine and law",
    min: 95,
    max: 97.99,
  },
  {
    key: "b90",
    label: "90 至 94.99",
    labelEn: "90 to 94.99",
    hint: "新加坡公立大学与港前三主力区间",
    hintEn: "Singapore's public universities and the top three Hong Kong institutions",
    min: 90,
    max: 94.99,
  },
  {
    key: "b85",
    label: "85 至 89.99",
    labelEn: "85 to 89.99",
    hint: "香港理工与澳洲八大热门专业",
    hintEn: "PolyU and in-demand Group of Eight programmes",
    min: 85,
    max: 89.99,
  },
  {
    key: "b80",
    label: "80 至 84.99",
    labelEn: "80 to 84.99",
    hint: "香港八大普遍门槛与澳洲主流专业",
    hintEn: "The common Hong Kong Eight threshold and mainstream Australian degrees",
    min: 80,
    max: 84.99,
  },
  {
    key: "b70",
    label: "70 至 79.99",
    labelEn: "70 to 79.99",
    hint: "澳洲八大基础学位与保底选项",
    hintEn: "Foundational Group of Eight degrees and safety options",
    min: 70,
    max: 79.99,
  },
  {
    key: "bna",
    label: "官方未公布",
    labelEn: "Not published",
    hint: "综合评估或个案审核，需顾问评估",
    hintEn: "Holistic or case-by-case assessment; requires a counsellor's review",
    min: -1,
    max: -1,
  },
];

export default function Forward() {
  const { t, lang } = useLang();
  const [atarInput, setAtarInput] = useState("92");
  const [subjects, setSubjects] = useState<SubjectKey[]>(["english", "mathMethods", "chemistry", "physics"]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [fields, setFields] = useState<FieldKey[]>([]);
  const [tierFilter, setTierFilter] = useState<Tier | "all">("all");
  const [groupMode, setGroupMode] = useState<GroupMode>("region");
  const [sortMode, setSortMode] = useState<SortMode>("threshold");
  const [filtersOpen, setFiltersOpen] = useState(false);

  /** 解析并校验 ATAR 输入：ATAR 取值区间为 0 至 99.95 */
  const parsed = useMemo(() => {
    const raw = atarInput.trim();
    if (raw === "")
      return { value: null as number | null, error: t("请输入预计 ATAR 分数。", "Enter a projected ATAR.") };
    const n = Number(raw);
    if (!Number.isFinite(n))
      return {
        value: null,
        error: t("请输入有效数字，例如 92 或 92.35。", "Enter a valid number, for example 92 or 92.35."),
      };
    if (n < 0 || n > 99.95)
      return {
        value: null,
        error: t("ATAR 的有效区间为 0 至 99.95。", "ATAR must fall between 0 and 99.95."),
      };
    return { value: n, error: null as string | null };
  }, [atarInput, t]);

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
    /** 节内排序：默认保持原有的门槛顺序，选 QS 时按世界排名升序，未列入的沉底 */
    const order = (list: MatchRow[]) =>
      sortMode === "qs"
        ? [...list].sort((a, b) => qsSortKey(a.university.id) - qsSortKey(b.university.id))
        : list;
    if (groupMode === "region") {
      for (const r of REGIONS) {
        const subset = visibleRows.filter((row) => row.university.region === r.id);
        if (subset.length > 0)
          out.push({
            key: r.id,
            title: lang === "zh" ? r.label : r.labelEn,
            hint: lang === "zh" ? r.blurb : r.blurbEn,
            rows: order(subset),
          });
      }
    } else if (groupMode === "tier") {
      for (const t of ["safe", "target", "reach", "unknown"] as Tier[]) {
        const subset = visibleRows.filter((row) => row.tier === t);
        if (subset.length > 0)
          out.push({
            key: t,
            title: tierLabel(t, lang),
            hint: tierDefinition(t, lang),
            rows: order(subset),
          });
      }
    } else {
      for (const b of BANDS) {
        const subset = visibleRows.filter((row) => {
          const th = row.programme.atar ?? row.university.minAtar;
          if (b.min === -1) return th === null;
          return th !== null && th >= b.min && th <= b.max;
        });
        if (subset.length > 0)
          out.push({
            key: b.key,
            title: lang === "zh" ? b.label : b.labelEn,
            hint: lang === "zh" ? b.hint : b.hintEn,
            rows: order(subset),
          });
      }
    }
    return out;
  }, [visibleRows, groupMode, sortMode, lang]);

  function toggle<T>(list: T[], value: T, setter: (v: T[]) => void) {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  /**
   * 手机端筛选栏折叠时的「已选条件」摘要。
   * 家长通常只想确认输入是否正确，因此摘要按 ATAR、科目数、地区、方向、档位依次列出，
   * 未设置的筛选显式写成「全部」而不是留空，避免误以为漏填。
   */
  const summaryChips = useMemo(() => {
    const chips: { key: string; label: string }[] = [];
    chips.push({
      key: "atar",
      label: `ATAR ${parsed.value === null ? t("未填写", "not set") : parsed.value.toFixed(2)}`,
    });
    chips.push({
      key: "subjects",
      label: t(`${subjects.length} 门科目`, `${subjects.length} subjects`),
    });
    chips.push({
      key: "regions",
      label:
        regions.length === 0
          ? t("地区：全部", "Regions: all")
          : `${t("地区：", "Regions: ")}${regions
              .map((id) => {
                const meta = REGIONS.find((r) => r.id === id);
                return lang === "zh" ? meta?.label : meta?.labelEn;
              })
              .join(lang === "zh" ? "、" : ", ")}`,
    });
    chips.push({
      key: "fields",
      label:
        fields.length === 0
          ? t("方向：全部", "Fields: all")
          : `${t("方向：", "Fields: ")}${fields
              .map((key) => {
                const meta = FIELDS.find((f) => f.key === key);
                return lang === "zh" ? meta?.zh : meta?.en;
              })
              .join(lang === "zh" ? "、" : ", ")}`,
    });
    if (tierFilter !== "all") {
      chips.push({ key: "tier", label: `${t("档位：", "Band: ")}${tierLabel(tierFilter, lang)}` });
    }
    return chips;
  }, [parsed.value, subjects.length, regions, fields, tierFilter, lang, t]);

  /** 每节默认显示条数：手机端进一步收敛，避免长结果淹没筛选与分档信息 */
  const isMobile = useIsMobile();
  const sectionPreview = isMobile ? 6 : 12;
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set<string>());

  function toggleSection(key: string) {
    setOpenSections((prev: Set<string>) => {
      const next = new Set<string>(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="print-title-band border-b border-border bg-paper-deep/45">
        <div className="container py-10">
          <span className="eyebrow text-brass">{t("WACE · 有成绩规划", "WACE · Plan from Grades")}</span>
          <h1 className="mt-3 text-[2.25rem] leading-tight text-green">
            {t(
              "有成绩规划：按预计 ATAR 查院校与专业",
              "Find reachable universities and programmes by projected ATAR",
            )}
          </h1>
          <p className="mt-4 max-w-[64ch] font-[family-name:var(--font-serif)] text-[1rem] leading-relaxed text-muted-foreground">
            {t(
              "输入预计 ATAR 与已修读的 WACE 科目，系统会按官方最低门槛分出稳妥、匹配、冲刺三档，并逐条校验先修科目是否满足。",
              "Enter a projected ATAR and the WACE subjects already taken. Results are sorted into safety, match and reach bands against official minimum thresholds, with every prerequisite checked.",
            )}
          </p>
        </div>
      </div>

      <div className="container grid gap-10 py-12 lg:grid-cols-[17.5rem_1fr] lg:gap-12">
        <PrintHeader
          title={t("ATAR 查询结果报告", "ATAR match report")}
          subtitle={t(
            `预计 ATAR ${parsed.value === null ? "未填写" : parsed.value.toFixed(2)}，共匹配 ${rows.length} 个专业。门槛为官方最低要求，非录取保证。`,
            `Projected ATAR ${parsed.value === null ? "not set" : parsed.value.toFixed(2)}; ${rows.length} programmes matched. Thresholds are official minimums and not guarantees of an offer.`,
          )}
        />

        {/* 左侧索引栏 */}
        <aside className="no-print lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto">
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            className="mb-4 flex w-full items-center justify-between border border-green bg-green px-4 py-3 text-left text-[0.8125rem] text-primary-foreground md:hidden">
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              {t("查询条件与筛选", "Query settings & filters")}
            </span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", filtersOpen && "rotate-180")} />
          </button>
          {/* 折叠状态下的已选条件摘要：让家长无需展开即可复核输入 */}
          {!filtersOpen && (
            <div className="mb-4 border border-border bg-paper-deep/45 p-3.5 md:hidden">
              <span className="almanac-index">{t("已选条件 / SUMMARY", "SUMMARY")}</span>
              <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-border pt-2.5">
                {summaryChips.map((chip) => (
                  <span
                    key={chip.key}
                    className="border border-brass/45 bg-brass/8 px-2 py-0.5 text-[0.6875rem] leading-relaxed text-[oklch(0.42_0.07_74)]">
                    {chip.label}
                  </span>
                ))}
              </div>
              {subjects.length > 0 && subjects.length < 4 && (
                <p className="mt-2.5 flex items-start gap-1.5 text-[0.6875rem] leading-relaxed text-[oklch(0.48_0.07_74)]">
                  <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                  {t("科目不足四门，ATAR 计算需至少四门。", "Fewer than four subjects; an ATAR needs at least four.")}
                </p>
              )}
            </div>
          )}
          <div className={cn("md:block", !filtersOpen && "hidden")}>
          <div className="border border-border bg-card p-5">
            <span className="almanac-index">{t("查询条件 / QUERY", "QUERY")}</span>
            <div className="mt-4 border-t border-border pt-5">
            <label htmlFor="atar" className="eyebrow block text-brass">
              {t("预计 ATAR", "Projected ATAR")}
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
              <p className="mt-2 text-[0.75rem] text-muted-foreground">
                {t("有效区间 0 至 99.95，可精确到小数。", "Valid range 0 to 99.95; decimals accepted.")}
              </p>
            )}
            </div>

            <div className="mt-7 border-t border-border pt-6">
              <span className="eyebrow text-brass">{t("已选 WACE 科目", "WACE subjects taken")}</span>
              <p className="mt-2 text-[0.75rem] leading-relaxed text-muted-foreground">
                {t(
                  "用于校验先修要求。ATAR 通常取最好的四门科目，建议至少勾选四门。",
                  "Used to check prerequisites. An ATAR is normally calculated from the best four subjects, so select at least four.",
                )}
              </p>
              {subjects.length > 0 && subjects.length < 4 && (
                <p className="mt-2 flex items-start gap-1.5 text-[0.75rem] leading-relaxed text-[oklch(0.48_0.07_74)]">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {t(
                    `目前仅选 ${subjects.length} 门，WACE 计算 ATAR 需要至少 4 门 ATAR 科目。`,
                    `Only ${subjects.length} selected. A WACE ATAR requires at least four ATAR courses.`,
                  )}
                </p>
              )}
              <div className="mt-4 space-y-4">
                {SUBJECT_GROUPS.map((group) => (
                  <div key={group}>
                    <span className="text-[0.6875rem] tracking-[0.16em] text-muted-foreground">
                      {lang === "zh" ? group : GROUP_EN[group]}
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {SUBJECTS.filter((s) => s.group === group).map((s) => {
                        const on = subjects.includes(s.key);
                        return (
                          <button
                            key={s.key}
                            type="button"
                            onClick={() => toggle(subjects, s.key, setSubjects)}
                            title={lang === "zh" ? s.note : s.noteEn}
                            className={cn(
                              "border px-2 py-1 text-[0.75rem] transition-colors duration-150",
                              on
                                ? "border-green bg-green text-primary-foreground"
                                : "border-input text-muted-foreground hover:border-brass hover:text-green",
                            )}>
                            {lang === "zh" ? s.zh : s.en}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 border-t border-border pt-6">
              <span className="eyebrow text-brass">{t("地区", "Region")}</span>
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
                      {lang === "zh" ? r.label : r.labelEn}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[0.75rem] text-muted-foreground">
                {t("不勾选则包含全部地区。", "Leave unselected to include every region.")}
              </p>
            </div>

            <div className="mt-7 border-t border-border pt-6">
              <span className="eyebrow text-brass">{t("专业方向", "Field of study")}</span>
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
                      {lang === "zh" ? f.zh : f.en}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[0.75rem] text-muted-foreground">
                {t("不勾选则包含全部方向。", "Leave unselected to include every field.")}
              </p>
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
                {t("清除筛选条件", "Clear filters")}
              </button>
            )}
          </div>

          {/* 分层定义速查，作为手册式说明栏 */}
          <div className="mt-5 border border-border bg-paper-deep/40 p-5">
            <span className="almanac-index">{t("分层口径 / LEGEND", "LEGEND")}</span>
            <dl className="mt-4 space-y-3 border-t border-border pt-4">
              {(["safe", "target", "reach", "unknown"] as Tier[]).map((tierKey) => (
                <div key={tierKey}>
                  <dt>
                    <TierBadge tier={tierKey} />
                  </dt>
                  <dd className="mt-1.5 font-[family-name:var(--font-serif)] text-[0.75rem] leading-relaxed text-muted-foreground">
                    {tierDefinition(tierKey, lang)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          </div>
        </aside>

        {/* 右侧结果长栏 */}
        <main>
          {parsed.value === null ? (
            <div className="border border-dashed border-border px-8 py-20 text-center">
              <p className="font-[family-name:var(--font-serif)] text-[1rem] text-muted-foreground">
                {t("请先在左侧输入有效的预计 ATAR 分数。", "Enter a valid projected ATAR on the left to begin.")}
              </p>
            </div>
          ) : (
            <>
              <div className="border border-border bg-card px-6 pb-8 pt-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="text-[1.25rem] text-green">{t("分数定位", "Where the score sits")}</h2>
                  <PrintReportButton compact />
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
                        {t(
                          `个专业 · ${s.universities} 所院校`,
                          `programmes · ${s.universities} universities`,
                        )}
                      </p>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-[0.75rem] text-muted-foreground">
                {t(
                  "点击上方任一档位可筛选结果，再次点击取消筛选。",
                  "Click any band above to filter; click again to clear.",
                )}
                {tierFilter !== "all" && (
                  <span className="ml-1 text-green">
                    {t("当前筛选：", "Filtered to: ")}
                    {tierLabel(tierFilter, lang)}
                  </span>
                )}
              </p>

              {/* 结果列表 */}
              <div className="mt-10">
                <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b-2 border-green pb-3">
                  <div>
                    <span className="almanac-index">{t("名录 / REGISTER", "REGISTER")}</span>
                    <h2 className="mt-1 text-[1.375rem] text-green">{t("匹配结果", "Matched programmes")}</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="no-print flex items-center gap-1.5">
                      <span className="text-[0.75rem] text-muted-foreground">{t("分节方式", "Group by")}</span>
                      {(
                        [
                          { k: "region", l: t("按地区", "Region") },
                          { k: "band", l: t("按门槛区间", "Threshold") },
                          { k: "tier", l: t("按机会档位", "Band") },
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
                    <div className="no-print flex items-center gap-1.5">
                      <span className="text-[0.75rem] text-muted-foreground">{t("节内排序", "Order within")}</span>
                      {(
                        [
                          { k: "threshold", l: t("按门槛", "Threshold") },
                          { k: "qs", l: t("按 QS 排名", "QS rank") },
                        ] as { k: SortMode; l: string }[]
                      ).map((opt) => (
                        <button
                          key={opt.k}
                          type="button"
                          onClick={() => setSortMode(opt.k)}
                          className={cn(
                            "border px-2 py-1 text-[0.75rem] transition-colors duration-150",
                            sortMode === opt.k
                              ? "border-green bg-green text-primary-foreground"
                              : "border-input text-muted-foreground hover:border-brass hover:text-green",
                          )}>
                          {opt.l}
                        </button>
                      ))}
                    </div>
                    <span className="score text-[0.8125rem] text-muted-foreground">
                      <Tick>{visibleRows.length}</Tick> / {rows.length}
                    </span>
                  </div>
                </div>

                {visibleRows.length === 0 ? (
                  <div className="border-x border-b border-border px-8 py-16 text-center">
                    <p className="font-[family-name:var(--font-serif)] text-[0.9375rem] text-muted-foreground">
                      {t(
                        "当前条件下没有匹配的专业。请尝试放宽地区或专业方向筛选。",
                        "No programmes match the current filters. Try widening the region or field selection.",
                      )}
                    </p>
                  </div>
                ) : (
                  /*
                   * key 取分组方式与命中数：切换分组或调整筛选后整块结果换页，
                   * 让家长确认列表确实按新条件重排过。
                   */
                  <div key={`${groupMode}-${sortMode}-${visibleRows.length}`} className="swap space-y-10">
                    {sections.map((section, si) => {
                      const isOpen = openSections.has(section.key);
                      const shownRows = isOpen
                        ? section.rows
                        : section.rows.slice(0, sectionPreview);
                      const hiddenCount = section.rows.length - shownRows.length;
                      return (
                      <section key={section.key}>
                        {/* 小节标题：年鉴式编号 + 铜金门槛虚线 */}
                        <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1.5 pt-2">
                          <div>
                            <span className="almanac-index">
                              {String(si + 1).padStart(2, "0")} · SECTION
                            </span>
                            <h3 className="mt-0.5 text-[1.125rem] text-green">
                              {section.title}
                              <span className="score ml-2.5 text-[0.8125rem] font-normal text-muted-foreground">
                                {section.rows.length}
                              </span>
                            </h3>
                          </div>
                          <p className="max-w-[46ch] text-right font-[family-name:var(--font-serif)] text-[0.75rem] leading-relaxed text-muted-foreground">
                            {section.hint}
                          </p>
                        </header>
                        <div className="threshold-hairline mt-2" />

                        <div className="print-hide-mobile space-y-3 md:hidden">
                          {shownRows.map((row, i) => {
                            const threshold = row.programme.atar ?? row.university.minAtar;
                            return (
                              <article
                                key={`${row.university.id}-${row.programme.id}`}
                                className="border border-border bg-card p-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <span className="almanac-index">{String(i + 1).padStart(2, "0")}</span>
                                    <h4 className="mt-1 text-[1rem] leading-snug text-green">
                                      {lang === "zh" ? row.university.nameZh : row.university.name}
                                      <span className="mx-1 text-brass">·</span>
                                      {lang === "zh" ? row.programme.nameZh : row.programme.name}
                                    </h4>
                                    <p className="mt-1 text-[0.6875rem] text-muted-foreground">
                                      {row.university.abbr} · {lang === "zh" ? row.programme.name : row.programme.nameZh}
                                    </p>
                                    <p className="mt-1.5">
                                      <QsRank universityId={row.university.id} />
                                    </p>
                                  </div>
                                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                                    <TierBadge tier={row.tier} />
                                    <ShortlistButton
                                      universityId={row.university.id}
                                      programmeId={row.programme.id}
                                      label={lang === "zh" ? row.programme.nameZh : row.programme.name}
                                    />
                                  </div>
                                </div>
                                <div className="mt-3 flex items-end justify-between border-t border-border pt-3">
                                  <div>
                                    <span className="eyebrow text-muted-foreground">{t("门槛", "Threshold")}</span>
                                    <p className="score mt-1 text-[1.25rem] leading-none text-green">
                                      {threshold === null ? "—" : threshold.toFixed(2)}
                                    </p>
                                  </div>
                                  <p
                                    className={cn(
                                      "score text-[0.875rem]",
                                      row.gap === null
                                        ? "text-muted-foreground"
                                        : row.gap >= 0
                                          ? "text-tier-safe"
                                          : "text-tier-reach",
                                    )}>
                                    {t("差值", "Gap")} {row.gap === null ? "—" : `${row.gap > 0 ? "+" : ""}${row.gap.toFixed(2)}`}
                                  </p>
                                </div>
                                {row.programme.atarNote && (
                                  <p className="mt-3 font-[family-name:var(--font-serif)] text-[0.8125rem] leading-relaxed text-muted-foreground">
                                    {lang === "zh" ? row.programme.atarNote : (row.programme.atarNoteEn ?? row.programme.atarNote)}
                                  </p>
                                )}
                                {row.prerequisite.satisfied ? (
                                  row.programme.prerequisites.length > 0 && (
                                    <p className="mt-2 inline-flex items-center gap-1.5 text-[0.75rem] text-tier-safe">
                                      <Check className="h-3.5 w-3.5" /> {t("已选科目满足先修", "Prerequisites met")}
                                    </p>
                                  )
                                ) : (
                                  <p className="mt-2 flex items-start gap-1.5 text-[0.75rem] leading-relaxed text-tier-reach">
                                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                    {t("尚缺 ", "Missing: ")}
                                    {row.prerequisite.missing.map((g) => subjectGroupLabelBy(g, lang)).join(lang === "zh" ? "；" : "; ")}
                                  </p>
                                )}
                                {row.programme.extras.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1.5">
                                    {row.programme.extras.map((e) => (
                                      <span key={e} className="border border-brass/50 bg-brass/8 px-1.5 py-0.5 text-[0.6875rem] text-[oklch(0.45_0.07_74)]">
                                        {extraLabel(e, lang)}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </article>
                            );
                          })}
                        </div>
                        <div className="print-show-table hidden overflow-x-auto md:block">
                          <table className="w-full min-w-[46rem] border-collapse">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="eyebrow w-10 py-2.5 pr-2 text-left text-muted-foreground">No.</th>
                                <th className="eyebrow py-2.5 pr-4 text-left text-muted-foreground">
                                  {t("院校与专业", "University & programme")}
                                </th>
                                <th className="eyebrow py-2.5 pr-4 text-left text-muted-foreground">
                                  {t("先修与附加要求", "Prerequisites & extras")}
                                </th>
                                <th className="eyebrow w-20 py-2.5 pr-3 text-right text-muted-foreground">
                                  {t("门槛", "Threshold")}
                                </th>
                                <th className="eyebrow w-16 py-2.5 pr-3 text-right text-muted-foreground">
                                  {t("差值", "Gap")}
                                </th>
                                <th className="eyebrow w-20 py-2.5 text-right text-muted-foreground">
                                  {t("档位", "Band")}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {shownRows.map((row, i) => {
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
                                        {lang === "zh" ? row.university.nameZh : row.university.name}
                                        <span className="mx-1.5 text-brass">·</span>
                                        {lang === "zh" ? row.programme.nameZh : row.programme.name}
                                      </span>
                                      <span className="mt-0.5 block text-[0.6875rem] leading-snug text-muted-foreground">
                                        {row.university.abbr} ·{" "}
                                        {lang === "zh" ? row.programme.name : row.programme.nameZh}
                                      </span>
                                      <span className="mt-1 block">
                                        <QsRank universityId={row.university.id} />
                                      </span>
                                    </td>
                                    <td className="py-3.5 pr-4">
                                      {row.programme.atarNote && (
                                        <span className="block font-[family-name:var(--font-serif)] text-[0.8125rem] leading-relaxed text-muted-foreground">
                                          {lang === "zh"
                                            ? row.programme.atarNote
                                            : (row.programme.atarNoteEn ?? row.programme.atarNote)}
                                        </span>
                                      )}
                                      {row.prerequisite.satisfied ? (
                                        row.programme.prerequisites.length > 0 && (
                                          <span className="mt-1 inline-flex items-center gap-1.5 text-[0.75rem] text-tier-safe">
                                            <Check className="h-3.5 w-3.5" />
                                            {t("已选科目满足先修", "Prerequisites met")}
                                          </span>
                                        )
                                      ) : (
                                        <span className="mt-1 flex items-start gap-1.5 text-[0.75rem] leading-relaxed text-tier-reach">
                                          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                          {t("尚缺 ", "Missing: ")}
                                          {row.prerequisite.missing
                                            .map((g) => subjectGroupLabelBy(g, lang))
                                            .join(lang === "zh" ? "；" : "; ")}
                                        </span>
                                      )}
                                      {row.programme.extras.length > 0 && (
                                        <span className="mt-1.5 flex flex-wrap gap-1.5">
                                      {row.programme.extras.map((e) => (
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
                                      <div className="flex flex-col items-end gap-1.5">
                                        <TierBadge tier={row.tier} />
                                        <ShortlistButton
                                          universityId={row.university.id}
                                          programmeId={row.programme.id}
                                          label={lang === "zh" ? row.programme.nameZh : row.programme.name}
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {hiddenCount > 0 && (
                          <button
                            type="button"
                            onClick={() => toggleSection(section.key)}
                            className="no-print mt-3 inline-flex items-center gap-1.5 border-b border-brass pb-0.5 text-[0.8125rem] text-green transition-colors hover:text-brass">
                            <ChevronDown className="h-3.5 w-3.5" />
                            {t(
                              `展开本节其余 ${hiddenCount} 个专业`,
                              `Show ${hiddenCount} more in this section`,
                            )}
                          </button>
                        )}
                        {isOpen && section.rows.length > sectionPreview && (
                          <button
                            type="button"
                            onClick={() => toggleSection(section.key)}
                            className="no-print mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground transition-colors hover:text-green">
                            <ChevronDown className="h-3.5 w-3.5 rotate-180" />
                            {t("收起本节", "Collapse section")}
                          </button>
                        )}
                      </section>
                      );
                    })}
                  </div>
                )}
              </div>

              <p className="mt-6 border-t border-border pt-5 text-[0.75rem] leading-relaxed text-muted-foreground">
                {t(
                  "说明：所需 ATAR 为院校官方公布的最低门槛。若院校未按专业单列门槛，则沿用全校最低要求，热门专业的实际竞争分数通常显著更高。达到门槛不构成录取保证。",
                  "Note: the ATAR shown is the officially published minimum. Where a university does not publish a programme-level threshold, the institution-wide minimum is used; competitive programmes typically settle well above it. Meeting a threshold does not guarantee an offer.",
                )}
              </p>
            </>
          )}
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
