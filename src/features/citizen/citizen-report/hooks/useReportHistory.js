import { useEffect, useState } from "react";
import { citizenReportApi } from "../api/citizenReportApi";

/** Loads the citizen's own report history, newest first. */
export function useReportHistory() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    citizenReportApi
      .getMyReports()
      .then((result) => {
        if (!cancelled) {
          setReports([...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
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
  }, []);

  return { reports, isLoading, error };
}
