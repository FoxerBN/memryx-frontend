export type StoredUser = { userId: number; username: string; displayName: string };
const KEY = "flashcard:user";

export const setUser = (u: StoredUser) => localStorage.setItem(KEY, JSON.stringify(u));
export const getUser = (): StoredUser | null => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
};
export const clearUser = () => localStorage.removeItem(KEY);
