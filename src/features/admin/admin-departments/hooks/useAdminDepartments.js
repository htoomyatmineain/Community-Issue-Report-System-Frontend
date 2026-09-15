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
      // The console table only shows live departments — a deleted (deactivated)
      // one stays in the database for existing categories'/reports' FK
      // integrity, but should never reappear in this list.
      setDepartments(data.filter((d) => d.active));
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
    // Toggling "Active" off in the edit form is another way to deactivate —
    // treat it the same as delete and drop the row from the table.
    setDepartments((prev) =>
      data.active ? prev.map((d) => (d.id === id ? data : d)) : prev.filter((d) => d.id !== id)
    );
    return data;
  }

  async function remove(id) {
    await departmentsApi.remove(id);
    // The backend soft-deletes (flips `active` false, row stays for existing
    // categories'/reports' FK integrity) — the console table only ever shows
    // live departments, so the row is dropped here rather than badged Inactive.
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  }

  return { departments, isLoading, error, fetchAll, create, update, remove };
}
