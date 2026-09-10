import { api } from "@/services/apiClient";

/**
 * The reversible community-feed "Support" toggle, wired to the real backend
 * (committed in "feat(score): reversible community-feed report support").
 *
 *   POST   /api/reports/{id}/support  → back a report  (+3 to the supporter)
 *   DELETE /api/reports/{id}/support  → withdraw it    (−3, the exact reverse)
 *
 * Both answer with ReportSupportResultDTO:
 *   { supportCount, awardedPoints, totalPoints, remainingToday }
 * `awardedPoints` is +3 on support and −3 on withdrawal, and the backend
 * evicts the leaderboard cache on each call so the new total ranks immediately.
 */
export const communitySupportApi = {
  support: (reportId) =>
    api.post(`/reports/${reportId}/support`).then((res) => res.data),

  removeSupport: (reportId) =>
    api.delete(`/reports/${reportId}/support`).then((res) => res.data),
};
