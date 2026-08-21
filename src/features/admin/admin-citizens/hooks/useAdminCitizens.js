import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { adminCitizensApi } from "../api/adminCitizensApi";

/** Owns the citizen table's search/filter state, the fetched rows, and the suspend/remove mutations. */
export function useAdminCitizens() {
  const [citizens, setCitizens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const debouncedSearch = useDebounce(search, 300);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await adminCitizensApi.list({
        search: debouncedSearch || undefined,
        accountStatus: status === "ALL" ? undefined : status,
      });
      setCitizens(data);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load citizens");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, status]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function suspend(id) {
    await adminCitizensApi.suspend(id);
    setCitizens((prev) => prev.map((c) => (c.id === id ? { ...c, accountStatus: "SUSPENDED" } : c)));
  }

  async function remove(id) {
    await adminCitizensApi.remove(id);
    setCitizens((prev) => prev.map((c) => (c.id === id ? { ...c, active: false } : c)));
  }

  return { citizens, isLoading, error, search, setSearch, status, setStatus, suspend, remove };
}
