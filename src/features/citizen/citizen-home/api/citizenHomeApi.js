import { api } from "@/services/apiClient";
import { getMockHomeData } from "./citizenHome.mock";

// TODO: no combined home-summary endpoint exists on the backend yet. Once
// GET /api/score/me and GET /api/reports/my are built, replace this with a
// real composed request and delete citizenHome.mock.js.
const USE_MOCK_DATA = true;

/** API calls for the citizen-home feature. */
export const citizenHomeApi = {
  getHomeSummary: () =>
    USE_MOCK_DATA
      ? getMockHomeData()
      : api.get("/citizen/home-summary").then((res) => res.data),
};
