// Platform content for Sustainability Pathfinder 2.0 — career paths, skills, certifications, resources.
// IDs/slugs for careers match existing careerPaths IDs so assessment results deep-link cleanly.

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type DemandLevel = "high" | "very-high" | "growing";

export interface Certification {
  id: string;
  name: string;
  provider: string;
  level: Difficulty;
  cost: "free" | "paid" | "freemium";
  costNote?: string;
  timeCommitment: string;
  description: string;
  careerPaths: string[]; // career slugs
  url?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: "course" | "article" | "guide" | "book" | "podcast" | "community" | "fellowship";
  provider: string;
  description: string;
  careerPaths: string[];
  url?: string;
  cost?: "free" | "paid" | "freemium";
}

export interface Skill {
  slug: string;
  name: string;
  category: SkillCategory;
  kind: "soft" | "technical";
  whatItIs: string;
  whyItMatters: string;
  careerPaths: string[];
  beginnerResources: string[]; // resource ids
}

export type SkillCategory =
  | "esg-reporting"
  | "climate-finance"
  | "carbon-markets"
  | "renewable-energy"
  | "data-analytics"
  | "policy-governance"
  | "communications"
  | "supply-chain"
  | "circular-economy"
  | "biodiversity"
  | "agriculture"
  | "impact-measurement";

export const skillCategoryLabels: Record<SkillCategory, string> = {
  "esg-reporting": "ESG & Reporting",
  "climate-finance": "Climate Finance",
  "carbon-markets": "Carbon Markets",
  "renewable-energy": "Renewable Energy",
  "data-analytics": "Data & Analytics",
  "policy-governance": "Policy & Governance",
  communications: "Climate Communications",
  "supply-chain": "Supply Chains",
  "circular-economy": "Circular Economy",
  biodiversity: "Biodiversity",
  agriculture: "Sustainable Agriculture",
  "impact-measurement": "Impact Measurement",
};

export interface CareerPathV2 {
  slug: string;
  name: string;
  icon: string;
  tagline: string;
  overview: {
    what: string;
    why: string;
    demand: DemandLevel;
    growth: string;
  };
  jobTitles: { entry: string[]; mid: string[]; senior: string[] };
  skills: {
    beginner: { soft: string[]; technical: string[] };
    intermediate: { soft: string[]; technical: string[] };
    advanced: { soft: string[]; technical: string[] };
  };
  tools: string[];
  certifications: { beginner: string[]; intermediate: string[]; advanced: string[] }; // certification ids
  projects: { title: string; description: string }[];
  roadmap: {
    days1to30: string[];
    days31to60: string[];
    days61to90: string[];
  };
  related: string[]; // slugs
}

// --- Certifications (seeded credible starter set) -----------------------------
export const certifications: Certification[] = [
  { id: "gri-cert", name: "GRI Sustainability Reporting Standards", provider: "Global Reporting Initiative", level: "intermediate", cost: "paid", costNote: "~$700", timeCommitment: "30-40 hours", description: "Industry-standard ESG and sustainability reporting framework certification.", careerPaths: ["esg-reporting", "environmental-consulting"] },
  { id: "sasb-fsa", name: "FSA Credential", provider: "IFRS / SASB", level: "advanced", cost: "paid", costNote: "~$1,500", timeCommitment: "100+ hours", description: "Fundamentals of Sustainability Accounting for investors and ESG analysts.", careerPaths: ["esg-reporting", "carbon-markets"] },
  { id: "tcfd-foundation", name: "TCFD Foundation Course", provider: "CFA Institute", level: "intermediate", cost: "freemium", timeCommitment: "10-15 hours", description: "Task Force on Climate-related Financial Disclosures essentials.", careerPaths: ["esg-reporting", "carbon-markets"] },
  { id: "ghg-protocol", name: "GHG Protocol Corporate Standard", provider: "WRI / WBCSD", level: "beginner", cost: "free", timeCommitment: "6-10 hours", description: "Foundational standard for measuring corporate Scope 1, 2 and 3 emissions.", careerPaths: ["esg-reporting", "sustainable-supply-chain", "sustainability-data"] },
  { id: "cdp-disclosure", name: "CDP Disclosure Training", provider: "CDP", level: "beginner", cost: "free", timeCommitment: "4-6 hours", description: "Learn to complete corporate climate disclosure questionnaires.", careerPaths: ["esg-reporting"] },
  { id: "leed-ga", name: "LEED Green Associate", provider: "USGBC", level: "beginner", cost: "paid", costNote: "~$250", timeCommitment: "40 hours", description: "Foundational green building credential, widely recognized.", careerPaths: ["green-building"] },
  { id: "leed-ap", name: "LEED AP BD+C", provider: "USGBC", level: "advanced", cost: "paid", costNote: "~$350", timeCommitment: "80+ hours", description: "Advanced green building design and construction credential.", careerPaths: ["green-building"] },
  { id: "well-ap", name: "WELL AP", provider: "IWBI", level: "intermediate", cost: "paid", costNote: "~$300", timeCommitment: "60 hours", description: "Health and wellness in the built environment.", careerPaths: ["green-building"] },
  { id: "chmm", name: "ISSP Sustainability Associate (ISSP-SA)", provider: "ISSP", level: "intermediate", cost: "paid", costNote: "~$300", timeCommitment: "40 hours", description: "Broad sustainability practitioner credential.", careerPaths: ["esg-reporting", "environmental-consulting", "climate-policy"] },
  { id: "issp-csp", name: "ISSP Certified Sustainability Professional", provider: "ISSP", level: "advanced", cost: "paid", costNote: "~$500", timeCommitment: "100+ hours", description: "Senior practitioner certification for sustainability leaders.", careerPaths: ["esg-reporting", "environmental-consulting"] },
  { id: "carbon-literacy", name: "Carbon Literacy Project", provider: "Carbon Literacy Trust", level: "beginner", cost: "freemium", timeCommitment: "8 hours", description: "Foundational climate science and action literacy.", careerPaths: ["climate-communications", "climate-policy", "climate-education"] },
  { id: "vcmi-claims", name: "VCMI Claims Code Training", provider: "VCMI", level: "advanced", cost: "free", timeCommitment: "10 hours", description: "Voluntary carbon market claims standards and integrity.", careerPaths: ["carbon-markets"] },
  { id: "icroa-fund", name: "ICROA Carbon Markets Fundamentals", provider: "ICROA", level: "intermediate", cost: "paid", costNote: "~$400", timeCommitment: "25 hours", description: "Voluntary carbon markets, project types, and standards.", careerPaths: ["carbon-markets"] },
  { id: "cfa-esg", name: "CFA ESG Certificate", provider: "CFA Institute", level: "intermediate", cost: "paid", costNote: "~$700", timeCommitment: "130 hours", description: "ESG investing integration for finance professionals.", careerPaths: ["carbon-markets", "esg-reporting"] },
  { id: "nebim", name: "PRI Academy: ESG Investing Foundations", provider: "PRI", level: "beginner", cost: "paid", costNote: "~$500", timeCommitment: "10 hours", description: "Principles of responsible investment for new ESG investors.", careerPaths: ["carbon-markets", "esg-reporting"] },
  { id: "google-da", name: "Google Data Analytics Certificate", provider: "Coursera / Google", level: "beginner", cost: "paid", costNote: "~$49/mo", timeCommitment: "6 months", description: "Foundational data analysis with spreadsheets, SQL, R, and Tableau.", careerPaths: ["sustainability-data", "esg-reporting", "carbon-markets"] },
  { id: "powerbi-mc", name: "Microsoft PL-300: Power BI Data Analyst", provider: "Microsoft", level: "intermediate", cost: "paid", costNote: "~$165 exam", timeCommitment: "40-60 hours", description: "Industry-standard BI tool certification.", careerPaths: ["sustainability-data", "esg-reporting"] },
  { id: "gis-esri", name: "Esri GIS Fundamentals", provider: "Esri", level: "beginner", cost: "freemium", timeCommitment: "20 hours", description: "Spatial analysis basics widely used in conservation and planning.", careerPaths: ["biodiversity-conservation", "green-building", "water-ocean"] },
  { id: "renewable-100", name: "Renewable Energy 100 (edX)", provider: "edX / TU Delft", level: "beginner", cost: "freemium", timeCommitment: "30 hours", description: "Fundamentals of solar, wind, and energy systems.", careerPaths: ["renewable-energy"] },
  { id: "circular-elen", name: "Circular Economy in Cities", provider: "Ellen MacArthur Foundation", level: "beginner", cost: "free", timeCommitment: "15 hours", description: "Principles and applications of circular economy.", careerPaths: ["circular-economy", "sustainable-supply-chain"] },
  { id: "cipsx", name: "CIPS Sustainable Procurement", provider: "CIPS", level: "intermediate", cost: "paid", costNote: "~$600", timeCommitment: "40 hours", description: "Sustainable procurement and supply chain practices.", careerPaths: ["sustainable-supply-chain"] },
];

