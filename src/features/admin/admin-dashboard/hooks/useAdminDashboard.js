import { useCallback, useEffect, useState } from "react";
import { adminDashboardApi } from "../api/adminDashboardApi";
import { computeDashboardAnalytics } from "../lib/dashboardAnalytics";
import { generateAdminRecommendations } from "../lib/dssRules";

// Module-level cache for instant SWR navigation between console tabs
let adminDashboardCache = null;
let adminDashboardCacheTime = 0;
const CACHE_TTL_MS = 60_000;

/** Owns the admin dashboard's summary data, department workload, and actionable KPIs. */
export function useAdminDashboard() {
  const [summary, setSummary] = useState(() => adminDashboardCache?.summary ?? null);
  const [categoryVolume, setCategoryVolume] = useState(() => adminDashboardCache?.categoryVolume ?? []);
  const [departmentPerformance, setDepartmentPerformance] = useState(() => adminDashboardCache?.departmentPerformance ?? []);
  const [reports, setReports] = useState(() => adminDashboardCache?.reports ?? []);
  const [analytics, setAnalytics] = useState(() => adminDashboardCache?.analytics ?? null);
  const [recommendations, setRecommendations] = useState(() => adminDashboardCache?.recommendations ?? []);
  const [dismissedRecIds, setDismissedRecIds] = useState(() => {
    try {
      const stored = sessionStorage.getItem("admin_dismissed_recs");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(() => !adminDashboardCache);
  const [error, setError] = useState(null);

  const dismissRecommendation = useCallback((id) => {
    setDismissedRecIds((prev) => {
      const updated = prev.includes(id) ? prev : [...prev, id];
      try {
        sessionStorage.setItem("admin_dismissed_recs", JSON.stringify(updated));
      } catch {
        // ignore sessionStorage errors
      }
      return updated;
    });
  }, []);

  const fetchAll = useCallback(async ({ silent = false } = {}) => {
    if (!silent && !adminDashboardCache) setIsLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled([
        adminDashboardApi.getSummary(),
        adminDashboardApi.getCategoryVolume(),
        adminDashboardApi.getDepartmentPerformance(),
        adminDashboardApi.getReports({ size: 100 }),
      ]);

      const summaryData = results[0].status === "fulfilled" ? results[0].value : null;
      const categoryData = results[1].status === "fulfilled" ? results[1].value : [];
      const deptData = results[2].status === "fulfilled" ? results[2].value : [];
      
      const rawReports = results[3].status === "fulfilled"
        ? (Array.isArray(results[3].value) ? results[3].value : results[3].value?.content ?? [])
        : [];

      setSummary(summaryData);
      setCategoryVolume(categoryData);
      setDepartmentPerformance(deptData);
      setReports(rawReports);

      // Compute dynamic actionable KPIs
      const computed = computeDashboardAnalytics({
        summary: summaryData,
        departmentStats: deptData,
        categoryVolume: categoryData,
        reports: rawReports,
      });
      setAnalytics(computed);

      // Compute DSS recommendations
      const recs = generateAdminRecommendations({
        summary: summaryData,
        departmentStats: deptData,
        reports: rawReports,
        analytics: computed,
      });
      setRecommendations(recs);

      // Update module-level cache
      adminDashboardCache = {
        summary: summaryData,
        categoryVolume: categoryData,
        departmentPerformance: deptData,
        reports: rawReports,
        analytics: computed,
        recommendations: recs,
      };
      adminDashboardCacheTime = Date.now();
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const isCacheStale = Date.now() - adminDashboardCacheTime > CACHE_TTL_MS;
    if (!adminDashboardCache || isCacheStale) {
      fetchAll({ silent: !!adminDashboardCache });
    }
  }, [fetchAll]);

  // Filter out recommendations that user has acknowledged or dismissed in this session
  const activeRecommendations = recommendations.filter((r) => !dismissedRecIds.includes(r.id));

  return {
    summary,
    categoryVolume,
    departmentPerformance,
    reports,
    analytics,
    recommendations: activeRecommendations,
    rawRecommendations: recommendations,
    dismissRecommendation,
    isLoading,
    error,
    refresh: fetchAll,
  };
}
