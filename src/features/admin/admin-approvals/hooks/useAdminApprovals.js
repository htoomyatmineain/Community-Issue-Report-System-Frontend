import { useCallback, useEffect, useState } from "react";
import { adminApprovalsApi } from "../api/adminApprovalsApi";

const byNewestSignup = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

// Audit details read "PENDING → REJECTED · Reason: <reason>" (or no "· Reason:"
// suffix when the admin left it blank) — see UserService.reject.
const extractReason = (details) => {
  const marker = "Reason: ";
  const idx = details?.indexOf(marker) ?? -1;
  return idx === -1 ? undefined : details.slice(idx + marker.length);
};

/** Owns the pending / approved / denied citizen queues and the review mutations. */
export function useAdminApprovals() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [denied, setDenied] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Attach who reviewed each account and when/why, from the audit trail
  // (UserService.approve/reject writes one USER_APPROVED/USER_REJECTED row
  // per decision — see the Audit Logs page for the full history).
  const withReview = useCallback(async (citizens, action) => {
    if (citizens.length === 0) return citizens;
    const { data } = await adminApprovalsApi.listReviewAudit(action);
    const entries = Array.isArray(data) ? data : (data.content ?? []);
    const byTargetId = new Map(entries.map((entry) => [entry.targetId, entry]));
    return citizens.map((citizen) => {
      const entry = byTargetId.get(citizen.id);
      return entry
        ? {
            ...citizen,
            reviewedBy: entry.actorName,
            reviewedAt: entry.timestamp,
            reason: extractReason(entry.details),
          }
        : citizen;
    });
  }, []);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [pendingRes, approvedRes, deniedRes] = await Promise.all([
        adminApprovalsApi.listPending(),
        adminApprovalsApi.listByStatus("APPROVED"),
        adminApprovalsApi.listByStatus("REJECTED"),
      ]);
      const [approvedWithReview, deniedWithReview] = await Promise.all([
        withReview([...approvedRes.data].sort(byNewestSignup), "USER_APPROVED"),
        withReview([...deniedRes.data].sort(byNewestSignup), "USER_REJECTED"),
      ]);
      setPending([...pendingRes.data].sort(byNewestSignup)); // newest signups first
      setApproved(approvedWithReview);
      setDenied(deniedWithReview);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load accounts");
    } finally {
      setIsLoading(false);
    }
  }, [withReview]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function approve(id) {
    await adminApprovalsApi.approve(id);
    await fetchAll();
  }

  async function reject(id, reason) {
    await adminApprovalsApi.reject(id, reason);
    await fetchAll();
  }

  return { pending, approved, denied, isLoading, error, approve, reject };
}
