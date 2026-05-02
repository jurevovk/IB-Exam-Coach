import type { EeRubric } from "@/lib/rubrics/types";

export const pre2027EeRubric: EeRubric = {
  version: "pre-2027",
  label: "Pre-2027 EE rubric",
  totalMarks: 34,
  criteria: [
    {
      id: "A",
      title: "Focus and method",
      maxMarks: 6,
      focus:
        "Research question, topic focus, chosen methodology, and whether the method is appropriate for the essay.",
      bands: [
        { range: "0", descriptor: "The focus and method are unclear or absent." },
        {
          range: "1-2",
          descriptor:
            "The topic is identified but the research question or method is only partly focused.",
        },
        {
          range: "3-4",
          descriptor:
            "The research question is mostly clear and the method is generally appropriate.",
        },
        {
          range: "5-6",
          descriptor:
            "The research question is sharply focused and the method is purposeful and well explained.",
        },
      ],
    },
    {
      id: "B",
      title: "Knowledge and understanding",
      maxMarks: 6,
      focus:
        "Subject knowledge, relevant terminology, source use, and understanding of the academic context.",
      bands: [
        { range: "0", descriptor: "Little relevant knowledge is shown." },
        {
          range: "1-2",
          descriptor:
            "Knowledge is limited, descriptive, or only loosely connected to the research question.",
        },
        {
          range: "3-4",
          descriptor:
            "Relevant knowledge and terminology are used with generally clear understanding.",
        },
        {
          range: "5-6",
          descriptor:
            "Knowledge is accurate, well selected, and consistently supports the investigation.",
        },
      ],
    },
    {
      id: "C",
      title: "Critical thinking",
      maxMarks: 12,
      focus:
        "Research, analysis, discussion, evaluation, argument, and conclusion in response to the research question.",
      bands: [
        { range: "0", descriptor: "Critical thinking is absent or irrelevant." },
        {
          range: "1-3",
          descriptor:
            "Research and analysis are limited, mostly descriptive, or weakly connected.",
        },
        {
          range: "4-6",
          descriptor:
            "There is some analysis and argument, but evaluation or development is uneven.",
        },
        {
          range: "7-9",
          descriptor:
            "Research is effective and analysis supports a mostly coherent argument.",
        },
        {
          range: "10-12",
          descriptor:
            "Analysis is sustained, evaluative, and leads to a reasoned conclusion.",
        },
      ],
    },
    {
      id: "D",
      title: "Presentation",
      maxMarks: 4,
      focus:
        "Formal presentation, structure, academic conventions, citations, bibliography, and readability.",
      bands: [
        { range: "0", descriptor: "Presentation is unacceptable or missing." },
        {
          range: "1-2",
          descriptor:
            "Presentation is partly effective but has issues with structure or conventions.",
        },
        {
          range: "3-4",
          descriptor:
            "Presentation is effective, well structured, and mostly follows academic conventions.",
        },
      ],
    },
    {
      id: "E",
      title: "Engagement",
      maxMarks: 6,
      focus:
        "Student reflection on decision-making, research process, challenges, and intellectual engagement.",
      bands: [
        { range: "0", descriptor: "Reflection evidence is absent or irrelevant." },
        {
          range: "1-2",
          descriptor:
            "Reflection is mostly descriptive and gives limited evidence of engagement.",
        },
        {
          range: "3-4",
          descriptor:
            "Reflection shows clear engagement with choices and challenges in the process.",
        },
        {
          range: "5-6",
          descriptor:
            "Reflection is analytical, personal, and shows strong intellectual initiative.",
        },
      ],
    },
  ],
  gradeBoundaries: [
    { grade: "A", min: 27, max: 34 },
    { grade: "B", min: 21, max: 26 },
    { grade: "C", min: 14, max: 20 },
    { grade: "D", min: 7, max: 13 },
    { grade: "E", min: 0, max: 6 },
  ],
};
