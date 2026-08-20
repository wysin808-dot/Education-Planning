/**
 * 设计风格提醒（Admissions Almanac 招生年鉴）
 *
 * 单目标升学方案：由「一所院校 + 一个专业」推导出
 *   ① Year 11 / Year 12 的分年选课
 *   ② 竞赛、活动与语言等背景准备建议
 *
 * 纪律要求：
 *  - 先修科目、附加测试、英语要求一律来自数据层的官方字段，不得改写。
 *  - 竞赛与课外活动在澳洲本科录取中并非硬性条件，必须标注为「加分项」，
 *    只有 extras 中明确列出的项目（面试、笔试、作品集、试音、体检）
 *    才可标为「官方要求」。
 */
import {
  SUBJECTS,
  UNIVERSITIES,
  type FieldKey,
  type Programme,
  type SubjectKey,
  type University,
} from "@/data/universities";
import type { AlevelSubjectKey } from "@/data/alevelRules";
import { extraLabel } from "@/lib/matching";

/** Year 11 建议修读的 ATAR 课程数 */
export const Y11_COURSES = 5;
/**
 * Year 12 修读的课程数。
 * 依招生办确认：Year 12 修五门、取最好的四门计入 ATAR，
 * 以便在锁定 EALD / 中文 / 数学三门之后仍能容纳医学、工程等专业的多组先修。
 */
export const Y12_COURSES = 5;
/** 实际计入 ATAR 的科目数 */
export const ATAR_COUNTED = 4;

const SCALING_WEIGHT: Record<string, number> = { 高: 3, 中: 2, 一般: 1 };

export interface TargetPlanSubject {
  subject: SubjectKey;
  /**
   * english：EALD，WACE 毕业与语言要求的基础
   * chinese：中文第一语言，中国学生的稳定高分科目
   * math：锁定的数学线
   * required：该专业先修
   * support：方向支撑
   * filler：提分补位
   */
  role: "english" | "chinese" | "math" | "required" | "support" | "filler";
  /** 组内二选一时的其他选项 */
  alternatives: SubjectKey[];
  /** 为什么选它 */
  reasonZh: string;
  reasonEn: string;
}

export interface PreparationItem {
  /** official：官方明确要求；advantage：加分项；language：语言条件 */
  kind: "official" | "advantage" | "language";
  titleZh: string;
  titleEn: string;
  detailZh: string;
  detailEn: string;
  /** 建议启动时间 */
  timingZh: string;
  timingEn: string;
}

export interface TargetPlan {
  university: University;
  programme: Programme;
  requiredAtar: number | null;
  year11: TargetPlanSubject[];
  year12: TargetPlanSubject[];
  dropped: TargetPlanSubject[];
  /** 该专业先修科目在本序列未开设时的预警 */
  unavailable: SubjectKey[];
  preparation: PreparationItem[];
  /** 本方案是否采用双数学（数学方法 + 专业数学） */
  doubleMath: boolean;
  /**
   * 学生数学为强项、但因目标专业另有非数学先修而未采用双数学。
   * Year 12 修五门，仍放不下时先修优先，因先修属资格门槛。
   */
  doubleMathBlockedBy: SubjectKey[];
  /** 中文（第一语言）在本序列是否开设；北半球序列不开设 */
  chineseAvailable: boolean;
  /** Year 12 中计入 ATAR 的四门（其余一门为备份，取最好四门计分） */
  counted: TargetPlanSubject[];
  /** Year 12 中不计入最优四门的备份科目 */
  backup: TargetPlanSubject[];
}

/**
 * BCI 中国学生的锁定科目线。
 * 依招生办确认：EALD、中文（第一语言）、数学三门为固定基础，
 * 其中中文（第一语言）BCI 仅在南半球序列开设。
 */
export const LOCKED_ENGLISH: SubjectKey = "eald";
export const LOCKED_CHINESE: SubjectKey = "chineseFL";
/** 数学线的层级优先顺序：由高到低 */
const MATH_LADDER: SubjectKey[] = ["mathSpecialist", "mathMethods", "mathApplications"];

/** 各学科方向在 WACE 阶段的支撑科目（未被列为先修，但显著提升竞争力） */
const FIELD_SUPPORT: Record<FieldKey, SubjectKey[]> = {
  medicine: ["chemistry", "humanBio", "biology", "mathMethods"],
  law: ["economics", "mathMethods", "psychology"],
  computing: ["mathMethods", "mathSpecialist", "physics", "ait"],
  engineering: ["mathMethods", "physics", "mathSpecialist", "chemistry"],
  business: ["mathMethods", "economics", "accounting"],
  science: ["mathMethods", "chemistry", "physics", "biology"],
  design: ["ait", "mathApplications", "psychology"],
  creative: ["ait", "psychology", "business", "mathApplications"],
  arts: ["economics", "psychology", "mathApplications"],
  education: ["mathMethods", "psychology", "humanBio"],
};

/** 某方向在 WACE 阶段的支撑科目，供「由方向规划」页作为补位优先序 */
export function fieldSupportSubjects(field: FieldKey): SubjectKey[] {
  return FIELD_SUPPORT[field] ?? [];
}

