// useAuth.ts
import { useEffect, useState } from "react";
import axios from "axios";
import type { AuthState } from "@/interface/authState";

export function useAuth(): AuthState {
  const [auth, setAuth] = useState<AuthState>({ loading: true, isAuthenticated: false });

  useEffect(() => {
    (async () => {
      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/api/check`, { withCredentials: true });
        setAuth({ loading: false, isAuthenticated: true });
      } catch {
        setAuth({ loading: false, isAuthenticated: false });
      }
    })();
  }, []);

  return auth;
}
