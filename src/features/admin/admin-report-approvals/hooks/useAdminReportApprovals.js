import { useCallback, useEffect, useState } from "react";
import { adminReportApprovalsApi } from "../api/adminReportApprovalsApi";

/** How often the queue silently re-fetches so newly filed reports appear without a manual reload. */
const AUTO_REFRESH_MS = 30_000;

/** Owns the pending-report queue and the approve/reject mutations. */
export function useAdminReportApprovals() {
  const [pending, setPending] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async ({ silent = false } = {}) => {
    // A background refresh must not flash the skeleton or wipe the queue.
    if (!silent) {
      setIsLoading(true);
      setError(null);
    }
    try {
      const data = await adminReportApprovalsApi.listPending();
      setPending(data);
    } catch (err) {
      if (!silent) setError(err?.response?.data?.message ?? "Failed to load pending reports");
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Poll while the tab is visible, and refetch the moment it regains focus, so
  // reports a citizen just submitted drop into the queue on their own.
  useEffect(() => {
    const refreshIfVisible = () => {
      if (document.visibilityState === "visible") fetchAll({ silent: true });
    };
    const intervalId = setInterval(refreshIfVisible, AUTO_REFRESH_MS);
    document.addEventListener("visibilitychange", refreshIfVisible);
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", refreshIfVisible);
    };
  }, [fetchAll]);

  async function approve(id) {
    await adminReportApprovalsApi.approve(id);
    setPending((prev) => prev.filter((r) => r.id !== id));
  }

  async function reject(id, rejectionReason) {
    await adminReportApprovalsApi.reject(id, rejectionReason);
    setPending((prev) => prev.filter((r) => r.id !== id));
  }

  return { pending, isLoading, error, approve, reject };
}
