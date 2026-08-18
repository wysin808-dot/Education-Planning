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

  /**
   * 标签避让：先合并同分标记，再按分数排序，为水平距离过近的相邻标记
   * 分配不同的垂直层级，避免文字互相压盖。
   */
  const laidOut = useMemo(() => {
    /** 同一分数的多个标记合并为一条，标签用逗号连接 */
    const merged = new Map<number, { label: string; value: number; tone?: RuleMarker["tone"] }>();
    for (const m of markers) {
      const existing = merged.get(m.value);
      if (existing) {
        // 已有同分标记时，仅追加名称部分，避免重复展示分数
        existing.label = `${existing.label} / ${m.label.replace(String(m.value), "").trim()}`.trim();
      } else {
        merged.set(m.value, { ...m });
      }
    }
    const sorted = Array.from(merged.values()).sort((a, b) => a.value - b.value);
    /**
     * 相邻标记百分比差小于该值时下移一层。窄屏下同样的百分比对应的
     * 像素宽度更小，标签更容易压盖，因此使用更大的避让阈值。
     */
    const narrow = typeof window !== "undefined" && window.innerWidth < 640;
    const MIN_GAP = narrow ? 26 : 11;
    const LEVELS = narrow ? 4 : 3;
    const out: { label: string; value: number; tone?: RuleMarker["tone"]; level: number }[] = [];
    for (const m of sorted) {
      const pct = toPercent(m.value);
      let level = 0;
      // 找到与已放置标记不冲突的最低层级
      while (
        level < LEVELS - 1 &&
        out.some((o) => o.level === level && Math.abs(toPercent(o.value) - pct) < MIN_GAP)
      ) {
        level += 1;
      }
      out.push({ ...m, level });
    }
    return out;
  }, [markers]);

  /** 标签占用的层数决定顶部预留高度 */
  const usedLevels = laidOut.reduce((max, m) => Math.max(max, m.level + 1), 1);
  const topPad = 2 + (usedLevels - 1) * 13;

  return (
    <div className={cn("w-full select-none", className)}>
      <div className="relative" style={{ height: `${76 + (usedLevels - 1) * 13}px` }}>
        {/* 刻度基线 */}
        <div className="absolute inset-x-0 h-px bg-ink/35" style={{ top: `${topPad + 34}px` }} />
        {/* 刻度 */}
        {ticks.map((t) => (
          <div
            key={t.value}
            className="absolute"
            style={{ left: `${toPercent(t.value)}%`, top: `${topPad + 34}px` }}>
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
        {/* 门槛标记：错层排布避免标签重叠 */}
        {laidOut.map((m, i) => (
          <div
            key={`${m.label}-${m.value}-${i}`}
            className="absolute"
            style={{
              left: `${toPercent(m.value)}%`,
              top: `${topPad + m.level * 13}px`,
            }}>
            <div
              className={cn(
                "h-full w-px border-l border-dashed",
                m.tone === "green" ? "border-green" : m.tone === "muted" ? "border-ink/30" : "border-brass",
              )}
              style={{ height: `${34 - m.level * 13}px` }}
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
            className="absolute transition-[left] duration-[240ms]"
            style={{
              left: `${toPercent(atar)}%`,
              top: `${topPad + 22}px`,
              transitionTimingFunction: "var(--ease-out)",
            }}>
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