/** 某方向在 BCI 十门 A-Level 课程中的支撑科目，用途同上 */
export function alevelFieldSupportSubjects(field: FieldKey): AlevelSubjectKey[] {
  return ALEVEL_FIELD_SUPPORT[field] ?? [];
}

/** 各方向可考虑的竞赛与学术活动。均为加分项，不得表述为录取条件。 */
const FIELD_COMPETITIONS: Record<FieldKey, { zh: string; en: string }> = {
  medicine: {
    zh: "澳大利亚生物奥林匹克（ASOE Biology）、化学奥林匹克初赛，或医院、养老机构的长期志愿服务记录。英国医学方向另需 UCAT ANZ 或 BMAT 类入学测试的专项备考。",
    en: "Australian Science Olympiad (Biology), Chemistry Olympiad qualifying rounds, or a sustained volunteering record in hospitals or aged care. UK medicine routes additionally require dedicated preparation for admissions tests such as UCAT ANZ.",
  },
  law: {
    zh: "模拟法庭、辩论赛（如 Australia-wide Schools Debating）、模拟联合国，以及英文写作类竞赛。英国法律方向须专项准备 LNAT。",
    en: "Mooting, debating competitions such as the Australia-wide Schools Debating championships, Model UN, and English writing contests. UK law routes require dedicated LNAT preparation.",
  },
  computing: {
    zh: "澳大利亚信息学奥林匹克（AIO）、NCSS Challenge、澳大利亚数学竞赛（AMC），或可公开展示的个人项目与开源代码。",
    en: "Australian Informatics Olympiad, the NCSS Challenge, the Australian Mathematics Competition, or a demonstrable portfolio of personal projects and open-source code.",
  },
  engineering: {
    zh: "澳大利亚数学竞赛（AMC）、物理奥林匹克、F1 in Schools、RoboCup Junior 等工程实作类赛事。",
    en: "The Australian Mathematics Competition, Physics Olympiad, F1 in Schools and RoboCup Junior or similar hands-on engineering competitions.",
  },
  business: {
    zh: "ASX 股市游戏、商业案例分析赛、经济学竞赛，或校内创业社团与实习经历。",
    en: "The ASX Sharemarket Game, business case competitions, economics contests, or entrepreneurship societies and internships.",
  },
  science: {
    zh: "澳大利亚科学奥林匹克（ASOE）、BHP Science and Engineering Awards、青少年科研项目展示。",
    en: "The Australian Science Olympiads, BHP Science and Engineering Awards, and youth research project showcases.",
  },
  design: {
    zh: "持续积累的个人作品集为首要准备，可辅以设计竞赛、展览投稿与写生速写的长期记录。",
    en: "A continuously developed portfolio is the priority, supported by design competitions, exhibition submissions and a sustained record of drawing practice.",
  },
  creative: {
    zh: "作品集或试音是第一位的准备，且须长期积累而非临阵突击：视觉方向建议保持连续的创作记录与展览、比赛投稿；音乐方向须报考 ABRSM 或 Trinity 等级考试——剑桥音乐要求第八级乐理达 Merit 以上，国王学院与曼彻斯特接受第五级乐理替代 A-Level 音乐，这是 BCI 学生进入这些音乐系的必经路径。以上均为加分项或资格佐证，竞赛本身不构成录取条件。",
    en: "A portfolio or audition is the first priority and must be built up over time rather than assembled at the last minute. Visual routes call for a continuous record of practice alongside exhibition and competition submissions. Music routes require ABRSM or Trinity graded examinations: Cambridge asks for Grade 8 Theory at Merit or above, while King's and Manchester accept Grade 5 Theory in place of A Level Music, which is the necessary route for BCI students into those music departments. These are advantages or evidence of qualification; competitions themselves are not admission conditions.",
  },
  arts: {
    zh: "写作、演讲与辩论类竞赛，人文社科研究项目，或长期的社区服务与文化活动参与。",
    en: "Writing, public speaking and debating competitions, humanities research projects, or sustained community service and cultural involvement.",
  },
  education: {
    zh: "长期的教学类志愿服务最具说服力：课后辅导、社区中文或英文教学、体育或音乐助教、青少年营队带队。部分教育学院在面试或个人陈述中会考察与儿童相处的实际经验。",
    en: "Sustained teaching-related volunteering carries the most weight: after-school tutoring, community language teaching, sports or music coaching, and leading youth camps. Some education faculties probe real experience with children at interview or in the personal statement.",
  },
};

/**
 * 各方向对应的新加坡本地义工服务建议。
 * BCI 学生在新加坡就读，本地义工既便于长期投入，也更容易取得可查证的服务证明。
 * 与竞赛同属加分项，不得表述为录取硬性条件。
 */
