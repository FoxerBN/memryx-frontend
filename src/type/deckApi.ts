export type DeckSummary = {
  id: number;
  name: string;
  description: string;
  flashcardCount: number;
};

export type UseDecksState = {
  decks: DeckSummary[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};