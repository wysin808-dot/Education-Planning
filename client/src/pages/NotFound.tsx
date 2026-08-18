/**
 * 设计风格：Admissions Almanac
 * 404 页：纸感底色 + 衬线标题 + 铜金规则线，与全站年鉴排版一致。
 * 不使用模板默认的蓝色渐变与圆角卡片。
 */
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { useLang } from "@/contexts/LangContext";

export default function NotFound() {
  const { t } = useLang();

  const links = [
    { href: "/forward", zh: "按分数查院校", en: "Search by score" },
    { href: "/reverse", zh: "按院校查门槛", en: "Look up a programme" },
    { href: "/subjects", zh: "WACE 选课规划", en: "Subject planner" },
    { href: "/table", zh: "31 校门槛总表", en: "Master table" },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container py-24">
        <span className="almanac-index">404 · NOT FOUND</span>
        <h1 className="mt-2 text-[2.5rem] leading-tight text-green">
          {t("这一页不在年鉴的目录里", "This page is not in the almanac's index")}
        </h1>
        <div className="threshold-hairline mt-5" />
        <p className="mt-6 max-w-[56ch] font-[family-name:var(--font-serif)] text-[1rem] leading-relaxed text-muted-foreground">
          {t(
            "地址可能已经变更，或链接输入有误。可以从下列常用工具重新开始。",
            "The address may have changed, or the link was mistyped. Pick up again from one of the tools below.",
          )}
        </p>
        <ul className="mt-10 max-w-[38rem] divide-y divide-border border-y border-border">
          {links.map((l, i) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="flex items-center justify-between gap-4 py-4 text-[0.9375rem] text-green transition-colors duration-150 hover:text-brass">
                <span className="flex items-baseline gap-3">
                  <span className="almanac-index">{String(i + 1).padStart(2, "0")}</span>
                  {t(l.zh, l.en)}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <SiteFooter />
    </div>
  );
}
