import { useCallback, useEffect, useState } from "react";
import { adminApprovalsApi } from "../api/adminApprovalsApi";
import { useAuth } from "@/app/providers/AuthProvider";

const nowIso = () => new Date().toISOString();

const byNewestSignup = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

/*
 * The backend only exposes the pending queue (GET /users/pending). Reviewed
 * accounts have no list endpoint yet, so the Approved / Denied tabs are seeded
 * with representative rows and then grow as the admin acts this session.
 */
const SEED_APPROVED = [
  {
    id: "seed-approved-1",
    fullName: "Hnin Ei Phyu",
    email: "hninei.phyu@example.com",
    phone: "09-772 100 233",
    nrcNumber: "12/MaGaDa(N)145992",
    createdAt: "2026-08-30T04:12:00Z",
    reviewedBy: "System Administrator",
    reviewedAt: "2026-09-01T03:44:00Z",
  },
];

const SEED_DENIED = [
  {
    id: "seed-denied-1",
    fullName: "Zaw Min Latt",
    email: "zawmin.latt@example.com",
    phone: "09-450 908 771",
    nrcNumber: "9/PaBaTa(N)073318",
    createdAt: "2026-08-29T09:20:00Z",
    reviewedBy: "System Administrator",
    reviewedAt: "2026-09-01T09:14:00Z",
    reason: "Duplicate NRC on file",
  },
];

/** Owns the pending / approved / denied citizen queues and the review mutations. */
export function useAdminApprovals() {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState(SEED_APPROVED);
  const [denied, setDenied] = useState(SEED_DENIED);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const reviewer = user?.fullName || "System Administrator";

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await adminApprovalsApi.listPending();
      setPending([...data].sort(byNewestSignup)); // newest signups first
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
    const citizen = pending.find((u) => u.id === id);
    setPending((prev) => prev.filter((u) => u.id !== id));
    if (!citizen) return;

    setApproved((prev) => [
      { ...citizen, reviewedBy: reviewer, reviewedAt: nowIso() },
      ...prev,
    ]);
    // The audit trail is written server-side by UserService.approve — see the
    // Audit Logs page (GET /api/audit-logs).
  }

  async function reject(id, reason) {
    await adminApprovalsApi.reject(id, reason);
    const citizen = pending.find((u) => u.id === id);
    setPending((prev) => prev.filter((u) => u.id !== id));
    if (!citizen) return;

    setDenied((prev) => [
      { ...citizen, reviewedBy: reviewer, reviewedAt: nowIso(), reason },
      ...prev,
    ]);
    // The audit trail is written server-side by UserService.reject.
  }

  return { pending, approved, denied, isLoading, error, approve, reject };
}
