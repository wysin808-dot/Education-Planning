/**
 * Admissions Almanac：Cambridge A-Level 的 Offer Grade Rule。
 * 用 A*A*A → good passes / 顾问复核替代 WACE 的 ATAR Score Rule，保留等级、门槛线与等宽数据语法。
 */
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LangContext";

const BANDS = [
  { grade: "A*A*A", zh: "顶尖竞争条件", en: "Highest competitive offers", tone: "text-green" },
  { grade: "AAA", zh: "高要求条件", en: "High-entry offers", tone: "text-green" },
  { grade: "AAB", zh: "常见公开条件", en: "Common published offers", tone: "text-[oklch(0.47_0.07_74)]" },
  { grade: "ABB", zh: "较宽选择区间", en: "Broader option range", tone: "text-tier-target" },
  { grade: "good passes", zh: "最低资格或顾问复核", en: "Minimum qualification or review", tone: "text-tier-reach" },
] as const;

export function OfferGradeRule({ compact = false, className }: { compact?: boolean; className?: string }) {
  const { lang, t } = useLang();
  return (
    <section className={cn("border-y border-border py-4", className)} aria-label={t("A-Level 录取条件等级标尺", "A-Level offer-grade rule")}>
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow text-brass">{t("Offer Grade Rule", "Offer Grade Rule")}</p>
        <p className="text-right text-[0.6875rem] text-muted-foreground">{t("公开条件与顾问复核", "Published conditions and adviser review")}</p>
      </div>
      <div className={cn("mt-3 grid gap-px bg-border", compact ? "grid-cols-5" : "grid-cols-1 sm:grid-cols-5")}>
        {BANDS.map((band, index) => (
          <div key={band.grade} className="relative bg-paper px-2.5 py-2.5">
            {index === 2 && <span className="absolute inset-y-0 left-0 border-l border-dashed border-brass" />}
            <p className={cn("score text-[0.9375rem]", band.tone)}>{band.grade}</p>
            {!compact && <p className="mt-1 min-h-8 text-[0.6875rem] leading-snug text-muted-foreground">{lang === "zh" ? band.zh : band.en}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
