import { useState } from "react";

/** Feature-local hook for staff-departments. Replace with real data fetching/state. */
export function useStaffDepartments() {
  const [state, setState] = useState(null);
  return { state, setState };
}
