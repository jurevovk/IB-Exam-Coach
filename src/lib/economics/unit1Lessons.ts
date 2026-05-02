export type EconomicsQuickCheck = {
  id: string;
  prompt: string;
  acceptedAnswers: string[];
  feedback: string;
};

export type EconomicsLessonSection = {
  heading: string;
  body: string;
  bullets?: string[];
  examples?: string[];
};

export type EconomicsLesson = {
  id: string;
  unitId: "intro-economics";
  unitTitle: string;
  title: string;
  shortTitle: string;
  summary: string;
  practiceTopic: string;
  learningGoals: string[];
  sections: EconomicsLessonSection[];
  keyTakeaways: string[];
  examples: string[];
  commonMistakes: string[];
  glossary: Array<{
    term: string;
    definition: string;
  }>;
  quickChecks: EconomicsQuickCheck[];
  examMiniTask: {
    commandTerm: string;
    prompt: string;
    successCriteria: string[];
  };
};

export const economicsUnit1Lessons: EconomicsLesson[] = [
  {
    id: "economics-as-social-science",
    unitId: "intro-economics",
    unitTitle: "1. Introduction to Economics",
    title: "1.1 Economics as a Social Science",
    shortTitle: "Economics as a Social Science",
    summary:
      "Economics studies human choices under scarcity. Because people, firms, and governments cannot be placed in a laboratory like chemicals, economists use simplified models and evidence to explain likely relationships.",
    practiceTopic: "Economics as a social science",
    learningGoals: [
      "Explain why economics is considered a social science.",
      "Describe how models simplify reality and why assumptions matter.",
      "Distinguish causation from correlation in economic claims.",
      "Explain why economists choose some variables and hold others constant.",
    ],
    sections: [
      {
        heading: "Economics studies choices made by people",
        body:
          "Economics is a social science because it studies behaviour in societies: how households choose, how firms produce, and how governments respond to problems. It uses evidence and logical models, but its predictions are rarely perfect because human behaviour changes with incentives, expectations, culture, and policy.",
        bullets: [
          "The core problem is scarcity: resources are limited while wants are broad.",
          "Economists look for patterns in decisions, not fixed laws of nature.",
          "Good economic analysis combines theory with real-world evidence.",
        ],
      },
      {
        heading: "Models simplify reality",
        body:
          "A model removes detail so one relationship can be studied clearly. A demand and supply diagram, for example, does not show every buyer and seller; it shows the main forces that explain price and quantity.",
        bullets: [
          "Assumptions make the model usable.",
          "Simplification helps isolate the key relationship.",
          "A model is useful when it clarifies thinking, not when it pretends to include everything.",
        ],
        examples: [
          "A PPC shows production choices using only two goods.",
          "A circular flow model shows income movement without listing every transaction.",
        ],
      },
      {
        heading: "Causation is stronger than correlation",
        body:
          "Two variables can move together without one causing the other. Economists therefore ask whether there is a convincing mechanism, whether other variables could explain the pattern, and whether evidence supports the theory.",
        bullets: [
          "Correlation means two things move together.",
          "Causation means one factor directly helps produce a result.",
          "Better analysis explains the chain of reasoning between cause and effect.",
        ],
      },
    ],
    keyTakeaways: [
      "Economics is evidence-based, but it studies people, so uncertainty matters.",
      "Models are deliberate simplifications, not complete copies of reality.",
      "Assumptions and variable choice shape the usefulness of an economic argument.",
    ],
    examples: [
      "If income rises and demand for restaurant meals rises, an economist still checks whether price, tastes, or population also changed.",
      "A government may model how a tax affects consumption while holding other conditions constant.",
    ],
    commonMistakes: [
      "Writing that an economic model is wrong because it is simplified.",
      "Treating correlation as proof of causation.",
      "Forgetting to explain why a chosen variable matters.",
    ],
    glossary: [
      {
        term: "Model",
        definition:
          "A simplified representation used to explain or predict economic behaviour.",
      },
      {
        term: "Assumption",
        definition:
          "A condition accepted for the model so the main relationship can be studied.",
      },
      {
        term: "Causation",
        definition: "A relationship where one factor helps bring about another.",
      },
    ],
    quickChecks: [
      {
        id: "science-type",
        prompt: "Economics is mainly what type of science?",
        acceptedAnswers: ["social science", "a social science"],
        feedback:
          "Correct: economics studies choices and behaviour in societies.",
      },
      {
        id: "model-purpose",
        prompt: "What do economic models deliberately do to reality?",
        acceptedAnswers: ["simplify it", "simplify reality", "simplification"],
        feedback:
          "Correct: models remove detail so a relationship can be studied.",
      },
      {
        id: "correlation",
        prompt:
          "If two variables move together, what word describes that weaker relationship?",
        acceptedAnswers: ["correlation", "correlated"],
        feedback:
          "Correct: correlation is not the same as proven causation.",
      },
    ],
    examMiniTask: {
      commandTerm: "Explain",
      prompt:
        "Explain why economists use models even though models simplify reality.",
      successCriteria: [
        "Define or describe an economic model.",
        "Explain one benefit of simplification.",
        "Mention one limitation or assumption.",
      ],
    },
  },
  {
    id: "micro-vs-macro",
    unitId: "intro-economics",
    unitTitle: "1. Introduction to Economics",
    title: "1.2 Microeconomics vs Macroeconomics",
    shortTitle: "Microeconomics vs Macroeconomics",
    summary:
      "Microeconomics focuses on individual markets and decision makers. Macroeconomics studies the economy as a whole, including growth, inflation, unemployment, and national income.",
    practiceTopic: "Microeconomics vs macroeconomics",
    learningGoals: [
      "Separate microeconomic issues from macroeconomic issues.",
      "Give examples of each area of study.",
      "Explain how government can intervene in both micro and macro contexts.",
    ],
    sections: [
      {
        heading: "Microeconomics looks at smaller units",
        body:
          "Microeconomics studies households, firms, individual markets, prices, and resource allocation. It asks how buyers and sellers respond to incentives and how well markets allocate scarce resources.",
        examples: [
          "The market for electric cars.",
          "The effect of a sugar tax on soft drink consumption.",
          "How a subsidy changes the price of public transport.",
        ],
      },
      {
        heading: "Macroeconomics looks at the whole economy",
        body:
          "Macroeconomics studies economy-wide outcomes. It asks whether total output is rising, whether prices are stable, whether unemployment is low, and whether living standards are improving.",
        examples: [
          "A recession causing unemployment to rise.",
          "Central bank interest rates affecting inflation.",
          "Government spending used to increase aggregate demand.",
        ],
      },
      {
        heading: "Government appears in both",
        body:
          "In microeconomics, government often changes incentives in a specific market. In macroeconomics, government and central banks try to influence economy-wide objectives such as growth, price stability, employment, equity, and sustainability.",
      },
    ],
    keyTakeaways: [
      "Microeconomics: individual markets and decision makers.",
      "Macroeconomics: whole-economy outcomes and policy objectives.",
      "Government intervention can target a single market or the national economy.",
    ],
    examples: [
      "A minimum wage is micro when studying one labour market, but it can have macro implications if it affects national unemployment or inflation.",
    ],
    commonMistakes: [
      "Calling every government policy macroeconomic.",
      "Forgetting that micro decisions can add up to macro outcomes.",
      "Using macro words like GDP when the question asks about one market.",
    ],
    glossary: [
      {
        term: "Microeconomics",
        definition:
          "The study of individual markets, firms, households, prices, and allocation.",
      },
      {
        term: "Macroeconomics",
        definition:
          "The study of whole-economy performance and policy objectives.",
      },
    ],
    quickChecks: [
      {
        id: "market-study",
        prompt: "Studying the market for coffee is microeconomics or macroeconomics?",
        acceptedAnswers: ["microeconomics", "micro", "micro economics"],
        feedback: "Correct: one market is a microeconomic focus.",
      },
      {
        id: "inflation-study",
        prompt: "Studying national inflation is microeconomics or macroeconomics?",
        acceptedAnswers: ["macroeconomics", "macro", "macro economics"],
        feedback: "Correct: inflation is an economy-wide issue.",
      },
      {
        id: "policy-role",
        prompt: "Who can intervene in both micro and macroeconomic problems?",
        acceptedAnswers: ["government", "the government", "governments"],
        feedback: "Correct: government policy can target markets or the whole economy.",
      },
    ],
    examMiniTask: {
      commandTerm: "Distinguish",
      prompt:
        "Distinguish between microeconomics and macroeconomics using one example of each.",
      successCriteria: [
        "Define both terms.",
        "Use one market-level example.",
        "Use one economy-wide example.",
      ],
    },
  },
  {
    id: "nine-central-concepts",
    unitId: "intro-economics",
    unitTitle: "1. Introduction to Economics",
    title: "1.3 The Nine Central Concepts",
    shortTitle: "Nine Central Concepts",
    summary:
      "IB Economics uses nine central concepts to frame analysis. They help students move beyond definitions and connect theory to real decisions, trade-offs, and stakeholder impacts.",
    practiceTopic: "Nine central concepts",
    learningGoals: [
      "Define each of the nine central concepts in student-friendly language.",
      "Use concepts to frame economic explanations and evaluations.",
      "Connect concepts to stakeholders and policy choices.",
    ],
    sections: [
      {
        heading: "Concepts are lenses for analysis",
        body:
          "A concept is a recurring idea that helps organize economic thinking. In exams and IA work, concepts help explain why an issue matters and what trade-offs are involved.",
      },
      {
        heading: "The nine concepts",
        body:
          "The nine concepts are scarcity, choice, efficiency, equity, economic well-being, sustainability, change, interdependence, and intervention.",
        bullets: [
          "Scarcity: limited resources cannot satisfy every want.",
          "Choice: decision makers select between alternatives.",
          "Efficiency: resources are used with minimal waste.",
          "Equity: outcomes are considered in terms of fairness.",
          "Economic well-being: living standards and quality of life.",
          "Sustainability: meeting current needs without damaging future capacity.",
          "Change: economic conditions and behaviour evolve over time.",
          "Interdependence: decisions by one group affect others.",
          "Intervention: government or institutions act to influence outcomes.",
        ],
      },
      {
        heading: "Using concepts well",
        body:
          "A strong answer does not just name a concept. It uses the concept to clarify the issue. For example, a carbon tax can be linked to intervention, sustainability, efficiency, and equity depending on the argument.",
      },
    ],
    keyTakeaways: [
      "Concepts help structure analysis rather than replace theory.",
      "One issue can connect to multiple concepts.",
      "The best concept choice depends on the question and stakeholders.",
    ],
    examples: [
      "A subsidy for renewable energy links to intervention, sustainability, change, and efficiency.",
      "A food price ceiling links to equity, choice, scarcity, and possible inefficiency.",
    ],
    commonMistakes: [
      "Listing concepts without applying them.",
      "Assuming one concept is always the correct answer.",
      "Using equity and equality as if they mean exactly the same thing.",
    ],
    glossary: [
      {
        term: "Efficiency",
        definition:
          "Using scarce resources in a way that minimizes waste and maximizes useful output.",
      },
      {
        term: "Equity",
        definition:
          "Fairness in economic outcomes, opportunities, or access to resources.",
      },
      {
        term: "Interdependence",
        definition:
          "A situation where decisions by one group affect other groups.",
      },
    ],
    quickChecks: [
      {
        id: "limited-resources",
        prompt: "Which central concept means resources are limited?",
        acceptedAnswers: ["scarcity"],
        feedback: "Correct: scarcity is the starting point of economic choice.",
      },
      {
        id: "fairness",
        prompt: "Which concept is most closely linked to fairness?",
        acceptedAnswers: ["equity"],
        feedback: "Correct: equity focuses on fairness.",
      },
      {
        id: "government-action",
        prompt: "Which concept describes government action to influence outcomes?",
        acceptedAnswers: ["intervention"],
        feedback: "Correct: intervention is deliberate action in an economy or market.",
      },
      {
        id: "future-needs",
        prompt: "Which concept asks whether future needs can still be met?",
        acceptedAnswers: ["sustainability"],
        feedback: "Correct: sustainability considers long-term consequences.",
      },
    ],
    examMiniTask: {
      commandTerm: "Apply",
      prompt:
        "Apply two central concepts to a policy that reduces plastic pollution.",
      successCriteria: [
        "Name two relevant concepts.",
        "Explain how each concept connects to the policy.",
        "Include one stakeholder impact.",
      ],
    },
  },
  {
    id: "factors-of-production",
    unitId: "intro-economics",
    unitTitle: "1. Introduction to Economics",
    title: "1.4 Factors of Production",
    shortTitle: "Factors of Production",
    summary:
      "Production uses four broad resource categories: land, labour, capital, and enterprise. Each factor earns a form of income and contributes differently to goods and services.",
    practiceTopic: "Factors of production",
    learningGoals: [
      "Identify the four factors of production.",
      "Match factors of production to their factor incomes.",
      "Distinguish goods from services using simple examples.",
    ],
    sections: [
      {
        heading: "The four factors",
        body:
          "Factors of production are the resources used to produce output. They are grouped as land, labour, capital, and enterprise.",
        bullets: [
          "Land includes natural resources such as soil, water, minerals, and forests.",
          "Labour is human effort, including physical and mental work.",
          "Capital is human-made equipment, machinery, buildings, and infrastructure used to produce more output.",
          "Enterprise organizes the other factors and takes the risk of production.",
        ],
      },
      {
        heading: "Factor income",
        body:
          "Each factor earns an income. Land earns rent, labour earns wages, capital earns interest, and enterprise earns profit.",
      },
      {
        heading: "Goods and services",
        body:
          "Goods are physical products such as phones, food, or bicycles. Services are activities such as tutoring, healthcare, banking, or transport.",
      },
    ],
    keyTakeaways: [
      "Production requires resources, not just money.",
      "Capital in economics means productive equipment, not simply cash.",
      "Enterprise is the organizing and risk-taking factor.",
    ],
    examples: [
      "A bakery uses land for its site, labour from workers, capital such as ovens, and enterprise from the owner.",
      "A bus ride is a service, while the bus itself is a capital good.",
    ],
    commonMistakes: [
      "Writing that capital only means financial money.",
      "Confusing enterprise with labour.",
      "Forgetting that services are also economic output.",
    ],
    glossary: [
      {
        term: "Factor income",
        definition: "The payment earned by a factor of production.",
      },
      {
        term: "Capital",
        definition:
          "Human-made resources used to produce goods and services.",
      },
      {
        term: "Enterprise",
        definition:
          "The ability to organize production and take business risk.",
      },
    ],
    quickChecks: [
      {
        id: "rent",
        prompt: "What factor income is earned by land?",
        acceptedAnswers: ["rent"],
        feedback: "Correct: land earns rent.",
      },
      {
        id: "wages",
        prompt: "What factor income is earned by labour?",
        acceptedAnswers: ["wages", "wage"],
        feedback: "Correct: labour earns wages.",
      },
      {
        id: "risk",
        prompt: "Which factor organizes production and takes risk?",
        acceptedAnswers: ["enterprise", "entrepreneurship"],
        feedback: "Correct: enterprise organizes resources and accepts risk.",
      },
    ],
    examMiniTask: {
      commandTerm: "Explain",
      prompt:
        "Explain how the four factors of production are used by a firm producing bicycles.",
      successCriteria: [
        "Mention all four factors.",
        "Use bicycle production examples.",
        "Connect at least one factor to factor income.",
      ],
    },
  },
  {
    id: "scarcity-choice-opportunity-cost",
    unitId: "intro-economics",
    unitTitle: "1. Introduction to Economics",
    title: "1.5 Scarcity, Choice, and Opportunity Cost",
    shortTitle: "Scarcity, Choice, and Opportunity Cost",
    summary:
      "The basic economic problem is that wants exceed available resources. This forces choices, and every choice carries an opportunity cost: the next best alternative given up.",
    practiceTopic: "Scarcity and opportunity cost",
    learningGoals: [
      "Explain the basic economic problem.",
      "Distinguish needs, wants, free goods, and economic goods.",
      "Calculate or identify opportunity cost in simple choices.",
      "Apply scarcity and choice to stakeholder decisions.",
    ],
    sections: [
      {
        heading: "The basic economic problem",
        body:
          "People have needs and wants, but resources are limited. Because not every want can be satisfied, individuals, firms, and governments must choose how resources are used.",
      },
      {
        heading: "Opportunity cost",
        body:
          "Opportunity cost is the value of the next best alternative forgone. It is not every option given up; it is the best alternative that could have been chosen instead.",
        examples: [
          "If a student spends one hour revising Economics instead of Mathematics, the opportunity cost is the lost Mathematics revision.",
          "If a government builds a hospital instead of a road, the opportunity cost is the road project forgone.",
        ],
      },
      {
        heading: "Economic goods and free goods",
        body:
          "Economic goods are scarce, so they involve choice and opportunity cost. Free goods are available in such abundance that no opportunity cost is involved at the point of use, though truly free goods are rare in real economies.",
      },
    ],
    keyTakeaways: [
      "Scarcity makes choice unavoidable.",
      "Opportunity cost is the next best alternative forgone.",
      "Economic goods are scarce; free goods do not require sacrifice at the point of use.",
    ],
    examples: [
      "A household choosing between rent and a holiday faces scarcity of income.",
      "A firm choosing between hiring workers and buying machinery faces a production trade-off.",
    ],
    commonMistakes: [
      "Saying opportunity cost is all alternatives given up.",
      "Treating wants and needs as identical.",
      "Ignoring stakeholders when discussing scarcity.",
    ],
    glossary: [
      {
        term: "Need",
        definition: "Something essential for survival or basic living.",
      },
      {
        term: "Want",
        definition: "Something desired but not essential for survival.",
      },
      {
        term: "Opportunity cost",
        definition: "The next best alternative forgone when a choice is made.",
      },
    ],
    quickChecks: [
      {
        id: "basic-problem",
        prompt: "What problem exists because wants exceed available resources?",
        acceptedAnswers: ["scarcity", "the basic economic problem"],
        feedback: "Correct: scarcity creates the basic economic problem.",
      },
      {
        id: "opportunity-cost",
        prompt: "Opportunity cost is the next best alternative what?",
        acceptedAnswers: ["forgone", "given up", "sacrificed"],
        feedback: "Correct: it is the next best alternative given up.",
      },
      {
        id: "economic-good",
        prompt: "A scarce product that involves opportunity cost is what type of good?",
        acceptedAnswers: ["economic good", "an economic good"],
        feedback: "Correct: economic goods are scarce.",
      },
    ],
    examMiniTask: {
      commandTerm: "Explain",
      prompt:
        "Explain how scarcity leads to opportunity cost for one household and one government.",
      successCriteria: [
        "Define scarcity.",
        "Define opportunity cost.",
        "Use one household and one government example.",
      ],
    },
  },
  {
    id: "economic-systems",
    unitId: "intro-economics",
    unitTitle: "1. Introduction to Economics",
    title: "1.6 Economic Systems",
    shortTitle: "Economic Systems",
    summary:
      "Economic systems answer three allocation questions: what to produce, how to produce, and for whom to produce. Real economies sit on a spectrum between market and planned coordination.",
    practiceTopic: "Economic systems",
    learningGoals: [
      "Explain the three basic allocation questions.",
      "Compare free market, planned, and mixed economies.",
      "Identify the role of prices, government, and ownership in each system.",
    ],
    sections: [
      {
        heading: "Three questions every economy must answer",
        body:
          "Because resources are scarce, every economy must decide what goods and services to produce, how production will happen, and who receives the output.",
      },
      {
        heading: "Free market and planned systems",
        body:
          "In a free market system, private decision makers and prices guide resource allocation. In a planned economy, the state makes the major production and distribution decisions.",
        bullets: [
          "Free markets emphasize choice, competition, private ownership, and price signals.",
          "Planned economies emphasize state direction, public ownership, and central targets.",
        ],
      },
      {
        heading: "Mixed economies are the real-world norm",
        body:
          "Most economies combine market forces with government intervention. Governments may provide public goods, regulate firms, redistribute income, or correct market failure while still allowing private markets to operate.",
      },
    ],
    keyTakeaways: [
      "Economic systems answer what, how, and for whom to produce.",
      "Market systems rely more on prices and private choice.",
      "Mixed economies combine markets with government intervention.",
    ],
    examples: [
      "Healthcare may be mostly state-provided in one country and mostly private in another.",
      "A mixed economy may allow private supermarkets while government funds public schools.",
    ],
    commonMistakes: [
      "Assuming any real economy is purely free market or purely planned.",
      "Forgetting the distribution question: for whom to produce.",
      "Describing systems without linking them to scarcity.",
    ],
    glossary: [
      {
        term: "Free market economy",
        definition:
          "A system where prices and private decisions guide most resource allocation.",
      },
      {
        term: "Planned economy",
        definition:
          "A system where government directs major production and allocation decisions.",
      },
      {
        term: "Mixed economy",
        definition:
          "A system combining market activity with government intervention.",
      },
    ],
    quickChecks: [
      {
        id: "three-questions",
        prompt: "Name one of the three basic economic questions.",
        acceptedAnswers: [
          "what to produce",
          "how to produce",
          "for whom to produce",
          "what",
          "how",
          "for whom",
        ],
        feedback: "Correct: economies must answer what, how, and for whom.",
      },
      {
        id: "price-signals",
        prompt: "Which system relies most on price signals?",
        acceptedAnswers: ["free market", "market economy", "free market economy"],
        feedback: "Correct: market economies use prices to guide choices.",
      },
      {
        id: "real-world",
        prompt: "Most real economies are best described as what type of economy?",
        acceptedAnswers: ["mixed", "mixed economy", "mixed economies"],
        feedback: "Correct: most economies combine markets and government.",
      },
    ],
    examMiniTask: {
      commandTerm: "Compare",
      prompt:
        "Compare how a free market economy and a planned economy answer the question of what to produce.",
      successCriteria: [
        "Refer to prices or consumer demand for markets.",
        "Refer to government planning for planned economies.",
        "Use one clear example.",
      ],
    },
  },
  {
    id: "ppc-circular-flow",
    unitId: "intro-economics",
    unitTitle: "1. Introduction to Economics",
    title: "1.7 PPC and Circular Flow of Income",
    shortTitle: "PPC and Circular Flow",
    summary:
      "The PPC shows production trade-offs and opportunity cost. The circular flow shows how income moves between households and firms, with injections and leakages changing the level of activity.",
    practiceTopic: "PPC and circular flow",
    learningGoals: [
      "Interpret points on, inside, and outside a PPC.",
      "Explain constant and increasing opportunity cost.",
      "Explain PPC shifts caused by changes in resources or technology.",
      "Describe injections, leakages, and interdependence in the circular flow.",
    ],
    sections: [
      {
        heading: "Production possibilities curve",
        body:
          "A PPC shows the maximum combinations of two goods or services an economy can produce when resources and technology are fixed. It makes scarcity, choice, opportunity cost, and efficiency visible.",
        bullets: [
          "Points on the curve are productively efficient.",
          "Points inside the curve show unemployed or inefficiently used resources.",
          "Points outside the curve are currently unattainable.",
        ],
      },
      {
        heading: "Opportunity cost on a PPC",
        body:
          "A straight PPC suggests constant opportunity cost. A bowed-out PPC suggests increasing opportunity cost because resources are not equally suited to producing both goods.",
      },
      {
        heading: "Circular flow of income",
        body:
          "The circular flow model shows households providing factors of production to firms and receiving income. Firms produce goods and services bought by households. In a more complete model, injections add spending and leakages remove spending.",
        bullets: [
          "Injections include investment, government spending, and exports.",
          "Leakages include savings, taxes, and imports.",
          "The model highlights interdependence between sectors.",
        ],
      },
    ],
    keyTakeaways: [
      "The PPC is a model of trade-offs, efficiency, and growth.",
      "Outward PPC shifts show increased productive potential.",
      "Circular flow links households, firms, government, banks, and external trade.",
    ],
    examples: [
      "A natural disaster may shift a PPC inward by reducing productive resources.",
      "An increase in exports is an injection into the circular flow.",
    ],
    commonMistakes: [
      "Calling a point inside the PPC unattainable instead of inefficient.",
      "Forgetting that an outward shift is about potential output, not automatically actual output.",
      "Mixing up injections and leakages.",
    ],
    glossary: [
      {
        term: "PPC",
        definition:
          "A model showing maximum possible output combinations with fixed resources and technology.",
      },
      {
        term: "Injection",
        definition:
          "Spending entering the circular flow, such as investment, government spending, or exports.",
      },
      {
        term: "Leakage",
        definition:
          "Income leaving the circular flow, such as savings, taxes, or imports.",
      },
    ],
    quickChecks: [
      {
        id: "inside-ppc",
        prompt: "A point inside the PPC shows inefficient use of what?",
        acceptedAnswers: ["resources", "resource", "factors of production"],
        feedback: "Correct: resources are unemployed or used inefficiently.",
      },
      {
        id: "outside-ppc",
        prompt: "A point outside the PPC is currently what?",
        acceptedAnswers: ["unattainable", "not attainable", "impossible"],
        feedback: "Correct: it cannot be produced with current resources and technology.",
      },
      {
        id: "injection",
        prompt: "Name one injection in the circular flow.",
        acceptedAnswers: ["investment", "government spending", "exports", "export"],
        feedback: "Correct: I, G, and X are injections.",
      },
      {
        id: "leakage",
        prompt: "Name one leakage from the circular flow.",
        acceptedAnswers: ["savings", "saving", "taxes", "tax", "imports", "import"],
        feedback: "Correct: S, T, and M are leakages.",
      },
    ],
    examMiniTask: {
      commandTerm: "Analyze",
      prompt:
        "Analyze how improved technology could affect an economy's PPC and circular flow of income.",
      successCriteria: [
        "Explain the outward PPC shift.",
        "Link technology to productive potential.",
        "Mention one circular-flow effect such as investment, income, or output.",
      ],
    },
  },
  {
    id: "positive-normative-economic-thought",
    unitId: "intro-economics",
    unitTitle: "1. Introduction to Economics",
    title: "1.8 Positive vs Normative Economics and Economic Thought",
    shortTitle: "Positive, Normative, and Economic Thought",
    summary:
      "Positive economics tests what is, while normative economics argues what should be. Economic thought has changed over time as economists challenged assumptions about markets, value, government, behaviour, and sustainability.",
    practiceTopic: "Positive and normative economics",
    learningGoals: [
      "Distinguish positive and normative statements.",
      "Explain hypotheses, theories, empirical research, and ceteris paribus.",
      "Recognize limits of rational decision-making assumptions.",
      "Summarize major shifts in economic thought.",
    ],
    sections: [
      {
        heading: "Positive and normative economics",
        body:
          "Positive economics focuses on statements that can be tested with evidence. Normative economics involves value judgements about what should happen.",
        examples: [
          "Positive: A tax on petrol is likely to reduce quantity demanded.",
          "Normative: The government should increase taxes on petrol.",
        ],
      },
      {
        heading: "Hypotheses, theories, and ceteris paribus",
        body:
          "Economists form hypotheses, test them with data, and build theories when evidence supports a pattern. Ceteris paribus means other things are held constant so one relationship can be studied.",
      },
      {
        heading: "Economic thought changes",
        body:
          "Economic ideas have developed through debate. Classical writers such as Adam Smith emphasized markets, specialization, and self-interest. Later ideas explored utility, marginal decision-making, Say's law, Marx's critique of capitalism, Keynesian demand management, monetarist and supply-side arguments, and newer behavioural and circular-economy approaches.",
        bullets: [
          "Classical ideas: markets and specialization can coordinate activity.",
          "Utility and marginal thinking: decisions often depend on extra benefit and extra cost.",
          "Marx: capitalism creates conflict and unequal power relations.",
          "Keynes: government may need to manage demand during downturns.",
          "Monetarists and supply-side economists: money, incentives, and productive capacity matter.",
          "Behavioural and circular-economy ideas: people are not always fully rational, and sustainability must be built into economic systems.",
        ],
      },
    ],
    keyTakeaways: [
      "Positive statements can be tested; normative statements include judgement.",
      "Ceteris paribus helps isolate one relationship.",
      "Economic thought evolves because economies, evidence, and values change.",
    ],
    examples: [
      "A behavioural economist may explain why consumers ignore long-term costs even when information is available.",
      "A Keynesian policy response may justify government spending during a recession.",
    ],
    commonMistakes: [
      "Calling a statement positive just because it sounds factual.",
      "Forgetting that 'should' usually signals a normative judgement.",
      "Listing schools of thought without explaining how their assumptions differ.",
    ],
    glossary: [
      {
        term: "Positive economics",
        definition: "Economic analysis based on testable statements about what is.",
      },
      {
        term: "Normative economics",
        definition:
          "Economic analysis involving value judgements about what should happen.",
      },
      {
        term: "Ceteris paribus",
        definition: "Other things equal or held constant.",
      },
    ],
    quickChecks: [
      {
        id: "testable",
        prompt: "A testable economic statement is positive or normative?",
        acceptedAnswers: ["positive", "positive economics"],
        feedback: "Correct: positive economics can be tested with evidence.",
      },
      {
        id: "should",
        prompt: "A statement saying government should act is usually positive or normative?",
        acceptedAnswers: ["normative", "normative economics"],
        feedback: "Correct: 'should' usually signals a value judgement.",
      },
      {
        id: "constant",
        prompt: "What Latin phrase means other things are held constant?",
        acceptedAnswers: ["ceteris paribus"],
        feedback: "Correct: ceteris paribus isolates one relationship.",
      },
      {
        id: "keynes",
        prompt: "Which economist is associated with demand management during downturns?",
        acceptedAnswers: ["keynes", "john maynard keynes"],
        feedback: "Correct: Keynes argued demand can need support in recessions.",
      },
    ],
    examMiniTask: {
      commandTerm: "Discuss",
      prompt:
        "Discuss why economists may disagree about whether government should intervene in a recession.",
      successCriteria: [
        "Distinguish positive evidence from normative judgement.",
        "Refer to at least two schools or perspectives.",
        "Reach a short judgement about why disagreement occurs.",
      ],
    },
  },
];

export const getEconomicsUnit1Lesson = (lessonId: string) =>
  economicsUnit1Lessons.find((lesson) => lesson.id === lessonId);
