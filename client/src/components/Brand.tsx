/**
 * 设计风格：Admissions Almanac
 * 页头采用深墨绿承载的 BCI 官方反白圆形徽章、紧凑 BRENTVALE 字标与导航；
 * 桌面端以横向目录呈现，手机端使用可点击的纵向「目录」菜单，避免横向滑动导航造成的访问障碍。
 * 注意：BCI 官方主色为砖红 #B02A2A，与年鉴的墨绿铜金构成双色体系——
 * 红色仅用于品牌标识与强调，版面主色仍为墨绿。
 */
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LangContext";
import { useShortlist } from "@/contexts/ShortlistContext";
import { saveRecentTool } from "@/lib/recent";

const LOGO_RED = "/manus-storage/bci-logo-horizontal_ead9c912.png";
const LOGO_WHITE = "/manus-storage/bci-logo-horizontal-white_4bd4c272.png";
const CREST_RED = "/manus-storage/bci-crest_444d5067.png";
const CREST_WHITE = "/manus-storage/bci-crest-white_94d24f24.png";

export function Wordmark({
  variant = "dark",
  compact = false,
}: {
  variant?: "dark" | "light";
  compact?: boolean;
}) {
  const light = variant === "light";
  const { t } = useLang();
  if (compact) {
    return (
      <span className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        <img
          src={light ? CREST_WHITE : CREST_RED}
          alt="Brentvale College"
          className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9"
        />
        <span className="min-w-0 border-l border-brass/60 pl-2.5 sm:pl-3">
          <span
            className={cn(
              "block whitespace-nowrap font-[family-name:var(--font-serif)] text-[0.75rem] font-semibold tracking-[0.13em] sm:text-[0.8125rem]",
              light ? "text-paper" : "text-brand-red",
            )}>
            BRENTVALE
          </span>
          <span
            className={cn(
              "block whitespace-nowrap pt-0.5 text-[0.5rem] tracking-[0.18em] sm:text-[0.5625rem]",
              light ? "text-paper/70" : "text-muted-foreground",
            )}>
            {t("升学规划", "UNIVERSITY PATHWAYS")}
          </span>
        </span>
      </span>
    );
  }
  return (
    <span className="flex items-center gap-3.5">
      <img
        src={light ? LOGO_WHITE : LOGO_RED}
        alt="Brentvale College International"
        className="h-10 w-auto shrink-0 object-contain sm:h-11"
      />
      <span
        className={cn(
          "hidden h-9 w-px shrink-0 sm:block",
          light ? "bg-brass/50" : "bg-brass/60",
        )}
      />
      <span
        className={cn(
          "hidden whitespace-nowrap text-[0.6875rem] leading-tight tracking-[0.22em] sm:block",
          light ? "text-paper/70" : "text-muted-foreground",
        )}>
        {t("升学规划", "UNIVERSITY PATHWAYS")}
      </span>
    </span>
  );
}

const NAV = [
  { href: "/", zh: "首页", en: "Home" },
  { href: "/forward", zh: "分数查院校", en: "Score → Universities" },
  { href: "/reverse", zh: "院校查门槛", en: "University → ATAR" },
  { href: "/subjects", zh: "选课规划", en: "Subject Planner" },
  { href: "/table", zh: "门槛总表", en: "Threshold Table" },
  { href: "/shortlist", zh: "目标清单", en: "Shortlist" },
  { href: "/brochure", zh: "宣传册", en: "Brochure" },
  { href: "/alevel", zh: "Cambridge A-Level", en: "Cambridge A-Level" },
];

