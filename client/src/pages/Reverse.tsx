/**
 * 设计风格：Admissions Almanac
 * WACE 反向查询页，结构与 /alevel/reverse 严格对位：
 * 紧凑标题区 → 左侧「目标定位」侧栏（地区 / 院校 / 专业）→ 右侧结果区
 * （门槛主卡 + 官方口径卡 → 必修科目 / 申请附注两栏 → 官方来源）。
 * WACE 独有的分数对照标尺作为结果区内的一节，不改变整体骨架。
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ExternalLink, GraduationCap, Info, Star } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { PrintHeader } from "@/components/PrintHeader";
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
import { useLang } from "@/contexts/LangContext";

export default function Reverse() {
  const { t, lang } = useLang();
  const [region, setRegion] = useState<Region>("sg");
  const [uniId, setUniId] = useState("nus");
  const [progId, setProgId] = useState("nus-computer-science");
  const [atarInput, setAtarInput] = useState("");

  const regionUnis = useMemo(() => UNIVERSITIES.filter((u) => u.region === region), [region]);
  const uni = useMemo(
    () => UNIVERSITIES.find((u) => u.id === uniId) ?? regionUnis[0],
    [uniId, regionUnis],
  );

  // 切换院校时回到该校首个专业，避免残留他校的专业 id
  useEffect(() => {
    if (!uni) return;
    if (!uni.programmes.some((p) => p.id === progId)) {
      setProgId(uni.programmes[0]?.id ?? "");
    }
  }, [uni?.id]);

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
    const first = UNIVERSITIES.find((u) => u.region === next);
    if (first) {
      setUniId(first.id);
      setProgId(first.programmes[0]?.id ?? "");
    }
  }

  const tier = result && myAtar !== null ? classifyTier(myAtar, result.requiredAtar) : null;
  const selectClass =
    "mt-2 w-full border border-border bg-paper px-3 py-2.5 text-[0.875rem] text-green outline-none transition-colors focus:border-brass";

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main>
        {/* 标题区：与 A-Level 反查页同一规格 */}
        <section className="border-b border-border bg-paper-deep/35">
          <div className="container py-9 lg:py-12">
            <p className="eyebrow text-brass">WACE · REVERSE LOOKUP</p>
            <h1 className="mt-3 font-[family-name:var(--font-serif)] text-3xl text-green sm:text-4xl">
              {t("院校专业查门槛", "Programme → requirements")}
            </h1>
            <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
              {t(
                "选择院校与专业，查看所需 ATAR、必修 WACE 科目、英语要求、附加测试与申请窗口。",
                "Choose a university and programme to review the required ATAR, compulsory WACE subjects, English, additional tests and application window.",
              )}
            </p>
          </div>
        </section>

        <section className="container grid gap-8 py-9 lg:grid-cols-[22rem_1fr] lg:gap-12">
          {/* 左：目标定位 */}
          <aside className="no-print lg:sticky lg:top-24 lg:self-start">
            <div className="border border-border bg-card p-5">
              <p className="eyebrow text-brass">{t("目标定位", "Target selection")}</p>

              <label className="mt-5 block text-[0.75rem] text-muted-foreground">
                {t("地区", "Region")}
                <select
                  value={region}
                  onChange={(event) => selectRegion(event.target.value as Region)}
                  className={selectClass}>
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {(lang === "zh" ? r.label : r.labelEn)} ·{" "}
                      {UNIVERSITIES.filter((u) => u.region === r.id).length}
                      {t(" 所", " universities")}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-5 block text-[0.75rem] text-muted-foreground">
                {t("院校", "University")}
                <select
                  value={uni?.id ?? ""}
                  onChange={(event) => setUniId(event.target.value)}
                  className={selectClass}>
                  {regionUnis.map((u) => (
                    <option key={u.id} value={u.id}>
                      {lang === "zh" ? u.nameZh : u.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-5 block text-[0.75rem] text-muted-foreground">
                {t("专业", "Programme")}
                <select
                  value={result?.programme.id ?? ""}
                  onChange={(event) => setProgId(event.target.value)}
                  className={selectClass}>
                  {(uni?.programmes ?? []).map((p) => (
                    <option key={p.id} value={p.id}>
                      {lang === "zh" ? p.nameZh : p.name}
                    </option>
                  ))}
                </select>
              </label>

              <p className="mt-6 border-t border-border pt-4 text-[0.75rem] leading-relaxed text-muted-foreground">
                {t(
                  "提示：门槛为院校官方公布的最低要求，热门专业的实际录取通常高于此线；官方未公布分数的专业标为顾问复核。",
                  "Note: thresholds are officially published minimums. Competitive programmes usually settle above them, and programmes without a published score are marked for adviser review.",
                )}
              </p>
            </div>
          </aside>

          {/* 右：结果 */}
          {result && (
            <article className="fade-rise min-w-0">
              <PrintHeader title={t("WACE 院校专业门槛报告", "WACE programme requirements report")} />

              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
                <div>
                  <p className="almanac-index">
                    {result.university.abbr} · {result.university.region.toUpperCase()}
                  </p>
                  <h2 className="mt-2 font-[family-name:var(--font-serif)] text-3xl leading-tight text-green">
                    {lang === "zh" ? result.programme.nameZh : result.programme.name}
                  </h2>
                  <p className="mt-2 text-[0.875rem] text-muted-foreground">
                    {lang === "zh" ? result.university.nameZh : result.university.name} ·{" "}
                    {lang === "zh" ? result.programme.name : result.programme.nameZh}
                  </p>
                </div>
                <div className="no-print flex gap-2">
                  <ShortlistButton
                    universityId={result.university.id}
                    programmeId={result.programme.id}
                    label={t("加入目标清单", "Save to shortlist")}
                    variant="full"
                  />
                  <PrintReportButton compact />
                </div>
              </div>

              {/* 门槛主卡 + 官方口径卡 */}
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <section className="border-l-2 border-brass bg-paper-deep/35 p-5">
                  <p className="eyebrow text-brass">{t("所需 ATAR", "Required ATAR")}</p>
                  <p className="score mt-3 text-3xl text-green">
                    {result.requiredAtar === null
                      ? t("顾问复核", "Adviser review")
                      : result.requiredAtar.toFixed(2)}
                  </p>
                  <p className="mt-3 font-[family-name:var(--font-serif)] text-[0.875rem] leading-relaxed text-muted-foreground">
                    {result.requiredAtarNote}
                  </p>
                </section>
                <section className="border border-border bg-card p-5">
                  <p className="eyebrow text-muted-foreground">{t("数据口径", "Data basis")}</p>
                  <p className="mt-3 text-[0.875rem] leading-relaxed text-green">
                    {lang === "zh" ? result.university.dataYear : result.university.dataYearEn}
                  </p>
                  <p className="mt-2 text-[0.8125rem] text-muted-foreground">
                    {t("核验信心：", "Confidence: ")}
                    {confidenceLabel(result.university.confidence, lang)}
                  </p>
                  <p className="mt-3 border-t border-border pt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {t(
                      "达到最低门槛不等于录取保证。",
                      "Meeting the minimum does not guarantee an offer.",
                    )}
                  </p>
                </section>
              </div>

              {/* 必修科目 / 申请附注 */}
              <div className="mt-7 grid gap-6 lg:grid-cols-2">
                <section>
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <GraduationCap className="h-4 w-4 text-brass" />
                    <h3 className="font-[family-name:var(--font-serif)] text-xl text-green">
                      {t("WACE 选课要求", "WACE subject requirements")}
                    </h3>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="eyebrow text-tier-reach">{t("必修科目", "Required subjects")}</p>
                      {result.requiredSubjectGroups.length === 0 ? (
                        <p className="mt-2 text-[0.8125rem] text-muted-foreground">
                          {t("无硬性科目先修要求", "No compulsory subject prerequisites")}
                        </p>
                      ) : (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {result.requiredSubjectGroups.map((g, i) => (
                            <span
                              key={i}
                              className="border border-tier-reach/40 bg-tier-reach/8 px-2.5 py-1 text-[0.8125rem] text-tier-reach">
                              {subjectGroupLabelBy(g, lang)}
                              {g.length > 1 && (
                                <span className="ml-1 text-[0.6875rem] opacity-75">
                                  {t("（任选其一）", "(any one)")}
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="eyebrow text-brass">{t("附加测试与选拔", "Additional selection")}</p>
                      {result.extras.length === 0 ? (
                        <p className="mt-2 text-[0.8125rem] text-muted-foreground">
                          {t("该专业无附加测试要求", "No additional test required")}
                        </p>
                      ) : (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {result.extras.map((e) => (
                            <span
                              key={e}
                              className="border border-brass/50 bg-brass/8 px-2.5 py-1 text-[0.8125rem] text-[oklch(0.42_0.07_74)]">
                              {extraLabel(e, lang)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {result.programme.atarNote && (
                      <p className="border-t border-border pt-3 font-[family-name:var(--font-serif)] text-[0.8125rem] leading-relaxed text-muted-foreground">
                        {t("院校说明：", "Note: ")}
                        {lang === "zh"
                          ? result.programme.atarNote
                          : (result.programme.atarNoteEn ?? result.programme.atarNote)}
                      </p>
                    )}
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <Info className="h-4 w-4 text-brass" />
                    <h3 className="font-[family-name:var(--font-serif)] text-xl text-green">
                      {t("申请附注", "Application notes")}
                    </h3>
                  </div>
                  <dl className="mt-4 space-y-4 text-[0.875rem] leading-relaxed">
                    <div>
                      <dt className="eyebrow text-muted-foreground">{t("英语要求", "English")}</dt>
                      <dd className="mt-1 text-muted-foreground">
                        {lang === "zh" ? result.university.english : result.university.englishEn}
                      </dd>
                    </div>
                    <div>
                      <dt className="eyebrow text-muted-foreground">
                        {t("WACE 申请提示", "WACE application notes")}
                      </dt>
                      <dd className="mt-1 text-muted-foreground">
                        {lang === "zh" ? result.university.waceNotes : result.university.waceNotesEn}
                      </dd>
                    </div>
                    <div>
                      <dt className="eyebrow text-muted-foreground">
                        {t("申请窗口", "Application window")}
                      </dt>
                      <dd className="mt-1 text-muted-foreground">
                        {lang === "zh"
                          ? result.university.applicationWindow
                          : result.university.applicationWindowEn}
                      </dd>
                    </div>
                  </dl>
                </section>
              </div>

              {/* 分数对照：WACE 独有 */}
              <section className="no-print mt-8 border-t border-border pt-6">
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-brass" />
                  <h3 className="font-[family-name:var(--font-serif)] text-xl text-green">
                    {t("对照我的分数", "Compare my score")}
                  </h3>
                </div>
                <div className="mt-4 grid gap-6 md:grid-cols-[16rem_1fr] md:items-start">
                  <div>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={99.95}
                      step={0.05}
                      placeholder={t("输入预计 ATAR", "Enter projected ATAR")}
                      value={atarInput}
                      onChange={(e) => setAtarInput(e.target.value)}
                      className="score w-full border border-input bg-paper px-3 py-2.5 text-[1.375rem] text-green outline-none transition-colors duration-150 placeholder:font-[family-name:var(--font-sans)] placeholder:text-[0.875rem] placeholder:text-muted-foreground focus:border-brass"
                    />
                    {atarInput.trim() !== "" && myAtar === null && (
                      <p className="mt-2 text-[0.75rem] text-tier-reach">
                        {t("请输入 0 至 99.95 之间的有效分数。", "Enter a valid score between 0 and 99.95.")}
                      </p>
                    )}
                    {tier && (
                      <div className="mt-5 border-t border-border pt-4">
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
                  </div>
                  <div className="min-w-0">
                    {result.requiredAtar === null ? (
                      <p className="font-[family-name:var(--font-serif)] text-[0.875rem] leading-relaxed text-muted-foreground">
                        {t(
                          "该专业官方未公布 ATAR 门槛，无法进行分数对照，需由顾问结合完整背景个案评估。",
                          "This programme publishes no ATAR threshold, so no score comparison is possible. A counsellor must assess the full profile case by case.",
                        )}
                      </p>
                    ) : (
                      <div className="pb-2">
                        <ScoreRule
                          atar={myAtar ?? undefined}
                          showPointer={myAtar !== null}
                          markers={[
                            {
                              label: t(
                                `门槛 ${result.requiredAtar}`,
                                `Threshold ${result.requiredAtar}`,
                              ),
                              value: result.requiredAtar,
                            },
                          ]}
                        />
                      </div>
                    )}
                    <Link
                      href="/wace/subjects"
                      className="mt-5 inline-flex items-center gap-2 border-b border-brass pb-0.5 text-[0.8125rem] text-green transition-colors hover:text-brass">
                      {t("据此规划 WACE 选课", "Plan WACE subjects from here")}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </section>

              {/* 官方来源 */}
              <section className="mt-8 border-t border-border pt-6">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-brass" />
                  <h3 className="font-[family-name:var(--font-serif)] text-xl text-green">
                    {t("官方来源", "Official sources")}
                  </h3>
                </div>
                <div className="mt-4 grid gap-2">
                  {result.university.sources.map((source) => (
                    <a
                      key={source}
                      href={source}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-fit items-center gap-2 text-[0.8125rem] text-green underline decoration-brass underline-offset-4">
                      <ExternalLink className="h-3.5 w-3.5" />
                      {new URL(source).hostname}
                    </a>
                  ))}
                </div>
              </section>
            </article>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
