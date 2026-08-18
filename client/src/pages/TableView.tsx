/**
 * 设计风格：Admissions Almanac
 * 门槛总表页：一页对照 31 所院校，表格化排版，分数等宽右对齐，可直接打印。
 */
import { useMemo, useState } from "react";
import { ChevronDown, ExternalLink, Printer, Search } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { REGIONS, UNIVERSITIES, type Region } from "@/data/universities";
import { confidenceLabel, extraLabel } from "@/lib/matching";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LangContext";

type SortKey = "region" | "atar" | "name";

/** 每校默认显示的专业条数，超出部分折叠 */
const PREVIEW_COUNT = 8;

export default function TableView() {
  const { t, lang } = useLang();
  const [region, setRegion] = useState<Region | "all">("all");
  const [keyword, setKeyword] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("region");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const rows = useMemo(() => {
    let list = UNIVERSITIES.filter((u) => (region === "all" ? true : u.region === region));
    const kw = keyword.trim().toLowerCase();
    if (kw !== "") {
      list = list.filter(
        (u) =>
          u.nameZh.toLowerCase().includes(kw) ||
          u.name.toLowerCase().includes(kw) ||
          u.abbr.toLowerCase().includes(kw) ||
          u.programmes.some(
            (p) => p.nameZh.toLowerCase().includes(kw) || p.name.toLowerCase().includes(kw),
          ),
      );
    }
    const regionOrder: Region[] = ["sg", "hk", "au", "uk"];
    return [...list].sort((a, b) => {
      if (sortKey === "atar") {
        // 未公布门槛的院校排在最后
        const av = a.minAtar ?? -1;
        const bv = b.minAtar ?? -1;
        return bv - av;
      }
      if (sortKey === "name") return a.nameZh.localeCompare(b.nameZh, "zh-Hans-CN");
      const ra = regionOrder.indexOf(a.region);
      const rb = regionOrder.indexOf(b.region);
      if (ra !== rb) return ra - rb;
      return (b.minAtar ?? -1) - (a.minAtar ?? -1);
    });
  }, [region, keyword, sortKey]);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="border-b border-border bg-paper-deep/45">
        <div className="container py-10">
          <span className="eyebrow text-brass">{t("门槛总表 · Master Table", "Master Table")}</span>
          <h1 className="mt-3 text-[2.25rem] leading-tight text-green">
            {t("31 所目标院校门槛总表", "Admission thresholds across 31 universities")}
          </h1>
          <p className="mt-4 max-w-[64ch] font-[family-name:var(--font-serif)] text-[1rem] leading-relaxed text-muted-foreground">
            {t(
              "按地区汇总各校最低 ATAR、英语要求、申请窗口与代表性专业门槛。可直接打印，用作家长面谈或宣讲会讲义。",
              "A regional summary of each university's minimum ATAR, English requirement, application window and programme-level thresholds. Print it directly for parent meetings or information evenings.",
            )}
          </p>
        </div>
      </div>

      <div className="container py-10">
        <div className="no-print flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setRegion("all")}
              className={cn(
                "border px-3 py-1.5 text-[0.8125rem] transition-colors duration-150",
                region === "all"
                  ? "border-green bg-green text-primary-foreground"
                  : "border-input text-muted-foreground hover:border-brass hover:text-green",
              )}>
              {t("全部", "All")} {UNIVERSITIES.length}
            </button>
            {REGIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRegion(r.id)}
                className={cn(
                  "border px-3 py-1.5 text-[0.8125rem] transition-colors duration-150",
                  region === r.id
                    ? "border-green bg-green text-primary-foreground"
                    : "border-input text-muted-foreground hover:border-brass hover:text-green",
                )}>
                {lang === "zh" ? r.label : r.labelEn}{" "}
                {UNIVERSITIES.filter((u) => u.region === r.id).length}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder={t("搜索院校或专业", "Search universities or programmes")}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-52 border border-input bg-paper py-1.5 pl-8 pr-3 text-[0.8125rem] text-ink outline-none focus:border-brass"
              />
            </div>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="border border-input bg-paper px-2.5 py-1.5 text-[0.8125rem] text-ink outline-none focus:border-brass">
              <option value="region">{t("按地区排序", "Sort by region")}</option>
              <option value="atar">{t("按门槛由高到低", "Sort by threshold, high to low")}</option>
              <option value="name">{t("按校名排序", "Sort by name")}</option>
            </select>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 border border-input px-3 py-1.5 text-[0.8125rem] text-muted-foreground transition-colors hover:border-brass hover:text-green">
              <Printer className="h-3.5 w-3.5" />
              {t("打印", "Print")}
            </button>
          </div>
        </div>

        {rows.length === 0 ? (
          <p className="px-6 py-20 text-center font-[family-name:var(--font-serif)] text-[0.9375rem] text-muted-foreground">
            {t(
              "没有符合条件的院校，请调整搜索关键词或地区筛选。",
              "No university matches. Adjust the keyword or region filter.",
            )}
          </p>
        ) : (
          <div className="mt-8 space-y-12">
            {rows.map((u, i) => {
              const isOpen = expanded.has(u.id);
              const shown = isOpen ? u.programmes : u.programmes.slice(0, PREVIEW_COUNT);
              const hidden = u.programmes.length - shown.length;
              const regionMeta = REGIONS.find((r) => r.id === u.region);
              return (
              <article key={u.id} className="break-inside-avoid">
                <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b-2 border-green pb-2.5">
                  <div>
                    <span className="almanac-index">
                      {String(i + 1).padStart(2, "0")} /{" "}
                      {lang === "zh" ? regionMeta?.label : regionMeta?.labelEn}
                    </span>
                    <h2 className="mt-1 text-[1.375rem] leading-tight text-green">
                      {lang === "zh" ? u.nameZh : u.name}
                      <span className="ml-2.5 font-[family-name:var(--font-sans)] text-[0.8125rem] font-normal tracking-[0.1em] text-muted-foreground">
                        {u.abbr}
                      </span>
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[0.6875rem] tracking-[0.14em] text-muted-foreground">
                      {t("最低 ATAR", "Minimum ATAR")}
                    </span>
                    <p className="score text-[1.5rem] leading-none text-brass">
                      {u.minAtar === null ? t("未公布", "Not published") : u.minAtar.toFixed(2)}
                    </p>
                  </div>
                </header>

                <div className="mt-4 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[28rem] border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="eyebrow py-2 pr-3 text-left text-muted-foreground">
                            {t("专业", "Programme")}
                            <span className="ml-1.5 normal-case tracking-normal opacity-70">
                              ({u.programmes.length})
                            </span>
                          </th>
                          <th className="eyebrow py-2 pr-3 text-right text-muted-foreground">ATAR</th>
                          <th className="eyebrow py-2 text-left text-muted-foreground">
                            {t("先修与附加要求", "Prerequisites & extras")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {shown.map((p) => (
                          <tr key={p.id} className="border-b border-border/70 align-top">
                            <td className="py-2.5 pr-3">
                              <span className="text-[0.875rem] text-green">
                                {lang === "zh" ? p.nameZh : p.name}
                              </span>
                              <span className="mt-0.5 block text-[0.6875rem] leading-snug text-muted-foreground">
                                {lang === "zh" ? p.name : p.nameZh}
                              </span>
                            </td>
                            <td className="score py-2.5 pr-3 text-right text-[0.875rem] text-ink">
                              {(p.atar ?? u.minAtar) === null ? "—" : (p.atar ?? u.minAtar)!.toFixed(2)}
                            </td>
                            <td className="py-2.5 font-[family-name:var(--font-serif)] text-[0.8125rem] leading-relaxed text-muted-foreground">
                              {lang === "zh" ? p.atarNote : (p.atarNoteEn ?? p.atarNote)}
                              {p.extras.length > 0 && (
                                <span className="mt-1 block text-[oklch(0.48_0.07_74)]">
                                  {t("附加：", "Extras: ")}
                                  {p.extras.map((e) => extraLabel(e, lang)).join(lang === "zh" ? "、" : ", ")}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {hidden > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(u.id)}
                        className="no-print mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] text-green transition-colors hover:text-brass">
                        <ChevronDown className="h-3.5 w-3.5" />
                        {t(`展开其余 ${hidden} 个专业`, `Show ${hidden} more programmes`)}
                      </button>
                    )}
                    {isOpen && u.programmes.length > PREVIEW_COUNT && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(u.id)}
                        className="no-print mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground transition-colors hover:text-green">
                        <ChevronDown className="h-3.5 w-3.5 rotate-180" />
                        {t("收起", "Collapse")}
                      </button>
                    )}
                  </div>

                  <dl className="divide-y divide-border border-y border-border text-[0.8125rem]">
                    <div className="grid gap-1 py-2.5 sm:grid-cols-[6rem_1fr] sm:gap-4">
                      <dt className="text-muted-foreground">{t("门槛口径", "Basis")}</dt>
                      <dd className="font-[family-name:var(--font-serif)] leading-relaxed text-ink">
                        {lang === "zh" ? u.minAtarNote : u.minAtarNoteEn}
                      </dd>
                    </div>
                    <div className="grid gap-1 py-2.5 sm:grid-cols-[6rem_1fr] sm:gap-4">
                      <dt className="text-muted-foreground">{t("英语要求", "English")}</dt>
                      <dd className="font-[family-name:var(--font-serif)] leading-relaxed text-ink">
                        {lang === "zh" ? u.english : u.englishEn}
                      </dd>
                    </div>
                    <div className="grid gap-1 py-2.5 sm:grid-cols-[6rem_1fr] sm:gap-4">
                      <dt className="text-muted-foreground">{t("申请窗口", "Window")}</dt>
                      <dd className="leading-relaxed text-ink">
                        {lang === "zh" ? u.applicationWindow : u.applicationWindowEn}
                      </dd>
                    </div>
                    <div className="grid gap-1 py-2.5 sm:grid-cols-[6rem_1fr] sm:gap-4">
                      <dt className="text-muted-foreground">{t("WACE 提示", "WACE notes")}</dt>
                      <dd className="font-[family-name:var(--font-serif)] leading-relaxed text-ink">
                        {lang === "zh" ? u.waceNotes : u.waceNotesEn}
                      </dd>
                    </div>
                    <div className="grid gap-1 py-2.5 sm:grid-cols-[6rem_1fr] sm:gap-4">
                      <dt className="text-muted-foreground">{t("数据年份", "Data year")}</dt>
                      <dd className="text-ink">
                        {lang === "zh" ? u.dataYear : u.dataYearEn}
                        <span className="ml-2 text-[0.75rem] text-muted-foreground">
                          {t("信心 ", "Confidence ")}
                          {confidenceLabel(u.confidence, lang)}
                        </span>
                      </dd>
                    </div>
                    <div className="grid gap-1 py-2.5 sm:grid-cols-[6rem_1fr] sm:gap-4">
                      <dt className="text-muted-foreground">{t("来源", "Sources")}</dt>
                      <dd className="space-y-1">
                        {u.sources.map((s) => (
                          <a
                            key={s}
                            href={s}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-start gap-1.5 break-all text-[0.75rem] leading-relaxed text-green underline decoration-brass/60 underline-offset-2 hover:text-brass">
                            <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" />
                            {s}
                          </a>
                        ))}
                      </dd>
                    </div>
                  </dl>
                </div>
              </article>
              );
            })}
          </div>
        )}

        <p className="mt-14 border-t border-border pt-5 text-[0.75rem] leading-relaxed text-muted-foreground">
          {t(
            "数据核验于 2026 年 8 月，覆盖 2026 与 2027 年入学周期。各校政策可能随时调整，正式申请前请以院校官网公告为准。表中「未公布」表示该校或该专业未公开统一 ATAR 门槛，采用综合评估或个案审核。",
            "Data verified in August 2026 for the 2026 and 2027 intake cycles. University policies change without notice, so confirm against the official website before applying. \u201cNot published\u201d indicates the institution or programme discloses no uniform ATAR threshold and assesses holistically or case by case.",
          )}
        </p>
      </div>

      <SiteFooter />
    </div>
  );
}
