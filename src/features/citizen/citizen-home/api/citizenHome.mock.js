/**
 * Temporary mock data for the citizen home screen.
 *
 * The backend has no combined "home summary" endpoint yet, and the endpoints
 * it would be composed from (GET /api/score/me, GET /api/reports/my) aren't
 * built either — only /api/auth/* exists so far. This file is the single,
 * isolated place standing in for that data; delete it and switch
 * `citizenHomeApi` back to real requests once those endpoints ship.
 */
const MOCK_HOME_DATA = {
  citizen: { fullName: "Ei Aint" },
  score: { points: 1240, leaderboardRank: 12 },
  unreadNotifications: 3,
  recentReports: [
    {
      id: 142,
      title: "Pothole on Thiri Street",
      category: "Roads",
      reportCode: "RPT-2026-000142",
      status: "ASSIGNED",
    },
    {
      id: 139,
      title: "Broken streetlight",
      category: "Electricity",
      reportCode: "RPT-2026-000139",
      status: "IN_PROGRESS",
    },
    {
      id: 131,
      title: "Overflowing bin",
      category: "Sanitation",
      reportCode: "RPT-2026-000131",
      status: "RESOLVED",
    },
  ],
};

export function getMockHomeData() {
  return Promise.resolve(structuredClone(MOCK_HOME_DATA));
}
