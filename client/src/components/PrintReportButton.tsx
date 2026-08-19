/**
 * Admissions Almanac：动态查询报告必须保留浏览器原生打印排版。
 * 手机端不生成截图式 PDF，以免表格、中文字体和分页发生变形；改为明确告知用户
 * 通过浏览器系统菜单的“打印 / 存储为 PDF”完成导出。
 */
import { Printer } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LangContext";

export function PrintReportButton({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { t } = useLang();

  function handlePrint() {
    const mobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    if (mobile) {
      toast.message(
        t("请用浏览器菜单打印或存储为 PDF", "Use your browser menu to print or save as PDF"),
        {
          description: t(
            "点击浏览器的“分享”或“⋯”，选择“打印”，再选“存储为 PDF”。动态报告将保持原生表格与分页版式。",
            "Open Share or the ⋯ menu, choose Print, then Save as PDF. This preserves the native table and page layout.",
          ),
          duration: 9000,
        },
      );
      return;
    }
    window.print();
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      className={cn(
        "no-print inline-flex items-center gap-1.5 border border-green bg-green text-primary-foreground transition-colors duration-150 hover:bg-green-soft",
        compact ? "px-3 py-1.5 text-[0.8125rem]" : "px-4 py-2.5 text-[0.875rem]",
        className,
      )}>
      <Printer className="h-3.5 w-3.5" />
      {t("打印 / 存为 PDF", "Print / Save PDF")}
    </button>
  );
}
