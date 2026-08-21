import { api } from "@/services/apiClient";

/** Matches the three documented endpoints in api-standards.md — auth is stateless JWT, no server-side logout. */
export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  signup: (payload) => api.post("/auth/register", payload),
  me: () => api.get("/auth/me"),
};
