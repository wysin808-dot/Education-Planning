/**
 * 设计风格：Admissions Almanac
 * 打印页眉：仅在导出 PDF 时出现，提供校名、报告标题、数据口径与导出日期，
 * 使打印件脱离网站后仍能自证出处，可直接用于家长面谈留档。
 */
import { useLang } from "@/contexts/LangContext";

const CREST = "/manus-storage/bci-crest_444d5067.png";

export function PrintHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { t, lang } = useLang();
  const exportedAt = new Date().toLocaleDateString(lang === "zh" ? "zh-CN" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="print-header mb-6 border-b-2 border-green pb-3">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src={CREST} alt="Brentvale College International" className="h-10 w-10 object-contain" />
          <div>
            <p className="text-[0.8125rem] font-semibold tracking-[0.12em] text-green">
              BRENTVALE COLLEGE INTERNATIONAL
            </p>
            <p className="text-[0.6875rem] tracking-[0.16em] text-muted-foreground">
              {t("升学指导办公室 · WACE 升学门槛年鉴", "Admissions & Careers Office · WACE Pathways Almanac")}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[0.6875rem] text-muted-foreground">{t("导出日期", "Exported")}</p>
          <p className="score text-[0.8125rem] text-ink">{exportedAt}</p>
        </div>
      </div>
      <div className="mt-3">
        <h1 className="text-[1.25rem] leading-tight text-green">{title}</h1>
        {subtitle && (
          <p className="mt-1 font-[family-name:var(--font-serif)] text-[0.8125rem] leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
