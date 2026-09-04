import { api } from "@/services/apiClient";

/**
 * api-standards.md § Dashboard, Leaderboard and Notification Endpoints —
 * "GET /api/score/me | CITIZEN | Own total plus point history." No example
 * body is documented; assumed shape mirrors database-schema.md's
 * `point_transactions` ledger: { totalPoints, history: [{ id, points, reason,
 * reportId, createdAt }] }. Revisit once the real DTO ships.
 */
export const citizenScoreApi = {
  getMyScore: () => api.get("/score/me").then((res) => res.data),
};
