import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { reportMapApi } from "../api/reportMapApi";

/**
 * Shared by the citizen map tab and the console full map view. Consumers that
 * don't render a status/priority filter (citizen) just never touch those
 * setters, so they stay at "ALL" and have no effect on the request.
 */
export function useReportMap() {
  const [pins, setPins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const [categoryId, setCategoryId] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [bounds, setBounds] = useState(null);
  const [selectedPinId, setSelectedPinId] = useState(null);

  const debouncedCategoryId = useDebounce(categoryId, 300);
  const debouncedStatus = useDebounce(status, 300);
  const debouncedBounds = useDebounce(bounds, 400);

  useEffect(() => {
    reportMapApi.listCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const fetchPins = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reportMapApi.getPins({
        categoryId: debouncedCategoryId === "ALL" ? undefined : debouncedCategoryId,
        status: debouncedStatus === "ALL" ? undefined : debouncedStatus,
        ...(debouncedBounds ?? {}),
      });
      setPins(data);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load map pins");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedCategoryId, debouncedStatus, debouncedBounds]);

  useEffect(() => {
    fetchPins();
  }, [fetchPins]);

  // priority isn't a documented /api/reports/map query param — filtered client-side
  // instead, since it's already present on every returned pin (api-standards.md).
  const filteredPins = useMemo(
    () => (priority === "ALL" ? pins : pins.filter((p) => p.priority === priority)),
    [pins, priority]
  );

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
    setBounds,
    selectedPin,
    selectedPinId,
    selectPin: setSelectedPinId,
  };
}
