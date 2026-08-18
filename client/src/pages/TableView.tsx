/**
 * 设计风格：Admissions Almanac
 * 门槛总表页：一页对照 31 所院校，表格化排版，分数等宽右对齐，可直接打印。
 */
import { useMemo, useState } from "react";
import { ExternalLink, Printer, Search } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { REGIONS, UNIVERSITIES, type Region } from "@/data/universities";
import { cn } from "@/lib/utils";

type SortKey = "region" | "atar" | "name";

export default function TableView() {
  const [region, setRegion] = useState<Region | "all">("all");
  const [keyword, setKeyword] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("region");

  const rows = useMemo(() => {
    let list = UNIVERSITIES.filter((u) => (region === "all" ? true : u.region === region));
    const kw = keyword.trim().toLowerCase();
    if (kw !== "") {
      list = list.filter(
        (u) =>
          u.nameZh.includes(kw) ||
          u.name.toLowerCase().includes(kw) ||
          u.abbr.toLowerCase().includes(kw) ||
          u.programmes.some((p) => p.nameZh.includes(kw) || p.name.toLowerCase().includes(kw)),
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
          <span className="eyebrow text-brass">门槛总表 · Master Table</span>
          <h1 className="mt-3 text-[2.25rem] leading-tight text-green">31 所目标院校门槛总表</h1>
          <p className="mt-4 max-w-[64ch] font-[family-name:var(--font-serif)] text-[1rem] leading-relaxed text-muted-foreground">
            按地区汇总各校最低 ATAR、英语要求、申请窗口与代表性专业门槛。可直接打印，用作家长面谈或宣讲会讲义。
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
              全部 {UNIVERSITIES.length}
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
                {r.label} {UNIVERSITIES.filter((u) => u.region === r.id).length}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="搜索院校或专业"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-52 border border-input bg-paper py-1.5 pl-8 pr-3 text-[0.8125rem] text-ink outline-none focus:border-brass"
              />
            </div>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="border border-input bg-paper px-2.5 py-1.5 text-[0.8125rem] text-ink outline-none focus:border-brass">
              <option value="region">按地区排序</option>
              <option value="atar">按门槛由高到低</option>
              <option value="name">按校名排序</option>
            </select>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 border border-input px-3 py-1.5 text-[0.8125rem] text-muted-foreground transition-colors hover:border-brass hover:text-green">
              <Printer className="h-3.5 w-3.5" />
              打印
            </button>
          </div>
        </div>

        {rows.length === 0 ? (
          <p className="px-6 py-20 text-center font-[family-name:var(--font-serif)] text-[0.9375rem] text-muted-foreground">
            没有符合条件的院校，请调整搜索关键词或地区筛选。
          </p>
        ) : (
          <div className="mt-8 space-y-12">
            {rows.map((u, i) => (
              <article key={u.id} className="break-inside-avoid">
                <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b-2 border-green pb-2.5">
                  <div>
                    <span className="almanac-index">
                      {String(i + 1).padStart(2, "0")} / {REGIONS.find((r) => r.id === u.region)?.label}
                    </span>
                    <h2 className="mt-1 text-[1.375rem] leading-tight text-green">
                      {u.nameZh}
                      <span className="ml-2.5 font-[family-name:var(--font-sans)] text-[0.8125rem] font-normal tracking-[0.1em] text-muted-foreground">
                        {u.abbr}
                      </span>
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[0.6875rem] tracking-[0.14em] text-muted-foreground">最低 ATAR</span>
                    <p className="score text-[1.5rem] leading-none text-brass">
                      {u.minAtar === null ? "未公布" : u.minAtar.toFixed(2)}
                    </p>
                  </div>
                </header>

                <div className="mt-4 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[28rem] border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="eyebrow py-2 pr-3 text-left text-muted-foreground">代表专业</th>
                          <th className="eyebrow py-2 pr-3 text-right text-muted-foreground">ATAR</th>
                          <th className="eyebrow py-2 text-left text-muted-foreground">先修与附加要求</th>
                        </tr>
                      </thead>
                      <tbody>
                        {u.programmes.map((p) => (
                          <tr key={p.id} className="border-b border-border/70 align-top">
                            <td className="py-2.5 pr-3">
                              <span className="text-[0.875rem] text-green">{p.nameZh}</span>
                              <span className="mt-0.5 block text-[0.6875rem] leading-snug text-muted-foreground">
                                {p.name}
                              </span>
                            </td>
                            <td className="score py-2.5 pr-3 text-right text-[0.875rem] text-ink">
                              {(p.atar ?? u.minAtar) === null ? "—" : (p.atar ?? u.minAtar)!.toFixed(2)}
                            </td>
                            <td className="py-2.5 font-[family-name:var(--font-serif)] text-[0.8125rem] leading-relaxed text-muted-foreground">
                              {p.prerequisiteNote}
                              {p.extras.length > 0 && (
                                <span className="mt-1 block text-[oklch(0.48_0.07_74)]">
                                  附加：{p.extras.join("、")}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <dl className="divide-y divide-border border-y border-border text-[0.8125rem]">
                    <div className="grid gap-1 py-2.5 sm:grid-cols-[6rem_1fr] sm:gap-4">
                      <dt className="text-muted-foreground">门槛口径</dt>
                      <dd className="font-[family-name:var(--font-serif)] leading-relaxed text-ink">
                        {u.minAtarNote}
                      </dd>
                    </div>
                    <div className="grid gap-1 py-2.5 sm:grid-cols-[6rem_1fr] sm:gap-4">
                      <dt className="text-muted-foreground">英语要求</dt>
                      <dd className="font-[family-name:var(--font-serif)] leading-relaxed text-ink">{u.english}</dd>
                    </div>
                    <div className="grid gap-1 py-2.5 sm:grid-cols-[6rem_1fr] sm:gap-4">
                      <dt className="text-muted-foreground">申请窗口</dt>
                      <dd className="leading-relaxed text-ink">{u.applicationWindow}</dd>
                    </div>
                    <div className="grid gap-1 py-2.5 sm:grid-cols-[6rem_1fr] sm:gap-4">
                      <dt className="text-muted-foreground">WACE 提示</dt>
                      <dd className="font-[family-name:var(--font-serif)] leading-relaxed text-ink">
                        {u.waceNotes}
                      </dd>
                    </div>
                    <div className="grid gap-1 py-2.5 sm:grid-cols-[6rem_1fr] sm:gap-4">
                      <dt className="text-muted-foreground">数据年份</dt>
                      <dd className="text-ink">
                        {u.dataYear}
                        <span className="ml-2 text-[0.75rem] text-muted-foreground">信心 {u.confidence}</span>
                      </dd>
                    </div>
                    <div className="grid gap-1 py-2.5 sm:grid-cols-[6rem_1fr] sm:gap-4">
                      <dt className="text-muted-foreground">来源</dt>
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
            ))}
          </div>
        )}

        <p className="mt-14 border-t border-border pt-5 text-[0.75rem] leading-relaxed text-muted-foreground">
          数据核验于 2026 年 8 月，覆盖 2026 与 2027 年入学周期。各校政策可能随时调整，正式申请前请以院校官网公告为准。表中「未公布」表示该校或该专业未公开统一 ATAR 门槛，采用综合评估或个案审核。
        </p>
      </div>

      <SiteFooter />
    </div>
  );
}
