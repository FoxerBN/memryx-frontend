// hooks/useDecks.ts
import { useCallback, useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { getDeckSummariesByFolder } from "@/utils/api";
import type { UseDecksState, DeckSummary } from "@/type/deckApi";
import type { CustomAxiosError } from "@/type/axiosError";


export function useDecks(folderId: number | null): UseDecksState {
  const [decks, setDecks] = useState<DeckSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (folderId == null || Number.isNaN(folderId)) {
      setDecks([]);
      setLoading(false);
      setError("Invalid folder id");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getDeckSummariesByFolder(folderId);
      setDecks(res.data ?? []);
    } catch (e) {
      const ax = e as AxiosError<CustomAxiosError>;
      setError(
        ax.response?.data?.error ??
        ax.response?.data?.message ??
        ax.message ??
        "Failed to load decks"
      );
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  useEffect(() => { void refresh(); }, [refresh]);

  return { decks, loading, error, refresh };
}
