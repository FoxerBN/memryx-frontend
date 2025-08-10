import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  withCredentials: true,
});

// ========== API functions ==========

export const checkAuth = () => api.get("/api/check");

export const login = (payload: { username: string; stayLoggedIn?: boolean }) =>
  api.post("/api/auth/login", payload);

export const register = (payload: { username: string; displayName: string }) =>
  api.post("/api/auth/register", payload);
export const refresh = () => api.post("/api/auth/refresh");
export const logout = () => api.post("/api/auth/logout");
