export type PracticeQuestion = {
  id: string;
  subject: string;
  paper: string;
  topic: string;
  marks: number;
  commandTerm: string;
  difficulty: "easy" | "medium" | "hard";
  prompt: string;
};

export const questionBank: PracticeQuestion[] = [
  {
    id: "econ-p1-market-01",
    subject: "economics",
    paper: "Paper 1",
    topic: "Market Intervention",
    marks: 15,
    commandTerm: "Evaluate",
    difficulty: "medium",
    prompt:
      "Evaluate the impact of a price ceiling on the affordability of rental housing.",
  },
  {
    id: "econ-p2-trade-01",
    subject: "economics",
    paper: "Paper 2",
    topic: "International Trade",
    marks: 20,
    commandTerm: "Discuss",
    difficulty: "hard",
    prompt:
      "Discuss the benefits and drawbacks of trade protectionism for a developing economy.",
  },
  {
    id: "geo-p1-urban-01",
    subject: "geography",
    paper: "Paper 1",
    topic: "Urban Environments",
    marks: 10,
    commandTerm: "Explain",
    difficulty: "easy",
    prompt:
      "Explain how urban land values change from the CBD to the rural-urban fringe.",
  },
  {
    id: "geo-p2-climate-01",
    subject: "geography",
    paper: "Paper 2",
    topic: "Climate Change",
    marks: 15,
    commandTerm: "To what extent",
    difficulty: "medium",
    prompt:
      "To what extent can urban planning reduce the impacts of climate-related hazards?",
  },
  {
    id: "engb-p1-media-01",
    subject: "english-b",
    paper: "Paper 1",
    topic: "Media",
    marks: 15,
    commandTerm: "Compare",
    difficulty: "medium",
    prompt:
      "Compare how two different media texts persuade teenagers to adopt healthy habits.",
  },
  {
    id: "math-aa-p2-prob-01",
    subject: "math-aa",
    paper: "Paper 2",
    topic: "Probability",
    marks: 10,
    commandTerm: "Solve",
    difficulty: "medium",
    prompt:
      "Solve a probability problem involving conditional events and interpret the result.",
  },
  {
    id: "cs-p1-networks-01",
    subject: "computer-science",
    paper: "Paper 1",
    topic: "Networks",
    marks: 15,
    commandTerm: "Explain",
    difficulty: "easy",
    prompt:
      "Explain how packet switching improves the efficiency of data transmission.",
  },
  {
    id: "bio-p2-ecology-01",
    subject: "biology",
    paper: "Paper 2",
    topic: "Ecology",
    marks: 20,
    commandTerm: "Evaluate",
    difficulty: "hard",
    prompt:
      "Evaluate the effectiveness of protected areas in conserving biodiversity.",
  },
  {
    id: "chem-p1-kinetics-01",
    subject: "chemistry",
    paper: "Paper 1",
    topic: "Kinetics",
    marks: 10,
    commandTerm: "Explain",
    difficulty: "easy",
    prompt:
      "Explain how temperature affects the rate of a chemical reaction using collision theory.",
  },
  {
    id: "phys-p2-waves-01",
    subject: "physics",
    paper: "Paper 2",
    topic: "Waves",
    marks: 15,
    commandTerm: "Discuss",
    difficulty: "medium",
    prompt:
      "Discuss how wave phenomena support the evidence for the wave-particle duality of light.",
  },
];
