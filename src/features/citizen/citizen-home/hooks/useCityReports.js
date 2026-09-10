import { useEffect, useState } from "react";
import { citizenHomeApi } from "../api/citizenHomeApi";

/** Recent citizen-visible reports from anyone in the city ("What's happening in Yangon"). */
export function useCityReports() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    citizenHomeApi
      .getCityPulse({ limit: 3 })
      .then((result) => {
        if (!cancelled) setReports(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message ?? "Failed to load city reports");
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