const NAV_DETAILS: Record<string, { zh: string; en: string }> = {
  "/": { zh: "总览与两种查询入口", en: "Overview and two search starting points" },
  "/forward": { zh: "输入 ATAR，查看可申请的院校与专业", en: "Enter ATAR to find reachable universities and programmes" },
  "/reverse": { zh: "锁定院校专业，反查 ATAR 与先修要求", en: "Start with a programme and work back to its requirements" },
  "/subjects": { zh: "按收藏目标规划 WACE 选课组合", en: "Plan WACE subjects from your shortlisted goals" },
  "/table": { zh: "31 所院校门槛的打印速查表", en: "A printable quick-reference threshold table" },
  "/shortlist": { zh: "汇总收藏专业，形成个人目标清单", en: "Review saved programmes as a personal shortlist" },
  "/brochure": { zh: "可打印的 WACE 升学规划说明", en: "A printable WACE pathways overview" },
  "/alevel": { zh: "以 Cambridge A-Level 预测等级规划院校与专业", en: "Plan university and programme options through Cambridge A-Level predictions" },
};

const PRIMARY_NAV = NAV.filter((item) => item.href !== "/brochure" && item.href !== "/alevel");
const MORE_NAV = NAV.filter((item) => item.href === "/brochure" || item.href === "/alevel");

function LangToggle({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const { lang, setLang } = useLang();
  const light = variant === "light";
  return (
    <div
      className={cn(
        "flex shrink-0 items-center border",
        light ? "border-paper/30" : "border-border",
      )}
      role="group"
      aria-label="Language / 语言">
      {(["zh", "en"] as const).map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            className={cn(
              "px-2.5 py-1.5 text-[0.6875rem] tracking-[0.12em] transition-colors duration-150",
              active
                ? light
                  ? "bg-paper text-green"
                  : "bg-green text-primary-foreground"
                : light
                  ? "text-paper/65 hover:text-paper"
                  : "text-muted-foreground hover:text-green",
            )}>
            {code === "zh" ? "中文" : "EN"}
          </button>
        );
      })}
    </div>
  );
}

