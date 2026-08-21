import { api } from "@/services/apiClient";

/** api-standards.md § User Management Endpoints — citizen account approval queue. */
export const adminApprovalsApi = {
  listPending: () => api.get("/users/pending"),
  approve: (id) => api.patch(`/users/${id}/approve`),
  reject: (id, reason) => api.patch(`/users/${id}/reject`, { reason }),
};
