import { api } from "@/services/apiClient";

/** api-standards.md § User Management Endpoints — citizen account approval queue. */
export const adminApprovalsApi = {
  listPending: () => api.get("/users/pending"),
  /** Reviewed citizen accounts — accountStatus is "APPROVED" or "REJECTED". */
  listByStatus: (accountStatus) => api.get("/users", { params: { role: "CITIZEN", accountStatus } }),
  /** Who reviewed each account and when/why — action is "USER_APPROVED" or "USER_REJECTED". */
  listReviewAudit: (action) => api.get("/audit-logs", { params: { action, size: 100 } }),
  getById: (id) => api.get(`/users/${id}`),
  approve: (id) => api.patch(`/users/${id}/approve`),
  reject: (id, reason) => api.patch(`/users/${id}/reject`, { reason }),
};
