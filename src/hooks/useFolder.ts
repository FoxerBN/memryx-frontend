// hooks/useFolder.ts
import { useEffect, useState, useCallback, useRef } from "react";
import type { AxiosError } from "axios";
import type { CustomAxiosError } from "@/type/axiosError";
import { getFolderSummaries, createFolder, type FolderSummary } from "@/utils/api";
import { getUser as getStoredUser } from "@/utils/authStorage";
import {
  loadFolders,
  saveFolders,
  upsertFolder,
  removeFolder,
  isFresh,
} from "@/utils/folderStorage";

type UseFolderState = {
  folders: FolderSummary[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (name: string) => Promise<boolean>;
};

export function useFolder(): UseFolderState {
  const [folders, setFolders] = useState<FolderSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]     = useState<string | null>(null);

  // userId musí byť number – ak nie je, sme neautentifikovaní
  const userId: number | null = (() => {
    const u = getStoredUser();
    return typeof u?.userId === "number" ? u.userId : null;
  })();

  const didInit = useRef(false);

  const setAndCache = useCallback((next: FolderSummary[]) => {
    setFolders(next);
    if (userId != null) saveFolders(userId, next);
  }, [userId]);

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
      setAndCache(res.data ?? []);
    } catch (e) {
      const ax = e as AxiosError<CustomAxiosError>;
      setError(ax?.response?.data?.error ?? ax?.response?.data?.message ?? ax.message ?? "Failed to load folders");
    } finally {
      setLoading(false);
    }
  }, [userId, setAndCache]);

  const create = useCallback(async (nameRaw: string) => {
    if (userId == null) { setError("Not authenticated"); return false; }

    const name = nameRaw.trim();
    if (!name) { setError("Folder name cannot be empty"); return false; }
    if (folders.some(f => f.name.toLowerCase() === name.toLowerCase())) {
      setError("Folder with this name already exists");
      return false;
    }

    const optimistic: FolderSummary = { id: Date.now(), name, deckCount: 0 };
    const optimisticList = upsertFolder(folders, optimistic);
    setAndCache(optimisticList);

    try {
      const res = await createFolder(userId, { name });
      const realId = res.data?.id ?? optimistic.id;

      const replaced = optimisticList.map(f =>
        f.id === optimistic.id ? { ...f, id: realId, name } : f
      );
      setAndCache(replaced);

      void refresh();
      return true;
    } catch (e) {
      const rolledBack = removeFolder(optimisticList, optimistic.id);
      setAndCache(rolledBack);

      const ax = e as AxiosError<CustomAxiosError>;
      setError(ax?.response?.data?.error ?? ax?.response?.data?.message ?? ax.message ?? "Failed to create folder");
      return false;
    }
  }, [userId, folders, setAndCache, refresh]);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    if (userId == null) {
      setFolders([]);
      setLoading(false);
      setError("Not authenticated");
      return;
    }

    const cache = loadFolders(userId);
    if (cache?.folders) {
      setFolders(cache.folders);
      setLoading(!isFresh(cache));
    }

    void refresh();

    const onFocus = () => void refresh();
    const onVisible = () => { if (document.visibilityState === "visible") void refresh(); };
    const onOnline = () => void refresh();

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", onOnline);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", onOnline);
    };
  }, [userId, refresh]);

  return { folders, loading, error, refresh, create };
}