// --- Resources ---------------------------------------------------------------
export const resources: Resource[] = [
  { id: "r1", title: "Sustainability Reporting Foundations", type: "course", provider: "Coursera", description: "Free intro course on GRI/SASB/ISSB frameworks.", careerPaths: ["esg-reporting"], cost: "free", url: "https://www.coursera.org/learn/sustainability-reporting" },
  { id: "r2", title: "Project Drawdown", type: "guide", provider: "Drawdown", description: "Comprehensive guide to climate solutions ranked by impact.", careerPaths: ["climate-policy", "renewable-energy"], cost: "free", url: "https://drawdown.org/solutions" },
  { id: "r3", title: "Outrage + Optimism", type: "podcast", provider: "Global Optimism", description: "Leading climate podcast hosted by Christiana Figueres.", careerPaths: ["climate-policy", "climate-communications"], cost: "free", url: "https://www.outrageandoptimism.org/" },
  { id: "r4", title: "A Matter of Degrees", type: "podcast", provider: "Dr. Leah Stokes & Dr. Katharine Wilkinson", description: "Bite-sized climate science and policy explainers.", careerPaths: ["climate-communications", "climate-education"], cost: "free", url: "https://www.degreespod.com/" },
  { id: "r5", title: "Doughnut Economics", type: "book", provider: "Kate Raworth", description: "Reframing economics for sustainability.", careerPaths: ["circular-economy", "climate-policy"], cost: "paid", url: "https://doughnuteconomics.org/book" },
  { id: "r6", title: "Drawdown (Book)", type: "book", provider: "Paul Hawken", description: "100 solutions to reverse global warming.", careerPaths: ["climate-policy", "renewable-energy", "circular-economy"], cost: "paid", url: "https://drawdown.org/the-book" },
  { id: "r7", title: "Cradle to Cradle", type: "book", provider: "McDonough & Braungart", description: "Foundational circular economy text.", careerPaths: ["circular-economy"], cost: "paid", url: "https://mcdonough.com/cradle-to-cradle/" },
  { id: "r8", title: "Terra.do Climate Change: Learning for Action", type: "fellowship", provider: "Terra.do", description: "12-week climate change fellowship for career switchers.", careerPaths: ["climate-policy", "renewable-energy", "esg-reporting"], cost: "paid", url: "https://www.terra.do/climate-change-learning-for-action-bootcamp/" },
  { id: "r9", title: "On Deck Climate Tech", type: "fellowship", provider: "On Deck", description: "Community-based climate tech fellowship.", careerPaths: ["renewable-energy", "sustainability-data"], cost: "paid", url: "https://www.beondeck.com/climate-tech" },
  { id: "r10", title: "Work on Climate Slack", type: "community", provider: "Work on Climate", description: "Active community for climate career switchers.", careerPaths: ["climate-policy", "renewable-energy", "esg-reporting"], cost: "free", url: "https://workonclimate.org/" },
  { id: "r11", title: "ClimateBase Jobs", type: "community", provider: "ClimateBase", description: "Largest climate jobs board and community.", careerPaths: ["climate-policy", "renewable-energy", "sustainability-data"], cost: "free", url: "https://climatebase.org/" },
  { id: "r12", title: "GHG Protocol Standards", type: "guide", provider: "WRI", description: "Authoritative GHG accounting standards and guidance.", careerPaths: ["esg-reporting", "sustainable-supply-chain", "sustainability-data"], cost: "free", url: "https://ghgprotocol.org/standards" },
  { id: "r13", title: "IPCC AR6 Synthesis Report", type: "guide", provider: "IPCC", description: "The definitive climate science synthesis.", careerPaths: ["climate-policy", "climate-communications", "climate-education"], cost: "free", url: "https://www.ipcc.ch/report/ar6/syr/" },
  { id: "r14", title: "MyClimate Carbon Markets 101", type: "article", provider: "MyClimate", description: "Beginner-friendly guide to voluntary carbon markets.", careerPaths: ["carbon-markets"], cost: "free", url: "https://www.myclimate.org/en/information/faq/" },
  { id: "r15", title: "How to Save a Planet", type: "podcast", provider: "Spotify / Gimlet", description: "Solutions-focused climate podcast.", careerPaths: ["climate-communications", "climate-education"], cost: "free", url: "https://gimletmedia.com/shows/howtosaveaplanet" },
  { id: "r16", title: "Power BI for Sustainability Dashboards", type: "course", provider: "Udemy", description: "Build ESG and emissions dashboards in Power BI.", careerPaths: ["sustainability-data", "esg-reporting"], cost: "paid", url: "https://www.udemy.com/topic/power-bi/" },
  { id: "r17", title: "Ellen MacArthur Foundation Learning Hub", type: "course", provider: "EMF", description: "Free courses on circular economy across industries.", careerPaths: ["circular-economy", "sustainable-supply-chain", "sustainable-fashion"], cost: "free", url: "https://ellenmacarthurfoundation.org/learning-hub" },
  { id: "r18", title: "Nature Positive Initiative", type: "guide", provider: "Nature Positive", description: "Standards and guidance for nature-positive business.", careerPaths: ["biodiversity-conservation"], cost: "free", url: "https://www.naturepositive.org/" },

  // --- UN, climate, sustainability & conservation courses ---
  { id: "r19", title: "UN CC:Learn — Introduction to Climate Change", type: "course", provider: "UN CC:Learn", description: "Free self-paced UN course covering climate science, policy, finance and the UNFCCC process. Certificate on completion.", careerPaths: ["climate-policy", "climate-education", "climate-communications"], cost: "free", url: "https://unccelearn.org/course/view.php?id=10" },
  { id: "r20", title: "UN SDG Academy — Sustainable Development Goals", type: "course", provider: "SDG Academy (edX)", description: "Flagship course from Jeffrey Sachs explaining the SDGs and how to deliver them in practice.", careerPaths: ["climate-policy", "community-sustainability", "esg-reporting"], cost: "free", url: "https://www.edx.org/learn/sustainable-development/sdg-academy-the-sustainable-development-goals-a-global-transdisciplinary-vision-for-the-future" },
  { id: "r21", title: "UNEP — Introduction to Environmental Law & Governance", type: "course", provider: "UN Environment Programme", description: "Free UNEP course on the principles and instruments of international environmental law.", careerPaths: ["climate-policy", "environmental-consulting"], cost: "free", url: "https://unccelearn.org/course/view.php?id=49" },
  { id: "r22", title: "UNITAR — Climate Change Diplomacy", type: "course", provider: "UNITAR", description: "Introduction to multilateral climate negotiations, the Paris Agreement and the COP process.", careerPaths: ["climate-policy", "climate-communications"], cost: "free", url: "https://unccelearn.org/course/view.php?id=20" },
  { id: "r23", title: "Climate Change: The Science and Global Impact", type: "course", provider: "SDG Academy (edX) — Michael Mann", description: "University-level climate science course from one of the world's leading climatologists.", careerPaths: ["climate-education", "climate-communications", "climate-policy"], cost: "free", url: "https://www.edx.org/learn/climate-change/sdg-academy-climate-change-the-science-and-global-impact" },
  { id: "r24", title: "Climate Solutions", type: "course", provider: "SDG Academy (edX)", description: "Survey of mitigation and adaptation solutions across energy, land, cities and finance.", careerPaths: ["climate-policy", "renewable-energy", "circular-economy"], cost: "free", url: "https://www.edx.org/learn/sustainability/sdg-academy-climate-solutions" },
  { id: "r25", title: "Sustainable Cities", type: "course", provider: "SDG Academy (edX)", description: "How urban planning, transport and infrastructure can deliver low-carbon, equitable cities.", careerPaths: ["green-building", "community-sustainability"], cost: "free", url: "https://www.edx.org/learn/sustainability/sdg-academy-sustainable-cities" },
  { id: "r26", title: "Conservation of Biodiversity (NPTEL)", type: "course", provider: "NPTEL / IIT", description: "Comprehensive university course on biodiversity, ecosystems and conservation strategies.", careerPaths: ["biodiversity-conservation"], cost: "free", url: "https://onlinecourses.nptel.ac.in/noc23_bt23/preview" },
  { id: "r27", title: "Wildlife Conservation", type: "course", provider: "American Museum of Natural History (Coursera)", description: "Free course on conservation biology, threats to wildlife and protected-area management.", careerPaths: ["biodiversity-conservation"], cost: "free", url: "https://www.coursera.org/learn/wildlife-conservation" },
  { id: "r28", title: "Marine & Ocean Conservation Specialization", type: "course", provider: "Duke University (Coursera)", description: "Ocean ecosystems, fisheries, plastics and marine protected areas.", careerPaths: ["water-ocean", "biodiversity-conservation"], cost: "freemium", url: "https://www.coursera.org/learn/oceanography" },
  { id: "r29", title: "FAO elearning Academy", type: "course", provider: "Food and Agriculture Organization (UN)", description: "Hundreds of free UN courses on food systems, climate-smart agriculture, forestry and land use.", careerPaths: ["community-sustainability", "biodiversity-conservation"], cost: "free", url: "https://elearning.fao.org/" },
  { id: "r30", title: "Renewable Energy and Green Building Entrepreneurship", type: "course", provider: "Duke University (Coursera)", description: "Business and technical foundations of renewables and sustainable buildings.", careerPaths: ["renewable-energy", "green-building"], cost: "freemium", url: "https://www.coursera.org/learn/green-building-entrepreneur" },
  { id: "r31", title: "Energy Within Environmental Constraints", type: "course", provider: "Harvard University (edX)", description: "Rigorous look at the energy system and the climate constraints shaping its transformation.", careerPaths: ["renewable-energy", "climate-policy"], cost: "free", url: "https://www.edx.org/learn/energy/harvard-university-energy-within-environmental-constraints" },
  { id: "r32", title: "Circular Economy: An Introduction", type: "course", provider: "TU Delft (edX)", description: "Foundational course on circular business models, design and material flows.", careerPaths: ["circular-economy", "sustainable-fashion", "sustainable-supply-chain"], cost: "free", url: "https://www.edx.org/learn/sustainability/delft-university-of-technology-circular-economy-an-introduction" },
  { id: "r33", title: "Sustainable Fashion", type: "course", provider: "Copenhagen Business School (Coursera)", description: "Industry-leading course on sustainability challenges and solutions in fashion.", careerPaths: ["sustainable-fashion", "circular-economy"], cost: "free", url: "https://www.coursera.org/learn/sustainable-fashion" },
  { id: "r34", title: "Business Sustainability Management", type: "course", provider: "University of Cambridge Institute for Sustainability Leadership", description: "Practical 8-week course on embedding sustainability into business strategy.", careerPaths: ["esg-reporting", "environmental-consulting"], cost: "paid", url: "https://www.cisl.cam.ac.uk/education/online-courses/business-sustainability-management" },
  { id: "r35", title: "ESG Investing Certificate", type: "course", provider: "CFA Institute", description: "Globally recognized credential covering ESG integration in investment analysis.", careerPaths: ["carbon-markets", "esg-reporting"], cost: "paid", url: "https://www.cfainstitute.org/programs/cfa-institute-certificate-in-esg-investing" },
  { id: "r36", title: "Climate Change: From Learning to Action", type: "course", provider: "UN CC:Learn", description: "UN flagship course on translating climate knowledge into action across sectors.", careerPaths: ["climate-policy", "climate-education", "esg-reporting"], cost: "free", url: "https://unccelearn.org/course/view.php?id=43" },
  { id: "r37", title: "Human Rights, Human Wrongs", type: "course", provider: "UN OHCHR / SDG Academy", description: "Connects human rights to environmental justice and the sustainability agenda.", careerPaths: ["community-sustainability", "climate-policy"], cost: "free", url: "https://sdgacademy.org/course/human-rights-human-wrongs/" },

  // --- Books ---
  { id: "r38", title: "The Sixth Extinction", type: "book", provider: "Elizabeth Kolbert", description: "Pulitzer-winning account of human-driven biodiversity loss.", careerPaths: ["biodiversity-conservation", "climate-education"], cost: "paid", url: "https://www.elizabethkolbert.com/the-sixth-extinction" },
  { id: "r39", title: "Braiding Sweetgrass", type: "book", provider: "Robin Wall Kimmerer", description: "Indigenous wisdom and ecological science woven into a powerful sustainability lens.", careerPaths: ["biodiversity-conservation", "community-sustainability"], cost: "paid", url: "https://milkweed.org/book/braiding-sweetgrass" },
  { id: "r40", title: "The Uninhabitable Earth", type: "book", provider: "David Wallace-Wells", description: "Unflinching look at climate change impacts across society.", careerPaths: ["climate-policy", "climate-communications"], cost: "paid", url: "https://www.penguinrandomhouse.com/books/586541/the-uninhabitable-earth-by-david-wallace-wells/" },
  { id: "r41", title: "Speed & Scale", type: "book", provider: "John Doerr", description: "An OKR-based action plan to solve the climate crisis by 2050.", careerPaths: ["climate-policy", "renewable-energy", "carbon-markets"], cost: "paid", url: "https://speedandscale.com/" },
  { id: "r42", title: "Regeneration", type: "book", provider: "Paul Hawken", description: "Practical roadmap for ending the climate crisis in one generation.", careerPaths: ["climate-policy", "circular-economy", "community-sustainability"], cost: "paid", url: "https://regeneration.org/" },
  { id: "r43", title: "All We Can Save", type: "book", provider: "Ayana Elizabeth Johnson & Katharine Wilkinson", description: "Anthology of women leading climate solutions.", careerPaths: ["climate-communications", "climate-education"], cost: "paid", url: "https://www.allwecansave.earth/anthology" },
  { id: "r44", title: "How to Avoid a Climate Disaster", type: "book", provider: "Bill Gates", description: "Plain-spoken overview of the technologies needed to reach net zero.", careerPaths: ["renewable-energy", "climate-policy"], cost: "paid", url: "https://www.gatesnotes.com/Climate-and-energy/My-new-climate-book-is-finally-here" },

  // --- Articles ---
  { id: "r45", title: "Our World in Data — CO₂ & Greenhouse Gas Emissions", type: "article", provider: "Our World in Data", description: "Continuously updated data and explainers on global emissions.", careerPaths: ["climate-education", "climate-policy", "sustainability-data"], cost: "free", url: "https://ourworldindata.org/co2-and-greenhouse-gas-emissions" },
  { id: "r46", title: "MIT Climate Portal — Explainers", type: "article", provider: "MIT", description: "Short, expert-reviewed explainers on every major climate topic.", careerPaths: ["climate-education", "climate-communications"], cost: "free", url: "https://climate.mit.edu/explainers" },
  { id: "r47", title: "Carbon Brief — Daily Climate Briefing", type: "article", provider: "Carbon Brief", description: "In-depth journalism on climate science, policy and energy.", careerPaths: ["climate-policy", "climate-communications"], cost: "free", url: "https://www.carbonbrief.org/" },
  { id: "r48", title: "WRI Insights", type: "article", provider: "World Resources Institute", description: "Analysis on climate, energy, food, forests and cities.", careerPaths: ["climate-policy", "esg-reporting", "biodiversity-conservation"], cost: "free", url: "https://www.wri.org/insights" },

  // --- Guides ---
  { id: "r49", title: "SBTi Net-Zero Standard", type: "guide", provider: "Science Based Targets initiative", description: "The leading corporate standard for setting science-based net-zero targets.", careerPaths: ["esg-reporting", "sustainable-supply-chain"], cost: "free", url: "https://sciencebasedtargets.org/net-zero" },
  { id: "r50", title: "TNFD Recommendations", type: "guide", provider: "Taskforce on Nature-related Financial Disclosures", description: "Framework for nature-related risk and impact disclosure.", careerPaths: ["biodiversity-conservation", "esg-reporting"], cost: "free", url: "https://tnfd.global/publication/recommendations-of-the-taskforce-on-nature-related-financial-disclosures/" },
  { id: "r51", title: "IEA World Energy Outlook", type: "guide", provider: "International Energy Agency", description: "Authoritative annual outlook on the global energy transition.", careerPaths: ["renewable-energy", "climate-policy"], cost: "free", url: "https://www.iea.org/reports/world-energy-outlook-2024" },
  { id: "r52", title: "UNEP Emissions Gap Report", type: "guide", provider: "UN Environment Programme", description: "Yearly UN assessment of the gap between pledges and 1.5°C pathways.", careerPaths: ["climate-policy", "esg-reporting"], cost: "free", url: "https://www.unep.org/resources/emissions-gap-report-2024" },

  // --- Podcasts ---
  { id: "r53", title: "Volts", type: "podcast", provider: "David Roberts", description: "Deep-dive podcast on clean energy, climate policy and politics.", careerPaths: ["renewable-energy", "climate-policy"], cost: "free", url: "https://www.volts.wtf/" },
  { id: "r54", title: "The Energy Gang", type: "podcast", provider: "Wood Mackenzie", description: "Weekly debate on energy markets, climate and cleantech.", careerPaths: ["renewable-energy", "carbon-markets"], cost: "free", url: "https://www.woodmac.com/podcasts/the-energy-gang/" },
  { id: "r55", title: "My Climate Journey", type: "podcast", provider: "MCJ Collective", description: "Conversations with founders, investors and operators fighting climate change.", careerPaths: ["renewable-energy", "carbon-markets", "sustainability-data"], cost: "free", url: "https://www.mcjcollective.com/podcast" },
  { id: "r56", title: "Catalyst with Shayle Kann", type: "podcast", provider: "Latitude Media", description: "Climate-tech focused interviews on the technologies decarbonizing the economy.", careerPaths: ["renewable-energy", "sustainability-data"], cost: "free", url: "https://www.latitudemedia.com/podcasts/catalyst" },
  { id: "r57", title: "Mongabay Newscast", type: "podcast", provider: "Mongabay", description: "Conservation, biodiversity and tropical ecosystems reporting.", careerPaths: ["biodiversity-conservation", "water-ocean"], cost: "free", url: "https://news.mongabay.com/podcast/" },

  // --- Communities ---
  { id: "r58", title: "MCJ Collective Community", type: "community", provider: "My Climate Journey", description: "Member community for climate operators, investors and founders.", careerPaths: ["renewable-energy", "carbon-markets", "sustainability-data"], cost: "paid", url: "https://www.mcjcollective.com/membership" },
  { id: "r59", title: "Climatebase Fellowship Network", type: "community", provider: "Climatebase", description: "Global network of climate professionals and alumni.", careerPaths: ["climate-policy", "renewable-energy", "esg-reporting"], cost: "free", url: "https://climatebase.org/fellowship" },
  { id: "r60", title: "Women in Climate", type: "community", provider: "Women in Climate", description: "Global community supporting women working on climate.", careerPaths: ["climate-communications", "climate-policy"], cost: "free", url: "https://www.womeninclimate.co/" },
  { id: "r61", title: "Sustainability Professionals (LinkedIn)", type: "community", provider: "LinkedIn", description: "Largest peer group for sustainability practitioners worldwide.", careerPaths: ["esg-reporting", "environmental-consulting"], cost: "free", url: "https://www.linkedin.com/groups/47373/" },
  { id: "r62", title: "Conservation Careers Community", type: "community", provider: "Conservation Careers", description: "Network, jobs board and advice hub for conservation professionals.", careerPaths: ["biodiversity-conservation", "water-ocean"], cost: "freemium", url: "https://www.conservation-careers.com/" },

  // --- Fellowships ---
  { id: "r63", title: "Climatebase Fellowship", type: "fellowship", provider: "Climatebase", description: "12-week cohort program to launch a career in climate.", careerPaths: ["climate-policy", "renewable-energy", "esg-reporting"], cost: "paid", url: "https://climatebase.org/fellowship" },
  { id: "r64", title: "Acumen Climate Fellowship", type: "fellowship", provider: "Acumen Academy", description: "Leadership fellowship for climate changemakers in the Global South.", careerPaths: ["community-sustainability", "climate-policy"], cost: "free", url: "https://acumenacademy.org/foundry/climate" },
  { id: "r65", title: "Echoing Green Climate Fellowship", type: "fellowship", provider: "Echoing Green", description: "Seed funding and support for early-stage climate social entrepreneurs.", careerPaths: ["community-sustainability", "climate-policy"], cost: "free", url: "https://echoinggreen.org/fellowship/" },
  { id: "r66", title: "ClimateScience Olympiad & Fellowship", type: "fellowship", provider: "ClimateScience", description: "Global learning and project fellowship for young climate leaders.", careerPaths: ["climate-education", "climate-communications"], cost: "free", url: "https://climatescience.org/" },
  { id: "r67", title: "WWF EFN Fellowship", type: "fellowship", provider: "WWF Education for Nature", description: "Funding for conservation leaders pursuing graduate study.", careerPaths: ["biodiversity-conservation"], cost: "free", url: "https://www.worldwildlife.org/projects/russell-e-train-fellowships" },
];


