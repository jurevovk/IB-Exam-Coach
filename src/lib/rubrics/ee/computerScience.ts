import type { EeRubricVersion } from "@/lib/rubrics/types";
import type { EeSubjectGuidance } from "@/lib/rubrics/ee/subjectGuidanceTypes";

type ComputerScienceEeGuidance = EeSubjectGuidance & {
  supportedTopics: [
    "algorithm design and complexity",
    "systems, networks, and security",
    "databases and data modelling",
    "software development and usability",
    "machine learning or artificial intelligence systems",
  ];
};

const supportedTopics: ComputerScienceEeGuidance["supportedTopics"] = [
  "algorithm design and complexity",
  "systems, networks, and security",
  "databases and data modelling",
  "software development and usability",
  "machine learning or artificial intelligence systems",
];

const stableComputerScienceExpectations = [
  "The topic should genuinely be Computer Science, with computational concepts or systems forming the main basis of the essay.",
  "Avoid essays that drift into general technology, social impact, or ITGS-style discussion without computational analysis.",
  "The research question should be sharply focused, clearly stated as a question, and narrow enough for meaningful treatment within the EE word limit.",
  "The essay should explain why the topic and research question are worth investigating in a Computer Science context.",
  "Methods should be appropriate, clearly explained, and connected to the research question.",
  "Authoritative sources should be selected and used with understanding; internet sources should be evaluated for validity.",
  "Experimental, programming, benchmarking, code-analysis, architecture-comparison, or data-modelling evidence can be highly relevant when tied to the research question.",
  "Technical terminology should be accurate, understandable, and used to show the student's own understanding rather than copied source language.",
  "Analysis of results, tables, graphs, or tests should explain underlying reasons and implications, not only describe what the results show.",
  "Conclusions should answer the research question and follow from technical evidence, with limitations or future research stated where relevant.",
];

export const legacyComputerScienceEeGuidance: ComputerScienceEeGuidance = {
  subjectKey: "computer-science",
  subject: "Computer Science",
  label: "Computer Science guidance applied",
  sourceNote:
    "Subject-specific Computer Science EE guidance from the 2017 assessment document is used as an interpretation layer for the selected EE rubric.",
  supportedTopics,
  scoringRule:
    "Use the pre-2027 EE rubric as the only scoring framework. Use this Computer Science guidance to decide what subject-specific evidence supports each pre-2027 criterion; do not create or average a second score.",
  gradingPriorities: [
    "Check whether the research question is narrow enough for a Computer Science investigation rather than a general technology essay.",
    "Reward precise technical terminology, correct explanation of computational concepts, and relevant source use.",
    "Look for evidence from implementation, experiments, benchmarks, code analysis, architecture comparison, or documented technical evaluation.",
    "Do not over-credit essays that describe tools or social impacts without computational analysis.",
    "Evaluate whether conclusions follow from technical evidence and acknowledge limitations such as dataset size, testing scope, hardware, security assumptions, or implementation constraints.",
  ],
  subjectEvidence: [
    "The title/topic should clearly indicate the Computer Science area, with underlying Computer Science forming the principal basis of the essay.",
    "The research question should be stated in the introduction, placed in context, and linked to a clearly described methodology.",
    "Planning should use a suitable range of authoritative sources such as literature, credible internet sources, expert input, experiments, or programming evidence.",
    "Source material should be incorporated to show the student's own understanding, not mainly reworded source content.",
    "Technical information from sources should be clarified or explained in simpler terms where needed and linked back to the research question.",
    "Arguments should be logically developed from directly relevant research rather than padded with too many loosely connected sources.",
    "Tables, graphs, benchmarks, or experimental results should be analysed and interpreted, not merely translated into words.",
    "Charts, images, tables, code evidence, raw data, and appendices should support the argument and be labelled, selected, and referenced carefully.",
    "Important method details needed to evaluate the investigation should be in the essay body, not only in appendices.",
  ],
  cautionFlags: [
    "If the topic is mainly about social impacts of technology, online behaviour, business use, or general IT without computational analysis, treat the Computer Science fit as weak.",
    "Small-scale surveys of classmates are usually weak Computer Science evidence unless they directly support a technical investigation.",
    "A journalistic or opinion-based essay with few technical facts should not receive high subject-specific credit.",
    "Overly technical language that is not explained clearly can weaken evidence of understanding.",
    "Citation and bibliography quality cannot be fully judged from pasted text alone; state this uncertainty when relevant.",
  ],
  reflectionGuidance: [
    "Reflection should explain decision-making and planning, including how the topic, method, and approach were chosen.",
    "Strong reflection discusses challenges, changes in thinking, skill development, conceptual understanding, and what the student would do differently.",
    "Do not treat a procedural description as strong engagement unless it shows critical, reflective thinking and clear student voice.",
  ],
};

export const mapped2027ComputerScienceEeGuidance: ComputerScienceEeGuidance = {
  subjectKey: "computer-science",
  subject: "Computer Science",
  label: "Computer Science guidance applied",
  sourceNote:
    "Stable subject-specific expectations from the 2017 Computer Science EE guidance are adapted for use with the first exams 2027 EE rubric.",
  supportedTopics,
  scoringRule:
    "Use the first exams 2027 EE rubric as the only scoring framework. Use this adapted Computer Science guidance only as a subject lens; do not reuse old criterion names, old descriptors, old caps, or old scoring logic.",
  gradingPriorities: stableComputerScienceExpectations,
  subjectEvidence: [
    "Look for a clearly computational research problem, not just a technology theme.",
    "Treat implementation, experiments, benchmarks, technical comparisons, code analysis, models, datasets, or system tests as useful evidence when they answer the research question.",
    "Check whether technical concepts and terminology are accurate and explained well enough for a non-specialist examiner to follow.",
    "Check whether source selection is authoritative and whether internet sources are treated critically.",
    "Check whether analysis explains why results occurred and what they mean for the research question.",
    "Check whether limitations such as testing scope, data size, hardware assumptions, security assumptions, implementation constraints, or algorithmic trade-offs are acknowledged.",
  ],
  cautionFlags: [
    "Do not award stronger 2027 rubric performance merely because the topic uses software or AI terminology; the essay needs Computer Science reasoning.",
    "Do not import pre-2027 criterion titles or mark caps into the 2027 scoring decision.",
    "Do not treat the 2017 Computer Science guidance as an official 2027 scoring rubric.",
    "If formatting, citation quality, appendices, or code files are missing from pasted text, state the uncertainty.",
  ],
  reflectionGuidance: [
    "When reflection/RPPF text is provided, use it to understand planning, decisions, challenges, and changes in thinking.",
    "When reflection/RPPF text is missing, Criterion E or its selected-rubric equivalent must remain not fully gradable if the selected rubric requires reflection evidence.",
  ],
};

export const getComputerScienceEeGuidance = (
  rubricVersion: EeRubricVersion
) =>
  rubricVersion === "first-exams-2027"
    ? mapped2027ComputerScienceEeGuidance
    : legacyComputerScienceEeGuidance;
