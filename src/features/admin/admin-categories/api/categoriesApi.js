import { api } from "@/services/apiClient";

/** Standard CRUD against /api/categories (api-standards.md § Departments & Categories Endpoints). */
export const categoriesApi = {
  list: () => api.get("/categories"),
  create: (payload) => api.post("/categories", payload),
  update: (id, payload) => api.put(`/categories/${id}`, payload),
  remove: (id) => api.delete(`/categories/${id}`),
  /** Categories route to a department, so the create/edit form needs the department list for its dropdown. */
  listDepartments: () => api.get("/departments"),
};
