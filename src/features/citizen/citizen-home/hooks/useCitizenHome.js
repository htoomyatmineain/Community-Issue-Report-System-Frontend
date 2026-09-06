import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { citizenHomeApi } from "../api/citizenHomeApi";

/** Loads the citizen home screen's summary data (score, rank, recent reports). */
export function useCitizenHome() {
  const { user } = useAuth();
  const userId = user?.id ?? user?.userId;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId == null) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;

    setIsLoading(true);
    citizenHomeApi
      .getHomeSummary(userId)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message ?? "Failed to load home data");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { data, isLoading, error };
}
