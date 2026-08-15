/**
 * Temporary mock data for the citizen profile. GET /api/users/{id} isn't
 * built yet; this file is the single, isolated stand-in — delete it and
 * switch citizenProfileApi back to a real request once that endpoint ships.
 */
const MOCK_PROFILE = {
  fullName: "Ei Aint Chuu Myat",
  email: "eaintchuumyat06@gmail.com",
  phone: "09-451234567",
  dateOfBirth: "2003-03-14",
  nrcNumber: "12/AhaMaNa(N)123456",
  accountStatus: "APPROVED",
  joinedAt: "2026-06-28",
};

export function getMockProfile() {
  return Promise.resolve(structuredClone(MOCK_PROFILE));
}
