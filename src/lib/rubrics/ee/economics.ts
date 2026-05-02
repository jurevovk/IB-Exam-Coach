import type { EeSubjectGuidance } from "@/lib/rubrics/ee/subjectGuidanceTypes";
import type { EeRubricVersion } from "@/lib/rubrics/types";

const stableEconomicsExpectations = [
  "The topic should be genuinely economics-focused, with economic theory, models, evidence, and terminology driving the essay.",
  "Avoid essays that drift into business management, psychology, politics, or general current affairs without economic analysis.",
  "The issue should normally be contemporary and recent enough for economic evidence to be meaningful, ideally within the last five years.",
  "The research question should be sharply focused, answerable, and framed through relevant economic theory.",
  "Macroeconomic or global economy topics should be narrowed by geography, sector, market, policy, or time period.",
  "Economic tools, diagrams, models, and data should be used to explain and evaluate rather than decorate the essay.",
  "Analysis should connect theory to evidence and should go beyond description of events or policies.",
  "Interim conclusions can strengthen the line of argument, especially after substantial sections of analysis.",
  "Evaluation should consider assumptions, stakeholders, short-run and long-run effects, alternative views, and limitations in data or method.",
  "The final conclusion should answer the research question and follow from the economic evidence presented.",
];

export const legacyEconomicsEeGuidance: EeSubjectGuidance = {
  subjectKey: "economics",
  subject: "Economics",
  label: "Economics guidance applied",
  sourceNote:
    "Subject-specific Economics EE guidance is used as an interpretation layer for the selected EE rubric.",
  scoringRule:
    "Use the pre-2027 EE rubric as the only scoring framework. Use this Economics guidance to decide what subject-specific evidence supports each pre-2027 criterion; do not create or average a second score.",
  gradingPriorities: [
    "Check whether the research question is narrow enough for a focused economics investigation.",
    "Reward relevant economic theory, diagrams, terminology, and evidence that directly answer the research question.",
    "Look for a contemporary economic issue with a clear market, policy, country, sector, or stakeholder focus.",
    "Do not over-credit descriptive current-affairs writing that lacks economic modelling or analytical depth.",
    "Evaluate whether conclusions and interim conclusions follow from economic evidence, not opinion.",
  ],
  subjectEvidence: [
    "The introduction should define the economic issue, research question, context, and scope.",
    "The essay should apply relevant microeconomics, macroeconomics, international economics, or development theory accurately.",
    "Diagrams, models, or data should be explained in relation to the research question.",
    "Evidence should come from credible sources and should be current enough for the issue being studied.",
    "The analysis should link theory to real-world evidence, stakeholder effects, assumptions, and limitations.",
    "Macroeconomic or global economy topics should identify the relevant economy, sector, policy, time period, and data limits.",
    "Conclusions should directly answer the research question and acknowledge uncertainty where evidence is limited.",
  ],
  cautionFlags: [
    "If the essay mainly describes a company, management strategy, consumer psychology, politics, or social impacts, treat the Economics fit as weak unless economic theory is central.",
    "If the research question is too broad, such as an entire national economy or global problem without a narrow lens, treat focus as weak.",
    "If diagrams are present but not explained, applied, or evaluated, do not treat them as strong economics analysis.",
    "If data, references, figures, or article context are missing from pasted text, state the uncertainty.",
    "Citation quality cannot be fully judged from pasted text alone; state this uncertainty when relevant.",
  ],
  reflectionGuidance: [
    "Reflection should explain how the student refined the economics focus, sources, method, and argument.",
    "Strong reflection discusses changes in thinking about economic theory, evidence quality, data limits, or stakeholder evaluation.",
    "Do not treat procedural description as strong engagement unless it shows critical decision-making and student voice.",
  ],
};

export const mapped2027EconomicsEeGuidance: EeSubjectGuidance = {
  subjectKey: "economics",
  subject: "Economics",
  label: "Economics guidance applied",
  sourceNote:
    "Stable subject-specific Economics expectations are adapted for use with the first exams 2027 EE rubric.",
  scoringRule:
    "Use the first exams 2027 EE rubric as the only scoring framework. Use this adapted Economics guidance only as a subject lens; do not reuse old criterion names, old descriptors, old caps, or old scoring logic.",
  gradingPriorities: stableEconomicsExpectations,
  subjectEvidence: [
    "Look for a focused economics research problem rather than a broad current-affairs topic.",
    "Treat relevant diagrams, economic models, data, source evaluation, and stakeholder analysis as useful evidence when they answer the research question.",
    "Check whether the essay uses economic terminology accurately and explains theory in context.",
    "Check whether analysis moves from theory to evidence to evaluation, rather than listing facts or policies.",
    "Check whether macro/global topics are narrowed to a clear location, sector, market, policy, and time frame.",
    "Check whether interim and final conclusions follow from the evidence and economic reasoning.",
  ],
  cautionFlags: [
    "Do not award stronger 2027 rubric performance merely because the essay uses economics vocabulary; it needs economic reasoning.",
    "Do not import pre-2027 criterion titles or mark caps into the 2027 scoring decision.",
    "Do not treat Economics subject guidance as an official 2027 scoring rubric.",
    "If formatting, citations, diagrams, datasets, or appendices are missing from pasted text, state the uncertainty.",
  ],
  reflectionGuidance: [
    "When reflection/RPPF text is provided, use it to understand planning, source choices, evidence limits, and changes in economic thinking.",
    "When reflection/RPPF text is missing, Criterion E or its selected-rubric equivalent must remain not fully gradable if the selected rubric requires reflection evidence.",
  ],
};

export const getEconomicsEeGuidance = (rubricVersion: EeRubricVersion) =>
  rubricVersion === "first-exams-2027"
    ? mapped2027EconomicsEeGuidance
    : legacyEconomicsEeGuidance;
