/**
 * 设计风格：Admissions Almanac
 * 反向查询页：三段式选择（地区 → 院校 → 专业），结果以两栏定义列表呈现。
 * 与正向查询共享同一份数据与同一套分层标签定义。
 */
import { useMemo, useState } from "react";
import { ArrowRight, ExternalLink, Printer } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { ScoreRule } from "@/components/ScoreRule";
import { TierBadge } from "@/components/TierBadge";
import { REGIONS, UNIVERSITIES, type Region } from "@/data/universities";
import { classifyTier, reverseLookup, subjectGroupLabel } from "@/lib/matching";
import { cn } from "@/lib/utils";

export default function Reverse() {
  const [region, setRegion] = useState<Region>("sg");
  const [uniId, setUniId] = useState("nus");
  const [progId, setProgId] = useState("nus-cs");
  const [atarInput, setAtarInput] = useState("");

  const regionUnis = useMemo(() => UNIVERSITIES.filter((u) => u.region === region), [region]);
  const uni = useMemo(() => UNIVERSITIES.find((u) => u.id === uniId) ?? regionUnis[0], [uniId, regionUnis]);
  const result = useMemo(() => {
    if (!uni) return null;
    const validProg = uni.programmes.some((p) => p.id === progId) ? progId : uni.programmes[0]?.id;
    return validProg ? reverseLookup(uni.id, validProg) : null;
  }, [uni, progId]);

  /** 可选：填入自己的分数以获得即时对照 */
  const myAtar = useMemo(() => {
    const n = Number(atarInput.trim());
    if (atarInput.trim() === "" || !Number.isFinite(n) || n < 0 || n > 99.95) return null;
    return n;
  }, [atarInput]);

  function selectRegion(next: Region) {
    setRegion(next);
    const first = UNIVERSITIES.find((u) => u.region === next);
    if (first) {
      setUniId(first.id);
      setProgId(first.programmes[0]?.id ?? "");
    }
  }

  function selectUni(id: string) {
    setUniId(id);
    const u = UNIVERSITIES.find((x) => x.id === id);
    setProgId(u?.programmes[0]?.id ?? "");
  }

  const tier = result && myAtar !== null ? classifyTier(myAtar, result.requiredAtar) : null;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="border-b border-border bg-paper-deep/45">
        <div className="container py-10">
          <span className="eyebrow text-brass">反向查询 · Reverse Lookup</span>
          <h1 className="mt-3 text-[2.25rem] leading-tight text-green">按目标院校与专业反推所需条件</h1>
          <p className="mt-4 max-w-[64ch] font-[family-name:var(--font-serif)] text-[1rem] leading-relaxed text-muted-foreground">
            先锁定目标，再倒推条件。选定院校与专业后，可查看所需 ATAR、必修 WACE 科目、英语要求、附加测试与申请截止时间。
          </p>
        </div>
      </div>

      <div className="container py-12">
        {/* 三段式选择 */}
        <div className="no-print grid gap-px border border-border bg-border lg:grid-cols-3">
          <div className="bg-card p-6">
            <span className="eyebrow text-brass">第一步 · 选择地区</span>
            <div className="mt-4 space-y-1.5">
              {REGIONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => selectRegion(r.id)}
                  className={cn(
                    "flex w-full items-baseline justify-between gap-3 border px-3 py-2.5 text-left text-[0.875rem] transition-colors duration-150",
                    region === r.id
                      ? "border-green bg-green text-primary-foreground"
                      : "border-input text-muted-foreground hover:border-brass hover:text-green",
                  )}>
                  <span>{r.label}</span>
                  <span className="score shrink-0 text-[0.75rem] opacity-75">
                    {UNIVERSITIES.filter((u) => u.region === r.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card p-6">
            <span className="eyebrow text-brass">第二步 · 选择院校</span>
            <div className="mt-4 max-h-[19rem] space-y-1.5 overflow-y-auto pr-1">
              {regionUnis.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => selectUni(u.id)}
                  className={cn(
                    "flex w-full items-baseline justify-between gap-3 border px-3 py-2.5 text-left text-[0.875rem] transition-colors duration-150",
                    uni?.id === u.id
                      ? "border-green bg-green text-primary-foreground"
                      : "border-input text-muted-foreground hover:border-brass hover:text-green",
                  )}>
                  <span className="leading-snug">{u.nameZh}</span>
                  <span className="score shrink-0 text-[0.75rem] opacity-75">
                    {u.minAtar === null ? "—" : u.minAtar}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card p-6">
            <span className="eyebrow text-brass">第三步 · 选择专业</span>
            <div className="mt-4 max-h-[19rem] space-y-1.5 overflow-y-auto pr-1">
              {uni?.programmes.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProgId(p.id)}
                  className={cn(
                    "flex w-full items-baseline justify-between gap-3 border px-3 py-2.5 text-left text-[0.875rem] transition-colors duration-150",
                    result?.programme.id === p.id
                      ? "border-green bg-green text-primary-foreground"
                      : "border-input text-muted-foreground hover:border-brass hover:text-green",
                  )}>
                  <span className="leading-snug">{p.nameZh}</span>
                  <span className="score shrink-0 text-[0.75rem] opacity-75">
                    {(p.atar ?? uni.minAtar) === null ? "—" : (p.atar ?? uni.minAtar)?.toFixed(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 结果 */}
        {result && (
          <div className="fade-rise mt-12">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-green pb-4">
              <div>
                <span className="almanac-index">
                  {result.university.abbr} / {result.programme.name}
                </span>
                <h2 className="mt-1.5 text-[1.875rem] leading-tight text-green">
                  {result.university.nameZh}
                  <span className="mx-2 text-brass">·</span>
                  {result.programme.nameZh}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="no-print inline-flex items-center gap-1.5 border border-input px-3 py-1.5 text-[0.8125rem] text-muted-foreground transition-colors hover:border-brass hover:text-green">
                <Printer className="h-3.5 w-3.5" />
                打印
              </button>
            </div>

            <div className="mt-10 grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
              {/* 左：条件定义列表 */}
              <div>
                <dl className="divide-y divide-border border-y border-border">
                  <div className="grid gap-1.5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <dt className="text-[0.8125rem] tracking-[0.1em] text-muted-foreground">所需 ATAR</dt>
                    <dd>
                      <span className="score text-[1.75rem] leading-none text-green">
                        {result.requiredAtar === null ? "官方未公布" : result.requiredAtar.toFixed(2)}
                      </span>
                      <p className="mt-2 font-[family-name:var(--font-serif)] text-[0.875rem] leading-relaxed text-muted-foreground">
                        {result.requiredAtarNote}
                      </p>
                    </dd>
                  </div>

                  <div className="grid gap-1.5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <dt className="text-[0.8125rem] tracking-[0.1em] text-muted-foreground">必修 WACE 科目</dt>
                    <dd>
                      {result.requiredSubjectGroups.length === 0 ? (
                        <p className="text-[0.9375rem] text-ink">无硬性科目先修要求</p>
                      ) : (
                        <ul className="space-y-1.5">
                          {result.requiredSubjectGroups.map((g, i) => (
                            <li key={i} className="flex items-baseline gap-2 text-[0.9375rem] text-ink">
                              <span className="text-brass">·</span>
                              {subjectGroupLabel(g)}
                              {g.length > 1 && (
                                <span className="text-[0.75rem] text-muted-foreground">（任选其一）</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="mt-2 font-[family-name:var(--font-serif)] text-[0.875rem] leading-relaxed text-muted-foreground">
                        官方口径：{result.programme.prerequisiteNote}
                      </p>
                    </dd>
                  </div>

                  <div className="grid gap-1.5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <dt className="text-[0.8125rem] tracking-[0.1em] text-muted-foreground">附加测试与选拔</dt>
                    <dd>
                      {result.extras.length === 0 ? (
                        <p className="text-[0.9375rem] text-ink">该专业无附加测试要求</p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {result.extras.map((e) => (
                            <span
                              key={e}
                              className="border border-brass/60 bg-brass/8 px-2 py-1 text-[0.8125rem] text-[oklch(0.45_0.07_74)]">
                              {e}
                            </span>
                          ))}
                        </div>
                      )}
                    </dd>
                  </div>

                  <div className="grid gap-1.5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <dt className="text-[0.8125rem] tracking-[0.1em] text-muted-foreground">英语要求</dt>
                    <dd className="font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-ink">
                      {result.university.english}
                    </dd>
                  </div>

                  <div className="grid gap-1.5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <dt className="text-[0.8125rem] tracking-[0.1em] text-muted-foreground">WACE 申请提示</dt>
                    <dd className="font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-ink">
                      {result.university.waceNotes}
                    </dd>
                  </div>

                  <div className="grid gap-1.5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <dt className="text-[0.8125rem] tracking-[0.1em] text-muted-foreground">申请窗口</dt>
                    <dd className="text-[0.9375rem] leading-relaxed text-ink">
                      {result.university.applicationWindow}
                    </dd>
                  </div>

                  <div className="grid gap-1.5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <dt className="text-[0.8125rem] tracking-[0.1em] text-muted-foreground">数据年份</dt>
                    <dd className="text-[0.9375rem] text-ink">
                      {result.university.dataYear}
                      <span className="ml-2 text-[0.75rem] text-muted-foreground">
                        核验信心：{result.university.confidence}
                      </span>
                    </dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <span className="eyebrow text-brass">官方来源</span>
                  <ul className="mt-3 space-y-2">
                    {result.university.sources.map((s) => (
                      <li key={s}>
                        <a
                          href={s}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-start gap-1.5 break-all text-[0.8125rem] leading-relaxed text-green underline decoration-brass/60 underline-offset-2 hover:text-brass">
                          <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          {s}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 右：分数对照 */}
              <div className="lg:sticky lg:top-28 lg:self-start">
                <div className="border border-border bg-card p-6">
                  <span className="eyebrow text-brass">对照我的分数</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={99.95}
                    step={0.05}
                    placeholder="输入预计 ATAR"
                    value={atarInput}
                    onChange={(e) => setAtarInput(e.target.value)}
                    className="score mt-3 w-full border border-input bg-paper px-3 py-2.5 text-[1.375rem] text-green outline-none transition-colors duration-150 placeholder:font-[family-name:var(--font-sans)] placeholder:text-[0.875rem] placeholder:text-muted-foreground focus:border-brass"
                  />
                  {atarInput.trim() !== "" && myAtar === null && (
                    <p className="mt-2 text-[0.75rem] text-tier-reach">请输入 0 至 99.95 之间的有效分数。</p>
                  )}

                  <div className="mt-8">
                    <ScoreRule
                      atar={myAtar ?? undefined}
                      showPointer={myAtar !== null}
                      markers={
                        result.requiredAtar === null
                          ? []
                          : [{ label: `门槛 ${result.requiredAtar}`, value: result.requiredAtar }]
                      }
                    />
                  </div>

                  {tier && (
                    <div className="mt-6 border-t border-border pt-5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[0.8125rem] text-muted-foreground">评估结果</span>
                        <TierBadge tier={tier} />
                      </div>
                      {result.requiredAtar !== null && myAtar !== null && (
                        <p className="score mt-3 text-[1.125rem] text-green">
                          差值 {myAtar - result.requiredAtar >= 0 ? "+" : ""}
                          {(myAtar - result.requiredAtar).toFixed(2)}
                        </p>
                      )}
                    </div>
                  )}

                  {result.requiredAtar === null && (
                    <p className="mt-6 border-t border-border pt-5 font-[family-name:var(--font-serif)] text-[0.875rem] leading-relaxed text-muted-foreground">
                      该专业官方未公布 ATAR 门槛，无法进行分数对照，需由顾问结合完整背景个案评估。
                    </p>
                  )}
                </div>

                <Link
                  href="/subjects"
                  className="mt-6 inline-flex items-center gap-2 border-b border-brass pb-0.5 text-[0.875rem] text-green transition-colors hover:text-brass">
                  据此规划 WACE 选课
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