// --- Skills library -----------------------------------------------------------
export const skills: Skill[] = [
  { slug: "ghg-accounting", name: "GHG Accounting (Scope 1, 2, 3)", category: "esg-reporting", kind: "technical", whatItIs: "Quantifying an organization's greenhouse gas emissions across direct operations, purchased energy, and value chain.", whyItMatters: "Foundation for every climate target, disclosure, and carbon strategy.", careerPaths: ["esg-reporting", "sustainable-supply-chain", "sustainability-data"], beginnerResources: ["r12", "ghg-protocol"] },
  { slug: "esg-frameworks", name: "ESG Reporting Frameworks (GRI, ISSB, CSRD)", category: "esg-reporting", kind: "technical", whatItIs: "Standards and frameworks that structure corporate sustainability disclosures.", whyItMatters: "Mandatory or expected reporting for most large companies globally.", careerPaths: ["esg-reporting"], beginnerResources: ["r1", "gri-cert"] },
  { slug: "materiality", name: "Materiality Assessment", category: "esg-reporting", kind: "soft", whatItIs: "Process to identify the ESG topics most important to a business and its stakeholders.", whyItMatters: "Anchors a credible sustainability strategy and report.", careerPaths: ["esg-reporting", "environmental-consulting"], beginnerResources: ["r1"] },
  { slug: "climate-finance", name: "Climate Finance Analysis", category: "climate-finance", kind: "technical", whatItIs: "Evaluating capital flows toward climate solutions, including blended finance and green bonds.", whyItMatters: "Unlocks the trillions needed for the transition.", careerPaths: ["carbon-markets"], beginnerResources: ["nebim"] },
  { slug: "carbon-markets", name: "Voluntary & Compliance Carbon Markets", category: "carbon-markets", kind: "technical", whatItIs: "Understanding carbon credit standards, pricing, and project types.", whyItMatters: "Rapidly growing market for climate action and corporate offsetting.", careerPaths: ["carbon-markets"], beginnerResources: ["r14", "icroa-fund"] },
  { slug: "lca", name: "Life Cycle Assessment (LCA)", category: "impact-measurement", kind: "technical", whatItIs: "Method to quantify environmental impacts across a product's full lifecycle.", whyItMatters: "Core to product sustainability, circular design, and Scope 3.", careerPaths: ["circular-economy", "sustainable-supply-chain", "sustainable-fashion"], beginnerResources: ["r17"] },
  { slug: "renewables", name: "Renewable Energy Systems", category: "renewable-energy", kind: "technical", whatItIs: "How solar, wind, storage, and grid systems work technically and financially.", whyItMatters: "Backbone of the energy transition.", careerPaths: ["renewable-energy"], beginnerResources: ["renewable-100"] },
  { slug: "data-viz", name: "Data Visualization (Power BI / Tableau)", category: "data-analytics", kind: "technical", whatItIs: "Turning sustainability data into clear, decision-grade dashboards.", whyItMatters: "Every sustainability team needs to communicate progress visually.", careerPaths: ["sustainability-data", "esg-reporting"], beginnerResources: ["r16", "powerbi-mc"] },
  { slug: "python", name: "Python for Sustainability Data", category: "data-analytics", kind: "technical", whatItIs: "Using Python (pandas, numpy) to analyze climate and ESG datasets.", whyItMatters: "Unlocks larger-scale analysis than spreadsheets allow.", careerPaths: ["sustainability-data"], beginnerResources: ["google-da"] },
  { slug: "gis", name: "GIS & Spatial Analysis", category: "biodiversity", kind: "technical", whatItIs: "Mapping and analyzing geographic data with tools like QGIS and ArcGIS.", whyItMatters: "Essential for conservation, climate risk and land-use work.", careerPaths: ["biodiversity-conservation", "green-building", "water-ocean"], beginnerResources: ["gis-esri"] },
  { slug: "policy-analysis", name: "Policy Analysis & Brief Writing", category: "policy-governance", kind: "soft", whatItIs: "Synthesizing evidence into clear policy options for decision-makers.", whyItMatters: "Drives systemic change at the regulatory level.", careerPaths: ["climate-policy"], beginnerResources: ["r13"] },
  { slug: "stakeholder-engagement", name: "Stakeholder Engagement", category: "policy-governance", kind: "soft", whatItIs: "Building trust and alignment across diverse groups affected by sustainability decisions.", whyItMatters: "Sustainability rarely succeeds without buy-in.", careerPaths: ["climate-policy", "community-sustainability"], beginnerResources: ["r10"] },
  { slug: "climate-storytelling", name: "Climate Storytelling", category: "communications", kind: "soft", whatItIs: "Translating complex climate science into narratives that move people.", whyItMatters: "Public understanding and behavior change depend on it.", careerPaths: ["climate-communications", "climate-education"], beginnerResources: ["r3", "r15"] },
  { slug: "campaign-strategy", name: "Campaign Strategy", category: "communications", kind: "soft", whatItIs: "Designing advocacy campaigns that achieve measurable change.", whyItMatters: "Translates climate concern into political and corporate action.", careerPaths: ["climate-communications"], beginnerResources: ["r3"] },
  { slug: "scope-3", name: "Scope 3 / Supplier Engagement", category: "supply-chain", kind: "technical", whatItIs: "Working with suppliers to measure and reduce value chain emissions.", whyItMatters: "Scope 3 is typically 70%+ of a company's footprint.", careerPaths: ["sustainable-supply-chain", "esg-reporting"], beginnerResources: ["r12", "cipsx"] },
  { slug: "circular-design", name: "Circular Design", category: "circular-economy", kind: "soft", whatItIs: "Designing products and systems that eliminate waste and keep materials in use.", whyItMatters: "Shifts business models from linear to regenerative.", careerPaths: ["circular-economy", "sustainable-fashion"], beginnerResources: ["circular-elen", "r17"] },
  { slug: "biodiversity-monitoring", name: "Biodiversity Monitoring & TNFD", category: "biodiversity", kind: "technical", whatItIs: "Tracking and reporting on nature impacts and dependencies.", whyItMatters: "Nature loss is the next ESG frontier.", careerPaths: ["biodiversity-conservation"], beginnerResources: ["r18"] },
  { slug: "regen-ag", name: "Regenerative Agriculture", category: "agriculture", kind: "technical", whatItIs: "Farming practices that restore soil, biodiversity, and water cycles.", whyItMatters: "Critical for food system resilience and carbon removals.", careerPaths: ["community-sustainability"], beginnerResources: ["r6"] },
  { slug: "impact-mgmt", name: "Impact Measurement & Management (IMM)", category: "impact-measurement", kind: "technical", whatItIs: "Frameworks like IRIS+ and SDGs to measure social and environmental outcomes.", whyItMatters: "Required for impact investing and credible nonprofit reporting.", careerPaths: ["carbon-markets", "community-sustainability"], beginnerResources: ["nebim"] },
  { slug: "project-mgmt", name: "Sustainability Project Management", category: "policy-governance", kind: "soft", whatItIs: "Planning and delivering cross-functional sustainability initiatives.", whyItMatters: "Sustainability work spans every department; PM skill is foundational.", careerPaths: ["esg-reporting", "renewable-energy", "environmental-consulting"], beginnerResources: ["google-da"] },
];

