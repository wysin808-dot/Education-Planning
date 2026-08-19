/**
 * 设计风格：Admissions Almanac
 * 收藏按钮：细线边框加铜金填充，收藏后以实心书签图标标记，不使用大圆角与阴影。
 */
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/contexts/LangContext";
import { useShortlist } from "@/contexts/ShortlistContext";
import { cn } from "@/lib/utils";

export function ShortlistButton({
  universityId,
  programmeId,
  label,
  variant = "icon",
  className,
}: {
  universityId: string;
  programmeId: string;
  /** 提示文案中显示的专业名，便于家长确认操作对象 */
  label: string;
  variant?: "icon" | "full";
  className?: string;
}) {
  const { t } = useLang();
  const { has, toggle } = useShortlist();
  const on = has(universityId, programmeId);

  function handleClick() {
    toggle(universityId, programmeId);
    toast(
      on
        ? t(`已从目标清单移除：${label}`, `Removed from shortlist: ${label}`)
        : t(`已加入目标清单：${label}`, `Added to shortlist: ${label}`),
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={on}
      title={on ? t("从目标清单移除", "Remove from shortlist") : t("加入目标清单", "Add to shortlist")}
      className={cn(
        "no-print inline-flex shrink-0 items-center gap-1.5 border px-2 py-1 text-[0.6875rem] transition-colors duration-150",
        on
          ? "border-brass bg-brass/12 text-[oklch(0.42_0.07_74)]"
          : "border-input text-muted-foreground hover:border-brass hover:text-green",
        className,
      )}>
      {on ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
      {variant === "full" && (on ? t("已收藏", "Saved") : t("收藏", "Save"))}
    </button>
  );
}
