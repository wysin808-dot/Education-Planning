/**
 * Cambridge International A-Level 官方研究数据。
 * 由 31 所院校的官方招生页核验结果生成；未公布信息必须保留为“官方未公布”，不得换算或补写。
 */

export interface AlevelUniversityFact {
  accepted: boolean;
  generalZh: string;
  benchmarksZh: string;
  prerequisitesZh: string;
  englishZh: string;
  extrasZh: string;
  deadlineZh: string;
  sources: string[];
  evidenceZh: string;
}

export const ALEVEL_UNIVERSITY_FACTS: Record<string, AlevelUniversityFact> = {
  "nus": {
    "accepted": true,
    "generalZh": "A good pass in at least three ‘Advanced’ Level subjects；官方未公布具体字母等级（如 A*/A/B）最低线；已完成高中最终考试者以 Advanced Level 成绩申请，尚未完成者须预计在申请当年7月底前至少三门 Advanced Level 取得 good pass。",
    "benchmarksZh": "{\"medicine_life_science\":\"Medicine: Year 12 or higher level pass in Chemistry and Biology or Physics；Medicine 另要求 UCAT、portfolio、shortlisting 后 FSA。生命科学代表性课程（Environmental Studies/Food Science/Pharmacy/Pharmaceutical Science）：Environmental Studies 官方要求参见课程页，未统一公布 Cambridge A-Level 字母门槛；Food Science and Technology: Year 12 or higher level pass in任意两科 Chemistry/Biology/Physics/Physical Science/Computing/Mathematics/Further Mathematics；Pharmacy/Pharmaceutical Science: strong Year 12 pass or strong higher level pass in Chemistry and Biology or Physics or Mathematics。\",\"engineering\":\"Engineering: Year 12 or higher level pass in Mathematics；Computer Engineering: Year 12 or higher level pass in Mathematics；无统一字母等级最低线。\",\"computing\":\"Common Computer Science Programmes: Year 12 or higher level pass in Mathematics；Information Security: Year 12 or higher level pass in Mathematics；Business Analytics/Business Artificial Intelligence Systems: Year 12 or higher level pass in Mathematics。\",\"business_economics\":\"Business Administration: Year 12 or higher level pass in Mathematics；Business Analytics: Year 12 or higher level pass in Mathematics；Data Science and Economics: strong Year 12 pass or strong higher level pass in Mathematics。\",\"law\":\"Law: A high level of proficiency in the English Language；Selection test/interview：Yes；官方未公布 Cambridge A-Level 字母等级门槛。\",\"psychology\":\"Psychology 单一学位的 Cambridge International A-Level 专门门槛：官方课程先修 PDF 未单列；以 International Qualifications 通用要求及具体 programme prerequisites 为准，官方未公布统一等级或必修 A-Level 科目。\",\"arts_humanities\":\"Humanities and Sciences: 请参见 NUS majors 页面，官方未在该 PDF 统一列出 A-Level 字母等级门槛；Philosophy, Politics, and Economics: 请参见 CHS programme 页面；Architecture: Year 12 or higher level pass in Chemistry or Mathematics or Physics or Physical Science；Industrial Design: Year 12 or higher level pass in Arts or Economics or Mathematics or Physics，并有面试。\"}",
    "prerequisitesZh": "Medicine: Year 12 or higher level pass in Chemistry + Biology or Physics；Engineering: Year 12 or higher level pass in Mathematics；Computer Engineering/Common Computer Science/Information Security: Year 12 or higher level pass in Mathematics；Business Administration/Business Analytics: Year 12 or higher level pass in Mathematics；Data Science and Economics: strong Year 12 pass or strong higher level pass in Mathematics；Law: A high level of proficiency in the English Language；Food Science: any two of Chemistry, Biology, Physics, Physical Science, Computing, Mathematics/Further Mathematics；Pharmacy/Pharmaceutical Science: strong Year 12 pass or strong higher level pass in Chemistry + Biology or Physics or Mathematics；Psychology/Humanities and Sciences: 官方未在国际资格先修表单列统一 A-Level 科目要求。",
    "englishZh": "Not required；NUS International A-Level 页面明确 English Requirement 为 Not required。C1 Advanced/Cambridge English: Advanced、EL1119、IELTS、MUET、TOEFL 成绩可提交但不是 admission requirement。Law 另要求 A high level of proficiency in the English Language。",
    "extrasZh": "Medicine: UCAT required；Medicine: portfolio required，shortlisted applicants参加 Focused Skills Assessment (FSA)；Law: shortlisted applicants须参加 Admissions Written Test，成功后参加 Admissions Interview，且两者均须参加；Architecture/Industrial Design/Landscape Architecture: shortlisted applicants有 test/interview；Dentistry: 不适用于尚未完成最终考试的申请者，另有 MDT/MMI；其他上述代表性课程：官方未公布额外考试或面试。",
    "deadlineZh": "2026-02-23（AY2026/2027，International Qualifications for Foreigners；官方页面同时列申请期 2025-12-03 至 2026-02-23）",
    "sources": [
      "https://nus.edu.sg/oam/admissions/international-qualifications-for-foreigners/international-qualifications/international-a-level",
      "https://www.nus.edu.sg/oam/admissions/international-qualifications-for-foreigners/admission-requirements",
      "https://nus.edu.sg/oam/admissions/programme-prerequisites",
      "https://nus.edu.sg/oam/docs/default-source/international-qualifications/cat-d-sdp.pdf?sfvrsn=85c8615_11",
      "https://nus.edu.sg/oam/admissions/faculty-interview-and-test-dates",
      "https://nus.edu.sg/oam/admissions/important-dates"
    ],
    "evidenceZh": "NUS 官方明确将 Cambridge 列入接受的 A-Level boards，并要求至少三门 Advanced Level good pass，但未公布可直接换算为 AAA/A*AA 的全校最低字母等级。课程先修 PDF 使用 Year 12 or higher level pass/strong pass 表述，不应擅自等同 Cambridge A-Level 具体等级。Psychology 及部分 CHS 课程未在国际资格先修表中单列，故标注官方未公布；截止日期按 AY2026/2027 国际资格申请页面。"
  },
  "ntu": {
    "accepted": true,
    "generalZh": "Good passes in at least 4 Advanced Level subjects taken in the same sitting；官方未公布统一 AAA/A*AA 等最低等级；3 门同场 A-Level 可个案审理，但国际学生申请 subsidised tuition fee basis 不适用。持 May/June UK A-Level/IAL、成绩于申请年 8 月公布者不接受当年申请，须申请下一学年。",
    "benchmarksZh": "{\"medicine_life_science\":\"LKCMedicine：官方最低科目要求须以 NTU International Qualifications Minimum Subject Requirements 当年表格为准；本次官方页面未给出 Cambridge A-Level 的固定等级门槛，且 A-Level/Pre-U 成绩须在申请年 3 月 31 日前可得；Biological Sciences：A good grade in Additional Mathematics at Junior High School Level + Physics/Chemistry/Biology at Senior High School Level；Biomedical Sciences and BioBusiness：A good grade in Additional Mathematics + Physics/Chemistry/Biology；官方未公布课程级 A-Level 分数线。\",\"engineering\":\"代表性 B.Eng：Senior High School Level Mathematics + Senior High School Level Biology/Chemistry/Physics；若未读 Senior High School Physics，另需 Junior High School Physics。NTU 页面说明 A-Level Mathematics 足以满足 Mathematics at Senior High School Level；Renaissance Engineering 另有 selection test/interview。\",\"computing\":\"Computer Science：Mathematics at Senior High School Level 或 Physics；UK CIE A-Level Computer Science 可替代表中 Physics 选项。Computer Engineering：Mathematics + Physics/Chemistry/Biology，另需 Junior High School Physics。Data Science and Artificial Intelligence：Mathematics at Senior High School Level。官方未公布 Cambridge A-Level 固定等级线。\",\"business_economics\":\"Economics：A good grade in Additional Mathematics at Junior High School Level + A good grade in English at Senior High School Level，selective basis。Economics and Data Science：Mathematics at Senior High School Level + good English。Business 单独课程的国际 Cambridge A-Level 固定等级门槛未在所查官方页面公布。\",\"law\":\"NTU 官方本科课程/国际资格科目要求页面未列出 Law 学位；因此无可核验的 NTU Law Cambridge A-Level benchmark，官方未公布/不适用。\",\"psychology\":\"Psychology：A good grade in Additional Mathematics at Junior High School Level + A good grade in English at Senior High School Level，selective basis；与 Biological Sciences 双主修另需 Physics/Chemistry/Biology at Senior High School Level。官方未公布 Cambridge A-Level 固定等级线。\",\"arts_humanities\":\"English：A good grade in General Paper/English at Senior High School Level，selection interview；History、Philosophy 等部分课程要求 good grade in General Paper/English。Chinese 相关课程另要求 Chinese at GCE O-Level/HSK Level 6。Art, Design & Media：Junior High School Mathematics + good Senior High School English，并需 portfolio、personal statement/writing samples、creative project、observational drawing。\"}",
    "prerequisitesZh": "Engineering: Mathematics + Biology/Chemistry/Physics；未读 Senior High Physics 时另需 Junior High Physics；Computing: Computer Science 可在指定 Computer Science 课程中替代 Physics；Computer Science/Data Science: Mathematics 或按课程规定 Physics；Life Science: Additional Mathematics（Junior High）+ Biology/Chemistry/Physics（Senior High）；Chemistry and Biological Chemistry: Chemistry + Mathematics/Physics；Economics: Additional Mathematics（Junior High）+ English；Psychology: Additional Mathematics（Junior High）+ English；Arts/Humanities: General Paper/English，Chinese programmes additionally Chinese；Law: NTU 官方未列出；Medicine/LKCMedicine: 课程级 Cambridge A-Level 科目组合本次官方页面未完整公布，官方未公布固定等级。",
    "englishZh": "若高中教学语言不是英语，或成绩单显示英语为第二语言/English as an Additional Language：IGCSE O-Level English first language grade A/7，或 IELTS Overall 6、Writing 6、Speaking 6，或 TOEFL（2026 年前考试 Overall 90、iBT Speaking 25；2026 年 1 月起页面列 Overall 4.5、Speaking 4.5），或 SAT 1250，或 PTE Academic Overall 55、Speaking 55，或 ACT with Writing composite 30，或 C1 Advanced，或 MUET/CEFR B2/E1119 English A。是否豁免取决于高中英语授课/英语科目情况；国际学生不应将 Singapore-Cambridge GP 规则直接套用。",
    "extrasZh": "NTU Entrance Examination (NTU EE)：Not required；Renaissance Engineering Programme：Selection Test/Interview required；部分课程按官方表格为 selective basis 或 interview；Art, Design & Media：portfolio + personal statement/writing samples + creative project + observational drawing；国际科学奥林匹克金/银/铜牌可获更有利考虑，可能面试；Medicine/LKCMedicine：A-Level/Pre-U 成绩须在申请年 3 月 31 日前可得；普通课程最终成绩通常须在 7 月 31 日前可得。",
    "deadlineZh": "AY2026-27：15 October 2025–19 March 2026；官方页面当前标示 Closed。UK A-Level/IAL 成绩若于申请年 8 月公布，不得申请当年，须下一学年申请。",
    "sources": [
      "https://www.ntu.edu.sg/admissions/undergraduate/admission-guide/international-qualifications/uk-a-level-certificates-cambridge-pre-u",
      "https://www.ntu.edu.sg/admissions/undergraduate/admission-guide/international-qualifications",
      "https://www.ntu.edu.sg/media/docs/default-source/undergraduate-admissions/msr/emsr_intnl.pdf?sfvrsn=35f52b2c_5",
      "https://www.ntu.edu.sg/engineering/coe-admissions/minimum-subject-requirements",
      "https://www.ntu.edu.sg/admissions/undergraduate/admission-guide"
    ],
    "evidenceZh": "NTU 明确接受 UK GCE A-Level（含 Cambridge）并要求同场至少 4 门 Advanced Level good passes；未公布 AAA/A*AA 统一最低等级，且满足最低申请条件不保证录取。专业 benchmark 来自 NTU International Qualifications Minimum Subject Requirements；其中 Senior High School Level/Junior High School Level 是国际学历等效层级，不应误读为 Singapore-Cambridge H2/H1。NTU 无 Law 本科项目；LKCMedicine 的具体科目应在申请年度官方表格复核。英语条款存在按高中授课语言和资格类别的条件差异。"
  },
  "smu": {
    "accepted": true,
    "generalZh": "null；官方未公布 Cambridge International/UK A-Level 的统一最低等级。官方要求至少完成 12 年正规教育，并在获认可的国家/国际考试中取得 good passes；UK A Levels（Cambridge、Edexcel、AQA）须按 International/Other qualifications 类别申请。",
    "benchmarksZh": "{\"medicine_life_science\":\"null；SMU 官方本科课程/录取页面未公布医学或生命科学本科课程要求。\",\"engineering\":\"null；SMU 官方本科课程/录取页面未公布工程本科课程要求。\",\"computing\":\"Singapore-Cambridge GCE A-Level 2025 offers indicative 10th–90th percentile：Computer Science AAB/B–AAA/A；Information Systems BBC/C–AAA/B；Software Engineering BBC/B–AAA/C。此为新加坡 A-Level 录取者的历史指导数据，不是 Cambridge International A-Level 门槛；国际学历页面仅明确要求 Economics and Computer Science applicants 高中阶段 Mathematics good pass。\",\"business_economics\":\"Accountancy BBB/C–AAA/A；Business Management ABB/C–AAA/A；Economics BBB/C–AAA/A（均为 Singapore-Cambridge GCE A-Level 2025 offers indicative 10th–90th percentile，非国际 Cambridge A-Level 门槛）；Economics applicants 须高中阶段 Mathematics good pass。\",\"law\":\"Singapore-Cambridge GCE A-Level 2025 offers indicative AAA/A–AAA/A；非国际 Cambridge A-Level 专属门槛，且官方说明历史 profile 不保证录取。\",\"psychology\":\"null；SMU 官方本科课程/录取页面未公布心理学本科课程要求。\",\"arts_humanities\":\"Social Sciences BBB/C–AAA/A（Singapore-Cambridge GCE A-Level 2025 offers indicative 10th–90th percentile，非国际 Cambridge A-Level 门槛）；其他文社人文方向未公布 Cambridge International 专属等级。\"}",
    "prerequisitesZh": "Computer Science/Information Systems/Software Engineering/Economics: high-school Mathematics good pass（官方原文）；Law: 官方国际学历页面未公布 A-Level 科目先修，但 shortlisted applicants 须参加 writing test；其他医学/生命科学、工程、心理学、文社人文：官方未公布或课程未开设",
    "englishZh": "International/Other qualifications applicants must submit one standardised test score unless holding an exempt qualification；non-law IELTS Academic overall 7.0，Reading 7.0，Writing 6.5；Law IELTS Academic overall 7.5，Reading 7.0，Writing 7.0。可替代考试：non-law SAT 1350（EBRW 650）、ACT 29（English+Reading 57）、TOEFL iBT 93（2026-01-21 前；Reading/Writing 各22）或自 2026-01-21 起 TOEFL iBT 5（Reading 5、Writing 4.5）、PTE 66（Reading 66、Writing 56）、C1 Advanced 185（Reading 185、Writing 176）、AST 至少三科且含 English 与 Mathematics，AST English 225；Law 对应 IELTS 7.5、SAT EBRW 700、ACT English+Reading 64、TOEFL 100/新制5.5、PTE 76、C1 191、AST English 240。官方未列 Cambridge International A-Level 英语科目豁免。",
    "extrasZh": "非 Law：shortlisted applicants 面试；Law：shortlisted applicants 先参加 writing test，进一步 shortlisted 后面试；居住在新加坡境外的 shortlisted applicants 可线上 Zoom 面试；官方未公布 Cambridge International A-Level 专属附加考试或 portfolio",
    "deadlineZh": "2026-03-19 23:59（Singapore Standard Time；AY2026-27 International/Other qualifications 申请截止）；若最终高中成绩尚未公布，predicted results 须由学校教师/辅导员认证并于 2026-03-31 提交",
    "sources": [
      "https://admissions.smu.edu.sg/admissions-requirements/international-and-other-qualifications",
      "https://admissions.smu.edu.sg/admissions-requirements/important-dates",
      "https://admissions.smu.edu.sg/admissions-requirements/indicative-grade-profile",
      "https://admissions.smu.edu.sg/faqs/law-interviews-and-writing-tests"
    ],
    "evidenceZh": "SMU 官方明确把 UK A Levels（Cambridge、Edexcel、AQA）纳入 International/Other qualifications 类别，因此 accepts_cambridge_alevel=true；但未公布 Cambridge International A-Level 的统一 AAA 等级门槛。公开的 BBB/C、AAA/A 等仅针对 Singapore-Cambridge GCE A-Level 申请人上一年度 offer 的指导性分位数，不能直接用于国际 Cambridge A-Level 稳妥/匹配/冲刺判断。SMU 也未设医学、工程、心理学本科课程。"
  },
  "sutd": {
    "accepted": true,
    "generalZh": "Good passes in at least three Advanced Level subjects within the same sitting；官方未公布统一最低字母等级（如AAA/A*AA），且不同考试期取得的Advanced Level科目不接受。",
    "benchmarksZh": "{\"medicine_life_science\":\"不适用/官方未公布医学或生命科学本科项目及对应A-Level门槛；SUTD本科招生总体偏好 Mathematics 及 Sciences（尤其 Physics 或 Chemistry）。\",\"engineering\":\"未按工程专业公布单独等级门槛；代表性学术取向为 Mathematics + Physics 或 Chemistry，官方表述为 strong competency in Mathematics and the Sciences generally preferred。\",\"computing\":\"未按计算机专业公布单独等级门槛；官方未公布Computing先修科目或等级，整体重视 Mathematics and Sciences。\",\"business_economics\":\"官方本科页面提及 Economics、Business、Finance 等方向可在 Design and Artificial Intelligence 路径中探索，但未公布A-Level等级或科目先修要求。\",\"law\":\"未发现SUTD法律本科项目；官方未公布法律类A-Level要求。\",\"psychology\":\"官方本科页面提及 Psychology 可在 Design and Artificial Intelligence 路径中探索，但未公布A-Level等级或科目先修要求。\",\"arts_humanities\":\"SUTD列有 Humanities, Arts and Social Sciences（HASS）学术领域，但未公布该领域单独A-Level等级或科目先修要求。\"}",
    "prerequisitesZh": "全校/国际A-Level：Mathematics及一门Science（Physics或Chemistry）具备较强能力者 generally preferred；未公布按具体专业强制A-Level科目组合；UEE考查 Mathematics/Logic Thinking + Physics。",
    "englishZh": "若所提交资格的授课语言不是英语，必须提交 IELTS、TOEFL、SAT、PTE Academic、ACT 或 C1 Advanced 之一；官方明确 no prescribed minimum score，申请按学术及非学术成就综合评审。若授课语言为英语，官方该页未规定必须提交英语考试成绩。",
    "extrasZh": "入学申请采用 holistic/comprehensive review，重视学术、个人特质、活动/成就、领导力、推荐信和个人洞察题；选中的申请者需参加与SUTD faculty/leader的线上或线下 conversation/interview；若以 predicted results 或仅 Advanced Subsidiary Level 申请且被shortlisted，需参加 SUTD University Entrance Examination（UEE）；UEE为基于GCE A-Level Mathematics/Logic Thinking与Physics的闭卷考试，25道数学/逻辑选择题+15道物理选择题，1小时；国际A-Level申请者须提交护照页、O-Level/IGCSE或同等成绩、实际A-Level或AS成绩及相关经历材料。",
    "deadlineZh": "2026-03-02（A-Level Certifications (International) 申请窗口：2026-01-02至2026-03-02；官网同时显示2026申请已关闭，下一次见2027）",
    "sources": [
      "https://www.sutd.edu.sg/admissions/undergraduate/a-level-certifications-international/criteria-for-admission/",
      "https://www.sutd.edu.sg/admissions/undergraduate/a-level-certifications-international/application-timeline/",
      "https://www.sutd.edu.sg/admissions/undergraduate/admission-requirements/international-qualifications/",
      "https://www.sutd.edu.sg/admissions/undergraduate/admission-requirements/overview/",
      "https://www.sutd.edu.sg/admissions/undergraduate/sutd-uee/criteria-for-admission/",
      "https://www.sutd.edu.sg/admissions/undergraduate/"
    ],
    "evidenceZh": "SUTD官网明确将UK A-Level Certifications（Cambridge、Edexcel、OCR、AQA）列为国际申请类别，因此可确认接受Cambridge International A-Level。官网仅给出“至少三门同一考试期Advanced Level科目良好通过”，未给AAA/A*AA等统一最低等级。SUTD不是医学或法律院校，七类字段中多数不存在独立专业门槛；不得用新加坡本地H2/H1要求替代国际A-Level口径。2026申请窗口与UEE信息以官网当前页面为准，年度日期可能更新。"
  },
  "sit": {
    "accepted": false,
    "generalZh": "null；官方未公布 Cambridge International A-Level 的固定全校最低等级。官方仅称海外院校的 international qualification（包括申请人提交的“A Level/Year 12 examination results”）须完成至少12年正规教育，并按个案审理（case-by-case）。",
    "benchmarksZh": "{\"medicine_life_science\":\"null；官方未公布 Cambridge International A-Level 的统一门槛。相关健康科学课程须满足各课程 admission requirements；Allied Health 另有英语及医疗审查要求。\",\"engineering\":\"null；官方未公布 Cambridge International A-Level 等级门槛。Technical University of Munich 合作课程列有 H2 Mathematics + H2 Science（Biology/Chemistry/Physics）这一新加坡 H2 口径，不能直接当作 Cambridge 等级要求。\",\"computing\":\"null；官方未公布 Cambridge International A-Level 等级门槛。SIT-DigiPen Computer Science in Real-Time Interactive Simulation / Computer Science and Game Design 另列 H2 Mathematics/Physics/Computing 之一或 H1 Mathematics 的新加坡口径，不能直接等同 Cambridge。\",\"business_economics\":\"null；官方未公布 Cambridge International A-Level 等级或科目门槛。Business and Infocomm Technology 要求提交 personal statement。\",\"law\":\"null；SIT 官方本科课程/国际资格页面未公布法律课程或 Cambridge International A-Level 法学要求。\",\"psychology\":\"null；SIT 官方本科课程/国际资格页面未公布心理学课程或 Cambridge International A-Level 心理学要求。\",\"arts_humanities\":\"null；官方未公布 Cambridge International A-Level 等级门槛。Communication and Digital Media 要求 written essay + media portfolio；其余相关项目的具体 Cambridge 门槛官方未公布。\"}",
    "prerequisitesZh": "Engineering/TUM合作课程：官方列 H2 Mathematics + H2 Science（Biology/Chemistry/Physics），但这是新加坡 H2 表述，非 Cambridge International A-Level 明确要求；Computing/DigiPen合作课程：H2 Mathematics or Physics or Computing 之一，或 H1 Mathematics（新加坡口径）；Allied Health：各课程需满足 admission requirements，Cambridge International A-Level 具体先修科目官方未公布；Business and Infocomm Technology：无 Cambridge 科目先修数字，需 personal statement；Communication and Digital Media：无 Cambridge 科目先修数字，需 essay + media portfolio",
    "englishZh": "一般国际资格：若高中授课语言不是英语，应提交可接受的英语考试成绩（例如 IELTS、TOEFL）；SIT 国际资格页未给出统一分数。Allied Health 课程另有项目门槛：Diagnostic Radiography/Radiation Therapy 的 GCE A Level General Paper/Knowledge & Inquiry 为 D；Dietetics/Nutrition、Occupational Therapy、Physiotherapy 为 D；Speech and Language Therapy 为 B；但页面同时注明 Knowledge & Inquiry 仅替代 2024 年及以前 Singapore-Cambridge GCE A-Level 的 GP，不能直接视为 Cambridge International A-Level 规则。",
    "extrasZh": "国际资格申请按个案审理；SAT I/SAT II 在适用时计入录取；申请人可能被邀请参加 admission interview，指南称录取具有竞争性且 shortlisted applicants 会获邀面试；Allied Health 需 Mandatory Medical Clearance；Business and Infocomm Technology：personal statement；Communication and Digital Media：700-word written essay + media portfolio；DigiPen：personal statement，Digital Art and Animation 另需 10–15件作品 portfolio",
    "deadlineZh": "2026-01-08至2026-03-19（官方 2026/27 本科申请窗口；国际资格指南概括为每年 January–March，并要求在 March closing date 前提交）",
    "sources": [
      "https://www.singaporetech.edu.sg/admissions/undergraduate/requirements/international-qualifications",
      "https://www.singaporetech.edu.sg/admissions/undergraduate/requirements/programme-specific-requirements",
      "https://www.singaporetech.edu.sg/sites/default/files/2026-04/Application%20International%20Guide_06042026.pdf",
      "https://www.singaporetech.edu.sg/openhouse/application-guide"
    ],
    "evidenceZh": "SIT 官方国际资格页没有明确写出“Cambridge International A-Level”名称，也没有 AAA/A*AA 或其他固定 A-Level 最低等级；它只接受海外 Year-12/A-Level 类资格按个案审理。因此 accepts_cambridge_alevel 按“官方是否明确接受”的严格标准记为 false，而非断言不接受。页面中的 H1/H2、GP、Knowledge & Inquiry 均为新加坡 Cambridge GCE A-Level 体系，已与国际 Cambridge A-Level 口径区分；七类中未有官方明确公布的项目级国际 A-Level 分数，均保留 null。"
  },
  "suss": {
    "accepted": false,
    "generalZh": "null；SUSS 官方全日制本科资格页未公布 Cambridge International A-Level 的具体最低等级；国际及其他资格要求为完成至少12年正规教育，并提交规定的标准化考试成绩。",
    "benchmarksZh": "{\"medicine_life_science\":\"null；官方国际学生全日制本科项目清单未列医学或生命科学本科项目，未公布 Cambridge A-Level 专业门槛。\",\"engineering\":\"null；官方国际学生全日制本科项目清单未列工程本科项目，未公布 Cambridge A-Level 专业门槛。\",\"computing\":\"Bachelor of Science in Information and Communication Technology：官方未公布 Cambridge A-Level 等级或数学/计算机科目要求；国际资格申请适用通用资格与测试要求。\",\"business_economics\":\"Bachelor of Accountancy、Bachelor of Science in Finance、Bachelor of Science in Marketing、Bachelor of Science in Supply Chain Management、Bachelor of Science in Business Analytics：官方未公布 Cambridge A-Level 等级或具体科目要求；IGP 仅为 Singapore-Cambridge A-level UAS 参考，不适用于推定 Cambridge International A-Level 等级。\",\"law\":\"null；官方国际学生全日制本科项目清单未列法律本科项目，未公布 Cambridge A-Level 专业门槛。\",\"psychology\":\"Bachelor of Science in Psychology：官方未公布 Cambridge A-Level 等级或心理学/其他先修科目要求；申请者须将 Psychology 排在第一或第二志愿才可进入面试筛选。\",\"arts_humanities\":\"Bachelor of Arts in Chinese Studies、Bachelor of Early Childhood Education、Bachelor of Human Resource Management、Bachelor of Public Safety and Security、Bachelor of Social Work：官方未公布 Cambridge A-Level 等级或具体科目要求；相关项目可能有面试/选择性评估。\"}",
    "prerequisitesZh": "Computing/ICT: 官方未公布 Cambridge International A-Level 先修科目；Business/Accountancy/Finance/Marketing/Supply Chain/Business Analytics: 官方未公布 Cambridge International A-Level 先修科目；Psychology: 官方未公布 A-Level 先修科目；Arts/Humanities/Social Work/Early Childhood/Public Safety: 官方未公布 A-Level 先修科目",
    "englishZh": "若所持资格的授课语言不是英语：IELTS Academic 6.5，或 TOEFL internet-based 85，或 MUET Band 4.0，或 PTE Academic 58，或 C1 Advanced 180；若无 GCE O-Level English Language Grade C6（或同等成绩），SUSS 可能要求额外测试。IELTS/TOEFL/PTE/C1 成绩须在入学时最近2年内取得；所有结果须于入学年度3月31日前提交。",
    "extrasZh": "国际及其他资格申请须完成至少12年正规教育，并提交以下之一：SAT至少1260且Reading/Math各至少630；ACT至少28且Writing至少8；IELTS/TOEFL/MUET/PTE/C1 Advanced达到官方门槛；入围者最多参加三阶段评估（essay writing、online cognitive test、programme-specific interview/assessment centre）；国际学生可能可线上参加；须持有效 Student's Pass；官方未公布 Cambridge A-Level 专属附加考试或面试豁免。",
    "deadlineZh": "2025-11-19至2026-03-19（July 2026 全日制本科申请窗口，已结束）；July 2027 申请将于2026年11月开始；英语及 SAT/ACT 等成绩须于入学年度3月31日前提交。",
    "sources": [
      "https://www.suss.edu.sg/admissions/application-process/eligibility/full-time-undergraduate-admission-criteria",
      "https://www.suss.edu.sg/admissions/application-process/international-students/international-ft-undergraduate-students",
      "https://www.suss.edu.sg/admissions/application-process/how-to-apply/full-time-undergraduate-application-guide",
      "https://www.suss.edu.sg/admissions/application-process/indicative-grade-profile-igp",
      "https://www.suss.edu.sg/programmes/detail/bachelor-of-science-in-psychology",
      "https://www.suss.edu.sg/docs/default-source/content_admissions/international-qualifications.pdf?sfvrsn=472369a0_1"
    ],
    "evidenceZh": "SUSS 官方资格页明确列出 Singapore-Cambridge GCE A Level 的本地资格门槛（至少2门H2内容科目、GP、PW及H1对比科目），但未明确写 Cambridge International A-Level 或其等级换算。国际资格路径只写完成至少12年教育并满足标准化考试要求；因此本记录不把本地 H2/H1/UAS 或 IGP 数字移植到 Cambridge International A-Level。国际学生官网列出12个全日制本科项目，未含医学、工程、法律。Cambridge 接受性与专业 A-Level 等级/先修科目均按官方未公布处理，置信度：中等。"
  },
  "hku": {
    "accepted": true,
    "generalZh": "null；香港大学官方国际资格系统明确列出“GCE A-level / International A-level”，但未公布适用于全校所有课程的统一 Cambridge International A-Level 最低等级；录取按课程及申请人整体竞争力评估。",
    "benchmarksZh": "{\"medicine_life_science\":\"Medicine/MBBS：官方未公布 Cambridge International A-Level 的统一公开等级门槛；HKUMed说明非本地申请者须 exceptionally well qualified，并要求良好英语及粤语能力。生命科学/Science：2025 BSc参考最低录取为 1A* 2A（GCEAL）；Science Master Class参考为 4A*（GCEAL）。\",\"engineering\":\"官方未公布 Cambridge International A-Level 的统一公开等级门槛；具体课程的 Expected Lower Boundary 与 Subject Requirements 需在HKU国际资格招生系统按课程查询。\",\"computing\":\"官方未公布 Cambridge International A-Level 的统一公开等级门槛；HKU说明 Computing and Data Science相关课程有独立招生信息/名额安排，需按课程页面查询。\",\"business_economics\":\"官方未公布 Cambridge International A-Level 的统一公开等级门槛及统一科目组合；按具体课程和当年竞争情况评估。\",\"law\":\"官方未公布 Cambridge International A-Level 的统一公开等级门槛及统一科目组合；按具体课程和当年竞争情况评估。\",\"psychology\":\"官方未公布 Cambridge International A-Level 的统一公开等级门槛及统一科目组合；按具体课程和当年竞争情况评估。\",\"arts_humanities\":\"官方未公布 Cambridge International A-Level 的统一公开等级门槛及统一科目组合；按具体课程和当年竞争情况评估。\"}",
    "prerequisitesZh": "Medicine/MBBS：官方页面未列 Cambridge A-Level具体科目等级；要求良好英语及粤语；Science/BSc：官方2025 GCEAL参考录取为1A* 2A，但该页面未将其表述为普适最低门槛；Science Master Class：GCEAL参考为4A*；其HKDSE页面强调科学方向通常涉及Biology/Chemistry/Physics，但不能直接转换为Cambridge A-Level硬性先修；Engineering/Computing/Business/Economics/Law/Psychology/Arts & Humanities：官方未公布可核实的统一Cambridge A-Level先修组合",
    "englishZh": "IELTS Academic overall 6.5（同一次考试）；TOEFL iBT 93；香港大学另列 Cambridge English：C1 Advanced Grade C或总分180，以及C2 Proficiency Level C1或总分180。具体豁免/替代资格以HKU官方English Language Requirement表为准；官方未证实仅凭Cambridge International A-Level英语科目即可普遍豁免。",
    "extrasZh": "国际/非JUPAS申请按学业成绩及其他因素综合评估；可能包括面试、个人陈述、推荐信及其他文件；HKUmed非JUPAS候选人可能按个人表现获邀面试，面试评估动机、态度、领导力和社会意识；作品集或统一入学考试：官方未公布为全校通用要求",
    "deadlineZh": "2026-08-21（香港时间中午，国际资格申请截止；2026入学页面）；首轮评估截止为2025-11-26香港时间中午，之后滚动评估",
    "sources": [
      "https://admissions.hku.hk/apply/international-qualifications",
      "https://admissions.hku.hk/apply/international-qualifications/english-language-requirement",
      "https://hkumed-ugadmissions.hku.hk/admissions-non-jupas-scheme/",
      "https://www.scifac.hku.hk/prospective/ug/admissions/requirements-and-application"
    ],
    "evidenceZh": "香港大学官网国际资格页面明确接受并处理GCE A-level/International A-level申请，但未在静态页面给出全校统一Cambridge International A-Level门槛；系统按国家/资格/课程动态显示Expected Lower Boundary和Subject Requirements。Science学院页面给出2025 GCEAL参考最低录取分数（1A*2A、4A*），属于课程参考值而非全校最低要求。医学页面明确非本地竞争激烈、需良好英语和粤语并可能面试。截止日期按官网2026入学国际资格页面记录。"
  },
  "cuhk": {
    "accepted": true,
    "generalZh": "3AL passes / 2AL+2AS passes；官网明确列为 GCE AL / International AL 的通用最低资格，且注明不同专业有不同科目要求；满足最低要求不保证录取。",
    "benchmarksZh": "{\"medicine_life_science\":\"Medicine (MBChB): GCE/IAL 学生应修 4 门 AL（Chinese、EPQ 不计），其中应有 Chemistry 或 Biology，二者兼修更佳；至少 3 门 AL 须在 12 个月内 cash-in；官网未公布 MBChB 通用最低等级。Global Physician-Leadership Stream 另列 A* in all subjects 且平均分至少 97%。\",\"engineering\":\"代表性项目 BSc Mathematics and Information Engineering：Further Mathematics（preferred）或 Mathematics + Biology/Chemistry/Computer Science/Physics 至少一门；Mathematics 要求 Grade A，或 Further Mathematics Grade B or above；另有面试和 Math quiz。\",\"computing\":\"Computer Science / Computer Science and Engineering 的国际 A-Level 项目级最低等级：官方未公布；CUHK 总则仅要求 3AL passes / 2AL+2AS passes，项目科目要求须按具体项目核验。\",\"business_economics\":\"商科/经济类 International A-Level 统一项目级最低等级及科目组合：官方未公布；适用 CUHK 通用 3AL passes / 2AL+2AS passes，具体项目另行评估。\",\"law\":\"LLB：至少 AAA in 3 non-language GCE/IAL Advanced Level subjects，或 English + 2 non-language GCE/IAL Advanced Level subjects，且应在 one sitting；过去绝大多数录取者超过该门槛。\",\"psychology\":\"心理学项目的 International A-Level 项目级最低等级及先修科目：官方未公布；适用 CUHK 通用门槛并按个案/竞争情况评估。\",\"arts_humanities\":\"文社人文项目的 International A-Level 项目级最低等级及先修科目：官方未公布；适用 CUHK 通用门槛，个别课程可能有语言或项目要求。\"}",
    "prerequisitesZh": "Medicine (MBChB): 4 AL subjects; Chemistry or Biology required, both preferred; Further Maths not counted separately; Engineering (MIEG): Further Mathematics preferred or Mathematics + at least one of Biology/Chemistry/Computer Science/Physics; Grade A in Mathematics or Grade B or above in Further Mathematics; Law (LLB): 3 non-language GCE/IAL AL subjects, or English plus 2 non-language AL subjects, AAA minimum; Computing, Business/Economics, Psychology, Arts/Humanities: 官方未公布统一 Cambridge A-Level 科目先修要求",
    "englishZh": "CUHK 国际/非本地本科页面列明 GCE AL / AS English minimum E；IELTS (Academic) 6.0 overall；TOEFL iBT 2026 entry: 80 total for tests before 2026-01-21, or 4.5/6 and 80/120 overall for tests on/after 2026-01-21；SAT Evidence-Based Reading and Writing 590；ACT ELA 23。LLB 项目另列 IELTS 7.0 或 Internet-Based TOEFL 5.5/6 或 100/120；中文通常不要求，但个别课程（如 Chinese Medicine、Chinese Language and Literature）例外；中文要求可由相关学院酌情豁免，条件是此前修读认可的非本地中学或以上课程。",
    "extrasZh": "全校：如被邀请，须参加面试，部分项目偏好面试但并非全部；Medicine：面试，UCAT/UKCAT、MCAT 等医学入学考试非强制但可作为有力支持材料；MIEG：shortlisted applicants 参加 interview and Math quiz；LLB：官网未列额外笔试/作品集，按个案评估",
    "deadlineZh": "2026 entry：Advance Offer Round 2025-11-13；Regular Round 2026-01-08；Extended Deadline 2026-05-29",
    "sources": [
      "https://admission.cuhk.edu.hk/application/overseas-other-qualifications-non-local-international-team/requirements/",
      "https://admission.cuhk.edu.hk/application/overseas-other-qualifications-non-local-international-team/faq/",
      "https://admission.cuhk.edu.hk/application/non-jupas/language-requirements/",
      "https://www.med.cuhk.edu.hk/study/prospective-students/undergraduate-study/programme-and-admission/mbchb-and-gps/admissions/non-jupas",
      "https://www.ie.cuhk.edu.hk/programmes/bsc-in-mieg/admission/",
      "https://www.law.cuhk.edu.hk/app/study-with-us/bachelor-of-laws-llb/",
      "https://admission.cuhk.edu.hk/programmes/list/"
    ],
    "evidenceZh": "官网明确接受并区分 GCE AL / International AL，通用资格为 3AL passes 或 2AL+2AS passes。专业层面公开度不一：医学、MIEG、LLB 有明确要求；计算机、商科经济、心理学及多数文社人文项目的 Cambridge A-Level 具体最低等级/科目组合未在已核验官方页面统一公布，不能用 HKDSE、ATAR 或新加坡 H2/H1 替代。医学页面的 4 AL 是修读/评估结构，不等同于通用最低等级。"
  },
  "hkust": {
    "accepted": true,
    "generalZh": "Passes in at least three Advanced Level (AL) subjects in the GCEAL/International AL examinations；官方通用最低门槛为高中毕业且至少通过三门 AL 科目。2025 intake 中间50%参考区间为 144–168（AAA 至 3A*），属于竞争性参考而非最低录取线。",
    "benchmarksZh": "{\"medicine_life_science\":\"HKUST未设医学学位；生命科学代表性要求：BSc in Biomedical and Health Sciences 为 one senior level subject from Chemistry, Biology，Interview is compulsory；Science Group B（生化、 生物技术等）为 Chemistry 或 Biology，面试非强制。\",\"engineering\":\"工程各院系代表性要求：Senior level Mathematics，另加 Physics、Chemistry、Biology 或 Computer Science 其中一门；Interview is not compulsory。\",\"computing\":\"Computer Science and Engineering、BEng in Computer Engineering：Senior level Mathematics，另加 Physics、Chemistry、Biology 或 Computer Science 其中一门；Interview is not compulsory。\",\"business_economics\":\"Business and Management 及商科/经济项目页面未显示特定科目要求；No specific subject requirements；Interview is not compulsory。\",\"law\":\"HKUST官方本科项目列表及国际资格页面未列 Law/LLB 项目；官方未公布。\",\"psychology\":\"HKUST官方本科项目列表及国际资格页面未列独立 Psychology 项目；官方未公布。\",\"arts_humanities\":\"School of Humanities and Social Science（BSc in Global China Studies、BSc in Quantitative Social Analysis）为 No specific subject requirements；Interview is not compulsory。\"}",
    "prerequisitesZh": "生命科学：Chemistry or Biology；工程：Mathematics + one of Physics/Chemistry/Biology/Computer Science；计算机：Mathematics + one of Physics/Chemistry/Biology/Computer Science；商科经济：No specific subject requirements；文社人文：No specific subject requirements；法律：官方未公布（未列项目）；心理学：官方未公布（未列项目）",
    "englishZh": "须满足 HKUST English Language Requirements。官方公开门槛包括 IELTS 6.0（or equivalent）、TOEFL iBT 60；GCE AS or A-Level English 的具体等级及完整豁免规则在当前官方国际资格页面未能直接核验，故该项官方未公布。申请人须提交 proof of English language proficiency；不得将 Cambridge International A-Level 本身自动视为英语豁免。",
    "extrasZh": "至少一名 academic referee；GCE-AL/IAL/Cambridge Pre-U 申请人须提供 IB Coordinator/Career Counselor 联系方式以提交 predicted grade report；面试通常非强制，但 BSc in Biomedical and Health Sciences、International Research Enrichment 等项目面试强制；学校采取 holistic review；申请费 HKD600",
    "deadlineZh": "2025-11-20（Early Round）；2026-01-08（Main Round）；2026-06-30（Late Round，2026/27 intake官方页面）",
    "sources": [
      "https://join.hkust.edu.hk/zh-hans/admissions/international-qualifications?general_requirement=46185",
      "https://join.hkust.edu.hk/admissions/international-qualifications",
      "https://join.hkust.edu.hk/admissions/international-qualifications/application-procedures",
      "https://join.hkust.edu.hk/pre-university/preu-programnotes",
      "https://join.hkust.edu.hk/oas/de_guide.pdf",
      "https://join.hkust.edu.hk/university-admissions-scholarship-for-gceal-international-al"
    ],
    "evidenceZh": "港科大官方将 GCEAL/IAL 明确列为 British-patterned 国际资格，并明确接受“至少三门 Advanced Level passes”。AAA至3A*是2025 intake 中间50%竞争性参考，不是最低线。专业要求按申请选项列示，部分项目仅公布科目类别而未公布等级。港科大未列医学、法律或独立心理学本科项目，相关字段按官方未公布处理。英语页面公开 IELTS 6.0/TOEFL iBT 60，但 GCE A-Level English 具体替代等级与豁免条件未在已核验页面中明确呈现。"
  },
  "cityu": {
    "accepted": false,
    "generalZh": "Grade E or above in three GCE A Level (or A2) / International A Level subjects；官方明确接受 GCE A Level/International A Level，但未将 Cambridge International A-Level 作为独立品牌名称明确列出；两门 AS 可折算一门 A-Level，且同一科目不得同时计入 A-Level 与 AS。",
    "benchmarksZh": "{\"medicine_life_science\":\"Bachelor of Veterinary Medicine：Grade C in Mathematics, Biology and Chemistry at GCE A-level (or A2) or International A-level；其他生命科学代表课程的 Cambridge/International A-Level 专项门槛官方未统一公布。\",\"engineering\":\"代表性工程课程（如 BEng Architectural Engineering、BEng Civil Engineering）：要求或接受 GCE A-Level Mathematics grade C or above；具体课程及其他工程专业组合要求以课程页为准，统一 Cambridge 门槛官方未公布。\",\"computing\":\"计算机类：官方招生总则覆盖 GCE A Level/International A Level；代表性课程的 Cambridge/International A-Level 专项等级及科目组合未在已核验官方页统一公布。\",\"business_economics\":\"商科经济类：官方招生总则适用 GCE A Level/International A Level；具体 Cambridge/International A-Level 等级与先修科目官方未统一公布。\",\"law\":\"Bachelor of Laws：须满足 general entrance requirements；另有 programme-specific English：IELTS 7.0 或 TOEFL iBT 100，或 IB English 6，或 IGCSE English First Language B/6、Second Language A/7，或 HKDSE English 5；未公布 Cambridge A-Level 专项总分。\",\"psychology\":\"心理学类：官方招生总则适用 GCE A Level/International A Level；课程专项 Cambridge/International A-Level 等级与先修科目官方未公布。\",\"arts_humanities\":\"文社人文类：官方招生总则适用 GCE A Level/International A Level；课程专项 Cambridge/International A-Level 等级与先修科目官方未统一公布。\"}",
    "prerequisitesZh": "Veterinary Medicine: Mathematics + Biology + Chemistry, each Grade C；Engineering (Architectural/Civil examples): Mathematics Grade C or above；Law: no Cambridge A-Level subject prerequisite found, but programme-specific English threshold applies；Computing/Business & Economics/Psychology/Arts & Humanities: 官方未公布统一 Cambridge A-Level 先修科目",
    "englishZh": "General GCE route: Grade C / Grade 4 or above in GCSE English Language or English Literature, or TOEFL iBT 79, or overall IELTS 6.5；若入学资格所用教育并非英语授课，须提交认可英语测试；Bachelor of Laws has higher programme-specific threshold: IELTS 7.0 or TOEFL iBT 100, or equivalent published alternatives.",
    "extrasZh": "Individual programmes may require interview；School of Creative Media strongly recommends/requests portfolio submission via its online portfolio system；Veterinary Medicine and other programmes may impose programme-specific requirements；未见全校统一附加考试",
    "deadlineZh": "2025-11-15（Early Round）；2026-01-15（Main Round，Semester A 2026/27）；2026-01-16起 Late Round applications and offers（官方页面列示）",
    "sources": [
      "https://www.cityu.edu.hk/admo/admissions/international-admissions",
      "https://www.cityu.edu.hk/admo/admissions/non-jupas-year-1-admission",
      "https://www.cityu.edu.hk/admo/programmes/bachelor-veterinary-medicine",
      "https://www.cityu.edu.hk/admo/programmes/beng-architectural-engineering",
      "https://www.cityu.edu.hk/admo/programmes/beng-civil-engineering",
      "https://www.cityu.edu.hk/admo/programmes/bachelor-laws",
      "https://www.cityu.edu.hk/admo/apply-now/non-local-applicants"
    ],
    "evidenceZh": "CityUHK 官方国际招生页明确写作“GCE A Level/International A Level”，并列出 Grade E×3 的一般门槛；但在已核验页面中未明确写出“Cambridge International A-Level”这一品牌名称，因此按严格“官方明确接受”口径标为 false，不将 International A-Level 自动等同于 Cambridge。课程专项要求仅填入官方可核验项目；未找到的类别均标注官方未公布。页面显示的是 2026/27 申请周期，截止日期可能随年度更新。"
  },
  "polyu": {
    "accepted": true,
    "generalZh": "GCE A-Level / International A-Level subjects with Grade B or above in 3 AL subjects；官方国际/其他资历页面明确接受 Cambridge/International A-Level，并以3门AL科目B或以上作为通用门槛。",
    "benchmarksZh": "{\"medicine_life_science\":\"医学：PolyU官方国际本科课程/偏好科目页未列医学学位，官方未公布；生命科学代表：Biomedical Engineering 偏好 Biology, Chemistry, Mathematics and/or Physics；Biotechnology and Chemical Technology 的具体A-Level等级门槛官方未公布。\",\"engineering\":\"代表：Aviation Engineering 偏好 English, Mathematics, Physics 或其他STEM科目（如 Chemistry, Computer Science, Electronics）；Civil Engineering 偏好 Physics, Chemistry, Mathematics and Calculus；官方未公布专业最低A-Level等级。\",\"computing\":\"Computer and Mathematical Sciences组合整体无preferred subjects；Applied Mathematics and Finance Analytics偏好 English Language and Mathematics；Computing and AI组合无preferred subjects；官方未公布专业最低A-Level等级。\",\"business_economics\":\"Business Administration及其Accountancy/Accounting and Finance、Digital Finance、Management、Marketing等组合均标示 No preferred subjects；官方未公布专业最低A-Level等级。\",\"law\":\"PolyU官方国际本科课程列表/偏好科目页未发现独立LLB或法律学位，专业门槛官方未公布。\",\"psychology\":\"PolyU官方国际本科课程/偏好科目页未列独立心理学本科课程，专业门槛及先修科目官方未公布。\",\"arts_humanities\":\"Humanities组合涵盖 Chinese History and Culture、English and Applied Linguistics、Language Science and Technology、Speech Therapy；偏好科目/专业A-Level最低等级官方未公布。\"}",
    "prerequisitesZh": "Engineering（Aviation）：English + Mathematics + Physics或其他STEM；Engineering（Civil）：Physics/Chemistry/Mathematics/Calculus；Engineering（Biomedical）：Biology/Chemistry/Mathematics/Physics；Computing：Computer and Mathematical Sciences组合无preferred subjects，Applied Mathematics and Finance Analytics偏好English Language + Mathematics；Business：无preferred subjects；Humanities：官方未公布；Medicine/Law/Psychology：官方未公布或无对应独立本科课程",
    "englishZh": "非本地申请人须满足英语要求；GCE / International AS or A-Level：English、English Language或English Literature Grade E或以上。另可用TOEFL iBT 80（一 sitting）或IELTS Academic overall 6.0（一 sitting）等；具体课程可另有规定。",
    "extrasZh": "申请须上传学历证书/成绩单及课程要求的支持文件；面试一般非强制，但学院可个别通知候选人。Business Administration：合适申请人可能获约15分钟英语个人面试；Engineering：合适申请人可能获约15–30分钟英语个人/小组面试；Computing and Mathematical Sciences：仅必要时邀请线上个人面试；Humanities：候选人可能获约10–15分钟英语及中文个人/小组面试；作品集：本次核验的上述代表性课程未见A-Level申请者统一要求，官方未公布。",
    "deadlineZh": "2026-05-15（Sept 2026 Entry，International / Other Qualification；部分页面同时列Early Round 2025-11-19及Main Round 2026-02-05）",
    "sources": [
      "https://www.polyu.edu.hk/study/ug/admissions/international-other-qualifications/international-other-qualifications-general",
      "https://www.polyu.edu.hk/study/ug/admissions/international-other-qualifications/international-other-qualifications-english",
      "https://www.polyu.edu.hk/study/ug/admissions/international-other-qualifications/international-other-qualifications-preferred",
      "https://www.polyu.edu.hk/study/ug/admissions/international-other-qualifications/international-other-qualifications-admission",
      "https://www.polyu.edu.hk/study/ug/admissions/international-other-qualifications/international-other-qualifications-application",
      "https://www.polyu.edu.hk/study/ug/admissions/international-other-qualifications/international-other-qualifications-additional",
      "https://www.polyu.edu.hk/study/ug/international/2026/js3007"
    ],
    "evidenceZh": "官方国际资历页面明确将GCE A-Level / International A-Level列为可申请资历，通用要求为3门AL科目B或以上；这不是逐专业保证录取线。官方另公布GCE录取分数的历史25–75百分位（2025入学为144–168 UCAS points，3门AL），仅供参考，不能替代专业最低线。专业分类中医学、法律、心理学未见对应独立本科课程，故填官方未公布；新加坡H2口径未用于本结论。"
  },
  "hkbu": {
    "accepted": true,
    "generalZh": "Grade E or above in three AL/IAL subjects；或 Grade E or above in two AL/IAL subjects plus two Advanced Supplementary Level (ASL) subjects（不包括 Chinese 与 English Language，且同一科目不得同时计入 AL 和 ASL）；这是官方一般学历门槛，具体课程另有 Programme Admissions Requirements。",
    "benchmarksZh": "{\"medicine_life_science\":\"医学：HKBU本科官方课程列表未见 Medicine，官方未公布医学要求；生命科学/生物医学：可核验的相关课程为 Bachelor of Chinese Medicine and Bachelor of Science (Hons) in Biomedical Science，国际 A-Level 专属最低等级及科目组合官方未公布，需满足一般 Grade E 门槛及课程要求。\",\"engineering\":\"HKBU本科官方国际招生课程列表未见 Engineering 学位，工程类 Cambridge A-Level 专业门槛官方未公布。\",\"computing\":\"Business Computing and Data Analytics 等计算/数据课程列有课程要求入口，但针对 Cambridge A-Level 的具体最低等级与科目组合官方未公布；不要将 HKDSE Mathematics compulsory part 要求转换为 A-Level 数字门槛。\",\"business_economics\":\"School of Business 采用 broad-based admissions；Bachelor of Business Administration (Hons) 课程页有 Programme Entrance Requirements，但 Cambridge A-Level 的专业最低等级与 Economics/Mathematics 强制组合官方未公布。\",\"law\":\"HKBU本科官方课程列表未见 LLB/法律学位，法律类要求官方未公布。\",\"psychology\":\"官方本科课程列表未见独立 Psychology 学位/专业的 Cambridge A-Level 基准，官方未公布。\",\"arts_humanities\":\"Faculty of Arts and Social Sciences 采用 broad-based admissions；艺术、人文及社会科学各课程的 Cambridge A-Level 专属最低等级和科目组合官方未公布，统一先按一般 Grade E 门槛核验。\"}",
    "prerequisitesZh": "Biomedical Science/Chinese Medicine: Cambridge A-Level 专属先修科目官方未公布；Business: Cambridge A-Level 专属 Mathematics/Economics 先修要求官方未公布；Computing/Data Analytics: Cambridge A-Level 专属 Mathematics/Computing 先修要求官方未公布；Arts/Humanities/Social Sciences: 官方未公布 Cambridge A-Level 指定先修科目；Engineering/Medicine/Law/Psychology: 对应本科课程或独立学位未核验到，官方未公布",
    "englishZh": "英国学历路径官方接受以下任一英语证明：GCE O-Level/GCSE English、English Language 或 English Literature Grade C；或 IGCSE First Language English Grade C；或 IGCSE English as a Second Language Grade B；或 GCE AS/A-Level English Grade E；或 alternative。IELTS/TOEFL具体分数在所核官方英国学历条目中未公布（官方未公布）。",
    "extrasZh": "HKBU明确采用 holistic approach 并要求满足大学入学、英语及（如有）课程入学要求；针对 Cambridge International A-Level 的统一附加考试、作品集或面试要求官方未公布；部分课程可能另有 Programme Entrance Requirements，须逐课程核验。",
    "deadlineZh": "官方未公布；2026国际学生页面仅说明 Early Round 与 Main Round，Early Round录取自2025年12月下旬起、未获录取者于2026年1月下旬与Main Round一并考虑；该页面未给出统一国际 A-Level 截止日期。",
    "sources": [
      "https://admissions.hkbu.edu.hk/admissions/international-qualifications.html",
      "https://calendar.ar.hkbu.edu.hk/userfiles/calendar/2025/pages/General_Entrance_Requirements_for_Applicants_with_Overseas_Qualifications_2026_Entry.pdf",
      "https://admissions.hkbu.edu.hk/programmes/faculty-of-science/bachelor-of-science-hons-in-business-computing-and-data-analytics-year1.html",
      "https://admissions.hkbu.edu.hk/programmes/school-of-business/bachelor-of-business-administration-hons-year1.html",
      "https://admissions.hkbu.edu.hk/programmes/school-of-chinese-medicine/bachelor-of-chinese-medicine-and-bachelor-of-science-hons-in-biomedical-science-year1.html"
    ],
    "evidenceZh": "HKBU官方明确接受 GCE AL/International AL（含 Cambridge International A-Level 可归入 IAL/AL口径），一般门槛为三科 AL/IAL Grade E，或两科 AL/IAL加两科 ASL。官方材料没有按七类专业发布 Cambridge A-Level 的可比录取分数或统一先修科目；页面中的 HKDSE、ATAR、JEE 等要求未转译为 A-Level。课程采取 holistic selection，最低门槛不等于实际录取线。"
  },
  "eduhk": {
    "accepted": true,
    "generalZh": "Grade D or above in 3 AL subjects；或 Grade D in 2 AL plus 2 Advanced Supplementary Level (ASL) subjects；官方明确适用于 GCE Advanced Level (AL) / International Advanced Level (IAL)，且不计 Chinese/Mandarin/English Language subjects，同一科目不得同时计入 AL 与 ASL。",
    "benchmarksZh": "{\"medicine_life_science\":\"官方未公布；官网通用 GCE AL/IAL 门槛为 Grade D or above in 3 AL subjects（EdUHK本科课程清单未以医学/生命科学专业类别公布可核验的 Cambridge 专业分数）\",\"engineering\":\"官方未公布；未核实到 Cambridge A-Level 专业等级或工程先修科目\",\"computing\":\"官方未公布；未核实到 Cambridge A-Level 专业等级或计算机先修科目\",\"business_economics\":\"官方未公布；未核实到 Cambridge A-Level 专业等级或商科/经济先修科目\",\"law\":\"官方未公布；未核实到 Cambridge A-Level 专业等级或法律先修科目\",\"psychology\":\"官方未公布；未核实到 Cambridge A-Level 专业等级或心理学先修科目\",\"arts_humanities\":\"官方未公布；未核实到 Cambridge A-Level 专业等级或文社人文先修科目\"}",
    "prerequisitesZh": "医学/生命科学：官方未公布；工程：官方未公布；计算机：官方未公布；商科/经济：官方未公布；法律：官方未公布；心理学：官方未公布；文社人文：官方未公布",
    "englishZh": "IELTS Academic Overall Band 6（官网注明不接受 IELTS one-skill retake，考试须在 test centre 进行且成绩在考试日起两年内有效）；Pearson Test of English Academic (PTE Academic) overall score 62 or above；官网同时列有 TOEFL Internet-based Test (iBT)（Institution Code: 5225），但本次官方页面可核实摘录未显示分数阈值，故不填数字；如以 A-Level 英语科目作为计入门槛，官方明确 English Language subjects 不计入 GCE AL/IAL 通用门槛。",
    "extrasZh": "入学按竞争性综合评估，达到最低门槛不保证录取；符合条件者可能被要求参加 admission interview；未核实到 Cambridge A-Level 申请人统一必考的额外考试或作品集要求。",
    "deadlineZh": "2026-05-06（2026/27 International Applicants late-round listed deadline；申请按 rolling basis，官网注明截止后仍可能视名额接受申请）",
    "sources": [
      "https://www.apply.eduhk.hk/ug/nonlocal",
      "https://www.apply.eduhk.hk/ug/nonlocal_dates",
      "https://www.apply.eduhk.hk/ug/nonlocal_procedures",
      "https://www.apply.eduhk.hk/ug/programme_list"
    ],
    "evidenceZh": "EdUHK官网明确接受 GCE AL/IAL，并给出 Grade D 通用门槛；这证明国际 A-Level/IAL 的一般资格，但不等同于每个专业的录取保证。官网声明还可能有 programme specific requirements，且录取取决于竞争、名额及面试；本次仅将官方明确可核实内容列入，七类专业未核实到 Cambridge 专属等级或科目先修，均标为官方未公布。"
  },
  "lingnan": {
    "accepted": true,
    "generalZh": "Passes in three AL/IAL subjects, excluding Chinese and English language subjects；或 passes in two AL/IAL subjects plus passes in two Advanced Supplementary (AS) subjects（同一科目不得同时计入 A Level 与 AS Level）；官方未公布 A*/A 等级组合。校方将 British Patterned GCE Advanced Level / International Advanced Level 列为认可国际学历。",
    "benchmarksZh": "{\"medicine_life_science\":\"官方未公布；Lingnan 本科项目页面未列医学或生命科学专业。\",\"engineering\":\"官方未公布；未检出针对 GCE AL/IAL 的工程专业最低成绩或先修科目。\",\"computing\":\"官方未公布；Data Science 项目的招生 PDF 对 HKDSE 另列 Mathematics Compulsory Part Level 3，但该口径不是 Cambridge International A-Level，不能迁移为 A-Level 要求。\",\"business_economics\":\"官方未公布；未检出针对 GCE AL/IAL 的商科/经济专业最低成绩或先修科目。\",\"law\":\"官方未公布；未检出法律本科项目或针对 GCE AL/IAL 的法律先修科目。\",\"psychology\":\"官方未公布；未检出针对 GCE AL/IAL 的心理学专业最低成绩或先修科目。\",\"arts_humanities\":\"官方未公布；未检出针对 GCE AL/IAL 的文社人文专业最低成绩或先修科目。\"}",
    "prerequisitesZh": "全校国际学历通用口径：三门 AL/IAL passes（Chinese、English language subjects 不计）或两门 AL/IAL passes + 两门 AS passes；专业科目先修：官方未公布",
    "englishZh": "申请阶段须满足校方 International Qualifications PDF 的 English Language Requirements；官方页面示例为 IELTS Academic overall 6.0（One Skill Retake accepted），并列有 TOEFL、IB English、GCE/GCSE/IGCSE English 等替代资格；具体豁免/等效资格以官方 PDF 第 3 节为准。",
    "extrasZh": "Admission interview：可能安排，校方 FAQ 称 interview is a common way，获邀者由电邮通知；Personal Statement、CV、Reference Letter(s)、School Reports、考试成绩/预测成绩及课外活动为通常支持材料；未公布统一附加考试或作品集要求",
    "deadlineZh": "2026-06-30（Final Round Deadline (Non-local)，官方本科国际学历申请页面）",
    "sources": [
      "https://www.ln.edu.hk/admissions/ug/apply-now/overseas-and-mainland-applicants-holding-international-qualifications",
      "https://www.ln.edu.hk/admissions/ug/f/upload/520/2576/Admission%20Information_International%20Qualifications.pdf",
      "https://www.ln.edu.hk/admissions/ug/page/detail/271",
      "https://www.ln.edu.hk/reg/undergraduate-programmes/english-language-requirements",
      "https://www.ln.edu.hk/admissions/ug/programme"
    ],
    "evidenceZh": "校方官方招生 PDF 明确认可 British Patterned GCE Advanced Level / International Advanced Level（AL/IAL），并给出三门 AL/IAL passes 或两门 AL+两门 AS 的通用最低门槛，但未将 Cambridge International A-Level 单独命名，也未公布 A*/A 等级、七类专业分数或专业先修科目。故 Cambridge 接受判断基于官方 IAL 口径；专业预测只能标记为官方未公布。英语 6.0 为国际学历招生页示例，旧 Registry 页面为毕业要求且非本申请周期口径，不能混用。"
  },
  "unimelb": {
    "accepted": true,
    "generalZh": "null；官网未公布适用于全校所有课程的统一 A-Level 最低等级；官网明确将 GCE A Levels 列为认可的 VCE-equivalent qualification，并按课程公布 indicative entry score。一般规则为至少满足所选课程分数、先修科目及英语要求。",
    "benchmarksZh": "{\"medicine_life_science\":\"Bachelor of Biomedicine：ABB (13)；Chemistry + Mathematics + approved A/AS Level English subject。Bachelor of Oral Health：AAA (15)；Biology 或 Chemistry，且 approved A/AS Level English subject 至少 B。医学本科/MBBS：官网未公布，因为墨尔本大学医学为研究生路径，不能以本科 A-Level 口径直接替代。\",\"engineering\":\"null；官方 GCE A-Level 总表未列 Bachelor of Engineering；工程课程具体 A-Level 分数与先修科目需以课程页当前国际资格选项核对，现有官方材料未能证实具体等级，故官方未公布。\",\"computing\":\"Bachelor of Science（含计算机相关 major）：BBB (12)；Mathematics + Biology/Chemistry/Physics 之一，或 Mathematics + Further Mathematics；另需 approved A/AS Level English subject。官网未单独公布计算机专业 A-Level 分数。\",\"business_economics\":\"Bachelor of Commerce：ABB (13)；Mathematics + approved A/AS Level English subject。经济学通常可在 Bachelor of Commerce 或 Bachelor of Arts/Science 中修读，官网未另列独立 Economics A-Level 门槛。\",\"law\":\"null；墨尔本大学未提供以 A-Level 直接申请的本科 LLB/JD 入学口径；JD 属研究生课程，要求先有本科或等效高等教育学历，故本科 A-Level benchmark 官方未公布。\",\"psychology\":\"Bachelor of Arts/Science 中的 Psychology major：分别可参考 Arts BBC (11) 或 Science BBB (12)；Arts 路径需 approved A/AS Level English，Science 路径需 Mathematics + Biology/Chemistry/Physics 之一（或 Mathematics + Further Mathematics）及 approved A/AS Level English。官网未单列 Psychology 专业 A-Level 分数。\",\"arts_humanities\":\"Bachelor of Arts：BBC (11)；approved A/AS Level English subject。Bachelor of Design：BBB (12)；approved A/AS Level English subject。Bachelor of Fine Arts、Bachelor of Music：N/A；官网说明需满足课程附加要求，通常涉及 audition/interview 等 supplementary tasks。\"}",
    "prerequisitesZh": "Biomedicine: Chemistry + Mathematics + approved A/AS Level English subject; Oral Health: Biology or Chemistry + approved A/AS Level English subject with at least B; Commerce: Mathematics + approved A/AS Level English subject; Science/computing: Mathematics + one of Biology/Chemistry/Physics, or Mathematics + Further Mathematics, plus approved A/AS Level English subject; Arts/Design/Fine Arts/Music: approved A/AS Level English subject; prerequisite subjects generally require at least C unless the course table specifies otherwise.",
    "englishZh": "GCE A Levels：以下任一科目至少 C：AS/A Level General Paper、General Studies、English Language、English Literature、English Language and Literature。英国完成 GCSE 与 A Levels 者，也可用 GCSE English 至少 B；非英语背景者亦可用 IELTS Academic 6.5（各单项至少 6.0）、TOEFL iBT 81（写作/口语各19，阅读/听力各16）等获认可考试。英语授课背景可按官网 citizenship/residency 与 English-medium education 规则豁免；Sri Lankan A Levels 必须用认可英语测试，不能仅凭 A-Level 英语科目豁免。",
    "extrasZh": "大多数本科课程：官网未公布额外考试或面试；Fine Arts/Music：需 course-specific supplementary tasks，官网申请页明确包括 audition 或 interview，且截止时间早于一般 VTAC 截止；所有课程仍须满足课程先修科目和英语要求；满足最低/保证分数不保证竞争性录取（除达到适用 guaranteed entry score 且满足其他条件）。",
    "deadlineZh": "国际学生直接申请：Mid-year intake 2026（Semester 2/July）截止 2026-05-31；Start year intake 2027（Semester 1/February/March）截止 2026-11-30；Mid-year intake 2027（Semester 2/July）截止 2027-05-31。Fine Arts/Music 等需 supplementary tasks 的课程可能早于一般截止日期。",
    "sources": [
      "https://study.unimelb.edu.au/how-to-apply/undergraduate-study/recognised-vce-equivalent-qualifications/qualifications/general-international-qualifications-gce-a-levels",
      "https://study.unimelb.edu.au/how-to-apply/undergraduate-study/recognised-vce-equivalent-qualifications",
      "https://study.unimelb.edu.au/how-to-apply/undergraduate-study/international-applications/entry-requirements",
      "https://study.unimelb.edu.au/how-to-apply/english-language-requirements/undergraduate-english-language-requirements",
      "https://study.unimelb.edu.au/how-to-apply/undergraduate-study/international-applications/applications",
      "https://study.unimelb.edu.au/find/courses/undergraduate/bachelor-of-biomedicine/entry-requirements/",
      "https://study.unimelb.edu.au/find/courses/undergraduate/bachelor-of-science/entry-requirements/",
      "https://study.unimelb.edu.au/find/courses/undergraduate/bachelor-of-arts/entry-requirements/"
    ],
    "evidenceZh": "官网明确接受 GCE A Levels，并给出一般国际资格课程表；页面特别提醒 Singapore/Cambridge A Levels 应查独立资格表，因此本结果未把新加坡 H2/H1 或 ATAR 数字当作 Cambridge International A-Level。分数是 indicative entry score，不是全校统一最低线；工程、法律、心理学等未单列者以 null 或所属本科课程替代，不能据此虚构专业门槛。截止日期按官网当前公布的 2026/2027 国际本科申请页面；课程页面和年度政策可能更新。"
  },
  "usyd": {
    "accepted": true,
    "generalZh": "GCE 3/4 A Levels；官方认可 GCE-comparable Advanced Level qualifications，录取按最多四门 Advanced Level 科目成绩评估；不存在适用于全校所有课程的单一最低 A-Level 等级，课程门槛另列。2027 官方国际招生指南以课程为单位列示 GCE 3/4 A Levels 等值分数。",
    "benchmarksZh": "{\"medicine_life_science\":\"代表性课程：Bachelor of Arts and Doctor of Medicine（medicine double degree）；GCE 3/4 A Levels 20/21（官方表中为 20，第二列 1/21 的排版对应课程资格计分；该项目列有额外 admission criteria，且竞争性极高）。Bachelor of Biomedicine and Health：GCE 3/4 A Levels 约 15/16；具体医学/健康课程须以课程页为准，官方未在该资格页统一公布 A-Level 科目先修。\",\"engineering\":\"Bachelor of Engineering Honours（多数专业方向）：GCE 3/4 A Levels 14/14；课程有 Mathematics prerequisite，且部分方向要求/建议 Chemistry and/or Physics（官方招生指南说明先修/assumed knowledge须查具体课程页）。\",\"computing\":\"Bachelor of Advanced Computing：GCE 3/4 A Levels 15/16；官方课程页列 Mathematics prerequisite（相当于 NSW Mathematics Advanced/Extension 体系的要求），Cambridge A-Level 对应具体等级未在课程页单独展开。\",\"business_economics\":\"Bachelor of Commerce：GCE 3/4 A Levels 17/19；Bachelor of Economics：14/14；官方课程表未列统一 A-Level 科目先修，具体课程可能有 Mathematics assumed knowledge/prerequisite。\",\"law\":\"Bachelor of Arts and Bachelor of Laws：GCE 3/4 A Levels 16/18；Bachelor of Commerce and Bachelor of Laws：17/19；官方未公布 Cambridge A-Level 法律科目要求，双学位仍须满足相应本科课程标准。\",\"psychology\":\"Bachelor of Psychology：GCE 3/4 A Levels 13/13；官方课程表未列 Cambridge A-Level Psychology 为必修或优先科目，具体课程页要求优先。\",\"arts_humanities\":\"Bachelor of Arts：GCE 3/4 A Levels 12/12；Bachelor of International Studies/Languages：14/14；官方课程表未列统一 A-Level 科目先修。\"}",
    "prerequisitesZh": "Engineering: Mathematics prerequisite；部分工程方向 Chemistry and/or Physics assumed knowledge/先修，须查具体课程页；Advanced Computing: Mathematics prerequisite；Commerce/Economics: 官方未公布 Cambridge A-Level 必修科目；Law: 官方未公布；Psychology: 官方未公布 Psychology 必修/优先；Arts/Humanities: 官方未公布",
    "englishZh": "本科标准 IELTS Academic overall 6.5，单项不低于 6.0；部分课程更高（例如 Commerce、Law 7.0 overall/6.0 each，Arts 6.5/6.0，Arts and Laws 7.5 overall/7.0 each，Bachelor of Arts and Doctor of Medicine 7.0/7.0）。Cambridge GCE Advanced Levels 若为认可的、全程英语授课的中学资格，可作为英语能力证明，通常须在入学前五年内完成；否则按课程要求提交 IELTS/TOEFL iBT/PTE/Cambridge English 等合格证明。",
    "extrasZh": "国际申请人须满足 Australian Government Genuine Student (GS) requirement，学校可能要求额外 GS assessment；医学双学位标注 additional admission criteria，且需查具体课程/医学国际招生指南；普通 Arts、Commerce、Engineering、Computing、Law、Psychology 课程未见统一额外考试、作品集或面试要求；个别课程的 portfolio/audition/interview 以课程页为准",
    "deadlineZh": "官方未公布统一截止日期；官方仅要求在 University deadline 前提交，且日期依课程和入学学期而异",
    "sources": [
      "https://www.sydney.edu.au/study/applying/how-to-apply/undergraduate/recognised-qualifications.html",
      "https://www.sydney.edu.au/dam/corporate/documents/study/how-to-apply/international-admission-guide.pdf",
      "https://www.sydney.edu.au/study/applying/how-to-apply/international-students.html",
      "https://www.sydney.edu.au/study/applying/how-to-apply/international-students/english-language-requirements.html",
      "https://www.sydney.edu.au/courses/courses/uc/bachelor-of-advanced-computing.html",
      "https://www.sydney.edu.au/medicine-health/study-medicine-and-health/study-areas/medicine-and-surgery/how-to-become-a-doctor.html"
    ],
    "evidenceZh": "悉尼大学官方明确认可 GCE A Levels，并说明最多计四门 Advanced Level；2027 国际招生指南中的 GCE 3/4 A Levels 数值是课程级、指示性 ATAR 等值，不是全校统一最低线，且可能随评估表变化。表格“14/14”等为官方两种计数口径/资格组合，未擅自转换为 A*AA 等英国等级。医学、工程数学及部分课程先修须以对应课程页核对；申请截止日期官方未给统一日期。"
  },
  "anu": {
    "accepted": true,
    "generalZh": "Program Required Entrance Rank 80起；GCE A Levels按 best 3 subjects 13 或 best 4 subjects 14（A*=6, A=5, B=4, C=3, D=2, E=1）计算；这是一览表中的最低 indicative rank，实际须满足具体课程要求且录取具竞争性，并非全校统一保证线。",
    "benchmarksZh": "{\"medicine_life_science\":\"医学/生命科学：官方未公布独立的 Cambridge A-Level 等级门槛；须达到所申课程的 program-specific rank，具体先修科目以 Programs and Courses 对应课程页为准，当前官方来源未能核实统一 A-Level 科目组合。\",\"engineering\":\"工程：官方未公布独立的 Cambridge A-Level 等级门槛；课程级先修/假定知识需查具体工程项目，统一 Cambridge 表仅提供入口 rank 换算。\",\"computing\":\"计算机：官方未公布独立的 Cambridge A-Level 等级门槛；Bachelor of Computing 课程页提示选课须具 required/assumed knowledge，但未在已核实页面给出统一 A-Level 科目组合。\",\"business_economics\":\"商科经济：官方未公布独立的 Cambridge A-Level 等级门槛；Bachelor of Commerce 官方课程页列有 assumed knowledge，但未核实为 Cambridge A-Level 的强制科目。\",\"law\":\"法律：官方未公布独立的 Cambridge A-Level 等级门槛或统一 A-Level 先修科目；适用具体项目 indicative rank 和项目附加要求。\",\"psychology\":\"心理学：官方未公布独立的 Cambridge A-Level 等级门槛；Bachelor of Science (Psychology) 页面写明 no formal program prerequisites，存在 assumed knowledge（澳洲课程表述），未公布 Cambridge A-Level 对应科目。\",\"arts_humanities\":\"文社人文：官方未公布独立的 Cambridge A-Level 等级门槛或统一先修科目；适用具体项目 indicative rank。\"}",
    "prerequisitesZh": "Medicine/life science: 官方未公布统一 Cambridge A-Level 强制科目；Engineering: 官方未公布统一 Cambridge A-Level 强制科目；Computing: 官方未公布统一 Cambridge A-Level 强制科目（课程页仅称 required/assumed knowledge）；Business/economics: 官方未公布统一 Cambridge A-Level 强制科目（Commerce 页有 assumed knowledge）；Law: 官方未公布；Psychology: no formal program prerequisites，Cambridge 对应科目官方未公布；Arts/humanities: 官方未公布",
    "englishZh": "本科英语要求可通过 prior secondary/tertiary education in English、认可英语考试或特定英语国家公民及教育满足。Cambridge C1 Advanced：2027-01-01前入学 Overall 176，Reading/Writing/Listening/Speaking/Use of English 各169；2027-01-01起 Overall 169，Reading 163、Writing 170、Listening 163、Speaking 179。英语政策称 no waivers；具体项目可能另有更高要求。",
    "extrasZh": "所有申请人须满足 program-specific academic/non-academic requirements；部分项目可能要求 prerequisites、portfolio 或其他 additional selection criteria，具体项目要求可能不同；官方未公布针对 Cambridge A-Level 的统一附加考试或面试。",
    "deadlineZh": "Semester 2 2026：2026-06-14（国际直接申请总截止；附加选拔项目可能不同）；Semester 1 2027：2026-12-15；Semester 2 2027：2027-05-15。Offer acceptance deadlines另为Semester 1：海外2027-01-15、澳洲境内2027-01-31；Semester 2：海外6月30日、澳洲境内7月10日。",
    "sources": [
      "https://study.anu.edu.au/apply/international-applications/indicative-entry-requirement/gce-levels",
      "https://study.anu.edu.au/apply/international-applications/assessment",
      "https://study.anu.edu.au/apply/english-language-requirements",
      "https://policies.anu.edu.au/ppl/document/ANUP_000408",
      "https://study.anu.edu.au/apply/international-applications",
      "https://programsandcourses.anu.edu.au/program/bcomp",
      "https://programsandcourses.anu.edu.au/program/bcomm",
      "https://programsandcourses.anu.edu.au/program/bspsy-bppe"
    ],
    "evidenceZh": "ANU 官方明确列出 GCE A Levels，并按最佳3/4门 A Level 换算 entrance rank；页面没有把 Cambridge International A-Level 单独命名，但其 GCE A Levels 页面及等级换算构成明确接受口径。最低表格值为 rank 80，不应误作所有专业保证线。课程页面多以澳洲 ATAR/assumed knowledge 表述，无法证实时一律标为官方未公布，未将新加坡 H2/H1 纳入。英语分数按 2027 起政策变化分别保留。"
  },
  "unsw": {
    "accepted": true,
    "generalZh": "null；官方未公布全校统一 Cambridge International A-Level 最低等级。UNSW 官方将 GCE A-Levels 列为本科可接受的高中资格，并按具体课程的国际直接入学分数评估；2027 官方表按 GCE AL 或 NCUK 列示课程分数。",
    "benchmarksZh": "{\"medicine_life_science\":\"Bachelor of Medical Studies/Doctor of Medicine：GCE AL 17（2027国际本科表；按官方表的 GCE AL 栏，实际录取还需学术排名相当于 ATAR 96.00+）；Bachelor of Medical Science：GCE AL 11；医学国际申请另需 UCAT ANZ percentile 50+ 或 ISAT 165+，并可能面试。未见官方 Cambridge A-Level 专门科目组合要求。\",\"engineering\":\"Bachelor of Engineering (Honours)：GCE AL 13（2027表）；2026课程页显示 A levels 13.0。官方 Assumed knowledge：Mathematics Extension 1、Physics；这是先修/假定知识，不应改写成 A-Level 最低等级。\",\"computing\":\"Bachelor of Science (Computer Science)：2026课程页 A levels 15.0；2027表 B Science (Computer Science) GCE AL 12。官方课程页说明按最佳3或4个 A2 科目计分，A*=6、A=5、B=4、C=3、D=2、E=1；未在已核验页面确认额外 A-Level 科目硬性要求。\",\"business_economics\":\"Bachelor of Commerce：2026课程页 A levels 17.0；2027表 GCE AL 15；Bachelor of Economics：2027表 GCE AL 12。官方未在已核验页面公布 Cambridge A-Level 特定先修科目。\",\"law\":\"Bachelor of Combined Law：2027表 GCE AL 15；Bachelor of Criminology and Criminal Justice：GCE AL 10。官方未在已核验页面公布 Cambridge A-Level 特定先修科目；法律课程通常另受课程选择与名额影响。\",\"psychology\":\"Bachelor of Psychological Science：2026课程页 A levels 10.0；2027表 GCE AL 10，Assumed knowledge：Mathematics Advanced。Bachelor of Psychology (Honours)：2027表 GCE AL 15。\",\"arts_humanities\":\"Bachelor of Arts：2027表 GCE AL 10；Bachelor of Architectural Studies：GCE AL 12；Bachelor of Politics, Philosophy and Economics：GCE AL 12。Bachelor of Arts 官方写明无 prerequisite courses，但假定 Year 12（或同等）知识；具体设计课程可能有额外要求。\"}",
    "prerequisitesZh": "Engineering: Mathematics Extension 1 + Physics（官方 Assumed knowledge，非明确 A-Level 硬性门槛）; Psychology: Mathematics Advanced（官方 Assumed knowledge）; Medicine: 官方已核验页面未公布 Cambridge A-Level 必修 Chemistry/Biology 组合，勿据其他体系推断; Arts: Bachelor of Arts 无 prerequisite courses，假定 Year 12 equivalent 知识; Computing/Business/Economics/Law: 官方已核验页面未公布 Cambridge A-Level 特定硬性科目组合",
    "englishZh": "需满足所申请课程的英语要求，并通常提交开学前两年内的认可英语考试。IELTS Academic本科：Arts, Design & Architecture 6.5 overall、各单项6.0；Business 7.0 overall、各单项6.0；Engineering 6.5 overall、各单项6.0；Law & Justice 7.0 overall、各单项6.0（Criminology例外6.5 overall、各单项6.0）；Medicine & Health 6.5 overall、各单项6.0，但 Bachelor of Medical Studies/MD 要求7.0 overall、各单项6.0；Science 6.5 overall、各单项6.0。认可考试还包括 TOEFL iBT、PTE、C1 Advanced Cambridge、C2 Proficiency Cambridge 等；是否可按英语授课学历豁免须按官方规则和个人教育背景核验，不能仅凭 Cambridge A-Level 推定豁免。",
    "extrasZh": "普通本科：官方未在通用 A-Level 口径中公布统一附加考试/面试；医学：UCAT ANZ percentile 50+ 或 ISAT minimum 165；医学：如获选需在线面试，并提交 Medicine Personal Statement Form；医学不接受仅凭 predicted results 作 offer；艺术/设计类：具体课程可能另有作品集或课程特定要求，已核验范围内未确认统一 Cambridge A-Level 作品集规则",
    "deadlineZh": "2027本科国际申请：官方按 offer round 发布，已公布 Term 1 2027 completed application deadlines 为 2026-05-14、2026-07-16、2026-08-20、2026-09-24；Term 2/3及医学可能适用不同或 out-of-round 安排，官方建议尽早申请；医学页面要求在 closing date 前通过 UNSW Applicant Portal 申请，未在已核验摘录中单列一个统一医学截止日",
    "sources": [
      "https://www.unsw.edu.au/study/how-to-apply/accepted-qualifications",
      "https://www.unsw.edu.au/study/how-to-apply/international/entry-requirements",
      "https://www.unsw.edu.au/content/dam/pdfs/future-students/2027-int-ug-entry-table.pdf",
      "https://www.unsw.edu.au/study/undergraduate/bachelor-of-engineering-honours",
      "https://www.unsw.edu.au/study/undergraduate/bachelor-of-computer-science",
      "https://www.unsw.edu.au/study/undergraduate/bachelor-of-commerce",
      "https://www.unsw.edu.au/study/undergraduate/bachelor-of-psychological-science",
      "https://www.unsw.edu.au/study/undergraduate/bachelor-of-arts",
      "https://www.unsw.edu.au/medicine-health/study-with-us/undergraduate/international-applicants",
      "https://www.unsw.edu.au/study/how-to-apply/english-language-requirements",
      "https://www.unsw.edu.au/study/international-students/admissions-info",
      "https://www.unsw.edu.au/study/how-to-apply/application-deadline-dates"
    ],
    "evidenceZh": "已确认 UNSW 官方明确接受 GCE A-Levels，并公开按课程列出的 GCE AL 分数；这些是课程/年度指导分数，不是全校统一最低线，且官方注明实际要求可能变化。2027表的 GCE AL 栏与课程页年度口径可能不同，系统应标注年份并优先使用目标入学年度。医学的 17 为 GCE AL 表值，另有 ATAR等值、UCAT/ISAT和面试；未找到官方依据时不填 Chemistry/Biology 等先修科目。英语阈值按学院/课程，需逐项核验。"
  },
  "uq": {
    "accepted": true,
    "generalZh": "null；官方未公布统一的“3门 A-Level 最低等级”门槛。UQ 官方 GCE 信息表明确按 GCE A/AS Level 计算 selection rank：A*=6、A=5、B=4、C=3、D=2、E=1；本科录取须同时满足 eligibility（先修科目等）与 merit（足够高的 selection rank），各课程 threshold 随年度竞争变化。GCE A Level 先修科目最低通过等级为 D 或以上。",
    "benchmarksZh": "{\"medicine_life_science\":\"Bachelor of Medical Science/Doctor of Medicine：adjusted ATAR 95（或 equivalent）；General English 与 Mathematical Methods 各 Units 3 & 4, C 的等效要求；Chemistry and/or Biology recommended but not required。统一 Cambridge A-Level 等级门槛：官方未公布。\",\"engineering\":\"Bachelor of Engineering (Honours)：entry score threshold 84 ATAR / Rank（官方页面同时列 IB 32）；General English、Mathematical Methods，以及 Chemistry 或 Physics，各 Units 3 & 4, C 的等效先修要求；Specialist Mathematics 及 Chemistry+Physics recommended。Cambridge A-Level 课程级等级：官方未公布。\",\"computing\":\"以 Bachelor of Computer Science 为代表：General English 与 Mathematical Methods 或 Specialist Mathematics 的等效先修要求；具体国际 Cambridge A-Level 等级及当前课程 entry score：官方未公布（应以课程页选择 international qualification 后核定）。\",\"business_economics\":\"以 Bachelor of Business Management/Commerce/Economics 为代表：课程先修通常至少 General English 等效科目；具体 Cambridge A-Level 等级、课程 threshold 与额外科目：官方未公布。\",\"law\":\"Bachelor of Laws (Honours)：General English subject (Units 3 & 4, C) 或等效先修；具体国际 Cambridge A-Level 等级及课程 threshold：官方未公布。\",\"psychology\":\"Bachelor of Psychological Science (Honours)：官方页面显示 89 ATAR / Rank、IB 34.75；具体 Cambridge A-Level 等级及等效换算：官方未公布。\",\"arts_humanities\":\"以 Bachelor of Arts 为代表：General English subject (Units 3 & 4, C) 或等效先修；具体 Cambridge A-Level 等级及课程 threshold：官方未公布。\"}",
    "prerequisitesZh": "Medicine/MD direct entry: General English + Mathematical Methods equivalent; Chemistry and/or Biology recommended, not required; Engineering: General English + Mathematical Methods + one of Chemistry or Physics (C equivalent), Specialist Mathematics and both Chemistry and Physics recommended; Computing: General English + Mathematical Methods or Specialist Mathematics equivalent; Law: General English equivalent; Psychology/Arts/Humanities/Business/Economics: specific Cambridge A-Level prerequisite grade/subject combination officially not published; UQ GCE table confirms A-Level Biology, Chemistry, Physics and Mathematics can satisfy corresponding Queensland prerequisites with A-Level grade D or better.",
    "englishZh": "Most UQ programs: IELTS overall 6.5, minimum 6.0 in each sub-band, or approved equivalent. English may also be demonstrated through designated-country senior secondary schooling in English, recognised qualifications/tests, qualifying tertiary study or qualifying English-speaking work experience. Medicine/MD pathway has higher requirement: IELTS 7.0 overall and 7.0 in each band; TOEFL iBT overall 100 with L25/R25/W27/S23; PTE Academic overall and each sub-band 72; OET minimum B in each sub-skill; BE not accepted.",
    "extrasZh": "Medicine/MD direct entry: competitive UCAT ANZ score + Multiple Mini-Interview (MMI); other reviewed representative undergraduate pages: no additional test, portfolio or interview published; program-specific requirements may apply.",
    "deadlineZh": "Semester 1: 30 November of the previous year（国际本科申请窗口；具体课程可能另有截止日期）；Semester 2: 官方本科国际申请页面未能在本次抓取中稳定显示，具体课程截止日官方未公布。",
    "sources": [
      "https://study.uq.edu.au/sites/default/files/2020-11/uk-gce-info-sheet.pdf",
      "https://study.uq.edu.au/admissions/undergraduate/review-entry-requirements",
      "https://study.uq.edu.au/admissions/undergraduate/review-entry-requirements/subject-prerequisite-equivalents",
      "https://study.uq.edu.au/admissions/english-language-requirements",
      "https://study.uq.edu.au/study-options/programs/bachelor-medical-science-doctor-medicine-2578",
      "https://study.uq.edu.au/study-options/programs/bachelor-engineering-honours-2455",
      "https://study.uq.edu.au/study-options/programs/bachelor-laws-honours-2471",
      "https://study.uq.edu.au/study-options/programs/bachelor-psychological-science-honours-2379",
      "https://study.uq.edu.au/study-options/programs/bachelor-arts-2325"
    ],
    "evidenceZh": "UQ 官方 UK GCE 信息表明确覆盖 GCE A/AS Level，并给出 A-Level 等级转 selection rank 规则及先修科目等效关系，因此可确认接受 Cambridge International A-Level 体系；但该表主要说明资格评估，不提供全校统一 AAA/A*AA 门槛。UQ 录取按课程、年度竞争和 selection rank 评估，课程页的 ATAR/IB 数值不能直接当作 Cambridge A-Level 等级。医学要求最明确，且需 UCAT ANZ 与 MMI；其余类别的 Cambridge 具体等级组合须由 UQ Admissions 按课程和申请人资格核定。"
  },
  "monash": {
    "accepted": true,
    "generalZh": "null；Monash 官方一般国际本科页面未公布统一的 Cambridge International A-Level 总成绩门槛，要求按具体课程评估；医学直入另有官方门槛：GCE A Level in other countries best 3 A-Level subjects within 2 years，换算 Equivalent Year 12 需 15 分（A*=5, A=5, B=4, C=3, D=2, E=1，最多计 1 个 A* bonus）。",
    "benchmarksZh": "{\"medicine_life_science\":\"医学直入：Equivalent Year 12 15（按 best 3 A-Level subjects within 2 years 换算）；A Level Chemistry 至少 D；英语可用 A Level English General Paper 至少 D。生物医学/生命科学课程：官方课程页要求满足课程的具体 academic entry requirements，未在所核官方页面公布统一 Cambridge A-Level 等级，官方未公布。\",\"engineering\":\"Bachelor of Engineering：课程要求包含 Mathematics；官方课程页另列 Chemistry 或 Physics（部分方向可用 Biology）先修/等值要求；Cambridge A-Level 总分及各科等级未在该页明确公布，官方未公布。\",\"computing\":\"Bachelor of Computer Science：课程页设有数学 prerequisite/等值要求；Cambridge A-Level 总成绩与明确等级未在所核官方页面公布，官方未公布。\",\"business_economics\":\"Bachelor of Business：需满足课程及一般大学入学要求；未核到 Cambridge A-Level 专属最低等级或必修科目，官方未公布。\",\"law\":\"Monash 法律本科/双学位须满足具体课程入学要求；未核到 Cambridge A-Level 专属最低等级或先修科目，官方未公布。\",\"psychology\":\"心理学相关本科须满足对应课程的 academic entry requirements；未核到 Cambridge A-Level 专属最低等级或必修科目，官方未公布。\",\"arts_humanities\":\"Arts/人文相关本科须满足对应课程的 academic entry requirements；未核到 Cambridge A-Level 专属最低等级或必修科目，官方未公布。\"}",
    "prerequisitesZh": "Medicine: A Level Chemistry minimum D; English General Paper minimum D may satisfy the listed English route; Engineering: Mathematics plus course-listed Chemistry or Physics (some pathways list Biology); Computing: Mathematics prerequisite/equivalent; Business/Economics: official Cambridge-specific prerequisite not published; Law: official Cambridge-specific prerequisite not published; Psychology: official Cambridge-specific prerequisite not published; Arts/Humanities: official Cambridge-specific prerequisite not published",
    "englishZh": "一般国际本科：英语要求依教育背景，部分课程有更高要求；英语授课国家19岁前完成六年英语媒介学校教育可按官方规则满足要求，否则须认可英语测试或合资格学习经历。医学直入明确接受：IELTS overall 7.0，单项不低于6.5；TOEFL iBT 94（Reading 19, Listening 20, Speaking 20, Writing 24）；PTE Academic 65，单项不低于58。医学的 GCE A Level English General Paper route 为 D in A Level English General Paper。",
    "extrasZh": "一般本科：部分课程可能要求 folio、personal statement 或 interview，须逐课核验；医学直入：所有国际申请人必须参加 ISAT，最低总分170且 Critical Reasoning、Quantitative Reasoning 各至少165；医学采用 Multi Mini Interview (MMI)，仅参加面试者进入最终排名",
    "deadlineZh": "一般国际本科：官方写明 international students can apply anytime throughout the year；医学直入：须在相关 course application closing date 前完成 ISAT，具体截止日期见医学 Applications and fees 页面，当前所核页面未给出一个可泛化至所有课程的统一日期",
    "sources": [
      "https://www.monash.edu/admissions/entry-requirements/minimum/hidden-content/overseas-qualification",
      "https://www.monash.edu/admissions/apply/international-ug",
      "https://www.monash.edu/admissions/entry-requirements/english-language",
      "https://www.monash.edu/study/courses/find-a-course/engineering-e3001",
      "https://www.monash.edu/study/courses/find-a-course/computer-science-c2001",
      "https://www.monash.edu/study/courses/find-a-course/business-b2000",
      "https://www.monash.edu/study/courses/find-a-course/biomedical-science-m2003",
      "https://www.monash.edu/medicine/medical-school/direct-entry/international/entry-requirements",
      "https://www.monash.edu/medicine/medical-school/direct-entry/international/applications-fees",
      "https://www.monash.edu/__data/assets/pdf_file/0005/749327/why-monash-flyer-usa.pdf"
    ],
    "evidenceZh": "Monash 官方一般海外学历页只写 final-year secondary school or equivalent，未给统一 A-Level 等级；国际本科申请页明确要求按具体课程核验且全年可申请。医学国际页明确列出“GCE A Level in other countries”、best 3 A-Level 换算 15、Chemistry D、ISAT 与 MMI。官方材料将 Cambridge 作为可颁发 A Levels 的考试机构，但医学页使用的是“GCE A Level in other countries”概括表述；因此除医学和课程页明确先修外，其余类别不推断未公布的等级。"
  },
  "uwa": {
    "accepted": true,
    "generalZh": "null；UWA 官方国际及海外学历页面列出 GCE/Cambridge A-level 作为可申请的国际学历路径，但当前公开页面未给出适用于所有本科课程的统一 A-level 原始等级门槛；课程级要求按课程和学历背景核定。",
    "benchmarksZh": "{\"medicine_life_science\":\"Medicine（本科医学相关路径）：官方以 ATAR 或 equivalent 表述；当前所查国际本科公开页面未公布 Cambridge A-level 对应等级，故为 null。Doctor of Medicine 为 postgraduate，不能直接视为 A-level 本科门槛；国际申请人的具体学术、考试及申请轮次要求需按 MD 课程页核验。生命科学/Science：Bachelor of Science 页面显示 minimum ATAR 80，国际 Cambridge A-level 等级未公布。\",\"engineering\":\"Bachelor of Engineering (Honours)：minimum ATAR 80；先修为 Mathematics Methods ATAR scaled score 至少 50，另须 Chemistry ATAR、Physics ATAR 或 Mathematics Specialist ATAR 三者之一 scaled score 至少 50。UWA 未在该课程页公开 Cambridge A-level 对应等级。\",\"computing\":\"Computer Science：课程页将具体 admission criteria/prerequisites 指向 UWA entry requirements 或 Handbook；公开页面未给出独立 A-level 等级。页面明确 English competency 为 IELTS overall 6.5、各单项不低于 6.0；计算机方向的 Cambridge 数学对应门槛未在所查官方页面明确公布。\",\"business_economics\":\"Business/Economics：所查 UWA 官方公开课程页面未核实到 Cambridge A-level 的独立等级基准；统一国际学历页面未提供全校通用 A-level 原始等级，故为 null；具体课程/专业先修须查对应 Handbook。\",\"law\":\"Law：所查官方课程资料未核实到 Cambridge A-level 独立等级基准或统一法律本科 A-level 门槛；需按具体 Law/assured pathway 课程规则核定，故为 null。\",\"psychology\":\"Bachelor of Psychology：minimum ATAR 80；要求达到大学 minimum entry score、English language competence，并满足所选 major prerequisites；官方未公布 Cambridge A-level 对应等级或心理学特定 A-level 科目。\",\"arts_humanities\":\"Bachelor of Arts：官方课程页要求达到 University’s minimum entry score、English language competence，并满足适用先修；所查页面未公开 Cambridge A-level 等级换算，故为 null。\"}",
    "prerequisitesZh": "Engineering: Mathematics Methods（必需）+ Chemistry/Physics/Mathematics Specialist 至少一门；Bachelor of Psychology: 官方要求满足所选 major prerequisites，但未指定 Cambridge A-level 科目；Computer Science: 官方所查页面未公布 A-level 先修科目；Medicine/Life Science/Business-Economics/Law/Arts-Humanities: 官方 Cambridge A-level 具体科目要求未公布。",
    "englishZh": "UWA minimum English language competence；Computer Science 官方课程页公布 IELTS overall 6.5，no band less than 6.0。英语要求可通过 UWA 列明的其他测试/学历途径满足；部分课程可能有 higher standard 或 accreditation ELC requirements。Cambridge A-level English 科目豁免规则在所查公开页面未能明确核实，故不推定豁免。",
    "extrasZh": "一般本科：所查官方课程页未公布统一考试、作品集或面试要求；Medicine/医学相关竞争性路径：官方页面显示可能要求 UCAT/ISAT（按具体路径）及 interview，不能套用于普通 Science；Engineering/Computer Science/Psychology/Arts：未见统一额外考试或作品集要求。",
    "deadlineZh": "国际本科申请：UWA 官方 International applicants 页面仅说明可提前最多两年申请，具体截止日期按 intake、国籍/所在地及课程而定；所查页面动态内容未能稳定显示通用截止日期，故官方未公布统一日期。医学等特殊课程有独立申请轮次，须按课程页当年时间表。",
    "sources": [
      "https://www.uwa.edu.au/study/how-to-apply/pathways-and-eligibility/international-and-overseas-qualifications",
      "https://www.uwa.edu.au/study/how-to-apply/pathways-and-eligibility/english-language-requirements",
      "https://www.uwa.edu.au/study/how-to-apply/international-applicants",
      "https://www.uwa.edu.au/study/courses/bachelor-of-engineering-honours",
      "https://www.uwa.edu.au/study/courses/computer-science",
      "https://www.uwa.edu.au/study/courses/bachelor-of-science",
      "https://www.uwa.edu.au/study/courses/bachelor-of-psychology",
      "https://www.uwa.edu.au/study/courses/doctor-of-MEDICINE"
    ],
    "evidenceZh": "已限定使用 UWA 官方页面。UWA 明确将国际/海外学历作为申请资格路径，官方课程页多以 ATAR/equivalent 和澳洲 ATAR 科目表述，未稳定公开 Cambridge International A-level 的全校统一等级换算，因此所有无法直接证实的 A-level 数字均保留为 null/官方未公布。工程的 ATAR 先修要求可确认，但不能擅自转换为 A-level 等级。医学 postgraduate MD 与本科医学路径需分开处理；申请截止日期受 intake、国籍和课程影响，不能填一个未经证实的通用日期。"
  },
  "adelaide": {
    "accepted": false,
    "generalZh": "官方课程页将国际招生资格列为 “GCE A Levels”并按国家/资格给出分数：代表性课程为 8 或 9；未找到全校统一的 Cambridge International A-Level 等级门槛，官方未公布。",
    "benchmarksZh": "{\"medicine_life_science\":\"Bachelor of Medical Studies：官方课程页提供国际招生与资格要求入口，但本次可核验页面未公开 Cambridge International A-Level 的具体等级；官方未公布。代表性先修科目及医学筛选要求需按课程招生标准核对。\",\"engineering\":\"Bachelor of Engineering (Chemical) (Honours)：国际招生表显示 GCE A Levels 9；课程先修科目具体组合在当前官方页面未能核验，官方未公布。\",\"computing\":\"Bachelor of Computer Science：GCE A Levels 9；数学等先修科目在当前官方页面未能核验，官方未公布。\",\"business_economics\":\"Bachelor of Business：GCE A Levels 8；未核验到额外 A-Level 科目要求，官方未公布。\",\"law\":\"法学代表性课程：未核验到可直接引用的 Cambridge/GCE A-Level 等级或科目门槛，官方未公布。\",\"psychology\":\"心理学代表性课程：未核验到可直接引用的 Cambridge/GCE A-Level 等级或科目门槛，官方未公布。\",\"arts_humanities\":\"Bachelor of Arts：GCE A Levels 8；未核验到额外 A-Level 科目要求，官方未公布。\"}",
    "prerequisitesZh": "Medicine/生命科学：官方未公布可确认的 Cambridge International A-Level 科目组合；Engineering：官方未公布可确认的 A-Level 科目组合；Computing：官方未公布可确认的 A-Level 科目组合；Business/Economics、Law、Psychology、Arts/Humanities：官方未公布额外 A-Level 科目要求",
    "englishZh": "一般本科通常 IELTS Academic overall 6.5，单项不低于 6.0；英语要求按具体课程而定，部分课程更高。英语豁免/替代资格须按官方 English language proficiency 页面及课程页核验。",
    "extrasZh": "Medicine, dentistry and oral health applicants：需参加 University Clinical Aptitude Test (UCAT)，符合条件者参加 interview；其他所查代表性课程未公布统一额外考试、作品集或面试要求；另须满足 Genuine Student requirement（国际学生通用要求）",
    "deadlineZh": "一般课程：按具体 degree page 的 key dates，通常为开学前申请窗口；官方未公布统一全校截止日期。Bachelor of Medical Studies 2026：国际申请系统 2026-03-03 开放，课程页列有竞争性项目的提前截止安排，但当前官方可见摘录未完整显示截止日，故官方未公布具体 YYYY-MM-DD。",
    "sources": [
      "https://adelaide.edu.au/study/international-students/how-to-apply/entry-requirements/",
      "https://adelaide.edu.au/study/international-students/how-to-apply/entry-requirements/english-language-proficiency/",
      "https://adelaide.edu.au/study/degrees/bachelor-of-medical-studies/",
      "https://adelaide.edu.au/study/degrees/bachelor-of-engineering-chemical-honours/",
      "https://adelaide.edu.au/study/degrees/bachelor-of-computer-science/",
      "https://adelaide.edu.au/study/degrees/bachelor-of-business/",
      "https://adelaide.edu.au/study/degrees/bachelor-of-arts/",
      "https://adelaide.edu.au/content/dam/adelaideuniversity/documents/about/pdfs/adelaide-university-2027-international-student-guide-condensed.pdf"
    ],
    "evidenceZh": "官网课程页确实使用 “GCE A Levels” 作为国际招生资格并列出 8/9，但本次核验未发现明确写出 “Cambridge International A-Level” 的专门表述，因此 accepts_cambridge_alevel 按字段定义填 false，避免把一般 GCE A Levels 推断为 Cambridge 专门口径。医学页面官方指南明确要求 UCAT，符合条件者面试。课程页等级可能随年份、课程和招生竞争变化；未能直接核验的专业数字与科目均标为官方未公布。"
  },
  "oxford": {
    "accepted": true,
    "generalZh": "null；牛津官方未公布统一全校 A-level 最低成绩，要求按课程分别满足标准录取门槛。官方明确：Cambridge Assessment International Education、Pearson Edexcel 和 OxfordAQA International A-level 按等级逐级等同于 UK GCE A-level；但 Cambridge 的 Global Perspectives and Research、Thinking Skills A-level 不接受。",
    "benchmarksZh": "{\"medicine_life_science\":\"Medicine: A*AA（excluding Critical Thinking and Thinking Skills）；Chemistry + Maths/Further Maths/Biology/Physics。Biology: A*AA（A* in a science or Maths）；Biology + Chemistry/Physics/Maths。Biomedical Sciences: A*AA（excluding Critical Thinking and Thinking Skills）；两门选自 Biology、Chemistry、Maths、Physics；ESAT。\",\"engineering\":\"Engineering Science: A*A*A（A*s in Maths、Further Maths or Physics）；必修 Maths + Physics，推荐 Further Maths；ESAT。Materials Science: A*AA（A* in Maths、Physics or Chemistry）；Maths + Physics。\",\"computing\":\"Computer Science: A*AA including A*A in Maths and Further Maths if available（in any order）；TMUA。Computer Science and Philosophy 同要求。\",\"business_economics\":\"Economics and Management: A*AA（Maths at A or A*）；Maths；TARA。\",\"law\":\"Law (Jurisprudence): AAA；推荐 essay-writing subject；LNAT。Law with Law Studies in Europe: AAA；现代语言为必需（European Law 除外）；LNAT。\",\"psychology\":\"Psychology (Experimental): A*AA；推荐一门或多门 science（包括 Psychology）或 Maths；TARA。\",\"arts_humanities\":\"English Language and Literature: AAA；English Literature 或 English Language and Literature；一篇 written work。History: AAA；推荐 History；一篇 written work。Fine Art: AAA（或完成 Art Foundation 的 post-A-level applicants 为 AAB）；digital portfolio。PPE: AAA；推荐 Maths，History 相关；TARA。\"}",
    "prerequisitesZh": "Medicine: Chemistry + one of Maths/Further Maths/Biology/Physics; Biology: Biology + one of Chemistry/Physics/Maths; Biomedical Sciences: two of Biology/Chemistry/Maths/Physics; Engineering Science: Mathematics + Physics, Further Mathematics recommended; Computer Science: Mathematics + Further Mathematics if available; Economics and Management: Mathematics at A or A*; Law: essay-writing subject recommended; Psychology: one or more science subjects (including Psychology) or Mathematics recommended; English Language and Literature: English Literature or English Language and Literature; Fine Art: Art recommended",
    "englishZh": "所有本科课程采用 higher level English；IELTS Academic 7.5（各单项至少 7.0）；TOEFL iBT 110（Listening 22、Reading 24、Speaking 25、Writing 24；2026-01-21 起新 TOEFL 暂不接受，官方复核中）；C1 Advanced 191（各单项至少 185）；C2 Proficiency 191（各单项至少 185）；Oxford Test of English Advanced 165（各单项至少 155）；PTE Academic 76（听说读写各至少 66）。英语为母语且一直居住于 UKVI 认可多数英语国家者可豁免；全日制英语教育最近至少两年且申请前持续、合计最近教育至少三年者可申请豁免。英语证明通常须在录取当年 7 月 31 日前提交。",
    "extrasZh": "课程相关 admissions test：Medicine—UCAT；Engineering/Physics/Materials/Biomedical Sciences—ESAT；Computer Science—TMUA；Economics and Management/PPE/Psychology/Human Sciences—TARA；Law—LNAT；部分人文学科需 1–3 篇 written work；Fine Art—digital portfolio；Music—performance piece；Oxford 对所有 shortlisted applicants 于 12 月安排线上面试。",
    "deadlineZh": "每年 10 月 15 日 18:00（英国时间，UCAS；具体年份官方申请时间表另行公布）",
    "sources": [
      "https://www.ox.ac.uk/admissions/undergraduate/courses/admissions-requirements/international-qualifications",
      "https://www.ox.ac.uk/admissions/undergraduate/courses/admissions-requirements/summary-table-of-admissions-requirements",
      "https://www.ox.ac.uk/admissions/undergraduate/applying/for-international-students/english-language-requirements-visas",
      "https://www.ox.ac.uk/admissions/undergraduate/applying/for-international-students"
    ],
    "evidenceZh": "牛津官方明确接受 Cambridge International A-level，并按等级逐级等同 UK GCE A-level；Global Perspectives and Research、Thinking Skills 不接受。牛津没有统一全校最低 A-level 分数，必须以具体课程标准为准。七类为代表性课程映射，不代表该学科所有联合学位；考试、written work、作品集和面试均依课程及入围情况而定。截止日期为官方国际学生页面列出的 UCAS 通用牛津截止时间。"
  },
  "cambridge": {
    "accepted": true,
    "generalZh": "null；官方未公布统一全校最低 A-Level 门槛，要求按课程及 Cambridge College 设定；官方说明通常以 Year 13 同时修读的 3 门 A levels 为 offer 基础，且期待最高等级。",
    "benchmarksZh": "{\"medicine_life_science\":\"Medicine: A*A*A；通常要求 Chemistry + 至少一门 Biology、Physics 或 Mathematics（具体 offer/学院可能增加要求）。Natural Sciences（生命科学代表）：A*A*A；需按方向准备相关科学科目，官方课程页/学院要求可能不同。\",\"engineering\":\"Engineering: A*A*A；Mathematics + Physics 必须；Further Mathematics 至 AS 或 A level（若学校提供，通常要求/强烈建议，具体依学院）。\",\"computing\":\"Computer Science: A*A*A；Mathematics 必须；若学校提供，Further Mathematics 至 AS 或 A level；学院通常要求 Mathematics 和/或 Further Mathematics 达 A*，部分学院可能对 Chemistry/Physics 设 A*/7。\",\"business_economics\":\"Economics: A*A*A；Mathematics 必须；Further Mathematics 对竞争力很重要，部分学院明确要求；剑桥未公布独立本科 Business A-Level 基准。\",\"law\":\"Law: A*AA；官方不要求特定 A-Level 科目；English、History、Languages、Economics、Mathematics 等为常见但非必需背景。\",\"psychology\":\"Psychological and Behavioural Sciences: A*A*A；至少一门 Mathematics、Biology、Chemistry、Computer Science 或 Physics；部分学院指定具体科学科目。\",\"arts_humanities\":\"History（文史代表）：A*AA；History 必须；Arts/Social Science/Humanities 通常建议从 English Literature、语言、History、Mathematics 中组合，具体课程不同。\"}",
    "prerequisitesZh": "Medicine: Chemistry + 至少 Biology/Physics/Mathematics 之一；Engineering: Mathematics + Physics，Further Mathematics 至 AS/A level（若学校提供）；Computer Science: Mathematics，Further Mathematics 若学校提供；Economics: Mathematics，部分 Colleges 要求 Further Mathematics；Law: 无指定科目；Psychological and Behavioural Sciences: Mathematics/Biology/Chemistry/Computer Science/Physics 至少一门；History: History",
    "englishZh": "非 UK Home Office 定义的 majority English-speaking country 通常需证明英语；入学通常 IELTS Academic 7.5 overall、各项通常不低于 7.0；面试阶段建议至少 IELTS 6.5 overall 且单项不低于 6.0。亦接受 C2 Proficiency 总分 200、单项不低于185，或 C1 Advanced 总分193、单项不低于185并结合其他英语能力证据；学院可按申请背景设条件。",
    "extrasZh": "面试：入围者通常参加 College academic interview；Medicine: UCAT；Engineering: ESAT；Computer Science: TMUA（申请 Peterhouse 或 Trinity 另需 CSAT）；Economics: TMUA；Law: LNAT；Psychological and Behavioural Sciences: 部分 Colleges 设 College assessment，通常无需预注册；History: 部分 Colleges 设 College assessment，且除 Sidney Sussex 外通常需提交 2 件 written work；部分课程/学院可能有额外书面作品或更高 offer。",
    "deadlineZh": "2026-10-15（18:00 UK time，2027 entry/2028 deferred 的 UCAS 截止）；2026-10-22（18:00 UK time，My Cambridge Application 及多数国际申请者 transcript 截止）；专业考试另有注册/考试日期。",
    "sources": [
      "https://www.undergraduate.study.cam.ac.uk/apply/before/accepted-qualifications",
      "https://www.undergraduate.study.cam.ac.uk/international-students/international-entry-requirements",
      "https://www.undergraduate.study.cam.ac.uk/apply/before/entry-requirements",
      "https://www.undergraduate.study.cam.ac.uk/apply/before/choosing-high-school-subjects",
      "https://www.undergraduate.study.cam.ac.uk/courses/medicine-mb-bchir",
      "https://www.undergraduate.study.cam.ac.uk/courses/engineering-ba-hons-meng",
      "https://www.undergraduate.study.cam.ac.uk/courses/computer-science-ba-hons-meng",
      "https://www.undergraduate.study.cam.ac.uk/courses/economics-ba-hons",
      "https://www.undergraduate.study.cam.ac.uk/courses/law-ba-hons",
      "https://www.undergraduate.study.cam.ac.uk/courses/psychological-behavioural-sciences-ba-hons",
      "https://www.undergraduate.study.cam.ac.uk/courses/history-ba-hons",
      "https://www.undergraduate.study.cam.ac.uk/apply/how/admission-tests",
      "https://www.undergraduate.study.cam.ac.uk/apply/application-dates-deadlines"
    ],
    "evidenceZh": "仅依据剑桥大学本科招生官网及官方课程页，口径为 2027 entry（或 2028 deferred），页面注明 2026 年更新。剑桥明确接受 Cambridge International、Oxford AQA 和 Pearson Edexcel International A levels，并视其可比于 UK A/AS levels。成绩是课程最低 offer，不是保证录取；College 可设更高成绩、额外科目或评估。Medicine 页面具体科目/成绩在学院层面可能有差异，申请前须核对目标 College。未将新加坡 H1/H2、ATAR 等本地资格混入。"
  },
  "imperial": {
    "accepted": false,
    "generalZh": "标准 A-level offer 为 AAA 至 A*A*A；官方接受学历页未单独点名 Cambridge International A-Level，故无法确认其以该名称明确接受；具体课程要求高于通用标准时以课程页为准。",
    "benchmarksZh": "{\"medicine_life_science\":\"Medicine MBBS/BSc：A*AA including Chemistry and Biology, with A* in one of these subjects（A-levels）；Life Sciences 类课程需以具体课程页为准，官方本次核验未形成统一类别门槛。\",\"engineering\":\"代表性 Chemical Engineering MEng：A-level Mathematics and Chemistry grade A*；课程页同时列出国际学历口径，但不能将其误作 Cambridge International A-Level；一般工程课程标准依课程而异。\",\"computing\":\"Computing BEng：A*A*A or A*AAA（A-level）；要求 Mathematics grade A*，并需按课程页确认其他科目；需 TMUA。\",\"business_economics\":\"Economics, Finance and Data Science BSc：A*AA（A-levels）；A-level Mathematics grade A* and grade A in a further指定科目（课程页原文需结合完整页面确认）。Imperial Business School本科课程要求依课程而异；需 TMUA。\",\"law\":\"Imperial College London本科课程目录及官方课程页未见独立 Law undergraduate degree；官方未公布法律类 A-level benchmark。\",\"psychology\":\"Imperial College London本科课程目录及官方课程页未见独立 Psychology undergraduate degree；官方未公布心理学类 A-level benchmark。\",\"arts_humanities\":\"Imperial 以科学、工程、医学、商科等为主，官方本科课程页未见可对应的独立 Arts/Humanities 学位；官方未公布该类别 benchmark。\"}",
    "prerequisitesZh": "Medicine: Chemistry + Biology, A* in one of these; Chemical Engineering: Mathematics + Chemistry, both A*; Computing: Mathematics grade A*; Economics, Finance and Data Science: Mathematics grade A* plus a further grade A subject;其他专业先修科目须查具体 Imperial course page，官方未公布统一类别规则",
    "englishZh": "所有本科申请者均须满足所申课程的 Standard 或 Higher English requirement，即使英语为母语。AS Level/A-level English Language：Grade C（Standard 与 Higher 相同）；IELTS Academic Standard 6.5 overall、各项最低6.0，Higher 7.0 overall、各项最低6.5。可按官方豁免页申请豁免；Cambridge International A-Level 本身不能据此推定满足英语要求。",
    "extrasZh": "Medicine A100：必须 UCAT；Engineering and Science Admissions Test（ESAT）用于多数工程及部分生命科学/科学课程；Computing：TMUA；Imperial Business School：TMUA；部分课程无考试，须以课程页确认；Medicine 通常包含面试/选择流程，具体形式以官方课程页和申请流程为准；未见统一作品集要求",
    "deadlineZh": "2027 entry：MBBS Medicine/Graduate Entry Medicine 截止 2026-10-15 18:00 UK time；其他本科课程平等考虑截止 2027-01-13 18:00 UK time；申请开放 2026-09-01",
    "sources": [
      "https://www.imperial.ac.uk/study/apply/undergraduate/entry-requirements/accepted-qualifications/",
      "https://www.imperial.ac.uk/study/apply/undergraduate/entry-requirements/",
      "https://www.imperial.ac.uk/study/apply/english-language/",
      "https://www.imperial.ac.uk/study/apply/undergraduate/process/admissions-tests/",
      "https://www.imperial.ac.uk/study/apply/undergraduate/process/deadlines/",
      "https://www.imperial.ac.uk/study/courses/undergraduate/2027/medicine/",
      "https://www.imperial.ac.uk/study/courses/undergraduate/2027/computing-beng/",
      "https://www.imperial.ac.uk/study/courses/undergraduate/2027/economics-finance-data-science/",
      "https://www.imperial.ac.uk/study/courses/undergraduate/2027/chemical-engineering/"
    ],
    "evidenceZh": "Imperial 官方 accepted qualifications 页面明确列出 UK A-Levels（标准 offer AAA至A*A*A），但未明确写出 Cambridge International A-Level；因此 accepts_cambridge_alevel 按“官方明确接受”标准填 false，不将新加坡 A Level 或其他国际口径替代。七类中法律、心理学及独立文社人文学位未在本次官方本科课程范围内核实，标为官方未公布；课程要求和测试以申请年份课程页为准。"
  },
  "ucl": {
    "accepted": true,
    "generalZh": "A*A*A–ABB；UCL官方说明本科标准录取通常基于三门 A levels（包括 International A levels），课程标准 offer 范围为 A*A*A–ABB；新加坡/剑桥 A-level H2 等值页面另列最低 ABB，但该页面明确对应 Singapore/Cambridge A-levels at H2 level，不能泛化为所有 Cambridge International A-Level。",
    "benchmarksZh": "{\"medicine_life_science\":\"Medicine MBBS BSc：A*AA；Biology and Chemistry required, with either at grade A*。代表性生命科学课程的具体等级因课程而异，官方课程页另查。\",\"engineering\":\"Mechanical Engineering MEng：A*AA；Mathematics and Physics required，且 A* 必须在其中一门必修科目。\",\"computing\":\"Computer Science BSc：A*A*A；A* in either Mathematics or Further Mathematics required。2026 entry 另要求 TARA Admissions Test。\",\"business_economics\":\"Economics BSc (Econ)：A*AA；A* in Mathematics required，若提供 Economics 则须为 A。\",\"law\":\"Law LLB：A*AA；No specific subjects；至少两门 A level 应来自 UCL preferred A level subjects list。\",\"psychology\":\"Psychology BSc：A*AA；须在 Biology、Chemistry、Mathematics、Physics、Psychology 五科中两科取得 A*A。\",\"arts_humanities\":\"代表性文社人文课程：Arts and Sciences BASc 为 A*AA；具体 pathway 要求相关学科，例如 Health and Environment 要 Biology、Chemistry、Environmental Science、Geography 或 Psychology，另加一门 science/social science；Creative Arts and Humanities BA 要一门 essay-based Humanities 或 Social Sciences subject。\"}",
    "prerequisitesZh": "Medicine MBBS BSc: Biology + Chemistry，二者之一 A*；Mechanical Engineering MEng: Mathematics + Physics，A*须在其中一门；Computer Science BSc: Mathematics 或 Further Mathematics 至少一门 A*；Economics BSc (Econ): Mathematics A*，如提供 Economics 则为 A；Psychology BSc: Biology/Chemistry/Mathematics/Physics/Psychology 中两门达到 A*A；Law LLB: 无特定科目，至少两门来自 UCL preferred A level subjects；UCL通用规则: 通常三门 A levels，至少两门来自 preferred subjects list，第三门可为其他科目；General Studies、Critical Thinking、Global Perspectives and Research 不计入要求。",
    "englishZh": "非英国本土英语国家国籍申请人须提供英语能力证据，除非满足UCL豁免规则（例如英国Home Office majority English-speaking country国籍、在认可多数英语国家连续12个月教育并取得学历，或可接受的含英语中学毕业资格）。课程页按项目指定 Level 1–5；IELTS Academic：Level 1 6.5 overall且各项至少6.0；Level 2 7.0且各项至少6.5；Level 3 7.0且各项至少7.0；Level 4 7.5且各项至少7.0；Level 5 8.0且各项至少8.0。Medicine为Level 4，Computer Science为Level 1。",
    "extrasZh": "Medicine MBBS: 必须参加申请当年的 UCAT；不接受 resits；Computer Science BSc (2026 entry): 必须参加 TARA Admissions Test；其他所列代表课程：官方课程页未见统一额外考试/面试要求，个别课程须以课程页为准；申请通过 UCAS。",
    "deadlineZh": "2026 entry：Medicine 2025-10-15；大多数本科课程（包括 Computer Science 等）UCAS equal consideration deadline 2026-01-14 18:00 UK time；具体课程页面优先。2027 entry：医学等 2026-10-15；大多数本科课程 2027-01-13 18:00 UK time。",
    "sources": [
      "https://www.ucl.ac.uk/study/prospective-students/undergraduate/how-apply/entry-requirements",
      "https://www.ucl.ac.uk/prospective-students/international/singapore",
      "https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/medicine-mbbs-bsc-2026",
      "https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/computer-science-bsc-2026",
      "https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/economics-bsc-econ-2026",
      "https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/law-llb-2026",
      "https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/psychology-bsc-2026",
      "https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/mechanical-engineering-meng-2026",
      "https://www.ucl.ac.uk/prospective-students/undergraduate/degrees/arts-and-sciences-basc-2026",
      "https://www.ucl.ac.uk/prospective-students/undergraduate/how-apply/english-language-requirements",
      "https://www.ucas.com/undergraduate/applying-university/ucas-undergraduate-when-apply"
    ],
    "evidenceZh": "UCL官方总则明确写明接受“A levels and other equivalent qualifications”，并在“A levels (including International A levels)”部分规定三门A-level评估，因此 Cambridge International A-Level 可确认接受。课程等级和科目要求以2026课程页为例，不能替代具体申请年份/课程核验。UCL新加坡页面的“Singapore/Cambridge A-levels at H2 level”是新加坡本地H2口径，已与通用International A levels区分。英语等级、截止日期和附加考试可能按课程及申请年份变化。"
  },
  "lse": {
    "accepted": false,
    "generalZh": "null；官方未公布适用于全校所有国际 Cambridge International A-Level 申请人的统一最低等级；LSE仅以 GCE A-level 表述通用标准，并要求按具体课程页核对。",
    "benchmarksZh": "{\"medicine_life_science\":\"null；LSE本科课程检索页及所核官方页面未见医学本科；BSc Psychological and Behavioural Science 为 A*AA，且至少一门 Biology、Chemistry、Physics、Mathematics 或 Psychology 达到要求。\",\"engineering\":\"null；LSE官方本科课程范围及所核页面未公布工程类课程要求。\",\"computing\":\"BSc Data Science：A*AA，A* in Mathematics；若学校提供，AS-或A-level Further Mathematics expected and grade A；Mathematics required，Further Mathematics highly desirable，Physics/Chemistry为良好准备但非强制。\",\"business_economics\":\"BSc Economics：A*AA，A* in Mathematics；Mathematics required，Further Mathematics desirable，Economics非必需；BSc Management 等课程的具体等级应以相应课程页为准，官方未在本次核验中统一公布。\",\"law\":\"LLB Bachelor of Laws：A*AA；无固定 A-level 科目组合，但重视学术性、阅读写作和研究能力；Mathematics+Further Mathematics须与 essay-writing subject 组合。\",\"psychology\":\"BSc Psychological and Behavioural Science：A*AA，至少一门 Biology、Chemistry、Physics、Mathematics 或 Psychology；要求至少一门上述科目 A。\",\"arts_humanities\":\"BSc International Relations：AAA；无固定科目组合，偏好至少两门传统学术科目，典型包括 History、English、Economics、Government and Politics、Sociology、Geography、languages、Psychology、Philosophy。\"}",
    "prerequisitesZh": "Computing/Data Science: Mathematics required; Further Mathematics highly desirable/where offered expected with A; Physics or Chemistry helpful but not mandatory; Economics: Mathematics required, Further Mathematics desirable, Economics not required; Law: no set combination, strong literacy/essay-writing preferred; Mathematics + Further Mathematics should include an essay-writing subject; Psychology: at least one of Biology, Chemistry, Physics, Mathematics, Psychology at grade A; International Relations/arts-humanities: no set combination, at least two traditional academic subjects preferred; LSE generally expects at least two full A-levels or equivalent in traditional academic subjects.",
    "englishZh": "IELTS Academic 7.0 overall and 7.0 in each component；TOEFL iBT 100 overall with minimum Writing 27, Reading 25, Listening 24, Speaking 24（官网同时列出2026年1月起更新分数制的替代表述）；PTE Academic 70 overall and 70 in each component；Cambridge C1 Advanced/C2 Proficiency 185 overall and 185 in each component；可由加拿大或 UKVI majority English-speaking country 国籍且英语为第一语言，或在相关国家完成规定年限的本科/研究生学位而豁免；录取申请阶段通常无需提交，获 offer 后按要求在 July 前提供。",
    "extrasZh": "LLB Laws: 所有申请人必须参加 LNAT；LSE 不对任何本科课程面试；其他课程本次所核官方页面未公布统一附加考试或作品集要求；学校可要求补充申请材料或信息。",
    "deadlineZh": "2027-01-13（所核 2027/28 课程页）；LSE 2026 entry及 deferred 2027 的 UCAS 全面平等考虑截止为 2026-01-14 18:00 GMT；国际申请人虽可至 6月30日提交，但官方强烈建议按1月截止日期申请。",
    "sources": [
      "https://www.lse.ac.uk/study-at-lse/Undergraduate/Prospective-Students/How-to-Apply/entry-requirements",
      "https://www.lse.ac.uk/study-at-lse/Undergraduate/Prospective-Students/How-to-Apply/English-language-requirements",
      "https://www.lse.ac.uk/study-at-lse/Undergraduate/Prospective-Students/How-to-apply",
      "https://www.lse.ac.uk/study-at-lse/undergraduate/bsc-economics",
      "https://www.lse.ac.uk/study-at-lse/undergraduate/bsc-data-science",
      "https://www.lse.ac.uk/study-at-lse/undergraduate/bsc-international-relations",
      "https://www.lse.ac.uk/study-at-lse/undergraduate/bsc-psychological-and-behavioural-science",
      "https://www.lse.ac.uk/study-at-lse/undergraduate/llb-bachelor-of-laws",
      "https://www.lse.ac.uk/study-at-lse/undergraduate/prospective-students/how-to-apply/admissions-information"
    ],
    "evidenceZh": "LSE官网明确说明标准 offer 以 GCE A-level 和 IB 表述，并要求国际申请人通过国家/资格等值页面核对；本次仅凭所访问的 LSE 官方公开页面，未找到明确写出“Cambridge International A-Level”名称及统一换算等级，因此 accepts_cambridge_alevel 记为 false，不能据此推断不接受。课程等级均为官网当前页面的 GCE A-level 标准，Cambridge International 的等值适用性和个别课程换算须向 LSE Undergraduate Admissions 进一步确认。页面存在 2026/27、2027/28 年度切换，截止日期按页面所示年度记录。"
  },
  "kcl": {
    "accepted": true,
    "generalZh": "按课程而定；官方未公布统一全校最低 A-Level 门槛。King’s conditional offers generally based on three A-level subjects；课程页代表性标准为 A*AA、AAA 等。官方明确：International A-levels from Cambridge International Examinations are accepted as equivalent to GCE A-levels。",
    "benchmarksZh": "{\"medicine_life_science\":\"Medicine MBBS: A*AA；必须 Biology A + Chemistry A；国际申请英语 Band B；Biomedical Science 等课程要求因课程而异，官方未在通用页统一列出。\",\"engineering\":\"General Engineering BEng: AAA；必须 Mathematics A；国际申请英语 Band B。\",\"computing\":\"Computer Science BSc: A*A*A；必须 Mathematics 或 Further Mathematics A；Computing/Computer Science 为 preferred subjects；国际申请英语 Band B。\",\"business_economics\":\"Economics & Management BSc: A*AA；必须 Mathematics A + Humanities/Social Science A（不含 Modern Languages）。Business Management BSc: A*AA；必须 Humanities/Social Science A（不含 Modern Languages）。\",\"law\":\"Law LLB: A*AA；无 required 或 preferred A-level subject；国际申请英语 Band B。\",\"psychology\":\"Psychology BSc: A*AA；必须 Biology、Chemistry、Mathematics、Physics 或 Psychology 其中一科 A；Biology 和 Mathematics 为 preferred subjects；国际申请英语 Band B。\",\"arts_humanities\":\"Culture, Media & Creative Industries BA: AAA；必须 essay-based 或 creative-based subject；Law LLB（可作社科/人文参照）A*AA且无指定科目。\"}",
    "prerequisitesZh": "Medicine: Biology A + Chemistry A; General Engineering: Mathematics A; Computer Science: Mathematics or Further Mathematics A, Computing/Computer Science preferred; Economics & Management: Mathematics A + Humanities/Social Science A（excluding Modern Languages）; Business Management: Humanities/Social Science A（excluding Modern Languages）; Law: no required/preferred subject; Psychology: one of Biology/Chemistry/Mathematics/Physics/Psychology at A，Biology and Mathematics preferred; Culture, Media & Creative Industries: essay-based or creative-based subject",
    "englishZh": "本科课程按课程适用 English language band；上述代表性课程官方页面均列 Band B。官方英语页列明：通常须在入学前提交英语能力证明；可接受资格包括 GCE A-level/AS-level English Language 或 English Language & Literature Grade C，以及相应 IGCSE/英语测试。Band B 的具体考试分数应以当年度官方 band 表为准；本次官方页面提取未完整显示 Band B 表格，故不臆测 IELTS/TOEFL 数字。若申请人是所列 majority English-speaking country 国籍且在该国完成相应高中 Level 3 qualification，通常可免额外英语考试。",
    "extrasZh": "Medicine: UCAT compulsory，须在申请前参加；King’s 不设固定 UCAT threshold，SJT也纳入 shortlist；Law: LNAT compulsory，须在申请周期当年12月31日前参加；其他上述代表性课程：未见统一额外考试/面试/作品集要求；EPQ不计入评估；General Studies、Critical Thinking、Thinking Skills、Global Perspectives 不计作 A-level",
    "deadlineZh": "2027-01-13（官方当前 how-to-apply 页面所示普通本科 UCAS deadline）；Medicine/Dentistry: 2026-10-15 18:00（UK time）；Law LNAT: admissions cycle 当年 12月31日前；UCAS deadline 可能按申请年度更新",
    "sources": [
      "https://www.kcl.ac.uk/study/undergraduate/how-to-apply/entry-requirements",
      "https://www.kcl.ac.uk/study/undergraduate/how-to-apply/english-language-requirements",
      "https://www.kcl.ac.uk/study/undergraduate/how-to-apply",
      "https://www.kcl.ac.uk/study/undergraduate/courses/medicine-mbbs/entry-requirements",
      "https://www.kcl.ac.uk/study/undergraduate/courses/general-engineering-beng/entry-requirements",
      "https://www.kcl.ac.uk/study/undergraduate/courses/computer-science-bsc/entry-requirements",
      "https://www.kcl.ac.uk/study/undergraduate/courses/economics-and-management-bsc/entry-requirements",
      "https://www.kcl.ac.uk/study/undergraduate/courses/business-management-bsc/entry-requirements",
      "https://www.kcl.ac.uk/study/undergraduate/courses/law-llb/entry-requirements",
      "https://www.kcl.ac.uk/study/undergraduate/courses/psychology-bsc/entry-requirements",
      "https://www.kcl.ac.uk/study/undergraduate/courses/culture-media-creative-industries-ba/entry-requirements"
    ],
    "evidenceZh": "King’s 官方通用入学页明确接受 Cambridge International Examinations 的 International A-levels，视同 GCE A-level；但成绩和科目要求必须按具体课程核验，不能用 Singapore H2/H1 或 ATAR 替代。医学与法律分别要求 UCAT/LNAT。英语要求按 Band A–E 随课程变化；本次仅对 Band B 作官方可证实记录，未显示完整分数表的项目不推测数字。截止日期按官方当前页面所示，申请年度更新时须复核。"
  },
  "edinburgh": {
    "accepted": true,
    "generalZh": "null；官方未公布全校统一的 Cambridge International A-Level 最低等级。官网明确说明 Cambridge AICE Diploma 可用于入学，且须包含三门 Cambridge International A Levels，成绩点数须等同于所申请课程的 A-Level 等级要求；课程要求按专业分别公布。",
    "benchmarksZh": "{\"medicine_life_science\":\"Medicine MBChB：AAA in one sitting；A-Level 必须含 Chemistry + Biology/Human Biology、Mathematics/Further Mathematics 或 Physics 三者之一；Biomedical/生命科学代表课程的具体 Cambridge A-Level 等级未在本次核验中统一确认，须按具体课程页查询。\",\"engineering\":\"官方课程级 A-Level 等级与 Cambridge International 对应要求未在本次核验中统一确认；须按具体工程课程页查询。\",\"computing\":\"Computer Science 课程有独立课程级要求，官方页面未在本次核验中提取到可安全转录的完整等级/科目组合；不得以通用门槛替代。\",\"business_economics\":\"Business and Economics 课程有独立课程级要求；本次仅确认官网要求申请人按具体学位课程查看 A-Level 等级和科目，具体数字官方未核验。\",\"law\":\"Law 课程有独立课程级要求；具体 Cambridge A-Level 等级和必修科目官方未核验。\",\"psychology\":\"Psychology 课程有独立课程级要求；具体 Cambridge A-Level 等级和必修科目官方未核验。\",\"arts_humanities\":\"官网地区页对 Arts, Humanities and Social Sciences 说明课程需按 individual degree programme 查看；未确认全院统一 Cambridge A-Level 等级，官方未公布统一数字。\"}",
    "prerequisitesZh": "Medicine MBChB: Chemistry + one from Biology/Human Biology, Mathematics/Further Mathematics or Physics；其他六类：官方课程级先修科目须按具体学位课程页核验，未确认者不填数字或科目。",
    "englishZh": "所有申请人均须证明英语能力，要求按课程公布。已核验的 MBChB Medicine：IELTS Academic 7.5 overall，且各单项至少 7.5；TOEFL-iBT（2026-01-21 前考试）总分 110、各单项至少 25；C1 Advanced/C2 Proficiency 总分 191、各单项至少 191。学校资格可豁免测试，但须达到相应认可英语资格/成绩；一般全校统一 Cambridge A-Level 英语豁免规则官方未在本次核验中确认。",
    "extrasZh": "Medicine：必须参加同年 UCAS 申请周期的 UCAT，并达到最低 UCAT 分数；UCAT Situational Judgement 为 Band 4 不予考虑；必须参加面试；获录取后须完成 health clearance checks。其他专业：本次未确认统一要求的附加考试、作品集或面试。",
    "deadlineZh": "2027-01-13 18:00 GMT（UCAS equal consideration deadline；官网注明多数本科课程在此日期关闭）。Medicine 另有 15 October in the year prior to programme start date 的官方截止要求。",
    "sources": [
      "https://www.ed.ac.uk/studying/international/country/americas/united-states-of-america",
      "https://www.ed.ac.uk/studying/undergraduate/entry-requirements/international",
      "https://study.ed.ac.uk/programmes/undergraduate/354-mbchb-medicine-6-year-programme/entry-requirements",
      "https://study.ed.ac.uk/undergraduate/applying/making-application/when-apply",
      "https://study.ed.ac.uk/programmes/undergraduate/57-computer-science"
    ],
    "evidenceZh": "官网美国地区国际资格页明确接受 Cambridge AICE Diploma，并要求其中含三门 Cambridge International A Levels，按课程所需等级换算点数；这足以确认接受，但不代表全校有统一 A-Level 门槛。爱丁堡按具体学位、申请地区和资格类型给要求；本结果仅把已在官方页面直接核验的医学数字写入，其他六类未核实的数字均标为官方未公布，避免将新加坡 H2/H1 或其他本地资格混入 Cambridge A-Level。"
  },
  "manchester": {
    "accepted": true,
    "generalZh": "通常要求 three full A Levels；官方总页未公布统一全校最低等级，具体课程另列；国际申请须按国家/课程页面及 individual course profile 核验",
    "benchmarksZh": "{\"medicine_life_science\":\"Medicine MBChB: AAA（典型 A-level offer），包括 Biology/Human Biology 或 Chemistry，以及 Chemistry/Biology/Human Biology 中的另一门；Biomedical Sciences: AAA–AAB，包括 Biology、Chemistry、Physics、Mathematics 四门核心科学中的两门。Cambridge International A-Level 可按 A-level 口径核验，但该课程页未单独列 Cambridge 等级换算。\",\"engineering\":\"代表性工程课程的具体等级和科目要求须以 individual course profile 为准；本次核验官方总页未给出工程类统一门槛，官方未公布统一工程基准。\",\"computing\":\"BSc Computer Science and Mathematics: A*A*A（典型 A-level offer），包括 Mathematics；课程说明另要求至少一门 Biology、Chemistry 或 Physics。\",\"business_economics\":\"商科/经济课程要求按具体课程变化；官方总页未公布统一商科经济 A-level 门槛，官方未公布统一基准。\",\"law\":\"法律课程要求按具体课程变化；本次官方来源未核验到可直接引用的统一 A-level 等级或先修科目，官方未公布统一基准。\",\"psychology\":\"BSc Psychology: AAA（典型 A-level offer），包括 Psychology、Biology、Human Biology、Chemistry、Physics、Statistics、Mathematics 或 Further Mathematics 中的一门或多门。\",\"arts_humanities\":\"文社人文课程要求按具体课程变化；官方总页未公布统一 A-level 门槛，通常需查看 individual course profile，官方未公布统一基准。\"}",
    "prerequisitesZh": "Medicine MBChB: Biology/Human Biology or Chemistry + one further subject from Chemistry/Biology/Human Biology; Biomedical Sciences: two of Biology, Chemistry, Physics, Mathematics; Computer Science and Mathematics: Mathematics + at least one of Biology/Chemistry/Physics; Psychology: one or more of Psychology, Biology, Human Biology, Chemistry, Physics, Statistics, Mathematics, Further Mathematics",
    "englishZh": "国际本科通常要求课程规定的英语证明；官方概述为通常 IELTS 6.0–7.0（foundation 通常 5.5），具体课程分项要求优先；学生签证最低 CEFR B2；可接受 IELTS、TOEFL、Pearson、Trinity ISE 等，部分情况下 IB Standard Level/IGCSE；豁免/替代资格以官方 English language requirements 页及课程页为准",
    "extrasZh": "Medicine: UCAS 申请；需参加 UCAT，且有面试/selection process；其他课程：官方总页说明部分课程可能要求 written work、工作经验或特定学科，未核验到计算机、心理学代表课程的统一附加考试或作品集要求",
    "deadlineZh": "Medicine/Dentistry: 15 October 2025 18:00 UK time（2026 entry）；其他 2026 entry 本科课程 UCAS equal consideration deadline: 14 January 2026 18:00 UK time",
    "sources": [
      "https://www.manchester.ac.uk/study/undergraduate/applying/before-you-apply/entry-requirements/",
      "https://www.manchester.ac.uk/study/international/admissions/undergraduate-application-process/undergraduate-entry-requirements/",
      "https://www.manchester.ac.uk/study/international/admissions/language-requirements/",
      "https://www.manchester.ac.uk/study/undergraduate/courses/2026/01428/mbchb-medicine/",
      "https://www.manchester.ac.uk/study/undergraduate/courses/2026/00532/bsc-biomedical-sciences/",
      "https://www.manchester.ac.uk/study/undergraduate/courses/2026/00558/bsc-computer-science-and-mathematics/",
      "https://www.manchester.ac.uk/study/undergraduate/courses/2026/00653/bsc-psychology/",
      "https://www.manchester.ac.uk/study/undergraduate/applying/"
    ],
    "evidenceZh": "曼彻斯特大学官方总页明确列有 Cambridge Advanced International Certificate of Education（AICE），并接受 A-level/认可等值资格；因此可确认 Cambridge International A-Level 属可核验资格，但官方未在总页提供统一 Cambridge 分数换算。课程要求高度依专业而异；本记录只把已从官方课程页核验到的数字列入，工程、商科经济、法律、文社人文统一门槛均标为官方未公布，不将新加坡 H1/H2 或 ATAR 口径混入。截止日期按官方 2026 entry 时间线，后续申请年度需重新核验。"
  },
  "warwick": {
    "accepted": true,
    "generalZh": "3 full A-levels；官方未公布全校统一最低等级，具体课程按 individual course typical offer；全校 GCSE/Level 2 最低为 English Language 与 Mathematics 均 Grade C/4 或等同资格",
    "benchmarksZh": "{\"medicine_life_science\":\"代表性生命科学：Biomedical Sciences BSc AAB including Biology and a second Science；或 AAA including Biology。未将 Medicine 作为独立本科课程要求核实，官方未公布 Warwick 医学本科 Cambridge A-level 门槛。\",\"engineering\":\"Engineering BEng AAA to include Mathematics and Physics；contextual AAB including Mathematics and Physics。\",\"computing\":\"Computer Science BSc A*A*A to include A* in Mathematics；2026-27 applicants generally required to take TMUA，确切 TMUA 门槛官方未公布。\",\"business_economics\":\"Economics BSc A*AA including A in Mathematics；GCSE English Language 6/B；TMUA optional，最高 TMUA 成绩者可获 AAA reduced offer，具体分数官方未公布。代表性商科 Accounting and Finance BSc 为 A*AA including A in Maths。\",\"law\":\"Law LLB A*AA；GCSE Mathematics 4/C 与 English Language 6/B；LNAT currently not required。\",\"psychology\":\"Psychology BSc：官方课程页应以当年 course-specific typical offer 为准；本次官方可核验材料未取得明确 A-level 等级与先修科目，官方未公布。\",\"arts_humanities\":\"History BA AAA to include History；English and History BA AAA or A*AB including A in English；代表性文社人文课程要求因课程而异。\"}",
    "prerequisitesZh": "Engineering: Mathematics + Physics; Computer Science: A* in Mathematics; Economics: Mathematics required, Further Mathematics/Economics accepted but not essential; Biomedical Sciences: Biology + second Science, with Chemistry/Physics/Maths etc.; History: History; English and History: English; Law: no specific A-level subject stated, but avoid overlapping Law/Sociology/Psychology combination where possible",
    "englishZh": "按课程 English Language Band 执行。全体申请者须证明英语能力；IELTS Academic Band A 6.0 overall/min 5.5 each，Band B 6.5/min 6.0，Band C 7.0/min 6.5。Economics 与 Biomedical/Engineering 等代表课程为 Band C 或 Band A（以课程页为准）；接受的考试通常须在开课前两年一个月内完成。GCE A-level English Language/Literature 的 CIE 不接受；可用合资格 GCSE English 或其他列明资格满足/豁免。",
    "extrasZh": "Computer Science: TMUA required for 2026-27 applicants except contextual applicants，确切要求官方未公布; Economics: TMUA optional，可能用于评估，具体门槛官方未公布; Law: LNAT not currently required; Biomedical Sciences/Engineering/Law/Economics: official pages state interviews are not typically used，主要依据 UCAS application、成绩、personal statement 与 reference; Portfolio: 官方未公布",
    "deadlineZh": "2027 entry UCAS equal-consideration deadline：2027-01-13（Warwick 官方日期页列示通常 UCAS 主截止日；须以当年官方更新为准）",
    "sources": [
      "https://warwick.ac.uk/study/undergraduate/applying/entry-requirements/",
      "https://warwick.ac.uk/study/undergraduate/courses/ug-international-qualifications/",
      "https://warwick.ac.uk/study/undergraduate/applying/english-language-requirements/",
      "https://warwick.ac.uk/study/undergraduate/applying/dates/",
      "https://warwick.ac.uk/study/undergraduate/courses/bsc-biomedical-sciences/",
      "https://warwick.ac.uk/study/undergraduate/courses/beng-engineering/",
      "https://warwick.ac.uk/study/undergraduate/courses/bsc-computer-science/",
      "https://warwick.ac.uk/study/undergraduate/courses/bsc-economics/",
      "https://warwick.ac.uk/study/undergraduate/courses/llb-law/",
      "https://warwick.ac.uk/study/undergraduate/courses/ba-history/",
      "https://warwick.ac.uk/study/undergraduate/courses/ba-english-history/"
    ],
    "evidenceZh": "Warwick 官方总则明确要求三门完整 A-level，但未设全校统一 A-level 等级；典型 offer 必须按课程页判断。国际资格页将 A-level 列为可考虑资格，且官方国际招生材料/考试中明确涉及 International A Levels，因此判定接受 Cambridge International A-Level；但不同国家页面可能仅写 A-level，建议递交前向 Undergraduate Admissions 确认具体 CIE 科目组合。医学、心理学及部分商科/人文课程的代表性数字不得由其他专业外推；未取得明确数字处已标注官方未公布。"
  }
} as const;
