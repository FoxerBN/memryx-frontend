// hooks/useDecks.ts
import { useCallback, useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { getDeckSummariesByFolder, createDeck, updateDeck, deleteDeck } from "@/utils/api";
import type { UseDecksState, DeckSummary, DeckDto, DeckCreateRequestDto } from "@/type/deckApi";
import type { CustomAxiosError } from "@/type/axiosError";
import { 
  loadDecks, 
  saveDecks, 
  upsertDeck, 
  removeDeck as removeDeckFromList, 
  isFresh 
} from "@/utils/deckStorage";
import { loadFolders, saveFolders } from "@/utils/folderStorage";
import { getUser as getStoredUser } from "@/utils/authStorage";

export function useDecks(folderId: number | null): UseDecksState {
  const [decks, setDecks] = useState<DeckSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // NOTE: Only deck summaries (id, name, description, flashcardCount) are cached in localStorage.
  // Full flashcards are fetched on-demand elsewhere and kept in memory only.

  // Helper function to update folder deck count in cache
  const updateFolderDeckCount = useCallback((newDeckCount: number) => {
    if (folderId == null) return;
    
    const userId = getStoredUser()?.userId;
    if (userId == null) return;

    const cachedFolders = loadFolders(userId);
    if (cachedFolders) {
      const updatedFolders = cachedFolders.folders.map(folder =>
        folder.id === folderId
          ? { ...folder, deckCount: newDeckCount }
          : folder
      );
      saveFolders(userId, updatedFolders);
    }
  }, [folderId]);

  const refresh = useCallback(async () => {
    if (folderId == null || Number.isNaN(folderId)) {
      setDecks([]);
      setLoading(false);
      setError("Invalid folder id");
      return;
    }

    // Try to load from cache first
    const cached = loadDecks(folderId);
    if (cached && isFresh(cached)) {
      setDecks(cached.decks);
      setLoading(false);
      setError(null);
      return;
    }

    // If cache is stale or doesn't exist, fetch from API
    setLoading(true);
    setError(null);
    try {
      const res = await getDeckSummariesByFolder(folderId);
      const newDecks = res.data ?? [];
      setDecks(newDecks);
      
      // Save to cache (summaries only)
      saveDecks(folderId, newDecks);
      
      // Update folder deck count to keep it in sync
      updateFolderDeckCount(newDecks.length);
    } catch (e) {
      const ax = e as AxiosError<CustomAxiosError>;
      const errorMessage = 
        ax.response?.data?.error ??
        ax.response?.data?.message ??
        ax.message ??
        "Failed to load decks";
      setError(errorMessage);
      
      // If we have cached data (even if stale), use it
      if (cached) {
        setDecks(cached.decks);
      }
    } finally {
      setLoading(false);
    }
  }, [folderId, updateFolderDeckCount]);

  const create = useCallback(async (deckData: DeckCreateRequestDto): Promise<DeckDto | null> => {
    if (folderId == null) return null;

    try {
      setError(null);
      
      // Optimistic update: add temporary deck to the list (no flashcards stored here)
      const tempDeck: DeckSummary = {
        id: Date.now(), // temporary ID
        name: deckData.name,
        description: deckData.description || "",
        flashcardCount: deckData.flashcards.length,
      };
      
      setDecks(prev => {
        const updated = upsertDeck(prev, tempDeck);
        saveDecks(folderId, updated);
        return updated;
      });

      // Create deck via API
      const response = await createDeck(deckData);
      const createdDeck = response.data;
      
      // Update with real deck summary
      const realDeckSummary: DeckSummary = {
        id: createdDeck.id,
        name: createdDeck.name,
        description: createdDeck.description,
        flashcardCount: createdDeck.flashcards.length,
      };
      
      setDecks(prev => {
        const withoutTemp = removeDeckFromList(prev, tempDeck.id);
        const updated = upsertDeck(withoutTemp, realDeckSummary);
        saveDecks(folderId, updated);
        updateFolderDeckCount(updated.length);
        return updated;
      });

      return createdDeck;
    } catch (e) {
      // Rollback optimistic update
      setDecks(prev => {
        const updated = removeDeckFromList(prev, Date.now());
        saveDecks(folderId, updated);
        return updated;
      });
      
      const ax = e as AxiosError<CustomAxiosError>;
      setError(
        ax.response?.data?.error ??
        ax.response?.data?.message ??
        ax.message ??
        "Failed to create deck"
      );
      return null;
    }
  }, [folderId, updateFolderDeckCount]);

  const update = useCallback(async (id: number, deckData: Partial<DeckCreateRequestDto>): Promise<DeckDto | null> => {
    if (folderId == null) return null;

    try {
      setError(null);
      
      // Optimistic update (summary only)
      setDecks(prev => {
        const updated = prev.map(deck => 
          deck.id === id 
            ? { 
                ...deck, 
                name: deckData.name ?? deck.name,
                description: deckData.description ?? deck.description,
                flashcardCount: deckData.flashcards?.length ?? deck.flashcardCount
              }
            : deck
        );
        saveDecks(folderId, updated);
        return updated;
      });

      const response = await updateDeck(id, deckData);
      const updatedDeck = response.data;
      
      const updatedSummary: DeckSummary = {
        id: updatedDeck.id,
        name: updatedDeck.name,
        description: updatedDeck.description,
        flashcardCount: updatedDeck.flashcards.length,
      };
      
      setDecks(prev => {
        const updated = upsertDeck(prev, updatedSummary);
        saveDecks(folderId, updated);
        updateFolderDeckCount(updated.length);
        return updated;
      });

      return updatedDeck;
    } catch (e) {
      await refresh();
      const ax = e as AxiosError<CustomAxiosError>;
      setError(
        ax.response?.data?.error ??
        ax.response?.data?.message ??
        ax.message ??
        "Failed to update deck"
      );
      return null;
    }
  }, [folderId, refresh, updateFolderDeckCount]);

  const remove = useCallback(async (id: number): Promise<boolean> => {
    if (folderId == null) return false;

    const originalDeck = decks.find(d => d.id === id);

    try {
      setError(null);
      
      setDecks(prev => {
        const updated = removeDeckFromList(prev, id);
        saveDecks(folderId, updated);
        updateFolderDeckCount(updated.length);
        return updated;
      });

      await deleteDeck(id);
      return true;
    } catch (e) {
      if (originalDeck) {
        setDecks(prev => {
          const updated = upsertDeck(prev, originalDeck);
          saveDecks(folderId, updated);
          return updated;
        });
      }
      
      const ax = e as AxiosError<CustomAxiosError>;
      setError(
        ax.response?.data?.error ??
        ax.response?.data?.message ??
        ax.message ??
        "Failed to delete deck"
      );
      return false;
    }
  }, [folderId, decks, updateFolderDeckCount]);

  useEffect(() => { void refresh(); }, [refresh]);

  return { 
    decks, 
    loading, 
    error, 
    refresh,
    create,
    update,
    remove
  };
}