const FIELD_VOLUNTEERING: Record<FieldKey, { zh: string; en: string }> = {
  medicine: {
    zh: "在新加坡本地医疗与照护机构累积长期服务：公立医院志愿者计划、疗养院与康复中心陪护、红十字会或圣约翰救伤队的急救训练与值勤。医学与牙医面试普遍会追问服务时长、具体职责与从中获得的认识。",
    en: "Build a sustained record with Singapore healthcare and care organisations: public hospital volunteer schemes, nursing home and rehabilitation centre support, and first-aid training and duty with the Singapore Red Cross or St John. Medicine and dentistry interviews routinely probe the duration, actual duties and reflections drawn from such service.",
  },
  law: {
    zh: "参与新加坡本地的公共服务与社群支援：社区法律咨询活动的行政协助、公民咨询委员会与民众俱乐部的社区服务、面向新移民或年长者的语言与文书协助。此类经历有助于在个人陈述中说明对公共事务的持续关注。",
    en: "Take part in Singapore community and public-service work: administrative support at community legal clinics, service through Citizens' Consultative Committees and community clubs, and language or paperwork assistance for new arrivals and the elderly. Such experience substantiates a sustained interest in public affairs in the personal statement.",
  },
  computing: {
    zh: "在新加坡本地投入数字包容类服务：为年长者开设的数字技能课程担任助教、社区中心的编程启蒙课带教、为公益机构义务开发网站或小工具。这类服务能同时证明技术能力与社会关怀。",
    en: "Contribute to digital-inclusion work in Singapore: assisting at digital skills classes for seniors, leading introductory coding sessions at community centres, and building websites or small tools pro bono for charities. This evidences technical ability and social awareness at once.",
  },
  engineering: {
    zh: "参与新加坡本地的实作型服务：社区维修与再利用活动、公益机构的无障碍设施改造协助、科学馆与青少年科技活动的义务导览或助教。长期记录比一次性活动更有说服力。",
    en: "Join hands-on service in Singapore: community repair and reuse initiatives, accessibility retrofitting for charities, and volunteer guiding or assisting at Science Centre and youth technology programmes. A sustained record counts for more than one-off events.",
  },
  business: {
    zh: "在新加坡本地社会企业或慈善机构承担实际职责：义卖与筹款活动的账务与推广、公益组织的社群媒体运营、小型社会企业的运营协助。有具体成果与数据的服务经历最具说明力。",
    en: "Take real responsibility with Singapore social enterprises or charities: bookkeeping and promotion for fundraising drives, running social media for non-profits, and supporting the operations of small social enterprises. Service with concrete outcomes and figures carries the most weight.",
  },
  science: {
    zh: "参与新加坡本地的科普与环境服务：科学馆义务导览、海岸清理与生物多样性调查（如 NParks 与自然学会的公民科学项目）、社区科普工作坊助教。这类服务能佐证持续的科学兴趣。",
    en: "Engage in Singapore science-outreach and environmental service: volunteer guiding at the Science Centre, coastal clean-ups and biodiversity surveys such as NParks and Nature Society citizen-science projects, and assisting at community science workshops. Such service evidences a sustained scientific interest.",
  },
  design: {
    zh: "在新加坡本地承接公益性质的设计任务：为慈善机构义务设计宣传物料、参与社区壁画与公共空间美化项目、在博物馆与设计节担任义工。这些成果可直接纳入作品集。",
    en: "Take on pro bono design work in Singapore: publicity materials for charities, community mural and public-space projects, and volunteering at museums and design festivals. The outcomes can go straight into the portfolio.",
  },
  creative: {
    zh: "在新加坡本地投入创作与演出类服务：新加坡国家美术馆与各博物馆的展览导览义工、滨海艺术中心与社区剧场的演出后台协助、为公益机构与养老院组织的社区艺术工作坊或义演、艺术节的记录摄影与影像剪辑。建议固定投入同一机构、累计一年以上，服务中产出的作品与影像可直接充实作品集。",
    en: "Commit to creative and performance service within Singapore: exhibition guiding at the National Gallery Singapore and other museums, backstage support at Esplanade and community theatre productions, community art workshops or benefit performances for charities and nursing homes, and documentary photography and video editing at arts festivals. Commit to one organisation for over a year; the work and footage produced in service can go directly into the portfolio.",
  },
  arts: {
    zh: "投入新加坡本地的文化与社群服务：博物馆与艺术节义工、社区口述历史与文化保存项目、为年长者或新移民提供的语言陪伴服务。长期参与可为个人陈述提供具体素材。",
    en: "Contribute to Singapore cultural and community work: volunteering at museums and arts festivals, community oral-history and heritage projects, and language companionship for the elderly or new arrivals. Long-term involvement supplies concrete material for the personal statement.",
  },
  education: {
    zh: "在新加坡本地累积教学服务：社区中心与自愿福利组织的课后补习、面向弱势家庭学生的一对一辅导、青年团体的营队带队与体育音乐助教。建议固定时段、长期投入同一机构，以便取得服务证明与推荐。",
    en: "Build teaching service within Singapore: after-school tutoring at community centres and voluntary welfare organisations, one-to-one support for students from disadvantaged families, and camp leadership or sports and music coaching with youth groups. Commit to regular sessions at one organisation so that a service record and a referee are available.",
  },
};

