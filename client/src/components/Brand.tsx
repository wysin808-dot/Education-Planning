/**
 * 设计风格：Admissions Almanac
 * 页头仅保留深墨绿承载的 BCI 官方反白圆形徽章、紧凑 BRENTVALE 字标与语言切换；
 * 全站导航统一收敛至页脚，避免手机端横向导航造成的访问障碍。
 * 注意：BCI 官方主色为砖红 #B02A2A，与年鉴的墨绿铜金构成双色体系——
 * 红色仅用于品牌标识与强调，版面主色仍为墨绿。
 */
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LangContext";
import { useShortlist } from "@/contexts/ShortlistContext";

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
            {t("WACE 升学规划", "WACE PATHWAYS")}
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
        {t("WACE 升学规划", "WACE PATHWAYS")}
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
];

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
  const { t } = useLang();
  return (
    <header className="no-print sticky top-0 z-40 border-b border-border bg-paper/92 backdrop-blur-md">
      <div className="container flex h-[4.5rem] items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={t("返回 Brentvale WACE 升学规划首页", "Return to Brentvale WACE Pathways home")}
          className="shrink-0 bg-green px-2.5 py-2 sm:px-3">
          <Wordmark compact variant="light" />
        </Link>
        <div className="flex shrink-0 items-center gap-3">
          <LangToggle />
        </div>
      </div>
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
              "Brentvale College International 为 WACE 学生提供升学门槛查询与选课决策支持。本工具的所有分数与要求均引自各校官方招生页面，用于规划参考。",
              "Brentvale College International provides WACE students with admission threshold lookups and subject-selection guidance. All scores and requirements are drawn from official university admissions pages and are intended for planning reference.",
            )}
          </p>
        </div>
        <nav aria-label={t("全站导航", "Site navigation")}>
          <h3 className="eyebrow text-brass-soft">{t("全站导航", "Explore")}</h3>
          <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2.5 text-[0.875rem] text-paper/80">
            {NAV.map((item) => (
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
