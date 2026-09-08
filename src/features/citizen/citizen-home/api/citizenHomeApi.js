import { api } from "@/services/apiClient";

const RECENT_REPORTS_LIMIT = 5;

/**
 * api-standards.md § Report / Dashboard, Leaderboard and Notification Endpoints —
 * GET /api/reports/my (sliced to the most recent few), GET /api/score/me, and
 * GET /api/leaderboard (to find the citizen's own rank). Unread-notification
 * count is owned by NotificationBell itself, not this summary.
 */
export const citizenHomeApi = {
  getHomeSummary: async (userId) => {
    const [{ data: reports }, { data: score }, { data: leaderboard }] = await Promise.all([
      api.get("/reports/my"),
      api.get("/score/me"),
      api.get("/leaderboard"),
    ]);

    const recentReports = [...reports]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, RECENT_REPORTS_LIMIT);

    const ownEntry = leaderboard.find((entry) => entry.userId === userId);

    return {
      recentReports,
      score: {
        points: score?.totalPoints ?? 0,
        leaderboardRank: ownEntry?.rank ?? null,
      },
    };
  },

  /**
   * "What's happening in Yangon" feed — the most recent citizen-visible reports
   * from anyone in the city. The public map endpoint only returns pin data
   * (no title/description), so the top few are enriched with GET /reports/{id}.
   */
  getCityPulse: async (limit = 4) => {
    const pins = await api.get("/reports/map/public").then((res) => res.data);
    const recent = [...pins]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    return Promise.all(
      recent.map((pin) =>
        api
          .get(`/reports/${pin.id}`)
          .then((res) => ({
            ...pin,
            title: res.data.title,
            description: res.data.description,
            addressText: res.data.addressText,
          }))
          .catch(() => pin)
      )
    );
  },
};
