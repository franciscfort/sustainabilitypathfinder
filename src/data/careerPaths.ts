export interface CareerPath {
  id: string;
  title: string;
  description: string;
  typicalRoles: string[];
  requiredSkills: string[];
  highDemandSkills: string[];
  personalityTraits: string[];
  passionAreas: string[];
  icon: string;
}

export const careerPaths: CareerPath[] = [
  {
    id: "esg-reporting",
    title: "ESG & Sustainability Reporting",
    description: "Drive corporate sustainability through data collection, ESG disclosure frameworks, and sustainability strategy development. Help organizations measure, report, and improve their environmental and social impact.",
    typicalRoles: [
      "Sustainability Analyst",
      "ESG Reporting Specialist",
      "Corporate Sustainability Manager",
      "CSR Coordinator",
    ],
    requiredSkills: ["research", "data-analysis", "project-management", "communications"],
    highDemandSkills: ["data-analysis", "project-management", "research", "finance"],
    personalityTraits: ["data-analysis", "structured-work"],
    passionAreas: ["esg-corporate", "data-tech"],
    icon: "📊",
  },
  {
    id: "climate-policy",
    title: "Climate Policy & Governance",
    description: "Shape climate action through policy development, regulatory frameworks, and government engagement. Work at the intersection of science, policy, and implementation to drive systemic change.",
    typicalRoles: [
      "Climate Policy Analyst",
      "Government Affairs Specialist",
      "Sustainability Policy Advisor",
      "Regulatory Affairs Manager",
    ],
    requiredSkills: ["research", "communications", "project-management"],
    highDemandSkills: ["research", "communications", "project-management", "data-analysis"],
    personalityTraits: ["advocacy", "collaboration", "data-analysis"],
    passionAreas: ["climate-policy", "esg-corporate"],
    icon: "🏛️",
  },
  {
    id: "climate-communications",
    title: "Climate Communications & Advocacy",
    description: "Amplify climate action through compelling storytelling, campaign development, and stakeholder engagement. Bridge the gap between complex climate science and public understanding.",
    typicalRoles: [
      "Climate Communications Specialist",
      "Sustainability Content Manager",
      "Climate Campaign Manager",
      "Environmental Advocate",
    ],
    requiredSkills: ["communications", "social-media", "research"],
    highDemandSkills: ["communications", "social-media", "design", "project-management"],
    personalityTraits: ["creative-storytelling", "advocacy", "collaboration"],
    passionAreas: ["climate-comms", "climate-policy"],
    icon: "📢",
  },
  {
    id: "carbon-markets",
    title: "Carbon Markets & Climate Finance",
    description: "Navigate the growing carbon economy through trading, project development, and investment analysis. Enable capital flows toward climate solutions and emissions reduction.",
    typicalRoles: [
      "Carbon Market Analyst",
      "Climate Finance Associate",
      "Carbon Project Developer",
      "Sustainable Investment Analyst",
    ],
    requiredSkills: ["finance", "data-analysis", "research", "project-management"],
    highDemandSkills: ["finance", "data-analysis", "project-management", "technical"],
    personalityTraits: ["data-analysis", "structured-work"],
    passionAreas: ["carbon-finance", "esg-corporate"],
    icon: "💹",
  },
  {
    id: "renewable-energy",
    title: "Renewable Energy & Clean Tech",
    description: "Accelerate the energy transition through renewable project development, clean technology innovation, and energy efficiency solutions. Build the infrastructure for a decarbonized future.",
    typicalRoles: [
      "Renewable Energy Analyst",
      "Clean Tech Project Manager",
      "Energy Efficiency Consultant",
      "Sustainability Engineer",
    ],
    requiredSkills: ["technical", "project-management", "data-analysis"],
    highDemandSkills: ["technical", "project-management", "data-analysis", "finance"],
    personalityTraits: ["structured-work", "data-analysis"],
    passionAreas: ["renewable-energy", "data-tech"],
    icon: "⚡",
  },
  {
    id: "sustainability-data",
    title: "Sustainability Data & Analytics",
    description: "Leverage data science and technology to measure, analyze, and optimize sustainability outcomes. Build tools and systems that enable evidence-based environmental decision-making.",
    typicalRoles: [
      "Sustainability Data Analyst",
      "Climate Tech Product Manager",
      "Environmental Data Scientist",
      "GHG Accounting Specialist",
    ],
    requiredSkills: ["data-analysis", "technical", "research"],
    highDemandSkills: ["technical", "data-analysis", "design", "project-management"],
    personalityTraits: ["data-analysis", "structured-work"],
    passionAreas: ["data-tech", "esg-corporate"],
    icon: "🔬",
  },
  {
    id: "community-sustainability",
    title: "Community & Development Sustainability",
    description: "Drive sustainability at the grassroots level through community engagement, sustainable agriculture, and local development initiatives. Connect environmental solutions with social equity.",
    typicalRoles: [
      "Community Sustainability Coordinator",
      "Sustainable Agriculture Specialist",
      "Environmental Outreach Manager",
      "Development Program Officer",
    ],
    requiredSkills: ["communications", "project-management", "social-media"],
    highDemandSkills: ["project-management", "communications", "social-media", "research"],
    personalityTraits: ["collaboration", "advocacy", "creative-storytelling"],
    passionAreas: ["nature-agriculture", "climate-comms"],
    icon: "🌱",
  },
];

export const skillLabels: Record<string, string> = {
  research: "Research & Report Writing",
  "data-analysis": "Data Analysis (Excel, Power BI, etc.)",
  "project-management": "Project Management",
  communications: "Communications & Storytelling",
  "social-media": "Social Media & Community Building",
  finance: "Finance / Economics",
  design: "Design / No-Code Tools",
  technical: "Software / Technical Skills",
};

export const passionLabels: Record<string, string> = {
  "climate-policy": "Climate Policy & Governance",
  "esg-corporate": "ESG & Corporate Sustainability",
  "renewable-energy": "Renewable Energy & Clean Tech",
  "carbon-finance": "Carbon Markets & Climate Finance",
  "climate-comms": "Climate Communications & Advocacy",
  "nature-agriculture": "Nature, Agriculture & Food Systems",
  "data-tech": "Data, Technology & Innovation for Climate",
};

export const personalityLabels: Record<string, string> = {
  "data-analysis": "I enjoy working with data and analysis",
  "creative-storytelling": "I prefer creative storytelling and communication",
  advocacy: "I like influencing people and advocating for change",
  "structured-work": "I prefer structured, technical work",
  collaboration: "I enjoy collaboration and community engagement",
};
