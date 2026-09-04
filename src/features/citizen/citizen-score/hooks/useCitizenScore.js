import { useEffect, useState } from "react";
import { citizenScoreApi } from "../api/citizenScoreApi";

/** Loads the citizen's own point total and point history. */
export function useCitizenScore() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    citizenScoreApi
      .getMyScore()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message ?? "Failed to load your score");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, isLoading, error };
}
