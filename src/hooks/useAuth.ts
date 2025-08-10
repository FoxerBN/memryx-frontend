import { useEffect, useState } from "react";
import type { AuthState } from "@/interface/authState";
import { checkAuth } from "@/utils/api";

export function useAuth(): AuthState {
  const [auth, setAuth] = useState<AuthState>({ loading: true, isAuthenticated: false });

  useEffect(() => {
    (async () => {
      try {
        await checkAuth();
        setAuth({ loading: false, isAuthenticated: true });
      } catch {
        setAuth({ loading: false, isAuthenticated: false });
      }
    })();
  }, []);

  return auth;
}