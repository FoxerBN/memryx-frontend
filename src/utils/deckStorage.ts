import type { DeckCacheShape } from '@/type/localstorage/deckStorage';
import type { DeckSummary } from '@/type/deckApi';

const VERSION = 1;
const BASE_KEY = "flashcard:decks:";

const keyFor = (folderId: number) => `${BASE_KEY}${folderId}`;

export function loadDecks(folderId: number): DeckCacheShape | null {
  try {
    const raw = localStorage.getItem(keyFor(folderId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DeckCacheShape;
    if (parsed?.version !== VERSION || !Array.isArray(parsed?.decks)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveDecks(folderId: number, decks: DeckSummary[]) {
  const data: DeckCacheShape = {
    version: VERSION,
    updatedAt: Date.now(),
    decks,
  };
  try {
    localStorage.setItem(keyFor(folderId), JSON.stringify(data));
  } catch {
    console.error("Failed to save decks to localStorage");
  }
}

/** Merge helper: update or insert one deck by id */
export function upsertDeck(
  list: DeckSummary[],
  item: DeckSummary
): DeckSummary[] {
  const idx = list.findIndex(d => d.id === item.id);
  if (idx === -1) return [...list, item];
  const copy = list.slice();
  copy[idx] = { ...copy[idx], ...item };
  return copy;
}

/** Remove by id (e.g., rollback optimistic create) */
export function removeDeck(list: DeckSummary[], id: number): DeckSummary[] {
  return list.filter(d => d.id !== id);
}

/** Check if cache is fresh enough */
export function isFresh(cache: DeckCacheShape | null, maxAgeMs = 5 * 60 * 1000) {
  if (!cache) return false;
  return Date.now() - cache.updatedAt < maxAgeMs;
}