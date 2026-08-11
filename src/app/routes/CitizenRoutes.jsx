import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { ROLES } from "@/lib/rbac";
import { CitizenHomePage } from "@/features/citizen/citizen-home";
import { CitizenMapPage } from "@/features/citizen/citizen-map";
import { CitizenLeaderboardPage } from "@/features/citizen/citizen-leaderboard";
import { CitizenReportPage } from "@/features/citizen/citizen-report";
import { CitizenProfilePage } from "@/features/citizen/citizen-profile";

/** Routes under / — Citizen role only. */
export default function CitizenRoutes() {
  return (
    <Route path="/" element={<ProtectedRoute allow={[ROLES.CITIZEN]} />}>
      <Route index element={<CitizenHomePage />} />
      <Route path="map" element={<CitizenMapPage />} />
      <Route path="leaderboard" element={<CitizenLeaderboardPage />} />
      <Route path="report" element={<CitizenReportPage />} />
      <Route path="profile" element={<CitizenProfilePage />} />
    </Route>
  );
}
