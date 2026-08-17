import { useEffect, useMemo, useState } from "react";
import { citizenMapApi } from "../api/citizenMapApi";

/** Loads map pins and manages the category filter + selected-pin state. */
export function useCitizenMap() {
  const [pins, setPins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPinId, setSelectedPinId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    citizenMapApi
      .getPins()
      .then((result) => {
        if (!cancelled) setPins(result);
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
  }, []);

  const filteredPins = useMemo(
    () => (activeCategory === "all" ? pins : pins.filter((pin) => pin.category === activeCategory)),
    [pins, activeCategory]
  );

  const selectedPin = useMemo(
    () => filteredPins.find((pin) => pin.id === selectedPinId) ?? null,
    [filteredPins, selectedPinId]
  );

  return {
    pins: filteredPins,
    isLoading,
    error,
    activeCategory,
    setActiveCategory,
    selectedPin,
    selectPin: setSelectedPinId,
  };
}