/** extras 字段到准备事项的映射 */
const EXTRA_DETAIL: Record<string, { zh: string; en: string; timingZh: string; timingEn: string }> = {
  面试: {
    zh: "院校会安排面试环节，考察动机、沟通与专业理解。建议在 Year 12 上学期开始进行模拟面试训练。",
    en: "The university conducts an interview assessing motivation, communication and subject understanding. Begin mock interview practice in the first semester of Year 12.",
    timingZh: "Year 12 上学期启动",
    timingEn: "From semester 1 of Year 12",
  },
  笔试: {
    zh: "该专业设有入学笔试。此类测试考查通用推理而非课内知识，需要独立于校内课程的专项备考。",
    en: "An admissions written test applies. Such tests assess general reasoning rather than school content and require preparation separate from coursework.",
    timingZh: "Year 11 末至 Year 12 初启动",
    timingEn: "From late Year 11 to early Year 12",
  },
  作品集: {
    zh: "需提交作品集。作品集需长期积累，建议自 Year 11 起持续记录创作过程与成品。",
    en: "A portfolio is required. Portfolios accumulate over time, so begin documenting process work and finished pieces from Year 11.",
    timingZh: "Year 11 起持续积累",
    timingEn: "Build continuously from Year 11",
  },
  试音: {
    zh: "需通过试音或术科考核，须提前确认曲目要求并安排长期训练。",
    en: "An audition or practical assessment applies; confirm the repertoire requirements early and plan sustained practice.",
    timingZh: "Year 11 起持续训练",
    timingEn: "Sustained practice from Year 11",
  },
  医疗体检: {
    zh: "录取后须完成体检与免疫接种记录，部分专业另需无犯罪记录证明。",
    en: "A medical examination and immunisation record are required after an offer; some programmes also require a police clearance.",
    timingZh: "获得录取后办理",
    timingEn: "After receiving an offer",
  },
  入学考试: {
    zh: "该专业设有独立的入学考试，需按官方公布的考试窗口报名与备考。",
    en: "A separate entrance examination applies; register and prepare according to the official testing window.",
    timingZh: "按官方考试窗口安排",
    timingEn: "Per the official testing window",
  },
};

/**
 * 生成单个目标的完整升学方案。
 * hemisphere 决定可选科目范围。
 */
