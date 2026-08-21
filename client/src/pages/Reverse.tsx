/**
 * 设计风格：Admissions Almanac
 * WACE 反向查询页，结构与 /alevel/reverse 严格对位：
 * 紧凑标题区 → 左侧「目标定位」侧栏（地区 / 院校 / 专业）→ 右侧结果区
 * （门槛主卡 + 官方口径卡 → 必修科目 / 申请附注两栏 → 分数对照 →
 *  Year 11 / Year 12 分年选课 → 背景准备 → 官方来源）。
 *
 * 核心动线：选定一个专业后，一页读完「要多少分 → 两年怎么选课 → 还要准备什么」，
 * 不需要先收藏再跳转到选课页。
 */
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  ExternalLink,
  GraduationCap,
  Info,
  Star,
  Trophy,
} from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { QsRank } from "@/components/QsRank";
import { Stagger, Tick } from "@/components/Motion";
import { PrintHeader } from "@/components/PrintHeader";
import { ScoreRule } from "@/components/ScoreRule";
import { TierBadge } from "@/components/TierBadge";
import { ShortlistButton } from "@/components/ShortlistButton";
import { PrintReportButton } from "@/components/PrintReportButton";
import { HEMISPHERES, REGIONS, SUBJECTS, UNIVERSITIES, type Hemisphere, type Region } from "@/data/universities";
import {
  classifyTier,
  confidenceLabel,
  extraLabel,
  reverseLookup,
  subjectGroupLabelBy,
  subjectLabelBy,
} from "@/lib/matching";
import {
  ATAR_COUNTED,
  Y11_COURSES,
  Y12_COURSES,
  buildTargetPlan,
  preparationKindLabel,
  targetRoleLabel,
  type TargetPlanSubject,
} from "@/lib/targetPlan";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LangContext";

const ROLE_STYLE: Record<TargetPlanSubject["role"], string> = {
  english: "border-green/40 bg-green/8 text-green",
  chinese: "border-green/40 bg-green/8 text-green",
  math: "border-green/40 bg-green/8 text-green",
  required: "border-tier-reach/45 bg-tier-reach/8 text-tier-reach",
  support: "border-brass/50 bg-brass/8 text-[oklch(0.42_0.07_74)]",
  filler: "border-tier-unknown/45 bg-tier-unknown/8 text-tier-unknown",
};

