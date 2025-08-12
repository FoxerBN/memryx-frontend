import type { DeckSummary } from "@/type/deckApi";

export type DeckCacheShape = {
  version: number;
  updatedAt: number;
  decks: DeckSummary[];
};
