/**
 * 设计风格：Admissions Almanac
 * 本文件包含盾形徽记文字标、顶栏与页脚。深墨绿底 + 铜金细线分隔，字距放宽。
 */
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const MARK_SRC = "/manus-storage/bv-mark_4449a333.png";

export function Wordmark({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const light = variant === "light";
  return (
    <span className="flex items-center gap-3">
      <img
        src={MARK_SRC}
        alt="Brentvale College International 盾形刻度徽记"
        className="h-11 w-11 shrink-0 object-contain"
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-[family-name:var(--font-display)] text-[1.0625rem] font-semibold tracking-[0.16em]",
            light ? "text-paper" : "text-green",
          )}>
          BRENTVALE
        </span>
        <span className={cn("mt-1 h-px w-full", light ? "bg-brass/70" : "bg-brass")} />
        <span
          className={cn(
            "mt-1 text-[0.625rem] tracking-[0.3em]",
            light ? "text-paper/75" : "text-muted-foreground",
          )}>
          WACE 升学规划
        </span>
      </span>
    </span>
  );
}

const NAV = [
  { href: "/", label: "首页" },
  { href: "/forward", label: "分数查院校" },
  { href: "/reverse", label: "院校查门槛" },
  { href: "/subjects", label: "选课规划" },
  { href: "/table", label: "门槛总表" },
  { href: "/brochure", label: "宣传册" },
];

export function SiteHeader() {
  const [path] = useLocation();
  return (
    <header className="no-print sticky top-0 z-40 border-b border-border bg-paper/92 backdrop-blur-md">
      <div className="container flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" className="shrink-0">
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = path === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 text-[0.8125rem] transition-colors duration-150",
                  active ? "text-green" : "text-muted-foreground hover:text-green",
                )}>
                {item.label}
                {active && <span className="absolute inset-x-3 -bottom-px h-[2px] bg-brass" />}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <span className="hidden text-[0.6875rem] tracking-[0.18em] text-muted-foreground xl:inline">
            2026/27 入学数据
          </span>
          <Link
            href="/forward"
            className="border border-green bg-green px-4 py-2 text-[0.8125rem] text-primary-foreground transition-colors duration-150 hover:bg-green-soft">
            开始规划
          </Link>
        </div>
      </div>
      {/* 移动端导航 */}
      <div className="border-t border-border/70 lg:hidden">
        <div className="container flex gap-1 overflow-x-auto py-2">
          {NAV.map((item) => {
            const active = path === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap px-3 py-1.5 text-[0.75rem] transition-colors",
                  active ? "bg-green text-primary-foreground" : "text-muted-foreground",
                )}>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="no-print mt-24 border-t-2 border-green bg-green text-paper">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Wordmark variant="light" />
          <p className="mt-5 max-w-md font-[family-name:var(--font-serif)] text-[0.9375rem] leading-relaxed text-paper/80">
            Brentvale College International 为 WACE 学生提供升学门槛查询与选课决策支持。本工具的所有分数与要求均引自各校官方招生页面，用于规划参考。
          </p>
        </div>
        <div>
          <h3 className="eyebrow text-brass-soft">查询工具</h3>
          <ul className="mt-4 space-y-2.5 text-[0.875rem] text-paper/80">
            <li>
              <Link href="/forward" className="hover:text-brass-soft">
                按 ATAR 查可申请院校
              </Link>
            </li>
            <li>
              <Link href="/reverse" className="hover:text-brass-soft">
                按院校专业查所需分数
              </Link>
            </li>
            <li>
              <Link href="/subjects" className="hover:text-brass-soft">
                WACE 选课规划
              </Link>
            </li>
            <li>
              <Link href="/table" className="hover:text-brass-soft">
                31 校门槛总表
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="eyebrow text-brass-soft">数据说明</h3>
          <ul className="mt-4 space-y-2.5 text-[0.875rem] leading-relaxed text-paper/80">
            <li>覆盖新加坡 6 所、香港 8 所、澳洲 8 所、英国 9 所</li>
            <li>数据对应 2026 与 2027 年入学周期</li>
            <li>门槛为官方最低要求，非录取保证</li>
            <li>申请前请以院校官网最新公告为准</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/15">
        <div className="container flex flex-col gap-2 py-5 text-[0.75rem] text-paper/60 md:flex-row md:items-center md:justify-between">
          <span>© 2026 Brentvale College International · 招生与升学指导办公室</span>
          <span className="score">最后核验：2026 年 8 月</span>
        </div>
      </div>
    </footer>
  );
}
