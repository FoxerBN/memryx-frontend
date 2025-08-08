export interface TestDeck {
  id: number;
  folderId: number;
  name: string;
  cardCount: number;

  description: string;
}

export const testDecks: TestDeck[] = [
  {
    id: 1,
    folderId: 1,
    name: "Basic Vocabulary",
    cardCount: 20,

    description: "Essential English words for beginners.",
  },
  {
    id: 2,
    folderId: 1,
    name: "Irregular Verbs",
    cardCount: 15,

    description: "Practice the most common irregular verbs.",
  },
  {
    id: 3,
    folderId: 2,
    name: "Algebra Essentials",
    cardCount: 18,

    description: "Key algebra concepts and formulas.",
  },
  {
    id: 4,
    folderId: 2,
    name: "Geometry Basics",
    cardCount: 12,

    description: "Fundamental geometry terms and theorems.",
  },
  {
    id: 5,
    folderId: 3,
    name: "Physics Laws",
    cardCount: 14,

    description: "Important laws and principles in physics.",
  },
  {
    id: 6,
    folderId: 3,
    name: "Chemistry Elements",
    cardCount: 22,

    description: "Periodic table elements and their symbols.",
  },
  {
    id: 7,
    folderId: 4,
    name: "World Wars",
    cardCount: 10,

    description: "Major events and dates from WWI and WWII.",
  },
  {
    id: 8,
    folderId: 5,
    name: "Capitals Quiz",
    cardCount: 16,

    description: "Test your knowledge of world capitals.",
  },
];
