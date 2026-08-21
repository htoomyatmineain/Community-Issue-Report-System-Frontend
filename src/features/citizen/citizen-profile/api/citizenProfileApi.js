import { api } from "@/services/apiClient";

/** api-standards.md § User Management Endpoints — GET/PUT /api/users/{id}, self-accessible. */
export const citizenProfileApi = {
  get: (id) => api.get(`/users/${id}`),
  update: (id, payload) => api.put(`/users/${id}`, payload),
};
