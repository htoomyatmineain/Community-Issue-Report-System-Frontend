import { api } from "@/services/apiClient";

/** Read-only for staff — CRUD lives on the admin console (api-standards.md: departments/categories are Admin-write, Staff-read). */
export const staffDepartmentsApi = {
  list: () => api.get("/departments"),
};
