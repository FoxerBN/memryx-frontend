import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  withCredentials: true,
});

// ========== API functions ==========

export async function checkAuth() {
  return api.get("/user/protected");
}

export const login = ({ username }: { username: string }) =>
  api.post("/api/auth/login", { username });

export const register = ({
  username,
  displayName,
}: {
  username: string;
  displayName: string;
}) => api.post("/api/auth/register", { username, displayName });