// --- Career paths v2 ----------------------------------------------------------
// Slugs intentionally match existing IDs in src/data/careerPaths.ts.
function buildCareer(
  slug: string,
  name: string,
  icon: string,
  tagline: string,
  what: string,
  why: string,
  demand: DemandLevel,
  growth: string,
  jobTitles: CareerPathV2["jobTitles"],
  skills: CareerPathV2["skills"],
  tools: string[],
  certifications: CareerPathV2["certifications"],
  projects: CareerPathV2["projects"],
  roadmap: CareerPathV2["roadmap"],
  related: string[]
): CareerPathV2 {
  return { slug, name, icon, tagline, overview: { what, why, demand, growth }, jobTitles, skills, tools, certifications, projects, roadmap, related };
}

export const careerPathsV2: CareerPathV2[] = [
  buildCareer(
    "esg-reporting",
    "ESG & Sustainability Reporting",
    "📊",
    "Measure, disclose, and improve corporate sustainability performance.",
    "ESG and sustainability reporting professionals collect data, apply disclosure frameworks (GRI, ISSB, CSRD, SASB), and produce annual reports that show how a company manages environmental, social and governance risk.",
    "Mandatory disclosure regimes (CSRD, SEC, ISSB) are making this one of the fastest-growing functions inside companies of every size.",
    "very-high",
    "Strong demand at all levels; clear progression from analyst to head of sustainability.",
    {
      entry: ["Sustainability Analyst", "ESG Data Analyst", "CSR Coordinator"],
      mid: ["ESG Reporting Manager", "Sustainability Specialist", "ESG Program Lead"],
      senior: ["Head of Sustainability", "Chief Sustainability Officer", "Director, ESG Strategy"],
    },
    {
      beginner: { soft: ["Written communication", "Attention to detail"], technical: ["Excel", "Basic data analysis", "GHG Protocol literacy"] },
      intermediate: { soft: ["Stakeholder engagement", "Project management"], technical: ["GRI / ISSB reporting", "Materiality assessment", "Power BI"] },
      advanced: { soft: ["Strategy", "Executive communication"], technical: ["CSRD / ESRS implementation", "Assurance readiness", "Integrated reporting"] },
    },
    ["Excel", "Power BI", "Tableau", "Workiva", "Watershed", "Persefoni", "GHG Protocol toolkit"],
    {
      beginner: ["ghg-protocol", "cdp-disclosure"],
      intermediate: ["gri-cert", "tcfd-foundation", "chmm"],
      advanced: ["sasb-fsa", "issp-csp", "cfa-esg"],
    },
    [
      { title: "Build a sample sustainability report", description: "Pick a public company and reproduce a 20-page sustainability report using GRI Standards." },
      { title: "Run a materiality assessment", description: "Interview 5 stakeholders for a small business and produce a materiality matrix." },
      { title: "Design an ESG dashboard", description: "Build a Power BI or Tableau dashboard tracking key ESG KPIs for a mock company." },
    ],
    {
      days1to30: ["Read the GRI Universal Standards", "Complete CDP Disclosure training", "Study one public sustainability report end-to-end"],
      days31to60: ["Take a GHG accounting short course", "Draft a mock Scope 1+2 inventory in Excel", "Start the GRI Certified course"],
      days61to90: ["Build a sample sustainability dashboard", "Network with 5 ESG professionals", "Apply to 10 ESG analyst roles"],
    },
    ["carbon-markets", "sustainable-supply-chain", "environmental-consulting"]
  ),
  buildCareer(
    "climate-policy",
    "Climate Policy & Governance",
    "🏛️",
    "Shape the rules that drive systemic climate action.",
    "Climate policy professionals analyze regulations, draft policy briefs, and advise governments, NGOs and companies on how to design effective climate and environmental policy.",
    "Net-zero legislation, carbon pricing and adaptation policy are expanding fast in every region.",
    "high",
    "Steady demand in government, think tanks, NGOs and corporate government affairs.",
    {
      entry: ["Policy Research Assistant", "Climate Policy Analyst", "Government Affairs Associate"],
      mid: ["Policy Manager", "Senior Policy Analyst", "Regulatory Affairs Manager"],
      senior: ["Head of Climate Policy", "Director of Government Affairs", "Senior Advisor"],
    },
    {
      beginner: { soft: ["Research", "Written communication"], technical: ["Policy brief writing", "Literature review"] },
      intermediate: { soft: ["Stakeholder engagement", "Negotiation"], technical: ["Regulatory analysis", "Economic modeling basics"] },
      advanced: { soft: ["Coalition building", "Executive advisory"], technical: ["Policy design", "Cost-benefit analysis"] },
    },
    ["Excel", "Stata or R for analysis", "Climate Action Tracker", "IPCC reports"],
    { beginner: ["carbon-literacy"], intermediate: ["chmm"], advanced: ["issp-csp"] },
    [
      { title: "Write a policy brief", description: "Pick a current climate bill and write a 2-page brief on its strengths and gaps." },
      { title: "Compare two national NDCs", description: "Produce a comparison of two countries' climate commitments under the Paris Agreement." },
      { title: "Stakeholder map", description: "Map the actors influencing a specific climate policy and their positions." },
    ],
    {
      days1to30: ["Read the IPCC AR6 Synthesis Report", "Track 3 policy newsletters daily", "Complete Carbon Literacy training"],
      days31to60: ["Write 2 mock policy briefs", "Attend one policy webinar weekly", "Reach out to 5 policy professionals"],
      days61to90: ["Volunteer with an NGO on a policy submission", "Apply to research assistant and policy roles"],
    },
    ["climate-communications", "esg-reporting", "biodiversity-conservation"]
  ),
  buildCareer(
    "climate-communications",
    "Climate Communications & Advocacy",
    "📢",
    "Move audiences from awareness to action.",
    "Climate communicators translate science and policy into stories, campaigns, and content that change minds and behaviors across audiences.",
    "Every climate-active organization needs communicators who can cut through noise and inspire action.",
    "high",
    "Strong in NGOs, agencies, media, and increasingly in-house at corporates.",
    {
      entry: ["Communications Coordinator", "Content Producer", "Social Media Associate"],
      mid: ["Climate Campaign Manager", "Communications Manager", "Content Strategy Lead"],
      senior: ["Director of Communications", "Head of Advocacy", "Chief Storyteller"],
    },
    {
      beginner: { soft: ["Storytelling", "Empathy"], technical: ["Copywriting", "Social media basics"] },
      intermediate: { soft: ["Campaign strategy", "Media relations"], technical: ["Editorial planning", "Canva / Figma", "Analytics tools"] },
      advanced: { soft: ["Narrative strategy", "Crisis communication"], technical: ["Multi-channel campaign design", "Owned-media platforms"] },
    },
    ["Canva", "Figma", "WordPress", "Substack", "Notion", "Meta/X analytics", "Mailchimp"],
    { beginner: ["carbon-literacy"], intermediate: [], advanced: [] },
    [
      { title: "Build a climate campaign", description: "Design a 6-week campaign for a real local issue, including assets and KPIs." },
      { title: "Sustainability content calendar", description: "Produce a 3-month editorial calendar for a sustainability brand." },
      { title: "Create awareness materials", description: "Design 5 social posts and a 60-second video script on a single climate solution." },
    ],
    {
      days1to30: ["Read 'Don't Even Think About It' by Marshall", "Subscribe to 3 climate newsletters", "Start a personal climate writing or social channel"],
      days31to60: ["Complete a free copywriting or video editing course", "Publish 5 pieces of climate content", "Build a portfolio site"],
      days61to90: ["Pitch one piece to a climate publication", "Apply to communications roles in NGOs and climate startups"],
    },
    ["climate-policy", "climate-education", "community-sustainability"]
  ),
  buildCareer(
    "carbon-markets",
    "Carbon Markets & Climate Finance",
    "💹",
    "Channel capital into climate solutions.",
    "Professionals in this space develop, finance, trade and analyze carbon credits, climate funds, and green financial products.",
    "Carbon markets, climate funds and transition finance are projected to be among the highest-growth segments in finance this decade.",
    "very-high",
    "Excellent compensation; finance background is a plus but not required at entry.",
    {
      entry: ["Carbon Markets Analyst", "Sustainable Finance Associate", "Climate Investment Analyst"],
      mid: ["Carbon Project Manager", "Climate Finance Manager", "Transition Finance Specialist"],
      senior: ["Head of Carbon Strategy", "Managing Director, Climate Investing", "Chief Investment Officer, Climate Fund"],
    },
    {
      beginner: { soft: ["Quantitative reasoning"], technical: ["Excel", "Carbon markets vocabulary"] },
      intermediate: { soft: ["Negotiation", "Project management"], technical: ["Carbon credit standards (Verra, Gold Standard)", "Financial modeling"] },
      advanced: { soft: ["Investor communication"], technical: ["Project finance structuring", "Blended finance", "TCFD/ISSB"] },
    },
    ["Excel", "Bloomberg / Refinitiv", "Sylvera", "Verra Registry", "Carbon market data platforms"],
    { beginner: ["nebim"], intermediate: ["icroa-fund", "cfa-esg", "tcfd-foundation"], advanced: ["sasb-fsa", "vcmi-claims"] },
    [
      { title: "Carbon credit deep-dive", description: "Analyze a specific carbon project (REDD+ or DAC) and write an investor memo." },
      { title: "Green bond comparison", description: "Compare 3 green bonds and assess their alignment with the Green Bond Principles." },
      { title: "Climate fund pitch", description: "Build a one-page thesis for a climate-focused fund." },
    ],
    {
      days1to30: ["Complete MyClimate Carbon Markets 101", "Read 'Net Zero' by Dieter Helm", "Follow 5 carbon market analysts"],
      days31to60: ["Take ICROA or PRI Academy course", "Build a simple project cashflow model", "Network with 5 climate finance professionals"],
      days61to90: ["Publish an analysis of one carbon project", "Apply to climate finance and carbon analyst roles"],
    },
    ["esg-reporting", "renewable-energy", "environmental-consulting"]
  ),
  buildCareer(
    "renewable-energy",
    "Renewable Energy & Clean Tech",
    "⚡",
    "Build and scale the technology of the energy transition.",
    "Professionals in renewables and clean tech develop, finance, deploy and operate solar, wind, storage, EV, hydrogen and grid solutions.",
    "Trillions of dollars are flowing into deployment and innovation through 2050.",
    "very-high",
    "Strong demand across technical, commercial, finance and policy roles.",
    {
      entry: ["Renewable Energy Analyst", "Project Coordinator", "Clean Tech Associate"],
      mid: ["Project Developer", "Energy Engineer", "Clean Tech Product Manager"],
      senior: ["Director of Development", "Head of Engineering", "VP, Clean Energy"],
    },
    {
      beginner: { soft: ["Curiosity", "Problem solving"], technical: ["Excel", "Energy systems literacy"] },
      intermediate: { soft: ["Project management", "Cross-functional collaboration"], technical: ["Project finance modeling", "PVsyst or WindPRO", "GIS basics"] },
      advanced: { soft: ["Strategy", "Negotiation"], technical: ["Power markets", "Grid integration", "Permitting"] },
    },
    ["Excel", "PVsyst", "WindPRO", "Homer Pro", "QGIS / ArcGIS", "AutoCAD"],
    { beginner: ["renewable-100"], intermediate: ["gis-esri"], advanced: [] },
    [
      { title: "Solar site pre-feasibility", description: "Pick a real location and produce a basic solar pre-feasibility study." },
      { title: "Levelized cost model", description: "Build an LCOE model for a solar or wind project." },
      { title: "EV charging plan", description: "Design a charging-network rollout plan for a mid-sized city." },
    ],
    {
      days1to30: ["Take edX 'Renewable Energy 100'", "Read 'Electrify' by Saul Griffith", "Map the renewables value chain"],
      days31to60: ["Build a basic LCOE model in Excel", "Learn QGIS basics", "Attend a renewables industry event or webinar"],
      days61to90: ["Complete one portfolio project", "Apply to developer, analyst, and engineer roles"],
    },
    ["sustainability-data", "carbon-markets", "green-building"]
  ),
  buildCareer(
    "sustainability-data",
    "Sustainability Data & Analytics",
    "🔬",
    "Turn sustainability data into decisions.",
    "Sustainability data professionals build datasets, dashboards, models and tools that help organizations measure and improve environmental and social performance.",
    "Disclosure regulation and AI are accelerating demand for technical sustainability talent.",
    "very-high",
    "Excellent for anyone with a data or engineering background looking to switch.",
    {
      entry: ["Sustainability Data Analyst", "ESG Data Engineer", "Climate Tech Analyst"],
      mid: ["Senior Data Scientist, Climate", "Product Manager, Climate Tech", "GHG Data Lead"],
      senior: ["Head of Sustainability Data", "Director, Climate Analytics", "VP Product, Climate Tech"],
    },
    {
      beginner: { soft: ["Problem decomposition"], technical: ["Excel", "SQL basics", "Power BI or Tableau"] },
      intermediate: { soft: ["Product thinking"], technical: ["Python or R", "GHG Protocol", "Data modeling"] },
      advanced: { soft: ["Technical leadership"], technical: ["ML / forecasting", "Data architecture", "Carbon software platforms"] },
    },
    ["Excel", "SQL", "Python", "Power BI", "Tableau", "Watershed", "Persefoni", "dbt", "Snowflake"],
    { beginner: ["ghg-protocol", "google-da"], intermediate: ["powerbi-mc"], advanced: [] },
    [
      { title: "ESG data pipeline", description: "Build a small pipeline ingesting emissions data and producing a dashboard." },
      { title: "Open climate dataset analysis", description: "Analyze a public dataset (e.g. EDGAR or Climate TRACE) and publish insights." },
      { title: "Scope 3 estimator", description: "Build a simple Scope 3 spend-based emissions estimator in Python." },
    ],
    {
      days1to30: ["Complete Google Data Analytics intro modules", "Learn GHG Protocol basics", "Pick a climate dataset to explore"],
      days31to60: ["Build a Power BI sustainability dashboard", "Take a Python for data course", "Publish one analysis post"],
      days61to90: ["Build a portfolio repo on GitHub", "Apply to climate tech and ESG data roles"],
    },
    ["esg-reporting", "carbon-markets", "renewable-energy"]
  ),
  buildCareer(
    "sustainable-supply-chain",
    "Sustainable Supply Chains & Procurement",
    "🔗",
    "Decarbonize and ethicalize global value chains.",
    "Sustainable supply chain professionals work with suppliers to measure Scope 3 emissions, improve labor and environmental practices, and source responsibly.",
    "Scope 3 is the largest emissions bucket for most companies and is rapidly becoming a disclosure requirement.",
    "very-high",
    "Strong demand in consumer goods, fashion, food, tech, and industrial sectors.",
    {
      entry: ["Procurement Analyst", "Supply Chain Sustainability Analyst", "Supplier Engagement Associate"],
      mid: ["Sustainable Procurement Manager", "Scope 3 Lead", "Ethical Sourcing Manager"],
      senior: ["Director, Sustainable Supply Chain", "VP Procurement & Sustainability"],
    },
    {
      beginner: { soft: ["Relationship building"], technical: ["Excel", "Procurement basics"] },
      intermediate: { soft: ["Supplier negotiation"], technical: ["Scope 3 accounting", "Spend analysis", "EcoVadis or CDP Supply Chain"] },
      advanced: { soft: ["Strategic sourcing"], technical: ["Supply chain mapping platforms", "Audit & assurance"] },
    },
    ["Excel", "EcoVadis", "CDP Supply Chain", "SAP Ariba", "Sourcemap", "Power BI"],
    { beginner: ["ghg-protocol"], intermediate: ["cipsx", "gri-cert"], advanced: [] },
    [
      { title: "Supplier engagement plan", description: "Design a tiered engagement plan for a 200-supplier portfolio." },
      { title: "Scope 3 spend analysis", description: "Build a spend-based Scope 3 estimate and identify hotspots." },
      { title: "Supplier scorecard", description: "Design an ESG supplier scorecard with weighted criteria." },
    ],
    {
      days1to30: ["Read GHG Protocol Scope 3 standard", "Study EcoVadis methodology", "Map a real supply chain"],
      days31to60: ["Take CIPS Sustainable Procurement intro", "Build a spend-based Scope 3 model", "Network with 5 procurement professionals"],
      days61to90: ["Publish a supplier scorecard template", "Apply to procurement and supply chain roles"],
    },
    ["esg-reporting", "circular-economy", "sustainable-fashion"]
  ),
  buildCareer(
    "circular-economy",
    "Circular Economy & Waste Management",
    "♻️",
    "Design out waste — and design in regeneration.",
    "Circular economy professionals redesign products, business models and material flows to eliminate waste and keep resources in use at their highest value.",
    "Regulation (EU CEAP, EPR) and corporate strategy are converging on circular models.",
    "high",
    "Growing roles in design, packaging, materials, waste, and consulting.",
    {
      entry: ["Circular Economy Analyst", "Sustainability Consultant", "Packaging Sustainability Coordinator"],
      mid: ["Circular Design Lead", "EPR Compliance Manager", "Materials Innovation Manager"],
      senior: ["Head of Circularity", "Director, Sustainable Innovation"],
    },
    {
      beginner: { soft: ["Systems thinking"], technical: ["LCA basics", "Material flow literacy"] },
      intermediate: { soft: ["Cross-functional facilitation"], technical: ["LCA software (SimaPro, OpenLCA)", "EPR regulation"] },
      advanced: { soft: ["Strategy"], technical: ["Business model redesign", "Material passports"] },
    },
    ["SimaPro", "OpenLCA", "Ecochain", "Excel", "Figma"],
    { beginner: ["circular-elen"], intermediate: [], advanced: [] },
    [
      { title: "Circular redesign", description: "Redesign one everyday product using circular principles and document tradeoffs." },
      { title: "Mini LCA", description: "Run a streamlined LCA on a simple product with OpenLCA." },
      { title: "EPR readiness", description: "Assess a company's EPR readiness in one EU market." },
    ],
    {
      days1to30: ["Complete EMF 'Circular Economy in Cities'", "Read 'Cradle to Cradle'", "Map one product's material flow"],
      days31to60: ["Run a streamlined LCA", "Study EPR regulations in one region", "Reach out to 5 circular practitioners"],
      days61to90: ["Publish a circular redesign case study", "Apply to circular economy roles"],
    },
    ["sustainable-supply-chain", "sustainable-fashion", "environmental-consulting"]
  ),
  buildCareer(
    "biodiversity-conservation",
    "Nature, Biodiversity & Conservation",
    "🦋",
    "Protect and restore the living systems we depend on.",
    "Biodiversity and conservation professionals work on habitat protection, restoration, biodiversity credits, and the emerging TNFD nature disclosure framework.",
    "Nature is the next frontier of corporate sustainability and finance.",
    "growing",
    "Roles span NGOs, government, consultancies and increasingly corporates.",
    {
      entry: ["Conservation Officer", "Field Researcher", "Biodiversity Analyst"],
      mid: ["Program Manager", "Nature-Based Solutions Specialist", "TNFD Implementation Lead"],
      senior: ["Director of Conservation", "Head of Nature Strategy"],
    },
    {
      beginner: { soft: ["Field observation"], technical: ["Species ID basics", "GIS basics"] },
      intermediate: { soft: ["Community engagement"], technical: ["GIS / remote sensing", "Biodiversity monitoring"] },
      advanced: { soft: ["Program leadership"], technical: ["TNFD / SBTN", "Biodiversity credits"] },
    },
    ["QGIS", "ArcGIS", "Google Earth Engine", "iNaturalist", "Excel"],
    { beginner: ["gis-esri"], intermediate: [], advanced: [] },
    [
      { title: "Habitat baseline report", description: "Produce a baseline biodiversity report for a small site using public data." },
      { title: "TNFD pilot", description: "Apply the TNFD LEAP approach to one company in a high-impact sector." },
      { title: "Conservation grant proposal", description: "Draft a 5-page conservation project proposal." },
    ],
    {
      days1to30: ["Take Esri GIS Fundamentals", "Read TNFD framework summary", "Volunteer with a local conservation group"],
      days31to60: ["Learn QGIS basics", "Map a real habitat", "Connect with 5 conservation professionals"],
      days61to90: ["Publish a biodiversity case study", "Apply to NGO and consulting roles"],
    },
    ["climate-policy", "community-sustainability", "water-ocean"]
  ),
  buildCareer(
    "green-building",
    "Green Building & Urban Sustainability",
    "🏗️",
    "Design the buildings and cities of a low-carbon future.",
    "Green building professionals apply LEED, BREEAM, WELL and embodied-carbon practices to design, certify and operate sustainable buildings and urban developments.",
    "Cities account for ~70% of emissions; built environment decarbonization is non-negotiable.",
    "high",
    "Strong demand from architecture, engineering, real estate, and urban planning firms.",
    {
      entry: ["Sustainability Coordinator", "LEED Consultant", "Junior Energy Modeler"],
      mid: ["Senior Sustainability Consultant", "WELL AP", "Embodied Carbon Specialist"],
      senior: ["Director of Sustainability", "Principal Consultant"],
    },
    {
      beginner: { soft: ["Attention to detail"], technical: ["LEED Green Associate prep"] },
      intermediate: { soft: ["Client management"], technical: ["Energy modeling (IES, EnergyPlus)", "Embodied carbon (One Click LCA)"] },
      advanced: { soft: ["Project leadership"], technical: ["Net-zero retrofit", "Climate resilience"] },
    },
    ["AutoCAD", "Revit", "EnergyPlus", "One Click LCA", "IES VE", "QGIS"],
    { beginner: ["leed-ga"], intermediate: ["well-ap"], advanced: ["leed-ap"] },
    [
      { title: "LEED Green Associate study plan", description: "Create and execute a 6-week LEED GA study plan." },
      { title: "Net-zero retrofit concept", description: "Develop a high-level net-zero retrofit concept for a real building." },
      { title: "Embodied carbon comparison", description: "Compare embodied carbon for two structural systems." },
    ],
    {
      days1to30: ["Study LEED Green Associate handbook", "Tour a certified green building", "Read 'Drawdown' chapters on buildings"],
      days31to60: ["Sit the LEED GA exam", "Learn One Click LCA basics", "Reach out to 5 sustainability consultants"],
      days61to90: ["Apply to sustainability consultant roles", "Add LEED GA badge to LinkedIn"],
    },
    ["renewable-energy", "circular-economy", "environmental-consulting"]
  ),
  buildCareer(
    "environmental-consulting",
    "Environmental Consulting",
    "🧭",
    "Advise clients across industries on sustainability strategy and compliance.",
    "Environmental consultants help companies design strategies, comply with regulation, measure impacts and improve performance across ESG topics.",
    "Consulting is one of the most common entry points into sustainability for early-career and switchers.",
    "very-high",
    "Big 4, boutique and specialist firms are all hiring aggressively.",
    {
      entry: ["Sustainability Consultant", "ESG Associate", "Research Analyst"],
      mid: ["Senior Consultant", "Engagement Manager", "Subject Matter Expert"],
      senior: ["Partner", "Director", "Practice Lead"],
    },
    {
      beginner: { soft: ["Structured thinking", "Client communication"], technical: ["Excel", "PowerPoint", "Research"] },
      intermediate: { soft: ["Project management"], technical: ["GHG accounting", "ESG frameworks", "Financial modeling"] },
      advanced: { soft: ["Business development"], technical: ["Strategy frameworks", "Sector specialization"] },
    },
    ["Excel", "PowerPoint", "Power BI", "Carbon software", "GRI/SASB"],
    { beginner: ["ghg-protocol", "carbon-literacy"], intermediate: ["gri-cert", "chmm"], advanced: ["issp-csp", "sasb-fsa"] },
    [
      { title: "Sustainability strategy deck", description: "Build a 15-slide sustainability strategy for a mock client." },
      { title: "Net-zero roadmap", description: "Draft a net-zero roadmap for a mid-sized company." },
      { title: "ESG benchmarking", description: "Benchmark 3 peers on a sector ESG topic and present recommendations." },
    ],
    {
      days1to30: ["Study top 5 consulting frameworks", "Read 'Net Positive' by Polman & Winston", "Take Carbon Literacy"],
      days31to60: ["Practice 5 case interviews", "Build a sustainability strategy deck", "Network with 10 consultants"],
      days61to90: ["Apply to Big 4 and boutique sustainability consultancies", "Refresh CV with consulting framing"],
    },
    ["esg-reporting", "carbon-markets", "climate-policy"]
  ),
  buildCareer(
    "community-sustainability",
    "Sustainable Agriculture & Food Systems",
    "🌱",
    "Transform how we grow, distribute, and eat food.",
    "Sustainable food systems professionals work on regenerative agriculture, food security, sustainable sourcing, and community-led development.",
    "Food systems account for ~30% of emissions and are central to biodiversity, water and equity.",
    "growing",
    "Roles span NGOs, foundations, corporates, agri-startups and government.",
    {
      entry: ["Program Officer", "Sustainable Sourcing Analyst", "Field Coordinator"],
      mid: ["Regenerative Ag Specialist", "Food Systems Manager", "Impact Manager"],
      senior: ["Director of Food Systems", "Head of Sustainable Sourcing"],
    },
    {
      beginner: { soft: ["Community engagement"], technical: ["Agriculture literacy", "Excel"] },
      intermediate: { soft: ["Program design"], technical: ["MEL frameworks", "Supply chain mapping"] },
      advanced: { soft: ["Partnership building"], technical: ["Regenerative ag certification", "Agroforestry economics"] },
    },
    ["Excel", "QGIS", "KoboToolbox", "Power BI"],
    { beginner: ["circular-elen"], intermediate: ["gis-esri"], advanced: [] },
    [
      { title: "Regenerative farm case", description: "Profile a regenerative farm and quantify its outcomes." },
      { title: "Food systems map", description: "Map the food system of one city or region." },
      { title: "MEL framework", description: "Design a monitoring framework for a food security program." },
    ],
    {
      days1to30: ["Read 'Drawdown' food chapters", "Take EMF circularity course", "Volunteer with a food NGO"],
      days31to60: ["Complete a MEL or impact intro course", "Interview 5 practitioners", "Visit a farm or co-op"],
      days61to90: ["Publish a case study", "Apply to NGO and corporate food sustainability roles"],
    },
    ["biodiversity-conservation", "climate-policy", "circular-economy"]
  ),
];

export function getCareerBySlug(slug: string) {
  return careerPathsV2.find((c) => c.slug === slug);
}

export function getSkillBySlug(slug: string) {
  return skills.find((s) => s.slug === slug);
}

export function getCertById(id: string) {
  return certifications.find((c) => c.id === id);
}

export function getResourceById(id: string) {
  return resources.find((r) => r.id === id);
}
