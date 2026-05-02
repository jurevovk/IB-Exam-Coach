import type { ProfileSubject } from "@/lib/storage";
import { economicsUnit1Lessons } from "@/lib/economics/unit1Lessons";
import type {
  CurriculumVersion,
  ResolvedSubjectBlueprint,
  SubjectBlueprint,
} from "@/lib/learn/types";

const computerScienceThrough2026: CurriculumVersion = {
  id: "cs-through-2026",
  label: "Computer Science syllabus through 2026",
  sessionNote:
    "Used for May/Nov 2026 planning. The 2027+ course should be expanded from the newer syllabus before detailed topic content is added.",
  paperStructure: [
    "Paper 1: core topics",
    "Paper 2: option topic",
    "Paper 3: case study",
    "Internal assessment: computational solution",
  ],
  options: [
    "Databases",
    "Modelling and simulation",
    "Web science",
    "Object-oriented programming",
  ],
  topicGroups: [
    {
      id: "core-systems",
      title: "Core systems",
      description:
        "Foundations for understanding computer systems, hardware, and networking.",
      subtopics: [
        {
          id: "system-fundamentals",
          title: "System fundamentals",
          description:
            "System design, users, documentation, testing, and implementation decisions.",
          syllabusStatus: "seeded",
          practiceTags: ["Any"],
        },
        {
          id: "computer-organization",
          title: "Computer organization",
          description:
            "Hardware, memory, processing, data representation, and machine-level ideas.",
          syllabusStatus: "seeded",
          practiceTags: ["Any"],
        },
        {
          id: "networks",
          title: "Networks",
          description:
            "Data transmission, protocols, network models, security, and reliability.",
          syllabusStatus: "seeded",
          practiceTags: ["Networks"],
        },
      ],
    },
    {
      id: "programming-problem-solving",
      title: "Programming and problem solving",
      description:
        "Algorithmic thinking, programming constructs, testing, and computational solutions.",
      subtopics: [
        {
          id: "computational-thinking",
          title: "Computational thinking",
          description:
            "Decomposition, abstraction, algorithm design, traces, and problem-solving strategy.",
          syllabusStatus: "seeded",
          practiceTags: ["Any"],
        },
        {
          id: "programming-practice",
          title: "Programming practice",
          description:
            "Variables, control flow, data structures, debugging, and maintainable code.",
          syllabusStatus: "seeded",
          practiceTags: ["Any"],
        },
      ],
    },
    {
      id: "hl-extension",
      title: "HL extension",
      description:
        "Higher level topics that extend systems thinking and abstract data handling.",
      level: "hl",
      subtopics: [
        {
          id: "abstract-data-structures",
          title: "Abstract data structures",
          description:
            "Stacks, queues, linked structures, trees, and how data organization affects solutions.",
          level: "hl",
          syllabusStatus: "seeded",
          practiceTags: ["Any"],
        },
        {
          id: "resource-management-control",
          title: "Resource management and control",
          description:
            "Scheduling, resources, control systems, and reliability trade-offs.",
          level: "hl",
          syllabusStatus: "seeded",
          practiceTags: ["Any"],
        },
      ],
    },
  ],
};

const computerScience2027Plus: CurriculumVersion = {
  id: "cs-2027-plus",
  label: "Computer Science 2027+ structure",
  sessionNote:
    "Version-aware shell for post-2026 sessions. Detailed topic statements should be filled from the official 2027+ syllabus before full coverage tracking is claimed.",
  paperStructure: [
    "Assessment structure pending detailed syllabus expansion",
    "Practice can still target computational thinking, systems, programming, and IA skills",
  ],
  topicGroups: [
    {
      id: "stable-computational-foundations",
      title: "Stable computational foundations",
      description:
        "Broad Computer Science foundations kept as an extension point until the official 2027+ topic map is entered.",
      subtopics: [
        {
          id: "computational-thinking",
          title: "Computational thinking",
          description:
            "Problem decomposition, abstraction, algorithms, testing, and evaluation.",
          syllabusStatus: "extension-point",
          practiceTags: ["Any"],
        },
        {
          id: "systems-networks",
          title: "Systems and networks",
          description:
            "Systems, data movement, security assumptions, and technical trade-offs.",
          syllabusStatus: "extension-point",
          practiceTags: ["Networks"],
        },
        {
          id: "programming-data",
          title: "Programming and data",
          description:
            "Programming evidence, data handling, implementation quality, and analysis.",
          syllabusStatus: "extension-point",
          practiceTags: ["Any"],
        },
      ],
    },
  ],
};