export function SiteHeader() {
  const [path] = useLocation();
  const { lang, t } = useLang();
  const { count } = useShortlist();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    saveRecentTool(path);
  }, [path]);
  return (
    <header className="no-print sticky top-0 z-40 border-b border-border bg-paper/92 backdrop-blur-md">
      <div className="container flex h-[4.5rem] items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={t("返回 Brentvale WACE 升学规划首页", "Return to Brentvale WACE Pathways home")}
          className="shrink-0 bg-green px-2.5 py-2 sm:px-3">
          <Wordmark compact variant="light" />
        </Link>
        <nav className="hidden min-w-0 items-center justify-center gap-0.5 lg:flex" aria-label={t("主导航", "Primary navigation")}>
          {PRIMARY_NAV.map((item) => {
            const active = path === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative whitespace-nowrap px-2 py-2 text-[0.75rem] transition-colors duration-150 xl:px-2.5 xl:text-[0.8125rem]",
                  active ? "text-green" : "text-muted-foreground hover:text-green",
                )}>
                {lang === "zh" ? item.zh : item.en}
                {item.href === "/shortlist" && count > 0 && (
                  <span className="score ml-1 border border-brass/60 bg-brass/12 px-1 text-[0.625rem] text-[oklch(0.42_0.07_74)]">
                    {count}
                  </span>
                )}
                {active && <span className="absolute inset-x-2 -bottom-px h-[2px] bg-brass" />}
              </Link>
            );
          })}
          <details className="group relative">
            <summary className="flex list-none cursor-pointer items-center gap-1 whitespace-nowrap px-2 py-2 text-[0.75rem] text-muted-foreground transition-colors hover:text-green xl:px-2.5 xl:text-[0.8125rem]">
              {t("更多", "More")}
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="absolute right-0 top-full z-50 mt-2 min-w-36 border border-border bg-paper p-1.5 shadow-[0_12px_24px_oklch(0.2_0.02_90_/_0.14)]">
              {MORE_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block whitespace-nowrap px-3 py-2 text-[0.8125rem] text-muted-foreground transition-colors hover:bg-paper-deep hover:text-green">
                  {lang === "zh" ? item.zh : item.en}
                </Link>
              ))}
            </div>
          </details>
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <LangToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? t("关闭目录", "Close menu") : t("打开目录", "Open menu")}
            aria-expanded={menuOpen}
            className="inline-flex h-8 w-8 items-center justify-center border border-border text-green transition-colors hover:border-brass lg:hidden">
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-paper shadow-[0_14px_28px_oklch(0.2_0.02_90_/_0.12)] lg:hidden">
          <nav className="container py-3" aria-label={t("主导航", "Primary navigation")}>
            <p className="eyebrow border-b border-border pb-2 text-brass">{t("目录", "Contents")}</p>
            <div className="mt-2 flex flex-col">
              {NAV.map((item, index) => {
                const active = path === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between border-b border-border px-1 py-3 text-[0.9375rem]",
                      active ? "text-green" : "text-muted-foreground hover:text-green",
                    )}>
                      <span className="flex items-center gap-3">
                        <span className="almanac-index text-brass">{String(index + 1).padStart(2, "0")}</span>
                        <span>
                          <span className="block">{lang === "zh" ? item.zh : item.en}</span>
                          <span className="mt-0.5 block text-[0.6875rem] leading-relaxed text-muted-foreground">
                            {lang === "zh" ? NAV_DETAILS[item.href].zh : NAV_DETAILS[item.href].en}
                          </span>
                        </span>
                      </span>
                    {item.href === "/shortlist" && count > 0 && (
                      <span className="score border border-brass/60 bg-brass/12 px-1.5 text-[0.6875rem] text-[oklch(0.42_0.07_74)]">
                        {count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { lang, t } = useLang();
  const { count } = useShortlist();
  return (
    <footer className="no-print mt-24 border-t-2 border-green bg-green text-paper">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Wordmark variant="light" />
          <p className="mt-5 max-w-md font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-paper/80">
            {t(
              "Brentvale College International 为 WACE 与 Cambridge A-Level 学生提供升学门槛查询与选课决策支持。本工具的所有要求均引自各校官方招生页面，用于规划参考。",
              "Brentvale College International provides WACE and Cambridge A-Level students with admission lookups and subject-selection guidance. All requirements are drawn from official university admissions pages and are intended for planning reference.",
            )}
          </p>
        </div>
        <nav aria-label={t("常用工具", "Quick tools")}>
          <h3 className="eyebrow text-brass-soft">{t("常用工具", "Quick tools")}</h3>
          <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2.5 text-[0.875rem] text-paper/80">
            {NAV.filter((item) => ["/forward", "/reverse", "/subjects", "/shortlist"].includes(item.href)).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex items-center gap-1.5 hover:text-brass-soft">
                  {lang === "zh" ? item.zh : item.en}
                  {item.href === "/shortlist" && count > 0 && (
                    <span className="score border border-brass-soft/50 bg-brass-soft/10 px-1 text-[0.625rem] text-brass-soft">
                      {count}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h3 className="eyebrow text-brass-soft">{t("数据说明", "About the Data")}</h3>
          <ul className="mt-4 space-y-2.5 text-[0.875rem] leading-relaxed text-paper/80">
            <li>
              {t(
                "覆盖新加坡 6 所、香港 8 所、澳洲 8 所、英国 9 所",
                "6 Singapore · 8 Hong Kong · 8 Australia · 9 United Kingdom",
              )}
            </li>
            <li>{t("数据对应 2026 与 2027 年入学周期", "For 2026 and 2027 intake cycles")}</li>
            <li>
              {t(
                "门槛为官方最低要求，非录取保证",
                "Thresholds are official minimums, not guarantees of an offer",
              )}
            </li>
            <li>
              {t(
                "申请前请以院校官网最新公告为准",
                "Always verify against the university's latest official announcement",
              )}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/15">
        <div className="container flex flex-col gap-2 py-5 text-[0.75rem] text-paper/60 md:flex-row md:items-center md:justify-between">
          <span>
            {t(
              "© 2026 Brentvale College International · 招生与升学指导办公室",
              "© 2026 Brentvale College International · Admissions & Careers Office",
            )}
          </span>
          <span className="score">{t("最后核验：2026 年 8 月", "Last verified: August 2026")}</span>
        </div>
      </div>
    </footer>
  );
}
