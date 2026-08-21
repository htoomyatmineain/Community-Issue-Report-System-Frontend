import { useCallback, useEffect, useState } from "react";
import { departmentsApi } from "../api/departmentsApi";

/** Owns the department list plus create/update/remove mutations for the admin console. */
export function useAdminDepartments() {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await departmentsApi.list();
      setDepartments(data);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load departments");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function create(payload) {
    const { data } = await departmentsApi.create(payload);
    setDepartments((prev) => [...prev, data]);
    return data;
  }

  async function update(id, payload) {
    const { data } = await departmentsApi.update(id, payload);
    setDepartments((prev) => prev.map((d) => (d.id === id ? data : d)));
    return data;
  }

  async function remove(id) {
    await departmentsApi.remove(id);
    setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, active: false } : d)));
  }

  return { departments, isLoading, error, fetchAll, create, update, remove };
}
