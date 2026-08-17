import { api } from "@/services/apiClient";
import { getMockLeaderboard } from "./citizenLeaderboard.mock";

// TODO: GET /api/leaderboard isn't built yet. Once it exists, call it and
// delete citizenLeaderboard.mock.js.
const USE_MOCK_DATA = true;

/** API calls for the citizen-leaderboard feature. */
export const citizenLeaderboardApi = {
  getLeaderboard: () =>
    USE_MOCK_DATA ? getMockLeaderboard() : api.get("/leaderboard").then((res) => res.data),
};
