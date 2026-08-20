/**
 * Cambridge International A-Level 结构化规则。
 * 仅包含 BCI 官网课程页公布的可选课程（English Language 按雅思门槛单独处理，不占选课名额）；
 * publishedGradeProfile 仅在官方明确公开等级组合时才允许填写。
 */

export type AlevelSubjectKey =
  | "mathematics"
  | "furtherMathematics"
  | "physics"
  | "chemistry"
  | "biology"
  | "computerScience"
  | "economics"
  | "business"
  | "accounting"
  | "geography";

export type AlevelProfileType =
  | "published_grade"
  | "passes_only"
  | "rank_conversion"
  | "holistic_or_case_by_case"
  | "course_specific"
  | "unavailable";

export interface AlevelFieldRule {
  publishedGradeProfile: string | null;
  requiredSubjects: AlevelSubjectKey[];
  recommendedSubjects: AlevelSubjectKey[];
  noteZh: string;
  noteEn: string;
  extras: string[];
}

export interface AlevelUniversityRule {
  profileType: AlevelProfileType;
  generalProfile: string | null;
  generalProfileEn: string;
  englishSummaryZh: string;
  englishSummaryEn: string;
  applicationSummaryZh: string;
  applicationSummaryEn: string;
  confidence: "高" | "中" | "低";
  fields: Record<string, AlevelFieldRule>;
}

