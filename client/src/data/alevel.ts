/**
 * Admissions Almanac：BCI Cambridge International A-Level 课程数据。
 * 只包含 BCI 官网课程页公布的可选课程（2026-08-20 核对 https://www.bci.edu.sg/programmes）。
 * English Language 虽列为官网核心科目，但按招生总监确认改以雅思门槛呈现，不占选课名额，故不在此列。
 * 不得添加 Cambridge 考试局虽提供、但 BCI 未开设的科目。
 */
import type { FieldKey } from "@/data/universities";
import type { AlevelSubjectKey } from "@/data/alevelRules";

export type AlevelGrade = "A*" | "A" | "B" | "C" | "D" | "E" | "";

export interface AlevelSubjectMeta {
  key: AlevelSubjectKey;
  zh: string;
  en: string;
  group: "数学" | "科学" | "商科" | "人文";
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
    key: "computerScience",
    zh: "计算机科学",
    en: "Computer Science",
    group: "科学",
    note: "计算机、软件工程、人工智能与数据方向的对口科目。多数院校仍以 Mathematics 为硬性先修，Computer Science 作为佐证学科兴趣与编程基础的第二科；南洋理工计算机科学明确接受其替代 Physics 选项。",
    noteEn: "The subject most directly aligned with computing, software engineering, artificial intelligence and data routes. Mathematics normally remains the hard prerequisite, with Computer Science evidencing subject commitment and programming foundations; NTU Computer Science explicitly accepts it in place of the Physics option.",
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
  {
    key: "accounting",
    zh: "会计",
    en: "Accounting",
    group: "商科",
    note: "会计、审计、金融方向的对口科目，可为专业资格（如 ACCA、CPA）打下基础。院校普遍不将其列为必修先修，且不能替代 Mathematics 在金融与商业分析类专业中的要求。",
    noteEn: "Directly aligned with accountancy, audit and finance routes and a useful foundation for professional qualifications such as ACCA or CPA. Universities rarely list it as a required prerequisite, and it does not substitute for Mathematics in finance or business-analytics programmes.",
  },
  {
    key: "geography",
    zh: "地理",
    en: "Geography",
    group: "人文",
    note: "地理学、城市规划、环境与可持续发展、社会科学方向的对口科目，也是 BCI 现有课程中少数偏人文与写作的选择。对以量化科目为主的组合而言，可用于平衡学科广度。",
    noteEn: "Aligned with geography, urban planning, environmental and sustainability studies and social-science routes, and one of the few humanities-leaning, essay-based options in BCI's current offering. It can broaden an otherwise quantitative subject combination.",
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
    zh: "BCI 现有课程中没有文学或历史；Geography 是唯一偏论述写作的选择，可与 Economics 组合展示论证与分析能力。仍需特别关注英语资格、LNAT、笔试与面试。",
    en: "BCI's current offering does not include Literature or History. Geography is the only essay-based option and pairs well with Economics to evidence argumentation and analysis. English proof, the LNAT, written tests and interviews still need particular attention.",
  },
  computing: {
    zh: "Mathematics 是首要科目，几乎所有院校列为硬性先修；Computer Science 是最对口的第二科，可佐证编程基础与学科兴趣（南洋理工计算机科学明确接受其替代 Physics 选项）。Further Mathematics 对最具竞争力的英国计算机、数据与量化方向显著增益，Physics 是稳妥的第三或第四科。",
    en: "Mathematics is the first priority and is treated as a hard prerequisite by almost every university. Computer Science is the most directly aligned second subject and evidences programming foundations and subject commitment; NTU Computer Science explicitly accepts it in place of the Physics option. Further Mathematics materially strengthens the most selective UK computing, data and quantitative routes, and Physics remains a reliable third or fourth subject.",
  },
  engineering: {
    zh: "标准组合是 Mathematics + Physics；Further Mathematics 提升顶尖工程匹配度，Chemistry 可为化工、材料和部分生物工程保留选择。",
    en: "The standard combination is Mathematics plus Physics. Further Mathematics strengthens the fit for selective engineering, while Chemistry preserves chemical, materials and some bioengineering options.",
  },
  business: {
    zh: "Mathematics 是经济、金融、商业分析的基础；Economics 是最自然的第二科，Further Mathematics 可强化顶尖经济与量化金融申请。目标会计、审计或财务方向时，Accounting 是对口的补充科目，但不能替代 Mathematics。",
    en: "Mathematics underpins economics, finance and business analytics. Economics is the natural second subject, and Further Mathematics strengthens applications to selective economics and quantitative-finance routes. Accounting is a well-aligned addition for accountancy, audit and finance targets, but it does not substitute for Mathematics.",
  },
  science: {
    zh: "生命科学以 Chemistry + Biology 为核心；物理科学以 Mathematics + Physics 为核心。第三或第四科应依目标专业确定；环境科学与可持续发展方向可考虑 Geography。",
    en: "Life sciences centre on Chemistry plus Biology; physical sciences centre on Mathematics plus Physics. Select the third or fourth subject according to the intended degree; Geography suits environmental science and sustainability routes.",
  },
  design: {
    zh: "现有课程不含 Art & Design；建筑与技术设计方向建议 Mathematics + Physics，城市与空间规划方向可加 Geography。作品集须在课外持续建设。",
    en: "The current offering does not include Art & Design. Mathematics plus Physics is advisable for architecture and technical design, with Geography suiting urban and spatial planning. Portfolio development must continue outside class.",
  },
  arts: {
    zh: "现有组合以量化与商科为主；Geography 是唯一的人文类选择，与 Economics 组合可支持社会科学、国际关系与发展研究方向。语言、文学及传媒专业仍需额外核对英语与作品要求。",
    en: "The current set is quantitatively and business oriented. Geography is the only humanities option and, combined with Economics, supports social science, international relations and development studies. Language, literature and media programmes still require separate checks for English and portfolio requirements.",
  },
  education: {
    zh: "教育方向应重视英语资格、面试和与儿童/教学相关的经历。按拟任教学科搭配：理科教育选 Biology、Chemistry 或 Physics，数学教育选 Mathematics，人文与地理教育选 Geography，商科教育选 Economics 或 Business。",
    en: "Education routes place weight on English proof, interviews and experience with children or teaching. Choose subjects according to the intended teaching specialism: Biology, Chemistry or Physics for science education, Mathematics for mathematics teaching, Geography for humanities and geography teaching, and Economics or Business for business education.",
  },
};
