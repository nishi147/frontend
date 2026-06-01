export interface QuestionOption {
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
  weight: number;
}

export interface Question {
  id: number;
  category: 'tech' | 'logic' | 'innovation' | 'ai' | 'skills';
  categoryLabel: string;
  text: string;
  type: 'single_select';
  options: QuestionOption[];
}

export const questions: Question[] = [
  // PAGE 1: Technology Interest
  {
    id: 1,
    category: 'tech',
    categoryLabel: 'Technology Interest',
    text: "When your child sees a new app, game, or gadget, what do they usually do?",
    type: 'single_select',
    options: [
      { label: 'A', text: "Ignore it", weight: 1 },
      { label: 'B', text: "Use it only when needed", weight: 2 },
      { label: 'C', text: "Explore how it works", weight: 3 },
      { label: 'D', text: "Try to learn everything about it", weight: 4 }
    ]
  },
  {
    id: 2,
    category: 'tech',
    categoryLabel: 'Technology Interest',
    text: "How often does your child ask questions about technology?",
    type: 'single_select',
    options: [
      { label: 'A', text: "Rarely", weight: 1 },
      { label: 'B', text: "Sometimes", weight: 2 },
      { label: 'C', text: "Often", weight: 3 },
      { label: 'D', text: "Very Frequently", weight: 4 }
    ]
  },
  {
    id: 3,
    category: 'tech',
    categoryLabel: 'Technology Interest',
    text: "Which activity does your child enjoy the most?",
    type: 'single_select',
    options: [
      { label: 'A', text: "Watching TV", weight: 1 },
      { label: 'B', text: "Playing Games", weight: 2 },
      { label: 'C', text: "Solving Puzzles", weight: 3 },
      { label: 'D', text: "Building or Creating Something", weight: 4 }
    ]
  },
  {
    id: 4,
    category: 'tech',
    categoryLabel: 'Technology Interest',
    text: "If your child gets a new gadget, what happens first?",
    type: 'single_select',
    options: [
      { label: 'A', text: "Uses basic features only", weight: 1 },
      { label: 'B', text: "Needs help to understand it", weight: 2 },
      { label: 'C', text: "Explores settings", weight: 3 },
      { label: 'D', text: "Experiments with all features", weight: 4 }
    ]
  },
  {
    id: 5,
    category: 'tech',
    categoryLabel: 'Technology Interest',
    text: "How excited is your child about learning new technology?",
    type: 'single_select',
    options: [
      { label: 'A', text: "Not interested", weight: 1 },
      { label: 'B', text: "Slightly interested", weight: 2 },
      { label: 'C', text: "Interested", weight: 3 },
      { label: 'D', text: "Very excited", weight: 4 }
    ]
  },

  // PAGE 2: Problem Solving Skills
  {
    id: 6,
    category: 'logic',
    categoryLabel: 'Problem Solving Skills',
    text: "When faced with a difficult problem, your child usually:",
    type: 'single_select',
    options: [
      { label: 'A', text: "Gives up quickly", weight: 1 },
      { label: 'B', text: "Asks for help immediately", weight: 2 },
      { label: 'C', text: "Tries different solutions", weight: 3 },
      { label: 'D', text: "Enjoys solving challenges", weight: 4 }
    ]
  },
  {
    id: 7,
    category: 'logic',
    categoryLabel: 'Problem Solving Skills',
    text: "How does your child react to puzzles or brain games?",
    type: 'single_select',
    options: [
      { label: 'A', text: "Avoids them", weight: 1 },
      { label: 'B', text: "Tries occasionally", weight: 2 },
      { label: 'C', text: "Enjoys them", weight: 3 },
      { label: 'D', text: "Loves challenging puzzles", weight: 4 }
    ]
  },
  {
    id: 8,
    category: 'logic',
    categoryLabel: 'Problem Solving Skills',
    text: "If something doesn't work, your child:",
    type: 'single_select',
    options: [
      { label: 'A', text: "Stops trying", weight: 1 },
      { label: 'B', text: "Waits for someone else", weight: 2 },
      { label: 'C', text: "Tries again", weight: 3 },
      { label: 'D', text: "Investigates why it happened", weight: 4 }
    ]
  },
  {
    id: 9,
    category: 'logic',
    categoryLabel: 'Problem Solving Skills',
    text: "How often does your child look for creative solutions?",
    type: 'single_select',
    options: [
      { label: 'A', text: "Rarely", weight: 1 },
      { label: 'B', text: "Sometimes", weight: 2 },
      { label: 'C', text: "Frequently", weight: 3 },
      { label: 'D', text: "Almost always", weight: 4 }
    ]
  },
  {
    id: 10,
    category: 'logic',
    categoryLabel: 'Problem Solving Skills',
    text: "Can your child follow multi-step instructions?",
    type: 'single_select',
    options: [
      { label: 'A', text: "Difficult", weight: 1 },
      { label: 'B', text: "Sometimes", weight: 2 },
      { label: 'C', text: "Usually", weight: 3 },
      { label: 'D', text: "Easily", weight: 4 }
    ]
  },

  // PAGE 3: Creativity & Innovation
  {
    id: 11,
    category: 'innovation',
    categoryLabel: 'Creativity & Innovation',
    text: "Does your child enjoy creating things?",
    type: 'single_select',
    options: [
      { label: 'A', text: "Rarely", weight: 1 },
      { label: 'B', text: "Occasionally", weight: 2 },
      { label: 'C', text: "Often", weight: 3 },
      { label: 'D', text: "Very Often", weight: 4 }
    ]
  },
  {
    id: 12,
    category: 'innovation',
    categoryLabel: 'Creativity & Innovation',
    text: "What does your child prefer?",
    type: 'single_select',
    options: [
      { label: 'A', text: "Following rules", weight: 1 },
      { label: 'B', text: "Watching others create", weight: 2 },
      { label: 'C', text: "Making simple projects", weight: 3 },
      { label: 'D', text: "Creating original ideas", weight: 4 }
    ]
  },
  {
    id: 13,
    category: 'innovation',
    categoryLabel: 'Creativity & Innovation',
    text: "How imaginative is your child?",
    type: 'single_select',
    options: [
      { label: 'A', text: "Low", weight: 1 },
      { label: 'B', text: "Average", weight: 2 },
      { label: 'C', text: "High", weight: 3 },
      { label: 'D', text: "Extremely Creative", weight: 4 }
    ]
  },
  {
    id: 14,
    category: 'innovation',
    categoryLabel: 'Creativity & Innovation',
    text: "Does your child enjoy drawing, designing, building, or storytelling?",
    type: 'single_select',
    options: [
      { label: 'A', text: "Rarely", weight: 1 },
      { label: 'B', text: "Sometimes", weight: 2 },
      { label: 'C', text: "Often", weight: 3 },
      { label: 'D', text: "Very Frequently", weight: 4 }
    ]
  },
  {
    id: 15,
    category: 'innovation',
    categoryLabel: 'Creativity & Innovation',
    text: "If given unlimited resources, your child would:",
    type: 'single_select',
    options: [
      { label: 'A', text: "Play games", weight: 1 },
      { label: 'B', text: "Watch videos", weight: 2 },
      { label: 'C', text: "Build something interesting", weight: 3 },
      { label: 'D', text: "Invent something new", weight: 4 }
    ]
  },

  // PAGE 4: AI & Future Awareness
  {
    id: 16,
    category: 'ai',
    categoryLabel: 'AI & Future Awareness',
    text: "Has your child ever used AI tools like ChatGPT or AI image generators?",
    type: 'single_select',
    options: [
      { label: 'A', text: "Never", weight: 1 },
      { label: 'B', text: "Heard about them", weight: 2 },
      { label: 'C', text: "Tried them", weight: 3 },
      { label: 'D', text: "Uses them regularly", weight: 4 }
    ]
  },
  {
    id: 17,
    category: 'ai',
    categoryLabel: 'AI & Future Awareness',
    text: "How curious is your child about future technologies?",
    type: 'single_select',
    options: [
      { label: 'A', text: "Not curious", weight: 1 },
      { label: 'B', text: "Slightly curious", weight: 2 },
      { label: 'C', text: "Curious", weight: 3 },
      { label: 'D', text: "Very Curious", weight: 4 }
    ]
  },
  {
    id: 18,
    category: 'ai',
    categoryLabel: 'AI & Future Awareness',
    text: "Does your child ask 'How does this work?'",
    type: 'single_select',
    options: [
      { label: 'A', text: "Rarely", weight: 1 },
      { label: 'B', text: "Sometimes", weight: 2 },
      { label: 'C', text: "Often", weight: 3 },
      { label: 'D', text: "Almost every day", weight: 4 }
    ]
  },
  {
    id: 19,
    category: 'ai',
    categoryLabel: 'AI & Future Awareness',
    text: "How interested is your child in robotics, coding, or AI?",
    type: 'single_select',
    options: [
      { label: 'A', text: "Not interested", weight: 1 },
      { label: 'B', text: "Slightly interested", weight: 2 },
      { label: 'C', text: "Interested", weight: 3 },
      { label: 'D', text: "Very Interested", weight: 4 }
    ]
  },
  {
    id: 20,
    category: 'ai',
    categoryLabel: 'AI & Future Awareness',
    text: "Would your child like to build technology instead of only using it?",
    type: 'single_select',
    options: [
      { label: 'A', text: "No", weight: 1 },
      { label: 'B', text: "Maybe", weight: 2 },
      { label: 'C', text: "Probably", weight: 3 },
      { label: 'D', text: "Definitely", weight: 4 }
    ]
  },

  // PAGE 5: Future Skills Potential
  {
    id: 21,
    category: 'skills',
    categoryLabel: 'Future Skills Potential',
    text: "How confident is your child while learning something new?",
    type: 'single_select',
    options: [
      { label: 'A', text: "Not confident", weight: 1 },
      { label: 'B', text: "Sometimes confident", weight: 2 },
      { label: 'C', text: "Confident", weight: 3 },
      { label: 'D', text: "Very confident", weight: 4 }
    ]
  },
  {
    id: 22,
    category: 'skills',
    categoryLabel: 'Future Skills Potential',
    text: "Can your child work independently on tasks?",
    type: 'single_select',
    options: [
      { label: 'A', text: "Rarely", weight: 1 },
      { label: 'B', text: "Sometimes", weight: 2 },
      { label: 'C', text: "Usually", weight: 3 },
      { label: 'D', text: "Very Well", weight: 4 }
    ]
  },
  {
    id: 23,
    category: 'skills',
    categoryLabel: 'Future Skills Potential',
    text: "How adaptable is your child to change?",
    type: 'single_select',
    options: [
      { label: 'A', text: "Struggles", weight: 1 },
      { label: 'B', text: "Takes time", weight: 2 },
      { label: 'C', text: "Adapts well", weight: 3 },
      { label: 'D', text: "Adapts quickly", weight: 4 }
    ]
  },
  {
    id: 24,
    category: 'skills',
    categoryLabel: 'Future Skills Potential',
    text: "How often does your child take initiative?",
    type: 'single_select',
    options: [
      { label: 'A', text: "Rarely", weight: 1 },
      { label: 'B', text: "Sometimes", weight: 2 },
      { label: 'C', text: "Often", weight: 3 },
      { label: 'D', text: "Very Frequently", weight: 4 }
    ]
  },
  {
    id: 25,
    category: 'skills',
    categoryLabel: 'Future Skills Potential',
    text: "Which best describes your child?",
    type: 'single_select',
    options: [
      { label: 'A', text: "Observer", weight: 1 },
      { label: 'B', text: "Learner", weight: 2 },
      { label: 'C', text: "Explorer", weight: 3 },
      { label: 'D', text: "Creator", weight: 4 }
    ]
  }
];
