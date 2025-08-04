import { useState } from "react";
import * as api from "@/utils/api";

export function useLoginRegister() {
  const [loading, setLoading] = useState(false);
  const [error,  setError]   = useState<string | null>(null);

  const valid = (s: string) =>
    /^[A-Za-z][A-Za-z0-9]{2,29}$/.test(s);

  const login = async (username: string) => {
    if (!valid(username)) {
      setError("Invalid username format.");
      return false;
    }

    setLoading(true);
    try {
      await api.login({ username });
      return true;
    } catch (e: unknown) {
      const message =
          e instanceof Error ? e.message : "Unexpected error";
        setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, displayName: string) => {
    if (!valid(username) || !valid(displayName)) {
      setError("Invalid username or display name.");
      return false;
    }

    setLoading(true);
    try {
      await api.register({ username, displayName });
      return true;
    } catch (e: unknown) {
      const message =
          e instanceof Error ? e.message : "Unexpected error";
        setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, login, register };
}
