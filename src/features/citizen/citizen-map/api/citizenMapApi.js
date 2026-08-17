import { api } from "@/services/apiClient";
import { getMockMapPins } from "./citizenMap.mock";

// TODO: GET /api/reports/map isn't built yet (see api-standards.md § Map
// endpoint). Once it exists, call it with categoryId/status/bbox query params
// and delete citizenMap.mock.js.
const USE_MOCK_DATA = true;

/** API calls for the citizen-map feature. */
export const citizenMapApi = {
  getPins: () =>
    USE_MOCK_DATA ? getMockMapPins() : api.get("/reports/map").then((res) => res.data),
};
