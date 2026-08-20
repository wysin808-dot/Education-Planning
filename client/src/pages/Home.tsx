/**
 * 设计风格：Admissions Almanac
 * 首屏采用与 A-Level 首页严格对位的双入口结构：01 有成绩规划 / 02 由目标规划，
 * 以横向规则线分隔并统一编号，使两个课程体系的进入方式读起来完全一致。
 * 禁止居中英雄区与卡片网格堆叠；以规则线与编号建立年鉴目录感。
 * 全站中英双语：所有面向用户的文案通过 t(中文, 英文) 输出；本页以 WACE 为主，
 * 以独立、低干扰的入口引导 Cambridge A-Level 学生进入对应体系。
 * 动效：各章节滚动浮现，功能行与地区名录错落显现，统计数字滚动计数；
 * 减动偏好与打印时一律退化为静态最终态。
 */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, BookOpenText, Clock3, GraduationCap, Ruler, Scale, Search } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { CountUp, Reveal, Stagger } from "@/components/Motion";
import { ScoreRule } from "@/components/ScoreRule";
import { TierLegend } from "@/components/TierBadge";
import { REGIONS, UNIVERSITIES } from "@/data/universities";
import { datasetStats } from "@/lib/matching";
import { useLang } from "@/contexts/LangContext";
import { getRecentTool, type RecentTool } from "@/lib/recent";

const HERO = "/manus-storage/bv-hero-almanac_675b2c4b.png";
/** 档案式文档配图优先于人物场景照，以贴合年鉴调性 */
const ARCHIVE = "/manus-storage/bv-subjects_9e541983.png";

