import { api } from "@/services/apiClient";

/** api-standards.md § User Management Endpoints — citizen account table + status actions. */
export const adminCitizensApi = {
  list: (params) => api.get("/users/citizens", { params }),
  suspend: (id) => api.patch(`/users/${id}/suspend`),
  reactivate: (id) => api.patch(`/users/${id}/reactivate`),
  remove: (id) => api.delete(`/users/${id}`),
};
