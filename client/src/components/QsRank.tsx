/**
 * QS 排名展示 · Admissions Almanac
 *
 * 年鉴风格：排名是「名录条目编号」，不是营销标签。因此一律用等宽数字（--font-mono）、
 * 铜金色细体，配合极小号 QS 字样，置于院校名一侧，不做徽章、不做色块、不抢门槛分数的位置。
 * 排名只是参考坐标，门槛与先修才是这份年鉴的主角。
 *
 * 未列入 QS 世界排名的院校（SIT、SUSS）显式写明，不留空、不用「—」含糊带过，
 * 以免家长误以为是数据缺失或排名极低。
 */
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LangContext";
import { QS_EDITION, qsFor } from "@/data/qs";

type Props = {
  universityId: string;
  /** inline 用于列表与卡片；block 用于详情页的口径行 */
  variant?: "inline" | "block";
  className?: string;
};

export function QsRank({ universityId, variant = "inline", className }: Props) {
  const { t } = useLang();
  const entry = qsFor(universityId);

  if (!entry) return null;

  if (entry.rank === null) {
    return (
      <span
        className={cn(
          "text-[0.6875rem] leading-none text-muted-foreground/70",
          variant === "block" && "text-[0.75rem]",
          className,
        )}
        title={t("该校未进入 QS 世界大学排名榜单", "Not listed in the QS World University Rankings")}
      >
        {t("未列入 QS 世界排名", "Not in QS World Rankings")}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-1 whitespace-nowrap leading-none",
        className,
      )}
      title={t(
        `${QS_EDITION.labelZh} 第 ${entry.display} 位（${QS_EDITION.publishedZh}）`,
        `${QS_EDITION.labelEn}: ${entry.display} (${QS_EDITION.publishedEn})`,
      )}
    >
      <span
        className={cn(
          "eyebrow text-brass",
          variant === "block" ? "text-[0.6875rem]" : "text-[0.625rem]",
        )}
      >
        QS
      </span>
      <span
        className={cn(
          "score text-green",
          variant === "block" ? "text-[0.9375rem]" : "text-[0.8125rem]",
        )}
      >
        {entry.display}
      </span>
    </span>
  );
}

/** 页面底部或口径区使用的版本说明，避免每页各写一遍。 */
export function QsEditionNote({ className }: { className?: string }) {
  const { lang } = useLang();
  return (
    <span className={cn("text-[0.6875rem] leading-relaxed text-muted-foreground", className)}>
      {lang === "zh"
        ? `排名口径：${QS_EDITION.labelZh}（${QS_EDITION.publishedZh}），仅作参考，不影响录取门槛。`
        : `Ranking source: ${QS_EDITION.labelEn} (${QS_EDITION.publishedEn}). For reference only; it does not affect entry requirements.`}
    </span>
  );
}
