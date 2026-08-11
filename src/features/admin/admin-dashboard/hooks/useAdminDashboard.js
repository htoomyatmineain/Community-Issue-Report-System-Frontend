import { useState } from "react";

/** Feature-local hook for admin-dashboard. Replace with real data fetching/state. */
export function useAdminDashboard() {
  const [state, setState] = useState(null);
  return { state, setState };
}
