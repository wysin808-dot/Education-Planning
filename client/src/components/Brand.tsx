/**
 * 设计风格：Admissions Almanac
 * 页头以 BCI 官方砖红圆形徽章与砖红字标作为第一品牌信号（承载于纸感底），
 * 深墨绿只用于导航当前状态、版面结构与页脚反白场景，不替代官方品牌色。
 * 导航为两层年鉴结构：上层是「册」——WACE 与 A-Level 两个课程体系；
 * 下层是「章」——当前体系内的功能页，随所处体系整体更换，不与体系入口混排。
 * 手机端使用可点击的纵向「目录」菜单并按体系分组，避免横向滑动导航造成的访问障碍。
 * 体系切换保持同类功能页：从 WACE 反查切到 A-Level 时仍落在反查页，不退回体系总览。
 * 页脚只列各体系特有的工具，目标清单为跨体系共用的唯一一项，避免与页头重复成两份清单。
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
  /** 中文界面加注英文全称，便于家长与官方文件对照 */
  const fullName = "Brentvale College International";
  if (compact) {
    return (
      <span className="flex min-w-0 items-center gap-2.5 sm:gap-3" title={t(`博林国际学院 · ${fullName}`, fullName)}>
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
            {t("博林国际学院", "BRENTVALE")}
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
    <span className="flex items-center gap-3.5" title={t(`博林国际学院 · ${fullName}`, fullName)}>
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

type NavItem = { href: string; zh: string; en: string; noteZh: string; noteEn: string };

/** 「册」层：两个彼此独立的课程体系 */
export const CURRICULA = [
  {
    id: "wace",
    home: "/wace",
    zh: "WACE",
    en: "WACE",
    tagZh: "ATAR 体系",
    tagEn: "ATAR basis",
  },
  {
    id: "alevel",
    home: "/alevel",
    zh: "A-Level",
    en: "A-Level",
    tagZh: "剑桥等级",
    tagEn: "Cambridge grades",
  },
] as const;

/**
 * 「章」层：各体系内部的功能页。
 *
 * 两套体系的功能一一对应，因此导航名称必须完全相同——家长在入口页并排看到两栏时，
 * 同名才读得出「功能一样，只是课程不同」。两者真正的差异（ATAR 分数 / 预测等级）
 * 由每项下方的说明文字承担，不塞进导航名称里。
 */
const WACE_NAV: NavItem[] = [
  { href: "/wace", zh: "总览", en: "Overview", noteZh: "WACE 升学规划入口与两种查询路径", noteEn: "WACE pathways entry and two lookup routes" },
  { href: "/wace/forward", zh: "有成绩规划", en: "Plan from Grades", noteZh: "输入预计 ATAR，查看可申请的院校与专业", noteEn: "Enter a projected ATAR to find reachable universities and programmes" },
  { href: "/wace/reverse", zh: "由目标规划", en: "Plan from a Target", noteZh: "锁定院校专业，反查 ATAR、先修与分年选课", noteEn: "Start from a programme and work back to its ATAR, prerequisites and year-by-year subjects" },
  { href: "/wace/subjects", zh: "选课规划", en: "Subject Planner", noteZh: "按收藏目标规划 WACE 选课组合", noteEn: "Plan WACE subjects from your shortlisted goals" },
  { href: "/wace/table", zh: "31 校速查", en: "31-University Table", noteZh: "31 所院校 ATAR 门槛的打印速查表", noteEn: "A printable quick-reference table of ATAR thresholds" },
  { href: "/wace/shortlist", zh: "目标清单", en: "Shortlist", noteZh: "汇总收藏专业，形成个人目标清单", noteEn: "Review saved programmes as a personal shortlist" },
];

const ALEVEL_NAV: NavItem[] = [
  { href: "/alevel", zh: "总览", en: "Overview", noteZh: "以 Cambridge A-Level 预测等级规划院校与专业", noteEn: "Plan university options through Cambridge A-Level predictions" },
  { href: "/alevel/forward", zh: "有成绩规划", en: "Plan from Grades", noteZh: "输入 3–4 门预测等级，查看可申请的院校与专业", noteEn: "Enter three to four predicted grades to find reachable universities and programmes" },
  { href: "/alevel/reverse", zh: "由目标规划", en: "Plan from a Target", noteZh: "锁定院校专业，反查等级条件、指定科目与分年选课", noteEn: "Start from a programme and work back to its grades, required subjects and year-by-year plan" },
  { href: "/alevel/subjects", zh: "选课规划", en: "Subject Planner", noteZh: "按收藏目标规划 7 门 Cambridge 课程", noteEn: "Plan the seven Cambridge subjects from your shortlist" },
  { href: "/alevel/table", zh: "31 校速查", en: "31-University Table", noteZh: "31 所院校 A-Level 等级条件的分区速查", noteEn: "A printable quick-reference table of A-Level conditions by region" },
  { href: "/alevel/shortlist", zh: "目标清单", en: "Shortlist", noteZh: "与 WACE 共用的个人目标清单", noteEn: "The shared personal shortlist" },
];

const BROCHURE: NavItem = {
  href: "/brochure",
  zh: "宣传册",
  en: "Brochure",
  noteZh: "可打印的升学规划说明",
  noteEn: "A printable pathways overview",
};

/** 由当前路径判断所处体系；选择页返回 null */
export function curriculumOf(path: string): "wace" | "alevel" | null {
  if (path.startsWith("/alevel")) return "alevel";
  if (path.startsWith("/wace")) return "wace";
  return null;
}

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

export function SiteHeader({ chooser = false }: { chooser?: boolean }) {
  const [path] = useLocation();
  const { lang, t } = useLang();
  const { count } = useShortlist();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    saveRecentTool(path);
  }, [path]);

  useEffect(() => {
    setMenuOpen(false);
  }, [path]);

  const current = curriculumOf(path);
  const sectionNav = current === "alevel" ? ALEVEL_NAV : WACE_NAV;
  const shortlistHref = current === "alevel" ? "/alevel/shortlist" : "/wace/shortlist";

  /**
   * 体系切换保持同类功能页：两套路由的尾段一一对应，
   * 因此把当前路径的尾段接到目标体系上即可；总览页与未知路径回落到体系首页。
   */
  function switchTo(target: (typeof CURRICULA)[number]) {
    if (!current || current === target.id) return target.home;
    const tail = path.replace(/^\/(wace|alevel)/, "");
    const candidate = `${target.home}${tail}`;
    const nav = target.id === "alevel" ? ALEVEL_NAV : WACE_NAV;
    return nav.some((item) => item.href === candidate) ? candidate : target.home;
  }

  return (
    <header className="no-print sticky top-0 z-40 border-b border-border bg-paper/92 backdrop-blur-md">
      {/* 第一层：品牌 + 课程体系（册） */}
      <div className="container flex h-[3.75rem] items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={t("返回课程体系选择页", "Return to the curriculum chooser")}
          className="shrink-0 border border-brand-red/25 bg-paper px-2.5 py-1.5 transition-colors duration-150 hover:border-brand-red/55 sm:px-3">
          <Wordmark compact />
        </Link>

        <div className="flex min-w-0 shrink-0 items-center gap-3">
          {!chooser && (
            <span className="border border-green bg-green px-2 py-1 text-[0.6875rem] tracking-[0.08em] text-primary-foreground sm:hidden">
              {current === "alevel" ? "A-Level" : "WACE"}
            </span>
          )}
          {!chooser && (
            <nav
              aria-label={t("课程体系", "Curriculum")}
              className="hidden items-stretch border border-border sm:flex">
              {CURRICULA.map((c) => {
                const active = current === c.id;
                return (
                  <Link
                    key={c.id}
                    href={switchTo(c)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex flex-col justify-center whitespace-nowrap px-3 py-1.5 text-left transition-colors duration-150",
                      active
                        ? "bg-green text-primary-foreground"
                        : "text-muted-foreground hover:bg-paper-deep hover:text-green",
                    )}>
                    <span className="text-[0.8125rem] leading-tight">{lang === "zh" ? c.zh : c.en}</span>
                    <span
                      className={cn(
                        "text-[0.5625rem] tracking-[0.12em]",
                        active ? "text-paper/70" : "text-muted-foreground/75",
                      )}>
                      {lang === "zh" ? c.tagZh : c.tagEn}
                    </span>
                  </Link>
                );
              })}
            </nav>
          )}
          <LangToggle />
          {!chooser && (
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? t("关闭目录", "Close menu") : t("打开目录", "Open menu")}
              aria-expanded={menuOpen}
              className="inline-flex h-8 w-8 items-center justify-center border border-border text-green transition-colors hover:border-brass lg:hidden">
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* 第二层：当前体系内的功能页（章） */}
      {!chooser && (
        <div className="hidden border-t border-border bg-paper-deep/45 lg:block">
          <div className="container flex h-11 items-center justify-between gap-4">
            <nav
              className="flex min-w-0 items-center gap-1"
              aria-label={t("主导航", "Primary navigation")}>
              <span className="almanac-index mr-2 shrink-0 text-brass">
                {current === "alevel" ? "02" : "01"}
              </span>
              {sectionNav.map((item) => {
                const active = path === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative whitespace-nowrap px-2.5 py-2.5 text-[0.8125rem] transition-colors duration-150",
                      active ? "text-green" : "text-muted-foreground hover:text-green",
                    )}>
                    {lang === "zh" ? item.zh : item.en}
                    {item.href === shortlistHref && count > 0 && (
                      <span className="score ml-1 border border-brass/60 bg-brass/12 px-1 text-[0.625rem] text-[oklch(0.42_0.07_74)]">
                        {count}
                      </span>
                    )}
                    {active && <span className="absolute inset-x-2.5 bottom-0 h-[2px] bg-brass" />}
                  </Link>
                );
              })}
            </nav>
            <details className="group relative shrink-0">
              <summary className="flex list-none cursor-pointer items-center gap-1 whitespace-nowrap py-2 text-[0.8125rem] text-muted-foreground transition-colors hover:text-green">
                {t("更多", "More")}
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="absolute right-0 top-full z-50 mt-1 min-w-36 border border-border bg-paper p-1.5 shadow-[0_12px_24px_oklch(0.2_0.02_90_/_0.14)]">
                <Link
                  href={BROCHURE.href}
                  className="block whitespace-nowrap px-3 py-2 text-[0.8125rem] text-muted-foreground transition-colors hover:bg-paper-deep hover:text-green">
                  {lang === "zh" ? BROCHURE.zh : BROCHURE.en}
                </Link>
              </div>
            </details>
          </div>
        </div>
      )}

      {/* 手机目录：按体系分组，当前体系展开在前 */}
      {!chooser && menuOpen && (
        <div className="menu-open absolute inset-x-0 top-full max-h-[calc(100dvh-3.75rem)] overflow-y-auto border-b border-border bg-paper shadow-[0_14px_28px_oklch(0.2_0.02_90_/_0.12)] lg:hidden">
          <nav className="container py-3" aria-label={t("主导航", "Primary navigation")}>
            {(
              [
                { id: "wace", no: "01", label: "WACE", items: WACE_NAV },
                { id: "alevel", no: "02", label: "A-Level", items: ALEVEL_NAV },
              ] as const
            )
              .slice()
              .sort((a) => (a.id === current ? -1 : 1))
              .map((group) => (
                <section key={group.id} className="mb-2">
                  <p className="flex items-baseline gap-2 border-b border-brass/40 pb-2 pt-2">
                    <span className="almanac-index text-brass">{group.no}</span>
                    <span className="text-[0.8125rem] tracking-[0.08em] text-green">{group.label}</span>
                    {group.id === current && (
                      <span className="ml-auto text-[0.625rem] tracking-[0.12em] text-brass">
                        {t("当前", "Current")}
                      </span>
                    )}
                  </p>
                  <div className="flex flex-col">
                    {group.items.map((item) => {
                      const active = path === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className={cn(
                            "flex items-center justify-between gap-3 border-b border-border py-2.5 pl-7 pr-1 text-[0.9375rem]",
                            active ? "text-green" : "text-muted-foreground hover:text-green",
                          )}>
                          <span className="min-w-0">
                            <span className="block">{lang === "zh" ? item.zh : item.en}</span>
                            <span className="mt-0.5 block text-[0.6875rem] leading-relaxed text-muted-foreground">
                              {lang === "zh" ? item.noteZh : item.noteEn}
                            </span>
                          </span>
                          {item.href === shortlistHref && count > 0 && (
                            <span className="score shrink-0 border border-brass/60 bg-brass/12 px-1.5 text-[0.6875rem] text-[oklch(0.42_0.07_74)]">
                              {count}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </section>
              ))}
            <Link
              href={BROCHURE.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 border-t border-border py-3 text-[0.875rem] text-muted-foreground hover:text-green">
              <span className="almanac-index text-brass">03</span>
              {lang === "zh" ? BROCHURE.zh : BROCHURE.en}
            </Link>
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
              "博林国际学院为 WACE 与 Cambridge A-Level 学生提供升学门槛查询与选课决策支持。本工具的所有要求均引自各校官方招生页面，用于规划参考。",
              "Brentvale College International provides WACE and Cambridge A-Level students with admission lookups and subject-selection guidance. All requirements are drawn from official university admissions pages and are intended for planning reference.",
            )}
          </p>
        </div>
        <nav aria-label={t("常用工具", "Quick tools")}>
          <h3 className="eyebrow text-brass-soft">{t("常用工具", "Quick tools")}</h3>
          <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4 text-[0.875rem] text-paper/80">
            {(
              [
                { label: "WACE", home: "/wace", nav: WACE_NAV },
                { label: "A-Level", home: "/alevel", nav: ALEVEL_NAV },
              ] as const
            ).map((group) => (
              <div key={group.label}>
                <p className="text-[0.6875rem] tracking-[0.14em] text-brass-soft">{group.label}</p>
                <ul className="mt-2 space-y-2">
                  {/* 只列各体系特有的工具；共享的目标清单单独提到下方，避免同一份数据出现两次 */}
                  {group.nav
                    .filter((item) => item.href !== `${group.home}/shortlist`)
                    .map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className="hover:text-brass-soft">
                          {lang === "zh" ? item.zh : item.en}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-paper/15 pt-4">
            <p className="text-[0.6875rem] tracking-[0.14em] text-brass-soft">
              {t("两套体系共用", "Shared across both")}
            </p>
            <Link
              href="/wace/shortlist"
              className="mt-2 inline-flex items-center gap-1.5 text-[0.875rem] text-paper/80 hover:text-brass-soft">
              {t("我的目标清单", "My shortlist")}
              {count > 0 && (
                <span className="score border border-brass-soft/50 bg-brass-soft/10 px-1 text-[0.625rem] text-brass-soft">
                  {count}
                </span>
              )}
            </Link>
          </div>
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
                "排名引自 QS 世界大学排名 2027（2026 年 6 月发布），仅供参考",
                "Ranks cited from QS World University Rankings 2027 (published June 2026), for reference only",
              )}
            </li>
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
              "© 2026 博林国际学院 Brentvale College International · 招生与升学指导办公室",
              "© 2026 Brentvale College International · Admissions & Careers Office",
            )}
          </span>
          <span className="score">{t("最后核验：2026 年 8 月", "Last verified: August 2026")}</span>
        </div>
      </div>
    </footer>
  );
}
