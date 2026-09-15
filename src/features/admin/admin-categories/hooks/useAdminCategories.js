import { useCallback, useEffect, useState } from "react";
import { categoriesApi } from "../api/categoriesApi";

/** Owns the category list, the active-department options for the form dropdown, and create/update/remove mutations. */
export function useAdminCategories() {
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [categoriesRes, departmentsRes] = await Promise.all([
        categoriesApi.list(),
        categoriesApi.listDepartments(),
      ]);
      // The console table only shows live categories — a deleted (deactivated)
      // one stays in the database for existing reports' FK integrity, but
      // should never reappear in this list.
      setCategories(categoriesRes.data.filter((c) => c.active));
      setDepartments(departmentsRes.data);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function create(payload) {
    const { data } = await categoriesApi.create(payload);
    setCategories((prev) => [...prev, data]);
    return data;
  }

  async function update(id, payload) {
    const { data } = await categoriesApi.update(id, payload);
    // Toggling "Active" off in the edit form is another way to deactivate —
    // treat it the same as delete and drop the row from the table.
    setCategories((prev) =>
      data.active ? prev.map((c) => (c.id === id ? data : c)) : prev.filter((c) => c.id !== id)
    );
    return data;
  }

  async function remove(id) {
    await categoriesApi.remove(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return { categories, departments, isLoading, error, fetchAll, create, update, remove };
}
