/**
 * Admissions Almanac：BCI Cambridge International A-Level 课程数据。
 * 只包含招生总监确认的七门课程；不得添加 Cambridge 考试局虽提供、但 BCI 未确认开设的科目。
 */
import type { FieldKey } from "@/data/universities";
import type { AlevelSubjectKey } from "@/data/alevelRules";

export type AlevelGrade = "A*" | "A" | "B" | "C" | "D" | "E" | "";

export interface AlevelSubjectMeta {
  key: AlevelSubjectKey;
  zh: string;
  en: string;
  group: "数学" | "科学" | "商科";
  note: string;
  noteEn: string;
}

export const ALEVEL_SUBJECTS: AlevelSubjectMeta[] = [
  {
    key: "mathematics",
    zh: "数学",
    en: "Mathematics",
    group: "数学",
    note: "工程、计算机、数据、经济与多数商科的核心先修。目标理工或顶尖商科时，应作为三至四门 A-Level 中的优先科目。",
    noteEn: "A core prerequisite for engineering, computing, data, economics and most business degrees. It should be prioritised among the three or four A-Level subjects for STEM or selective business targets.",
  },
  {
    key: "furtherMathematics",
    zh: "进阶数学",
    en: "Further Mathematics",
    group: "数学",
    note: "剑桥、帝国理工、LSE 等顶尖数学、计算机、工程与经济方向常明确要求或强烈偏好。须与 Mathematics 配套规划，不替代 Mathematics。",
    noteEn: "Often required or strongly preferred by the most selective mathematics, computing, engineering and economics programmes, including Cambridge, Imperial and LSE. It complements rather than replaces Mathematics.",
  },
  {
    key: "physics",
    zh: "物理",
    en: "Physics",
    group: "科学",
    note: "工程、物理科学与部分计算机/建筑方向的重要先修。目标机械、电子、航空或物理相关专业时，通常应与 Mathematics 同时选择。",
    noteEn: "An important prerequisite for engineering, physical sciences and some computing or architecture routes. It is normally taken with Mathematics for mechanical, electrical, aerospace or physics-related targets.",
  },
  {
    key: "chemistry",
    zh: "化学",
    en: "Chemistry",
    group: "科学",
    note: "医学、牙医、药学、生物医学与化学工程的关键先修。目标医学时，通常还需搭配 Biology。",
    noteEn: "A key prerequisite for medicine, dentistry, pharmacy, biomedical science and chemical engineering. Medicine applicants normally pair it with Biology.",
  },
  {
    key: "biology",
    zh: "生物",
    en: "Biology",
    group: "科学",
    note: "医学、生命科学、生物医学、心理学相关方向的重要学术基础。与 Chemistry 的组合可保留最多健康科学路径。",
    noteEn: "An important academic foundation for medicine, life sciences, biomedical science and psychology-related routes. Together with Chemistry, it preserves the widest range of health-science pathways.",
  },
  {
    key: "economics",
    zh: "经济学",
    en: "Economics",
    group: "商科",
    note: "经济、金融、商科、社科和政策方向的高契合度科目。与 Mathematics 组合时，对经济与数据型商科尤其有利。",
    noteEn: "A high-fit subject for economics, finance, business, social science and policy routes. Paired with Mathematics, it is especially helpful for economics and data-led business programmes.",
  },
  {
    key: "business",
    zh: "商科",
    en: "Business",
    group: "商科",
    note: "有助于建立商业、管理和创业基础，但通常不能替代 Mathematics 对经济、金融、计算机或数据类专业的先修要求。",
    noteEn: "Useful for developing a business, management and entrepreneurship foundation, but it does not normally substitute for Mathematics where economics, finance, computing or data programmes require it.",
  },
];

export const ALEVEL_GRADE_POINTS: Record<Exclude<AlevelGrade, "">, number> = {
  "A*": 6,
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
};

export const ALEVEL_FIELD_ADVICE: Record<FieldKey, { zh: string; en: string }> = {
  medicine: {
    zh: "优先锁定 Chemistry + Biology；如需保持工程/物理科学备选，可用 Mathematics 或 Physics 作为第三科。医学项目普遍还需 UCAT、面试或其他选拔。",
    en: "Prioritise Chemistry with Biology. Mathematics or Physics is a strong third subject if you also want to preserve engineering or physical-science options. Medicine commonly adds the UCAT, interviews or other selection.",
  },
  law: {
    zh: "BCI 当前 7 门课中没有文学或英语科目；法律申请仍可通过 Mathematics、Economics、Business 等展示分析能力，但需特别关注英语资格、LNAT、笔试与面试。",
    en: "BCI's current seven-subject set does not include Literature or English. Mathematics, Economics and Business can still evidence analytical ability, but English proof, the LNAT, written tests and interviews need particular attention.",
  },
  computing: {
    zh: "Mathematics 是首要科目；Further Mathematics 对最具竞争力的英国计算机、数据与量化方向显著增益，Physics 是有价值的第三科。",
    en: "Mathematics is the first priority. Further Mathematics materially strengthens the most selective UK computing, data and quantitative routes, while Physics is a valuable third subject.",
  },
  engineering: {
    zh: "标准组合是 Mathematics + Physics；Further Mathematics 提升顶尖工程匹配度，Chemistry 可为化工、材料和部分生物工程保留选择。",
    en: "The standard combination is Mathematics plus Physics. Further Mathematics strengthens the fit for selective engineering, while Chemistry preserves chemical, materials and some bioengineering options.",
  },
  business: {
    zh: "Mathematics 是经济、金融、商业分析的基础；Economics 是最自然的第二科，Further Mathematics 可强化顶尖经济与量化金融申请。",
    en: "Mathematics underpins economics, finance and business analytics. Economics is the natural second subject, and Further Mathematics strengthens applications to selective economics and quantitative-finance routes.",
  },
  science: {
    zh: "生命科学以 Chemistry + Biology 为核心；物理科学以 Mathematics + Physics 为核心。第三或第四科应依目标专业确定。",
    en: "Life sciences centre on Chemistry plus Biology; physical sciences centre on Mathematics plus Physics. Select the third or fourth subject according to the intended degree.",
  },
  design: {
    zh: "现有 7 门课不含 Art & Design；建筑与技术设计方向建议 Mathematics + Physics，且须在课外持续建设作品集。",
    en: "The current seven-subject set does not include Art & Design. Mathematics plus Physics is advisable for architecture and technical design, alongside continuous portfolio development outside class.",
  },
  arts: {
    zh: "现有组合以量化与商科为主；Economics 或 Business 可支持部分社会科学方向，但语言、人文及传媒专业需额外核对其英语与作品要求。",
    en: "The current set is quantitatively and business oriented. Economics or Business can support some social-science routes, but language, humanities and media programmes require separate checks for English and portfolio requirements.",
  },
  education: {
    zh: "教育方向应重视英语资格、面试和与儿童/教学相关的经历。Economics、Biology 或 Business 可按具体教育领域搭配。",
    en: "Education routes place weight on English proof, interviews and experience with children or teaching. Economics, Biology or Business can be selected according to the education specialism.",
  },
};
