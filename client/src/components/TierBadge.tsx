/**
 * 设计风格：Admissions Almanac
 * 分层标签使用低饱和语义色（砖红/铜金/鼠尾草绿/灰），避免红绿灯式刺眼对比。
 */
import { TIER_META, tierDefinition, tierLabel, type Tier } from "@/lib/matching";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LangContext";

const CLASSES: Record<Tier, string> = {
  safe: "border-tier-safe text-tier-safe bg-tier-safe/8",
  target: "border-tier-target text-[oklch(0.48_0.07_74)] bg-tier-target/10",
  reach: "border-tier-reach text-tier-reach bg-tier-reach/8",
  unknown: "border-tier-unknown text-tier-unknown bg-tier-unknown/8",
};

export function TierBadge({ tier, className }: { tier: Tier; className?: string }) {
  const { lang } = useLang();
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 border px-2 py-0.5 text-[0.6875rem] tracking-[0.08em]",
        CLASSES[tier],
        className,
      )}
      title={tierDefinition(tier, lang)}>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      {tierLabel(tier, lang)}
    </span>
  );
}

export function TierLegend({ className }: { className?: string }) {
  const order: Tier[] = ["safe", "target", "reach", "unknown"];
  const { lang } = useLang();
  return (
    <dl className={cn("divide-y divide-border border-y border-border", className)}>
      {order.map((tier) => (
        <div key={tier} className="flex flex-col gap-1.5 py-3 sm:flex-row sm:items-baseline sm:gap-4">
          <dt className="w-24 shrink-0">
            <TierBadge tier={tier} />
          </dt>
          <dd className="font-[family-name:var(--font-serif)] text-[0.875rem] leading-relaxed text-muted-foreground">
            {tierDefinition(tier, lang)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
