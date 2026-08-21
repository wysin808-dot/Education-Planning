/**
 * 设计风格：Admissions Almanac
 *
 * 版面插图（Plates）。取代原先三张摄影式配图，理由见 ideas.md：
 * 「数据语法优先于摄影」——标尺、门槛虚线、等宽数字与名录条目才是本站的装饰语言，
 * 摄影只能提供气氛，且无法随数据更新、无法在打印稿上保持清晰。
 *
 * 三张插图各有分工，且刻意不与首页既有小节重复：
 *  - AlmanacPlate  扉页：品牌与版本口径，用于首屏（01 节已有标尺，故此处不画标尺数据）
 *  - HandoutPlate  讲义示意：说明查询结果可打印成什么样，承接该节「可打印为纸质讲义」的说明
 *  - BrochureBanner 宣传册封面横幅：深墨绿底的封面版式
 *
 * 全部为内联 SVG：随主题变量取色、打印不失真、无外部依赖，也不占用图片请求。
 */
import { REGIONS, UNIVERSITIES } from "@/data/universities";
import { useLang } from "@/contexts/LangContext";

const CREST = "/brand/bci-crest.png";

/** 标尺刻度：60–100，与 ScoreRule 的区间一致 */
function ruleTicks(x0: number, x1: number, y: number) {
  const ticks = [];
  for (let v = 60; v <= 100; v += 2) {
    const t = (v - 60) / 40;
    const x = x0 + (x1 - x0) * t;
    const major = v % 10 === 0;
    ticks.push(
      <line
        key={v}
        x1={x}
        x2={x}
        y1={y}
        y2={y + (major ? 9 : 5)}
        stroke="currentColor"
        strokeWidth={major ? 1 : 0.6}
        opacity={major ? 0.75 : 0.4}
      />,
    );
  }
  return ticks;
}

/**
 * 扉页：首屏右栏。
 * 竖向构图，底部留出空间承接页面上压着的引文条。
 */
