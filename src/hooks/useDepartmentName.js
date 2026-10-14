import { useEffect, useState } from "react";
import { api } from "@/services/apiClient";

const departmentNameCache = new Map();

/**
 * Resolves a department id to its official name via GET /api/departments/{id}
 * (allowed for ADMIN, STAFF, CITIZEN). Returns null while loading, when no id
 * is given, or if the lookup fails — callers treat the label as optional.
 */
export function useDepartmentName(departmentId) {
  const [name, setName] = useState(() =>
    departmentId != null ? departmentNameCache.get(departmentId) ?? null : null
  );

  useEffect(() => {
    if (departmentId == null) {
      setName(null);
      return;
    }
    if (departmentNameCache.has(departmentId)) {
      setName(departmentNameCache.get(departmentId));
      return;
    }
    let cancelled = false;
    api
      .get(`/departments/${departmentId}`)
      .then(({ data }) => {
        departmentNameCache.set(departmentId, data.name);
        if (!cancelled) setName(data.name);
      })
      .catch(() => {
        // Non-fatal — the console still works without the label.
      });
    return () => {
      cancelled = true;
    };
  }, [departmentId]);

  return name;
}
