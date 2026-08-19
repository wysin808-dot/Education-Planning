/**
 * Admissions Almanac：跨平台报告导出。
 * 桌面端采用系统打印以保留用户的纸张与打印机选项；手机端不依赖 window.print，
 * 而是把当前报告区域渲染为 A4 PDF，再优先触发系统分享（iOS/Android）或直接下载。
 */
import { useState } from "react";
import { Download, FileDown, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LangContext";

type PdfExportButtonProps = {
  title: string;
  filename: string;
  className?: string;
  targetSelector?: string;
  compact?: boolean;
};

function mobileLikeDevice() {
  return window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
}

export function PdfExportButton({
  title,
  filename,
  className,
  targetSelector = "[data-pdf-export]",
  compact = false,
}: PdfExportButtonProps) {
  const { t } = useLang();
  const [exporting, setExporting] = useState(false);

  async function exportPdf() {
    if (!mobileLikeDevice()) {
      window.print();
      return;
    }

    // 必须在用户点击的同步阶段打开窗口，否则 iOS/Android 可能在异步渲染后拦截下载或分享。
    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.opener = null;
      previewWindow.document.title = title;
      previewWindow.document.body.innerHTML = `<p style="font-family:system-ui,sans-serif;padding:24px">${t("正在准备 PDF，请返回此页稍候。", "Preparing PDF. Please return to the previous page shortly.")}</p>`;
    }

    const target = document.querySelector<HTMLElement>(targetSelector) ?? document.querySelector<HTMLElement>("main");
    if (!target) {
      previewWindow?.close();
      toast.error(t("未找到可导出的报告内容。", "No report content was found to export."));
      return;
    }

    setExporting(true);
    const loading = toast.loading(t("正在准备 PDF，请停留在此页面…", "Preparing PDF — please keep this page open…"));

    try {
      target.classList.add("pdf-capturing");
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const [{ toPng }, { jsPDF }] = await Promise.all([import("html-to-image"), import("jspdf")]);
      const image = await toPng(target, {
        backgroundColor: "#f5f0e6",
        pixelRatio: 1.25,
        cacheBust: true,
        skipFonts: true,
      });
      const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        const source = new Image();
        source.onload = () => resolve({ width: source.naturalWidth, height: source.naturalHeight });
        source.onerror = () => reject(new Error("Unable to measure the generated PDF image"));
        source.src = image;
      });
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageHeight = (dimensions.height * pageWidth) / dimensions.width;

      let remaining = imageHeight;
      let top = 0;
      while (remaining > 0) {
        pdf.addImage(image, "PNG", 0, top, pageWidth, imageHeight, undefined, "FAST");
        remaining -= pageHeight;
        if (remaining > 0) {
          pdf.addPage();
          top -= pageHeight;
        }
      }

      const safeName = `${filename.replace(/[^a-zA-Z0-9_-]+/g, "-") || "brentvale-wace-report"}.pdf`;
      const blob = pdf.output("blob");
      const file = new File([blob], safeName, { type: "application/pdf" });
      const shareData = { files: [file], title };
      const canShare = typeof navigator.share === "function" && typeof navigator.canShare === "function" && navigator.canShare(shareData);

      if (previewWindow) {
        const url = URL.createObjectURL(blob);
        previewWindow.location.href = url;
        window.setTimeout(() => URL.revokeObjectURL(url), 120000);
        toast.success(t("PDF 已在新窗口打开，可使用浏览器的分享或保存功能。", "PDF is open in a new tab. Use your browser to share or save it."), { id: loading });
      } else if (canShare) {
        try {
          await navigator.share(shareData);
          toast.success(t("PDF 已准备好，可在系统菜单中保存或发送。", "PDF is ready to save or share from the system menu."), { id: loading });
        } catch (error) {
          if ((error as DOMException).name === "AbortError") {
            toast.message(t("已取消系统分享；PDF 仍可再次导出。", "System sharing was cancelled; you can export again anytime."), { id: loading });
          } else {
            pdf.save(safeName);
            toast.success(t("PDF 已下载到设备。", "PDF has been downloaded to your device."), { id: loading });
          }
        }
      } else {
        pdf.save(safeName);
        toast.success(t("PDF 已下载到设备。", "PDF has been downloaded to your device."), { id: loading });
      }
    } catch (error) {
      previewWindow?.close();
      console.error("PDF export failed", error);
      toast.error(
        t(
          "PDF 生成失败。请使用浏览器菜单中的“打印”或“分享”后选择“存储为 PDF”。",
          "PDF generation failed. Use your browser’s Print or Share menu and choose Save as PDF.",
        ),
        { id: loading },
      );
    } finally {
      target.classList.remove("pdf-capturing");
      setExporting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={exportPdf}
      disabled={exporting}
      aria-busy={exporting}
      className={cn(
        "no-print inline-flex items-center gap-1.5 border border-green bg-green text-primary-foreground transition-colors duration-150 hover:bg-green-soft disabled:cursor-wait disabled:opacity-70",
        compact ? "px-3 py-1.5 text-[0.8125rem]" : "px-4 py-2.5 text-[0.875rem]",
        className,
      )}>
      {exporting ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <FileDown className="h-3.5 w-3.5" />}
      {exporting
        ? t("正在生成 PDF…", "Generating PDF…")
        : t("导出 PDF", "Export PDF")}
      {!exporting && !compact && <Download className="h-3.5 w-3.5 opacity-75" />}
    </button>
  );
}
