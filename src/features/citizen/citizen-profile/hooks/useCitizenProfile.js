import { useState } from "react";

/** Feature-local hook for citizen-profile. Replace with real data fetching/state. */
export function useCitizenProfile() {
  const [state, setState] = useState(null);
  return { state, setState };
}
