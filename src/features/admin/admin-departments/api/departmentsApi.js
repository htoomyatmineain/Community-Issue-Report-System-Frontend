import { api } from "@/services/apiClient";

/** Standard CRUD against /api/departments (api-standards.md § Departments & Categories Endpoints). */
export const departmentsApi = {
  list: () => api.get("/departments"),
  create: (payload) => api.post("/departments", payload),
  update: (id, payload) => api.put(`/departments/${id}`, payload),
  remove: (id) => api.delete(`/departments/${id}`),
};