export function AlmanacPlate({ className }: { className?: string }) {
  const { t, lang } = useLang();
  const counts = REGIONS.map((r) => ({
    label: lang === "zh" ? r.label : r.labelEn,
    n: UNIVERSITIES.filter((u) => u.region === r.id).length,
  }));

  return (
    <div className={className}>
      <svg
        viewBox="0 0 420 620"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full text-green"
        role="img"
        aria-label={t(
          "招生年鉴扉页：院校与专业总量、四大地区名录与分数标尺",
          "The almanac title plate: totals for universities and programmes, the four regions and the score rule",
        )}>
        <rect width="420" height="620" fill="var(--paper-deep)" />

        {/* 版心细线框 */}
        <rect
          x="26"
          y="26"
          width="368"
          height="568"
          fill="none"
          stroke="var(--brass)"
          strokeWidth="0.8"
          opacity="0.55"
        />
        <rect
          x="33"
          y="33"
          width="354"
          height="554"
          fill="none"
          stroke="var(--brass)"
          strokeWidth="0.4"
          opacity="0.35"
        />

        {/* 徽章 */}
        <image href={CREST} x="178" y="66" width="64" height="64" />

        {/* 标题 */}
        <text
          x="210"
          y="168"
          textAnchor="middle"
          fill="var(--green)"
          style={{ font: '600 27px var(--font-display)', letterSpacing: '0.02em' }}>
          {t("招生年鉴", "Admissions")}
        </text>
        <text
          x="210"
          y="200"
          textAnchor="middle"
          fill="var(--green)"
          style={{ font: '600 27px var(--font-display)', letterSpacing: '0.02em' }}>
          {t("升学门槛卷", "Almanac")}
        </text>

        <line x1="120" y1="222" x2="300" y2="222" stroke="var(--brass)" strokeWidth="0.9" />
        <circle cx="210" cy="222" r="2.6" fill="var(--brass)" />

        <text
          x="210"
          y="248"
          textAnchor="middle"
          fill="var(--brass)"
          style={{ font: '400 11px var(--font-mono)', letterSpacing: '0.22em' }}>
          2026 – 27
        </text>

        {/* 总量：等宽数字，年鉴的主角 */}
        <g>
          <text
            x="210"
            y="316"
            textAnchor="middle"
            fill="var(--green)"
            style={{ font: '400 54px var(--font-mono)' }}>
            {UNIVERSITIES.length}
            <tspan
              dx="10"
              style={{ font: '400 15px var(--font-sans)', letterSpacing: '0.16em' }}
              fill="var(--ink)">
              {t("所院校", "UNIVERSITIES")}
            </tspan>
          </text>
          <text
            x="210"
            y="360"
            textAnchor="middle"
            fill="var(--green)"
            style={{ font: '400 34px var(--font-mono)' }}>
            {UNIVERSITIES.reduce((s, u) => s + u.programmes.length, 0)}
            <tspan
              dx="10"
              style={{ font: '400 13px var(--font-sans)', letterSpacing: '0.16em' }}
              fill="var(--ink)">
              {t("条专业", "PROGRAMMES")}
            </tspan>
          </text>
        </g>

        {/* 四大地区名录 */}
        <g transform="translate(0,404)">
          <line x1="60" y1="0" x2="360" y2="0" stroke="var(--border)" strokeWidth="1" />
          {counts.map((c, i) => (
            <g key={c.label} transform={`translate(0,${20 + i * 25})`}>
              <text
                x="60"
                y="0"
                fill="var(--brass)"
                style={{ font: '400 9.5px var(--font-mono)', letterSpacing: '0.14em' }}>
                {String(i + 1).padStart(2, "0")}
              </text>
              <text x="84" y="0" fill="var(--ink)" style={{ font: '400 12.5px var(--font-serif)' }}>
                {c.label}
              </text>
              <text
                x="360"
                y="0"
                textAnchor="end"
                fill="var(--green)"
                style={{ font: '400 12px var(--font-mono)' }}>
                {c.n}
              </text>
            </g>
          ))}
        </g>

        {/* 标尺母题 */}
        <g transform="translate(0,536)" className="text-green">
          <line x1="60" y1="0" x2="360" y2="0" stroke="var(--green)" strokeWidth="1" />
          {ruleTicks(60, 360, 0)}
          <text
            x="60"
            y="26"
            fill="var(--ink)"
            opacity="0.7"
            style={{ font: '400 9px var(--font-mono)' }}>
            60
          </text>
          <text
            x="360"
            y="26"
            textAnchor="end"
            fill="var(--ink)"
            opacity="0.7"
            style={{ font: '400 9px var(--font-mono)' }}>
            100
          </text>
          <text
            x="210"
            y="26"
            textAnchor="middle"
            fill="var(--brass)"
            style={{ font: '400 9px var(--font-mono)', letterSpacing: '0.2em' }}>
            ATAR
          </text>
        </g>
      </svg>
    </div>
  );
}

/**
 * 讲义示意：说明一份查询结果打印出来长什么样。
 * 只画版式骨架，不写具体院校与分数，避免与真实数据不同步。
 */
