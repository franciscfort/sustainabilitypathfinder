import { careerPaths, CareerPath, skillLabels } from "@/data/careerPaths";

export type Gender = "female" | "male" | "non-binary" | "prefer-not-to-say";

export type CareerStage =
  | "student"
  | "recent-graduate"
  | "early-career"
  | "mid-career"
  | "senior"
  | "career-switcher"
  | "entrepreneur"
  | "ngo-development";

export type ExperienceLevel =
  | "beginner"
  | "basic-awareness"
  | "intermediate"
  | "advanced"
  | "expert";

export type CurrentGoal =
  | "break-in"
  | "identify-path"
  | "develop-skills"
  | "transition"
  | "advance"
  | "consultant"
  | "build-business"
  | "find-jobs"
  | "strengthen-esg"
  | "carbon-climate-finance";

export const careerStageLabels: Record<CareerStage, string> = {
  student: "Student / Undergraduate",
  "recent-graduate": "Recent Graduate",
  "early-career": "Early-Career Professional (0–3 years)",
  "mid-career": "Mid-Career Professional (4–10 years)",
  senior: "Senior Professional (10+ years)",
  "career-switcher": "Career Switcher",
  entrepreneur: "Entrepreneur / Founder",
  "ngo-development": "NGO / Development Professional",
};

