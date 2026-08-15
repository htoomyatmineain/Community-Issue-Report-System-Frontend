import { useEffect, useState } from "react";
import { citizenLeaderboardApi } from "../api/citizenLeaderboardApi";

/** Loads the leaderboard: the citizen's own rank plus the top-ranked list. */
export function useCitizenLeaderboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    citizenLeaderboardApi
      .getLeaderboard()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message ?? "Failed to load the leaderboard");
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
