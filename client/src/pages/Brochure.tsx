/**
 * 设计风格：Admissions Almanac
 * 宣传册页：A4 纵向比例的四页版式，专为打印与 PDF 导出设计。
 * 打印时隐藏导航与操作按钮，页面之间强制分页。
 */
import { Printer } from "lucide-react";
import { SiteFooter, SiteHeader, Wordmark } from "@/components/Brand";
import { ScoreRule } from "@/components/ScoreRule";
import { FIELDS, REGIONS, UNIVERSITIES } from "@/data/universities";
import { TIER_META, datasetStats } from "@/lib/matching";

const HERO = "/manus-storage/bv-hero-almanac_675b2c4b.png";

/** 各地区代表性门槛，用于宣传册摘要 */
function regionSummary(regionId: string) {
  const list = UNIVERSITIES.filter((u) => u.region === regionId);
  const scores = list.map((u) => u.minAtar).filter((v): v is number => v !== null);
  if (scores.length === 0) return "官方未公布统一门槛";
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  return min === max ? `最低 ATAR ${min}` : `最低 ATAR ${min} 至 ${max}`;
}

export default function Brochure() {
  const stats = datasetStats();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="no-print border-b border-border bg-paper-deep/45">
        <div className="container flex flex-wrap items-end justify-between gap-4 py-10">
          <div>
            <span className="eyebrow text-brass">宣传册 · Print Edition</span>
            <h1 className="mt-3 text-[2.25rem] leading-tight text-green">四页版招生宣传册</h1>
            <p className="mt-4 max-w-[64ch] font-[family-name:var(--font-serif)] text-[1rem] leading-relaxed text-muted-foreground">
              下方为 A4 纵向版式的宣传册内容，可直接打印或通过浏览器另存为 PDF，用于宣讲会与家长面谈。
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 border border-green bg-green px-5 py-2.5 text-[0.875rem] text-primary-foreground transition-colors hover:bg-green-soft">
            <Printer className="h-4 w-4" />
            打印或导出 PDF
          </button>
        </div>
      </div>

      <div className="container space-y-10 py-12 print:space-y-0 print:py-0">
        {/* 第一页：封面 */}
        <section className="mx-auto w-full max-w-[52rem] border border-border bg-card print:max-w-none print:border-0 print:break-after-page">
          <div className="relative">
            <img src={HERO} alt="招生年鉴书桌俯拍" className="h-64 w-full object-cover sm:h-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.25_0.03_158/0.55)] to-transparent" />
            <div className="absolute bottom-6 left-8 right-8">
              <span className="eyebrow text-paper">Brentvale College International</span>
              <h2 className="mt-2 max-w-[22ch] font-[family-name:var(--font-display)] text-[2rem] font-semibold leading-tight text-paper sm:text-[2.5rem]">
                WACE 升学门槛年鉴
              </h2>
            </div>
          </div>
          <div className="px-8 py-8">
            <p className="max-w-[56ch] font-[family-name:var(--font-serif)] text-[1rem] leading-relaxed text-ink">
              这份年鉴回答三个问题：我的目标专业需要多少 ATAR、我现在的分数能申请哪些院校、以及为了实现目标我该在 Year 11 选哪几门课。
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-border pt-6 sm:grid-cols-4">
              {[
                { k: "目标院校", v: stats.universities },
                { k: "专业条目", v: stats.programmes },
                { k: "覆盖地区", v: stats.regions },
                { k: "WACE 科目", v: stats.subjects },
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
        <section className="mx-auto w-full max-w-[52rem] border border-border bg-card px-8 py-9 print:max-w-none print:border-0 print:break-after-page">
          <span className="almanac-index">第一节</span>
          <h2 className="mt-1 text-[1.625rem] text-green">四大目标地区门槛概览</h2>
          <div className="mt-8">
            <ScoreRule
              markers={[
                { label: "澳洲 70", value: 70, tone: "muted" },
                { label: "香港 80", value: 80 },
                { label: "新加坡 90", value: 90 },
                { label: "英国 92+", value: 92, tone: "green" },
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
                    {r.label}
                  </h3>
                  <span className="score text-[0.8125rem] text-brass">{regionSummary(r.id)}</span>
                </div>
                <p className="mt-2 font-[family-name:var(--font-serif)] text-[0.875rem] leading-relaxed text-muted-foreground">
                  {r.blurb}
                </p>
                <p className="mt-1.5 text-[0.75rem] text-muted-foreground">申请通道：{r.channel}</p>
                <p className="mt-2 text-[0.75rem] leading-relaxed text-ink">
                  代表院校：
                  {UNIVERSITIES.filter((u) => u.region === r.id)
                    .map((u) => `${u.nameZh}（${u.minAtar === null ? "未公布" : u.minAtar}）`)
                    .join("、")}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 第三页：分层与选课 */}
        <section className="mx-auto w-full max-w-[52rem] border border-border bg-card px-8 py-9 print:max-w-none print:border-0 print:break-after-page">
          <span className="almanac-index">第二节</span>
          <h2 className="mt-1 text-[1.625rem] text-green">机会分层与选课方向</h2>
          <dl className="mt-7 divide-y divide-border border-y border-border">
            {(["safe", "target", "reach", "unknown"] as const).map((tier) => (
              <div key={tier} className="grid gap-1.5 py-3.5 sm:grid-cols-[5rem_1fr] sm:gap-5">
                <dt
                  className="text-[0.875rem] font-medium"
                  style={{ color: TIER_META[tier].color }}>
                  {TIER_META[tier].label}
                </dt>
                <dd className="font-[family-name:var(--font-serif)] text-[0.875rem] leading-relaxed text-muted-foreground">
                  {TIER_META[tier].definition}
                </dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-9 text-[1.125rem] text-green">按方向的 WACE 选课建议</h3>
          <div className="mt-5 space-y-4">
            {FIELDS.map((f) => (
              <div key={f.key} className="grid gap-1.5 border-b border-border pb-3.5 sm:grid-cols-[7rem_1fr] sm:gap-5">
                <span className="text-[0.875rem] text-green">{f.zh}</span>
                <p className="font-[family-name:var(--font-serif)] text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {f.advice}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 第四页：使用方式与声明 */}
        <section className="mx-auto w-full max-w-[52rem] border border-border bg-card px-8 py-9 print:max-w-none print:border-0">
          <span className="almanac-index">第三节</span>
          <h2 className="mt-1 text-[1.625rem] text-green">如何使用这份年鉴</h2>
          <ol className="mt-7 space-y-5">
            {[
              {
                t: "第一步：确认目标区间",
                d: "与学生一起明确优先考虑的地区，再对照该地区的最低门槛区间，判断当前成绩水平的合理目标范围。",
              },
              {
                t: "第二步：反查目标专业条件",
                d: "在线上工具中选定院校与专业，读取所需 ATAR、必修科目、英语要求与附加测试，形成一份具体的目标条件清单。",
              },
              {
                t: "第三步：核对选课组合",
                d: "把两到四个候选目标加入清单，查看哪些 WACE 科目被反复要求，据此确定 Year 11 的四至五门主力科目。",
              },
              {
                t: "第四步：定期复核",
                d: "每学期用最新预估成绩重跑正向查询，观察稳妥、匹配、冲刺三档的数量变化，据此调整目标与备选方案。",
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
            <h3 className="text-[0.9375rem] text-green">数据说明与免责声明</h3>
            <p className="mt-2.5 font-[family-name:var(--font-serif)] text-[0.8125rem] leading-relaxed text-ink">
              本年鉴所载分数与要求全部引自各院校官方招生页面，核验时间为 2026 年 8 月，覆盖 2026 与 2027 年入学周期。所列 ATAR 为官方公布的最低门槛，热门专业的实际竞争分数通常显著更高，达到门槛不构成录取保证。部分院校采用综合评估而不公布统一门槛，此类专业在表中标注为未公布。正式申请前请以院校官网最新公告为准。
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-6">
            <Wordmark />
            <span className="score text-[0.75rem] text-muted-foreground">2026 年 8 月版</span>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
