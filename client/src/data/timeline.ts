/**
 * 设计风格提醒（Admissions Almanac 招生年鉴）
 * 本文件为纯数据层，不含视觉样式。
 *
 * 升学时间轴：从 WACE 考试与正式 ATAR 出分，到新加坡公立大学申请、选拔、
 * 发放 Offer 与入学的全周期节点。依《BCI WACE → 新加坡公立大学升学时间图》规划稿建立。
 *
 * 纪律要求（对应规划稿第八节「系统合规原则」）：
 *
 *  1. 每个时间字段都必须带 precision 口径标记，两者不得混用：
 *     - official   来自院校官网的确切日期，可作为申请排期依据
 *     - indicative BCI 规划稿给出的经验月份，仅供内部排期参考，
 *                  绝不可当作官方日期对家长承诺
 *     界面必须在视觉上区分这两类，绝不能让家长把经验月份读成官方截止日。
 *
 *  2. 未知一律 null，不以经验值填补官方字段。
 *
 *  3. checkedAt 记录最后核验日期。每年新招生周期开放后必须重新核验，
 *     避免把上一年度的截止日期继续展示给家长。
 *
 *  4. 申请窗口沿用 universities.ts 中已逐校核验的官方日期，
 *     不采用规划稿里更粗的「约 12 月—2 月」这类表述——已有更精确的就不退回。
 */

/** 时间节点的口径 */
export type TimelinePrecision = "official" | "indicative";

export interface TimelinePoint {
  zh: string;
  en: string;
  precision: TimelinePrecision;
}

export interface AdmissionTimeline {
  universityId: string;
  applicationOpen: TimelinePoint | null;
  applicationDeadline: TimelinePoint | null;
  /** 面试、笔试、作品集评审等附加选拔的窗口 */
  assessmentWindow: TimelinePoint | null;
  /** Offer 公布窗口 */
  offerWindow: TimelinePoint | null;
  /** 开学月份 */
  matriculation: TimelinePoint | null;
  /** 最后核验日期 */
  checkedAt: string;
}

const official = (zh: string, en: string): TimelinePoint => ({ zh, en, precision: "official" });
const indicative = (zh: string, en: string): TimelinePoint => ({ zh, en, precision: "indicative" });

/**
 * WACE 学年到入学的主周期。
 *
 * 锚点是「12 月取得正式 ATAR」：BCI 的 WACE 学生以最终成绩申请，
 * 不依赖预估成绩（Predicted Grade），这与英国 UCAS 体系有根本区别，
 * 因此家长最关心的不是「几月递交」，而是「12 月出分后到次年 8 月入学之间做什么」。
 */
export interface CycleStage {
  windowZh: string;
  windowEn: string;
  stageZh: string;
  stageEn: string;
  focusZh: string;
  focusEn: string;
}

export const WACE_CYCLE: CycleStage[] = [
  {
    windowZh: "2 月—9 月",
    windowEn: "February – September",
    stageZh: "WACE Year 12",
    stageEn: "WACE Year 12",
    focusZh: "完成学术课程与语言准备，确认专业方向，并提前整理大学申请材料。",
    focusEn: "Complete the academic programme and language preparation, settle the field of study, and assemble application materials early.",
  },
  {
    windowZh: "10 月—11 月",
    windowEn: "October – November",
    stageZh: "WACE 考试",
    stageEn: "WACE examinations",
    focusZh: "完成 WACE 主要考试与校内最终考核。",
    focusEn: "Sit the main WACE examinations and the school's final assessments.",
  },
  {
    windowZh: "12 月",
    windowEn: "December",
    stageZh: "正式成绩",
    stageEn: "Final results",
    focusZh: "取得 WACE 最终成绩与正式 ATAR，以正式成绩进入申请阶段。",
    focusEn: "Receive the final WACE results and the official ATAR, and apply on final results.",
  },
  {
    windowZh: "12 月—3 月",
    windowEn: "December – March",
    stageZh: "大学申请",
    stageEn: "University applications",
    focusZh: "按各校与学历类别的开放与截止时间递交申请。各校窗口不同，见下方名录。",
    focusEn: "Submit applications according to each university's opening and closing dates for the qualification. Windows differ by university; see the register below.",
  },
  {
    windowZh: "3 月—5 月",
    windowEn: "March – May",
    stageZh: "选拔阶段",
    stageEn: "Selection",
    focusZh: "部分专业进行面试、笔试、作品集评审或其他附加考核。",
    focusEn: "Some programmes hold interviews, written tests, portfolio reviews or other additional assessment.",
  },
  {
    windowZh: "4 月—7 月",
    windowEn: "April – July",
    stageZh: "Offer 阶段",
    stageEn: "Offers",
    focusZh: "各校分批公布录取结果；不同院校、专业与申请人的时间并不一致。",
    focusEn: "Universities release outcomes in batches; timing varies by institution, programme and applicant.",
  },
  {
    windowZh: "7 月—8 月",
    windowEn: "July – August",
    stageZh: "入学准备",
    stageEn: "Pre-arrival",
    focusZh: "接受 Offer、办理学生准证与入学手续、安排住宿与课程注册。",
    focusEn: "Accept the offer, arrange the Student's Pass and enrolment formalities, housing and course registration.",
  },
  {
    windowZh: "8 月—9 月",
    windowEn: "August – September",
    stageZh: "大学入学",
    stageEn: "Matriculation",
    focusZh: "新加坡公立大学进入新学年。",
    focusEn: "The Singapore public universities begin the new academic year.",
  },
];