const mathAaCurrent: CurriculumVersion = {
  id: "math-aa-current",
  label: "Mathematics AA current syllabus",
  sessionNote:
    "Seeded with the main Mathematics: Analysis and Approaches topic families. Detailed subtopic statements can be expanded incrementally.",
  paperStructure: [
    "Paper 1: no calculator",
    "Paper 2: calculator allowed",
    "Paper 3: HL extension paper",
    "Internal assessment: mathematical exploration",
  ],
  topicGroups: [
    {
      id: "number-algebra-functions",
      title: "Algebra and functions",
      description:
        "Algebraic manipulation, sequences, functions, equations, and transformations.",
      subtopics: [
        {
          id: "algebraic-methods",
          title: "Algebraic methods",
          description:
            "Manipulation, equations, inequalities, sequences, and proof-style reasoning.",
          syllabusStatus: "seeded",
          practiceTags: ["Any"],
        },
        {
          id: "functions",
          title: "Functions",
          description:
            "Function notation, transformations, inverses, composites, and graph interpretation.",
          syllabusStatus: "seeded",
          practiceTags: ["Any"],
        },
      ],
    },
    {
      id: "geometry-trigonometry",
      title: "Geometry and trigonometry",
      description:
        "Geometric reasoning, trigonometric functions, identities, and applications.",
      subtopics: [
        {
          id: "trigonometry",
          title: "Trigonometry",
          description:
            "Trigonometric equations, graphs, identities, and modelling contexts.",
          syllabusStatus: "seeded",
          practiceTags: ["Any"],
        },
        {
          id: "vectors-geometry",
          title: "Vectors and geometry",
          description:
            "Vector methods, geometric representation, and spatial reasoning.",
          syllabusStatus: "seeded",
          practiceTags: ["Any"],
        },
      ],
    },
    {
      id: "statistics-calculus",
      title: "Statistics, probability, and calculus",
      description:
        "Data, probability, differentiation, integration, and mathematical modelling.",
      subtopics: [
        {
          id: "probability-statistics",
          title: "Probability and statistics",
          description:
            "Probability models, distributions, data interpretation, and statistical reasoning.",
          syllabusStatus: "seeded",
          practiceTags: ["Probability"],
        },
        {
          id: "calculus",
          title: "Calculus",
          description:
            "Limits, differentiation, integration, optimization, and area/accumulation problems.",
          syllabusStatus: "seeded",
          practiceTags: ["Any"],
        },
      ],
    },
  ],
};