export function buildTargetPlan(
  universityId: string,
  programmeId: string,
  hemisphere: "north" | "south",
  /** 学生数学是否为强项：为真时给出双数学方案 */
  strongMath = false,
): TargetPlan | null {
  const university = UNIVERSITIES.find((u) => u.id === universityId);
  const programme = university?.programmes.find((p) => p.id === programmeId);
  if (!university || !programme) return null;

  const offered = new Set(
    SUBJECTS.filter((s) => (hemisphere === "north" ? s.north : s.south)).map((s) => s.key),
  );
  const label = (key: SubjectKey, lang: "zh" | "en") => {
    const meta = SUBJECTS.find((s) => s.key === key);
    return meta ? (lang === "zh" ? meta.zh : meta.en) : key;
  };

  const picked: TargetPlanSubject[] = [];
  const taken = new Set<SubjectKey>();
  const unavailable: SubjectKey[] = [];

  // 1. EALD：中国学生的英语线，兼顾 WACE 毕业要求
  picked.push({
    subject: LOCKED_ENGLISH,
    role: "english",
    alternatives: offered.has("english") ? ["english"] : [],
    reasonZh:
      "英语非第一语言的学生按 EALD 修读，既满足 WACE 毕业的英语要求，评分对照组也更贴近自身情况。两年均须修读。",
    reasonEn:
      "Students whose first language is not English take EALD: it satisfies the WACE English graduation requirement and is assessed against a more comparable cohort. Taken across both years.",
  });
  taken.add(LOCKED_ENGLISH);

  // 2. 中文（第一语言）：中国学生的稳定得分科目，仅南半球序列开设
  const chineseAvailable = offered.has(LOCKED_CHINESE);
  if (chineseAvailable) {
    picked.push({
      subject: LOCKED_CHINESE,
      role: "chinese",
      alternatives: [],
      reasonZh:
        "中文母语程度的学生修读第一语言中文，是最稳定的得分来源，同时可作为香港院校中文语言要求的佐证。",
      reasonEn:
        "Native-level Chinese speakers take Chinese: First Language as their most reliable source of marks; it also evidences the Chinese language requirement at Hong Kong universities.",
    });
    taken.add(LOCKED_CHINESE);
  } else {
    unavailable.push(LOCKED_CHINESE);
  }

  // 3. 数学线：锁定至少一门；先按目标专业的先修层级取，再按强项决定是否加修第二门
  const prereqMaths = programme.prerequisites
    .flat()
    .filter((k) => MATH_LADDER.includes(k) && offered.has(k));
  /**
   * 目标专业的非数学先修。Year 12 仅四门计入 ATAR，
   * 三门锁定之后只剩一个名额，必须留给这些资格门槛科目。
   */
  const nonMathPrereqs = programme.prerequisites
    .filter((group) => group.length > 0 && !group.some((k) => MATH_LADDER.includes(k)))
    .map((group) => group.find((k) => offered.has(k)) ?? group[0]);
  const primaryMath =
    MATH_LADDER.find((k) => prereqMaths.includes(k)) ??
    MATH_LADDER.find((k) => offered.has(k) && k !== "mathApplications") ??
    MATH_LADDER.find((k) => offered.has(k));
  let doubleMath = false;
  const doubleMathBlockedBy: SubjectKey[] = [];
  if (primaryMath) {
    picked.push({
      subject: primaryMath,
      role: "math",
      alternatives: MATH_LADDER.filter((k) => k !== primaryMath && offered.has(k)),
      reasonZh: prereqMaths.includes(primaryMath)
        ? "既是目标专业的官方先修，也是数学线的锁定科目，两年均须修读。"
        : "数学为锁定科目，两年均须修读；本层级依目标专业与后续衔接选定。",
      reasonEn: prereqMaths.includes(primaryMath)
        ? "Both an official prerequisite for the target programme and the locked mathematics line; taken across both years."
        : "Mathematics is locked across both years; this level is chosen for the target programme and later progression.",
    });
    taken.add(primaryMath);

    /*
     * 数学强项者加修第二门数学。
     * Year 12 修五门后，锁定三门（EALD / 中文 / 数学）之外尚余两个名额，
     * 因此仅当非数学先修占满余下名额时，双数学才需让位。
     */
    const lockedCount = 1 + (chineseAvailable ? 1 : 0) + 1; // EALD + 中文 + 数学
    const roomAfterPrereqs = Y12_COURSES - lockedCount - nonMathPrereqs.length;
    if (strongMath && roomAfterPrereqs < 1) {
      doubleMathBlockedBy.push(...nonMathPrereqs);
    } else if (strongMath) {
      const second = MATH_LADDER.filter(
        (k) => k !== primaryMath && k !== "mathApplications" && offered.has(k) && !taken.has(k),
      )[0];
      if (second) {
        doubleMath = true;
        picked.push({
          subject: second,
          role: "math",
          alternatives: [],
          reasonZh:
            "数学为强项时建议修读两门数学。两门均属高 scaling 科目，是剑桥、LSE、帝国理工数学与经济类专业的常见要求，也能显著抬升 ATAR。",
          reasonEn:
            "Students strong in mathematics are advised to take two mathematics courses. Both scale highly, are commonly required by mathematics and economics programmes at Cambridge, LSE and Imperial, and lift the ATAR appreciably.",
        });
        taken.add(second);
      }
    }
  }

  // 4. 该专业的其余先修科目（二选一在组内择优，按 scaling）
  for (const group of programme.prerequisites) {
    if (group.length === 0) continue;
    // 已由数学线覆盖的先修组不再重复计入
    if (group.some((k) => taken.has(k))) continue;
    const open = group.filter((k) => offered.has(k));
    if (open.length === 0) {
      if (!unavailable.includes(group[0])) unavailable.push(group[0]);
      continue;
    }
    const best = open
      .slice()
      .sort(
        (a, b) =>
          (SCALING_WEIGHT[SUBJECTS.find((s) => s.key === b)?.scaling ?? "一般"] ?? 1) -
          (SCALING_WEIGHT[SUBJECTS.find((s) => s.key === a)?.scaling ?? "一般"] ?? 1),
      )[0];
    if (taken.has(best)) continue;
    picked.push({
      subject: best,
      role: "required",
      alternatives: open.filter((k) => k !== best),
      reasonZh: `${university.nameZh}${programme.nameZh}的官方先修科目，未修读将不具备申请资格。`,
      reasonEn: `An official prerequisite for ${programme.name} at ${university.name}; without it the application is not eligible.`,
    });
    taken.add(best);
  }

  // 5. 方向支撑科目
  for (const key of FIELD_SUPPORT[programme.field] ?? []) {
    if (picked.length >= Y11_COURSES) break;
    if (taken.has(key) || !offered.has(key)) continue;
    // 数学线已锁定，方向支撑不再追加数学科目
    if (MATH_LADDER.includes(key)) continue;
    picked.push({
      subject: key,
      role: "support",
      alternatives: [],
      reasonZh: "该方向的常见支撑科目，虽非硬性先修，但能提升学术契合度与后续课程衔接。",
      reasonEn: "A common supporting subject for this field. Not a hard prerequisite, but it strengthens academic fit and later course transitions.",
    });
    taken.add(key);
  }

  // 6. 仍有空位时，按 scaling 补位并避免同一学科分组重复
  if (picked.length < Y11_COURSES) {
    const usedGroups = new Set<string>();
    taken.forEach((k) => {
      const g = SUBJECTS.find((s) => s.key === k)?.group;
      if (g) usedGroups.add(g);
    });
    const pool = SUBJECTS.filter(
      (s) =>
        offered.has(s.key) &&
        !taken.has(s.key) &&
        s.key !== "eald" &&
        s.key !== "english" &&
        !MATH_LADDER.includes(s.key),
    ).sort((a, b) => (SCALING_WEIGHT[b.scaling] ?? 1) - (SCALING_WEIGHT[a.scaling] ?? 1));
    for (const meta of pool) {
      if (picked.length >= Y11_COURSES) break;
      if (usedGroups.has(meta.group)) continue;
      picked.push({
        subject: meta.key,
        role: "filler",
        alternatives: [],
        reasonZh: "用于补足名额并提升 ATAR 竞争力，可依学生强项替换。",
        reasonEn: "Fills the remaining slot and supports the ATAR; may be swapped for a personal strength.",
      });
      taken.add(meta.key);
      usedGroups.add(meta.group);
    }
    for (const meta of pool) {
      if (picked.length >= Y11_COURSES) break;
      if (taken.has(meta.key)) continue;
      picked.push({
        subject: meta.key,
        role: "filler",
        alternatives: [],
        reasonZh: "用于补足名额并提升 ATAR 竞争力，可依学生强项替换。",
        reasonEn: "Fills the remaining slot and supports the ATAR; may be swapped for a personal strength.",
      });
      taken.add(meta.key);
    }
  }

  const year11 = picked.slice(0, Y11_COURSES);
  const priority: Record<TargetPlanSubject["role"], number> = {
    english: 0,
    chinese: 1,
    math: 2,
    required: 3,
    support: 4,
    filler: 5,
  };
  /*
   * Year 12 的组合：
   * Year 11 修五门，Year 12 同样修五门，因此在名额允许时整体延续；
   * 若 Year 11 因先修过多而未能容纳全部必需科目，则按优先级取前五门。
   */
  const orderedAll = picked.slice().sort((a, b) => priority[a.role] - priority[b.role]);
  const year12 = orderedAll.slice(0, Y12_COURSES);
  const dropped = orderedAll.slice(Y12_COURSES);

  /*
   * 计入 ATAR 的四门：资格门槛（EALD / 数学 / 官方先修）优先占位，
   * 其余按 scaling 由高到低取，末位一门作为备份不计分。
   */
  /*
   * 计入 ATAR 的四门。
   * 资格类科目（EALD、数学线、官方先修）必须计入，否则不满足申请条件；
   * 其余名额在中文、方向支撑与补位之间按 scaling 竞争。
   * 中文对中文母语学生是稳定得分来源，因此与支撑科目同级参与排序，
   * 而非固定沦为备份。
   */
  const mustCount = (role: TargetPlanSubject["role"]) =>
    role === "english" || role === "required" || role === "math";
  const forCounting = year12.slice().sort((a, b) => {
    const qa = mustCount(a.role) ? 0 : 1;
    const qb = mustCount(b.role) ? 0 : 1;
    if (qa !== qb) return qa - qb;
    const sa = SCALING_WEIGHT[SUBJECTS.find((s) => s.key === a.subject)?.scaling ?? "一般"] ?? 1;
    const sb = SCALING_WEIGHT[SUBJECTS.find((s) => s.key === b.subject)?.scaling ?? "一般"] ?? 1;
    if (sb !== sa) return sb - sa;
    // scaling 相同时中文优先于补位科目
    const ra = a.role === "chinese" ? 0 : a.role === "support" ? 1 : 2;
    const rb = b.role === "chinese" ? 0 : b.role === "support" ? 1 : 2;
    return ra - rb;
  });
  const counted = forCounting.slice(0, ATAR_COUNTED);
  const backup = forCounting.slice(ATAR_COUNTED);

  return {
    university,
    programme,
    requiredAtar: programme.atar ?? university.minAtar,
    year11,
    year12,
    dropped,
    unavailable,
    preparation: buildPreparation(university, programme),
    doubleMath,
    doubleMathBlockedBy,
    chineseAvailable,
    counted,
    backup,
  };
}

