/**
 * 设计风格：Admissions Almanac
 * 宣传册页：A4 纵向比例的四页版式，专为打印与 PDF 导出设计。
 * 打印时隐藏导航与操作按钮，页面之间强制分页。
 */
import { SiteFooter, SiteHeader, Wordmark } from "@/components/Brand";
import { BrochureBanner } from "@/components/Plates";
import { FileDown } from "lucide-react";
import { ScoreRule } from "@/components/ScoreRule";
import { FIELDS, REGIONS, UNIVERSITIES } from "@/data/universities";
import { TIER_META, datasetStats, tierDefinition, tierLabel } from "@/lib/matching";
import { useLang } from "@/contexts/LangContext";

const FIXED_BROCHURE_PDF = "/manus-storage/brentvale-wace-admissions-almanac-2026-27_60e7b1f0.pdf";

export default function Brochure() {
  const stats = datasetStats();
  const { t, lang } = useLang();

  /** 各地区代表性门槛，用于宣传册摘要 */
  function regionSummary(regionId: string) {
    const list = UNIVERSITIES.filter((u) => u.region === regionId);
    const scores = list.map((u) => u.minAtar).filter((v): v is number => v !== null);
    if (scores.length === 0) return t("官方未公布统一门槛", "No uniform threshold published");
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    return min === max
      ? t(`最低 ATAR ${min}`, `Minimum ATAR ${min}`)
      : t(`最低 ATAR ${min} 至 ${max}`, `Minimum ATAR ${min} to ${max}`);
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="no-print border-b border-border bg-paper-deep/45">
        <div className="container flex flex-wrap items-end justify-between gap-4 py-10">
          <div>
            <span className="eyebrow text-brass">{t("宣传册 · Print Edition", "Print Edition")}</span>
            <h1 className="mt-3 text-[2.25rem] leading-tight text-green">
              {t("四页版招生宣传册", "A four-page admissions brochure")}
            </h1>
            <p className="mt-4 max-w-[64ch] font-[family-name:var(--font-serif)] text-[1rem] leading-relaxed text-muted-foreground">
              {t(
                "下方为 A4 纵向版式的宣传册内容，可直接打印或通过浏览器另存为 PDF，用于宣讲会与家长面谈。",
                "Below is the brochure laid out for A4 portrait. Print it directly or save as PDF from the browser for information evenings and parent meetings.",
              )}
            </p>
          </div>
          <a
            href={FIXED_BROCHURE_PDF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-green bg-green px-5 py-2.5 text-[0.875rem] text-primary-foreground transition-colors hover:bg-green-soft">
            <FileDown className="h-4 w-4" />
            {t("打开固定版 PDF", "Open fixed-layout PDF")}
          </a>
        </div>
      </div>

      <div className="container space-y-10 py-12 print:space-y-0 print:py-0">
        {/* 第一页：封面 */}
        <section className="brochure-print-page brochure-cover mx-auto w-full max-w-[52rem] border border-border bg-card print:max-w-none print:border-0 print:break-after-page">
          <div className="relative">
            <BrochureBanner className="brochure-cover-image h-64 w-full sm:h-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.25_0.03_158/0.55)] to-transparent" />
            <div className="absolute bottom-6 left-8 right-8">
              <span className="eyebrow text-paper">
                {t("博林国际学院 · Brentvale College International", "Brentvale College International")}
              </span>
              <h2 className="mt-2 max-w-[22ch] font-[family-name:var(--font-display)] text-[2rem] font-semibold leading-tight text-paper sm:text-[2.5rem]">
                {t("WACE 升学门槛年鉴", "The WACE Admissions Almanac")}
              </h2>
            </div>
          </div>
          <div className="brochure-cover-body px-8 py-8">
            <p className="max-w-[56ch] font-[family-name:var(--font-serif)] text-[1rem] leading-relaxed text-ink">
              {t(
                "这份年鉴回答三个问题：我的目标专业需要多少 ATAR、我现在的分数能申请哪些院校、以及为了实现目标我该在 Year 11 选哪几门课。",
                "This almanac answers three questions: what ATAR the target programme demands, which universities the current score can reach, and which Year 11 courses will get the student there.",
              )}
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-border pt-6 sm:grid-cols-4">
              {[
                { k: t("目标院校", "Universities"), v: stats.universities },
                { k: t("专业条目", "Programmes"), v: stats.programmes },
                { k: t("覆盖地区", "Regions"), v: stats.regions },
                { k: t("BCI 课程", "BCI courses"), v: stats.subjects },
              ].map((s) => (
                <div key={s.k}>
                  <dd className="score text-[1.625rem] leading-none text-green">{s.v}</dd>
                  <dt className="mt-1.5 text-[0.6875rem] tracking-[0.14em] text-muted-foreground">{s.k}</dt>
                </div>
              ))}
            </dl>
            <div className="mt-8 border-t border-border pt-6">
              <Wordmark />
            </div>
          </div>
        </section>

        {/* 第二页：四大地区门槛 */}
        <section className="brochure-print-page mx-auto w-full max-w-[52rem] border border-border bg-card px-8 py-9 print:max-w-none print:border-0 print:break-after-page">
          <span className="almanac-index">{t("第一节", "Section I")}</span>
          <h2 className="mt-1 text-[1.625rem] text-green">
            {t("四大目标地区门槛概览", "Thresholds across the four target regions")}
          </h2>
          <div className="mt-8">
            <ScoreRule
              markers={[
                { label: t("澳洲 70", "Australia 70"), value: 70, tone: "muted" },
                { label: t("香港 80", "Hong Kong 80"), value: 80 },
                { label: t("新加坡 90", "Singapore 90"), value: 90 },
                { label: t("英国 92+", "UK 92+"), value: 92, tone: "green" },
              ]}
              showPointer={false}
            />
          </div>
          <div className="mt-8 space-y-6">
            {REGIONS.map((r, i) => (
              <div key={r.id} className="border-t border-green/25 pt-4">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="text-[1.0625rem] text-green">
                    <span className="almanac-index mr-2">{String(i + 1).padStart(2, "0")}</span>
                    {lang === "zh" ? r.label : r.labelEn}
                  </h3>
                  <span className="score text-[0.8125rem] text-brass">{regionSummary(r.id)}</span>
                </div>
                <p className="mt-2 font-[family-name:var(--font-serif)] text-[0.875rem] leading-relaxed text-muted-foreground">
                  {lang === "zh" ? r.blurb : r.blurbEn}
                </p>
                <p className="mt-1.5 text-[0.75rem] text-muted-foreground">
                  {t("申请通道：", "Channel: ")}
                  {lang === "zh" ? r.channel : r.channelEn}
                </p>
                <p className="mt-2 text-[0.75rem] leading-relaxed text-ink">
                  {t("代表院校：", "Universities: ")}
                  {UNIVERSITIES.filter((u) => u.region === r.id)
                    .map(
                      (u) =>
                        `${lang === "zh" ? u.nameZh : u.abbr}（${
                          u.minAtar === null ? t("未公布", "n/a") : u.minAtar
                        }）`,
                    )
                    .join("、")}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 第三页：分层与选课 */}
        <section className="brochure-print-page mx-auto w-full max-w-[52rem] border border-border bg-card px-8 py-9 print:max-w-none print:border-0 print:break-after-page">
          <span className="almanac-index">{t("第二节", "Section II")}</span>
          <h2 className="mt-1 text-[1.625rem] text-green">
            {t("机会分层与选课方向", "Opportunity bands and subject direction")}
          </h2>
          <dl className="mt-7 divide-y divide-border border-y border-border">
            {(["safe", "target", "reach", "unknown"] as const).map((tier) => (
              <div key={tier} className="grid gap-1.5 py-3.5 sm:grid-cols-[5rem_1fr] sm:gap-5">
                <dt
                  className="text-[0.875rem] font-medium"
                  style={{ color: TIER_META[tier].color }}>
                  {tierLabel(tier, lang)}
                </dt>
                <dd className="font-[family-name:var(--font-serif)] text-[0.875rem] leading-relaxed text-muted-foreground">
                  {tierDefinition(tier, lang)}
                </dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-9 text-[1.125rem] text-green">
            {t("按方向的 WACE 选课建议", "WACE subject guidance by field")}
          </h3>
          <div className="mt-5 space-y-4">
            {FIELDS.map((f) => (
              <div key={f.key} className="grid gap-1.5 border-b border-border pb-3.5 sm:grid-cols-[7rem_1fr] sm:gap-5">
                <span className="text-[0.875rem] text-green">{lang === "zh" ? f.zh : f.en}</span>
                <p className="font-[family-name:var(--font-serif)] text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {lang === "zh" ? f.advice : f.adviceEn}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 第四页：使用方式与声明 */}
        <section className="brochure-print-page mx-auto w-full max-w-[52rem] border border-border bg-card px-8 py-9 print:max-w-none print:border-0">
          <span className="almanac-index">{t("第三节", "Section III")}</span>
          <h2 className="mt-1 text-[1.625rem] text-green">
            {t("如何使用这份年鉴", "How to use this almanac")}
          </h2>
          <ol className="mt-7 space-y-5">
            {[
              {
                t: t("第一步：确认目标区间", "Step 1 · Fix the target range"),
                d: t(
                  "与学生一起明确优先考虑的地区，再对照该地区的最低门槛区间，判断当前成绩水平的合理目标范围。",
                  "Agree with the student on the priority regions, then read that region's threshold range to establish what is realistic at the current level.",
                ),
              },
              {
                t: t("第二步：反查目标专业条件", "Step 2 · Reverse-check the programme"),
                d: t(
                  "在线上工具中选定院校与专业，读取所需 ATAR、必修科目、英语要求与附加测试，形成一份具体的目标条件清单。",
                  "Select the university and programme in the online tool, read off the required ATAR, compulsory subjects, English requirement and additional tests, and turn them into a concrete checklist.",
                ),
              },
              {
                t: t("第三步：核对选课组合", "Step 3 · Test the subject set"),
                d: t(
                  "把两到四个候选目标加入清单，查看哪些 WACE 科目被反复要求，据此确定 Year 11 的四至五门主力科目。",
                  "Add two to four candidate targets to the shortlist, see which WACE courses recur as prerequisites, and settle the four or five Year 11 courses accordingly.",
                ),
              },
              {
                t: t("第四步：定期复核", "Step 4 · Review each term"),
                d: t(
                  "每学期用最新预估成绩重跑「有成绩规划」，观察稳妥、匹配、冲刺三档的数量变化，据此调整目标与备选方案。",
                  "Re-run the forward search each term with the latest projection, watch how the safety, match and reach counts shift, and adjust the target list accordingly.",
                ),
              },
            ].map((step, i) => (
              <li key={step.t} className="flex gap-4 border-b border-border pb-4">
                <span className="score shrink-0 text-[1.125rem] text-brass">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-[1rem] text-green">{step.t}</h3>
                  <p className="mt-1.5 font-[family-name:var(--font-serif)] text-[0.875rem] leading-relaxed text-muted-foreground">
                    {step.d}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-9 border border-brass/50 bg-brass/6 px-6 py-5">
            <h3 className="text-[0.9375rem] text-green">
              {t("数据说明与免责声明", "Data notes and disclaimer")}
            </h3>
            <p className="mt-2.5 font-[family-name:var(--font-serif)] text-[0.8125rem] leading-relaxed text-ink">
              {t(
                "本年鉴所载分数与要求全部引自各院校官方招生页面，核验时间为 2026 年 8 月，覆盖 2026 与 2027 年入学周期。所列 ATAR 为官方公布的最低门槛，热门专业的实际竞争分数通常显著更高，达到门槛不构成录取保证。部分院校采用综合评估而不公布统一门槛，此类专业在表中标注为未公布。正式申请前请以院校官网最新公告为准。",
                "Every score and requirement in this almanac is drawn from official university admissions pages, verified in August 2026 for the 2026 and 2027 intake cycles. The ATARs shown are published minimums; competitive programmes usually settle well above them, and meeting a minimum does not guarantee an offer. Where an institution assesses holistically and publishes no uniform threshold, the entry is marked as not published. Confirm against the university's latest official announcement before applying.",
              )}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-6">
            <Wordmark />
            <span className="score text-[0.75rem] text-muted-foreground">
              {t("2026 年 8 月版", "August 2026 edition")}
            </span>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
