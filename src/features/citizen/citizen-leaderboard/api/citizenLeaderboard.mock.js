/**
 * Temporary mock data for the leaderboard. GET /api/leaderboard isn't built
 * yet; this file is the single, isolated stand-in — delete it and switch
 * citizenLeaderboardApi back to a real request once that endpoint ships.
 */
const MOCK_LEADERBOARD = {
  you: { rank: 12, name: "Ei Aint", points: 1240 },
  ranked: [
    { rank: 1, name: "Kyaw Zin Htet", points: 2480 },
    { rank: 2, name: "Su Su Hlaing", points: 2110 },
    { rank: 3, name: "Min Thu Aung", points: 1955 },
    { rank: 4, name: "Nandar Win", points: 1700 },
    { rank: 5, name: "Zayar Lin", points: 1540 },
    { rank: 6, name: "Hnin Ei Ei", points: 1480 },
  ],
};

export function getMockLeaderboard() {
  return Promise.resolve(structuredClone(MOCK_LEADERBOARD));
}
