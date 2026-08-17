/**
 * Temporary mock data for the community map.
 *
 * GET /api/reports/map isn't built on the backend yet. This file is the
 * single, isolated stand-in; delete it and switch citizenMapApi back to a
 * real request once that endpoint ships.
 */
const MOCK_PINS = [
  {
    id: 142,
    title: "Pothole on Thiri Street",
    category: "roads",
    status: "ASSIGNED",
    address: "Thiri Street, Yankin",
    reportedAgo: "Reported 2 days ago",
    x: 22,
    y: 20,
  },
  {
    id: 158,
    title: "Streetlight repaired",
    category: "electricity",
    status: "RESOLVED",
    address: "Kabar Aye Pagoda Road",
    reportedAgo: "Reported 5 days ago",
    x: 68,
    y: 15,
  },
  {
    id: 161,
    title: "Water leak near market",
    category: "water",
    status: "IN_PROGRESS",
    address: "Bogyoke Market, Pabedan",
    reportedAgo: "Reported 1 day ago",
    x: 45,
    y: 53,
  },
  {
    id: 149,
    title: "Illegal dumping behind school",
    category: "sanitation",
    status: "REJECTED",
    address: "Basic Education School 2, Yankin",
    reportedAgo: "Reported 6 days ago",
    x: 82,
    y: 38,
  },
  {
    id: 171,
    title: "Broken park bench",
    category: "parks",
    status: "PENDING_APPROVAL",
    address: "Kandawgyi Park, East Gate",
    reportedAgo: "Reported today",
    x: 12,
    y: 72,
  },
  {
    id: 176,
    title: "Cracked ceiling at community hall",
    category: "buildings",
    status: "ASSIGNED",
    address: "Yankin Community Hall",
    reportedAgo: "Reported 3 days ago",
    x: 58,
    y: 82,
  },
];

export function getMockMapPins() {
  return Promise.resolve(structuredClone(MOCK_PINS));
}