/**
 * 背景准备：两套课程体系共用。
 * official 仅来自 extras 字段，advantage 明确标注为非硬性条件。
 */
function buildPreparation(university: University, programme: Programme): PreparationItem[] {
  const preparation: PreparationItem[] = [];

  for (const extra of programme.extras) {
    const detail = EXTRA_DETAIL[extra];
    preparation.push({
      kind: "official",
      titleZh: extra,
      titleEn: extra,
      detailZh: detail?.zh ?? "该专业设有此项附加选拔要求，请以院校官方公告为准。",
      detailEn:
        detail?.en ??
        "This programme applies an additional selection requirement; follow the university's official announcement.",
      timingZh: detail?.timingZh ?? "按院校公告安排",
      timingEn: detail?.timingEn ?? "Per the university's announcement",
    });
  }

  preparation.push({
    kind: "language",
    titleZh: "英语语言成绩",
    titleEn: "English language evidence",
    detailZh: university.english,
    detailEn: university.englishEn,
    timingZh: "毕业年上学期完成首考，留出重考余地",
    timingEn: "Sit the first attempt in the first semester of the final year, leaving room to retake",
  });

  const competition = FIELD_COMPETITIONS[programme.field];
  if (competition) {
    preparation.push({
      kind: "advantage",
      titleZh: "竞赛与课外活动",
      titleEn: "Competitions and activities",
      detailZh: competition.zh,
      detailEn: competition.en,
      timingZh: "从毕业前两年起持续投入，重质不重量",
      timingEn: "Sustained involvement from two years out; depth over quantity",
    });
  }

  const volunteering = FIELD_VOLUNTEERING[programme.field];
  if (volunteering) {
    preparation.push({
      kind: "advantage",
      titleZh: "新加坡本地义工服务",
      titleEn: "Volunteering in Singapore",
      detailZh: volunteering.zh,
      detailEn: volunteering.en,
      timingZh: "建议每月固定时段，累计满一年以上",
      timingEn: "A fixed monthly commitment sustained beyond one year",
    });
  }

  return preparation;
}

