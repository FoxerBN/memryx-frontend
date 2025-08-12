import type { CacheShape, FolderSummary } from '@/type/localstorage/folderStorage';

const VERSION = 1;
const BASE_KEY = "flashcard:folders:";

const keyFor = (userId: number) => `${BASE_KEY}${userId}`;

export function loadFolders(userId: number): CacheShape | null {
  try {
    const raw = localStorage.getItem(keyFor(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheShape;
    if (parsed?.version !== VERSION || !Array.isArray(parsed?.folders)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveFolders(userId: number, folders: FolderSummary[]) {
  const data: CacheShape = {
    version: VERSION,
    updatedAt: Date.now(),
    folders,
  };
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify(data));
  } catch {
    console.error("Failed to save folders to localStorage");
  }
}

/** Merge helper: update or insert one folder by id */
export function upsertFolder(
  list: FolderSummary[],
  item: FolderSummary
): FolderSummary[] {
  const idx = list.findIndex(f => f.id === item.id);
  if (idx === -1) return [...list, item];
  const copy = list.slice();
  copy[idx] = { ...copy[idx], ...item };
  return copy;
}

/** Remove by id (e.g., rollback optimistic create) */
export function removeFolder(list: FolderSummary[], id: number): FolderSummary[] {
  return list.filter(f => f.id !== id);
}

/** Check if cache is fresh enough */
export function isFresh(cache: CacheShape | null, maxAgeMs = 5 * 60 * 1000) {
  if (!cache) return false;
  return Date.now() - cache.updatedAt < maxAgeMs;
}
