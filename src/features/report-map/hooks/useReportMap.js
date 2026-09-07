import { useEffect, useMemo, useState } from "react";
import { reportMapApi } from "../api/reportMapApi";

/**
 * Shared by the citizen map tab, the console full map view, and the staff
 * dashboard mini-map.
 *
 * The pin set is fetched exactly once per mount — never re-fetched on pan,
 * zoom, or filter change. Every filter (category / status / priority) is
 * applied client-side against the returned pins, which keeps the map instant
 * to interact with and lets the citizen map ride the server-side cache.
 *
 * @param {{ publicPins?: boolean }} [opts] `publicPins: true` (citizen) hits
 *   the cached, role-agnostic `/reports/map/public` endpoint; the default
 *   hits the role-scoped `/reports/map` (staff/admin also see
 *   PENDING_APPROVAL and REJECTED reports).
 */
export function useReportMap({ publicPins = false } = {}) {
  const [pins, setPins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const [categoryId, setCategoryId] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [selectedPinId, setSelectedPinId] = useState(null);

  useEffect(() => {
    reportMapApi.listCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    const request = publicPins ? reportMapApi.getPublicPins() : reportMapApi.getPins({});
    request
      .then((data) => {
        if (!cancelled) setPins(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message ?? "Failed to load map pins");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [publicPins]);

  const filteredPins = useMemo(() => {
    // Match on categoryId when the pin carries it; fall back to the category
    // name (older backend builds of ReportMapDTO didn't include the id).
    const selectedName =
      categoryId === "ALL" ? null : categories.find((c) => String(c.id) === String(categoryId))?.name;
    return pins.filter((p) => {
      if (categoryId !== "ALL") {
        const byId = p.categoryId != null && String(p.categoryId) === String(categoryId);
        const byName = selectedName != null && p.categoryName === selectedName;
        if (!byId && !byName) return false;
      }
      if (status !== "ALL" && p.status !== status) return false;
      if (priority !== "ALL" && p.priority !== priority) return false;
      return true;
    });
  }, [pins, categoryId, status, priority, categories]);

  const selectedPin = useMemo(
    () => filteredPins.find((p) => p.id === selectedPinId) ?? null,
    [filteredPins, selectedPinId]
  );

  return {
    pins: filteredPins,
    isLoading,
    error,
    categories,
    categoryId,
    setCategoryId,
    status,
    setStatus,
    priority,
    setPriority,
    selectedPin,
    selectedPinId,
    selectPin: setSelectedPinId,
  };
}
