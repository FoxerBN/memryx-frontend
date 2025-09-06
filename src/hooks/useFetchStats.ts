import { useState, useEffect } from "react";
import { getGlobalCounts, getPersonalCounts } from "@/utils/api";
import { getUser } from "@/utils/authStorage";
import type { AxiosError } from "axios";
import type { CustomAxiosError } from "type/axiosError";

export interface CountsData {
  flashcards: number;
  decks: number;
  folders: number;
}

export interface StatsData {
  globalCounts: CountsData;
  personalCounts: CountsData;
}

export interface UseFetchStatsReturn {
  data: StatsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFetchStats = (): UseFetchStatsReturn => {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    const user = getUser();
    if (!user) {
      setError("No user found");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [globalResponse, personalResponse] = await Promise.all([
        getGlobalCounts(),
        getPersonalCounts(user.userId),
      ]);

      setData({
        globalCounts: globalResponse.data,
        personalCounts: personalResponse.data,
      });
    } catch (e) {
      const ax = e as AxiosError<CustomAxiosError>;
      setError(ax?.message || "Failed to fetch stats");
      console.error("Error fetching stats:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchStats,
  };
};
