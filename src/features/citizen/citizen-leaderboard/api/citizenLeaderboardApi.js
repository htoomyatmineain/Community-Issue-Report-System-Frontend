import { api } from "@/services/apiClient";

/**
 * api-standards.md § Dashboard, Leaderboard and Notification Endpoints —
 * GET /api/leaderboard returns `[{ rank, userId, fullName, scorePoints }]`,
 * default top 50. `userId` isn't necessarily in that page, so "you" falls
 * back to no rank shown rather than a fabricated one.
 */
export const citizenLeaderboardApi = {
  getLeaderboard: async (userId) => {
    const { data } = await api.get("/leaderboard");
    const own = data.find((entry) => entry.userId === userId);

    return {
      you: own && { rank: own.rank, name: own.fullName, points: own.scorePoints },
      ranked: data.map((entry) => ({ rank: entry.rank, name: entry.fullName, points: entry.scorePoints })),
    };
  },
};
