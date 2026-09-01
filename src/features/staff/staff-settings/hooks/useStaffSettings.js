import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { staffSettingsApi } from "../api/staffSettingsApi";

/** Loads (and updates) the logged-in staff member's own account plus their department's name. */
export function useStaffSettings() {
  const { user } = useAuth();
  const userId = user?.id ?? user?.userId;
  const [profile, setProfile] = useState(null);
  const [departmentName, setDepartmentName] = useState(null);
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
    staffSettingsApi
      .get(userId)
      .then(async ({ data }) => {
        if (cancelled) return;
        setProfile(data);
        if (data.departmentId) {
          try {
            const { data: department } = await staffSettingsApi.getDepartment(data.departmentId);
            if (!cancelled) setDepartmentName(department.name);
          } catch {
            // Non-fatal — the profile itself still loaded fine.
          }
        }
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
    const { data } = await staffSettingsApi.update(userId, payload);
    setProfile(data);
    return data;
  }

  return { profile, departmentName, isLoading, error, updateProfile };
}
