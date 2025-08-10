import { useState } from "react";
import type { AxiosError } from "axios";
import * as api from "@/utils/api";

export function useLoginRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = (s: string) => /^[A-Za-z][A-Za-z0-9]{2,29}$/.test(s);

  const login = async (username: string, stayLoggedIn = false) => {
    if (!valid(username)) {
      setError("Invalid username format.");
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      await api.login({ username, stayLoggedIn });
      return true;
    } catch (e) {
      const ax = e as AxiosError<{ error?: string; message?: string }>;
      const msg =
        ax.response?.data?.error ??
        ax.response?.data?.message ??
        ax.message ??
        "Unexpected error";
      setError(msg);
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
    setError(null);
    try {
      await api.register({ username, displayName });
      return true;
    } catch (e: unknown) {
      const ax = e as AxiosError<{ error?: string; message?: string}>;
      const msg =
        ax?.response?.data?.error ??
        ax?.response?.data?.message ??
        ax?.message ??
        "Unexpected error";
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, login, register };
}