export const ALEVEL_UNIVERSITY_RULES: Record<string, AlevelUniversityRule> = {
  "nus": {
    "profileType": "passes_only",
    "generalProfile": "A good pass in at least three ‘Advanced’ Level subjects；官方未公布具体字母等级（如 A*/A/B）最低线；已完成高中最终考试者以 Advanced Level 成绩申请，尚未完成者须预计在申请当年7月底前至少三门 Advanced Level 取得 good pass。",
    "generalProfileEn": "A good pass in at least three ‘Advanced’ Level subjects is required. NUS has not published a specific minimum letter-grade threshold such as A*/A/B. Applicants who have completed their final secondary-school examinations apply using their Advanced Level results; applicants awaiting final examinations must be expected to obtain a good pass in at least three Advanced Level subjects by the end of July of the application year.",
    "englishSummaryZh": "NUS International A-Level 页面明确 English Requirement 为 Not required。C1 Advanced、EL1119、IELTS、MUET、TOEFL 成绩可提交，但不是 admission requirement。Law 另要求申请人具备高水平英语 proficiency。",
    "englishSummaryEn": "English is not required as an admission requirement for the NUS International A-Level qualification. C1 Advanced/Cambridge English: Advanced, EL1119, IELTS, MUET and TOEFL results may be submitted but are not required for admission. Law additionally requires a high level of proficiency in the English Language.",
    "applicationSummaryZh": "AY2026/2027 国际资格（International Qualifications for Foreigners）申请期为 2025-12-03 至 2026-02-23，官方截止日期为 2026-02-23。",
    "applicationSummaryEn": "For AY2026/2027 International Qualifications for Foreigners applications, the deadline is 23 February 2026; the stated application period is 3 December 2025 to 23 February 2026.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "chemistry"
        ],
        "recommendedSubjects": [
          "biology",
          "physics"
        ],
        "noteZh": "官方先修要求为 Year 12 or higher level pass in Chemistry and Biology or Physics；未公布可直接换算为 Cambridge A-Level 字母等级的门槛。",
        "noteEn": "Medicine requires a Year 12 or higher level pass in Chemistry and Biology or Physics. UCAT and a portfolio are required; shortlisted applicants take the Focused Skills Assessment (FSA). Dentistry is not applicable to applicants who have not completed their final examinations and has additional MDT/MMI requirements.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方要求英语语言具备高水平 proficiency，并有选拔测试和面试；未公布 Cambridge A-Level 字母等级门槛。",
        "noteEn": "Law requires a high level of proficiency in the English Language. Shortlisted applicants must take the Admissions Written Test and, if successful, the Admissions Interview; both are required. No Cambridge A-Level letter-grade threshold has been published.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "furtherMathematics"
        ],
        "noteZh": "Common Computer Science Programmes、Information Security、Business Analytics/Business Artificial Intelligence Systems 均以 Mathematics 的 Year 12 or higher level pass 为先修；无统一字母等级最低线。",
        "noteEn": "Common Computer Science Programmes and Information Security require a Year 12 or higher level pass in Mathematics. Business Analytics and Business Artificial Intelligence Systems also require a Year 12 or higher level pass in Mathematics.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "physics",
          "chemistry",
          "furtherMathematics"
        ],
        "noteZh": "Engineering 及 Computer Engineering 要求 Mathematics 的 Year 12 or higher level pass；无统一 Cambridge A-Level 字母等级最低线。",
        "noteEn": "Engineering and Computer Engineering require a Year 12 or higher level pass in Mathematics. No uniform minimum letter-grade threshold has been published.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "economics",
          "business",
          "furtherMathematics"
        ],
        "noteZh": "Business Administration 和 Business Analytics 要求 Mathematics 的 Year 12 or higher level pass；Data Science and Economics 要求 Mathematics 的 strong Year 12 pass 或 strong higher level pass；均非明确字母等级组合。",
        "noteEn": "Business Administration and Business Analytics require a Year 12 or higher level pass in Mathematics. Data Science and Economics requires a strong Year 12 pass or strong higher level pass in Mathematics.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [
          "chemistry",
          "biology",
          "physics",
          "mathematics",
          "furtherMathematics",
          "computerScience"
        ],
        "noteZh": "官方未为广义 Science 统一公布 Cambridge A-Level 等级或科目组合。代表性课程中，Food Science and Technology 要求指定六类科目中任意两科（含 Computing）的 Year 12 or higher level pass；Pharmacy/Pharmaceutical Science 要求 Chemistry 加 Biology、Physics 或 Mathematics 中之一的 strong Year 12 pass 或 strong higher level pass。",
        "noteEn": "Food Science and Technology requires any two of Chemistry, Biology, Physics, Physical Science, Computing, Mathematics or Further Mathematics. Pharmacy and Pharmaceutical Science require a strong Year 12 pass or strong higher level pass in Chemistry and Biology or Physics or Mathematics. No uniform Cambridge A-Level threshold is published for Environmental Studies.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [
          "chemistry",
          "mathematics",
          "physics",
          "economics"
        ],
        "noteZh": "Architecture 要求 Chemistry 或 Mathematics 或 Physics 的 Year 12 or higher level pass；Industrial Design 要求 Arts 或 Economics 或 Mathematics 或 Physics 的 Year 12 or higher level pass。Arts 不属于允许映射的BCI 可选课程，因此未列入 subjects；未公布字母等级组合。",
        "noteEn": "Architecture requires a Year 12 or higher level pass in Chemistry or Mathematics or Physics or Physical Science. Industrial Design requires a Year 12 or higher level pass in Arts or Economics or Mathematics or Physics and includes an interview. Shortlisted applicants for Architecture, Industrial Design and Landscape Architecture may have a test or interview.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Humanities and Sciences、Philosophy, Politics, and Economics 等代表性课程未在已核验国际资格先修资料中统一列出 Cambridge A-Level 字母等级门槛或BCI 可选课程必修组合；按课程页面及具体 programme prerequisites 执行。",
        "noteEn": "For Humanities and Sciences, refer to the NUS majors pages; the official prerequisite PDF does not set out a uniform Cambridge A-Level letter-grade threshold. For Philosophy, Politics, and Economics, refer to the CHS programme page. No additional examination or interview is published for the other representative courses noted.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "已核验研究未列出可对应的 Education 课程或官方 A-Level 先修规则，不适用。",
        "noteEn": "No specific Cambridge International A-Level subject prerequisite or additional examination/interview requirement has been published for Education in the research materials.",
        "extras": []
      }
    }
  },
  "ntu": {
    "profileType": "passes_only",
    "generalProfile": "Good passes in at least 4 Advanced Level subjects taken in the same sitting；3 门同场 A-Level 可个案审理，但国际学生申请 subsidised tuition fee basis 不适用。官方未公布统一 AAA/A*AA 等最低等级。",
    "generalProfileEn": "NTU accepts good passes in at least 4 Advanced Level subjects taken in the same sitting. No universal minimum such as AAA or A*AA is published, and meeting the minimum application requirements does not guarantee admission. Three A-Level subjects taken in the same sitting may be considered on a case-by-case basis, but this does not apply to international students applying for subsidised tuition fee status. Applicants taking May/June UK A-Level/IAL examinations whose results are released in August of the application year cannot apply for that intake and must apply for the following academic year.",
    "englishSummaryZh": "若高中教学语言不是英语，或成绩单显示英语为第二语言/English as an Additional Language，须满足认可英语证明之一：IGCSE O-Level English first language A/7；IELTS 总分6且写作、口语6；或 TOEFL、SAT、PTE、ACT with Writing、C1 Advanced、MUET/CEFR B2/E1119 English A 等对应要求。是否豁免取决于高中授课语言及英语科目情况。",
    "englishSummaryEn": "If the high-school teaching language is not English, or the transcript shows English as a second language/English as an Additional Language, applicants must meet one of the stated alternatives: IGCSE O-Level English first language grade A/7; IELTS Overall 6 with Writing 6 and Speaking 6; TOEFL (before 2026: Overall 90 and iBT Speaking 25; from January 2026: Overall 4.5 and Speaking 4.5); SAT 1250; PTE Academic Overall 55 with Speaking 55; ACT with Writing composite 30; C1 Advanced; or MUET/CEFR B2/E1119 English A. Exemption depends on the high-school teaching language and English-subject background. International students should not directly apply Singapore-Cambridge GP rules.",
    "applicationSummaryZh": "AY2026-27 申请期为2025年10月15日至2026年3月19日，官方页面当前标示 Closed。May/June UK A-Level/IAL 若于申请年8月公布，不能申请当年，须下一学年申请；普通课程最终成绩通常须于7月31日前取得，LKCMedicine须于3月31日前取得。",
    "applicationSummaryEn": "For AY2026-27, the application window is 15 October 2025–19 March 2026; the official page currently marks it Closed. UK A-Level/IAL results released in August of the application year are not accepted for that year’s intake and require application for the following academic year. Medicine/LKCMedicine results must be available by 31 March; ordinary programmes generally require final results by 31 July.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "LKCMedicine 的 Cambridge A-Level 课程级科目组合本次官方页面未完整公布，须按申请年度 NTU International Qualifications Minimum Subject Requirements 表格复核；不得据此推导固定等级或科目门槛。A-Level/Pre-U 成绩须在申请年 3 月 31 日前可得。",
        "noteEn": "LKCMedicine’s specific subject requirements should be checked against NTU’s International Qualifications Minimum Subject Requirements table for the application year. No fixed Cambridge A-Level grade threshold was published in the reviewed official pages. A-Level/Pre-U results must be available by 31 March of the application year. Biological Sciences requires a good grade in Additional Mathematics at Junior High School Level plus Physics/Chemistry/Biology at Senior High School Level; Biomedical Sciences and BioBusiness require a good grade in Additional Mathematics plus Physics/Chemistry/Biology. These are subject requirements, not published course-level A-Level grade thresholds.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "NTU 官方本科课程及国际资格科目要求页面未列出 Law 学位，因此无可核验的 NTU Law Cambridge A-Level benchmark；不适用。",
        "noteEn": "NTU’s official undergraduate-course and international-qualification subject-requirement pages do not list a Law degree. Therefore, no verifiable NTU Law Cambridge A-Level benchmark is available; it is not published or applicable.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "computerScience",
          "physics"
        ],
        "noteZh": "Computer Science 要求 Senior High School Level Mathematics 或 Physics；指定 UK CIE A-Level Computer Science 可替代表中 Physics 选项。Computer Engineering 要求 Mathematics 加 Physics/Chemistry/Biology，并另需 Junior High School Physics；Data Science and Artificial Intelligence 要求 Mathematics。官方未公布 Cambridge A-Level 固定等级线。",
        "noteEn": "Computer Science requires Mathematics at Senior High School Level or Physics; UK CIE A-Level Computer Science may replace the Physics option in the table. Computer Engineering requires Mathematics plus Physics/Chemistry/Biology and also Junior High School Physics. Data Science and Artificial Intelligence requires Mathematics at Senior High School Level. No fixed Cambridge A-Level grade threshold was published.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "physics",
          "chemistry",
          "biology"
        ],
        "noteZh": "代表性 B.Eng 要求 Senior High School Level Mathematics 加 Biology/Chemistry/Physics 中相应科目；若未读 Senior High School Physics，另需 Junior High School Physics。NTU 说明 A-Level Mathematics 足以满足 Senior High School Level Mathematics。官方未公布 Cambridge A-Level 固定等级线。",
        "noteEn": "Representative B.Eng. programmes require Senior High School Level Mathematics plus Senior High School Level Biology/Chemistry/Physics. Applicants without Senior High School Physics additionally require Junior High School Physics. NTU states that A-Level Mathematics satisfies the Senior High School Level Mathematics requirement. Renaissance Engineering also requires a selection test/interview.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [
          "mathematics",
          "economics",
          "business"
        ],
        "noteZh": "Business 单独课程的国际 Cambridge A-Level 固定等级门槛未在所查官方页面公布。相关 Economics 课程要求 Junior High School Level Additional Mathematics 及 Senior High School Level English，并按 selective basis 审核；Economics and Data Science 要求 Mathematics 及 good English。English 不属于本字段限定的BCI 可选课程。",
        "noteEn": "Economics requires a good grade in Additional Mathematics at Junior High School Level and a good grade in English at Senior High School Level, on a selective basis. Economics and Data Science requires Mathematics at Senior High School Level plus good English. No fixed international Cambridge A-Level grade threshold for a standalone Business programme was published in the reviewed official pages.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "physics",
          "chemistry",
          "biology"
        ],
        "recommendedSubjects": [
          "mathematics"
        ],
        "noteZh": "Biological Sciences、Biomedical Sciences and BioBusiness 要求 Junior High School Level Additional Mathematics 加 Senior High School Level Physics/Chemistry/Biology；Chemistry and Biological Chemistry 要求 Chemistry 加 Mathematics/Physics。此处仅映射BCI 可选课程，Additional Mathematics 的层级要求保留在说明中。官方未公布 Cambridge A-Level 固定等级线。",
        "noteEn": "Biological Sciences requires a good grade in Additional Mathematics at Junior High School Level plus Physics/Chemistry/Biology at Senior High School Level. Biomedical Sciences and BioBusiness require a good grade in Additional Mathematics plus Physics/Chemistry/Biology. Chemistry and Biological Chemistry require Chemistry plus Mathematics/Physics. No fixed Cambridge A-Level grade threshold was published.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [],
        "noteZh": "Art, Design & Media 要求 Junior High School Mathematics 及 Senior High School English，并需 portfolio、personal statement/writing samples、creative project 和 observational drawing。English 不属于本字段限定的BCI 可选课程；官方未公布 Cambridge A-Level 固定等级线。",
        "noteEn": "Art, Design & Media requires Junior High School Mathematics and good Senior High School English, together with a portfolio, personal statement/writing samples, creative project, and observational drawing. No fixed Cambridge A-Level grade threshold was published.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "English、History、Philosophy 等部分 Arts/Humanities 课程要求 Senior High School Level General Paper/English，部分课程有 selection interview；Chinese 相关课程另要求 Chinese at GCE O-Level 或 HSK Level 6。上述科目不在BCI 可选课程范围内，因此未填入 subjects。官方未公布 Cambridge A-Level 固定等级线。",
        "noteEn": "English requires a good grade in General Paper/English at Senior High School Level and a selection interview; some History and Philosophy programmes also require a good grade in General Paper/English. Chinese-related programmes additionally require Chinese at GCE O-Level/HSK Level 6. No fixed Cambridge A-Level grade threshold was published.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "NTU 已核验官方研究文件未列出可对应的 Education 本科课程或课程级 Cambridge A-Level benchmark；不适用。",
        "noteEn": "No separate NTU Education Cambridge A-Level benchmark was published in the reviewed official pages. Do not infer a grade threshold or subject requirement beyond the university-wide requirements and any programme-specific official table.",
        "extras": []
      }
    }
  },
  "smu": {
    "profileType": "passes_only",
    "generalProfile": "null；官方未公布 Cambridge International/UK A-Level 的统一最低等级。官方要求至少完成 12 年正规教育，并在获认可的国家/国际考试中取得 good passes；UK A Levels（Cambridge、Edexcel、AQA）须按 International/Other qualifications 类别申请。",
    "generalProfileEn": "No uniform minimum grade requirement for Cambridge International/UK A-Levels has been published. Applicants must have completed at least 12 years of formal education and obtained good passes in recognised national or international examinations. UK A-Levels (Cambridge, Edexcel, AQA) must be applied under the International/Other Qualifications category.",
    "englishSummaryZh": "International/Other qualifications 申请人通常须提交一项标准化考试成绩，除非持有获豁免资格。非 Law：IELTS Academic 总分 7.0，阅读 7.0、写作 6.5；Law：总分 7.5，阅读和写作均 7.0。官方未列 Cambridge International A-Level 英语科目豁免；另接受 SAT、ACT、TOEFL、PTE、C1 Advanced 或符合条件的 AST，Law 分数要求更高。",
    "englishSummaryEn": "International/Other Qualifications applicants must submit one standardised test score unless they hold an exempt qualification. Non-law: IELTS Academic overall 7.0, Reading 7.0, Writing 6.5; alternatives include SAT 1350 (EBRW 650), ACT 29 (English+Reading 57), TOEFL iBT 93 before 2026-01-21 (Reading/Writing 22 each) or, from 2026-01-21, TOEFL iBT 5 (Reading 5, Writing 4.5), PTE 66 (Reading 66, Writing 56), C1 Advanced 185 (Reading 185, Writing 176), or AST in at least three subjects including English and Mathematics, with AST English 225. Law: IELTS 7.5, SAT EBRW 700, ACT English+Reading 64, TOEFL 100/5.5, PTE 76, C1 191, or AST English 240. No Cambridge International A-Level English-subject exemption is listed.",
    "applicationSummaryZh": "AY2026-27 International/Other qualifications 申请截止为 2026-03-19 23:59（新加坡标准时间）。若最终高中成绩尚未公布，predicted results 须由学校教师或辅导员认证，并于 2026-03-31 提交。",
    "applicationSummaryEn": "Application deadline: 2026-03-19 at 23:59 Singapore Standard Time for AY2026-27 International/Other Qualifications applicants. If final high-school results are not yet available, predicted results must be certified by a school teacher/counsellor and submitted by 2026-03-31.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用；SMU 官方本科课程/录取页面未公布医学或生命科学本科课程要求。",
        "noteEn": "No undergraduate medicine or life-science course requirement has been published; SMU does not offer an undergraduate medicine course.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "SMU 曾公布 Singapore-Cambridge GCE A-Level 2025 offers indicative AAA/A–AAA/A，但这不是 Cambridge International A-Level 门槛，且历史 profile 不保证录取；国际学历页面未公布 A-Level 科目先修。",
        "noteEn": "Singapore-Cambridge GCE A-Level 2025 offers indicative AAA/A–AAA/A. This is not a Cambridge International A-Level-specific threshold, and the official profile does not guarantee admission. Shortlisted applicants must take a writing test; further-shortlisted applicants are interviewed.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [],
        "noteZh": "Computer Science、Information Systems、Software Engineering 的公开 BBB/C–AAA/A 或 AAB/B–AAA/A 区间仅为 Singapore-Cambridge GCE A-Level 2025 offers indicative，不得转换为 Cambridge International A-Level 等级门槛；国际学历页面要求高中阶段 Mathematics good pass。",
        "noteEn": "Singapore-Cambridge GCE A-Level 2025 offers indicative 10th–90th percentile: Computer Science AAB/B–AAA/A; Information Systems BBC/C–AAA/B; Software Engineering BBC/B–AAA/C. These are historical guidance data for Singapore A-Level applicants, not Cambridge International A-Level thresholds. Applicants for Computer Science, Information Systems and Software Engineering need a good pass in high-school Mathematics.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用；SMU 官方本科课程/录取页面未公布工程本科课程要求。",
        "noteEn": "No undergraduate engineering course requirement has been published; SMU does not offer an undergraduate engineering course.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Accountancy BBB/C–AAA/A、Business Management ABB/C–AAA/A 的公开区间仅为 Singapore-Cambridge GCE A-Level 2025 offers indicative，不是 Cambridge International A-Level 门槛；官方未公布该方向国际 A-Level 等级组合。",
        "noteEn": "Singapore-Cambridge GCE A-Level 2025 offers indicative 10th–90th percentile: Accountancy BBB/C–AAA/A and Business Management ABB/C–AAA/A. These are not Cambridge International A-Level thresholds.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "未公布；SMU 官方研究未列出可对应的一般科学本科课程或 Cambridge International A-Level 专属等级规则。",
        "noteEn": "No Cambridge International-specific grade requirement has been published for science; SMU has not published an undergraduate life-science course requirement.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用；SMU 官方本科课程/录取页面未公布设计本科课程要求。",
        "noteEn": "No Cambridge International-specific grade requirement or portfolio requirement has been published for design.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Social Sciences BBB/C–AAA/A 的公开区间仅为 Singapore-Cambridge GCE A-Level 2025 offers indicative，非 Cambridge International A-Level 门槛；其他文社人文方向未公布 Cambridge International 专属等级。",
        "noteEn": "Singapore-Cambridge GCE A-Level 2025 offers indicative 10th–90th percentile: Social Sciences BBB/C–AAA/A. This is not a Cambridge International A-Level-specific grade threshold; requirements for other arts, humanities and social-science fields have not been published.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用；SMU 官方本科课程/录取页面未公布教育本科课程要求。",
        "noteEn": "No Cambridge International-specific grade requirement has been published for education.",
        "extras": []
      }
    }
  },
  "sutd": {
    "profileType": "passes_only",
    "generalProfile": "Good passes in at least three Advanced Level subjects within the same sitting；官方未公布统一最低字母等级（如AAA/A*AA），且不同考试期取得的Advanced Level科目不接受。",
    "generalProfileEn": "Good passes in at least three Advanced Level subjects within the same sitting. SUTD has not published a uniform minimum letter-grade requirement such as AAA or A*AA. Advanced Level subjects taken in different sittings are not accepted.",
    "englishSummaryZh": "若所提交资格的授课语言不是英语，必须提交 IELTS、TOEFL、SAT、PTE Academic、ACT 或 C1 Advanced 之一；官方明确不设规定的最低分数，申请按学术及非学术成就综合评审。若授课语言为英语，官方页面未规定必须提交英语考试成绩。",
    "englishSummaryEn": "If the qualification submitted was taught in a language other than English, applicants must submit one of IELTS, TOEFL, SAT, PTE Academic, ACT, or C1 Advanced. SUTD states that there is no prescribed minimum score and assesses applications holistically based on academic and non-academic achievements. If the qualification was taught in English, the official page does not require an English test score.",
    "applicationSummaryZh": "国际A-Level Certifications申请窗口为2026年1月2日至3月2日；官网当前显示2026申请已关闭，下一次申请见2027，具体日期以年度官网更新为准。",
    "applicationSummaryEn": "The 2026 A-Level Certifications (International) application window was 2 January to 2 March 2026. The official website states that 2026 applications are closed; the next application cycle is expected to be in 2027.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用；SUTD未发现医学或生命科学本科项目，也未公布对应A-Level门槛。",
        "noteEn": "Not applicable. SUTD has not published a medicine or life-science undergraduate programme or a corresponding A-Level threshold. SUTD generally prefers strong ability in Mathematics and the Sciences, especially Physics or Chemistry.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用；SUTD未发现法律本科项目，也未公布法律类A-Level要求。",
        "noteEn": "SUTD has no identified undergraduate law programme and has not published law-related A-Level requirements.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [
          "mathematics",
          "physics",
          "chemistry"
        ],
        "noteZh": "未按计算机专业公布单独等级门槛或强制先修科目；整体招生偏好 Mathematics and Sciences。",
        "noteEn": "No separate grade threshold has been published for computing. SUTD has not specified Computing as a prerequisite subject or published a subject-grade requirement; Mathematics and the Sciences are valued overall.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [
          "mathematics",
          "physics",
          "chemistry"
        ],
        "noteZh": "未按工程专业公布单独等级门槛；官方偏好 Mathematics 与 Sciences，尤其 Physics 或 Chemistry。",
        "noteEn": "No separate grade threshold has been published by engineering discipline. The representative academic preference is Mathematics plus Physics or Chemistry; strong competency in Mathematics and the Sciences generally is preferred.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "未公布Business方向单独A-Level等级或科目先修要求。官方页面仅提及 Economics、Business、Finance 等方向可在 Design and Artificial Intelligence 路径中探索。",
        "noteEn": "The undergraduate programme information mentions Economics, Business, and Finance as areas that may be explored within the Design and Artificial Intelligence pathway, but no A-Level grade or subject prerequisite has been published.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [
          "mathematics",
          "physics",
          "chemistry"
        ],
        "noteZh": "未公布Science类别单独等级门槛；全校层面偏好 Mathematics 及 Sciences，尤其 Physics 或 Chemistry。",
        "noteEn": "No separate science-field A-Level grade threshold has been published. Strong competency in Mathematics and the Sciences generally is preferred, with Physics or Chemistry specifically noted.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "未公布Design方向单独A-Level等级或科目先修要求。",
        "noteEn": "SUTD has not published a separate A-Level grade or subject prerequisite for design. Design and Artificial Intelligence is an undergraduate pathway in which related areas may be explored.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "未公布Arts/HASS方向单独A-Level等级或科目先修要求；SUTD虽列有 Humanities, Arts and Social Sciences（HASS）学术领域，但无独立公开门槛。",
        "noteEn": "SUTD lists Humanities, Arts and Social Sciences (HASS) as an academic area, but has not published a separate A-Level grade or subject prerequisite for it.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用；SUTD未发现教育本科项目，也未公布教育类A-Level要求。",
        "noteEn": "SUTD has not published an education undergraduate programme or education-specific A-Level requirements.",
        "extras": []
      }
    }
  },
  "sit": {
    "profileType": "holistic_or_case_by_case",
    "generalProfile": "null；官方未公布 Cambridge International A-Level 的固定全校最低等级。官方仅称海外 international qualification（包括 A Level/Year 12 examination results）须完成至少 12 年正规教育，并按个案审理（case-by-case）。",
    "generalProfileEn": "No fixed institution-wide minimum Cambridge International A-Level grades have been published. Applicants with overseas international qualifications, including A Level/Year 12 examination results, must have completed at least 12 years of formal education. Applications are assessed case by case.",
    "englishSummaryZh": "一般国际资格申请者如高中授课语言不是英语，应提交可接受的英语考试成绩，例如 IELTS 或 TOEFL；SIT 国际资格页未给出统一分数。Allied Health 页面另列新加坡 GCE A-Level GP/Knowledge & Inquiry 门槛（如 D 或 B），但该口径不能直接视为 Cambridge International A-Level 规则。",
    "englishSummaryEn": "For general international qualifications, applicants whose secondary education was not taught in English should submit an accepted English-test result, such as IELTS or TOEFL. SIT's international-qualifications page does not state a uniform score. Allied Health programmes publish separate Singapore-Cambridge GCE A-Level English-related requirements, but these cannot be treated as Cambridge International A-Level requirements.",
    "applicationSummaryZh": "官方 2026/27 本科申请窗口为 2026 年 1 月 8 日至 3 月 19 日；国际资格指南概括为每年 January–March，并要求在 March closing date 前提交。",
    "applicationSummaryEn": "The official 2026/27 undergraduate application window is 8 January to 19 March 2026. The international-qualifications guidance describes the window generally as January–March and requires submission by the March closing date.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用；SIT 官方本科课程/国际资格页面未公布医学课程或 Cambridge International A-Level 医学等级门槛。相关健康科学课程的国际 A-Level 具体门槛未公布，不能将其他体系要求转写为 A-Level 等级。",
        "noteEn": "No fixed Cambridge International A-Level threshold has been published. Relevant health-science programmes require applicants to meet the individual programme admission requirements. Allied Health programmes also have English-related and medical-clearance requirements.",
        "extras": [
          "相关 Allied Health 课程须满足各课程 admission requirements。",
          "Allied Health 可能需要 Mandatory Medical Clearance。"
        ]
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用；SIT 官方本科课程/国际资格页面未公布法律课程或 Cambridge International A-Level 法学要求。",
        "noteEn": "SIT's official undergraduate and international-qualification pages do not publish a law programme or a Cambridge International A-Level law requirement.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布 Cambridge International A-Level 等级门槛或明确科目先修要求。SIT-DigiPen 课程所列 H2 Mathematics、Physics、Computing 或 H1 Mathematics 属新加坡 A-Level 口径，禁止直接映射为 Cambridge International A-Level 科目规则。",
        "noteEn": "No fixed Cambridge International A-Level grade threshold has been published. SIT-DigiPen Computer Science in Real-Time Interactive Simulation and Computer Science and Game Design list H2 Mathematics, Physics or Computing, or H1 Mathematics, under the Singapore qualification framework; these must not be treated as Cambridge International A-Level requirements.",
        "extras": [
          "SIT-DigiPen Computer Science in Real-Time Interactive Simulation / Computer Science and Game Design 相关申请可能需要 personal statement。"
        ]
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布 Cambridge International A-Level 等级门槛或可直接适用的科目组合。Technical University of Munich 合作课程所列 H2 Mathematics + H2 Science（Biology/Chemistry/Physics）为新加坡 H2 口径，禁止转写为 Cambridge A-Level 要求。",
        "noteEn": "No fixed Cambridge International A-Level grade threshold has been published. The Technical University of Munich collaboration lists H2 Mathematics plus H2 Science (Biology/Chemistry/Physics) under the Singapore qualification framework; this must not be treated as a Cambridge International A-Level grade requirement.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布 Cambridge International A-Level 等级或科目门槛。",
        "noteEn": "No fixed Cambridge International A-Level grade or subject threshold has been published. Business and Infocomm Technology requires a personal statement.",
        "extras": [
          "Business and Infocomm Technology 要求 personal statement。"
        ]
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布 Cambridge International A-Level 的统一等级或科目规则；相关课程的具体要求须按项目及个案审理。",
        "noteEn": "No fixed Cambridge International A-Level threshold has been published. Relevant health-science programmes require applicants to meet the individual programme admission requirements; no programme-level Cambridge International A-Level score has been published.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布 Cambridge International A-Level 等级或科目门槛。",
        "noteEn": "No fixed Cambridge International A-Level threshold has been published. Digital Art and Animation additionally requires a 10–15 item portfolio; no specific Cambridge International A-Level threshold has been published.",
        "extras": [
          "DigiPen Digital Art and Animation 另需提交 10–15 件作品 portfolio。"
        ]
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布 Cambridge International A-Level 等级门槛；Communication and Digital Media 的具体 Cambridge 科目规则未公布。",
        "noteEn": "No fixed Cambridge International A-Level grade threshold has been published. Communication and Digital Media requires a written essay and media portfolio; specific Cambridge International A-Level thresholds for other related programmes have not been published.",
        "extras": [
          "Communication and Digital Media 要求 700-word written essay + media portfolio。",
          "相关项目具体 Cambridge 门槛须按官方课程要求及个案审理。"
        ]
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用；SIT 官方本科课程/国际资格页面未公布教育课程或 Cambridge International A-Level 教育要求。",
        "noteEn": "SIT's official undergraduate and international-qualification pages do not publish an education programme or a Cambridge International A-Level education requirement.",
        "extras": []
      }
    }
  },
  "suss": {
    "profileType": "course_specific",
    "generalProfile": "null；SUSS 官方全日制本科资格页未公布 Cambridge International A-Level 的具体最低等级；国际及其他资格要求为完成至少12年正规教育，并提交规定的标准化考试成绩。",
    "generalProfileEn": "SUSS has not published a specific minimum Cambridge International A-Level grade requirement. For international and other qualifications, applicants must have completed at least 12 years of formal education and submit the required standardized test results.",
    "englishSummaryZh": "若所持资格授课语言不是英语：IELTS Academic 6.5，或 TOEFL iBT 85，或 MUET Band 4.0，或 PTE Academic 58，或 C1 Advanced 180。若无 GCE O-Level English Language C6 或同等成绩，SUSS 可能要求额外测试。相关语言成绩须在入学时最近2年内取得，并于入学年度3月31日前提交。",
    "englishSummaryEn": "If the qualification was taught in a language other than English: IELTS Academic 6.5, TOEFL internet-based 85, MUET Band 4.0, PTE Academic 58, or C1 Advanced 180. Without GCE O-Level English Language Grade C6 (or equivalent), SUSS may require an additional test. IELTS/TOEFL/PTE/C1 results must have been obtained within 2 years of enrolment, and all results must be submitted by March 31 of the year of admission.",
    "applicationSummaryZh": "July 2026 全日制本科申请窗口为2025年11月19日至2026年3月19日，已结束；July 2027 申请将于2026年11月开始。英语及 SAT/ACT 等成绩须于入学年度3月31日前提交。",
    "applicationSummaryEn": "The July 2026 full-time undergraduate application window ran from November 19, 2025 to March 19, 2026 and has closed. Applications for July 2027 will open in November 2026. English and SAT/ACT results must be submitted by March 31 of the year of admission.",
    "confidence": "中",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验的官方国际学生全日制本科项目清单未列医学或生命科学本科项目，未公布 Cambridge A-Level 专业门槛。",
        "noteEn": "The official international-student full-time undergraduate programme list does not include medicine or a life-science undergraduate programme. No Cambridge A-Level subject or grade requirement has been published.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验的官方国际学生全日制本科项目清单未列法律本科项目，未公布 Cambridge A-Level 专业门槛。",
        "noteEn": "The official international-student full-time undergraduate programme list does not include a law undergraduate programme. No Cambridge A-Level subject or grade requirement has been published.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Bachelor of Science in Information and Communication Technology：官方未公布 Cambridge International A-Level 等级或数学、计算机等先修科目要求；适用国际资格通用资格与标准化考试要求。",
        "noteEn": "For the Bachelor of Science in Information and Communication Technology, SUSS has not published Cambridge A-Level grades or Mathematics/Computer Science subject requirements. The general qualification and assessment requirements apply.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验的官方国际学生全日制本科项目清单未列工程本科项目，未公布 Cambridge A-Level 专业门槛。",
        "noteEn": "The official international-student full-time undergraduate programme list does not include an engineering undergraduate programme. No Cambridge A-Level subject or grade requirement has been published.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布 Cambridge International A-Level 等级或具体科目要求。适用项目包括会计、金融、市场营销、供应链管理及商业分析；IGP 仅为 Singapore-Cambridge A-level UAS 参考，不用于推定 Cambridge International A-Level 等级。",
        "noteEn": "For the Bachelor of Accountancy and the Bachelor of Science programmes in Finance, Marketing, Supply Chain Management and Business Analytics, SUSS has not published Cambridge A-Level grades or specific subject requirements. The IGP refers only to Singapore-Cambridge A-level UAS and must not be used to infer Cambridge International A-Level grades.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布 Cambridge International A-Level 等级或科学科目先修要求。Bachelor of Science in Psychology 的官方资料未公布 Psychology 或其他 A-Level 先修科目要求。",
        "noteEn": "For the Bachelor of Science in Psychology, SUSS has not published Cambridge A-Level grades or Psychology/other prerequisite subject requirements. Applicants must place Psychology as their first or second choice to enter interview screening.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验的官方国际学生全日制本科项目清单未列设计本科项目，未公布 Cambridge A-Level 专业门槛。",
        "noteEn": "No design-specific Cambridge A-Level grade or subject requirement has been published in the official international-student full-time undergraduate programme list.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布 Cambridge International A-Level 等级或具体科目要求。相关方向项目包括中文研究、幼儿教育、人力资源管理、公共安全与保安及社会工作。",
        "noteEn": "For the Bachelor of Arts in Chinese Studies and related arts, humanities and social-work programmes, SUSS has not published Cambridge A-Level grades or specific subject requirements. Relevant programmes may include interviews or selective assessments.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布 Cambridge International A-Level 等级或教育类先修科目要求。Bachelor of Early Childhood Education 属已核验项目。",
        "noteEn": "For the Bachelor of Early Childhood Education, SUSS has not published Cambridge A-Level grades or specific subject requirements. The programme may include an interview or selective assessment.",
        "extras": []
      }
    }
  },
  "hku": {
    "profileType": "course_specific",
    "generalProfile": "null；香港大学官方国际资格系统明确列出“GCE A-level / International A-level”，但未公布适用于全校所有课程的统一 Cambridge International A-Level 最低等级；录取按课程及申请人整体竞争力评估。",
    "generalProfileEn": "HKU’s official international-qualifications system lists “GCE A-level / International A-level,” but does not publish a single minimum Cambridge International A-Level grade requirement applicable to all programmes. Assessment is based on the programme and the applicant’s overall competitiveness.",
    "englishSummaryZh": "官方要求通常为IELTS Academic总分6.5（同一次考试）或TOEFL iBT 93；亦接受Cambridge English：C1 Advanced Grade C或总分180、C2 Proficiency Level C1或总分180。具体豁免及替代资格以HKU官方英语要求表为准；未证实仅凭Cambridge International A-Level英语科目即可普遍豁免。",
    "englishSummaryEn": "IELTS Academic overall 6.5 in one sitting; TOEFL iBT 93; HKU also lists Cambridge English: C1 Advanced Grade C or an overall score of 180, and C2 Proficiency Level C1 or an overall score of 180. Specific exemptions or alternative qualifications are subject to HKU’s official English Language Requirement table. HKU has not confirmed a general exemption based solely on a Cambridge International A-Level English subject.",
    "applicationSummaryZh": "2026入学国际资格申请截止：2026年8月21日香港时间中午；首轮评估截止为2025年11月26日香港时间中午，此后滚动评估。",
    "applicationSummaryEn": "For 2026 entry, the international-qualifications application deadline is 21 August 2026 at noon Hong Kong time. The first-round assessment deadline was 26 November 2025 at noon Hong Kong time; applications submitted afterwards are assessed on a rolling basis.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用统一等级档案：HKUMed未公布Cambridge International A-Level统一公开等级门槛，也未列出可核实的A-Level具体科目等级；非本地申请者须 exceptionally well qualified，并要求良好英语及粤语能力，可能获邀面试。",
        "noteEn": "Medicine/MBBS: No single public Cambridge International A-Level grade threshold has been published. HKUMed states that non-local applicants must be exceptionally well qualified and have good English and Cantonese proficiency. Interviews may be offered based on individual performance. No specific A-Level subject grades are published.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布可核实的统一Cambridge International A-Level等级门槛及科目组合；按具体课程和当年竞争情况评估。",
        "noteEn": "No single public Cambridge International A-Level grade threshold or uniform subject combination has been published; assessment is based on the specific programme and the applicant’s competitiveness.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布可核实的统一Cambridge International A-Level等级门槛及科目组合；需按Computing and Data Science具体课程查询。",
        "noteEn": "No single public Cambridge International A-Level grade threshold has been published. Computing and Data Science programmes have separate admissions information and quota arrangements; consult the relevant programme page.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布可核实的统一Cambridge International A-Level等级门槛及科目组合；具体课程要求需在HKU国际资格招生系统查询。",
        "noteEn": "No single public Cambridge International A-Level grade threshold has been published. The Expected Lower Boundary and Subject Requirements must be checked for the specific programme in HKU’s international-qualifications admissions system.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布可核实的统一Cambridge International A-Level等级门槛及科目组合；按具体课程和当年竞争情况评估。",
        "noteEn": "No single public Cambridge International A-Level grade threshold or uniform subject combination has been published for Business/Economics; assessment depends on the specific programme and the competition in that year.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": "1A* 2A",
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方仅给出2025 Science/BSc的GCEAL参考最低录取分数“1A* 2A”，未将其表述为全校或所有科学课程的普适最低门槛；Science Master Class另有GCEAL参考“4A*”，不作为一般录取门槛。",
        "noteEn": "Science/BSc: the official 2025 GCEAL reference minimum admission result was 1A* 2A, but this was not stated as a universal minimum. The Science Master Class reference was 4A*. The official material does not establish universal Cambridge A-Level subject prerequisites.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验研究未列出可对应的Design课程等级门槛或Cambridge A-Level科目规则。",
        "noteEn": "No verified, programme-specific Cambridge International A-Level threshold, subject combination, or general portfolio requirement has been published in the research.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布可核实的统一Cambridge International A-Level等级门槛及科目组合；Arts & Humanities按具体课程和当年竞争情况评估。",
        "noteEn": "Arts & Humanities: No single public Cambridge International A-Level grade threshold or uniform subject combination has been published; assessment depends on the specific programme and the competition in that year.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验研究未列出可对应的Education课程等级门槛或Cambridge A-Level科目规则。",
        "noteEn": "No verified, programme-specific Cambridge International A-Level threshold, subject combination, or general requirement has been published in the research.",
        "extras": []
      }
    }
  },
  "cuhk": {
    "profileType": "passes_only",
    "generalProfile": "3AL passes / 2AL+2AS passes；官网明确列为 GCE AL / International AL 的通用最低资格，且注明不同专业有不同科目要求；满足最低要求不保证录取。",
    "generalProfileEn": "For GCE AL / International AL applicants, the general minimum qualification is 3AL passes or 2AL+2AS passes. Different programmes may have different subject requirements. Meeting the minimum requirement does not guarantee admission.",
    "englishSummaryZh": "国际/非本地本科页面列明GCE AL/AS English最低为E；IELTS Academic总分6.0；TOEFL iBT为80（2026-01-21前考试），或新制要求4.5/6及总分80/120（之后考试）；SAT证据循证阅读与写作590，ACT ELA 23。LLB另要求IELTS 7.0或TOEFL 5.5/6或100/120。中文通常不要求，个别课程例外。",
    "englishSummaryEn": "For GCE AL / AS English, the minimum is Grade E. Other accepted benchmarks include IELTS (Academic) 6.0 overall; TOEFL iBT 80 total for tests before 2026-01-21, or 4.5/6 and 80/120 overall for tests on or after 2026-01-21; and SAT Evidence-Based Reading and Writing 590 or ACT ELA 23. The LLB requires IELTS 7.0 or Internet-Based TOEFL 5.5/6 or 100/120. Chinese is generally not required, subject to programme exceptions.",
    "applicationSummaryZh": "2026入学：Advance Offer Round截止2025-11-13；Regular Round截止2026-01-08；Extended Deadline截止2026-05-29。",
    "applicationSummaryEn": "For 2026 entry: Advance Offer Round — 2025-11-13; Regular Round — 2026-01-08; Extended Deadline — 2026-05-29.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [
          "chemistry",
          "biology"
        ],
        "noteZh": "MBChB要求修读4门AL（Chinese、EPQ不计），其中Chemistry或Biology至少一门；两者兼修更佳。至少3门AL须在12个月内cash-in。官网未公布MBChB通用最低等级，不将Global Physician-Leadership Stream的A* all subjects及平均分至少97%外推为MBChB通用门槛。",
        "noteEn": "Medicine (MBChB): applicants should take 4 AL subjects; Chinese and EPQ are not counted. Chemistry or Biology is required, with both preferred. At least 3 AL subjects must be cashed in within 12 months. No general minimum grade is published. The Global Physician-Leadership Stream separately lists A* in all subjects and an average of at least 97%.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": "AAA in 3 non-language GCE/IAL Advanced Level subjects，或 English + 2 non-language GCE/IAL Advanced Level subjects",
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "LLB官网明确列出至少AAA，且应在one sitting；科目规则为非语言科目，或English加两门非语言AL科目。BCI 可选课程中未指定必修或推荐科目。",
        "noteEn": "LLB: at least AAA in 3 non-language GCE/IAL Advanced Level subjects, or English plus 2 non-language GCE/IAL Advanced Level subjects, normally in one sitting. The official page states that most admitted applicants in the past exceeded this threshold.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Computer Science / Computer Science and Engineering的国际A-Level项目级最低等级及统一科目要求未在已核验官方页面公布；仅适用全校3AL passes / 2AL+2AS passes，并须按具体项目核验。",
        "noteEn": "For Computer Science and Computer Science and Engineering, no programme-level minimum grades have been published. The CUHK general requirement of 3AL passes / 2AL+2AS passes applies, with programme subject requirements to be checked separately.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": "Grade A in Mathematics，或 Further Mathematics Grade B or above",
        "requiredSubjects": [],
        "recommendedSubjects": [
          "furtherMathematics",
          "mathematics",
          "biology",
          "chemistry",
          "physics"
        ],
        "noteZh": "以BSc Mathematics and Information Engineering为代表：Further Mathematics优先，或Mathematics加上Biology、Chemistry、Computer Science、Physics至少一门；Mathematics要求Grade A，或Further Mathematics要求Grade B或以上。",
        "noteEn": "For the representative BSc Mathematics and Information Engineering programme, Further Mathematics is preferred, or Mathematics plus at least one of Biology, Chemistry, Computer Science or Physics. Mathematics requires Grade A, or Further Mathematics requires Grade B or above. Shortlisted applicants also attend an interview and Math quiz.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "商科/经济类International A-Level统一项目级最低等级及科目组合未在已核验官方页面公布；适用全校3AL passes / 2AL+2AS passes，具体项目另行评估。",
        "noteEn": "For Business/Economics programmes, no uniform programme-level minimum grades or subject combination have been published. The CUHK general requirement of 3AL passes / 2AL+2AS passes applies, with assessment also made for the specific programme.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "已核验研究未公布可归入一般Science类别的统一课程级A-Level等级或科目规则；不能将医学MBChB要求外推至一般科学项目。",
        "noteEn": "For Psychology, no programme-level minimum grades or prerequisite subjects for International A-Level have been published. The CUHK general requirement applies, with assessment based on the individual application and competition.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "已核验官方研究未识别或公布可归入Design类别的课程级A-Level等级或BCI 可选课程规则，不适用。",
        "noteEn": "For the relevant arts, humanities and social science programmes, no programme-level minimum grades or prerequisite subjects for International A-Level have been published. The CUHK general requirement applies; individual programmes may have language or programme-specific requirements.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "文社人文项目的International A-Level项目级最低等级及统一先修科目未在已核验官方页面公布；适用全校通用门槛，个别课程可能有语言或项目要求。",
        "noteEn": "For the relevant arts, humanities and social science programmes, no programme-level minimum grades or prerequisite subjects for International A-Level have been published. The CUHK general requirement applies; individual programmes may have language or programme-specific requirements.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "已核验官方研究未识别或公布可归入Education类别的课程级A-Level等级或BCI 可选课程规则，不适用。",
        "noteEn": "No programme-level Cambridge A-Level minimum grades or subject requirements were published in the verified official materials for Education. Do not infer additional requirements; apply the CUHK general requirement of 3AL passes / 2AL+2AS passes and check the specific programme.",
        "extras": []
      }
    }
  },
  "hkust": {
    "profileType": "passes_only",
    "generalProfile": "Passes in at least three Advanced Level (AL) subjects in the GCEAL/International AL examinations；官方通用最低门槛为高中毕业且至少通过三门 AL 科目。2025 intake 中间50%参考区间为 144–168（AAA 至 3A*），属于竞争性参考而非最低录取线。",
    "generalProfileEn": "High school graduates must have passes in at least three Advanced Level (AL) subjects in the GCEAL/International AL examinations. For the 2025 intake, the middle-50% competitive reference range was 144–168 (AAA to 3A*); this is a competitive reference, not a minimum admission requirement.",
    "englishSummaryZh": "须满足港科大 English Language Requirements。官方公开门槛包括 IELTS 6.0 或同等成绩、TOEFL iBT 60。当前已核验国际资格页面未直接公布 GCE AS/A-Level English 的具体等级及完整豁免规则；申请人须提交英语能力证明，Cambridge International A-Level 不自动构成英语豁免。",
    "englishSummaryEn": "Applicants must satisfy the HKUST English Language Requirements and submit proof of English language proficiency. Publicly stated thresholds include IELTS 6.0 (or equivalent) and TOEFL iBT 60. The specific GCE AS or A-Level English grades and complete exemption rules were not directly verifiable on the current official international qualifications page; Cambridge International A-Level is not automatically treated as an English-language exemption.",
    "applicationSummaryZh": "2026/27 intake 官方申请轮次：Early Round 截止 2025-11-20；Main Round 截止 2026-01-08；Late Round 截止 2026-06-30。",
    "applicationSummaryEn": "For the 2026/27 intake: Early Round — 20 Nov 2025; Main Round — 8 Jan 2026; Late Round — 30 Jun 2026.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：港科大官方本科项目列表及国际资格页面未列医学学位，未公布医学 A-Level 课程规则。",
        "noteEn": "HKUST does not offer a medicine degree; no official requirement was published.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：官方本科项目列表及国际资格页面未列 Law/LLB 项目，未公布法律 A-Level 规则。",
        "noteEn": "HKUST's official undergraduate programme list and international qualifications pages do not list a Law/LLB programme; no official requirement was published.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "physics",
          "chemistry",
          "biology"
        ],
        "noteZh": "官方未公布该方向统一等级组合；Computer Science and Engineering、BEng in Computer Engineering 要求 senior level Mathematics，另加 Physics、Chemistry、Biology 或 Computer Science 其中一门。因 Computer Science 不在允许映射科目范围内，未将其写入结构化科目字段。面试非强制。",
        "noteEn": "For Computer Science and Engineering and BEng in Computer Engineering: Senior level Mathematics plus one of Physics, Chemistry, Biology or Computer Science. Interview is not compulsory.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "physics",
          "chemistry",
          "biology"
        ],
        "noteZh": "官方未公布工程统一等级组合；代表性工程院系要求 senior level Mathematics，另加 Physics、Chemistry、Biology 或 Computer Science 其中一门。因 Computer Science 不在允许映射科目范围内，未将其写入结构化科目字段。面试非强制。",
        "noteEn": "Representative engineering requirements: Senior level Mathematics plus one of Physics, Chemistry, Biology or Computer Science. Interview is not compulsory.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布商科或经济项目的具体等级组合及科目要求；相关页面标示 No specific subject requirements，面试非强制。",
        "noteEn": "For Business and Management and business/economics programmes: No specific subject requirements. Interview is not compulsory.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [
          "chemistry",
          "biology"
        ],
        "noteZh": "官方未公布科学方向统一等级组合。生命科学代表性项目中，BSc in Biomedical and Health Sciences 要求 Chemistry 或 Biology 的一门 senior level 科目；Science Group B（包括生化、生物技术等）要求 Chemistry 或 Biology。",
        "noteEn": "For BSc in Biomedical and Health Sciences: one senior level subject from Chemistry or Biology; interview is compulsory. For Science Group B, including biochemistry and biotechnology, Chemistry or Biology is required; interview is not compulsory.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验研究未列港科大设计本科项目，未公布设计 A-Level 规则。",
        "noteEn": "No official design-specific Cambridge International A-Level requirement was published in the reviewed material.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布艺术/人文方向等级组合；School of Humanities and Social Science 的代表性项目（BSc in Global China Studies、BSc in Quantitative Social Analysis）标示 No specific subject requirements，面试非强制。",
        "noteEn": "For the School of Humanities and Social Science, including BSc in Global China Studies and BSc in Quantitative Social Analysis: No specific subject requirements. Interview is not compulsory.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验研究未列港科大教育本科项目，未公布教育 A-Level 规则。",
        "noteEn": "No official education-specific Cambridge International A-Level requirement was published in the reviewed material.",
        "extras": []
      }
    }
  },
  "cityu": {
    "profileType": "passes_only",
    "generalProfile": "Grade E or above in three GCE A Level (or A2) / International A Level subjects；两门 AS 可折算一门 A-Level，且同一科目不得同时计入 A-Level 与 AS。",
    "generalProfileEn": "Three GCE A Level (or A2) / International A Level subjects at Grade E or above. Two AS subjects may be counted as one A Level; the same subject must not be counted at both A Level and AS. CityUHK explicitly accepts GCE A Level/International A Level, but does not separately name Cambridge International A-Level.",
    "englishSummaryZh": "一般 GCE 路径要求 GCSE English Language 或 English Literature 达 Grade C/Grade 4，或 TOEFL iBT 79，或 IELTS 总分 6.5；若入学资格所用教育并非英语授课，须提交认可英语测试。法学学士要求更高：IELTS 7.0 或 TOEFL iBT 100，或官方列示的等效替代要求。",
    "englishSummaryEn": "For the general GCE route, Grade C / Grade 4 or above in GCSE English Language or English Literature, or TOEFL iBT 79, or IELTS overall 6.5. Applicants whose qualifying education was not taught in English must submit a recognised English test. The Bachelor of Laws has a higher programme-specific threshold: IELTS 7.0 or TOEFL iBT 100, or an equivalent published alternative.",
    "applicationSummaryZh": "2026/27 Semester A：Early Round 截止 2025-11-15；Main Round 截止 2026-01-15；2026-01-16 起为 Late Round applications and offers。日期可能按年度更新。",
    "applicationSummaryEn": "For the 2026/27 cycle: 15 November 2025 (Early Round); 15 January 2026 (Main Round, Semester A 2026/27); and Late Round applications and offers from 16 January 2026. Dates may change by year.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": "Grade C in Mathematics, Biology and Chemistry at GCE A-level (or A2) or International A-level",
        "requiredSubjects": [
          "mathematics",
          "chemistry",
          "biology"
        ],
        "recommendedSubjects": [],
        "noteZh": "以 Bachelor of Veterinary Medicine 为已核验代表性医学/生命科学课程；该课程明确要求数学、生物、化学各科 Grade C。其他医学或生命科学课程的统一专项等级档案未公布。",
        "noteEn": "Bachelor of Veterinary Medicine: Grade C in Mathematics, Biology and Chemistry at GCE A-level (or A2) or International A-level. No unified Cambridge/International A-Level requirement was found for other life-science programmes.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "须满足全校 general entrance requirements；已核验页面未公布 Cambridge/International A-Level 专项总分或科目门槛。Bachelor of Laws 另有更高英语要求。",
        "noteEn": "Bachelor of Laws: must meet the general entrance requirements. Programme-specific English threshold: IELTS 7.0 or TOEFL iBT 100, or IB English 6, IGCSE English First Language B/6, Second Language A/7, or HKDSE English 5. No Cambridge A-Level overall score was published.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方招生总则覆盖 GCE A Level/International A Level，但已核验官方页面未公布计算机类统一的 Cambridge/International A-Level 专项等级或科目组合。",
        "noteEn": "The general admissions rules cover GCE A Level/International A Level. No programme-specific Cambridge/International A-Level grades or subject combination were uniformly published for computing programmes.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [],
        "noteZh": "代表性工程课程（如 BEng Architectural Engineering、BEng Civil Engineering）要求或接受 GCE A-Level Mathematics Grade C or above；未公布统一工程类 A-Level 总分组合。",
        "noteEn": "Representative programmes such as BEng Architectural Engineering and BEng Civil Engineering require or accept GCE A-Level Mathematics at Grade C or above. No unified Cambridge requirement for all engineering programmes was published.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方招生总则适用 GCE A Level/International A Level；已核验官方页面未公布商科经济类统一 Cambridge/International A-Level 等级或先修科目。",
        "noteEn": "The general admissions rules cover GCE A Level/International A Level. No programme-specific Cambridge/International A-Level grades or prerequisite subjects were uniformly published for business and economics programmes.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "除兽医学代表课程外，已核验官方页面未公布科学类统一 Cambridge/International A-Level 等级或先修科目；具体课程以课程页为准。",
        "noteEn": "No unified Cambridge/International A-Level grades or prerequisite subjects were published for the representative psychology or other science-related programmes reviewed.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "已核验官方页面未公布设计类统一 Cambridge/International A-Level 等级或先修科目；School of Creative Media 强烈建议或要求通过在线系统提交作品集。",
        "noteEn": "No programme-specific Cambridge/International A-Level grades or prerequisite subjects were published for design programmes reviewed.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方招生总则适用 GCE A Level/International A Level；已核验官方页面未公布文社人文类统一 Cambridge/International A-Level 等级或先修科目。",
        "noteEn": "The general admissions rules cover GCE A Level/International A Level. No programme-specific Cambridge/International A-Level grades or prerequisite subjects were uniformly published for arts and humanities programmes.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验研究中未找到 CityUHK 教育类课程的官方 A-Level 规则。",
        "noteEn": "No programme-specific Cambridge/International A-Level grades or prerequisite subjects were published for education programmes reviewed.",
        "extras": []
      }
    }
  },
  "polyu": {
    "profileType": "published_grade",
    "generalProfile": "GCE A-Level / International A-Level subjects with Grade B or above in 3 AL subjects",
    "generalProfileEn": "GCE A-Level / International A-Level: Grade B or above in 3 AL subjects. The official international/other qualifications pages explicitly accept Cambridge/International A-Level and use this as the general threshold. This is not a guaranteed offer or a programme-specific minimum.",
    "englishSummaryZh": "非本地申请人须满足英语要求。GCE/International AS或A-Level可用English、English Language或English Literature达到Grade E或以上；也可用TOEFL iBT 80（一次考试）或IELTS Academic总分6.0（一次考试）等，具体课程可能另有规定。",
    "englishSummaryEn": "Non-local applicants must meet the English requirement. For GCE / International AS or A-Level, English, English Language or English Literature at Grade E or above is accepted. TOEFL iBT 80 (in one sitting) or IELTS Academic overall 6.0 (in one sitting), among other options, may also be accepted. Individual programmes may impose additional requirements.",
    "applicationSummaryZh": "2026年9月入学International / Other Qualification申请截止日为2026-05-15；官方同时列Early Round 2025-11-19及Main Round 2026-02-05。",
    "applicationSummaryEn": "For Sept 2026 Entry under International / Other Qualification, the application deadline is 2026-05-15. The same information also lists an Early Round deadline of 2025-11-19 and a Main Round deadline of 2026-02-05.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验的PolyU官方国际本科课程及偏好科目资料未列医学学位，未公布医学专业A-Level等级或先修科目要求。",
        "noteEn": "No independent medicine undergraduate programme was identified on PolyU's official international undergraduate programme or preferred-subject pages; no official requirement is published.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验的PolyU官方国际本科课程及偏好科目资料未发现独立LLB或法律学位，未公布法律专业A-Level等级或先修科目要求。",
        "noteEn": "No independent LLB or law degree was identified on PolyU's official international undergraduate programme or preferred-subject pages; no programme requirement is published.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [
          "mathematics"
        ],
        "noteZh": "官方未公布计算机相关专业最低A-Level等级。Computer and Mathematical Sciences整体及Computing and AI组合标示无偏好科目；Applied Mathematics and Finance Analytics偏好English Language及Mathematics。因English Language不属于允许映射的BCI 可选课程，唯一可映射的偏好科目为mathematics。",
        "noteEn": "Computer and Mathematical Sciences has no preferred subjects overall. Applied Mathematics and Finance Analytics prefers English Language and Mathematics. The Computing and AI combination has no preferred subjects. No programme-specific minimum A-Level grade is published.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [
          "mathematics",
          "physics",
          "chemistry",
          "biology"
        ],
        "noteZh": "官方未公布工程专业最低A-Level等级。代表性课程显示科目偏好：Aviation Engineering偏好Mathematics、Physics或其他STEM科目；Civil Engineering涉及Physics、Chemistry、Mathematics and Calculus；Biomedical Engineering涉及Biology、Chemistry、Mathematics、Physics。由于研究资料将其表述为偏好而非硬性先修，统一放入recommended_subjects。",
        "noteEn": "Aviation Engineering prefers English, Mathematics, Physics or other STEM subjects such as Chemistry, Computer Science and Electronics. Civil Engineering prefers Physics, Chemistry, Mathematics and Calculus. Biomedical Engineering prefers Biology, Chemistry, Mathematics and Physics. No programme-specific minimum A-Level grade is published.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布Business Administration及相关组合的专业最低A-Level等级；已核验课程均标示No preferred subjects。",
        "noteEn": "Business Administration and its Accountancy/Accounting and Finance, Digital Finance, Management and Marketing combinations are marked as having no preferred subjects. No programme-specific minimum A-Level grade is published.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [
          "biology",
          "chemistry",
          "mathematics",
          "physics"
        ],
        "noteZh": "官方未公布科学类专业统一最低A-Level等级。代表性生命科学课程中，Biomedical Engineering偏好Biology、Chemistry、Mathematics and/or Physics；Biotechnology and Chemical Technology的具体A-Level等级门槛未公布。",
        "noteEn": "For the representative life-science programmes, Biomedical Engineering prefers Biology, Chemistry, Mathematics and/or Physics. The specific A-Level grade threshold for Biotechnology and Chemical Technology is not published.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：本次已核验研究未提供可归入Design方向的明确课程等级或BCI 可选课程规则；官方未公布统一设计类A-Level等级门槛。",
        "noteEn": "No unified portfolio requirement for A-Level applicants was identified for the representative programmes reviewed; no official requirement is published.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布Humanities/Arts方向专业最低A-Level等级或BCI 可选课程的先修要求。Humanities组合涵盖Chinese History and Culture、English and Applied Linguistics、Language Science and Technology、Speech Therapy，但偏好科目资料未公布。",
        "noteEn": "The Humanities combination covers Chinese History and Culture, English and Applied Linguistics, Language Science and Technology, and Speech Therapy. Preferred subjects and programme-specific minimum A-Level grades are not published.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验的PolyU官方国际本科课程及偏好科目研究未提供独立Education方向课程或相应A-Level等级、先修科目要求。",
        "noteEn": "No education-specific A-Level requirement was identified in the reviewed official international undergraduate programme and preferred-subject information; no official requirement is published.",
        "extras": []
      }
    }
  },
  "hkbu": {
    "profileType": "passes_only",
    "generalProfile": "Grade E or above in three AL/IAL subjects；或 Grade E or above in two AL/IAL subjects plus two Advanced Supplementary Level (ASL) subjects（不包括 Chinese 与 English Language，且同一科目不得同时计入 AL 和 ASL）；这是官方一般学历门槛，具体课程另有 Programme Admissions Requirements。",
    "generalProfileEn": "HKBU accepts either Grade E or above in three AL/IAL subjects, or Grade E or above in two AL/IAL subjects plus two Advanced Supplementary Level (ASL) subjects. Chinese and English Language are excluded, and the same subject may not be counted at both AL and ASL. This is the general academic threshold; individual programmes may have additional Programme Admissions Requirements. Selection is holistic, so the minimum threshold is not the actual admission cutoff.",
    "englishSummaryZh": "英国学历路径可用以下任一英语证明：GCE O-Level/GCSE English、English Language 或 English Literature Grade C；IGCSE First Language English Grade C；IGCSE English as a Second Language Grade B；GCE AS/A-Level English Grade E；或其他替代证明。所核官方英国学历条目未公布 IELTS/TOEFL 具体分数。",
    "englishSummaryEn": "For the UK qualification route, HKBU accepts any of the following English evidence: GCE O-Level/GCSE English, English Language or English Literature Grade C; IGCSE First Language English Grade C; IGCSE English as a Second Language Grade B; GCE AS/A-Level English Grade E; or an alternative. Specific IELTS/TOEFL scores were not published in the verified UK-qualification entry.",
    "applicationSummaryZh": "官方未公布统一国际 A-Level 截止日期。2026 国际学生页面仅说明 Early Round 与 Main Round：Early Round 录取自 2025 年 12 月下旬起，未获录取者于 2026 年 1 月下旬与 Main Round 一并考虑。",
    "applicationSummaryEn": "No official unified deadline was published. The 2026 international-student page refers only to an Early Round and a Main Round: Early Round admission begins in late December 2025, while unsuccessful applicants are reconsidered together with the Main Round in late January 2026. No standard international A-Level closing date is stated.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：HKBU本科官方课程列表未见 Medicine；医学类 Cambridge A-Level 专属要求官方未公布。",
        "noteEn": "No Medicine degree was identified in HKBU's official undergraduate programme list, so no Medicine requirement was published. For life science/biomedical studies, the relevant programme is the Bachelor of Chinese Medicine and Bachelor of Science (Hons) in Biomedical Science; its Cambridge International A-Level-specific minimum grades and subject combination were not published. Check the general Grade E threshold and programme requirements.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：HKBU本科官方课程列表未见 LLB/法律学位；法律类 Cambridge A-Level 要求官方未公布。",
        "noteEn": "No LLB or law degree was identified in HKBU's official undergraduate programme list; law-specific Cambridge A-Level requirements were not published.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Business Computing and Data Analytics 等计算/数据课程有课程要求入口，但 Cambridge A-Level 专属最低等级与科目组合官方未公布；不得将 HKDSE Mathematics compulsory part 要求转换为 A-Level 数字门槛。",
        "noteEn": "Computing and data programmes, including Business Computing and Data Analytics, provide programme-requirement information, but their Cambridge A-Level-specific minimum grades and subject combinations were not published. Do not convert the HKDSE Mathematics compulsory-part requirement into an A-Level numerical threshold.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：HKBU本科官方国际招生课程列表未见 Engineering 学位；工程类 Cambridge A-Level 专业门槛官方未公布。",
        "noteEn": "No Engineering degree was identified in HKBU's official international undergraduate programme list; engineering-specific Cambridge A-Level requirements were not published.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "School of Business 采用 broad-based admissions；Bachelor of Business Administration (Hons) 有 Programme Entrance Requirements，但 Cambridge A-Level 专业最低等级及 Economics/Mathematics 强制组合官方未公布。",
        "noteEn": "The School of Business uses broad-based admissions. The Bachelor of Business Administration (Hons) programme page has Programme Entrance Requirements, but no Cambridge A-Level-specific minimum grades or compulsory Economics/Mathematics combination was published.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "相关课程包括 Bachelor of Chinese Medicine and Bachelor of Science (Hons) in Biomedical Science；其 Cambridge A-Level 专属最低等级及先修科目组合官方未公布。",
        "noteEn": "For the relevant biomedical science programme, the Cambridge International A-Level-specific minimum grades and subject combination were not published; Cambridge A-Level-specific prerequisite subjects for Biomedical Science/Chinese Medicine were also not published. Check the general Grade E threshold and programme requirements.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验研究未见可对应的 Design 本科课程或 Cambridge A-Level 专属要求；官方未公布。",
        "noteEn": "No Cambridge A-Level-specific minimum grades, subject combination, or designated prerequisite subjects for design programmes were published in the verified materials.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Faculty of Arts and Social Sciences 采用 broad-based admissions；艺术、人文及社会科学各课程的 Cambridge A-Level 专属最低等级和科目组合官方未公布，统一先按一般 Grade E 门槛核验。",
        "noteEn": "The Faculty of Arts and Social Sciences uses broad-based admissions. Cambridge A-Level-specific minimum grades and subject combinations for arts, humanities and social-science programmes were not published; initially verify the general Grade E threshold.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验研究未见可对应的 Education 本科课程或 Cambridge A-Level 专属要求；官方未公布。",
        "noteEn": "No Cambridge A-Level-specific minimum grades, subject combination, or designated prerequisite subjects for education programmes were published in the verified materials.",
        "extras": []
      }
    }
  },
  "eduhk": {
    "profileType": "passes_only",
    "generalProfile": "Grade D or above in 3 AL subjects；或 Grade D in 2 AL plus 2 Advanced Supplementary Level (ASL) subjects；适用于 GCE Advanced Level (AL) / International Advanced Level (IAL)，不计 Chinese/Mandarin/English Language subjects，同一科目不得同时计入 AL 与 ASL。",
    "generalProfileEn": "Grade D or above in 3 AL subjects; or Grade D in 2 AL subjects plus 2 Advanced Supplementary Level (ASL) subjects. This applies to GCE Advanced Level (AL) / International Advanced Level (IAL). Chinese/Mandarin/English Language subjects are not counted, and the same subject may not be counted at both AL and ASL.",
    "englishSummaryZh": "官方要求 IELTS Academic 总分6.0；不接受 IELTS one-skill retake，须在考试中心应考且成绩自考试日起两年内有效。PTE Academic 总分须达到62分或以上。官网列有 TOEFL iBT（机构代码5225），但已核验摘录未显示分数阈值，故不填数字。若以 A-Level 英语科目计入门槛，English Language subjects 不计入 GCE AL/IAL 通用门槛。",
    "englishSummaryEn": "IELTS Academic overall Band 6; IELTS one-skill retakes are not accepted, the test must be taken at a test centre, and the result is valid for two years from the test date. PTE Academic overall score 62 or above. TOEFL iBT is listed (Institution Code: 5225), but no score threshold was shown in the verified official extract. English Language subjects do not count toward the GCE AL/IAL general threshold.",
    "applicationSummaryZh": "2026/27 国际申请 late-round 列示截止日为2026年5月6日；申请按 rolling basis，官网注明截止后仍可能视名额接受申请。",
    "applicationSummaryEn": "The listed late-round deadline for 2026/27 International Applicants is 2026-05-06. Applications are considered on a rolling basis, and the university states that applications may still be accepted after the deadline subject to available places.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：EdUHK本科课程清单未公布可核验的医学专业；官方亦未公布医学方向的 Cambridge A-Level 专业等级或先修科目。",
        "noteEn": "Officially not published; no Cambridge-specific grade or subject prerequisite was verified for a medicine or life-science programme. The general GCE AL/IAL threshold is Grade D or above in 3 AL subjects.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布法律方向的 Cambridge A-Level 专业等级或法律先修科目；不得将全校通用门槛改写为法律专业录取等级。",
        "noteEn": "Officially not published; no Cambridge A-Level programme grade or law subject prerequisite was verified.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布计算机方向的 Cambridge A-Level 专业等级或计算机先修科目。",
        "noteEn": "Officially not published; no Cambridge A-Level programme grade or computing subject prerequisite was verified.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布工程方向的 Cambridge A-Level 专业等级或工程先修科目。",
        "noteEn": "Officially not published; no Cambridge A-Level programme grade or engineering subject prerequisite was verified.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布商科/经济方向的 Cambridge A-Level 专业等级或商科、经济先修科目。",
        "noteEn": "Officially not published; no Cambridge A-Level programme grade or business or economics subject prerequisite was verified.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布科学方向的 Cambridge A-Level 专业等级或科学先修科目；研究文件中的 medicine_life_science 亦明确标为官方未公布。",
        "noteEn": "Officially not published; no Cambridge-specific grade or subject prerequisite was verified for a science or life-science programme.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：研究文件未核实到以设计专业类别公布的 Cambridge A-Level 专业等级、先修科目或作品集要求。",
        "noteEn": "Officially not published; no Cambridge A-Level programme grade or design subject prerequisite was verified.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布文社人文/艺术方向的 Cambridge A-Level 专业等级或先修科目；不得将全校通用门槛转写为艺术专业等级。",
        "noteEn": "Officially not published; no Cambridge A-Level programme grade or arts, humanities or social-science subject prerequisite was verified.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布教育方向的 Cambridge A-Level 专业等级或教育先修科目；EdUHK虽为教育大学，但研究文件未给出教育专业类别的专属等级组合。",
        "noteEn": "Officially not published; no Cambridge A-Level programme grade or education subject prerequisite was verified.",
        "extras": []
      }
    }
  },
  "lingnan": {
    "profileType": "passes_only",
    "generalProfile": "Passes in three AL/IAL subjects, excluding Chinese and English language subjects；或 passes in two AL/IAL subjects plus passes in two Advanced Supplementary (AS) subjects（同一科目不得同时计入 A Level 与 AS Level）；官方未公布 A*/A 等级组合。",
    "generalProfileEn": "The university recognises British Patterned GCE Advanced Level / International Advanced Level qualifications. The general minimum is passes in three AL/IAL subjects, excluding Chinese and English language subjects; or passes in two AL/IAL subjects plus passes in two Advanced Supplementary (AS) subjects. The same subject may not be counted toward both A Level and AS Level. No official A*/A grade combination has been published.",
    "englishSummaryZh": "申请阶段须满足校方 International Qualifications PDF 的英语要求。官方国际学历招生页面示例为 IELTS Academic 总分 6.0，接受 One Skill Retake；另列 TOEFL、IB English、GCE/GCSE/IGCSE English 等替代资格，具体豁免及等效资格以官方 PDF 第3节为准。",
    "englishSummaryEn": "Applicants must meet the English Language Requirements in the university's International Qualifications PDF during the application stage. The official admissions page gives IELTS Academic overall 6.0 as an example, with One Skill Retake accepted, and lists TOEFL, IB English, and GCE/GCSE/IGCSE English as alternative qualifications. Exemptions and equivalent qualifications are governed by Section 3 of the official PDF.",
    "applicationSummaryZh": "2026年6月30日为 Final Round Deadline（Non-local），适用于官方本科国际学历申请页面所列申请。",
    "applicationSummaryEn": "Final Round Deadline (Non-local): 30 June 2026, as stated on the official undergraduate international-qualifications admissions page.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：官方本科项目页面未列医学或生命科学专业，亦未公布相关 A-Level 规则。",
        "noteEn": "Not officially published; Lingnan's undergraduate programme page does not list medicine or life science programmes.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布法律本科项目或针对 GCE AL/IAL 的法律先修科目与等级要求。",
        "noteEn": "Not officially published; no undergraduate law programme or law prerequisite for GCE AL/IAL was identified.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布针对 GCE AL/IAL 的计算机相关专业最低成绩或先修科目；Data Science 页面所列 HKDSE Mathematics Compulsory Part Level 3 不得迁移为 A-Level 要求。",
        "noteEn": "Not officially published; the Data Science admissions PDF separately specifies HKDSE Mathematics Compulsory Part Level 3, but that requirement is not for Cambridge International A-Level and cannot be transferred.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布针对 GCE AL/IAL 的工程专业最低成绩或先修科目。",
        "noteEn": "Not officially published; no engineering minimum grade or prerequisite subject for GCE AL/IAL was identified.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布针对 GCE AL/IAL 的商科或经济专业最低成绩或先修科目。",
        "noteEn": "Not officially published; no business or economics minimum grade or prerequisite subject for GCE AL/IAL was identified.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布针对 GCE AL/IAL 的科学类专业最低成绩或先修科目；研究中亦未检出相关专业的 A-Level 分项规则。",
        "noteEn": "Not officially published; no science-specific minimum grade or prerequisite subject for GCE AL/IAL was identified.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布针对 GCE AL/IAL 的设计类专业最低成绩或先修科目。",
        "noteEn": "Not officially published; no design-specific minimum grade or prerequisite subject for GCE AL/IAL was identified.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布针对 GCE AL/IAL 的文社人文或艺术类专业最低成绩或先修科目。",
        "noteEn": "Not officially published; no arts, social sciences, or humanities-specific minimum grade or prerequisite subject for GCE AL/IAL was identified.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布针对 GCE AL/IAL 的教育专业最低成绩或先修科目。",
        "noteEn": "Not officially published; no education-specific minimum grade or prerequisite subject for GCE AL/IAL was identified.",
        "extras": []
      }
    }
  },
  "unimelb": {
    "profileType": "course_specific",
    "generalProfile": "null；官网未公布适用于全校所有课程的统一 A-Level 最低等级；GCE A Levels 为认可的 VCE-equivalent qualification，按课程公布 indicative entry score，并须满足课程先修科目及英语要求。",
    "generalProfileEn": "The University of Melbourne recognises GCE A Levels as a VCE-equivalent qualification. It does not publish one university-wide minimum A-Level grade. Applicants must meet the indicative entry score, prerequisite subjects and English requirement for the selected course. Indicative entry scores are not universal minimums.",
    "englishSummaryZh": "GCE A Levels 可用获认可的 A/AS Level English 科目满足英语要求：General Paper、General Studies、English Language、English Literature 或 English Language and Literature 至少 C。英国 GCSE 与 A Levels 背景可用 GCSE English 至少 B；也可提交 IELTS Academic 6.5（各项至少 6.0）或 TOEFL iBT 81（写作/口语各 19，阅读/听力各 16）等认可考试。部分英语授课背景可按官网规则豁免；Sri Lankan A Levels 不得仅凭 A-Level 英语科目豁免。",
    "englishSummaryEn": "For GCE A Levels, at least grade C is required in one of: AS/A Level General Paper, General Studies, English Language, English Literature, or English Language and Literature. Applicants who completed GCSEs and A Levels in the UK may also use GCSE English at least grade B. Other accepted options include IELTS Academic 6.5 (no band below 6.0) and TOEFL iBT 81 (Writing and Speaking 19; Reading and Listening 16). Exemptions may apply under the University’s citizenship, residency and English-medium education rules. Sri Lankan A Levels require an approved English test and cannot rely only on an A-Level English subject.",
    "applicationSummaryZh": "国际学生直接申请：2026 年年中入学（7 月）截止 2026-05-31；2027 年年初入学（2/3 月）截止 2026-11-30；2027 年年中入学（7 月）截止 2027-05-31。Fine Arts/Music 等需 supplementary tasks 的课程可能更早截止。",
    "applicationSummaryEn": "For direct international applications: Mid-year intake 2026 (Semester 2/July) closes 31 May 2026; Start year intake 2027 (Semester 1/February/March) closes 30 November 2026; Mid-year intake 2027 (Semester 2/July) closes 31 May 2027. Courses requiring supplementary tasks, such as Fine Arts or Music, may close earlier.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": "Bachelor of Biomedicine：ABB (13)；Bachelor of Oral Health：AAA (15)；医学本科/MBBS：未公布（墨尔本大学医学为研究生路径）",
        "requiredSubjects": [
          "mathematics",
          "chemistry"
        ],
        "recommendedSubjects": [
          "biology"
        ],
        "noteZh": "可用于医学相关本科前置路径的官方等级为 Biomedicine ABB (13) 与 Oral Health AAA (15)。Biomedicine 要求 Chemistry + Mathematics；Oral Health 要求 Biology 或 Chemistry。MBBS/JD 等研究生路径不适用直接 A-Level 本科门槛映射。两者均另需获认可的 A/AS Level English 科目；该英语科目不属于BCI 可选课程。",
        "noteEn": "Bachelor of Biomedicine: ABB (13), with Chemistry, Mathematics and an approved A/AS Level English subject. Bachelor of Oral Health: AAA (15), with Biology or Chemistry and an approved A/AS Level English subject at least grade B. No undergraduate Medicine/MBBS A-Level benchmark is published because Medicine is a graduate-entry pathway.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：官网未提供以 A-Level 直接申请本科 LLB/JD 的口径；JD 为研究生课程，需先具备本科或等效高等教育学历。",
        "noteEn": "No undergraduate A-Level benchmark is published for direct entry to an LLB/JD pathway. The JD is a graduate course requiring a prior undergraduate or equivalent higher-education qualification.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": "Bachelor of Science（含计算机相关 major）：BBB (12)",
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "biology",
          "chemistry",
          "physics",
          "furtherMathematics"
        ],
        "noteZh": "官网未单独公布计算机专业 A-Level 分数；计算机相关学习可参考 Bachelor of Science 的 BBB (12)。官方先修组合为 Mathematics + Biology/Chemistry/Physics 之一，或 Mathematics + Further Mathematics。另需获认可的 A/AS Level English 科目。",
        "noteEn": "Bachelor of Science, including computing-related majors: BBB (12), with Mathematics plus one of Biology/Chemistry/Physics, or Mathematics plus Further Mathematics, and an approved A/AS Level English subject. No separate Computing A-Level benchmark is published.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方已核验材料未证实 Bachelor of Engineering 的具体 A-Level 等级或七科范围内先修规则，故不公布等级档案。",
        "noteEn": "No specific official GCE A-Level grade or prerequisite benchmark for the Bachelor of Engineering was confirmed in the available official materials; check the current course entry requirements.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": "Bachelor of Commerce：ABB (13)",
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "economics",
          "business"
        ],
        "noteZh": "Bachelor of Commerce 官方 A-Level benchmark 为 ABB (13)，要求 Mathematics；另需获认可的 A/AS Level English 科目。经济学通常可在 Commerce、Arts 或 Science 中修读，官网未另列独立 Economics A-Level 门槛。",
        "noteEn": "Bachelor of Commerce: ABB (13), with Mathematics and an approved A/AS Level English subject. No separate Economics A-Level benchmark is published; Economics may generally be studied within the Bachelor of Commerce or Bachelor of Arts/Science.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": "Bachelor of Science：BBB (12)",
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "biology",
          "chemistry",
          "physics",
          "furtherMathematics"
        ],
        "noteZh": "Bachelor of Science 官方 A-Level benchmark 为 BBB (12)。先修组合为 Mathematics + Biology/Chemistry/Physics 之一，或 Mathematics + Further Mathematics；另需获认可的 A/AS Level English 科目。",
        "noteEn": "Bachelor of Science: BBB (12), with Mathematics plus one of Biology/Chemistry/Physics, or Mathematics plus Further Mathematics, and an approved A/AS Level English subject.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": "Bachelor of Design：BBB (12)",
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Bachelor of Design 官方 A-Level benchmark 为 BBB (12)，另需获认可的 A/AS Level English 科目；BCI 可选课程中无官方列明的必修科目。",
        "noteEn": "Bachelor of Design: BBB (12), with an approved A/AS Level English subject.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": "Bachelor of Arts：BBC (11)",
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Bachelor of Arts 官方 A-Level benchmark 为 BBC (11)，另需获认可的 A/AS Level English 科目；BCI 可选课程中无官方列明的必修或推荐科目。",
        "noteEn": "Bachelor of Arts: BBC (11), with an approved A/AS Level English subject. Bachelor of Fine Arts and Bachelor of Music require course-specific supplementary requirements, typically including audition/interview tasks; no grade benchmark is stated here.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验官方研究未提供可直接映射的教育类本科 A-Level 等级或BCI 可选课程规则。",
        "noteEn": "No separate Education A-Level benchmark or field-specific requirement is published in the available official research.",
        "extras": []
      }
    }
  },
  "usyd": {
    "profileType": "course_specific",
    "generalProfile": "全校无统一最低 A-Level 等级；官方认可 GCE 3/4 A Levels，录取按最多四门 Advanced Level 科目成绩评估，课程门槛另列。",
    "generalProfileEn": "GCE 3/4 A Levels. The University recognises GCE-comparable Advanced Level qualifications and assesses admission using results from up to four Advanced Level subjects. There is no single minimum A-Level grade requirement applicable to all courses; course-specific thresholds apply. The 2027 International Admission Guide lists course-level GCE 3/4 A Levels equivalent scores.",
    "englishSummaryZh": "本科标准通常为 IELTS Academic 总分 6.5、单项不低于 6.0；部分课程更高，例如 Commerce、Law 为总分 7.0/单项 6.0，Arts and Laws 为 7.5/7.0。认可的、全程英语授课且通常在入学前五年内完成的 Cambridge GCE Advanced Levels 可作为英语能力证明，否则须提交 IELTS、TOEFL iBT、PTE 或 Cambridge English 等合格证明。",
    "englishSummaryEn": "The standard undergraduate requirement is IELTS Academic overall 6.5, with no band below 6.0; some courses require higher scores. For example, Commerce and Law require 7.0 overall/6.0 in each band, Arts requires 6.5/6.0, Arts and Laws requires 7.5/7.0, and the Bachelor of Arts and Doctor of Medicine requires 7.0/7.0. A recognised Cambridge GCE Advanced Level secondary qualification taught entirely in English may demonstrate English proficiency if completed within five years before enrolment; otherwise, an approved IELTS, TOEFL iBT, PTE or Cambridge English result is required.",
    "applicationSummaryZh": "官方未公布统一申请截止日期；要求在对应 University deadline 前提交，具体日期随课程及入学学期而异，应以目标课程页面为准。",
    "applicationSummaryEn": "No single official closing date is published. Applicants must submit by the relevant University deadline; dates vary by course and intake period.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不将官方课程表中的 GCE 3/4 A Levels 20/21 等值分数转换为 A-Level 等级；代表性医学双学位有额外录取标准且竞争性高，具体医学/健康课程及科目先修须查课程页。",
        "noteEn": "Representative Bachelor of Arts and Doctor of Medicine: GCE 3/4 A Levels 20/21 as shown in the official table; additional admission criteria apply. Bachelor of Biomedicine and Health: approximately 15/16. Check the specific course page; no uniform A-Level subject prerequisites are published.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不将 Bachelor of Arts and Bachelor of Laws 的 16/18 或 Bachelor of Commerce and Bachelor of Laws 的 17/19 等值分数转换为 A-Level 等级；官方未公布 Cambridge A-Level 法律科目要求。",
        "noteEn": "Bachelor of Arts and Bachelor of Laws: GCE 3/4 A Levels 16/18. Bachelor of Commerce and Bachelor of Laws: 17/19. No Cambridge A-Level Law subject requirement is published; the applicable undergraduate course standards still apply.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [],
        "noteZh": "不将 Bachelor of Advanced Computing 的 GCE 3/4 A Levels 15/16 等值分数转换为 A-Level 等级；官方课程页明确 Mathematics prerequisite。",
        "noteEn": "Bachelor of Advanced Computing: GCE 3/4 A Levels 15/16. Mathematics is a prerequisite; the specific Cambridge A-Level grade is not separately stated on the course page.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "physics",
          "chemistry"
        ],
        "noteZh": "不将 Bachelor of Engineering Honours 的 GCE 3/4 A Levels 14/14 等值分数转换为 A-Level 等级；课程有 Mathematics prerequisite，部分工程方向要求或建议 Chemistry 和/或 Physics，须查具体课程页。",
        "noteEn": "Bachelor of Engineering Honours, most majors: GCE 3/4 A Levels 14/14. Mathematics is a prerequisite, and some majors require or recommend Chemistry and/or Physics; check the specific course page.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不将 Bachelor of Commerce 的 GCE 3/4 A Levels 17/19 或 Bachelor of Economics 的 14/14 等值分数转换为 A-Level 等级；官方未公布 Cambridge A-Level 统一必修科目。",
        "noteEn": "Bachelor of Commerce: GCE 3/4 A Levels 17/19. Bachelor of Economics: 14/14. No uniform Cambridge A-Level subject prerequisite is published; some courses may have Mathematics assumed knowledge or a prerequisite.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：研究文件未提供可直接映射为该方向的官方 A-Level 等级档案或统一科目规则；相关生命科学课程的 GCE 等值分数不转换为等级。",
        "noteEn": "No single science benchmark or uniform Cambridge A-Level subject prerequisite is published in the research. Check the specific course page for course-level requirements.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：研究文件未提供设计方向的官方 A-Level 等级档案或统一七科范围内科目规则。",
        "noteEn": "No uniform design benchmark or Cambridge A-Level subject prerequisite is published in the research. Any portfolio, audition or interview requirement should be checked on the specific course page.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不将 Bachelor of Arts 的 GCE 3/4 A Levels 12/12 或 Bachelor of International Studies/Languages 的 14/14 等值分数转换为 A-Level 等级；官方未列统一 A-Level 科目先修。",
        "noteEn": "Bachelor of Arts: GCE 3/4 A Levels 12/12. Bachelor of International Studies/Languages: 14/14. No uniform Cambridge A-Level subject prerequisite is published.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：研究文件未提供教育方向的官方 A-Level 等级档案或统一七科范围内科目规则。",
        "noteEn": "No single education benchmark or uniform Cambridge A-Level subject prerequisite is published in the research. Check the specific course page for course-level requirements.",
        "extras": []
      }
    }
  },
  "anu": {
    "profileType": "rank_conversion",
    "generalProfile": "null（官方未发布统一 Cambridge A-Level 等级组合；GCE A Levels 按 best 3 subjects 13 或 best 4 subjects 14 换算 entrance rank，A*=6、A=5、B=4、C=3、D=2、E=1；一览表最低 indicative entrance rank 为 80，不应视为所有专业的保证线。）",
    "generalProfileEn": "Program Required Entrance Rank 80 and above. GCE A Levels are calculated using the best 3 subjects (13) or best 4 subjects (14): A*=6, A=5, B=4, C=3, D=2, E=1. This is the lowest indicative rank shown in the table, not a university-wide guaranteed threshold; applicants must also meet the relevant program requirements, and admission is competitive.",
    "englishSummaryZh": "本科英语要求可通过以英语完成的中学/高等教育、认可英语考试，或特定英语国家公民及教育经历满足。Cambridge C1 Advanced：2027年1月1日前入学总分176，读写听说及Use of English各169；自该日起总分169，Reading 163、Writing 170、Listening 163、Speaking 179。英语政策称不提供豁免，具体项目可能要求更高标准。",
    "englishSummaryEn": "Undergraduate English requirements may be met through prior secondary or tertiary education in English, an accepted English test, or citizenship and education in a specified English-speaking country. Cambridge C1 Advanced: for entry before 1 January 2027, Overall 176 with at least 169 in Reading, Writing, Listening, Speaking and Use of English; from 1 January 2027, Overall 169, Reading 163, Writing 170, Listening 163, Speaking 179. No waivers are available; some programs may require higher scores.",
    "applicationSummaryZh": "国际直接申请截止：2026年第二学期为2026-06-14；2027年第一学期为2026-12-15；2027年第二学期为2027-05-15。录取接受截止另计：第一学期海外2027-01-15、澳洲境内2027-01-31；第二学期海外6月30日、澳洲境内7月10日。",
    "applicationSummaryEn": "Semester 2 2026: 14 June 2026 (international direct application closing date; additional selection programs may differ). Semester 1 2027: 15 December 2026. Semester 2 2027: 15 May 2027. Offer-acceptance deadlines are separate: Semester 1—15 January 2027 overseas, 31 January 2027 in Australia; Semester 2—30 June overseas, 10 July in Australia.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "医学/生命科学方向未公布独立的 Cambridge A-Level 等级门槛，也未在已核验官方研究中确认统一 A-Level 强制科目；须按具体课程的 program-specific entrance rank、先修科目及可能的附加选拔要求审核。",
        "noteEn": "No separate Cambridge A-Level grade threshold has been published. Applicants must meet the program-specific entrance rank; prerequisite subjects should be checked on the relevant Programs and Courses page. No uniform Cambridge A-Level subject combination was verified.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "法律方向未公布独立的 Cambridge A-Level 等级门槛或统一 A-Level 先修科目；适用具体项目的 indicative entrance rank 及项目附加要求。",
        "noteEn": "No separate Cambridge A-Level grade threshold or uniform A-Level prerequisite subjects have been published. The applicable indicative rank and any additional requirements are program-specific.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "计算机方向未公布独立的 Cambridge A-Level 等级门槛或统一 A-Level 科目组合；Bachelor of Computing 课程页仅提示 required/assumed knowledge，已核验研究未确认其对应的 A-Level 强制科目。",
        "noteEn": "No separate Cambridge A-Level grade threshold has been published. The Bachelor of Computing page refers to required or assumed knowledge, but no uniform Cambridge A-Level subject combination was provided on the verified official pages.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "工程方向未公布独立的 Cambridge A-Level 等级门槛或统一 A-Level 强制科目；课程级先修/假定知识须查具体工程项目。",
        "noteEn": "No separate Cambridge A-Level grade threshold has been published. Course-level prerequisites or assumed knowledge must be checked for the specific engineering program; the general Cambridge table provides only entrance-rank conversion.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "商科/经济方向未公布独立的 Cambridge A-Level 等级门槛或统一 A-Level 强制科目；Bachelor of Commerce 课程页列有 assumed knowledge，但已核验研究未确认其为 Cambridge A-Level 强制科目。",
        "noteEn": "No separate Cambridge A-Level grade threshold has been published. The Bachelor of Commerce page lists assumed knowledge, but it was not verified as a compulsory Cambridge A-Level subject requirement.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "科学方向未公布独立的 Cambridge A-Level 等级门槛或统一 A-Level 科目组合；心理学课程明确为 no formal program prerequisites，但未公布 Cambridge A-Level 对应科目。",
        "noteEn": "No separate Cambridge A-Level grade threshold has been published. For psychology, the official Bachelor of Science (Psychology) page states that there are no formal program prerequisites but lists assumed knowledge in Australian-curriculum terms; no Cambridge A-Level equivalent subjects have been published.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "设计方向在已核验官方研究中未确认 Cambridge A-Level 等级门槛、统一先修科目或可映射的科目规则；按课程具体要求审核。",
        "noteEn": "No separate Cambridge A-Level grade threshold or uniform prerequisite subjects have been published for this field.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "文科/人文方向未公布独立的 Cambridge A-Level 等级门槛或统一 A-Level 先修科目；适用具体项目 indicative entrance rank。",
        "noteEn": "No separate Cambridge A-Level grade threshold or uniform prerequisite subjects have been published for arts and humanities. The applicable indicative rank is program-specific.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "教育方向在已核验官方研究中未确认 Cambridge A-Level 等级门槛或统一先修科目；按具体课程的项目要求审核。",
        "noteEn": "No Cambridge A-Level-specific grade threshold, prerequisite subjects, or other field-specific requirement was published in the verified official sources.",
        "extras": []
      }
    }
  },
  "unsw": {
    "profileType": "course_specific",
    "generalProfile": "null；官方未公布全校统一 Cambridge International A-Level 最低等级。UNSW 接受 GCE A-Levels，并按具体课程的国际直接入学分数评估。",
    "generalProfileEn": "UNSW has not published a single university-wide minimum Cambridge International A-Level grade. GCE A-Levels are accepted as an undergraduate secondary-school qualification, and applicants are assessed against course-specific international direct-entry scores. The 2027 official table lists course scores under the GCE AL or NCUK columns. These are course- and year-specific guidance scores and may change.",
    "englishSummaryZh": "需满足所申请课程的英语要求，通常提交开学前两年内的认可考试。IELTS Academic：Arts、Design & Architecture 6.5（各单项6.0）；Business及Law & Justice 7.0（各单项6.0）；Engineering及Science 6.5（各单项6.0）；Medicine & Health 6.5（各单项6.0），但 Bachelor of Medical Studies/MD 为7.0（各单项6.0）。亦认可 TOEFL iBT、PTE、C1 Advanced、C2 Proficiency 等；不得仅凭 Cambridge A-Level 推定豁免。",
    "englishSummaryEn": "Applicants must meet the English requirement for their chosen course and generally provide an approved English test taken within two years before commencement. IELTS Academic thresholds are: Arts, Design & Architecture 6.5 overall with 6.0 in each component; Business and Law & Justice 7.0 overall with 6.0 in each component (Criminology: 6.5 overall with 6.0 in each); Engineering and Science 6.5 overall with 6.0 in each; Medicine & Health 6.5 overall with 6.0 in each, except Bachelor of Medical Studies/MD, which requires 7.0 overall with 6.0 in each. TOEFL iBT, PTE, C1 Advanced Cambridge and C2 Proficiency Cambridge are also recognised. Exemptions based on prior English-medium study must be checked under the official rules; Cambridge A-Level alone does not establish an exemption.",
    "applicationSummaryZh": "2027本科国际申请按 offer round 发布。Term 1 2027 已公布 completed application deadlines 为 2026-05-14、07-16、08-20、09-24；Term 2/3及医学可能不同或 out-of-round，官方建议尽早申请。医学须在 closing date 前通过 UNSW Applicant Portal 申请。",
    "applicationSummaryEn": "For 2027 undergraduate international applications, UNSW publishes offer-round deadlines. Completed applications for Term 1 2027 are due on 2026-05-14, 2026-07-16, 2026-08-20 or 2026-09-24. Term 2, Term 3 and Medicine may have different or out-of-round arrangements. Applicants should apply early; Medicine applications must be submitted through the UNSW Applicant Portal before the applicable closing date. No single Medicine deadline was identified in the verified extracts.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不将官方 2027 表中的 GCE AL 17（Bachelor of Medical Studies/Doctor of Medicine）或 GCE AL 11（Bachelor of Medical Science）转换为等级组合；已核验页面未公布 Cambridge A-Level 必修 Chemistry/Biology 组合。医学申请另有 UCAT ANZ percentile 50+ 或 ISAT 165+，并可能需要面试。",
        "noteEn": "Bachelor of Medical Studies/Doctor of Medicine: GCE AL 17 in the 2027 international undergraduate table; academic selection also requires an equivalent ATAR of 96.00+. Bachelor of Medical Science: GCE AL 11. International Medicine applicants additionally need UCAT ANZ percentile 50+ or ISAT 165+, and may need an interview. No Cambridge A-Level subject combination was officially identified.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不将 Bachelor of Combined Law 的 GCE AL 15 或 Bachelor of Criminology and Criminal Justice 的 GCE AL 10 转换为 A-Level 等级档案；已核验页面未公布 Cambridge A-Level 特定先修科目，且法律课程可能受课程选择与名额影响。",
        "noteEn": "Bachelor of Combined Law: GCE AL 15 in the 2027 table. Bachelor of Criminology and Criminal Justice: GCE AL 10. No Cambridge A-Level subject prerequisites were identified in the verified official pages; course selection and places may also affect admission.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不将 Bachelor of Science (Computer Science) 的 GCE AL 15.0（2026课程页）或 GCE AL 12（2027表）转换为等级档案；已核验页面未确认额外 A-Level 科目硬性要求。",
        "noteEn": "Bachelor of Science (Computer Science): 2026 course-page benchmark A levels 15.0; the 2027 table lists GCE AL 12. The course page states that the best 3 or 4 A2 subjects are counted, with A*=6, A=5, B=4, C=3, D=2 and E=1. No additional compulsory A-Level subjects were confirmed.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [
          "furtherMathematics",
          "physics"
        ],
        "noteZh": "不将 Bachelor of Engineering (Honours) 的 GCE AL 13（2027表；2026课程页为 13.0）转换为等级档案。Mathematics Extension 1 与 Physics 是官方 Assumed knowledge，属于假定知识而非明确的 Cambridge A-Level 硬性最低科目门槛。",
        "noteEn": "Bachelor of Engineering (Honours): GCE AL 13 in the 2027 table; the 2026 course page lists A levels 13.0. Mathematics Extension 1 and Physics are stated as assumed knowledge, not as an expressly published Cambridge A-Level minimum or prerequisite combination.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不将 Bachelor of Commerce 的 GCE AL 17.0（2026课程页）或 GCE AL 15（2027表）转换为等级档案；已核验页面未公布 Cambridge A-Level 特定先修科目。",
        "noteEn": "Bachelor of Commerce: 2026 course-page benchmark A levels 17.0; the 2027 table lists GCE AL 15. Bachelor of Economics: GCE AL 12 in the 2027 table. No Cambridge A-Level subject prerequisite was identified in the verified official pages.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "该方向在已核验研究中没有可直接归入本字段的统一 A-Level 等级组合或七科目硬性规则；不得把其他课程的 GCE AL 分数或排名指标改写为等级档案。",
        "noteEn": "Bachelor of Science (Computer Science) is listed at GCE AL 12 in the 2027 table; see the computing note. Bachelor of Medical Science is listed at GCE AL 11. No broader single Science faculty Cambridge A-Level threshold or subject combination was identified.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "已核验研究仅显示 Bachelor of Architectural Studies 的 GCE AL 12；该数值不是等级组合，故不填 published_grade_profile。具体设计课程可能有作品集或课程特定要求，但未确认统一 Cambridge A-Level 作品集规则。",
        "noteEn": "Bachelor of Architectural Studies: GCE AL 12 in the 2027 table. Specific design courses may have additional requirements, but no uniform Cambridge A-Level portfolio rule was confirmed in the verified material.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不将 Bachelor of Arts 的 GCE AL 10、Bachelor of Politics, Philosophy and Economics 的 GCE AL 12 转换为等级档案；Bachelor of Arts 官方写明无 prerequisite courses，仅假定 Year 12 或同等知识。",
        "noteEn": "Bachelor of Arts: GCE AL 10; Bachelor of Architectural Studies: GCE AL 12; Bachelor of Politics, Philosophy and Economics: GCE AL 12 in the 2027 table. The Bachelor of Arts page states that there are no prerequisite courses, with assumed Year 12 or equivalent knowledge. Specific courses may have additional requirements.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验 UNSW 研究未提供可归入教育方向的具体课程、A-Level 等级组合或七科目规则。",
        "noteEn": "No Cambridge International A-Level benchmark or subject-specific requirement for an Education course was identified in the verified official material. Do not infer an unpublished requirement.",
        "extras": []
      }
    }
  },
  "uq": {
    "profileType": "course_specific",
    "generalProfile": "null；官方未公布统一的“3门 A-Level 最低等级”门槛。UQ 官方 GCE 信息表按 GCE A/AS Level 计算 selection rank：A*=6、A=5、B=4、C=3、D=2、E=1；本科录取须同时满足 eligibility（先修科目等）与 merit（足够高的 selection rank），各课程 threshold 随年度竞争变化。GCE A Level 先修科目最低通过等级为 D 或以上。",
    "generalProfileEn": "No uniform minimum grade requirement for three A Levels has been officially published. UQ’s GCE information sheet converts GCE A/AS Level grades into a selection rank: A*=6, A=5, B=4, C=3, D=2, E=1. Admission requires both eligibility, including prerequisites, and sufficient merit/selection rank; thresholds vary by program and year. The minimum passing grade for GCE A Level prerequisite subjects is D or higher.",
    "englishSummaryZh": "多数 UQ 课程要求雅思总分 6.5，单项不低于 6.0，或认可的等效证明。英语也可通过指定国家英语授课中学教育、认可资格/考试、符合条件的高等教育或英语工作经历证明。医学/MD 要求更高：雅思总分及各单项 7.0；托福 iBT 100（听25、读25、写27、说23）；PTE Academic 总分及各单项 72；OET 各项至少 B，且不接受 BE。",
    "englishSummaryEn": "Most UQ programs require IELTS 6.5 overall with at least 6.0 in each sub-band, or an approved equivalent. English may also be demonstrated through designated-country senior secondary schooling in English, recognised qualifications or tests, qualifying tertiary study, or qualifying English-speaking work experience. The Medicine/MD pathway requires IELTS 7.0 overall and 7.0 in each band; TOEFL iBT 100 overall (L25/R25/W27/S23); PTE Academic 72 overall and in each sub-band; or OET minimum B in each sub-skill. BE is not accepted.",
    "applicationSummaryZh": "Semester 1 国际本科申请窗口截止前一年 11 月 30 日；具体课程可能另有截止日期。Semester 2 的官方本科国际申请页面在本次核验中未稳定显示，具体截止日未公布。",
    "applicationSummaryEn": "Semester 1: 30 November of the previous year for the international undergraduate application window; individual programs may have different deadlines. The official undergraduate international application page did not reliably display a Semester 2 deadline in this research, so no specific deadline was published.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "chemistry",
          "biology"
        ],
        "noteZh": "以 Bachelor of Medical Science/Doctor of Medicine 为代表。官方要求 General English 与 Mathematical Methods 等效先修；Chemistry 和/或 Biology 为推荐而非必需。医学课程的 Cambridge A-Level 统一等级组合未公布，不得将 adjusted ATAR 95 转写为 A-Level 等级。",
        "noteEn": "Bachelor of Medical Science/Doctor of Medicine: adjusted ATAR 95 or equivalent; General English and Mathematical Methods equivalent prerequisites are required. Chemistry and/or Biology are recommended but not required. Direct entry requires a competitive UCAT ANZ score and Multiple Mini-Interview (MMI). No uniform Cambridge International A-Level grade threshold was published.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Bachelor of Laws (Honours) 仅核验到 General English 等效先修要求；具体 Cambridge A-Level 等级组合及课程 threshold 官方未公布。",
        "noteEn": "Bachelor of Laws (Honours): General English equivalent prerequisite. The specific Cambridge International A-Level grade combination and course threshold were not published.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "furtherMathematics"
        ],
        "noteZh": "以 Bachelor of Computer Science 为代表。需 Mathematical Methods 或 Specialist Mathematics 等效先修；具体 Cambridge A-Level 等级及当前课程 entry score 官方未公布。",
        "noteEn": "Bachelor of Computer Science representative requirement: General English and Mathematical Methods or Specialist Mathematics equivalent prerequisite. The specific Cambridge International A-Level grades and current course entry score were not published.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "mathematics",
          "chemistry",
          "physics"
        ],
        "recommendedSubjects": [
          "furtherMathematics",
          "chemistry",
          "physics"
        ],
        "noteZh": "Bachelor of Engineering (Honours) 需 General English、Mathematical Methods，以及 Chemistry 或 Physics 之一的等效先修；具体 Cambridge A-Level 等级组合官方未公布。required_subjects 同时列出化学与物理以表达课程要求的二选一，不表示两科均为硬性必修。",
        "noteEn": "Bachelor of Engineering (Honours): entry score threshold 84 ATAR/Rank; IB 32 is also listed. General English, Mathematical Methods, and Chemistry or Physics equivalent prerequisites are required. Specialist Mathematics and both Chemistry and Physics are recommended. The Cambridge International A-Level course-level grade requirement was not published.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "以 Bachelor of Business Management、Commerce、Economics 为代表。研究仅核验到通常至少需要 General English 等效科目；具体 Cambridge A-Level 等级、课程 threshold 与额外科目官方未公布。",
        "noteEn": "For representative Bachelor of Business Management/Commerce/Economics programs, a General English equivalent prerequisite is typically required. Specific Cambridge International A-Level grades, course thresholds, and additional subject requirements were not published.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "本次已核验研究未提供可归入该方向的独立课程等级组合或七科范围内的明确科目规则；不得依据其他课程或 ATAR 推定。",
        "noteEn": "The UQ GCE table confirms that A-Level Biology, Chemistry, Physics, and Mathematics can satisfy corresponding Queensland prerequisites with an A-Level grade of D or better. No uniform science-program Cambridge International A-Level grade combination was published.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "本次已核验研究未覆盖可用于该方向的 UQ 课程 benchmark；不适用，且未公布 Cambridge A-Level 等级或七科科目规则。",
        "noteEn": "No specific Cambridge International A-Level grade or subject combination, additional test, portfolio, or interview requirement was published in the reviewed material.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "以 Bachelor of Arts 为代表，仅核验到 General English 等效先修要求；具体 Cambridge A-Level 等级组合及课程 threshold 官方未公布。",
        "noteEn": "For the representative Bachelor of Arts, a General English equivalent prerequisite is required. The specific Cambridge International A-Level grades and course threshold were not published.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "本次已核验研究未覆盖可用于该方向的 UQ 教育课程 benchmark；不适用，且未公布 Cambridge A-Level 等级或七科科目规则。",
        "noteEn": "No specific Cambridge International A-Level grade or subject combination, additional test, portfolio, or interview requirement was published in the reviewed material.",
        "extras": []
      }
    }
  },
  "monash": {
    "profileType": "course_specific",
    "generalProfile": "null；Monash 官方一般国际本科页面未公布统一的 Cambridge International A-Level 总成绩门槛，要求按具体课程评估；医学直入另有官方门槛：GCE A Level in other countries best 3 A-Level subjects within 2 years，换算 Equivalent Year 12 需 15 分（A*=5, A=5, B=4, C=3, D=2, E=1，最多计 1 个 A* bonus）。",
    "generalProfileEn": "No single Cambridge International A-Level overall threshold is published for general international undergraduate admission; requirements are assessed by course. For direct-entry Medicine, applicants must present GCE A Level in other countries, with the best 3 A-Level subjects completed within 2 years converted to an Equivalent Year 12 score of 15 (A*=5, A=5, B=4, C=3, D=2, E=1; a maximum of one A* bonus is counted).",
    "englishSummaryZh": "一般国际本科英语要求取决于教育背景，部分课程要求更高；符合官方英语媒介教育经历规则者可满足，否则需认可英语测试或合资格学习经历。医学直入接受 IELTS 7.0（单项不低于6.5）、TOEFL iBT 94（R19/L20/S20/W24）、PTE 65（单项不低于58）；A Level English General Paper 路径为 D。",
    "englishSummaryEn": "English requirements depend on the applicant’s educational background, and some courses have higher requirements. Six years of English-medium schooling completed before age 19 in an English-speaking country may satisfy the policy; otherwise, an approved English test or qualifying study may be required. For direct-entry Medicine, accepted options include IELTS overall 7.0 with no band below 6.5; TOEFL iBT 94 (Reading 19, Listening 20, Speaking 20, Writing 24); PTE Academic 65 with no communicative skill below 58; or D in A Level English General Paper.",
    "applicationSummaryZh": "一般国际本科：官方写明 international students can apply anytime throughout the year。医学直入：须在相关 course application closing date 前完成 ISAT，具体日期按医学 Applications and fees 页面核验；已核页面未给出适用于所有课程的统一截止日期。",
    "applicationSummaryEn": "International undergraduate applications may be submitted anytime throughout the year. Direct-entry Medicine applicants must complete ISAT before the relevant course application closing date; no single date applicable to all courses was published on the page reviewed.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "chemistry"
        ],
        "recommendedSubjects": [
          "biology"
        ],
        "noteZh": "官方医学直入要求 A Level Chemistry minimum D；best 3 A-Level subjects within 2 years 换算 Equivalent Year 12 15。该 15 分是官方换算分数，不将其改写为 A-Level 等级组合。A Level English General Paper minimum D 可满足所列英语路径，但不属于BCI 可选课程。另需 ISAT 与 MMI。",
        "noteEn": "Direct-entry Medicine: best 3 A-Level subjects within 2 years must convert to an Equivalent Year 12 score of 15; A Level Chemistry minimum D. D in A Level English General Paper may satisfy the listed English route. All international applicants must take ISAT and attend the MMI if shortlisted.\n\n",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "须满足具体法律课程入学要求；已核官方研究未公布 Cambridge A-Level 专属最低等级或必修科目。",
        "noteEn": "Applicants must meet the specific course entry requirements. No Cambridge-specific minimum A-Level grade or prerequisite subject was published.\n\n",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [],
        "noteZh": "Bachelor of Computer Science 课程页设有 Mathematics prerequisite/equivalent；已核页面未公布 Cambridge A-Level 总成绩或明确等级。",
        "noteEn": "The Bachelor of Computer Science has a Mathematics prerequisite or equivalent. No Cambridge-specific overall A-Level result or grade was published.\n\n",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "physics",
          "chemistry",
          "biology"
        ],
        "noteZh": "Bachelor of Engineering 要求 Mathematics，并按课程方向列出 Chemistry 或 Physics；部分方向可列 Biology。Cambridge A-Level 总分及各科等级未在已核课程页明确公布。",
        "noteEn": "The Bachelor of Engineering requires Mathematics and course-listed Chemistry or Physics prerequisites; some pathways list Biology. No Cambridge-specific overall A-Level result or grade was published.\n\n",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [
          "economics",
          "business"
        ],
        "noteZh": "Bachelor of Business 需满足课程及一般大学入学要求；已核官方研究未公布 Cambridge A-Level 专属最低等级或必修科目。",
        "noteEn": "Applicants must meet the course and general university entry requirements. No Cambridge-specific minimum A-Level grade or prerequisite subject was published for Business/Economics.\n\n",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [
          "mathematics",
          "physics",
          "chemistry",
          "biology"
        ],
        "noteZh": "生物医学/生命科学相关课程须满足具体课程 academic entry requirements；已核官方页面未公布统一 Cambridge A-Level 等级。",
        "noteEn": "Biomedical and life-science courses require the relevant course-specific academic entry requirements. No uniform Cambridge-specific A-Level grade or prerequisite subject was published.\n\n",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "已核官方研究未提供可映射至 Design 方向的 Cambridge A-Level 等级或BCI 可选课程先修规则；不能据此推断门槛。",
        "noteEn": "No Cambridge-specific A-Level minimum grade, prerequisite subject, or other published requirement was identified for Design. Course-specific requirements must be checked.\n\n",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Arts/人文相关本科须满足对应课程 academic entry requirements；已核官方研究未公布 Cambridge A-Level 专属最低等级或必修科目。",
        "noteEn": "Arts and Humanities courses require the relevant course-specific academic entry requirements. No Cambridge-specific minimum A-Level grade or prerequisite subject was published.\n\n",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "已核官方研究未提供可映射至 Education 方向的 Cambridge A-Level 等级或BCI 可选课程先修规则；不能据此推断门槛。",
        "noteEn": "No Cambridge-specific A-Level minimum grade, prerequisite subject, or other published requirement was identified for Education. Course-specific requirements must be checked.",
        "extras": []
      }
    }
  },
  "uwa": {
    "profileType": "course_specific",
    "generalProfile": "null；UWA 官方国际及海外学历页面列出 GCE/Cambridge A-level 作为可申请的国际学历路径，但当前公开页面未给出适用于所有本科课程的统一 A-level 原始等级门槛；课程级要求按课程和学历背景核定。",
    "generalProfileEn": "UWA lists GCE/Cambridge A-level as an accepted international qualification pathway. The official pages reviewed do not publish a single raw A-level grade threshold applicable to all undergraduate courses; course-level requirements are assessed according to the course and applicant's qualification background.",
    "englishSummaryZh": "UWA要求达到最低英语能力。Computer Science课程页明确IELTS总分6.5，且各单项不低于6.0；可通过UWA列明的其他测试或学历途径满足。部分课程可能有更高标准或认证相关英语要求。所查页面未能明确核实Cambridge A-level English科目豁免，因此不推定豁免。",
    "englishSummaryEn": "Applicants must meet UWA's minimum English language competence requirements. For Computer Science, the official course page states IELTS overall 6.5, with no band less than 6.0. Equivalent tests or qualifications listed by UWA may also satisfy the requirement. Some courses may require a higher standard or accreditation-specific ELC requirements. No Cambridge A-level English-subject exemption was clearly confirmed, so none is assumed.",
    "applicationSummaryZh": "国际本科申请可提前最多两年提交；具体截止日期按入学季、国籍/所在地及课程而定，官方未公布统一通用日期。医学等特殊课程有独立申请轮次，须按当年课程时间表办理。",
    "applicationSummaryEn": "International applicants may apply up to two years in advance. The deadline depends on intake, nationality or location, and course; the official pages reviewed do not publish one general date. Medicine and other special pathways may have separate application rounds and current course-specific timelines.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "本科医学相关路径官方以 ATAR 或 equivalent 表述，未公布 Cambridge A-level 对应等级或具体科目要求。Doctor of Medicine 为 postgraduate，不能直接视为 A-level 本科门槛；具体学术、考试及申请轮次须按 MD 课程页核验。",
        "noteEn": "For undergraduate medicine-related pathways, UWA states requirements as ATAR or equivalent; no Cambridge A-level grade equivalent was published in the international undergraduate pages reviewed. The Doctor of Medicine is postgraduate and is not a direct A-level undergraduate threshold; academic, test and application-round requirements must be checked on the MD course page. Competitive medicine-related pathways may require UCAT or ISAT and an interview, depending on the pathway.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "所查官方资料未核实到 Cambridge A-level 独立等级基准或统一法律本科 A-level 门槛；需按具体 Law/assured pathway 课程规则核定。",
        "noteEn": "No independent Cambridge A-level grade threshold or standard undergraduate Law A-level threshold was verified in the official materials reviewed. Requirements must be assessed under the specific Law or assured-pathway course rules.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Computer Science 官方所查页面未公布独立 A-level 等级或 Cambridge A-level 先修科目；具体 admission criteria/prerequisites 指向 UWA entry requirements 或 Handbook。",
        "noteEn": "The Computer Science page directs detailed admission criteria and prerequisites to UWA entry requirements or the Handbook and does not state an independent A-level grade threshold. IELTS is overall 6.5, with no band less than 6.0. No Cambridge A-level Mathematics threshold or A-level subject prerequisite was published on the official pages reviewed.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "chemistry",
          "physics"
        ],
        "noteZh": "Bachelor of Engineering (Honours) 未公布 Cambridge A-level 对应等级。官方公布的是 ATAR 及澳洲 ATAR 先修：Mathematics Methods 必需，并在 Chemistry、Physics、Mathematics Specialist 中至少一门达到规定 scaled score；这些要求不得转换为 A-level 等级。",
        "noteEn": "Bachelor of Engineering (Honours) requires minimum ATAR 80. Prerequisites include Mathematics Methods ATAR scaled score at least 50, plus at least one of Chemistry ATAR, Physics ATAR or Mathematics Specialist ATAR with scaled score at least 50. UWA does not publish Cambridge A-level equivalents for these requirements.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [
          "economics",
          "business"
        ],
        "noteZh": "所查 UWA 官方公开课程页面未核实到 Business/Economics 的 Cambridge A-level 独立等级基准或明确 A-level 科目要求；具体课程/专业先修须查对应 Handbook。",
        "noteEn": "No independent Cambridge A-level grade benchmark was verified for Business or Economics. The general international-qualifications page does not provide a university-wide raw A-level threshold; specific course or major prerequisites should be checked in the relevant Handbook.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Bachelor of Science 官方页面显示 minimum ATAR 80，但未公布 Cambridge A-level 对应等级或具体 A-level 科目要求；ATAR 不转换为 A-level 等级。",
        "noteEn": "Bachelor of Science shows minimum ATAR 80. No Cambridge A-level grade equivalent or specific Cambridge A-level subject requirement was published in the official pages reviewed.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "所查已核验官方研究未识别到可对应的 Design 课程或官方 Cambridge A-level 等级/科目规则，不适用。",
        "noteEn": "No Cambridge A-level grade threshold, subject prerequisite, portfolio requirement or interview requirement was published for Design in the official materials reviewed. Do not infer an additional requirement.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Bachelor of Arts 要求达到 University’s minimum entry score、English language competence，并满足适用先修；未公开 Cambridge A-level 等级换算或具体科目要求。",
        "noteEn": "Bachelor of Arts requires the University's minimum entry score, English language competence and any applicable prerequisites. No Cambridge A-level grade conversion was published in the course information reviewed; no uniform additional examination or portfolio requirement was identified.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "所查已核验官方研究未识别到可对应的 Education 课程或官方 Cambridge A-level 等级/科目规则，不适用。",
        "noteEn": "No Cambridge A-level grade threshold, subject prerequisite, portfolio requirement or interview requirement was published for Education in the official materials reviewed. Course-level requirements must be checked for the specific programme; do not infer unpublished data.",
        "extras": []
      }
    }
  },
  "adelaide": {
    "profileType": "course_specific",
    "generalProfile": "官方未公布全校统一的 Cambridge International A-Level 等级门槛；官方课程页以 “GCE A Levels” 按课程列出代表性分数 8 或 9，但该分数未构成可直接引用的等级组合。",
    "generalProfileEn": "The official course pages list international entry qualifications as “GCE A Levels” and provide scores by country or qualification. Representative courses show 8 or 9. No university-wide Cambridge International A-Level grade threshold was found; the official source does not publish one.",
    "englishSummaryZh": "一般本科通常要求 IELTS Academic 总分 6.5、单项不低于 6.0；具体课程可能要求更高。英语豁免或替代资格须按官方 English language proficiency 页面及对应课程页核验。",
    "englishSummaryEn": "For general undergraduate entry, IELTS Academic is usually 6.5 overall, with no band below 6.0. Requirements vary by programme and may be higher for some courses. Any English-language exemption or alternative qualification must be checked against the official English language proficiency page and the relevant course page.",
    "applicationSummaryZh": "官方未公布统一全校截止日期，一般按具体 degree page 的 key dates、开学前申请窗口办理。Bachelor of Medical Studies 2026 国际申请系统于 2026-03-03 开放；竞争性项目的具体提前截止日当前官方摘录未完整显示。",
    "applicationSummaryEn": "There is no single university-wide deadline published. Apply according to the key dates on the relevant degree page, usually within the application window before commencement. For the Bachelor of Medical Studies 2026, the international application system opened on 3 March 2026; the specific competitive-programme closing date was not fully visible in the official extract, so no exact deadline is published.",
    "confidence": "中",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：本次已核验研究未发现可直接引用的医学 A-Level 等级组合或七项 BCI 科目要求；课程筛选包括 UCAT，符合条件者参加面试。",
        "noteEn": "Bachelor of Medical Studies: no specific Cambridge International A-Level grade was verified; the official source does not publish one. No confirmed subject combination was found. Medicine applicants must sit the University Clinical Aptitude Test (UCAT), and eligible applicants attend an interview.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方未公布可直接引用的 Cambridge/GCE A-Level 等级门槛或七项 BCI 科目要求。",
        "noteEn": "No directly citable Cambridge/GCE A-Level grade or subject threshold was verified for a representative law course; the official source does not publish one.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方课程页显示 GCE A Levels 9，但这不是明确的 A-Level 等级组合，禁止转换为等级档案；数学等先修科目官方未公布。",
        "noteEn": "Bachelor of Computer Science: GCE A Levels 9. No confirmed Mathematics or other A-Level subject prerequisite was verified; the official source does not publish one.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方课程页显示 GCE A Levels 9，但这不是明确的 A-Level 等级组合，禁止转换为等级档案；课程先修科目具体组合官方未公布。",
        "noteEn": "Bachelor of Engineering (Chemical) (Honours): GCE A Levels 9. The specific prerequisite subject combination was not verified; the official source does not publish one.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方课程页显示 GCE A Levels 8，但这不是明确的 A-Level 等级组合，禁止转换为等级档案；未核验到额外七项 BCI 科目要求。",
        "noteEn": "Bachelor of Business: GCE A Levels 8. No additional A-Level subject requirement was verified; the official source does not publish one.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验研究未提供可直接引用的科学类课程 A-Level 等级组合或七项 BCI 科目要求。",
        "noteEn": "No confirmed Cambridge International A-Level grade or subject requirement was verified for a representative science course; the official source does not publish one.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验研究未提供可直接引用的设计类课程 A-Level 等级组合或七项 BCI 科目要求。",
        "noteEn": "No confirmed Cambridge International A-Level grade or subject requirement was verified for a representative design course; the official source does not publish one.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方课程页显示 GCE A Levels 8，但这不是明确的 A-Level 等级组合，禁止转换为等级档案；未核验到额外七项 BCI 科目要求。",
        "noteEn": "Bachelor of Arts: GCE A Levels 8. No additional A-Level subject requirement was verified; the official source does not publish one.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验研究未提供可映射的教育类课程 A-Level 等级组合或七项 BCI 科目要求。",
        "noteEn": "No confirmed Cambridge International A-Level grade or subject requirement was verified for a representative education course; the official source does not publish one.",
        "extras": []
      }
    }
  },
  "oxford": {
    "profileType": "course_specific",
    "generalProfile": "null；牛津官方未公布统一全校 A-level 最低成绩，要求按课程分别满足标准录取门槛。官方明确接受 Cambridge International、Pearson Edexcel 和 OxfordAQA International A-level，并按等级逐级等同 UK GCE A-level；Cambridge Global Perspectives and Research、Thinking Skills A-level 不接受。",
    "generalProfileEn": "Oxford has no single university-wide minimum A-level grade; applicants must meet the course-specific standard offer. Cambridge Assessment International Education, Pearson Edexcel and OxfordAQA International A-levels are treated as equivalent to UK GCE A-levels grade-for-grade. Cambridge Global Perspectives and Research and Thinking Skills A-levels are not accepted.",
    "englishSummaryZh": "所有本科课程采用 higher level English。常见要求包括 IELTS Academic 7.5（各单项至少 7.0）、TOEFL iBT 110（分项最低 22/24/25/24；2026-01-21 起新 TOEFL 暂不接受，官方复核中）、C1/C2 191（各单项至少 185）、Oxford Test of English Advanced 165（各单项至少 155）及 PTE Academic 76（各项至少 66）。符合官方条件者可申请豁免，英语证明通常须于录取当年 7 月 31 日前提交。",
    "englishSummaryEn": "All undergraduate courses use the higher-level English requirement: IELTS Academic 7.5 (minimum 7.0 in each component); TOEFL iBT 110 (Listening 22, Reading 24, Speaking 25, Writing 24; the new TOEFL is not accepted from 2026-01-21 pending review); C1 Advanced 191 (minimum 185 in each component); C2 Proficiency 191 (minimum 185 in each component); Oxford Test of English Advanced 165 (minimum 155 in each component); or PTE Academic 76 (minimum 66 in each component). Exemptions may apply to eligible English-speaking nationals/residents and applicants with qualifying full-time English-medium education. Evidence is usually due by 31 July in the year of admission.",
    "applicationSummaryZh": "UCAS 申请截止日期为每年 10 月 15 日 18:00（英国时间）；具体年份以官方申请时间表为准。牛津对入围申请者通常于 12 月安排线上面试。",
    "applicationSummaryEn": "15 October each year at 18:00 UK time via UCAS; the official timetable for the specific year is published separately.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": "A*AA",
        "requiredSubjects": [
          "chemistry"
        ],
        "recommendedSubjects": [
          "mathematics",
          "furtherMathematics",
          "biology",
          "physics"
        ],
        "noteZh": "Medicine：化学必修，另需数学、进阶数学、生物或物理之一；明确排除 Critical Thinking 和 Thinking Skills。",
        "noteEn": "Medicine: A*AA, excluding Critical Thinking and Thinking Skills; Chemistry plus one of Maths, Further Maths, Biology or Physics. UCAT. Biology: A*AA, with A* in a science or Maths; Biology plus Chemistry, Physics or Maths. Biomedical Sciences: A*AA, excluding Critical Thinking and Thinking Skills; two of Biology, Chemistry, Maths or Physics; ESAT.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": "AAA",
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Jurisprudence 明确要求 AAA；研究文件仅写推荐 essay-writing subject，七个指定 BCI 科目中无官方必需或推荐科目。",
        "noteEn": "Law (Jurisprudence): AAA; an essay-writing subject is recommended; LNAT. Law with Law Studies in Europe: AAA; a modern language is required except for European Law; LNAT.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": "A*AA including A*A in Maths and Further Maths if available (in any order)",
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "furtherMathematics"
        ],
        "noteZh": "计算机科学要求数学；若学校提供 Further Mathematics，则要求数学和 Further Mathematics 达到 A*、A（顺序不限）。",
        "noteEn": "Computer Science: A*AA, including A*A in Maths and Further Maths if available, in either order; TMUA. Computer Science and Philosophy has the same requirement.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": "A*A*A",
        "requiredSubjects": [
          "mathematics",
          "physics"
        ],
        "recommendedSubjects": [
          "furtherMathematics"
        ],
        "noteZh": "Engineering Science 要求数学和物理，Further Mathematics 推荐；A*A*A 中 A* 位于 Maths、Further Maths 或 Physics。Materials Science 为 A*AA，要求数学和物理。",
        "noteEn": "Engineering Science: A*A*A, with A*s in Maths, Further Maths or Physics; Maths and Physics required, Further Maths recommended; ESAT. Materials Science: A*AA, with A* in Maths, Physics or Chemistry; Maths and Physics.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": "A*AA (Maths at A or A*)",
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [],
        "noteZh": "Oxford 研究文件对应 Economics and Management；数学须达到 A 或 A*。未将其他商科方向的未公布要求转化为等级档案。",
        "noteEn": "Economics and Management: A*AA, with Maths at A or A*; Maths; TARA.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": "A*AA",
        "requiredSubjects": [
          "biology"
        ],
        "recommendedSubjects": [
          "chemistry",
          "physics",
          "mathematics"
        ],
        "noteZh": "按研究中的 Biology 与 Biomedical Sciences 映射：Biology 要求 Biology，并要求 Chemistry、Physics 或 Maths 之一；Biology 的 A* 须在 science 或 Maths。Biomedical Sciences 要求 Biology、Chemistry、Maths、Physics 中两门。",
        "noteEn": "Biology: A*AA, with A* in a science or Maths; Biology plus Chemistry, Physics or Maths. Biomedical Sciences: A*AA, excluding Critical Thinking and Thinking Skills; two of Biology, Chemistry, Maths or Physics; ESAT. Psychology (Experimental): A*AA; one or more science subjects, including Psychology, or Maths recommended; TARA.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验研究未列出可映射的 Oxford design 专业课程或官方 A-level 科目规则。",
        "noteEn": "Fine Art: AAA, or AAB for post-A-level applicants who have completed an Art Foundation; digital portfolio.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": "AAA",
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "艺术/人文学科规则按已列课程映射：English Language and Literature 要求 English Literature 或 English Language and Literature；Fine Art 推荐 Art，但该科目不在BCI 可选课程范围内；History 推荐 History；PPE 推荐 Maths。",
        "noteEn": "English Language and Literature: AAA; English Literature or English Language and Literature; one piece of written work. History: AAA; History recommended; one piece of written work. Fine Art: AAA, or AAB for post-A-level applicants who have completed an Art Foundation; digital portfolio. PPE: AAA; Maths and History-related subjects recommended; TARA.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验研究未列出可映射的 Oxford education 专业课程或官方 A-level 科目规则。",
        "noteEn": "No specific Education benchmark is published in the research file.",
        "extras": []
      }
    }
  },
  "cambridge": {
    "profileType": "course_specific",
    "generalProfile": "null；官方未公布统一全校最低 A-Level 门槛，要求按课程及 Cambridge College 设定；官方说明通常以 Year 13 同时修读的 3 门 A levels 为 offer 基础，且期待最高等级。",
    "generalProfileEn": "No single university-wide minimum A-Level threshold is published. Requirements are set by course and Cambridge College. Offers are generally based on three A levels studied concurrently in Year 13, with the highest grades expected. Cambridge International, Oxford AQA and Pearson Edexcel International A levels are accepted as comparable to UK A/AS levels. Offers are minimum course requirements, not a guarantee of admission; a College may set higher grades, additional subjects or assessments.",
    "englishSummaryZh": "非 UK Home Office 定义的 majority English-speaking country 通常需证明英语。通常要求 IELTS Academic 总分 7.5、各项通常不低于 7.0；面试阶段建议至少总分 6.5、单项不低于 6.0。亦接受 C2 Proficiency 总分 200且单项不低于185，或 C1 Advanced 总分193且单项不低于185，并结合其他英语能力证据；学院可按背景设条件。",
    "englishSummaryEn": "Applicants who are not from a UK Home Office-defined majority English-speaking country will usually need to provide evidence of English proficiency. The usual entry standard is IELTS Academic 7.5 overall, normally with at least 7.0 in each component. At interview stage, at least 6.5 overall and 6.0 in each component is recommended. C2 Proficiency (200 overall, at least 185 in each component) or C1 Advanced (193 overall, at least 185 in each component, together with other evidence) is also accepted; a College may set conditions based on the applicant’s background.",
    "applicationSummaryZh": "2027 entry/2028 deferred：UCAS 截止为 2026-10-15 18:00（英国时间）；My Cambridge Application 及多数国际申请者 transcript 截止为 2026-10-22 18:00。专业考试另有注册及考试日期。",
    "applicationSummaryEn": "15 October 2026, 18:00 UK time: UCAS deadline for 2027 entry/2028 deferred entry. 22 October 2026, 18:00 UK time: deadline for My Cambridge Application and transcripts for most international applicants. Some courses have separate registration or test dates.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": "A*A*A",
        "requiredSubjects": [
          "chemistry"
        ],
        "recommendedSubjects": [
          "biology",
          "physics",
          "mathematics"
        ],
        "noteZh": "官方课程基准为 A*A*A；通常要求 Chemistry 加 Biology、Physics 或 Mathematics 至少一门，具体 offer 与科目要求可能因 College 而异。",
        "noteEn": "Medicine: A*A*A. Chemistry is normally required, plus at least one of Biology, Physics or Mathematics. Specific offers and College requirements may differ. UCAT is required for shortlisted applicants.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": "A*AA",
        "requiredSubjects": [],
        "recommendedSubjects": [
          "economics",
          "mathematics"
        ],
        "noteZh": "官方不要求特定 A-Level 科目；Economics、Mathematics 等可作为常见但非必需背景。",
        "noteEn": "Law: A*AA. No specific A-Level subjects are required; English, History, Languages, Economics and Mathematics are common but non-essential backgrounds. LNAT is required.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": "A*A*A",
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "furtherMathematics",
          "physics"
        ],
        "noteZh": "Mathematics 必须；若学校提供，Further Mathematics 通常应修至 AS 或 A level。部分 College 可能要求 Mathematics 和/或 Further Mathematics 达 A*，或对 Chemistry/Physics 设更高要求。",
        "noteEn": "Computer Science: A*A*A. Mathematics is required. Further Mathematics is required or expected where offered; Colleges commonly require Mathematics and/or Further Mathematics at A*, and some may set A*/7 requirements in Chemistry or Physics. TMUA is required; Peterhouse or Trinity applicants also need CSAT.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": "A*A*A",
        "requiredSubjects": [
          "mathematics",
          "physics"
        ],
        "recommendedSubjects": [
          "furtherMathematics"
        ],
        "noteZh": "Mathematics 与 Physics 必须；若学校提供，Further Mathematics 至 AS 或 A level，具体要求可能因 College 而异。",
        "noteEn": "Engineering: A*A*A. Mathematics and Physics are required. Further Mathematics to AS or A level is normally required or strongly recommended where offered, subject to the College. ESAT is required.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "剑桥官方研究未公布独立本科 Business 课程的 A-Level 基准；不将 Economics 课程要求转写为 Business 门槛。",
        "noteEn": "No separate undergraduate Business A-Level benchmark is published. Economics: A*A*A, with Mathematics required; Further Mathematics is important for competitiveness and is required by some Colleges. TMUA is required for Economics.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": "A*A*A",
        "requiredSubjects": [],
        "recommendedSubjects": [
          "mathematics",
          "furtherMathematics",
          "physics",
          "chemistry",
          "biology"
        ],
        "noteZh": "以 Natural Sciences（生命科学代表）为依据，官方基准为 A*A*A；需按拟修方向准备相关科学科目，具体课程与 College 要求可能不同，研究文件未给出统一必修科目组合。",
        "noteEn": "Natural Sciences: A*A*A. Relevant science subjects should be prepared according to the intended pathway; course and College requirements may differ. Psychological and Behavioural Sciences: A*A*A, with at least one of Mathematics, Biology, Chemistry, Computer Science or Physics; some Colleges specify particular science subjects.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "研究文件未提供 Cambridge 独立本科 Design 课程或相应 A-Level 科目规则，不适用。",
        "noteEn": "No separate official A-Level benchmark or subject requirement for Design is published in the research.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [
          "mathematics"
        ],
        "noteZh": "研究文件未提供统一 Arts 课程基准；History（文史代表）为 A*AA 且要求 History，但 History 不在允许的BCI 可选课程范围内，不能将其转为本字段的必修科目。",
        "noteEn": "History: A*AA, with History required. For Arts, Social Sciences and Humanities generally, combinations including English Literature, Languages, History and Mathematics are commonly recommended, but requirements vary by course. Some courses or Colleges may require written work or additional assessments.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "研究文件未提供 Cambridge 独立本科 Education 课程或相应 A-Level 科目规则，不适用。",
        "noteEn": "No separate official A-Level benchmark or subject requirement for Education is published in the research.",
        "extras": []
      }
    }
  },
  "imperial": {
    "profileType": "course_specific",
    "generalProfile": "标准 A-level offer 为 AAA 至 A*A*A；具体课程要求高于通用标准时以课程页为准。官方接受学历页未单独点名 Cambridge International A-Level，无法确认其以该名称明确接受。",
    "generalProfileEn": "The standard A-level offer ranges from AAA to A*A*A. Imperial's official accepted-qualifications page does not separately name Cambridge International A-Level, so acceptance under that specific qualification title cannot be confirmed. Where a course requirement is higher than the general standard, the course page takes precedence.",
    "englishSummaryZh": "所有本科申请者须满足所申课程的 Standard 或 Higher English requirement，即使英语为母语。AS Level/A-level English Language 为 Grade C（两档相同）；IELTS Academic Standard 为总分6.5且各项至少6.0，Higher 为总分7.0且各项至少6.5。可按官方豁免页申请豁免；Cambridge International A-Level 本身不能据此推定满足英语要求。",
    "englishSummaryEn": "All undergraduate applicants must meet the Standard or Higher English requirement for their chosen course, including native English speakers. AS Level/A-level English Language requires Grade C for both levels. IELTS Academic requires 6.5 overall with at least 6.0 in each component for Standard, or 7.0 overall with at least 6.5 in each component for Higher. Exemptions may be requested under Imperial's official exemption policy; Cambridge International A-Level alone does not establish that the English requirement is met.",
    "applicationSummaryZh": "2027入学申请于2026-09-01开放。MBBS Medicine/Graduate Entry Medicine 截止2026-10-15 18:00（英国时间）；其他本科课程平等考虑截止2027-01-13 18:00（英国时间）。",
    "applicationSummaryEn": "For 2027 entry, MBBS Medicine and Graduate Entry Medicine applications close on 15 October 2026 at 18:00 UK time. Applications for other undergraduate courses close on 13 January 2027 at 18:00 UK time. Applications open on 1 September 2026.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": "A*AA",
        "requiredSubjects": [
          "chemistry",
          "biology"
        ],
        "recommendedSubjects": [],
        "noteZh": "官方 Medicine MBBS/BSc benchmark：A*AA，包括 Chemistry 和 Biology，且两者之一须为 A*。该档案为 A-level 原文；必须 UCAT，通常包含面试/选择流程。",
        "noteEn": "Medicine MBBS/BSc: A*AA including Chemistry and Biology, with A* in one of these subjects. UCAT is required, and the process normally includes an interview or selection stage; details should be checked on the relevant course and admissions pages.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Imperial 官方本科课程目录及已核验课程页未见独立 Law undergraduate degree，官方未公布法律类 A-level benchmark；不适用。",
        "noteEn": "Imperial's undergraduate course catalogue and official course pages do not show a standalone Law undergraduate degree. No official Law A-level benchmark was published in the research.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": "A*A*A or A*AAA",
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [],
        "noteZh": "Computing BEng 官方 benchmark 为 A*A*A 或 A*AAA，要求 Mathematics grade A*；其他科目须按课程页确认。",
        "noteEn": "Computing BEng: A*A*A or A*AAA, with Mathematics at grade A*. TMUA is required; confirm any other subject requirements on the course page.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [
          "mathematics",
          "chemistry"
        ],
        "recommendedSubjects": [],
        "noteZh": "官方仅核验到代表性 Chemical Engineering MEng：Mathematics 和 Chemistry 均为 A*；未形成统一工程类别的完整等级组合，因此不填 published_grade_profile。",
        "noteEn": "Representative Chemical Engineering MEng: A-level Mathematics and Chemistry, both at grade A*. Requirements vary by engineering course; international qualification information must not be treated as a Cambridge International A-Level requirement.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": "A*AA",
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [],
        "noteZh": "Economics, Finance and Data Science BSc 官方 benchmark 为 A*AA，要求 Mathematics grade A*，另有一门指定科目为 grade A；Imperial Business School 本科课程要求依课程而异。",
        "noteEn": "Economics, Finance and Data Science BSc: A*AA, including A-level Mathematics at grade A* and a further specified subject at grade A. Imperial Business School requirements vary by course, and TMUA is required.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "官方研究未形成统一 Science 类别的完整 A-level 等级档案；Life Sciences 及其他科学课程须按具体课程页确认，因此不填 published_grade_profile。",
        "noteEn": "Specific Life Sciences and other science-course requirements should be checked on the relevant course page; the research did not establish a single official benchmark for the science category. ESAT is used for some science courses.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "已核验官方本科课程范围未公布独立 Design 学位或统一 Design A-level benchmark；不适用。",
        "noteEn": "No unified official Design A-level requirement or standalone Design category benchmark was published in the research. Check the relevant Imperial course page if applicable; no general portfolio requirement was identified.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Imperial 官方本科课程页未见可对应的独立 Arts/Humanities 学位，官方未公布该类别 A-level benchmark；不适用。",
        "noteEn": "Imperial's undergraduate provision is primarily in science, engineering, medicine and business. The research found no corresponding standalone Arts/Humanities degree or official Arts A-level benchmark.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "已核验官方本科课程范围未公布独立 Education 学位或统一 Education A-level benchmark；不适用。",
        "noteEn": "The research did not identify a standalone Education undergraduate degree or publish an official Education A-level benchmark.",
        "extras": []
      }
    }
  },
  "ucl": {
    "profileType": "published_grade",
    "generalProfile": "A*A*A–ABB",
    "generalProfileEn": "UCL normally assesses undergraduate admission on three A levels, including International A levels. Course standard offers range from A*A*A to ABB. A separate Singapore/Cambridge A-levels at H2 level page lists ABB as a minimum, but this must not be generalized to all Cambridge International A-Level qualifications. Normally, at least two A levels should be from UCL’s preferred subjects list; General Studies, Critical Thinking, and Global Perspectives and Research are not counted.",
    "englishSummaryZh": "非英国本土英语国家申请人通常须提供英语能力证明，除非符合UCL豁免规则。课程按Level 1–5设定要求：IELTS Academic分别为总分6.5/7.0/7.0/7.5/8.0，且各单项最低6.0/6.5/7.0/7.0/8.0。Medicine为Level 4，Computer Science为Level 1。",
    "englishSummaryEn": "Applicants who are not nationals of a majority English-speaking country must provide evidence of English proficiency unless they meet a UCL exemption. The course page sets the required level from Level 1 to Level 5. IELTS Academic minimums are: Level 1 6.5 overall with at least 6.0 in each component; Level 2 7.0 with at least 6.5 in each; Level 3 7.0 with at least 7.0 in each; Level 4 7.5 with at least 7.0 in each; and Level 5 8.0 with at least 8.0 in each. Medicine is Level 4 and Computer Science is Level 1.",
    "applicationSummaryZh": "2026入学：Medicine截止2025-10-15；大多数本科课程（含Computer Science）UCAS平等考虑截止2026-01-14 18:00（英国时间）。2027入学：医学等2026-10-15；大多数课程2027-01-13 18:00。具体课程页优先。",
    "applicationSummaryEn": "For 2026 entry, the Medicine deadline is 2025-10-15; the UCAS equal consideration deadline for most undergraduate courses, including Computer Science, is 2026-01-14 at 18:00 UK time. For 2027 entry, Medicine and similar courses are due by 2026-10-15, while most undergraduate courses are due by 2027-01-13 at 18:00 UK time. Check the specific course page first.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": "A*AA",
        "requiredSubjects": [
          "biology",
          "chemistry"
        ],
        "recommendedSubjects": [],
        "noteZh": "代表性 Medicine MBBS BSc 官方要求 A*AA；Biology 和 Chemistry 必修，且其中一门须达到 A*。",
        "noteEn": "Medicine MBBS BSc: A*AA; Biology and Chemistry required, with either at grade A*. Applicants must take the UCAT in the year of application; resits are not accepted.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": "A*AA",
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Law LLB 官方要求 A*AA；无特定科目，但至少两门 A level 应来自 UCL preferred A level subjects list。研究文件未列出该名单中的 BCI 科目映射。",
        "noteEn": "Law LLB: A*AA; no specific subjects required, but at least two A levels should be from UCL’s preferred A level subjects list.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": "A*A*A",
        "requiredSubjects": [],
        "recommendedSubjects": [
          "mathematics",
          "furtherMathematics"
        ],
        "noteZh": "Computer Science BSc 官方要求 A*A*A；Mathematics 或 Further Mathematics 至少一门须为 A*，因此列为推荐范围中的可选先修科目，实际至少提供其中一门。",
        "noteEn": "Computer Science BSc: A*A*A; A* in either Mathematics or Further Mathematics required. For 2026 entry, the TARA Admissions Test is also required.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": "A*AA",
        "requiredSubjects": [
          "mathematics",
          "physics"
        ],
        "recommendedSubjects": [],
        "noteZh": "代表性 Mechanical Engineering MEng 官方要求 A*AA；Mathematics 和 Physics 必修，且 A* 须在其中一门必修科目取得。",
        "noteEn": "Mechanical Engineering MEng: A*AA; Mathematics and Physics required, with A* in one of these required subjects.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": "A*AA",
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "economics"
        ],
        "noteZh": "代表性 Economics BSc (Econ) 官方要求 A*AA；Mathematics 须为 A*；如提供 Economics，则须为 A。该规则来自 Economics 课程，不能泛化至所有商业课程。",
        "noteEn": "Economics BSc (Econ): A*AA; A* in Mathematics required; if Economics is offered, it must be at grade A.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": "A*AA",
        "requiredSubjects": [],
        "recommendedSubjects": [
          "biology",
          "chemistry",
          "mathematics",
          "physics"
        ],
        "noteZh": "代表性 Psychology BSc 官方要求 A*AA；Biology、Chemistry、Mathematics、Physics、Psychology 五科中须有两科达到 A*A。由于 Psychology 不在允许的BCI 可选课程范围内，仅保留其中四个可映射科目作为推荐科目，不能据此虚构完整先修组合。",
        "noteEn": "Psychology BSc: A*AA; A*A in two of Biology, Chemistry, Mathematics, Physics, and Psychology. Requirements for other science courses vary by course and are not specified in the research.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：研究文件未提供可对应的 Design 专业课程等级或BCI 可选课程规则。",
        "noteEn": "No specific Cambridge International A-Level benchmark or subject requirement for Design is published in the research.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": "A*AA",
        "requiredSubjects": [],
        "recommendedSubjects": [
          "geography"
        ],
        "noteZh": "代表性 Arts and Sciences BASc 官方要求 A*AA；具体 pathway 另有动态学科要求。Health and Environment pathway 明确接受 Geography 作为指定科目之一；Creative Arts and Humanities BA 要求一门 essay-based Humanities 或 Social Sciences 科目，BCI 现有课程中 Geography 属该类。",
        "noteEn": "Arts and Sciences BASc: A*AA. Pathway-specific subjects may apply; for example, Health and Environment requires one of Biology, Chemistry, Environmental Science, Geography, or Psychology plus one further science/social science, while Creative Arts and Humanities BA requires an essay-based Humanities or Social Sciences subject.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：研究文件未提供可对应的 Education 专业课程等级或BCI 可选课程规则。",
        "noteEn": "No specific Cambridge International A-Level benchmark or subject requirement for Education is published in the research.",
        "extras": []
      }
    }
  },
  "lse": {
    "profileType": "course_specific",
    "generalProfile": "null；官方未公布适用于全校所有国际 Cambridge International A-Level 申请人的统一最低等级；LSE 仅以 GCE A-level 表述通用标准，并要求按具体课程页核对。",
    "generalProfileEn": "No uniform minimum grade requirement has been published for all international Cambridge International A-Level applicants. LSE states general standards in terms of GCE A-levels and requires applicants to check the relevant programme page.",
    "englishSummaryZh": "官方英语要求包括：IELTS Academic总分7.0且各项7.0；TOEFL iBT总分100，写作27、阅读25、听力24、口语24；PTE Academic总分及各项70；Cambridge C1 Advanced/C2 Proficiency总分及各项185。符合指定英语国家国籍或学历条件者可豁免。申请阶段通常无需提交，获offer后按要求在7月前提供。",
    "englishSummaryEn": "IELTS Academic 7.0 overall and 7.0 in each component; TOEFL iBT 100 overall, with minimum Writing 27, Reading 25, Listening 24 and Speaking 24; PTE Academic 70 overall and 70 in each component; Cambridge C1 Advanced/C2 Proficiency 185 overall and 185 in each component. Exemptions may apply to nationals of Canada or a UKVI majority English-speaking country whose first language is English, or applicants who completed the specified degree study in a relevant country. Evidence is usually not required at application stage, but must be provided by July after an offer if requested.",
    "applicationSummaryZh": "所核2027/28课程页截止日期为2027-01-13；2026 entry及deferred 2027的UCAS平等考虑截止为2026-01-14 18:00 GMT。国际申请人虽可至6月30日提交，但官方强烈建议按1月截止日期申请。",
    "applicationSummaryEn": "For 2027/28 courses, the recorded deadline is 13 January 2027. The equal-consideration deadline for 2026 entry and deferred 2027 entry was 14 January 2026 at 18:00 GMT. International applicants may submit by 30 June, but LSE strongly recommends applying by the January deadline.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：LSE本科课程检索页及本次核验的官方页面未见医学本科课程，不能据此建立医学方向等级或科目门槛。",
        "noteEn": "No undergraduate medicine course was found in the LSE undergraduate course listings or the official pages reviewed. BSc Psychological and Behavioural Science requires A*AA, including the required grade in at least one of Biology, Chemistry, Physics, Mathematics or Psychology.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": "A*AA",
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "LLB Bachelor of Laws官方标准为A*AA；无固定A-level科目组合，但重视学术性、阅读、写作和研究能力。若组合含Mathematics与Further Mathematics，官方要求同时包含essay-writing subject。",
        "noteEn": "LLB Bachelor of Laws: A*AA. No fixed A-level subject combination; academic ability, reading, writing and research skills are valued. Mathematics and Further Mathematics must be combined with an essay-writing subject. All applicants must take the LNAT; LSE does not interview for undergraduate courses.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": "A*AA（Mathematics须为A*）",
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "furtherMathematics",
          "physics",
          "chemistry"
        ],
        "noteZh": "BSc Data Science官方标准为A*AA，且Mathematics为A*；Further Mathematics在学校提供时为expected并要求A，Physics或Chemistry有帮助但非强制。",
        "noteEn": "BSc Data Science: A*AA, including A* in Mathematics. If offered by the school, AS- or A-level Further Mathematics is expected at grade A. Mathematics is required; Further Mathematics is highly desirable; Physics or Chemistry is useful preparation but not mandatory.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：LSE官方本科课程范围及本次核验页面未公布工程类课程要求。",
        "noteEn": "No engineering undergraduate course requirement was published on the official LSE pages reviewed.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": "A*AA（BSc Economics；Mathematics须为A*）",
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "furtherMathematics",
          "economics"
        ],
        "noteZh": "已核验的BSc Economics官方标准为A*AA，Mathematics为A*；Further Mathematics为desirable，Economics不是必需科目。BSc Management等课程的具体等级应以相应课程页为准，本次未统一公布。",
        "noteEn": "BSc Economics: A*AA, including A* in Mathematics. Mathematics is required; Further Mathematics is desirable; Economics is not required. Requirements for BSc Management and other courses should be checked on the relevant programme page; no unified requirement was published in this review.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": "A*AA（BSc Psychological and Behavioural Science）",
        "requiredSubjects": [],
        "recommendedSubjects": [
          "biology",
          "chemistry",
          "physics",
          "mathematics"
        ],
        "noteZh": "LSE未见一般性科学学院统一门槛；BSc Psychological and Behavioural Science官方标准为A*AA，且至少一门Biology、Chemistry、Physics、Mathematics或Psychology须达到A。因Psychology不属于规划器BCI 可选课程，未列入subjects。",
        "noteEn": "BSc Psychological and Behavioural Science: A*AA, with at least one of Biology, Chemistry, Physics, Mathematics or Psychology, including grade A in at least one of these subjects.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：本次核验的LSE官方本科课程与项目基准未发现设计类课程，未公布设计方向等级或科目要求。",
        "noteEn": "No design undergraduate course requirement was published on the official LSE pages reviewed.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": "AAA（BSc International Relations）",
        "requiredSubjects": [],
        "recommendedSubjects": [
          "economics",
          "geography",
          "biology",
          "mathematics"
        ],
        "noteZh": "BSc International Relations官方标准为AAA，无固定科目组合，偏好至少两门传统学术科目；官方示例包括History、English、Economics、Government and Politics、Sociology、Geography、languages、Psychology、Philosophy。BCI 现有课程中 Economics、Geography、Mathematics 属官方示例的传统学术科目；biology虽属传统学术科目但非典型方向推荐。",
        "noteEn": "BSc International Relations: AAA. No fixed subject combination; at least two traditional academic subjects are preferred, typically including History, English, Economics, Government and Politics, Sociology, Geography, languages, Psychology or Philosophy.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：本次核验的LSE官方本科课程与项目基准未发现教育类本科课程，未公布教育方向等级或科目要求。",
        "noteEn": "No education undergraduate course requirement was published on the official LSE pages reviewed.",
        "extras": []
      }
    }
  },
  "kcl": {
    "profileType": "course_specific",
    "generalProfile": null,
    "generalProfileEn": "Cambridge International Examinations International A-levels are accepted as equivalent to GCE A-levels. Requirements are course-specific; King’s has no single university-wide minimum A-level threshold. Conditional offers are generally based on three A-level subjects, with representative course offers including A*AA and AAA. General Studies, Critical Thinking, Thinking Skills and Global Perspectives are not counted as A-levels.",
    "englishSummaryZh": "本科课程按适用 English language band 要求英语；已核验代表性课程均为 Band B。通常须在入学前提交英语证明，具体 Band B 考试分数以当年度官方表格为准，本次未完整显示，故不臆测 IELTS/TOEFL 数字。符合条件的英语国家国籍且在当地完成相应 Level 3 高中资格者通常可免额外英语考试。",
    "englishSummaryEn": "English requirements vary by course and are set by English language Band A–E. The representative courses reviewed require Band B. Evidence of English proficiency is normally required before enrolment. Accepted qualifications include GCE A-level/AS-level English Language or English Language & Literature at Grade C, as well as relevant IGCSE or English tests. The Band B score table was not fully available in the reviewed official material, so no IELTS/TOEFL scores are stated. Eligible nationals who completed the relevant Level 3 qualification in a majority English-speaking country may usually be exempt from an additional English test.",
    "applicationSummaryZh": "官方当前页面显示普通本科 UCAS 截止日为 2027-01-13；Medicine/Dentistry 为 2026-10-15 18:00（英国时间）；Law 的 LNAT 须在申请周期当年 12 月 31 日前参加。截止日期可能随申请年度更新，须复核。",
    "applicationSummaryEn": "The current standard undergraduate UCAS deadline is 2027-01-13. Medicine/Dentistry applications are due by 2026-10-15 at 18:00 UK time. Law applicants must take the LNAT by 31 December of the relevant admissions cycle. Deadlines may change by application year.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": "A*AA",
        "requiredSubjects": [
          "biology",
          "chemistry"
        ],
        "recommendedSubjects": [],
        "noteZh": "Medicine MBBS 官方课程标准为 A*AA，且明确要求 Biology A 与 Chemistry A；医学课程有独立课程要求，不能外推为全校统一门槛。",
        "noteEn": "Medicine MBBS: A*AA, including Biology A and Chemistry A. UCAT is compulsory and must be taken before applying; King’s has no fixed UCAT threshold, and the SJT is included in shortlisting. International applicants require English Band B. Biomedical Science requirements vary by course and are not unified on the general page.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": "A*AA",
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Law LLB 官方课程标准为 A*AA；官方明确无 required 或 preferred A-level subject。",
        "noteEn": "Law LLB: A*AA. No required or preferred A-level subject is specified. LNAT is compulsory and must be taken by 31 December of the relevant admissions cycle. English requirement: Band B.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": "A*A*A",
        "requiredSubjects": [
          "mathematics",
          "furtherMathematics"
        ],
        "recommendedSubjects": [],
        "noteZh": "Computer Science BSc 官方课程标准为 A*A*A；Mathematics 或 Further Mathematics 需达到 A。Computing/Computer Science 为 preferred subjects，但不属于指定BCI 可选课程，因此未写入科目数组。",
        "noteEn": "Computer Science BSc: A*A*A. Mathematics or Further Mathematics at A is required; Computing/Computer Science is preferred. English requirement: Band B.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": "AAA",
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [],
        "noteZh": "General Engineering BEng 官方课程标准为 AAA，且明确要求 Mathematics A。",
        "noteEn": "General Engineering BEng: AAA. Mathematics at A is required. English requirement: Band B.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": "A*AA",
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Business Management BSc 官方课程标准为 A*AA，要求 Humanities/Social Science A（不含 Modern Languages）；该要求不对应指定BCI 可选课程，故不虚构映射。",
        "noteEn": "Economics & Management BSc: A*AA, including Mathematics A and a Humanities/Social Science subject at A, excluding Modern Languages. Business Management BSc: A*AA, including a Humanities/Social Science subject at A, excluding Modern Languages.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": "A*AA",
        "requiredSubjects": [
          "biology",
          "chemistry",
          "mathematics",
          "physics"
        ],
        "recommendedSubjects": [
          "biology",
          "mathematics"
        ],
        "noteZh": "以官方 Psychology BSc 作为科学方向代表：标准为 A*AA，Biology、Chemistry、Mathematics 或 Physics 其中一科须为 A；Biology 与 Mathematics 为 preferred subjects。Psychology 不在指定BCI 可选课程范围内，未列入数组。",
        "noteEn": "Psychology BSc: A*AA, with one of Biology, Chemistry, Mathematics, Physics or Psychology at A; Biology and Mathematics are preferred. Other science-course requirements vary by course and are not stated as a single general rule.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": "AAA",
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "已核验的 Culture, Media & Creative Industries BA 代表性课程标准为 AAA，要求 essay-based 或 creative-based subject；该科目类别不属于指定BCI 可选课程，故不虚构映射。未发现可据此代表所有 Design 课程的统一规则。",
        "noteEn": "No specific Cambridge International A-level threshold or subject requirement for a design course was published in the reviewed official material. No additional portfolio requirement was identified in the research.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": "AAA",
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "以 Culture, Media & Creative Industries BA 作为艺术/人文方向代表：官方标准为 AAA，要求 essay-based 或 creative-based subject；该类别不属于指定BCI 可选课程。Law LLB 可作社科/人文参照，但不构成艺术方向统一门槛。",
        "noteEn": "Culture, Media & Creative Industries BA: AAA, including an essay-based or creative-based subject. Law LLB may serve as a humanities/social-science reference point: A*AA with no specified subject.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验研究文件未提供 Education 课程基准或明确的 Education A-level 等级/科目规则。",
        "noteEn": "No specific Cambridge International A-level threshold or subject requirement for an education course was published in the reviewed official material. No additional uniform examination, interview or portfolio requirement was identified.",
        "extras": []
      }
    }
  },
  "edinburgh": {
    "profileType": "course_specific",
    "generalProfile": "null；官方未公布全校统一的 Cambridge International A-Level 最低等级。官网明确说明 Cambridge AICE Diploma 可用于入学，且须包含三门 Cambridge International A Levels，成绩点数须等同于所申请课程的 A-Level 等级要求；课程要求按专业分别公布。",
    "generalProfileEn": "No single university-wide minimum Cambridge International A-Level grade has been officially published. The University of Edinburgh confirms that the Cambridge AICE Diploma is accepted for admission and must include three Cambridge International A Levels. The grade points must be equivalent to the A-Level grade requirements for the chosen programme. Requirements are published by individual degree programme.",
    "englishSummaryZh": "所有申请人须证明英语能力，要求按课程公布。已核验的 MBChB Medicine 要求 IELTS Academic 总分7.5且各单项至少7.5；或 TOEFL-iBT（2026-01-21前考试）总分110且各单项至少25；或 C1 Advanced/C2 Proficiency 总分191且各单项至少191。部分认可学校资格可豁免测试；全校统一 Cambridge A-Level 英语豁免规则未确认。",
    "englishSummaryEn": "All applicants must demonstrate English-language proficiency, with requirements set by the programme. For the verified MBChB Medicine requirement: IELTS Academic 7.5 overall, with at least 7.5 in each component; TOEFL-iBT (tests taken before 21 January 2026) 110 overall, with at least 25 in each component; or C1 Advanced/C2 Proficiency 191 overall, with at least 191 in each component. School qualifications may exempt applicants from testing if the relevant recognised English qualification and score are met. No university-wide Cambridge A-Level English exemption rule was confirmed.",
    "applicationSummaryZh": "UCAS equal consideration 截止为2027年1月13日18:00 GMT，多数本科课程在此日期关闭。Medicine 另须在入学年份前一年的10月15日前申请。",
    "applicationSummaryEn": "The UCAS equal-consideration deadline is 13 January 2027 at 18:00 GMT; the official website states that most undergraduate programmes close on this date. Medicine has a separate deadline of 15 October in the year before the programme starts.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": "AAA in one sitting",
        "requiredSubjects": [
          "chemistry"
        ],
        "recommendedSubjects": [
          "biology",
          "mathematics",
          "furtherMathematics",
          "physics"
        ],
        "noteZh": "MBChB 官方明确要求一次考试取得 AAA；A-Level 必须含 Chemistry，并在 Biology/Human Biology、Mathematics/Further Mathematics 或 Physics 中至少修读一项。",
        "noteEn": "MBChB Medicine requires AAA in one sitting. A Levels must include Chemistry plus one of Biology/Human Biology, Mathematics/Further Mathematics, or Physics. Applicants must take the UCAT in the same UCAS application cycle and meet the minimum UCAT score; UCAT Situational Judgement Band 4 is not considered. An interview and, after an offer, health clearance checks are required. No single Biomedical or life-science benchmark was confirmed.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Law 为课程级要求；本次官方研究未核验具体 Cambridge A-Level 等级和必修科目，不能填入推定门槛。",
        "noteEn": "Law has programme-specific requirements. The specific Cambridge International A-Level grades and required subjects were not verified; consult the relevant degree programme page.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Computer Science 有独立课程级要求；本次官方页面未提取到可安全转录的完整等级或科目组合，不能以通用门槛替代。",
        "noteEn": "Computer Science has separate programme-level requirements. A complete Cambridge International A-Level grade and subject combination was not safely extracted; do not substitute a general threshold.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "工程专业的官方课程级 A-Level 等级与 Cambridge International 对应要求，本次未统一核验；须按具体工程课程页查询。",
        "noteEn": "The programme-level A-Level grades and Cambridge International equivalencies for Engineering were not uniformly verified; consult the relevant engineering degree page.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Business and Economics 为课程级要求；本次仅确认申请人须按具体学位课程查看 A-Level 等级和科目，具体数字及科目未核验。",
        "noteEn": "Business and Economics has programme-specific requirements. This review confirmed only that applicants must check the A-Level grades and subjects for the individual degree; specific figures were not verified.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "生命科学及 Psychology 等科学相关课程为课程级要求；本次未核验可安全转录的统一 Cambridge A-Level 等级或必修科目。",
        "noteEn": "Science-related programmes have programme-specific requirements. No uniform Cambridge International A-Level grade or subject requirement was verified; consult the relevant degree page.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "本次已核验研究未确认 Design 类别的具体 Cambridge A-Level 等级或科目规则；不得据此虚构门槛。",
        "noteEn": "No programme-specific Cambridge International A-Level grade, subject, portfolio, or interview requirement was confirmed in this review.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Arts、Humanities and Social Sciences 须按 individual degree programme 查看；本次未确认统一 Cambridge A-Level 等级或七科范围内的必修/推荐科目。",
        "noteEn": "For Arts, Humanities and Social Sciences, requirements must be checked for the individual degree programme. No uniform Cambridge International A-Level threshold was officially confirmed.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "本次已核验研究未确认 Education 类别的具体 Cambridge A-Level 等级或科目规则；不得据此虚构门槛。",
        "noteEn": "No programme-specific Cambridge International A-Level grade, subject, portfolio, or interview requirement was confirmed in this review.",
        "extras": []
      }
    }
  },
  "manchester": {
    "profileType": "passes_only",
    "generalProfile": "通常要求 three full A Levels；官方总页未公布统一全校最低等级，具体课程另列；国际申请须按国家/课程页面及 individual course profile 核验",
    "generalProfileEn": "Applicants normally need three full A Levels. The University of Manchester does not publish a single university-wide minimum grade requirement on its general pages; requirements vary by course and must be checked against the relevant country or qualification guidance and individual course profile. Cambridge International A Levels can be assessed under the A-level framework, but no general Cambridge grade conversion is published.",
    "englishSummaryZh": "国际本科通常要求课程规定的英语证明；官方概述通常为 IELTS 6.0–7.0，foundation 通常为 5.5。具体课程分项要求优先；学生签证最低 CEFR B2。可接受 IELTS、TOEFL、Pearson、Trinity ISE 等，部分情况下接受 IB Standard Level/IGCSE，豁免或替代资格以官方页面为准。",
    "englishSummaryEn": "International undergraduates normally need the English-language evidence specified by their course. The general overview is usually IELTS 6.0–7.0 (typically 5.5 for foundation programmes), with course-specific requirements taking priority. The minimum for student-visa purposes is CEFR B2. Accepted evidence may include IELTS, TOEFL, Pearson and Trinity ISE, and in some cases IB Standard Level or IGCSE. Exemptions and alternatives follow the official English-language requirements and course pages.",
    "applicationSummaryZh": "2026 entry：Medicine/Dentistry 截止 2025年10月15日18:00（英国时间）；其他本科课程 UCAS equal consideration deadline 为 2026年1月14日18:00（英国时间）。后续年度需重新核验。",
    "applicationSummaryEn": "For 2026 entry, the UCAS deadline is 15 October 2025 at 18:00 UK time for Medicine and Dentistry. For other undergraduate courses, the UCAS equal-consideration deadline is 14 January 2026 at 18:00 UK time. Later application years must be checked against the current official timeline.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": "AAA",
        "requiredSubjects": [
          "biology",
          "chemistry"
        ],
        "recommendedSubjects": [],
        "noteZh": "Medicine MBChB 的典型 A-level offer 为 AAA；要求 Biology/Human Biology 或 Chemistry，并从 Chemistry、Biology、Human Biology 中再修一门。因七科映射不含 Human Biology，规则以 biology/chemistry 表示替代组合。",
        "noteEn": "Medicine MBChB: typical A-level offer AAA, including Biology/Human Biology or Chemistry, plus one further subject from Chemistry, Biology or Human Biology. Applicants must apply through UCAS and take the UCAT; interviews and a selection process are required. Biomedical Sciences: AAA–AAB, including two of Biology, Chemistry, Physics and Mathematics. The course page does not provide a separate Cambridge grade conversion.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "法律课程要求按具体课程变化；已核验官方来源未公布统一 A-level 等级或先修科目。",
        "noteEn": "Law requirements vary by course. The official sources reviewed do not provide a directly citable unified A-level grade or prerequisite-subject requirement; no common university-wide benchmark is published.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": "A*A*A",
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "biology",
          "chemistry",
          "physics"
        ],
        "noteZh": "BSc Computer Science and Mathematics 的典型 A-level offer 为 A*A*A，包括 Mathematics；另要求至少一门 Biology、Chemistry 或 Physics。",
        "noteEn": "BSc Computer Science and Mathematics: typical A-level offer A*A*A, including Mathematics, with at least one of Biology, Chemistry or Physics. No separate Cambridge grade conversion is published on the course page.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "代表性工程课程的具体等级和科目要求须以 individual course profile 为准；本次官方核验未公布统一工程基准。",
        "noteEn": "Requirements vary by individual engineering course. The official general pages reviewed do not publish a unified engineering A-level grade or subject benchmark.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "商科/经济课程要求按具体课程变化；官方未公布统一商科经济 A-level 门槛或统一基准。",
        "noteEn": "Business and economics requirements vary by course. The official general pages reviewed do not publish a unified business/economics A-level grade benchmark.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": "AAA–AAB",
        "requiredSubjects": [
          "biology",
          "chemistry",
          "physics",
          "mathematics"
        ],
        "recommendedSubjects": [],
        "noteZh": "BSc Biomedical Sciences 的典型 A-level 要求为 AAA–AAB，需从 Biology、Chemistry、Physics、Mathematics 四门核心科学中选两门。另已核验 BSc Psychology 典型 offer 为 AAA，要求 Psychology、Biology、Human Biology、Chemistry、Physics、Statistics、Mathematics 或 Further Mathematics 中一门或多门；七科映射仅保留可用科目。",
        "noteEn": "Biomedical Sciences: A-level offer AAA–AAB, including two of Biology, Chemistry, Physics and Mathematics. Cambridge International A Levels may be assessed under the A-level framework, but no separate Cambridge grade conversion is published on the course page. Other science-course requirements vary by course.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验研究未提供设计类课程的可引用等级或七科先修规则。",
        "noteEn": "No unified design A-level grade or subject benchmark was published in the official sources reviewed. Requirements should be checked on the relevant individual course profile.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "文社人文课程要求按具体课程变化；官方未公布统一 A-level 门槛，通常需查看 individual course profile。",
        "noteEn": "Arts and humanities requirements vary by course. The official general pages reviewed do not publish a unified A-level benchmark; the relevant individual course profile should be checked.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验研究未提供教育类课程的可引用等级或七科先修规则。",
        "noteEn": "No unified education A-level grade or subject benchmark was published in the official sources reviewed. Requirements should be checked on the relevant individual course profile.",
        "extras": []
      }
    }
  },
  "warwick": {
    "profileType": "course_specific",
    "generalProfile": "null（官方明确要求 3 full A-levels，但未公布全校统一最低 A-level 等级；具体课程按 individual course typical offer）",
    "generalProfileEn": "Three full A-levels are required. The University has not published a single university-wide minimum A-level grade; requirements are based on each course's typical offer. The university-wide GCSE/Level 2 minimum is Grade C/4, or an equivalent qualification, in both English Language and Mathematics.",
    "englishSummaryZh": "全体申请者须证明英语能力，按课程 English Language Band 执行：IELTS Academic Band A 为总分6.0且单项不低于5.5；Band B 为6.5且单项不低于6.0；Band C 为7.0且单项不低于6.5。Economics、Biomedical/Engineering 等课程须以课程页标示的 Band 为准。合资格考试通常须在开课前两年一个月内完成；部分 GCSE English 或其他列明资格可满足或豁免。",
    "englishSummaryEn": "English requirements are set by course-specific English Language Bands. All applicants must demonstrate English proficiency: IELTS Academic Band A requires 6.0 overall and 5.5 in each component; Band B requires 6.5 overall and 6.0 in each; Band C requires 7.0 overall and 6.5 in each. CIE GCE A-level English Language/Literature is not accepted. Eligible GCSE English or other listed qualifications may meet or exempt the requirement.",
    "applicationSummaryZh": "2027 entry UCAS equal-consideration deadline 为 2027-01-13；Warwick 官方日期页说明通常适用 UCAS 主截止日，申请时须以当年官方更新为准。",
    "applicationSummaryEn": "For 2027 entry, the UCAS equal-consideration deadline is 13 January 2027. This is the usual main UCAS deadline shown on Warwick's official dates page and should be checked against the University's update for the relevant year.",
    "confidence": "高",
    "fields": {
      "medicine": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：本次已核验官方材料未取得 Warwick 医学本科课程及其 Cambridge A-Level 门槛，不能以 Biomedical Sciences 要求代替 Medicine。",
        "noteEn": "No separate undergraduate Medicine Cambridge International A-Level threshold was verified; the University has not published one. Biomedical Sciences is a representative life-science course: AAB including Biology and a second Science, or AAA including Biology.",
        "extras": []
      },
      "law": {
        "publishedGradeProfile": "A*AA",
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "Law LLB 官方典型要求为 A*AA；未规定特定 A-Level 科目。官方提示应尽量避免 Law、Sociology、Psychology 的重叠组合。",
        "noteEn": "Law LLB: A*AA. GCSE Mathematics: Grade 4/C; GCSE English Language: Grade 6/B. LNAT is currently not required. No specific A-level subject is stated; applicants are advised to avoid an overlapping Law/Sociology/Psychology combination where possible.",
        "extras": []
      },
      "computing": {
        "publishedGradeProfile": "A*A*A",
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [],
        "noteZh": "Computer Science BSc 要求 A* in Mathematics；2026-27 申请者一般须参加 TMUA，但官方未公布确切 TMUA 门槛。",
        "noteEn": "Computer Science BSc: A*A*A including A* in Mathematics. Applicants for 2026-27 generally need to take the TMUA; the precise TMUA threshold has not been published.",
        "extras": []
      },
      "engineering": {
        "publishedGradeProfile": "AAA",
        "requiredSubjects": [
          "mathematics",
          "physics"
        ],
        "recommendedSubjects": [],
        "noteZh": "Engineering BEng 官方要求 AAA，包括 Mathematics 和 Physics；contextual offer 为 AAB，包括 Mathematics 和 Physics。",
        "noteEn": "Engineering BEng: AAA including Mathematics and Physics; contextual offer AAB including Mathematics and Physics.",
        "extras": []
      },
      "business": {
        "publishedGradeProfile": "A*AA",
        "requiredSubjects": [
          "mathematics"
        ],
        "recommendedSubjects": [
          "furtherMathematics",
          "economics"
        ],
        "noteZh": "以官方代表性商科/经济学课程映射：Economics BSc 为 A*AA including A in Mathematics；Mathematics required，Further Mathematics/Economics accepted but not essential。",
        "noteEn": "Economics BSc: A*AA including A in Mathematics; GCSE English Language: Grade 6/B. TMUA is optional and may be used in assessment; applicants with the highest TMUA scores may receive an AAA reduced offer, but the specific score has not been published. Accounting and Finance BSc: A*AA including A in Mathematics.",
        "extras": []
      },
      "science": {
        "publishedGradeProfile": "AAB 或 AAA",
        "requiredSubjects": [
          "biology"
        ],
        "recommendedSubjects": [
          "chemistry",
          "physics",
          "mathematics"
        ],
        "noteZh": "代表性 Biomedical Sciences BSc 要求 AAB including Biology and a second Science，或 AAA including Biology。第二科学可包括 Chemistry、Physics、Mathematics 等。",
        "noteEn": "For Biomedical Sciences, the representative requirement is Biology plus a second Science, such as Chemistry, Physics or Mathematics: AAB, or AAA including Biology. Other science-course requirements vary by course; no additional university-wide threshold is published.",
        "extras": []
      },
      "design": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：已核验研究未识别可据以发布 A-Level 等级或七科科目规则的 Design 课程；官方未公布。",
        "noteEn": "Portfolio requirement: not published by the official materials reviewed.",
        "extras": []
      },
      "arts": {
        "publishedGradeProfile": "AAA 或 A*AB",
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "代表性文社人文课程要求因课程而异：History BA 为 AAA including History；English and History BA 为 AAA or A*AB including A in English。",
        "noteEn": "History BA: AAA including History. English and History BA: AAA or A*AB including A in English. Requirements for representative arts and humanities courses vary by course.",
        "extras": []
      },
      "education": {
        "publishedGradeProfile": null,
        "requiredSubjects": [],
        "recommendedSubjects": [],
        "noteZh": "不适用：本次已核验官方研究未取得可用于该方向的 Education 课程等级或七科科目规则，官方未公布。",
        "noteEn": "No separate Cambridge International A-Level requirement for Education was identified in the official research materials; the University has not published a specific threshold.",
        "extras": []
      }
    }
  }
} as const;
