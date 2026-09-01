import { api } from "@/services/apiClient";

/** api-standards.md § User Management, § Departments & Categories Endpoints. */
export const staffSettingsApi = {
  get: (id) => api.get(`/users/${id}`),
  update: (id, payload) => api.put(`/users/${id}`, payload),
  getDepartment: (departmentId) => api.get(`/departments/${departmentId}`),
};