export const experienceLevelLabels: Record<ExperienceLevel, string> = {
  beginner: "Beginner (Just starting)",
  "basic-awareness": "Basic Awareness",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

export const currentGoalLabels: Record<CurrentGoal, string> = {
  "break-in": "Break into the sustainability sector",
  "identify-path": "Identify the best sustainability career path for me",
  "develop-skills": "Develop in-demand sustainability skills",
  transition: "Transition from another industry into sustainability",
  advance: "Advance in my current sustainability role",
  consultant: "Become a sustainability consultant",
  "build-business": "Build a sustainability-focused business",
  "find-jobs": "Find sustainability job opportunities",
  "strengthen-esg": "Strengthen my ESG expertise",
  "carbon-climate-finance": "Learn about carbon markets and climate finance",
};

export interface AssessmentAnswers {
  gender?: Gender;
  personality: Record<string, number>;
  passions: string[];
  skills: string[];
  careerStage?: CareerStage;
  experienceLevel?: ExperienceLevel;
  currentGoal?: CurrentGoal;
}

export interface CareerMatch {
  career: CareerPath;
  score: number;
  matchReasons: string[];
}

export interface SkillRecommendation {
  skill: string;
  skillLabel: string;
  reason: string;
  priority: number;
}

export interface LearningRoadmapStep {
  phase: string;
  focus: string;
  detail: string;
}

export interface AssessmentResult {
  topCareers: CareerMatch[];
  recommendedSkills: SkillRecommendation[];
  recommendedLevel: string;
  suggestedNextAction: string;
  learningRoadmap: LearningRoadmapStep[];
}

// --- Goal / stage affinities used to boost relevant careers ---
const goalCareerAffinity: Record<CurrentGoal, string[]> = {
  "break-in": [],
  "identify-path": [],
  "develop-skills": [],
  transition: [],
  advance: [],
  consultant: ["environmental-consulting", "esg-reporting", "climate-policy"],
  "build-business": ["circular-economy", "renewable-energy", "sustainable-fashion", "sustainability-data"],
  "find-jobs": [],
  "strengthen-esg": ["esg-reporting", "sustainable-supply-chain", "environmental-consulting"],
  "carbon-climate-finance": ["carbon-markets", "esg-reporting"],
};

const stageCareerAffinity: Partial<Record<CareerStage, string[]>> = {
  entrepreneur: ["circular-economy", "renewable-energy", "sustainable-fashion", "sustainability-data"],
  "ngo-development": ["community-sustainability", "climate-policy", "biodiversity-conservation", "climate-communications"],
  senior: ["environmental-consulting", "esg-reporting", "climate-policy"],
  "mid-career": ["esg-reporting", "environmental-consulting", "carbon-markets"],
};

const experienceLevelScore: Record<ExperienceLevel, number> = {
  beginner: 1,
  "basic-awareness": 2,
  intermediate: 3,
  advanced: 4,
  expert: 5,
};

export function calculateCareerMatches(answers: AssessmentAnswers): AssessmentResult {
  const stageAffinity = answers.careerStage ? stageCareerAffinity[answers.careerStage] ?? [] : [];
  const goalAffinity = answers.currentGoal ? goalCareerAffinity[answers.currentGoal] ?? [] : [];

  const careerScores: CareerMatch[] = careerPaths.map((career) => {
    let score = 0;
    const matchReasons: string[] = [];

    // Personality (25%)
    const personalityRaw = career.personalityTraits.reduce(
      (acc, trait) => acc + (answers.personality[trait] || 0),
      0
    );
    const maxPersonality = career.personalityTraits.length * 5;
    const personalityScore = maxPersonality > 0 ? (personalityRaw / maxPersonality) * 25 : 0;
    score += personalityScore;
    if (personalityScore > 17) {
      matchReasons.push("Your work style aligns well with this role");
    }

    // Passions (25%)
    const matchingPassions = career.passionAreas.filter((p) => answers.passions.includes(p));
    const passionScore = (matchingPassions.length / career.passionAreas.length) * 25;
    score += passionScore;
    if (matchingPassions.length > 0) {
      matchReasons.push("Your sustainability interests match this career focus");
    }

    // Existing skills (20%)
    const matchingSkills = career.requiredSkills.filter((s) => answers.skills.includes(s));
    const skillScore = (matchingSkills.length / career.requiredSkills.length) * 20;
    score += skillScore;
    if (matchingSkills.length >= 2) {
      matchReasons.push("You already have key skills for this path");
    } else if (matchingSkills.length === 1) {
      matchReasons.push("You have foundational skills to build upon");
    }

    // Career stage (10%) — affinity boost
    if (answers.careerStage) {
      const stageScore = stageAffinity.includes(career.id) ? 10 : 4;
      score += stageScore;
      if (stageScore === 10) {
        matchReasons.push(`A natural fit for your stage as a ${careerStageLabels[answers.careerStage].toLowerCase()}`);
      }
    }

    // Experience level (10%) — neutral baseline; reward depth-fit
    if (answers.experienceLevel) {
      const level = experienceLevelScore[answers.experienceLevel];
      // map level (1-5) to 0-10
      const expScore = (level / 5) * 10;
      score += expScore * 0.5 + 5; // baseline 5 + scaled
    }

    // Current goal (10%) — affinity boost
    if (answers.currentGoal) {
      const goalScore = goalAffinity.includes(career.id) ? 10 : 4;
      score += goalScore;
      if (goalScore === 10) {
        matchReasons.push(`Strongly supports your goal: ${currentGoalLabels[answers.currentGoal].toLowerCase()}`);
      }
    }

    return { career, score, matchReasons };
  });

  careerScores.sort((a, b) => b.score - a.score);
  const topCareers = careerScores.slice(0, 3);

  const recommendedSkills = generateSkillRecommendations(answers, topCareers);
  const recommendedLevel = computeRecommendedLevel(answers);
  const suggestedNextAction = computeSuggestedNextAction(answers, topCareers);
  const learningRoadmap = computeLearningRoadmap(answers, topCareers, recommendedSkills);

  return {
    topCareers,
    recommendedSkills,
    recommendedLevel,
    suggestedNextAction,
    learningRoadmap,
  };
}

function computeRecommendedLevel(answers: AssessmentAnswers): string {
  const stage = answers.careerStage;
  const exp = answers.experienceLevel;
  if (stage === "student" || stage === "recent-graduate" || exp === "beginner" || exp === "basic-awareness") {
    return "Entry-level / Junior roles";
  }
  if (stage === "early-career" || exp === "intermediate") {
    return "Associate / Specialist roles";
  }
  if (stage === "career-switcher") {
    return "Transition-friendly Associate roles leveraging transferable skills";
  }
  if (stage === "mid-career" || exp === "advanced") {
    return "Senior Specialist / Manager roles";
  }
  if (stage === "senior" || exp === "expert") {
    return "Leadership / Director / Head of Sustainability";
  }
  if (stage === "entrepreneur") {
    return "Founder / Independent consultant track";
  }
  if (stage === "ngo-development") {
    return "Program / Project Manager in NGO and development settings";
  }
  return "Associate / Specialist roles";
}

function computeSuggestedNextAction(
  answers: AssessmentAnswers,
  topCareers: CareerMatch[]
): string {
  const top = topCareers[0]?.career.title ?? "your best-fit path";
  switch (answers.currentGoal) {
    case "break-in":
      return `Apply for entry-level or internship roles in ${top} and complete one foundational online certification.`;
    case "identify-path":
      return `Conduct 3 informational interviews with professionals in ${top} this month.`;
    case "develop-skills":
      return `Enroll in a short course on your top recommended skill within the next 2 weeks.`;
    case "transition":
      return `Build a transition portfolio that reframes your existing experience for ${top}.`;
    case "advance":
      return `Lead one visible sustainability project at work and pursue an advanced certification in ${top}.`;
    case "consultant":
      return `Package one offer for ${top} and pitch it to three potential clients this month.`;
    case "build-business":
      return `Draft a one-page business model for a ${top}-aligned venture and validate it with 5 potential users.`;
    case "find-jobs":
      return `Apply to 5 ${top} roles per week and tailor your CV to highlight matching skills.`;
    case "strengthen-esg":
      return `Begin a structured ESG reporting course (GRI, ISSB, or CSRD) within the next 30 days.`;
    case "carbon-climate-finance":
      return `Study the voluntary and compliance carbon markets and complete a climate finance fundamentals course.`;
    default:
      return `Take one concrete step toward ${top} this week — a course, a conversation, or an application.`;
  }
}

function computeLearningRoadmap(
  answers: AssessmentAnswers,
  topCareers: CareerMatch[],
  skills: SkillRecommendation[]
): LearningRoadmapStep[] {
  const top = topCareers[0]?.career.title ?? "your path";
  const skill1 = skills[0]?.skillLabel ?? "a foundational skill";
  const skill2 = skills[1]?.skillLabel ?? "a complementary skill";
  const exp = answers.experienceLevel;

  const isBeginner = exp === "beginner" || exp === "basic-awareness" || answers.careerStage === "student";
  const isAdvanced = exp === "advanced" || exp === "expert" || answers.careerStage === "senior";

  if (isBeginner) {
    return [
      { phase: "Month 1–2", focus: "Foundations", detail: `Complete an intro course on sustainability and start learning ${skill1}.` },
      { phase: "Month 3–4", focus: "Practical exposure", detail: `Volunteer or intern on a project aligned with ${top}.` },
      { phase: "Month 5–6", focus: "Specialization", detail: `Begin building ${skill2} and publish one written piece on your learnings.` },
    ];
  }

  if (isAdvanced) {
    return [
      { phase: "Month 1–2", focus: "Strategic positioning", detail: `Refine your narrative around ${top} and engage thought leadership channels.` },
      { phase: "Month 3–4", focus: "Specialized depth", detail: `Pursue an advanced certification or peer-reviewed course in ${skill1}.` },
      { phase: "Month 5–6", focus: "Influence", detail: `Lead or advise on a high-visibility ${top} initiative and mentor someone earlier in their journey.` },
    ];
  }

  return [
    { phase: "Month 1–2", focus: "Skill building", detail: `Take a project-based course in ${skill1}.` },
    { phase: "Month 3–4", focus: "Application", detail: `Apply the skill on a real ${top} project — at work, freelance, or a side initiative.` },
    { phase: "Month 5–6", focus: "Growth", detail: `Add ${skill2}, expand your network, and target a stretch role in ${top}.` },
  ];
}

function generateSkillRecommendations(
  answers: AssessmentAnswers,
  topCareers: CareerMatch[]
): SkillRecommendation[] {
  const existingSkills = new Set(answers.skills);
  const skillScores: Map<string, { score: number; reasons: string[] }> = new Map();

  topCareers.forEach((match, index) => {
    const weight = index === 0 ? 2 : 1;
    match.career.highDemandSkills.forEach((skill, skillIndex) => {
      if (!existingSkills.has(skill)) {
        const current = skillScores.get(skill) || { score: 0, reasons: [] };
        const priorityBonus = (4 - skillIndex) * weight;
        current.score += priorityBonus + 10 * weight;
        current.reasons.push(match.career.title);
        skillScores.set(skill, current);
      }
    });
  });

  const adjacencyMap: Record<string, string[]> = {
    research: ["data-analysis", "communications"],
    "data-analysis": ["technical", "finance", "research", "supply-chain"],
    "project-management": ["communications", "technical", "supply-chain"],
    communications: ["social-media", "design", "research"],
    "social-media": ["communications", "design"],
    finance: ["data-analysis", "project-management", "supply-chain"],
    design: ["social-media", "technical", "communications"],
    technical: ["data-analysis", "design"],
    "supply-chain": ["project-management", "data-analysis", "finance"],
  };

  existingSkills.forEach((skill) => {
    const adjacent = adjacencyMap[skill] || [];
    adjacent.forEach((adjSkill) => {
      if (!existingSkills.has(adjSkill) && skillScores.has(adjSkill)) {
        skillScores.get(adjSkill)!.score += 5;
      }
    });
  });

  return Array.from(skillScores.entries())
    .map(([skill, data]) => ({
      skill,
      skillLabel: skillLabels[skill] || skill,
      reason: generateSkillReason(skill, data.reasons, answers),
      priority: data.score,
    }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3);
}

function generateSkillReason(
  skill: string,
  careerTitles: string[],
  answers: AssessmentAnswers
): string {
  const careerList = careerTitles.slice(0, 2).join(" and ");
  const existing = answers.skills;
  const exp = answers.experienceLevel;
  const depthPrefix =
    exp === "beginner" || exp === "basic-awareness"
      ? "Foundational for "
      : exp === "advanced" || exp === "expert"
      ? "Deepens your impact in "
      : "Highly valued in ";

  const templates: Record<string, () => string> = {
    research: () => `${depthPrefix}${careerList}. Builds on analytical foundations.`,
    "data-analysis": () =>
      existing.includes("research")
        ? `A natural next step from your research skills, highly valued in ${careerList}.`
        : `${depthPrefix}${careerList}. Learnable in 3–6 months with online courses.`,
    "project-management": () => `Critical for advancement in ${careerList}. Universally valued.`,
    communications: () => `Amplifies impact in ${careerList}. Essential for engagement and advocacy.`,
    "social-media": () =>
      existing.includes("communications")
        ? `Complements your communications skills perfectly for ${careerList}.`
        : `Digital engagement is increasingly vital for ${careerList}.`,
    finance: () => `Growing demand in ${careerList} as sustainability meets investment decisions.`,
    design: () =>
      existing.includes("communications")
        ? `Enhances your storytelling with visual impact for ${careerList}.`
        : `Visual communication skills are increasingly valued in ${careerList}.`,
    technical: () => `Tech skills unlock opportunities in ${careerList}. Python or data tools recommended.`,
    "supply-chain": () => `Supply chain expertise is critical for ${careerList} as Scope 3 reporting grows.`,
  };

  return templates[skill] ? templates[skill]() : `Valuable skill for growth in ${careerList}.`;
}
