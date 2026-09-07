import { lazy } from "react";
import { Outlet, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { ROLES } from "@/lib/rbac";
import CitizenShell from "@/components/layout/CitizenShell";
import { CitizenHomePage } from "@/features/citizen/citizen-home";
import { CitizenReportPage, ReportDetailPage } from "@/features/citizen/citizen-report";
import { CitizenLeaderboardPage } from "@/features/citizen/citizen-leaderboard";
import { CitizenProfilePage } from "@/features/citizen/citizen-profile";
import { CitizenScorePage } from "@/features/citizen/citizen-score";
import { CitizenNotificationsPage } from "@/features/citizen/citizen-notifications";

// Lazy — pulls in the Leaflet map-vendor chunk only when the citizen opens the map.
const CitizenMapPage = lazy(() =>
  import("@/features/citizen/citizen-map").then((m) => ({ default: m.CitizenMapPage }))
);

function CitizenShellLayout() {
  return (
    <CitizenShell>
      <Outlet />
    </CitizenShell>
  );
}

/** Routes for the Citizen role, wrapped in the mobile-first bottom-tab shell. */
export default function CitizenRoutes() {
  return (
    <Route element={<ProtectedRoute allow={[ROLES.CITIZEN]} />}>
      <Route element={<CitizenShellLayout />}>
        <Route index element={<CitizenHomePage />} />
        <Route path="map" element={<CitizenMapPage />} />
        <Route path="report" element={<CitizenReportPage />} />
        <Route path="report/:id" element={<ReportDetailPage />} />
        <Route path="leaderboard" element={<CitizenLeaderboardPage />} />
        <Route path="score" element={<CitizenScorePage />} />
        <Route path="notifications" element={<CitizenNotificationsPage />} />
        <Route path="profile" element={<CitizenProfilePage />} />
      </Route>
    </Route>
  );
}
