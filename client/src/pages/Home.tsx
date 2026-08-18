/**
 * 设计风格：Admissions Almanac
 * 首屏为左右不对称双入口（我有目标院校 / 我有预计 ATAR），中间以竖向规则线分隔。
 * 禁止居中英雄区与卡片网格堆叠；以规则线与编号建立年鉴目录感。
 */
import { Link } from "wouter";
import { ArrowRight, BookOpenText, GraduationCap, Ruler, Search } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { ScoreRule } from "@/components/ScoreRule";
import { TierLegend } from "@/components/TierBadge";
import { REGIONS, UNIVERSITIES } from "@/data/universities";
import { datasetStats } from "@/lib/matching";

const HERO = "/manus-storage/bv-hero-almanac_675b2c4b.png";
/** 档案式文档配图优先于人物场景照，以贴合年鉴调性 */
const ARCHIVE = "/manus-storage/bv-subjects_9e541983.png";

export default function Home() {
  const stats = datasetStats();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* 首屏：左文右图的不对称结构 */}
      <section className="border-b border-border">
        <div className="container grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center py-16 lg:py-24 lg:pr-14">
            <span className="eyebrow text-brass">Brentvale 招生年鉴 · 2026/27</span>
            <h1 className="mt-6 max-w-[24ch] text-[2.75rem] leading-[1.08] text-green sm:text-[3.5rem]">
              ATAR 92 能进的不是一所大学，而是一组选择。
            </h1>
            <p className="mt-6 max-w-[52ch] font-[family-name:var(--font-serif)] text-[1.0625rem] leading-relaxed text-muted-foreground">
              这是一份可以双向查阅的升学门槛年鉴。学生与家长既可以输入预计 ATAR，看清能够申请的院校与专业；也可以先锁定目标专业，反推所需分数、必修科目与附加测试。
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/forward"
                className="inline-flex items-center gap-2 border border-green bg-green px-6 py-3 text-[0.9375rem] text-primary-foreground transition-colors duration-150 hover:bg-green-soft">
                我有预计 ATAR
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/reverse"
                className="inline-flex items-center gap-2 border border-green px-6 py-3 text-[0.9375rem] text-green transition-colors duration-150 hover:bg-green/6">
                我有目标院校
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-border pt-8 sm:grid-cols-4">
              {[
                { k: "目标院校", v: stats.universities },
                { k: "专业条目", v: stats.programmes },
                { k: "覆盖地区", v: stats.regions },
                { k: "WACE 科目", v: stats.subjects },
              ].map((item) => (
                <div key={item.k}>
                  <dd className="score text-[1.75rem] leading-none text-green">{item.v}</dd>
                  <dt className="mt-2 text-[0.75rem] tracking-[0.14em] text-muted-foreground">{item.k}</dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative border-l border-border">
            <img
              src={HERO}
              alt="铺开的招生年鉴、黄铜圆规与钢笔构成的书桌俯拍"
              className="h-full min-h-[26rem] w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 border-t border-brass/50 bg-paper/94 px-6 py-4 backdrop-blur-sm">
              <p className="font-[family-name:var(--font-serif)] text-[0.875rem] leading-relaxed text-ink">
                「先确定目标专业的先修科目，再决定 Year 11 选哪四门。」
              </p>
              <span className="mt-1 block text-[0.6875rem] tracking-[0.16em] text-muted-foreground">
                升学指导办公室
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ATAR 标尺示意 */}
      <section className="border-b border-border bg-paper-deep/45">
        <div className="container py-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="almanac-index">01</span>
              <h2 className="mt-1 text-[1.75rem] text-green">一条标尺看清全部门槛</h2>
            </div>
            <p className="max-w-[42ch] font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-muted-foreground">
              下方虚线为各地区最具代表性的门槛位置。指针为示例分数 92.00。
            </p>
          </div>
          <div className="mt-10 pb-4">
            <ScoreRule
              atar={92}
              markers={[
                { label: "UWA 70", value: 70, tone: "muted" },
                { label: "港八大 80", value: 80 },
                { label: "PolyU 85", value: 85 },
                { label: "新加坡 90", value: 90 },
                { label: "UCL 96", value: 96 },
                { label: "牛剑 98.5+", value: 98.5, tone: "green" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 四大功能：横向规则行而非卡片网格 */}
      <section className="border-b border-border">
        <div className="container py-16">
          <span className="almanac-index">02</span>
          <h2 className="mt-1 text-[1.75rem] text-green">四种查阅方式</h2>

          <div className="mt-10 divide-y divide-border border-y border-border">
            {[
              {
                no: "I",
                icon: Search,
                title: "分数查院校",
                desc: "输入预计 ATAR 与已选科目，按稳妥、匹配、冲刺三档列出可申请的院校与专业，并标注先修科目是否满足。",
                href: "/forward",
                cta: "开始正向查询",
              },
              {
                no: "II",
                icon: GraduationCap,
                title: "院校查门槛",
                desc: "先选定目标院校与专业，反推所需 ATAR、必修 WACE 科目、英语要求、附加测试与申请截止日期。",
                href: "/reverse",
                cta: "开始反向查询",
              },
              {
                no: "III",
                icon: BookOpenText,
                title: "选课规划",
                desc: "把多个目标专业加入清单，系统统计各 WACE 科目的必要程度，给出 Year 11 与 Year 12 的选课组合建议。",
                href: "/subjects",
                cta: "规划选课组合",
              },
              {
                no: "IV",
                icon: Ruler,
                title: "门槛总表",
                desc: "一页对照 31 所院校的最低 ATAR、英语要求、申请窗口与数据来源，可直接打印用于家长面谈。",
                href: "/table",
                cta: "查看总表",
              },
            ].map((row) => (
              <div
                key={row.no}
                className="group grid gap-4 py-7 md:grid-cols-[3rem_1fr_auto] md:items-center md:gap-8">
                <span className="score text-[1.375rem] text-brass">{row.no}</span>
                <div>
                  <h3 className="flex items-center gap-2.5 text-[1.125rem] text-green">
                    <row.icon className="h-4 w-4 shrink-0 text-brass" />
                    {row.title}
                  </h3>
                  <p className="mt-2 max-w-[68ch] font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {row.desc}
                  </p>
                </div>
                <Link
                  href={row.href}
                  className="inline-flex items-center gap-2 whitespace-nowrap border-b border-brass pb-0.5 text-[0.875rem] text-green transition-colors duration-150 hover:text-brass">
                  {row.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 地区覆盖 */}
      <section className="border-b border-border bg-paper-deep/45">
        <div className="container py-16">
          <span className="almanac-index">03</span>
          <h2 className="mt-1 text-[1.75rem] text-green">四大目标地区</h2>
          <div className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {REGIONS.map((region, i) => {
              const count = UNIVERSITIES.filter((u) => u.region === region.id).length;
              return (
                <div key={region.id} className="border-t border-green/25 pt-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-[1.125rem] text-green">
                      <span className="almanac-index mr-2">{String(i + 1).padStart(2, "0")}</span>
                      {region.label}
                    </h3>
                    <span className="score shrink-0 text-[0.8125rem] text-brass">{count} 所</span>
                  </div>
                  <p className="mt-3 font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {region.blurb}
                  </p>
                  <p className="mt-2 text-[0.8125rem] text-muted-foreground/85">申请通道：{region.channel}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 分层定义 + 图片 */}
      <section>
        <div className="container grid gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="relative">
            <img
              src={ARCHIVE}
              alt="WACE 选课规划的索引卡、黄铜直尺与院校资料俯拍"
              className="w-full object-cover"
            />
            <p className="mt-3 text-[0.75rem] leading-relaxed text-muted-foreground">
              查询结果均可打印为纸质讲义，用作家长面谈与宣讲会材料。
            </p>
          </div>
          <div>
            <span className="almanac-index">04</span>
            <h2 className="mt-1 text-[1.75rem] text-green">三档机会如何界定</h2>
            <p className="mt-4 max-w-[56ch] font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-muted-foreground">
              分层依据院校官方公布的最低门槛，而非往年录取线的估算。请注意，达到最低门槛不等于录取保证，热门专业的实际竞争分数通常高于门槛。
            </p>
            <TierLegend className="mt-8" />
            <p className="mt-6 text-[0.8125rem] leading-relaxed text-muted-foreground">
              数据核验时间为 2026 年 8 月，覆盖 2026 与 2027 年入学周期。部分院校采用综合评估而不公布 ATAR 门槛，此类专业统一标记为「待评估」，需由顾问结合完整背景判断。
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
