import type { EeRubric } from "@/lib/rubrics/types";

export const firstExams2027EeRubric: EeRubric = {
  version: "first-exams-2027",
  label: "First exams 2027 EE rubric",
  totalMarks: 30,
  criteria: [
    {
      id: "A",
      title: "Research design",
      maxMarks: 5,
      focus:
        "Clarity of research question, rationale, scope, and alignment between the question and the chosen method.",
      bands: [
        { range: "0", descriptor: "The research design is unclear or absent." },
        {
          range: "1-2",
          descriptor:
            "The question or scope is broad, and the design only partly supports investigation.",
        },
        {
          range: "3-4",
          descriptor:
            "The question, scope, and method are mostly coherent and suitable.",
        },
        {
          range: "5",
          descriptor:
            "The research design is precise, coherent, and strongly suited to the inquiry.",
        },
      ],
    },
    {
      id: "B",
      title: "Knowledge and understanding",
      maxMarks: 5,
      focus:
        "Use of subject concepts, disciplinary terminology, context, and relevant academic or technical sources.",
      bands: [
        { range: "0", descriptor: "Relevant subject understanding is not shown." },
        {
          range: "1-2",
          descriptor:
            "Understanding is limited or applied inconsistently to the research question.",
        },
        {
          range: "3-4",
          descriptor:
            "Understanding is generally accurate and supports the investigation.",
        },
        {
          range: "5",
          descriptor:
            "Understanding is accurate, well selected, and integrated throughout.",
        },
      ],
    },
    {
      id: "C",
      title: "Analysis and evaluation",
      maxMarks: 10,
      focus:
        "Quality of analysis, interpretation of evidence, evaluation of findings, and sustained argument.",
      bands: [
        { range: "0", descriptor: "Analysis and argument are absent." },
        {
          range: "1-3",
          descriptor:
            "The essay is mainly descriptive with limited analysis or weak evidence use.",
        },
        {
          range: "4-6",
          descriptor:
            "Some analysis is present, but argument and evaluation are uneven.",
        },
        {
          range: "7-8",
          descriptor:
            "Analysis is clear and evidence is used to support a coherent argument.",
        },
        {
          range: "9-10",
          descriptor:
            "Analysis is sustained, evaluative, and convincingly answers the question.",
        },
      ],
    },
    {
      id: "D",
      title: "Communication and presentation",
      maxMarks: 4,
      focus:
        "Organization, academic communication, citation practice, bibliography, and adherence to formal expectations.",
      bands: [
        { range: "0", descriptor: "Communication and presentation are inadequate." },
        {
          range: "1-2",
          descriptor:
            "Communication is understandable but uneven, with presentation or referencing issues.",
        },
        {
          range: "3-4",
          descriptor:
            "Communication is clear and formal presentation supports the argument.",
        },
      ],
    },
    {
      id: "E",
      title: "Reflection and engagement",
      maxMarks: 6,
      focus:
        "Reflection on planning, decisions, challenges, changes in thinking, and engagement with the research process.",
      bands: [
        {
          range: "0",
          descriptor: "Reflection evidence is missing or does not support assessment.",
        },
        {
          range: "1-2",
          descriptor:
            "Reflection is descriptive and gives little insight into decisions or learning.",
        },
        {
          range: "3-4",
          descriptor:
            "Reflection explains choices, challenges, and development during the process.",
        },
        {
          range: "5-6",
          descriptor:
            "Reflection is analytical, specific, and shows strong ownership of the process.",
        },
      ],
    },
  ],
  gradeBoundaries: [
    { grade: "A", min: 24, max: 30 },
    { grade: "B", min: 19, max: 23 },
    { grade: "C", min: 13, max: 18 },
    { grade: "D", min: 7, max: 12 },
    { grade: "E", min: 0, max: 6 },
  ],
};
