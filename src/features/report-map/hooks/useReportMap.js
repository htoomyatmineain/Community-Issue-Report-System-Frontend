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
// Module-level cache for instant map navigation
let mapPinsCache = {
  publicPins: null,
  publicPinsTime: 0,
  internalPins: null,
  internalPinsTime: 0,
  categories: null,
};
const MAP_CACHE_TTL_MS = 60_000;

export function useReportMap({ publicPins = false } = {}) {
  const cachedPins = publicPins ? mapPinsCache.publicPins : mapPinsCache.internalPins;
  const [pins, setPins] = useState(() => cachedPins ?? []);
  const [isLoading, setIsLoading] = useState(() => !cachedPins);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(() => mapPinsCache.categories ?? []);

  const [categoryId, setCategoryId] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [selectedPinId, setSelectedPinId] = useState(null);

  useEffect(() => {
    if (mapPinsCache.categories) {
      setCategories(mapPinsCache.categories);
      return;
    }
    reportMapApi.listCategories()
      .then((cats) => {
        mapPinsCache.categories = cats;
        setCategories(cats);
      })
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const cacheTime = publicPins ? mapPinsCache.publicPinsTime : mapPinsCache.internalPinsTime;
    const isStale = Date.now() - cacheTime > MAP_CACHE_TTL_MS;

    if (!cachedPins) {
      setIsLoading(true);
    }
    setError(null);

    if (!cachedPins || isStale) {
      const request = publicPins ? reportMapApi.getPublicPins() : reportMapApi.getPins({});
      request
        .then((data) => {
          if (!cancelled) {
            const list = Array.isArray(data) ? data : [];
            setPins(list);
            if (publicPins) {
              mapPinsCache.publicPins = list;
              mapPinsCache.publicPinsTime = Date.now();
            } else {
              mapPinsCache.internalPins = list;
              mapPinsCache.internalPinsTime = Date.now();
            }
          }
        })
        .catch((err) => {
          if (!cancelled) setError(err?.response?.data?.message ?? "Failed to load map pins");
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    }

    return () => {
      cancelled = true;
    };
  }, [publicPins, cachedPins]);

  const filteredPins = useMemo(() => {
    // Match on categoryId when the pin carries it; fall back to the category
    // name (older backend builds of ReportMapDTO didn't include the id).
    const selectedName =
      categoryId === "ALL" ? null : categories.find((c) => String(c.id) === String(categoryId))?.name;
    const catById = new Map(categories.map((c) => [String(c.id), c]));
    const catByName = new Map(categories.map((c) => [c.name, c]));
    return pins
      .filter((p) => {
        if (categoryId !== "ALL") {
          const byId = p.categoryId != null && String(p.categoryId) === String(categoryId);
          const byName = selectedName != null && p.categoryName === selectedName;
          if (!byId && !byName) return false;
        }
        if (status !== "ALL" && p.status !== status) return false;
        if (priority !== "ALL" && p.priority !== priority) return false;
        return true;
      })
      // ReportMapDTO doesn't carry the category's icon/colour, so join it in from
      // the already-fetched /api/categories list — the map pins can then show a
      // per-category glyph, not just a colour.
      .map((p) => {
        const cat = catById.get(String(p.categoryId)) ?? catByName.get(p.categoryName);
        return {
          ...p,
          categoryIcon: p.categoryIcon ?? cat?.icon ?? null,
          categoryColor: p.categoryColor ?? cat?.colorHex ?? null,
        };
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
