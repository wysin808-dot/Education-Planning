/**
 * 设计风格：Admissions Almanac
 * 签名元素「ATAR 标尺」：横向刻度尺 + 铜金门槛虚线 + 学生分数指针。
 * 分数一律使用等宽字体，指针移动使用 240ms transform 过渡。
 */
import { useMemo } from "react";
import { cn } from "@/lib/utils";

/** 标尺显示区间：低于 60 的部分对规划无意义，故从 60 起 */
const MIN = 60;
const MAX = 100;

function toPercent(value: number) {
  const clamped = Math.min(MAX, Math.max(MIN, value));
  return ((clamped - MIN) / (MAX - MIN)) * 100;
}

export interface RuleMarker {
  label: string;
  value: number;
  tone?: "brass" | "green" | "muted";
}

export function ScoreRule({
  atar,
  markers = [],
  className,
  showPointer = true,
}: {
  atar?: number;
  markers?: RuleMarker[];
  className?: string;
  showPointer?: boolean;
}) {
  const ticks = useMemo(() => {
    const out: { value: number; major: boolean }[] = [];
    for (let v = MIN; v <= MAX; v += 2) {
      out.push({ value: v, major: v % 10 === 0 });
    }
    return out;
  }, []);

  return (
    <div className={cn("w-full select-none", className)}>
      <div className="relative h-20">
        {/* 刻度基线 */}
        <div className="absolute inset-x-0 top-9 h-px bg-ink/35" />
        {/* 刻度 */}
        {ticks.map((t) => (
          <div
            key={t.value}
            className="absolute top-9"
            style={{ left: `${toPercent(t.value)}%` }}>
            <div
              className={cn("w-px bg-ink/35", t.major ? "h-3" : "h-1.5")}
              style={{ marginLeft: "-0.5px" }}
            />
            {t.major && (
              <span className="score absolute left-1/2 top-4 -translate-x-1/2 text-[0.625rem] text-muted-foreground">
                {t.value}
              </span>
            )}
          </div>
        ))}
        {/* 门槛标记 */}
        {markers.map((m, i) => (
          <div
            key={`${m.label}-${m.value}-${i}`}
            className="absolute top-0 h-9"
            style={{ left: `${toPercent(m.value)}%` }}>
            <div
              className={cn(
                "h-full w-px border-l border-dashed",
                m.tone === "green" ? "border-green" : m.tone === "muted" ? "border-ink/30" : "border-brass",
              )}
            />
            <span
              className={cn(
                "absolute -top-0.5 left-1.5 whitespace-nowrap text-[0.625rem] tracking-wide",
                m.tone === "green" ? "text-green" : m.tone === "muted" ? "text-muted-foreground" : "text-brass",
              )}>
              {m.label}
            </span>
          </div>
        ))}
        {/* 学生分数指针 */}
        {showPointer && typeof atar === "number" && (
          <div
            className="absolute top-6 transition-[left] duration-[240ms]"
            style={{ left: `${toPercent(atar)}%`, transitionTimingFunction: "var(--ease-out)" }}>
            <div className="relative -translate-x-1/2">
              <div className="h-0 w-0 border-x-[6px] border-t-[8px] border-x-transparent border-t-green" />
              <div className="absolute left-1/2 top-2 h-8 w-px -translate-x-1/2 bg-green" />
              <div className="absolute left-1/2 top-[2.6rem] -translate-x-1/2 whitespace-nowrap bg-green px-2 py-0.5">
                <span className="score text-[0.6875rem] font-medium text-primary-foreground">
                  {atar.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
