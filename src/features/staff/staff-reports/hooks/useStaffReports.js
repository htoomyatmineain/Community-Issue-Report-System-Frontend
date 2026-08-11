import { useState } from "react";

/** Feature-local hook for staff-reports. Replace with real data fetching/state. */
export function useStaffReports() {
  const [state, setState] = useState(null);
  return { state, setState };
}
