import { useEffect, useState } from "react";
import { citizenReportApi } from "../api/citizenReportApi";

/** Loads the citizen's own report history, newest first. */
export function useReportHistory(refreshKey = 0) {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    citizenReportApi
      .getMyReports()
      .then((result) => {
        if (!cancelled) setReports(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message ?? "Failed to load your reports");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return { reports, isLoading, error };
}
