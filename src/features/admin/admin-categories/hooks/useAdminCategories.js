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
      setCategories(categoriesRes.data);
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
    setCategories((prev) => prev.map((c) => (c.id === id ? data : c)));
    return data;
  }

  async function remove(id) {
    await categoriesApi.remove(id);
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, active: false } : c)));
  }

  return { categories, departments, isLoading, error, fetchAll, create, update, remove };
}