/**
 * 各校招生周期。
 *
 * applicationOpen / applicationDeadline 取自 universities.ts 中逐校核验的官方申请窗口，
 * 标为 official；assessmentWindow / offerWindow / matriculation 目前只有规划稿的经验月份，
 * 一律标为 indicative，界面须显著区分。
 */
export const SG_TIMELINES: AdmissionTimeline[] = [
  {
    universityId: "nus",
    applicationOpen: official("2025 年 12 月 3 日", "3 December 2025"),
    applicationDeadline: official("2026 年 2 月 23 日", "23 February 2026"),
    assessmentWindow: indicative("视专业而定", "Varies by programme"),
    offerWindow: indicative("通常 5 月起陆续公布，最晚批次可至 7 月", "Usually from May in batches, with the last round as late as July"),
    matriculation: indicative("8 月", "August"),
    checkedAt: "2026-08",
  },
  {
    universityId: "ntu",
    applicationOpen: official("2025 年 10 月 15 日", "15 October 2025"),
    applicationDeadline: official("2026 年 1 月 20 日", "20 January 2026"),
    assessmentWindow: indicative("视专业而定", "Varies by programme"),
    offerWindow: indicative("澳洲学历通常 4—6 月陆续公布", "Australian qualifications usually receive outcomes from April to June"),
    matriculation: indicative("8 月", "August"),
    checkedAt: "2026-08",
  },
  {
    universityId: "smu",
    applicationOpen: official("2025 年 11 月 17 日", "17 November 2025"),
    applicationDeadline: official("2026 年 3 月 19 日", "19 March 2026"),
    assessmentWindow: indicative("部分课程约 3—5 月", "Some programmes around March to May"),
    offerWindow: indicative("通常 5—7 月", "Usually May to July"),
    matriculation: indicative("8 月", "August"),
    checkedAt: "2026-08",
  },
  {
    universityId: "sutd",
    applicationOpen: official("2026 年 1 月 2 日", "2 January 2026"),
    applicationDeadline: official("2026 年 3 月 2 日", "2 March 2026"),
    assessmentWindow: indicative("入围后安排 Conversation 或评估", "A conversation or assessment after shortlisting"),
    offerWindow: indicative("通常约 5 月起", "Usually from around May"),
    matriculation: indicative("9 月前后", "Around September"),
    checkedAt: "2026-08",
  },
  {
    universityId: "sit",
    // 官方仅明确截止日期，开放时间为「每年 1 月至 3 月」的概括表述，故开放标为 indicative
    applicationOpen: indicative("每年 1 月起", "From January each year"),
    applicationDeadline: official("2026 年 3 月 19 日", "19 March 2026"),
    assessmentWindow: indicative("部分课程设面试或评估", "Some programmes hold an interview or assessment"),
    offerWindow: indicative("分批公布", "Released in batches"),
    matriculation: indicative("8—9 月", "August to September"),
    checkedAt: "2026-08",
  },
  {
    universityId: "suss",
    applicationOpen: official("2025 年 11 月 19 日", "19 November 2025"),
    applicationDeadline: official("2026 年 3 月 19 日", "19 March 2026"),
    assessmentWindow: indicative("部分课程设面试或评估", "Some programmes hold an interview or assessment"),
    offerWindow: indicative("分批公布", "Released in batches"),
    matriculation: indicative("8 月", "August"),
    checkedAt: "2026-08",
  },
];

export function timelineFor(universityId: string): AdmissionTimeline | undefined {
  return SG_TIMELINES.find((t) => t.universityId === universityId);
}

/** 口径标签 */
export function precisionLabel(p: TimelinePrecision, lang: "zh" | "en"): string {
  if (p === "official") return lang === "zh" ? "官方日期" : "Official date";
  return lang === "zh" ? "规划参考" : "Planning estimate";
}
