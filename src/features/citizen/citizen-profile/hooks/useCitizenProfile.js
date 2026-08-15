import { useEffect, useState } from "react";
import { citizenProfileApi } from "../api/citizenProfileApi";

/** Loads the logged-in citizen's account information. */
export function useCitizenProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    citizenProfileApi
      .getMyProfile()
      .then((result) => {
        if (!cancelled) setProfile(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message ?? "Failed to load your profile");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { profile, isLoading, error };
}
