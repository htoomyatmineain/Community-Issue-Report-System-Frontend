import { useCallback, useEffect, useState } from "react";
import { adminApprovalsApi } from "../api/adminApprovalsApi";

/** Owns the pending-citizen queue and the approve/reject mutations. */
export function useAdminApprovals() {
  const [pending, setPending] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await adminApprovalsApi.listPending();
      setPending(data);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load pending accounts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function approve(id) {
    await adminApprovalsApi.approve(id);
    setPending((prev) => prev.filter((u) => u.id !== id));
  }

  async function reject(id, reason) {
    await adminApprovalsApi.reject(id, reason);
    setPending((prev) => prev.filter((u) => u.id !== id));
  }

  return { pending, isLoading, error, approve, reject };
}
