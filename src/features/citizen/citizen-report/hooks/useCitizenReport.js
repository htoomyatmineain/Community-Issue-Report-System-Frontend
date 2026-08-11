import { useState } from "react";

/** Feature-local hook for citizen-report. Replace with real data fetching/state. */
export function useCitizenReport() {
  const [state, setState] = useState(null);
  return { state, setState };
}