export function HandoutPlate({ className }: { className?: string }) {
  const { t } = useLang();
  const rows = [0, 1, 2, 3, 4, 5];

  return (
    <div className={className}>
      <svg
        viewBox="0 0 420 300"
        className="h-auto w-full"
        role="img"
        aria-label={t(
          "查询结果打印稿示意：页眉、分数标尺与院校名录条目",
          "A sketch of a printed result sheet: header, score rule and university index entries",
        )}>
        <rect width="420" height="300" fill="var(--paper-deep)" />

        {/* 纸张 */}
        <g>
          <rect x="46" y="22" width="328" height="256" fill="var(--paper)" stroke="var(--border)" />
          {/* 页眉 */}
          <image href={CREST} x="62" y="38" width="18" height="18" />
          <text x="88" y="51" fill="var(--green)" style={{ font: '600 10px var(--font-display)', letterSpacing: '0.1em' }}>
            BRENTVALE
          </text>
          <text
            x="358"
            y="51"
            textAnchor="end"
            fill="var(--brass)"
            style={{ font: '400 8px var(--font-mono)', letterSpacing: '0.14em' }}>
            2026 – 27
          </text>
          <line x1="62" y1="64" x2="358" y2="64" stroke="var(--brass)" strokeWidth="0.8" />

          {/* 标尺 */}
          <g transform="translate(0,96)" className="text-green">
            <line x1="62" y1="0" x2="358" y2="0" stroke="var(--green)" strokeWidth="0.9" />
            {ruleTicks(62, 358, 0)}
            {/* 门槛虚线与指针 */}
            <line
              x1="270"
              y1="-16"
              x2="270"
              y2="12"
              stroke="var(--brass)"
              strokeWidth="0.9"
              strokeDasharray="3 3"
            />
            <polygon points="240,-14 245,-6 235,-6" fill="var(--green)" />
          </g>

          {/* 名录条目 */}
          <g transform="translate(0,140)">
            {rows.map((i) => (
              <g key={i} transform={`translate(0,${i * 22})`}>
                <text
                  x="62"
                  y="0"
                  fill="var(--brass)"
                  style={{ font: '400 7.5px var(--font-mono)', letterSpacing: '0.12em' }}>
                  {String(i + 1).padStart(2, "0")}
                </text>
                <rect x="80" y="-7" width={132 - i * 9} height="5" rx="1" fill="var(--ink)" opacity="0.5" />
                <rect x="80" y="1" width={96 - i * 6} height="4" rx="1" fill="var(--ink)" opacity="0.22" />
                <rect x="330" y="-7" width="28" height="6" rx="1" fill="var(--green)" opacity="0.55" />
                <line x1="62" y1="10" x2="358" y2="10" stroke="var(--border)" strokeWidth="0.6" />
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}

/**
 * 宣传册封面横幅：深墨绿底、反白徽章与标尺母题。
 * 页面在其上叠加标题，故构图重心偏左上，右下留白。
 */
export function BrochureBanner({ className }: { className?: string }) {
  const { t } = useLang();
  return (
    <div className={className}>
      <svg
        viewBox="0 0 900 320"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        role="img"
        aria-label={t("宣传册封面横幅", "Brochure cover banner")}>
        <rect width="900" height="320" fill="var(--green)" />

        {/* 细线网格：年鉴的版心质感 */}
        <g stroke="var(--brass)" strokeWidth="0.4" opacity="0.24">
          {Array.from({ length: 11 }, (_, i) => (
            <line key={`v${i}`} x1={i * 90} y1="0" x2={i * 90} y2="320" />
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 80} x2="900" y2={i * 80} />
          ))}
        </g>

        {/* 反白徽章 */}
        <image href="/brand/bci-crest-white.png" x="700" y="85" width="150" height="150" opacity="0.95" />

        {/*
         * 标尺母题置于上缘：页面会在本横幅的左下角叠加宣传册标题，
         * 底部必须留空，否则标尺会被标题压住。
         */}
        <g transform="translate(0,58)" className="text-paper">
          <text
            x="60"
            y="-14"
            fill="var(--brass-soft)"
            style={{ font: '400 10px var(--font-mono)', letterSpacing: '0.24em' }}>
            ATAR 60 — 100
          </text>
          <line x1="60" y1="0" x2="600" y2="0" stroke="var(--paper)" strokeWidth="1" opacity="0.75" />
          <g opacity="0.7" color="var(--paper)">{ruleTicks(60, 600, 0)}</g>
        </g>
      </svg>
    </div>
  );
}
