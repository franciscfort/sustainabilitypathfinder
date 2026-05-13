import { careerPaths, CareerPath, skillLabels } from "@/data/careerPaths";

export type Gender = "female" | "male" | "non-binary" | "prefer-not-to-say";

export interface AssessmentAnswers {
  gender?: Gender;
  personality: Record<string, number>;
  passions: string[];
  skills: string[];
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

export interface AssessmentResult {
  topCareers: CareerMatch[];
  recommendedSkills: SkillRecommendation[];
}

export function calculateCareerMatches(answers: AssessmentAnswers): AssessmentResult {
  const careerScores: CareerMatch[] = careerPaths.map((career) => {
    let score = 0;
    const matchReasons: string[] = [];

    // Score personality traits (weight: 30%)
    const personalityScore = career.personalityTraits.reduce((acc, trait) => {
      const traitScore = answers.personality[trait] || 0;
      return acc + traitScore;
    }, 0);
    const maxPersonalityScore = career.personalityTraits.length * 5;
    const normalizedPersonalityScore = maxPersonalityScore > 0 
      ? (personalityScore / maxPersonalityScore) * 30 
      : 0;
    score += normalizedPersonalityScore;
    
    if (normalizedPersonalityScore > 20) {
      matchReasons.push("Your work style preferences align well with this role");
    }

    // Score passion areas (weight: 40%)
    const matchingPassions = career.passionAreas.filter((passion) =>
      answers.passions.includes(passion)
    );
    const passionScore = (matchingPassions.length / career.passionAreas.length) * 40;
    score += passionScore;
    
    if (matchingPassions.length > 0) {
      matchReasons.push("Your sustainability interests match this career focus");
    }

    // Score existing skills (weight: 30%)
    const matchingSkills = career.requiredSkills.filter((skill) =>
      answers.skills.includes(skill)
    );
    const skillScore = (matchingSkills.length / career.requiredSkills.length) * 30;
    score += skillScore;
    
    if (matchingSkills.length >= 2) {
      matchReasons.push("You already have key skills for this path");
    } else if (matchingSkills.length === 1) {
      matchReasons.push("You have foundational skills to build upon");
    }

    return {
      career,
      score,
      matchReasons,
    };
  });

  // Sort by score and get top 3
  careerScores.sort((a, b) => b.score - a.score);
  const topCareers = careerScores.slice(0, 3);

  // Generate skill recommendations
  const recommendedSkills = generateSkillRecommendations(answers, topCareers);

  return {
    topCareers,
    recommendedSkills,
  };
}

function generateSkillRecommendations(
  answers: AssessmentAnswers,
  topCareers: CareerMatch[]
): SkillRecommendation[] {
  const existingSkills = new Set(answers.skills);
  const skillScores: Map<string, { score: number; reasons: string[] }> = new Map();

  // Analyze high-demand skills from top careers
  topCareers.forEach((match, index) => {
    const weight = index === 0 ? 2 : 1; // Primary career has higher weight
    
    match.career.highDemandSkills.forEach((skill, skillIndex) => {
      if (!existingSkills.has(skill)) {
        const current = skillScores.get(skill) || { score: 0, reasons: [] };
        const priorityBonus = (4 - skillIndex) * weight; // Earlier in list = higher priority
        current.score += priorityBonus + (10 * weight);
        current.reasons.push(match.career.title);
        skillScores.set(skill, current);
      }
    });
  });

  // Add adjacency bonus for skills related to existing skills
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
        const current = skillScores.get(adjSkill)!;
        current.score += 5; // Adjacency bonus
      }
    });
  });

  // Convert to recommendations
  const recommendations: SkillRecommendation[] = Array.from(skillScores.entries())
    .map(([skill, data]) => ({
      skill,
      skillLabel: skillLabels[skill] || skill,
      reason: generateSkillReason(skill, data.reasons, answers.skills),
      priority: data.score,
    }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3);

  return recommendations;
}

function generateSkillReason(
  skill: string,
  careerTitles: string[],
  existingSkills: string[]
): string {
  const careerList = careerTitles.slice(0, 2).join(" and ");
  
  const reasonTemplates: Record<string, (careers: string, skills: string[]) => string> = {
    research: (careers) => 
      `Essential for evidence-based work in ${careers}. Builds on analytical foundations.`,
    "data-analysis": (careers, skills) => 
      skills.includes("research") 
        ? `A natural next step from your research skills, highly valued in ${careers}.`
        : `High-demand skill for ${careers}. Learnable in 3-6 months with online courses.`,
    "project-management": (careers) => 
      `Critical for career advancement in ${careers}. Universally valued across sustainability.`,
    communications: (careers) => 
      `Amplifies impact in ${careers}. Essential for stakeholder engagement and advocacy.`,
    "social-media": (careers, skills) => 
      skills.includes("communications")
        ? `Complements your communications skills perfectly for ${careers}.`
        : `Digital engagement is increasingly vital for ${careers}.`,
    finance: (careers) => 
      `Growing demand in ${careers} as sustainability meets investment decisions.`,
    design: (careers, skills) => 
      skills.includes("communications")
        ? `Enhances your storytelling with visual impact for ${careers}.`
        : `Visual communication skills are increasingly valued in ${careers}.`,
    technical: (careers) => 
      `Tech skills unlock opportunities in ${careers}. Python or data tools recommended.`,
    "supply-chain": (careers) => 
      `Supply chain expertise is critical for ${careers} as Scope 3 reporting grows.`,
  };

  const template = reasonTemplates[skill];
  return template 
    ? template(careerList, existingSkills)
    : `Valuable skill for career growth in ${careerList}.`;
}
