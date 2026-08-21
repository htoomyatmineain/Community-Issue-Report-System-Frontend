import { api } from "@/services/apiClient";

// Score/leaderboard rank and unread-notification count come from /api/score/me
// and /api/notifications/unread-count, neither built yet (Phase 7/8). Recent
// reports are real (GET /api/reports/my, Phase 4) — the rest stays a
// documented placeholder rather than fabricated numbers until those ship.
const RECENT_REPORTS_LIMIT = 5;

/** api-standards.md § Report Endpoints — GET /api/reports/my, sliced to the most recent few. */
export const citizenHomeApi = {
  getHomeSummary: async () => {
    const { data: reports } = await api.get("/reports/my");
    const recentReports = [...reports]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, RECENT_REPORTS_LIMIT);

    return {
      recentReports,
      score: { points: 0, leaderboardRank: null },
      unreadNotifications: 0,
    };
  },
};
