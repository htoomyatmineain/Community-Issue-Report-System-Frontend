import { useEffect, useState } from "react";
import { staffDepartmentsApi } from "../api/staffDepartmentsApi";

/** Read-only department list for staff. */
export function useStaffDepartments() {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    staffDepartmentsApi
      .list()
      .then(({ data }) => {
        if (!cancelled) setDepartments(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message ?? "Failed to load departments");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { departments, isLoading, error };
}
