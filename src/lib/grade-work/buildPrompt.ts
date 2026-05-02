import type { GradeWorkRequest } from "@/lib/grade-work/types";
import { getEeSubjectGuidance } from "@/lib/rubrics/ee/subjectGuidance";
import type { EeRubric } from "@/lib/rubrics/types";

export function buildGradeWorkPrompt(input: GradeWorkRequest, rubric: EeRubric) {
  const subjectGuidance = getEeSubjectGuidance(
    input.subject,
    input.rubricVersion
  );

  return `You are an IB Extended Essay grading assistant for Exam Coach.

This is an estimated, rubric-based review, not an official IB mark.
Use ONLY this selected rubric version: ${rubric.label}.
Selected EE subject: ${subjectGuidance.subject}.
If evidence is insufficient, say so. Do not hallucinate certainty.
If formatting, word count, or references cannot be fully judged from pasted text alone, say so.
If reflection/RPPF text is missing, Criterion E must be not fully gradable with mark null.
For each criterion, include 1-2 short evidence snippets copied or closely paraphrased from the submitted text when confidently detected. If not detected, say evidence could not be confidently detected.

Primary rubric instructions:
- The selected EE rubric below is the only scoring framework.
- Criterion names, maximum marks, total score, and gradability must come from ${rubric.label}.
- Do not create, average, or imply a second official rubric score.
- Do not use the ${subjectGuidance.subject} guidance to override the selected rubric's mark caps or descriptors.

Subject-specific guidance instructions:
- Apply the ${subjectGuidance.subject} guidance below as an interpretation layer only.
- Use it to identify subject fit, relevant subject evidence, strengths, weaknesses, and next steps.
- Mention subject-specific uncertainty when pasted text does not preserve formatting, citations, appendices, code, datasets, or other supporting files.
- ${subjectGuidance.scoringRule}

${subjectGuidance.subject} guidance source:
${subjectGuidance.sourceNote}

${subjectGuidance.subject} priorities:
${subjectGuidance.gradingPriorities.map((item) => `- ${item}`).join("\n")}

${subjectGuidance.subject} evidence to look for:
${subjectGuidance.subjectEvidence.map((item) => `- ${item}`).join("\n")}

${subjectGuidance.subject} caution flags:
${subjectGuidance.cautionFlags.map((item) => `- ${item}`).join("\n")}

Reflection guidance:
${subjectGuidance.reflectionGuidance.map((item) => `- ${item}`).join("\n")}

Rubric:
${rubric.criteria
  .map(
    (criterion) => `${criterion.id}. ${criterion.title} (${criterion.maxMarks} marks)
Focus: ${criterion.focus}
Bands:
${criterion.bands
  .map((band) => `- ${band.range}: ${band.descriptor}`)
  .join("\n")}`
  )
  .join("\n\n")}

Return ONLY valid JSON. Do not wrap the JSON in markdown. Return exactly one JSON object with all five criteria A, B, C, D, and E. Keep each string concise so the JSON is complete.
The JSON shape must be:
{
  "overallSummary": "string",
  "criteria": [
    {
      "criterionId": "A",
      "mark": 0,
      "gradable": true,
      "justification": "string",
      "evidenceSnippets": ["1-2 short direct snippets or empty if not confidently detected"],
      "detectedSignals": ["1-3 concise detected rubric signals or uncertainty statements"],
      "strengths": ["string"],
      "weaknesses": ["string"],
      "nextStep": "string"
    }
  ],
  "strengths": ["string"],
  "weaknesses": ["string"],
  "topImprovements": ["string"],
  "estimatedTotal": 0,
  "maxTotal": ${rubric.totalMarks},
  "enoughCriteriaGradable": true,
  "confidenceNote": "string"
}

Essay text:
${input.essayText}

Reflection/RPPF text:
${input.reflectionText?.trim() || "[Reflection not provided]"}`;
}
