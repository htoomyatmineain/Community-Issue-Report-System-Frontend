import { useState, useEffect } from "react";
import { useTheme } from "@/app/providers/ThemeProvider";

export const MAP_STORAGE_KEY = "scirs_map_style";

/**
 * 100% Keyless, zero-watermark map tile layers.
 * - Esri World Street: Free, keyless, English street & landmark labels.
 * - Esri Dark Gray Canvas: Free, keyless, high-contrast dark theme with English labels.
 * - Esri World Imagery: Free, keyless, aerial satellite photography + English place names.
 * - OpenStreetMap Standard: Free, keyless classic map (the previous working map).
 */
export const MAP_STYLES = {
  light: {
    id: "light",
    name: "Light Mode",
    sublabel: "English Streets",
    description: "Clean English street map with verified avenues & landmarks",
    badge: "English",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, METI, TomTom',
    maxZoom: 19,
    maxNativeZoom: 19,
  },
  dark: {
    id: "dark",
    name: "Dark Mode",
    sublabel: "English Dark Canvas",
    description: "Sleek low-light contrast with clear English street names (no watermark)",
    badge: "Night",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    labelsUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 19,
    maxNativeZoom: 16,
  },
  satellite: {
    id: "satellite",
    name: "Satellite",
    sublabel: "Aerial Imagery + English Labels",
    description: "High-resolution satellite view with English roads & boundaries",
    badge: "Hybrid",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    labelsUrl: "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP',
    maxZoom: 19,
    maxNativeZoom: 19,
  },
  osm: {
    id: "osm",
    name: "OpenStreetMap",
    sublabel: "Classic Map",
    description: "Standard community map (the previous working map)",
    badge: "Classic",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    maxNativeZoom: 19,
  },
};

export function useMapStyle(overrideStyle = null) {
  let theme = "light";
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
  } catch {
    // Graceful fallback if rendered outside ThemeProvider
  }

  const [mapStyle, setMapStyleState] = useState(() => {
    if (overrideStyle && MAP_STYLES[overrideStyle]) return overrideStyle;
    const stored = typeof window !== "undefined" ? localStorage.getItem(MAP_STORAGE_KEY) : null;
    if (stored && MAP_STYLES[stored]) return stored;
    return theme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    if (overrideStyle && MAP_STYLES[overrideStyle]) {
      setMapStyleState(overrideStyle);
    }
  }, [overrideStyle]);

  useEffect(() => {
    function handleStorage(e) {
      if (e.key === MAP_STORAGE_KEY && e.newValue && MAP_STYLES[e.newValue]) {
        setMapStyleState(e.newValue);
      }
    }
    function handleCustom(e) {
      if (e.detail && MAP_STYLES[e.detail]) {
        setMapStyleState(e.detail);
      }
    }
    window.addEventListener("storage", handleStorage);
    window.addEventListener("scirs-map-style-changed", handleCustom);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("scirs-map-style-changed", handleCustom);
    };
  }, []);

  const setMapStyle = (newStyle) => {
    if (!MAP_STYLES[newStyle]) return;
    setMapStyleState(newStyle);
    try {
      localStorage.setItem(MAP_STORAGE_KEY, newStyle);
    } catch {
      // Storage unavailable
    }
    window.dispatchEvent(new CustomEvent("scirs-map-style-changed", { detail: newStyle }));
  };

  return {
    mapStyle: overrideStyle || mapStyle,
    setMapStyle,
    currentConfig: MAP_STYLES[overrideStyle || mapStyle] || MAP_STYLES.light,
    styles: MAP_STYLES,
  };
}
