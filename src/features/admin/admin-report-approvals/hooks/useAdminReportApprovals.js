import { useCallback, useEffect, useState } from "react";
import { adminReportApprovalsApi } from "../api/adminReportApprovalsApi";

/** Owns the pending-report queue and the approve/reject mutations. */
export function useAdminReportApprovals() {
  const [pending, setPending] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminReportApprovalsApi.listPending();
      setPending(data);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load pending reports");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
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
