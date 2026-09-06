import { useEffect, useState } from "react";
import { staffDepartmentsApi } from "../api/staffDepartmentsApi";

/** Departments workload/performance dashboard, shared by Admin and Staff (api-standards.md role matrix). */
export function useStaffDepartments() {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    staffDepartmentsApi
      .getDashboard()
      .then((data) => {
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
