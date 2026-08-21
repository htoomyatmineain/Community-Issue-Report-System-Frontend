import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { adminStaffApi } from "../api/adminStaffApi";

/** Owns the staff table, the active-department options for the create form, and the create mutation. */
export function useAdminStaff() {
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [staffRes, departmentsRes] = await Promise.all([
        adminStaffApi.list({ search: debouncedSearch || undefined }),
        adminStaffApi.listDepartments(),
      ]);
      setStaff(staffRes.data);
      setDepartments(departmentsRes.data);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load staff");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function create(payload) {
    const { data } = await adminStaffApi.create(payload);
    setStaff((prev) => [...prev, data]);
    return data;
  }

  return { staff, departments, isLoading, error, search, setSearch, create };
}
