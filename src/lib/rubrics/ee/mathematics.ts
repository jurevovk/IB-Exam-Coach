import type { EeRubricVersion } from "@/lib/rubrics/types";
import type { EeSubjectGuidance } from "@/lib/rubrics/ee/subjectGuidanceTypes";

const stableMathematicsExpectations = [
  "The essay should make the mathematical focus, mathematical area, and techniques clear early.",
  "The research question should be sharply focused and should indicate the mathematical techniques or approach to be applied.",
  "Sources and methods should be sufficient, relevant, and connected to the research focus.",
  "The essay should be set out sequentially in the manner of good mathematical writing, with each section connected to the previous one.",
  "The student should do mathematics rather than merely describe mathematical ideas.",
  "Steps in algebra, proof, modelling, statistics, or other mathematical reasoning should be shown clearly enough to demonstrate understanding.",
  "Correct deductive reasoning, hypotheses, and mathematical models should be used where appropriate.",
  "Results should be interpreted and evaluated concisely rather than only reported.",
  "Proofs, diagrams, graphs, tables, formulae, and notation should support the argument without interrupting its development.",
  "Any mathematics or source material that is not original should be acknowledged clearly.",
];

export const legacyMathematicsEeGuidance: EeSubjectGuidance = {
  subjectKey: "mathematics",
  subject: "Mathematics",
  label: "Mathematics guidance applied",
  sourceNote:
    "Subject-specific Mathematics EE guidance from the 2017 assessment document is used as an interpretation layer for the selected EE rubric.",
  scoringRule:
    "Use the pre-2027 EE rubric as the only scoring framework. Use this Mathematics guidance to decide what subject-specific evidence supports each pre-2027 criterion; do not create or average a second score.",
  gradingPriorities: [
    "Check whether the essay's topic, aim, mathematical area, and techniques are clear early enough for the reader to understand the investigation.",
    "Reward a focused research question that supports systematic mathematical investigation within the EE word limit.",
    "Look for sufficient and relevant sources or methods that contribute directly to the mathematical research focus.",
    "Reward sequential mathematical structure where each section follows from and connects to the previous one.",
    "Prioritize visible student mathematical work: algebraic steps, proofs, models, statistical tests, calculations, or reasoned derivations.",
    "Do not over-credit essays that mainly describe mathematics without doing or applying it.",
    "Evaluate whether conclusions and evaluations follow from the mathematics actually shown.",
  ],
  subjectEvidence: [
    "The title or early introduction should clarify the topic, aim, mathematical areas, and mathematical techniques.",
    "The research question should indicate the mathematical techniques to be applied where possible.",
    "Sources consulted should be sufficient and each should contribute to the research focus.",
    "The argument should progress in a connected sequence rather than as disconnected mathematical facts.",
    "Students should show steps in mathematical reasoning to demonstrate that they understand what is happening.",
    "Conjectures that can readily be proved should be proved rather than merely quoted.",
    "Statistical or modelling work should include appropriate data handling, tests, interpretation, and evaluation.",
    "Graphs, diagrams, tables, formulae, and proofs should be placed and explained in ways that support the reader's understanding.",
    "Computer routines should appear only when necessary for understanding and should normally be treated as appendix material.",
  ],
  cautionFlags: [
    "If the essay is mainly historical, biographical, or descriptive with little student mathematics, treat the Mathematics fit as weak.",
    "Do not reward broad displays of advanced mathematics unless they are essential to the research question.",
    "A result quoted from a source is not the same as evidence of student mathematical work.",
    "If algebraic steps, proofs, data, diagrams, or notation are missing from pasted text, state the uncertainty.",
    "Citation and presentation quality cannot be fully judged from pasted text alone; state this uncertainty when relevant.",
  ],
  reflectionGuidance: [
    "Reflection should explain decisions about the mathematical topic, method, approach, and changes in direction.",
    "Strong reflection discusses challenges in mathematical understanding, modelling, proof, data handling, or presentation.",
    "Do not treat a procedural description as strong engagement unless it shows critical, reflective thinking and clear student voice.",
  ],
};

export const mapped2027MathematicsEeGuidance: EeSubjectGuidance = {
  subjectKey: "mathematics",
  subject: "Mathematics",
  label: "Mathematics guidance applied",
  sourceNote:
    "Stable subject-specific expectations from the 2017 Mathematics EE guidance are adapted for use with the first exams 2027 EE rubric.",
  scoringRule:
    "Use the first exams 2027 EE rubric as the only scoring framework. Use this adapted Mathematics guidance only as a subject lens; do not reuse old criterion names, old descriptors, old caps, or old scoring logic.",
  gradingPriorities: stableMathematicsExpectations,
  subjectEvidence: [
    "Look for a genuinely mathematical investigation, not just a description of a mathematical topic.",
    "Check whether the research question and introduction make the mathematical focus and techniques visible.",
    "Treat algebraic work, proofs, models, statistical tests, calculations, diagrams, tables, and notation as useful evidence when they answer the research question.",
    "Check whether reasoning is sequential, deductive where appropriate, and clear enough for the reader to follow.",
    "Check whether results are evaluated and interpreted, not only presented.",
    "Check whether limitations in modelling assumptions, data quality, chosen techniques, or proof scope are acknowledged.",
  ],
  cautionFlags: [
    "Do not award stronger 2027 rubric performance merely because the essay uses mathematical terminology; the essay needs visible mathematical reasoning.",
    "Do not import pre-2027 criterion titles or mark caps into the 2027 scoring decision.",
    "Do not treat the 2017 Mathematics guidance as an official 2027 scoring rubric.",
    "If formatting, notation, citations, appendices, datasets, proofs, or computer routines are missing from pasted text, state the uncertainty.",
  ],
  reflectionGuidance: [
    "When reflection/RPPF text is provided, use it to understand planning, decisions, challenges, and changes in mathematical thinking.",
    "When reflection/RPPF text is missing, Criterion E or its selected-rubric equivalent must remain not fully gradable if the selected rubric requires reflection evidence.",
  ],
};

export const getMathematicsEeGuidance = (rubricVersion: EeRubricVersion) =>
  rubricVersion === "first-exams-2027"
    ? mapped2027MathematicsEeGuidance
    : legacyMathematicsEeGuidance;