export default function Home() {
  const stats = datasetStats();
  const { t, lang } = useLang();
  const [recentTool, setRecentTool] = useState<RecentTool | null>(null);

  useEffect(() => {
    setRecentTool(getRecentTool());
  }, []);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* 首屏：左文右图的不对称结构 */}
      <section className="border-b border-border">
        <div className="container grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center py-16 lg:py-24 lg:pr-14">
            <span className="eyebrow text-brass">
              {t("Brentvale 招生年鉴 · 2026/27", "Brentvale Admissions Almanac · 2026/27")}
            </span>
            <h1 className="mt-6 max-w-[24ch] text-[2.75rem] leading-[1.08] text-green sm:text-[3.5rem]">
              {t(
                "ATAR 92 能进的不是一所大学，而是一组选择。",
                "An ATAR of 92 is not one university. It is a set of choices.",
              )}
            </h1>
            <p className="mt-6 max-w-[52ch] font-[family-name:var(--font-serif)] text-[1.0625rem] leading-relaxed text-muted-foreground">
              {t(
                "这是一份可以双向查阅的升学门槛年鉴。学生与家长既可以输入预计 ATAR，看清能够申请的院校与专业；也可以先锁定目标专业，反推所需分数、必修科目与附加测试。",
                "A two-way almanac of admission thresholds. Enter a projected ATAR to see which universities and programmes are within reach, or start from a target programme and work backwards to the score, prerequisite subjects and additional tests it demands.",
              )}
            </p>

            {/* 与 A-Level 首页对位的双入口 */}
            <div className="mt-9 grid border-y border-border sm:grid-cols-2">
              <Link
                href="/wace/forward"
                className="group border-b border-border p-5 transition-colors hover:bg-paper-deep sm:border-b-0 sm:border-r">
                <span className="almanac-index text-brass">01 · {t("有成绩规划", "Plan from a score")}</span>
                <span className="mt-4 flex items-center gap-2 text-[1.1rem] text-green">
                  <Scale className="h-4 w-4" />
                  {t("预计 ATAR → 院校专业", "Projected ATAR → options")}
                </span>
                <span className="mt-2 block text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {t(
                    "输入预计 ATAR 与已选科目，按稳妥、匹配、冲刺三档查看可申请的院校与专业。",
                    "Enter a projected ATAR and current subjects to see reachable programmes across safety, match and reach bands.",
                  )}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 border-b border-brass pb-0.5 text-[0.75rem] text-green">
                  {t("按成绩查询", "Start from grades")}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
              <Link
                href="/wace/reverse"
                className="group p-5 transition-colors hover:bg-paper-deep">
                <span className="almanac-index text-brass">02 · {t("由目标规划", "Plan from a target")}</span>
                <span className="mt-4 flex items-center gap-2 text-[1.1rem] text-green">
                  <GraduationCap className="h-4 w-4" />
                  {t("院校专业 → 条件", "Programme → requirements")}
                </span>
                <span className="mt-2 block text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {t(
                    "先锁定目标专业，再反查所需 ATAR、必修 WACE 科目、英语要求与附加测试。",
                    "Start with a target programme, then work back to the required ATAR, compulsory WACE subjects, English and additional tests.",
                  )}
                </span>
                <span className="mt-4 inline-flex items-center gap-1 border-b border-brass pb-0.5 text-[0.75rem] text-green">
                  {t("按目标查询", "Start from a target")}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>
            <Link
              href="/alevel"
              className="mt-6 inline-flex items-center gap-2 border-b border-brass pb-1 text-[0.8125rem] text-green transition-colors hover:text-brass">
              <GraduationCap className="h-4 w-4" />
              {t("修读 Cambridge A-Level？进入 7 门课程的独立规划器", "Taking Cambridge A-Level? Enter the dedicated seven-subject planner")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {recentTool && (
              <Link
                href={recentTool.href}
                className="mt-5 flex max-w-[34rem] items-center justify-between gap-4 border-y border-border py-3 text-left transition-colors hover:border-brass">
                <span className="flex min-w-0 items-center gap-2.5">
                  <Clock3 className="h-4 w-4 shrink-0 text-brass" />
                  <span className="min-w-0">
                    <span className="eyebrow text-muted-foreground">{t("最近使用", "Recently used")}</span>
                    <span className="mt-0.5 block truncate text-[0.875rem] text-green">
                      {lang === "zh" ? recentTool.zh : recentTool.en}
                    </span>
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-brass" />
              </Link>
            )}

            <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-border pt-8 sm:grid-cols-4">
              {[
                { k: t("目标院校", "Universities"), v: stats.universities },
                { k: t("专业条目", "Programmes"), v: stats.programmes },
                { k: t("覆盖地区", "Regions"), v: stats.regions },
                { k: t("WACE 批准课程", "WACE courses"), v: stats.subjects },
              ].map((item) => (
                <div key={item.k}>
                  <dd className="score text-[1.75rem] leading-none text-green">
                    <CountUp value={item.v} />
                  </dd>
                  <dt className="mt-2 text-[0.75rem] tracking-[0.14em] text-muted-foreground">
                    {item.k}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative border-l border-border">
            <img
              src={HERO}
              alt={t(
                "铺开的招生年鉴、黄铜圆规与钢笔构成的书桌俯拍",
                "An overhead view of an open admissions almanac, brass dividers and a fountain pen",
              )}
              className="h-full min-h-[26rem] w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 border-t border-brass/50 bg-paper/94 px-6 py-4 backdrop-blur-sm">
              <p className="font-[family-name:var(--font-serif)] text-[0.875rem] leading-relaxed text-ink">
                {t(
                  "「先确定目标专业的先修科目，再决定 Year 11 选哪四门。」",
                  "\u201cEstablish the prerequisites of the target programme first, then decide which four subjects to take in Year 11.\u201d",
                )}
              </p>
              <span className="mt-1 block text-[0.6875rem] tracking-[0.16em] text-muted-foreground">
                {t("升学指导办公室", "Admissions & Careers Office")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ATAR 标尺示意 */}
      <section className="border-b border-border bg-paper-deep/45">
        <Reveal className="container py-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="almanac-index">01</span>
              <h2 className="mt-1 text-[1.75rem] text-green">
                {t("一条标尺看清全部门槛", "One rule, every threshold")}
              </h2>
            </div>
            <p className="max-w-[42ch] font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-muted-foreground">
              {t(
                "下方虚线为各地区最具代表性的门槛位置。指针为示例分数 92.00。",
                "The dashed lines mark representative thresholds by region. The pointer shows a sample score of 92.00.",
              )}
            </p>
          </div>
          <div className="mt-10 pb-4">
            <ScoreRule
              atar={92}
              markers={[
                { label: "UWA 70", value: 70, tone: "muted" },
                { label: t("港八大 80", "HK Eight 80"), value: 80 },
                { label: "PolyU 85", value: 85 },
                { label: t("新加坡 90", "Singapore 90"), value: 90 },
                { label: "UCL 96", value: 96 },
                { label: t("牛剑 98.5+", "Oxbridge 98.5+"), value: 98.5, tone: "green" },
              ]}
            />
          </div>
        </Reveal>
      </section>

      {/* 四大功能：横向规则行而非卡片网格 */}
      <section className="border-b border-border">
        <Reveal className="container py-16">
          <span className="almanac-index">02</span>
          <h2 className="mt-1 text-[1.75rem] text-green">
            {t("四种查阅方式", "Four ways to consult")}
          </h2>

          <Stagger className="mt-10 divide-y divide-border border-y border-border">
            {[
              {
                no: "I",
                icon: Search,
                title: t("有成绩规划", "Plan from grades"),
                desc: t(
                  "输入预计 ATAR 与已选科目，按稳妥、匹配、冲刺三档列出可申请的院校与专业，并标注先修科目是否满足。",
                  "Enter a projected ATAR and current subjects to see every reachable programme sorted into safety, match and reach bands, with prerequisite gaps flagged.",
                ),
                href: "/wace/forward",
                cta: t("按成绩查询", "Start from grades"),
              },
              {
                no: "II",
                icon: GraduationCap,
                title: t("由目标规划", "Plan from a target"),
                desc: t(
                  "先选定目标院校与专业，反推所需 ATAR、必修 WACE 科目、英语要求、附加测试与申请截止日期。",
                  "Select a target university and programme to reveal the required ATAR, compulsory WACE subjects, English requirement, additional tests and application deadline.",
                ),
                href: "/wace/reverse",
                cta: t("按目标查询", "Start from a target"),
              },
              {
                no: "III",
                icon: BookOpenText,
                title: t("选课规划", "Subject planning"),
                desc: t(
                  "把多个目标专业加入清单，系统统计各 WACE 科目的必要程度，给出 Year 11 与 Year 12 的选课组合建议。",
                  "Add several target programmes to a shortlist and the planner counts how essential each WACE subject is, then proposes a Year 11 and Year 12 combination.",
                ),
                href: "/wace/subjects",
                cta: t("规划选课组合", "Plan a subject set"),
              },
              {
                no: "IV",
                icon: Ruler,
                title: t("31 校速查", "31-university table"),
                desc: t(
                  "一页对照 31 所院校的最低 ATAR、英语要求、申请窗口与数据来源，可直接打印用于家长面谈。",
                  "A single sheet comparing the minimum ATAR, English requirement, application window and source for all 31 universities, ready to print for parent meetings.",
                ),
                href: "/wace/table",
                cta: t("查看速查表", "Open the table"),
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
          </Stagger>
        </Reveal>
      </section>

      {/* 地区覆盖 */}
      <section className="border-b border-border bg-paper-deep/45">
        <Reveal className="container py-16">
          <span className="almanac-index">03</span>
          <h2 className="mt-1 text-[1.75rem] text-green">
            {t("四大目标地区", "Four target regions")}
          </h2>
          <Stagger className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {REGIONS.map((region, i) => {
              const count = UNIVERSITIES.filter((u) => u.region === region.id).length;
              return (
                <div key={region.id} className="border-t border-green/25 pt-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-[1.125rem] text-green">
                      <span className="almanac-index mr-2">{String(i + 1).padStart(2, "0")}</span>
                      {lang === "zh" ? region.label : region.labelEn}
                    </h3>
                    <span className="score shrink-0 text-[0.8125rem] text-brass">
                      {count} {t("所", "universities")}
                    </span>
                  </div>
                  <p className="mt-3 font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {lang === "zh" ? region.blurb : region.blurbEn}
                  </p>
                  <p className="mt-2 text-[0.8125rem] text-muted-foreground/85">
                    {t("申请通道：", "Channel: ")}
                    {lang === "zh" ? region.channel : region.channelEn}
                  </p>
                </div>
              );
            })}
          </Stagger>
        </Reveal>
      </section>

      {/* 分层定义 + 图片 */}
      <section>
        <Reveal className="container grid gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="relative">
            <img
              src={ARCHIVE}
              alt={t(
                "WACE 选课规划的索引卡、黄铜直尺与院校资料俯拍",
                "Index cards, a brass ruler and university documents laid out for WACE subject planning",
              )}
              className="w-full object-cover"
            />
            <p className="mt-3 text-[0.75rem] leading-relaxed text-muted-foreground">
              {t(
                "查询结果均可打印为纸质讲义，用作家长面谈与宣讲会材料。",
                "Every result can be printed as a handout for parent meetings and information evenings.",
              )}
            </p>
          </div>
          <div>
            <span className="almanac-index">04</span>
            <h2 className="mt-1 text-[1.75rem] text-green">
              {t("三档机会如何界定", "How the three bands are defined")}
            </h2>
            <p className="mt-4 max-w-[56ch] font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-muted-foreground">
              {t(
                "分层依据院校官方公布的最低门槛，而非往年录取线的估算。请注意，达到最低门槛不等于录取保证，热门专业的实际竞争分数通常高于门槛。",
                "Bands are derived from officially published minimum thresholds rather than estimated cut-offs. Meeting a minimum does not guarantee an offer; competitive programmes usually settle well above it.",
              )}
            </p>
            <TierLegend className="mt-8" />
            <p className="mt-6 text-[0.8125rem] leading-relaxed text-muted-foreground">
              {t(
                "数据核验时间为 2026 年 8 月，覆盖 2026 与 2027 年入学周期。部分院校采用综合评估而不公布 ATAR 门槛，此类专业统一标记为「待评估」，需由顾问结合完整背景判断。",
                "Data verified in August 2026 for the 2026 and 2027 intake cycles. Where a university assesses holistically and publishes no ATAR threshold, the programme is marked \u201cunder review\u201d and requires a counsellor's judgement on the full profile.",
              )}
            </p>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
