import axios from "axios";
import type { AppUser } from "@/interface/appUser";
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

export type AuthEnvelope = { userId: number; username: string; message?: string };

export type FolderSummary = {
  id: number;
  name: string;
  deckCount: number;
};
export type FolderDto = {
  id: number;
  name: string;
};

export const getFolderSummaries = (userId: number) =>
  api.get<FolderSummary[]>(`/api/folders/user/${userId}/summary`);

export const createFolder = (userId: number, payload: { name: string }) =>
  api.post(`/api/folders/user/${userId}`, payload);