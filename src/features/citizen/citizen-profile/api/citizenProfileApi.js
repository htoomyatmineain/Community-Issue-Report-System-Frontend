import { api } from "@/services/apiClient";
import { getMockProfile } from "./citizenProfile.mock";

// TODO: GET/PUT /api/users/{id} aren't built yet. Once they exist, call them
// with the id from the auth session and delete citizenProfile.mock.js.
const USE_MOCK_DATA = true;

/** API calls for the citizen-profile feature. */
export const citizenProfileApi = {
  getMyProfile: () =>
    USE_MOCK_DATA ? getMockProfile() : api.get("/auth/me").then((res) => res.data),
};
