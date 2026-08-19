/** Admissions Almanac：双课程体系入口，保持 WACE 与 Cambridge A-Level 的边界清晰。 */
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LangContext";

export function CurriculumSwitch({ active, className }: { active: "wace" | "alevel"; className?: string }) {
  const { t } = useLang();
  return (
    <div className={cn("no-print inline-flex border border-border bg-paper-deep/40 p-1", className)} aria-label={t("课程体系切换", "Curriculum switcher")}>
      <Link
        href="/"
        className={cn("px-3 py-1.5 text-[0.75rem] transition-colors", active === "wace" ? "bg-green text-primary-foreground" : "text-muted-foreground hover:text-green")}>
        WACE
      </Link>
      <Link
        href="/alevel"
        className={cn("px-3 py-1.5 text-[0.75rem] transition-colors", active === "alevel" ? "bg-green text-primary-foreground" : "text-muted-foreground hover:text-green")}>
        Cambridge A-Level
      </Link>
    </div>
  );
}

const ALEVEL_LINKS = [
  { href: "/alevel", zh: "总览", en: "Overview" },
  { href: "/alevel/forward", zh: "预测成绩查院校", en: "Grades → Universities" },
  { href: "/alevel/reverse", zh: "院校专业查条件", en: "Programme → Requirements" },
  { href: "/alevel/subjects", zh: "选课规划", en: "Subject Planner" },
  { href: "/alevel/table", zh: "31 校速查", en: "31-university table" },
  { href: "/alevel/shortlist", zh: "目标清单", en: "Shortlist" },
];

export function AlevelNav({ active }: { active: string }) {
  const { lang, t } = useLang();
  return (
    <nav aria-label={t("A-Level 导航", "A-Level navigation")} className="no-print mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-3">
      {ALEVEL_LINKS.map((item) => (
        <Link key={item.href} href={item.href} className={cn("border-b pb-0.5 text-[0.75rem] transition-colors", active === item.href ? "border-brass text-green" : "border-transparent text-muted-foreground hover:border-brass hover:text-green")}>
          {lang === "zh" ? item.zh : item.en}
        </Link>
      ))}
    </nav>
  );
}
