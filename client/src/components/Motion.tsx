/**
 * 设计风格：Admissions Almanac
 * 动效基础层：动效应当像「翻阅纸页」，而非界面特效。
 * 统一约束：只动 opacity 与 transform；位移 ≤ 10px；时长 ≤ 320ms；一律 ease-out。
 * 所有组件在 prefers-reduced-motion 与打印时都必须退化为静态最终态，
 * 因此默认渲染即为可见状态，动效仅由 JS 在运行时附加。
 */
import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** 用户是否要求减少动效，或当前处于打印场景 */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * 滚动浮现：元素进入视口时轻微上浮显现。
 * 只触发一次，避免家长上下滚动查阅时反复闪动。
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<"idle" | "pending" | "shown">("idle");

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const node = ref.current;
    if (!node) return;

    // 已在视口内的首屏内容直接显示，不做浮现，避免刷新时首屏闪烁
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      setState("shown");
      return;
    }

    setState("pending");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            window.setTimeout(() => setState("shown"), delay);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag
      ref={ref}
      className={cn("reveal", className)}
      data-reveal={state === "idle" ? undefined : state}>
      {children}
    </Tag>
  );
}

/**
 * 错落容器：子元素按顺序依次浮现。
 * 用于目录条目、方案科目、结果卡片等同级列表。
 */
export function Stagger({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return <Tag className={cn("stagger", className)}>{children}</Tag>;
}

/**
 * 结果切换：查询条件改变时，结果区整体轻微换页。
 * 通过 key 变化重新挂载触发，key 应取当前查询条件的组合。
 */
export function Swap({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return <Tag className={cn("swap", className)}>{children}</Tag>;
}

/**
 * 数字滚动：统计数字从 0 递增到目标值。
 * 仅用于首页等展示性数字；查询结果中的分数不做滚动，
 * 以免家长在读数过程中看到不存在的中间值。
 */
export function CountUp({
  value,
  className,
  duration = 900,
  decimals = 0,
}: {
  value: number;
  className?: string;
  duration?: number;
  decimals?: number;
}) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    let start = 0;
    const run = () => {
      const step = (now: number) => {
        if (!start) start = now;
        const progress = Math.min((now - start) / duration, 1);
        // ease-out：起步快、收尾稳，与页面其余动效的缓动一致
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(value * eased);
        if (progress < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setDisplay(0);
            run();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display.toFixed(decimals)}
    </span>
  );
}

/**
 * 数字翻动：数值更新时做一次性强调，不经过中间值。
 * 用于反查页的门槛分数等「必须精确」的数字。
 */
export function Tick({ children, className }: { children: ReactNode; className?: string }) {
  const [seq, setSeq] = useState(0);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (prefersReducedMotion()) return;
    setSeq((n) => n + 1);
  }, [children]);

  return (
    <span className={cn("tick", className)} data-tick={seq || undefined} key={seq}>
      {children}
    </span>
  );
}