const economicsCurrent: CurriculumVersion = {
  id: "economics-current",
  label: "Economics syllabus structure",
  sessionNote:
    "Seeded with the main IB Economics learning sequence: Introduction, Microeconomics, Macroeconomics, and the Global Economy. Topic notes are original study scaffolds, not copied course notes.",
  paperStructure: [
    "Paper 1: extended-response essays",
    "Paper 2: data-response using real-world extracts",
    "Paper 3: HL policy/data/calculation paper",
    "Internal assessment: three commentaries from different units",
  ],
  topicGroups: [
    {
      id: "intro-economics",
      title: "1. Introduction to Economics",
      description:
        "Core economic thinking: social science methods, scarcity, choices, concepts, systems, PPC, circular flow, and economic thought.",
      subtopics: economicsUnit1Lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.shortTitle,
        description: lesson.summary,
        syllabusStatus: "seeded" as const,
        lessonId: lesson.id,
        practiceTags: [lesson.practiceTopic],
      })),
    },
    {
      id: "microeconomics",
      title: "2. Microeconomics",
      description:
        "Markets, prices, intervention, efficiency, equity, and market failure.",
      subtopics: [
        {
          id: "demand",
          title: "Demand",
          description:
            "Analyze demand curves, non-price determinants, shifts, movements, and consumer behavior.",
          syllabusStatus: "seeded",
          practiceTags: ["Demand"],
        },
        {
          id: "supply",
          title: "Supply",
          description:
            "Analyze supply curves, producer incentives, costs, shifts, and market adjustment.",
          syllabusStatus: "seeded",
          practiceTags: ["Supply"],
        },
        {
          id: "market-equilibrium",
          title: "Market equilibrium",
          description:
            "Use demand and supply together to explain equilibrium, disequilibrium, shortages, surpluses, and price signals.",
          syllabusStatus: "seeded",
          practiceTags: ["Market equilibrium"],
        },
        {
          id: "elasticities",
          title: "Elasticities",
          description:
            "Apply PED, YED, XED, and PES to explain responsiveness, revenue effects, and policy consequences.",
          syllabusStatus: "seeded",
          practiceTags: ["Elasticities"],
        },
        {
          id: "government-intervention",
          title: "Government intervention",
          description:
            "Evaluate taxes, subsidies, price controls, and regulation using diagrams, stakeholders, and welfare effects.",
          syllabusStatus: "seeded",
          practiceTags: ["Government intervention"],
        },
        {
          id: "market-failure",
          title: "Market failure",
          description:
            "Analyze externalities, public goods, common access resources, asymmetric information, and policy responses.",
          syllabusStatus: "seeded",
          practiceTags: ["Market failure"],
        },
      ],
    },
    {
      id: "macroeconomics",
      title: "3. Macroeconomics",
      description:
        "Economic activity, macro objectives, aggregate demand/supply, and policy trade-offs.",
      subtopics: [
        {
          id: "economic-activity",
          title: "Measuring economic activity",
          description:
            "Interpret GDP, growth, national income, circular flow, and limitations of economic indicators.",
          syllabusStatus: "seeded",
          practiceTags: ["Economic activity"],
        },
        {
          id: "ad-as",
          title: "Aggregate demand and aggregate supply",
          description:
            "Use AD/AS models to explain inflationary gaps, recessionary gaps, growth, and supply shocks.",
          syllabusStatus: "seeded",
          practiceTags: ["AD-AS"],
        },
        {
          id: "macroeconomic-objectives",
          title: "Macroeconomic objectives",
          description:
            "Analyze growth, low unemployment, low stable inflation, equity, sustainability, and external balance.",
          syllabusStatus: "seeded",
          practiceTags: ["Macroeconomic objectives"],
        },
        {
          id: "demand-side-policy",
          title: "Demand-side policies",
          description:
            "Evaluate fiscal and monetary policy with diagrams, transmission mechanisms, time lags, and stakeholder effects.",
          syllabusStatus: "seeded",
          practiceTags: ["Demand-side policies"],
        },
        {
          id: "supply-side-policy",
          title: "Supply-side policies",
          description:
            "Evaluate interventionist and market-based supply-side policies using growth, equity, inflation, and employment impacts.",
          syllabusStatus: "seeded",
          practiceTags: ["Supply-side policies"],
        },
      ],
    },
    {
      id: "global-economy",
      title: "4. The Global Economy",
      description:
        "International trade, exchange rates, integration, development, and global policy choices.",
      subtopics: [
        {
          id: "international-trade",
          title: "International trade",
          description:
            "Analyze comparative advantage, gains from trade, protectionism, and trade policy evaluation.",
          syllabusStatus: "seeded",
          practiceTags: ["International Trade"],
        },
        {
          id: "exchange-rates",
          title: "Exchange rates",
          description:
            "Explain floating and managed exchange rates, currency changes, and impacts on stakeholders.",
          syllabusStatus: "seeded",
          practiceTags: ["Exchange rates"],
        },
        {
          id: "balance-of-payments",
          title: "Balance of payments",
          description:
            "Interpret current account issues, financial flows, and policy responses to imbalances.",
          syllabusStatus: "seeded",
          practiceTags: ["Balance of payments"],
        },
        {
          id: "economic-integration",
          title: "Economic integration",
          description:
            "Evaluate trade agreements, customs unions, monetary unions, and integration trade-offs.",
          syllabusStatus: "seeded",
          practiceTags: ["Economic integration"],
        },
        {
          id: "development",
          title: "Economic development",
          description:
            "Analyze development indicators, barriers to development, poverty, inequality, and policy strategies.",
          syllabusStatus: "seeded",
          practiceTags: ["Development"],
        },
      ],
    },
    {
      id: "hl-paper-3-extension",
      title: "HL policy and calculation extension",
      description:
        "HL-focused quantitative and policy reasoning used for Paper 3 style tasks.",
      level: "hl",
      subtopics: [
        {
          id: "hl-calculation-data-response",
          title: "HL calculations and data-response",
          description:
            "Practice calculations, interpretation, policy recommendation, and evidence-based justification.",
          level: "hl",
          syllabusStatus: "seeded",
          practiceTags: ["HL Paper 3"],
        },
        {
          id: "hl-policy-recommendation",
          title: "Policy recommendation",
          description:
            "Construct justified policy recommendations using data, economic theory, stakeholders, and limitations.",
          level: "hl",
          syllabusStatus: "seeded",
          practiceTags: ["Policy recommendation"],
        },
      ],
    },
  ],
};

