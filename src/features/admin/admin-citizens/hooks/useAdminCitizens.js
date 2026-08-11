import { useState } from "react";

/** Feature-local hook for admin-citizens. Replace with real data fetching/state. */
export function useAdminCitizens() {
  const [state, setState] = useState(null);
  return { state, setState };
}
