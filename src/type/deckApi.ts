// Basic deck summary (list views)
export type DeckSummary = {
  id: number;
  name: string;
  description: string;
  flashcardCount: number;
};

// Full deck with flashcards
export type DeckDto = {
  id: number;
  name: string;
  description: string;
  folderId: number;
  flashcards: FlashcardDto[];
};

// Flashcard representations
export type FlashcardDto = {
  id: number;
  frontText: string;
  backText: string;
};

export type FlashcardCreateRequestDto = {
  frontText: string;
  backText: string;
};

// Create / update request
export type DeckCreateRequestDto = {
  name: string;
  description?: string;
  folderId: number;
  flashcards: FlashcardCreateRequestDto[];
};

// Hook state contract
export type UseDecksState = {
  decks: DeckSummary[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (deck: DeckCreateRequestDto) => Promise<DeckDto | null>;
  update: (id: number, deck: Partial<DeckCreateRequestDto>) => Promise<DeckDto | null>;
  remove: (id: number) => Promise<boolean>;
};