export const subjectBlueprints: Record<string, SubjectBlueprint> = {
  economics: {
    subjectId: "economics",
    displayName: "Economics",
    levels: ["sl", "hl"],
    aiExplainSupport: true,
    practiceEntryPoints: ["Paper 1", "Paper 2", "Paper 3 HL", "IA commentary"],
    resourceLinks: [
      { label: "Practice", href: "/practice" },
      { label: "Economics IA Studio", href: "/grade-work-app/ia" },
      { label: "Economics EE", href: "/grade-work-app/ee" },
    ],
    versions: [economicsCurrent],
  },
  "computer-science": {
    subjectId: "computer-science",
    displayName: "Computer Science",
    levels: ["sl", "hl"],
    aiExplainSupport: true,
    practiceEntryPoints: ["Paper 1", "Paper 2", "Paper 3", "IA"],
    resourceLinks: [
      { label: "Practice", href: "/practice" },
      { label: "Grade IA/EE work", href: "/grade-work-app" },
    ],
    versions: [computerScienceThrough2026, computerScience2027Plus],
  },
  "math-aa": {
    subjectId: "math-aa",
    displayName: "Mathematics AA",
    levels: ["sl", "hl"],
    aiExplainSupport: true,
    practiceEntryPoints: ["Paper 1", "Paper 2", "Paper 3", "Exploration"],
    resourceLinks: [
      { label: "Practice", href: "/practice" },
      { label: "Ask AI", href: "/ask-ai" },
    ],
    versions: [mathAaCurrent],
  },
};

const has2027Session = (examSession: string) => /\b202[7-9]\b|203\d/.test(examSession);

export const resolveCurriculumVersion = (
  blueprint: SubjectBlueprint,
  examSession: string
) => {
  if (blueprint.subjectId === "computer-science") {
    return has2027Session(examSession)
      ? blueprint.versions.find((version) => version.id === "cs-2027-plus") ??
          blueprint.versions[0]
      : blueprint.versions.find((version) => version.id === "cs-through-2026") ??
          blueprint.versions[0];
  }

  return blueprint.versions[0];
};

export const createFallbackBlueprint = (
  subject: ProfileSubject
): SubjectBlueprint => ({
  subjectId: subject.key,
  displayName: subject.name,
  levels: ["sl", "hl"],
  aiExplainSupport: true,
  practiceEntryPoints: ["Practice setup", "Ask AI", "My Plan"],
  versions: [
    {
      id: `${subject.key}-extension`,
      label: `${subject.name} outline pending`,
      sessionNote:
        "This subject is selected in the profile, but detailed syllabus topics have not been seeded yet.",
      paperStructure: [
        "Syllabus blueprint pending",
        "Use Practice and Ask AI while detailed topic coverage is added",
      ],
      topicGroups: [
        {
          id: "extension-point",
          title: "Syllabus outline pending",
          description:
            "Add official topic groups and subtopics here as the subject blueprint is expanded.",
          subtopics: [
            {
              id: "general-review",
              title: "General review",
              description:
                "Use this as a temporary planning bucket until the subject syllabus is configured.",
              syllabusStatus: "extension-point",
              practiceTags: ["Any"],
            },
          ],
        },
      ],
    },
  ],
});

export const resolveSubjectBlueprint = (
  subject: ProfileSubject,
  examSession: string
): ResolvedSubjectBlueprint => {
  const blueprint = subjectBlueprints[subject.key] ?? createFallbackBlueprint(subject);

  return {
    profileSubject: subject,
    blueprint,
    version: resolveCurriculumVersion(blueprint, examSession),
    isFallback: !subjectBlueprints[subject.key],
  };
};

export const resolveSelectedSubjectBlueprints = (
  subjects: ProfileSubject[],
  examSession: string
) => subjects.map((subject) => resolveSubjectBlueprint(subject, examSession));