/**
 * 方向级背景准备：把该方向下所有专业的官方附加要求合并计数，再附上方向的竞赛与义工建议。
 *
 * 与单目标版本共用同一套 kind 分类，纪律一致：
 * 「官方要求」只能来自数据层 extras，且必须标明是本方向中多少个专业要求，
 * 避免把个别专业的作品集或试音读成整个方向的统一门槛；
 * 竞赛与义工一律归入「加分项」。
 */
export function buildFieldPreparation(
  field: FieldKey,
  entries: { university: University; programme: Programme }[],
): PreparationItem[] {
  const preparation: PreparationItem[] = [];
  const total = entries.length;

  const extraCounts = new Map<string, number>();
  for (const { programme } of entries) {
    for (const extra of programme.extras) {
      extraCounts.set(extra, (extraCounts.get(extra) ?? 0) + 1);
    }
  }

  for (const [extra, count] of Array.from(extraCounts.entries()).sort((a, b) => b[1] - a[1])) {
    const detail = EXTRA_DETAIL[extra];
    preparation.push({
      kind: "official",
      titleZh: `${extra} · 本方向 ${count} / ${total} 个专业要求`,
      titleEn: `${extraLabel(extra, "en")} · required by ${count} of ${total} in this field`,
      detailZh:
        detail?.zh ?? "本方向部分专业设有此项附加选拔要求，请以院校官方公告为准。",
      detailEn:
        detail?.en ??
        "Some programmes in this field apply this additional selection requirement; follow the university's official announcement.",
      timingZh: detail?.timingZh ?? "按院校公告安排",
      timingEn: detail?.timingEn ?? "Per the university's announcement",
    });
  }

  const competition = FIELD_COMPETITIONS[field];
  if (competition) {
    preparation.push({
      kind: "advantage",
      titleZh: "竞赛与课外活动",
      titleEn: "Competitions and activities",
      detailZh: competition.zh,
      detailEn: competition.en,
      timingZh: "从毕业前两年起持续投入，重质不重量",
      timingEn: "Sustained involvement from two years out; depth over quantity",
    });
  }

  const volunteering = FIELD_VOLUNTEERING[field];
  if (volunteering) {
    preparation.push({
      kind: "advantage",
      titleZh: "新加坡本地义工服务",
      titleEn: "Volunteering in Singapore",
      detailZh: volunteering.zh,
      detailEn: volunteering.en,
      timingZh: "建议每月固定时段，累计满一年以上",
      timingEn: "A fixed monthly commitment sustained beyond one year",
    });
  }

  return preparation;
}

/** 方案中科目角色的标签 */
export function targetRoleLabel(role: TargetPlanSubject["role"], lang: "zh" | "en"): string {
  const map: Record<TargetPlanSubject["role"], [string, string]> = {
    english: ["英语线 · 锁定", "English line · locked"],
    chinese: ["中文线 · 锁定", "Chinese line · locked"],
    math: ["数学线 · 锁定", "Mathematics line · locked"],
    required: ["官方先修", "Official prerequisite"],
    support: ["方向支撑", "Field support"],
    filler: ["提分补位", "Scaling filler"],
  };
  return lang === "zh" ? map[role][0] : map[role][1];
}

/** 准备事项类型的标签 */
export function preparationKindLabel(kind: PreparationItem["kind"], lang: "zh" | "en"): string {
  const map: Record<PreparationItem["kind"], [string, string]> = {
    official: ["官方要求", "Official requirement"],
    language: ["语言条件", "Language condition"],
    advantage: ["加分项", "Advantage, not required"],
  };
  return lang === "zh" ? map[kind][0] : map[kind][1];
}

/* ------------------------------------------------------------------ *
 * Cambridge A-Level 版本的单目标方案
 * ------------------------------------------------------------------ */

/** AS（Year 12）建议开局科目数 */
export const AS_SUBJECTS = 4;
/** A2（Year 13）计入 offer 的科目数 */
export const A2_SUBJECTS = 3;

export interface AlevelTargetPlanSubject {
  subject: AlevelSubjectKey;
  role: "required" | "recommended" | "support" | "filler";
  reasonZh: string;
  reasonEn: string;
}

export interface AlevelTargetPlan {
  university: University;
  programme: Programme;
  as: AlevelTargetPlanSubject[];
  a2: AlevelTargetPlanSubject[];
  dropped: AlevelTargetPlanSubject[];
  preparation: PreparationItem[];
  /**
   * 英语门槛。BCI 已确认的七门 Cambridge 课程中不含英语，
   * 中国学生的英语能力一律以雅思等标准化考试呈现，不占 AS / A2 的选课名额。
   */
  englishGate: {
    detailZh: string;
    detailEn: string;
    noteZh: string;
    noteEn: string;
  };
}

/** 各方向在 BCI 十门可选 A-Level 课程中的支撑科目 */
const ALEVEL_FIELD_SUPPORT: Record<FieldKey, AlevelSubjectKey[]> = {
  medicine: ["chemistry", "biology", "mathematics"],
  law: ["economics", "geography", "mathematics"],
  computing: ["mathematics", "computerScience", "furtherMathematics", "physics"],
  engineering: ["mathematics", "physics", "furtherMathematics"],
  business: ["mathematics", "economics", "accounting", "business"],
  science: ["mathematics", "chemistry", "physics", "geography"],
  design: ["mathematics", "physics", "geography"],
  creative: ["geography", "business", "computerScience", "economics"],
  arts: ["geography", "economics", "business"],
  education: ["mathematics", "biology", "geography", "economics"],
};

