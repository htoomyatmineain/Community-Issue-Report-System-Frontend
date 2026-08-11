import { useState } from "react";

/** Feature-local hook for staff-notifications. Replace with real data fetching/state. */
export function useStaffNotifications() {
  const [state, setState] = useState(null);
  return { state, setState };
}
