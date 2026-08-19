/**
 * 设计风格：Admissions Almanac
 * 反向查询页：三段式选择（地区 → 院校 → 专业），结果以两栏定义列表呈现。
 * 与正向查询共享同一份数据与同一套分层标签定义。
 */
import { useMemo, useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { ScoreRule } from "@/components/ScoreRule";
import { TierBadge } from "@/components/TierBadge";
import { ShortlistButton } from "@/components/ShortlistButton";
import { PrintReportButton } from "@/components/PrintReportButton";
import { REGIONS, UNIVERSITIES, type Region } from "@/data/universities";
import {
  classifyTier,
  confidenceLabel,
  extraLabel,
  reverseLookup,
  subjectGroupLabelBy,
} from "@/lib/matching";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LangContext";

export default function Reverse() {
  const { t, lang } = useLang();
  const [region, setRegion] = useState<Region>("sg");
  const [uniId, setUniId] = useState("nus");
  const [progId, setProgId] = useState("nus-computer-science");
  const [atarInput, setAtarInput] = useState("");
  /** 专业数量最多可达 50 条，提供关键词过滤 */
  const [progQuery, setProgQuery] = useState("");

  const regionUnis = useMemo(() => UNIVERSITIES.filter((u) => u.region === region), [region]);
  const uni = useMemo(() => UNIVERSITIES.find((u) => u.id === uniId) ?? regionUnis[0], [uniId, regionUnis]);

  const filteredProgs = useMemo(() => {
    if (!uni) return [];
    const q = progQuery.trim().toLowerCase();
    if (!q) return uni.programmes;
    return uni.programmes.filter(
      (p) => p.nameZh.toLowerCase().includes(q) || p.name.toLowerCase().includes(q),
    );
  }, [uni, progQuery]);

  const result = useMemo(() => {
    if (!uni) return null;
    const validProg = uni.programmes.some((p) => p.id === progId) ? progId : uni.programmes[0]?.id;
    return validProg ? reverseLookup(uni.id, validProg, lang) : null;
  }, [uni, progId, lang]);

  /** 可选：填入自己的分数以获得即时对照 */
  const myAtar = useMemo(() => {
    const n = Number(atarInput.trim());
    if (atarInput.trim() === "" || !Number.isFinite(n) || n < 0 || n > 99.95) return null;
    return n;
  }, [atarInput]);

  function selectRegion(next: Region) {
    setRegion(next);
    setProgQuery("");
    const first = UNIVERSITIES.find((u) => u.region === next);
    if (first) {
      setUniId(first.id);
      setProgId(first.programmes[0]?.id ?? "");
    }
  }

  function selectUni(id: string) {
    setUniId(id);
    setProgQuery("");
    const u = UNIVERSITIES.find((x) => x.id === id);
    setProgId(u?.programmes[0]?.id ?? "");
  }

  const tier = result && myAtar !== null ? classifyTier(myAtar, result.requiredAtar) : null;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="border-b border-border bg-paper-deep/45">
        <div className="container py-10">
          <span className="eyebrow text-brass">{t("反向查询 · Reverse Lookup", "Reverse Lookup")}</span>
          <h1 className="mt-3 text-[2.25rem] leading-tight text-green">
            {t(
              "按目标院校与专业反推所需条件",
              "Work backwards from a target university and programme",
            )}
          </h1>
          <p className="mt-4 max-w-[64ch] font-[family-name:var(--font-serif)] text-[1rem] leading-relaxed text-muted-foreground">
            {t(
              "先锁定目标，再倒推条件。选定院校与专业后，可查看所需 ATAR、必修 WACE 科目、英语要求、附加测试与申请截止时间。",
              "Fix the destination first, then derive the conditions. Selecting a university and programme reveals the required ATAR, compulsory WACE subjects, English requirement, additional tests and application deadline.",
            )}
          </p>
        </div>
      </div>

      <div className="container py-12">
        {/* 三段式选择 */}
        <div className="no-print grid gap-px border border-border bg-border lg:grid-cols-3">
          <div className="bg-card p-6">
            <span className="eyebrow text-brass">{t("第一步 · 选择地区", "Step 1 · Region")}</span>
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
                  <span>{lang === "zh" ? r.label : r.labelEn}</span>
                  <span className="score shrink-0 text-[0.75rem] opacity-75">
                    {UNIVERSITIES.filter((u) => u.region === r.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card p-6">
            <span className="eyebrow text-brass">{t("第二步 · 选择院校", "Step 2 · University")}</span>
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
                  <span className="leading-snug">{lang === "zh" ? u.nameZh : u.name}</span>
                  <span className="score shrink-0 text-[0.75rem] opacity-75">
                    {u.minAtar === null ? "—" : u.minAtar}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card p-6">
            <div className="flex items-baseline justify-between gap-2">
              <span className="eyebrow text-brass">{t("第三步 · 选择专业", "Step 3 · Programme")}</span>
              <span className="score text-[0.75rem] text-muted-foreground">
                {filteredProgs.length}/{uni?.programmes.length ?? 0}
              </span>
            </div>
            <input
              type="search"
              value={progQuery}
              onChange={(e) => setProgQuery(e.target.value)}
              placeholder={t("筛选专业名称…", "Filter programmes…")}
              className="mt-3 w-full border border-input bg-paper px-3 py-2 text-[0.8125rem] text-ink outline-none transition-colors duration-150 placeholder:text-muted-foreground focus:border-brass"
            />
            <div className="mt-3 max-h-[16rem] space-y-1.5 overflow-y-auto pr-1">
              {filteredProgs.length === 0 && (
                <p className="py-6 text-center text-[0.8125rem] text-muted-foreground">
                  {t("没有匹配的专业名称。", "No programme matches that keyword.")}
                </p>
              )}
              {filteredProgs.map((p) => (
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
                  <span className="leading-snug">{lang === "zh" ? p.nameZh : p.name}</span>
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
                  {lang === "zh" ? result.university.nameZh : result.university.name}
                  <span className="mx-2 text-brass">·</span>
                  {lang === "zh" ? result.programme.nameZh : result.programme.name}
                </h2>
              </div>
              <div className="no-print flex flex-wrap items-center gap-2.5">
                <ShortlistButton
                  universityId={result.university.id}
                  programmeId={result.programme.id}
                  label={lang === "zh" ? result.programme.nameZh : result.programme.name}
                  variant="full"
                  className="px-3 py-1.5 text-[0.8125rem]"
                />
                <PrintReportButton compact className="border-input bg-transparent text-muted-foreground hover:border-brass hover:text-green" />
              </div>
            </div>

            <div className="mt-10 grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
              {/* 左：条件定义列表 */}
              <div>
                <dl className="divide-y divide-border border-y border-border">
                  <div className="grid gap-1.5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <dt className="text-[0.8125rem] tracking-[0.1em] text-muted-foreground">
                      {t("所需 ATAR", "Required ATAR")}
                    </dt>
                    <dd>
                      <span className="score text-[1.75rem] leading-none text-green">
                        {result.requiredAtar === null
                          ? t("官方未公布", "Not published")
                          : result.requiredAtar.toFixed(2)}
                      </span>
                      <p className="mt-2 font-[family-name:var(--font-serif)] text-[0.875rem] leading-relaxed text-muted-foreground">
                        {result.requiredAtarNote}
                      </p>
                    </dd>
                  </div>

                  <div className="grid gap-1.5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <dt className="text-[0.8125rem] tracking-[0.1em] text-muted-foreground">
                      {t("必修 WACE 科目", "Required WACE subjects")}
                    </dt>
                    <dd>
                      {result.requiredSubjectGroups.length === 0 ? (
                        <p className="text-[0.9375rem] text-ink">
                          {t("无硬性科目先修要求", "No compulsory subject prerequisites")}
                        </p>
                      ) : (
                        <ul className="space-y-1.5">
                          {result.requiredSubjectGroups.map((g, i) => (
                            <li key={i} className="flex items-baseline gap-2 text-[0.9375rem] text-ink">
                              <span className="text-brass">·</span>
                              {subjectGroupLabelBy(g, lang)}
                              {g.length > 1 && (
                                <span className="text-[0.75rem] text-muted-foreground">
                                  {t("（任选其一）", "(any one)")}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                      {result.programme.atarNote && (
                        <p className="mt-2 font-[family-name:var(--font-serif)] text-[0.875rem] leading-relaxed text-muted-foreground">
                          {t("院校说明：", "Note: ")}
                          {lang === "zh"
                            ? result.programme.atarNote
                            : (result.programme.atarNoteEn ?? result.programme.atarNote)}
                        </p>
                      )}
                    </dd>
                  </div>

                  <div className="grid gap-1.5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <dt className="text-[0.8125rem] tracking-[0.1em] text-muted-foreground">
                      {t("附加测试与选拔", "Additional tests")}
                    </dt>
                    <dd>
                      {result.extras.length === 0 ? (
                        <p className="text-[0.9375rem] text-ink">
                          {t("该专业无附加测试要求", "No additional test required")}
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {result.extras.map((e) => (
                            <span
                              key={e}
                              className="border border-brass/60 bg-brass/8 px-2 py-1 text-[0.8125rem] text-[oklch(0.45_0.07_74)]">
                              {extraLabel(e, lang)}
                            </span>
                          ))}
                        </div>
                      )}
                    </dd>
                  </div>

                  <div className="grid gap-1.5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <dt className="text-[0.8125rem] tracking-[0.1em] text-muted-foreground">
                      {t("英语要求", "English requirement")}
                    </dt>
                    <dd className="font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-ink">
                      {lang === "zh" ? result.university.english : result.university.englishEn}
                    </dd>
                  </div>

                  <div className="grid gap-1.5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <dt className="text-[0.8125rem] tracking-[0.1em] text-muted-foreground">
                      {t("WACE 申请提示", "WACE application notes")}
                    </dt>
                    <dd className="font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-ink">
                      {lang === "zh" ? result.university.waceNotes : result.university.waceNotesEn}
                    </dd>
                  </div>

                  <div className="grid gap-1.5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <dt className="text-[0.8125rem] tracking-[0.1em] text-muted-foreground">
                      {t("申请窗口", "Application window")}
                    </dt>
                    <dd className="text-[0.9375rem] leading-relaxed text-ink">
                      {lang === "zh"
                        ? result.university.applicationWindow
                        : result.university.applicationWindowEn}
                    </dd>
                  </div>

                  <div className="grid gap-1.5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <dt className="text-[0.8125rem] tracking-[0.1em] text-muted-foreground">
                      {t("数据年份", "Data year")}
                    </dt>
                    <dd className="text-[0.9375rem] text-ink">
                      {lang === "zh" ? result.university.dataYear : result.university.dataYearEn}
                        <span className="ml-2 text-[0.75rem] text-muted-foreground">
                          {t("核验信心：", "Confidence: ")}
                          {confidenceLabel(result.university.confidence, lang)}
                        </span>
                    </dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <span className="eyebrow text-brass">{t("官方来源", "Official sources")}</span>
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
                  <span className="eyebrow text-brass">{t("对照我的分数", "Compare my score")}</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={99.95}
                    step={0.05}
                    placeholder={t("输入预计 ATAR", "Enter projected ATAR")}
                    value={atarInput}
                    onChange={(e) => setAtarInput(e.target.value)}
                    className="score mt-3 w-full border border-input bg-paper px-3 py-2.5 text-[1.375rem] text-green outline-none transition-colors duration-150 placeholder:font-[family-name:var(--font-sans)] placeholder:text-[0.875rem] placeholder:text-muted-foreground focus:border-brass"
                  />
                  {atarInput.trim() !== "" && myAtar === null && (
                    <p className="mt-2 text-[0.75rem] text-tier-reach">
                      {t("请输入 0 至 99.95 之间的有效分数。", "Enter a valid score between 0 and 99.95.")}
                    </p>
                  )}

                  <div className="mt-8">
                    <ScoreRule
                      atar={myAtar ?? undefined}
                      showPointer={myAtar !== null}
                      markers={
                        result.requiredAtar === null
                          ? []
                          : [
                              {
                                label: t(
                                  `门槛 ${result.requiredAtar}`,
                                  `Threshold ${result.requiredAtar}`,
                                ),
                                value: result.requiredAtar,
                              },
                            ]
                      }
                    />
                  </div>

                  {tier && (
                    <div className="mt-6 border-t border-border pt-5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[0.8125rem] text-muted-foreground">
                          {t("评估结果", "Assessment")}
                        </span>
                        <TierBadge tier={tier} />
                      </div>
                      {result.requiredAtar !== null && myAtar !== null && (
                        <p className="score mt-3 text-[1.125rem] text-green">
                          {t("差值 ", "Gap ")}
                          {myAtar - result.requiredAtar >= 0 ? "+" : ""}
                          {(myAtar - result.requiredAtar).toFixed(2)}
                        </p>
                      )}
                    </div>
                  )}

                  {result.requiredAtar === null && (
                    <p className="mt-6 border-t border-border pt-5 font-[family-name:var(--font-serif)] text-[0.875rem] leading-relaxed text-muted-foreground">
                      {t(
                        "该专业官方未公布 ATAR 门槛，无法进行分数对照，需由顾问结合完整背景个案评估。",
                        "This programme publishes no ATAR threshold, so no score comparison is possible. A counsellor must assess the full profile case by case.",
                      )}
                    </p>
                  )}
                </div>

                <Link
                  href="/subjects"
                  className="mt-6 inline-flex items-center gap-2 border-b border-brass pb-0.5 text-[0.875rem] text-green transition-colors hover:text-brass">
                  {t("据此规划 WACE 选课", "Plan WACE subjects from here")}
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
