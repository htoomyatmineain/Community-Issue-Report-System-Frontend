import { useCallback, useEffect, useState } from "react";
import { adminDashboardApi } from "../api/adminDashboardApi";

/** Owns the admin dashboard's summary data and category chart data. */
export function useAdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [categoryVolume, setCategoryVolume] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [summaryData, categoryData] = await Promise.all([
        adminDashboardApi.getSummary(),
        adminDashboardApi.getCategoryVolume(),
      ]);
      setSummary(summaryData);
      setCategoryVolume(categoryData);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    summary,
    categoryVolume,
    isLoading,
    error,
  };
}