/** BCI 十门可选课程的通用优先序 */
const ALEVEL_FALLBACK: AlevelSubjectKey[] = [
  "mathematics",
  "physics",
  "chemistry",
  "economics",
  "biology",
  "computerScience",
  "business",
  "furtherMathematics",
  "accounting",
  "geography",
];

/**
 * 生成单个目标的 A-Level 方案。
 * requiredSubjects / recommendedSubjects 由调用方从 alevelReverseLookup 提供，
 * 以避免本模块与 A-Level 规则层产生循环依赖。
 */
export function buildAlevelTargetPlan(
  universityId: string,
  programmeId: string,
  requiredSubjects: AlevelSubjectKey[],
  recommendedSubjects: AlevelSubjectKey[],
): AlevelTargetPlan | null {
  const university = UNIVERSITIES.find((u) => u.id === universityId);
  const programme = university?.programmes.find((p) => p.id === programmeId);
  if (!university || !programme) return null;

  const picked: AlevelTargetPlanSubject[] = [];
  const taken = new Set<AlevelSubjectKey>();

  const add = (
    subject: AlevelSubjectKey,
    role: AlevelTargetPlanSubject["role"],
    reasonZh: string,
    reasonEn: string,
  ) => {
    if (taken.has(subject) || picked.length >= AS_SUBJECTS) return;
    // 进阶数学依赖数学，不得单独出现
    if (subject === "furtherMathematics" && !taken.has("mathematics")) return;
    picked.push({ subject, role, reasonZh, reasonEn });
    taken.add(subject);
  };

  for (const subject of requiredSubjects) {
    add(
      subject,
      "required",
      `${university.nameZh}${programme.nameZh}的官方先修科目，未修读将不具备申请资格。`,
      `An official prerequisite for ${programme.name} at ${university.name}; without it the application is not eligible.`,
    );
  }
  for (const subject of recommendedSubjects) {
    add(
      subject,
      "recommended",
      "院校在官方页面中将其列为建议或偏好科目，能显著提升学术契合度。",
      "Listed by the university as a recommended or preferred subject; it materially strengthens academic fit.",
    );
  }
  for (const subject of ALEVEL_FIELD_SUPPORT[programme.field] ?? []) {
    add(
      subject,
      "support",
      "该方向的常见支撑科目，虽非硬性先修，但有助于衔接大一课程。",
      "A common supporting subject for this field; not a hard prerequisite, but it eases the transition into first-year study.",
    );
  }
  for (const subject of ALEVEL_FALLBACK) {
    add(
      subject,
      "filler",
      "用于补足三至四门的组合，可依学生强项替换。",
      "Completes the three-to-four subject combination and may be swapped for a personal strength.",
    );
  }
  // 进阶数学依赖可能导致名额未满，此处兜底
  for (const subject of ALEVEL_FALLBACK) {
    if (picked.length >= AS_SUBJECTS) break;
    if (taken.has(subject)) continue;
    picked.push({
      subject,
      role: "filler",
      reasonZh: "用于补足三至四门的组合，可依学生强项替换。",
      reasonEn: "Completes the three-to-four subject combination and may be swapped for a personal strength.",
    });
    taken.add(subject);
  }

  const priority: Record<AlevelTargetPlanSubject["role"], number> = {
    required: 0,
    recommended: 1,
    support: 2,
    filler: 3,
  };
  const as = picked.slice(0, AS_SUBJECTS);
  const ordered = as.slice().sort((a, b) => priority[a.role] - priority[b.role]);
  const a2 = ordered.slice(0, A2_SUBJECTS);
  const dropped = ordered.slice(A2_SUBJECTS);

  return {
    university,
    programme,
    as,
    a2,
    dropped,
    preparation: buildPreparation(university, programme),
    englishGate: {
      detailZh: university.english,
      detailEn: university.englishEn,
      noteZh:
        "BCI 已确认的七门 Cambridge 课程中不含英语科目，因此英语能力以雅思等标准化考试单独呈交，不占用 AS / A2 的选课名额。该项属录取硬性条件，等级达标而雅思未达标同样无法换取录取。",
      noteEn:
        "None of BCI's seven confirmed Cambridge subjects is an English course, so English proficiency is evidenced separately through IELTS or an equivalent test and does not occupy an AS or A2 subject slot. It is a hard admission condition: meeting the grade profile without meeting the English requirement still fails to convert an offer.",
    },
  };
}

/** A-Level 方案中科目角色的标签 */
export function alevelTargetRoleLabel(
  role: AlevelTargetPlanSubject["role"],
  lang: "zh" | "en",
): string {
  const map: Record<AlevelTargetPlanSubject["role"], [string, string]> = {
    required: ["官方先修", "Official prerequisite"],
    recommended: ["院校建议", "University recommended"],
    support: ["方向支撑", "Field support"],
    filler: ["组合补位", "Combination filler"],
  };
  return lang === "zh" ? map[role][0] : map[role][1];
}
