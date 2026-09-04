import { useCallback, useEffect, useState } from "react";
import { adminDashboardApi } from "../api/adminDashboardApi";

/** Owns the admin dashboard's summary data, category chart data, and the inline approve/reject actions on its two panels. */
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

  async function approveAccount(id) {
    await adminDashboardApi.approveAccount(id);
    setSummary((prev) => ({
      ...prev,
      pendingAccountCount: Math.max(0, (prev.pendingAccountCount ?? 1) - 1),
      recentRegistrations: prev.recentRegistrations?.filter((u) => u.id !== id),
    }));
  }

  async function rejectAccount(id, reason) {
    await adminDashboardApi.rejectAccount(id, reason);
    setSummary((prev) => ({
      ...prev,
      pendingAccountCount: Math.max(0, (prev.pendingAccountCount ?? 1) - 1),
      recentRegistrations: prev.recentRegistrations?.filter((u) => u.id !== id),
    }));
  }

  async function approveReport(id) {
    await adminDashboardApi.approveReport(id);
    setSummary((prev) => ({
      ...prev,
      pendingReportCount: Math.max(0, (prev.pendingReportCount ?? 1) - 1),
      reportsAwaitingApproval: prev.reportsAwaitingApproval?.filter((r) => r.id !== id),
    }));
  }

  async function rejectReport(id, reason) {
    await adminDashboardApi.rejectReport(id, reason);
    setSummary((prev) => ({
      ...prev,
      pendingReportCount: Math.max(0, (prev.pendingReportCount ?? 1) - 1),
      reportsAwaitingApproval: prev.reportsAwaitingApproval?.filter((r) => r.id !== id),
    }));
  }

  return {
    summary,
    categoryVolume,
    isLoading,
    error,
    approveAccount,
    rejectAccount,
    approveReport,
    rejectReport,
  };
}
