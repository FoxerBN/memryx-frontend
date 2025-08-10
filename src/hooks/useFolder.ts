// hooks/useFolder.ts
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import type { AxiosError } from "axios";
import { getFolderSummaries, createFolder, type FolderSummary } from "@/utils/api";
import { getUser as getStoredUser } from "@/utils/authStorage";

type UseFolderState = {
  folders: FolderSummary[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (name: string) => Promise<boolean>;
};

export function useFolder(): UseFolderState {
  const [folders, setFolders] = useState<FolderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // 1) Stabilizuj userId – načítaj raz a použij primitivum (number)
  const userId = useMemo(() => getStoredUser()?.userId ?? null, []);
  const didInit = useRef(false);

  const refresh = useCallback(async () => {
    if (userId == null) {
      setFolders([]);
      setLoading(false);
      setError("Not authenticated");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getFolderSummaries(userId);
      setFolders(res.data);
    } catch (e) {
      const ax = e as AxiosError<{ error?: string; message?: string }>;
      setError(ax?.response?.data?.error ?? ax?.message ?? "Failed to load folders");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const create = useCallback(async (name: string) => {
    if (userId == null) {
      setError("Not authenticated");
      return false;
    }
    const optimistic: FolderSummary = { id: Date.now(), name, deckCount: 0 };
    setFolders(prev => [...prev, optimistic]);

    try {
      const res = await createFolder({ userId, name });
      const newId = res.data?.id ?? optimistic.id;
      setFolders(prev => prev.map(f => (f.id === optimistic.id ? { ...f, id: newId } : f)));
      return true;
    } catch (e) {
      setFolders(prev => prev.filter(f => f.id !== optimistic.id));
      const ax = e as AxiosError<{ error?: string; message?: string }>;
      setError(ax?.response?.data?.error ?? ax?.message ?? "Failed to create folder");
      return false;
    }
  }, [userId]);

  useEffect(() => {
    // 2) Guard proti StrictMode dvojitému spusteniu v DEV
    if (didInit.current) return;
    didInit.current = true;
    void refresh();
  }, [refresh]);

  return { folders, loading, error, refresh, create };
}