export default function Reverse() {
  const { t, lang } = useLang();
  const [region, setRegion] = useState<Region>("sg");
  const [uniId, setUniId] = useState("nus");
  const [progId, setProgId] = useState("nus-computer-science");
  const [atarInput, setAtarInput] = useState("");
  /** 分年选课方案依赖 BCI 的课程序列 */
  const [hemisphere, setHemisphere] = useState<Hemisphere>("south");

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

  /** 单目标升学方案：分年选课 + 背景准备 */
  /** 数学是否为学生强项：为真时在允许的情况下给出双数学 */
  const [strongMath, setStrongMath] = useState(false);
  const plan = useMemo(() => {
    if (!result) return null;
    return buildTargetPlan(result.university.id, result.programme.id, hemisphere, strongMath);
  }, [result?.university.id, result?.programme.id, hemisphere, strongMath]);

  const selectClass =
    "mt-2 w-full border border-border bg-paper px-3 py-2.5 text-[0.875rem] text-green outline-none transition-colors focus:border-brass";

  /** 分年方案中的一行科目 */
  function PlanRow({ item, index }: { item: TargetPlanSubject; index: number }) {
    const meta = SUBJECTS.find((s) => s.key === item.subject);
    return (
      <li className="flex items-start gap-3.5 border-b border-border bg-card px-4 py-3.5 last:border-b-0">
        <span className="almanac-index mt-1 shrink-0">{String(index + 1).padStart(2, "0")}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <h4 className="text-[0.875rem] leading-snug text-green">
              {subjectLabelBy(item.subject, lang)}
            </h4>
            <span
              className={cn(
                "border px-1.5 py-0.5 text-[0.625rem] tracking-[0.08em]",
                ROLE_STYLE[item.role],
              )}>
              {targetRoleLabel(item.role, lang)}
            </span>
            {meta && (
              <span className="text-[0.6875rem] text-muted-foreground">
                scaling {meta.scaling === "高" ? t("高", "High") : meta.scaling === "中" ? t("中", "Medium") : t("一般", "Standard")}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-[0.75rem] leading-relaxed text-muted-foreground">
            {lang === "zh" ? item.reasonZh : item.reasonEn}
          </p>
          {item.alternatives.length > 0 && (
            <p className="mt-1 text-[0.75rem] text-muted-foreground">
              {t("可替换为：", "Or: ")}
              {item.alternatives.map((k) => subjectLabelBy(k, lang)).join(lang === "zh" ? "、" : ", ")}
            </p>
          )}
        </div>
      </li>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main>
        {/* 标题区：与 A-Level 反查页同一规格 */}
        <section className="print-title-band border-b border-border bg-paper-deep/35">
          <div className="container py-9 lg:py-12">
            <p className="eyebrow text-brass">{t("WACE · 由目标规划", "WACE · Plan from a Target")}</p>
            <h1 className="mt-3 font-[family-name:var(--font-serif)] text-3xl text-green sm:text-4xl">
              {t("由目标规划", "Plan from a Target")}
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
            /*
             * key 取当前院校与专业的组合：切换目标时整块结果重新挂载，
             * 触发一次轻微换页，让家长察觉内容确实换了一份。
             */
            <article
              key={`${result.university.id}-${result.programme.id}`}
              className="swap min-w-0">
              <PrintHeader title={t("WACE 院校专业门槛报告", "WACE programme requirements report")} />

              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
                <div>
                  <p className="almanac-index flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>
                      {result.university.abbr} · {result.university.region.toUpperCase()}
                    </span>
                    <QsRank universityId={result.university.id} />
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
                  {/* 分数不做滚动计数，避免家长读到不存在的中间值 */}
                  <p className="score mt-3 text-3xl text-green">
                    <Tick>
                      {result.requiredAtar === null
                        ? t("顾问复核", "Adviser review")
                        : result.requiredAtar.toFixed(2)}
                    </Tick>
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
                      {t("合并多个目标一起规划选课", "Plan across several targets")}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </section>

              {/* 分年选课方案：为当前这一个目标而定 */}
              {plan && (
                <section className="mt-8 border-t border-border pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-brass" />
                      <h3 className="font-[family-name:var(--font-serif)] text-xl text-green">
                        {t("为这个目标怎么选课", "Subject plan for this target")}
                      </h3>
                    </div>
                    <div className="no-print flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setStrongMath((v) => !v)}
                        aria-pressed={strongMath}
                        className={cn(
                          "border px-2.5 py-1 text-[0.75rem] transition-colors duration-150",
                          strongMath
                            ? "border-green bg-green text-primary-foreground"
                            : "border-input text-muted-foreground hover:border-brass hover:text-green",
                        )}>
                        {t("数学是强项", "Strong in maths")}
                      </button>
                      <span className="text-[0.6875rem] tracking-[0.12em] text-muted-foreground">
                        {t("课程序列", "Sequence")}
                      </span>
                      {HEMISPHERES.map((h) => (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => setHemisphere(h.id)}
                          className={cn(
                            "border px-2.5 py-1 text-[0.75rem] transition-colors duration-150",
                            hemisphere === h.id
                              ? "border-green bg-green text-primary-foreground"
                              : "border-input text-muted-foreground hover:border-brass hover:text-green",
                          )}>
                          {lang === "zh" ? h.label : h.labelEn}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="mt-3 max-w-[68ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {t(
                      `以下组合仅针对「${result.university.abbr} · ${result.programme.nameZh}」这一个目标推导：两年各修 ${Y11_COURSES} 门，Year 12 由这 ${Y12_COURSES} 门中取最好的 ${ATAR_COUNTED} 门计入 ATAR。BCI 中国学生以 EALD、中文（第一语言）与数学三门为锁定基础，其余名额按目标专业的先修与方向支撑填补。`,
                      `The following is derived for this single target — ${result.university.abbr} · ${result.programme.name}: ${Y11_COURSES} courses in each year, with the best ${ATAR_COUNTED} of the ${Y12_COURSES} Year 12 courses counting towards the ATAR. For BCI's Chinese students the locked base is EALD, Chinese: First Language and mathematics; the remaining slots go to the programme's prerequisites and field support.`,
                    )}
                  </p>

                  {plan.doubleMath && (
                    <div className="mt-4 flex items-start gap-2.5 border border-green/40 bg-green/6 px-4 py-3 text-[0.8125rem] leading-relaxed text-green">
                      <GraduationCap className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>
                        {t(
                          "已按数学强项给出双数学方案：数学方法与专业数学同修。两门均为高 scaling 科目，也是剑桥、LSE、帝国理工数学与经济类专业的常见要求。",
                          "A double-mathematics plan is applied: Mathematics Methods together with Mathematics Specialist. Both scale highly and are commonly required by mathematics and economics programmes at Cambridge, LSE and Imperial.",
                        )}
                      </p>
                    </div>
                  )}

                  {plan.doubleMathBlockedBy.length > 0 && (
                    <div className="mt-4 flex items-start gap-2.5 border border-brass/50 bg-brass/8 px-4 py-3 text-[0.8125rem] leading-relaxed text-[oklch(0.42_0.07_74)]">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>
                        {t("本目标另有官方先修 ", "This target has the further official prerequisite ")}
                        <strong>
                          {plan.doubleMathBlockedBy
                            .map((k) => subjectLabelBy(k, lang))
                            .join(lang === "zh" ? "、" : ", ")}
                        </strong>
                        {t(
                          `，Year 12 的 ${Y12_COURSES} 个名额须优先留给它，因此未采用双数学。先修缺失会直接失去申请资格，提分则可通过其他方式弥补。`,
                          `. The ${Y12_COURSES} Year 12 slots must go to it first, so double mathematics is not applied. A missing prerequisite removes eligibility outright, whereas scaling can be addressed by other means.`,
                        )}
                      </p>
                    </div>
                  )}

                  {!plan.chineseAvailable && (
                    <div className="mt-4 flex items-start gap-2.5 border border-brass/50 bg-brass/8 px-4 py-3 text-[0.8125rem] leading-relaxed text-[oklch(0.42_0.07_74)]">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>
                        {t(
                          "BCI 的中文（第一语言）仅在南半球序列开设。当前为北半球序列，中文无法计入本方案，锁定基础仅为 EALD 与数学两门。",
                          "BCI offers Chinese: First Language only in the Southern Hemisphere sequence. In the current Northern Hemisphere sequence Chinese cannot be included, so the locked base is EALD and mathematics only.",
                        )}
                      </p>
                    </div>
                  )}

                  {plan.unavailable.length > 0 && (
                    <div className="mt-4 flex items-start gap-2.5 border border-brass/50 bg-brass/8 px-4 py-3 text-[0.8125rem] leading-relaxed text-[oklch(0.42_0.07_74)]">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>
                        {t("本序列未开设该专业要求的 ", "This sequence does not offer the required ")}
                        <strong>
                          {plan.unavailable
                            .map((k) => subjectLabelBy(k, lang))
                            .join(lang === "zh" ? "、" : ", ")}
                        </strong>
                        {t(
                          "，请与升学指导办公室确认替代方案或调整入学序列。",
                          ". Confirm an alternative or a different intake sequence with the Admissions Office.",
                        )}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 grid gap-6 lg:grid-cols-2">
                    <div>
                      <div className="flex items-baseline justify-between gap-3 border-b-2 border-green pb-2.5">
                        <h4 className="font-[family-name:var(--font-serif)] text-[1.125rem] text-green">
                          Year 11
                        </h4>
                        <span className="score text-[0.75rem] text-muted-foreground">
                          {plan.year11.length} {t("门", "courses")}
                        </span>
                      </div>
                      <p className="mt-2.5 text-[0.75rem] leading-relaxed text-muted-foreground">
                        {t(
                          "打基础并保留一门余量，避免过早关闭其他方向。",
                          "Build the foundation and keep one spare course so other pathways stay open.",
                        )}
                      </p>
                      <ul className="mt-3 border border-border">
                        {plan.year11.map((item, i) => (
                          <PlanRow key={item.subject} item={item} index={i} />
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between gap-3 border-b-2 border-green pb-2.5">
                        <h4 className="font-[family-name:var(--font-serif)] text-[1.125rem] text-green">
                          Year 12
                        </h4>
                        <span className="score text-[0.75rem] text-muted-foreground">
                          {plan.year12.length} {t("门", "courses")}
                        </span>
                      </div>
                      <p className="mt-2.5 text-[0.75rem] leading-relaxed text-muted-foreground">
                        {t(
                          `同样修读 ${Y12_COURSES} 门，由其中最好的 ${ATAR_COUNTED} 门计入 ATAR，多出的一门为备份，可抵御单科失手。`,
                          `Also ${Y12_COURSES} courses, of which the best ${ATAR_COUNTED} count towards the ATAR. The extra course acts as a buffer against one weak result.`,
                        )}
                      </p>
                      <ul className="mt-3 border border-border">
                        {plan.year12.map((item, i) => (
                          <PlanRow key={item.subject} item={item} index={i} />
                        ))}
                      </ul>
                      {plan.backup.length > 0 && (
                        <div className="mt-3 border border-border bg-paper-deep/30 px-4 py-3">
                          <p className="eyebrow text-brass">
                            {t("计分建议", "Which four to count")}
                          </p>
                          <p className="mt-2 text-[0.75rem] leading-relaxed text-muted-foreground">
                            {t("按当前推导，计入 ATAR 的四门为 ", "On the current derivation the four counted are ")}
                            <strong className="text-green">
                              {plan.counted
                                .map((s) => subjectLabelBy(s.subject, lang))
                                .join(lang === "zh" ? "、" : ", ")}
                            </strong>
                            {t("；", "; ")}
                            <strong className="text-green">
                              {plan.backup
                                .map((s) => subjectLabelBy(s.subject, lang))
                                .join(lang === "zh" ? "、" : ", ")}
                            </strong>
                            {t(
                              " 作为备份。实际计分以最终成绩为准，若备份科目考得更好即由它顶替。",
                              " serves as the buffer. The actual four are decided by the final results: if the buffer scores higher it takes the place of a weaker subject.",
                            )}
                          </p>
                        </div>
                      )}
                      {plan.dropped.length > 0 && (
                        <p className="mt-3 border border-dashed border-border bg-paper-deep/30 px-4 py-3 text-[0.75rem] leading-relaxed text-muted-foreground">
                          {t("Year 12 可放弃：", "May be dropped in Year 12: ")}
                          <span className="text-green">
                            {plan.dropped
                              .map((s) => subjectLabelBy(s.subject, lang))
                              .join(lang === "zh" ? "、" : ", ")}
                          </span>
                          {t(
                            "。该科目非本专业先修，放弃不影响申请资格。",
                            ". Not a prerequisite for this programme; dropping it does not affect eligibility.",
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* 背景准备：官方要求与加分项分开陈述 */}
              {plan && plan.preparation.length > 0 && (
                <section className="mt-8 border-t border-border pt-6">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-brass" />
                    <h3 className="font-[family-name:var(--font-serif)] text-xl text-green">
                      {t("除了成绩，还要准备什么", "Beyond the score")}
                    </h3>
                  </div>
                  <p className="mt-3 max-w-[68ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {t(
                      "澳洲本科录取以 ATAR 与先修科目为主，竞赛与课外活动通常不是硬性条件；下表明确区分官方要求与加分项，避免把加分项误当作录取门槛。",
                      "Australian undergraduate admission rests mainly on the ATAR and prerequisites; competitions and extracurriculars are usually not mandatory. The table separates official requirements from advantages so the two are not confused.",
                    )}
                  </p>
                  <Stagger as="ul" className="mt-5 border border-border">
                    {plan.preparation.map((item, i) => (
                      <li
                        key={`${item.kind}-${i}`}
                        className="grid gap-2 border-b border-border bg-card px-4 py-4 last:border-b-0 md:grid-cols-[10rem_1fr_11rem] md:gap-5">
                        <div>
                          <span
                            className={cn(
                              "border px-1.5 py-0.5 text-[0.625rem] tracking-[0.08em]",
                              item.kind === "official"
                                ? "border-tier-reach/45 bg-tier-reach/8 text-tier-reach"
                                : item.kind === "language"
                                  ? "border-green/40 bg-green/8 text-green"
                                  : "border-brass/50 bg-brass/8 text-[oklch(0.42_0.07_74)]",
                            )}>
                            {preparationKindLabel(item.kind, lang)}
                          </span>
                          <p className="mt-2 text-[0.875rem] text-green">
                            {lang === "zh" ? item.titleZh : item.titleEn}
                          </p>
                        </div>
                        <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                          {lang === "zh" ? item.detailZh : item.detailEn}
                        </p>
                        <p className="flex items-start gap-1.5 text-[0.75rem] leading-relaxed text-muted-foreground">
                          <CalendarClock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass" />
                          {lang === "zh" ? item.timingZh : item.timingEn}
                        </p>
                      </li>
                    ))}
                  </Stagger>
                </section>
              )}

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
