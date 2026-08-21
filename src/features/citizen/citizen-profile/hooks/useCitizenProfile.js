import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { citizenProfileApi } from "../api/citizenProfileApi";

/** Loads (and updates) the logged-in citizen's own account via GET/PUT /api/users/{id}. */
export function useCitizenProfile() {
  const { user } = useAuth();
  const userId = user?.id ?? user?.userId;
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId == null) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    citizenProfileApi
      .get(userId)
      .then(({ data }) => {
        if (!cancelled) setProfile(data);
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
  }, [userId]);

  async function updateProfile(payload) {
    const { data } = await citizenProfileApi.update(userId, payload);
    setProfile(data);
    return data;
  }

  return { profile, isLoading, error, updateProfile };
}
