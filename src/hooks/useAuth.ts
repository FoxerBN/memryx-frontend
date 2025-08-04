import { useEffect, useState } from "react";
import axios from "axios";
import type { AuthState } from "@/interface/authState";
const VITE_CHECK_AUTH = import.meta.env.VITE_CHECK_AUTH

export function useAuth(): AuthState {
  const [auth, setAuth] = useState<AuthState>({
    loading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(VITE_CHECK_AUTH, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setAuth({ loading: false, isAuthenticated: true });
        }
      } catch {
        setAuth({ loading: false, isAuthenticated: false });
      }
    })();
  }, []);

  return auth;
}
