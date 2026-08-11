import { useState } from "react";

/** Feature-local hook for staff-map. Replace with real data fetching/state. */
export function useStaffMap() {
  const [state, setState] = useState(null);
  return { state, setState };
}
