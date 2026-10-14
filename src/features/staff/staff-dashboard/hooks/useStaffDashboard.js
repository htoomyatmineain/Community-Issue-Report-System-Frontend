import { useCallback, useEffect, useMemo, useState } from "react";
import { staffDashboardApi } from "../api/staffDashboardApi";
import { consoleReportsApi } from "@/features/console-reports/api/consoleReportsApi";
import { computeStaffDashboardAnalytics } from "../lib/staffAnalytics";

// Module-level cache for instant SWR navigation between staff tabs
let staffDashboardCache = null;
let staffDashboardCacheTime = 0;
const CACHE_TTL_MS = 60_000;

/** Loads the staff dashboard summary and computes operational decision-support analytics (DSS). */
export function useStaffDashboard() {
  const [summary, setSummary] = useState(() => staffDashboardCache?.summary ?? null);
  const [reports, setReports] = useState(() => staffDashboardCache?.reports ?? []);
  const [isLoading, setIsLoading] = useState(() => !staffDashboardCache);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async ({ silent = false } = {}) => {
    if (!silent && !staffDashboardCache) setIsLoading(true);
    setError(null);

    try {
      const [summaryRes, reportsRes] = await Promise.allSettled([
        staffDashboardApi.getSummary(),
        consoleReportsApi.list({ size: 100 }),
      ]);

      let summaryData = staffDashboardCache?.summary ?? null;
      let list = staffDashboardCache?.reports ?? [];

      if (summaryRes.status === "fulfilled") {
        summaryData = summaryRes.value;
        setSummary(summaryData);
      } else {
        console.warn("Staff summary fetch failed:", summaryRes.reason);
      }

      if (reportsRes.status === "fulfilled") {
        const data = reportsRes.value;
        list = Array.isArray(data) ? data : data?.content || [];
        setReports(list);
      } else {
        console.warn("Staff reports fetch failed:", reportsRes.reason);
      }

      staffDashboardCache = { summary: summaryData, reports: list };
      staffDashboardCacheTime = Date.now();

      if (summaryRes.status === "rejected" && reportsRes.status === "rejected") {
        setError(summaryRes.reason?.response?.data?.message ?? "Failed to load dashboard data");
      }
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const isCacheStale = Date.now() - staffDashboardCacheTime > CACHE_TTL_MS;
    if (!staffDashboardCache || isCacheStale) {
      fetchData({ silent: !!staffDashboardCache });
    }
  }, [fetchData]);

  const analytics = useMemo(() => {
    return computeStaffDashboardAnalytics({
      summary,
      reports,
    });
  }, [summary, reports]);

  return {
    summary,
    reports,
    analytics,
    isLoading,
    error,
    refetch: () => fetchData({ silent: true }),
  };
}

