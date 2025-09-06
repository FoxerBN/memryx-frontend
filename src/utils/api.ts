import axios from "axios";
import type { AppUser } from "@/interface/appUser";
import type {
  DeckSummary,
  DeckDto,
  DeckCreateRequestDto,
} from "@/type/deckApi";
import type { FolderDto, FolderSummary } from "@/type/folderApi";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  withCredentials: true,
});

// ========== AUTH API functions ==========

export const checkAuth = () => api.get("/api/check");

export const login = (payload: { username: string; stayLoggedIn?: boolean }) =>
  api.post("/api/auth/login", payload);

export const register = (payload: { username: string; displayName: string }) =>
  api.post("/api/user/create", payload);

export const refresh = () => api.post("/api/auth/refresh");
export const logout = () => api.post("/api/auth/logout");

// ========== USER API functions ==========

export const getUser = (id: number) => api.get<AppUser>(`/api/user/${id}`);

// ========== FOLDER API functions ==========

export type AuthEnvelope = {
  userId: number;
  username: string;
  message?: string;
};

export const getFolderSummaries = (userId: number) =>
  api.get<FolderSummary[]>(`/api/folders/user/${userId}/summary`);

export const createFolder = (userId: number, payload: { name: string }) =>
  api.post<FolderDto>(`/api/folders/user/${userId}`, payload);

export const getFolder = (id: number) =>
  api.get<FolderDto>(`/api/folders/${id}`);

export const updateFolder = (id: number, payload: { name: string }) =>
  api.put<FolderDto>(`/api/folders/${id}`, payload);

export const deleteFolder = (id: number) =>
  api.delete<{ message: string }>(`/api/folders/${id}`);

// ========== DECK API functions ==========

export const getDeckSummariesByFolder = (folderId: number) =>
  api.get<DeckSummary[]>(`/api/decks/folder/${folderId}/summary`);

export const createDeck = (payload: DeckCreateRequestDto) =>
  api.post<DeckDto>("/api/decks", payload);

export const getDeck = (id: number) => api.get<DeckDto>(`/api/decks/${id}`);

export const updateDeck = (
  id: number,
  payload: Partial<DeckCreateRequestDto>,
) => api.put<DeckDto>(`/api/decks/${id}`, payload);

export const deleteDeck = (id: number) =>
  api.delete<{ message: string }>(`/api/decks/${id}`);

// ========== FLASHCARD API functions ==========
export const getFlashcardsByDeck = (deckId: number) =>
  api.get<DeckDto>(`/api/decks/${deckId}`);

// ========== counter stats API functions ==========
export const getGlobalCounts = () => {
  return api.get(`/api/user/counts`);
};

export const getPersonalCounts = (userId: number) => {
  return api.get(`/api/user/${userId}/counts`);
};
