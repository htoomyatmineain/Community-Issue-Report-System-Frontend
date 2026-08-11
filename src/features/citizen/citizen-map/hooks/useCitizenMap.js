import { useState } from "react";

/** Feature-local hook for citizen-map. Replace with real data fetching/state. */
export function useCitizenMap() {
  const [state, setState] = useState(null);
  return { state, setState };
}
