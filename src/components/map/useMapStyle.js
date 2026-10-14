import { useState, useEffect } from "react";
import { useTheme } from "@/app/providers/ThemeProvider";

export const MAP_STORAGE_KEY = "scirs_map_style";

/**
 * 100% Keyless, zero-watermark OpenStreetMap & Satellite layers in English:
 *  1. OpenStreetMap (English): Classic OpenStreetMap tiles with English place and road labels.
 *  2. Dark OpenStreetMap (English): Real OpenStreetMap tiles inverted with high-contrast dark palette + English labels.
 *  3. Satellite: Esri World Imagery aerial photography + English boundaries and road labels.
 */
export const MAP_STYLES = {
  osm: {
    id: "osm",
    name: "OpenStreetMap",
    sublabel: "English Edition",
    description: "Classic OpenStreetMap with English street & place labels",
    badge: "English",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    labelsUrl: "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    tileClassName: "",
    labelsClassName: "",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; Esri',
    maxZoom: 19,
    maxNativeZoom: 19,
  },
  osm_dark: {
    id: "osm_dark",
    name: "Dark OpenStreetMap",
    sublabel: "English Edition",
    description: "Sleek dark OpenStreetMap with clear English labels",
    badge: "Dark",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    labelsUrl: "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    tileClassName: "osm-dark-tiles",
    labelsClassName: "osm-dark-labels",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; Esri',
    maxZoom: 19,
    maxNativeZoom: 19,
  },
  satellite: {
    id: "satellite",
    name: "Satellite",
    sublabel: "Aerial Imagery + English Labels",
    description: "High-resolution satellite view with English roads & boundaries",
    badge: "Hybrid",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    labelsUrl: "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    tileClassName: "",
    labelsClassName: "",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP',
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
    // Map previous legacy names if saved in local storage
    if (stored === "dark") return "osm_dark";
    if (stored === "light") return "osm";
    return theme === "dark" ? "osm_dark" : "osm";
  });

  useEffect(() => {
    if (overrideStyle && MAP_STYLES[overrideStyle]) {
      setMapStyleState(overrideStyle);
    }
  }, [overrideStyle]);

  useEffect(() => {
    function handleStorage(e) {
      if (e.key === MAP_STORAGE_KEY && e.newValue) {
        const resolved = e.newValue === "dark" ? "osm_dark" : e.newValue === "light" ? "osm" : e.newValue;
        if (MAP_STYLES[resolved]) {
          setMapStyleState(resolved);
        }
      }
    }
    function handleCustom(e) {
      if (e.detail) {
        const resolved = e.detail === "dark" ? "osm_dark" : e.detail === "light" ? "osm" : e.detail;
        if (MAP_STYLES[resolved]) {
          setMapStyleState(resolved);
        }
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
    const resolved = newStyle === "dark" ? "osm_dark" : newStyle === "light" ? "osm" : newStyle;
    if (!MAP_STYLES[resolved]) return;
    setMapStyleState(resolved);
    try {
      localStorage.setItem(MAP_STORAGE_KEY, resolved);
    } catch {
      // Storage unavailable
    }
    window.dispatchEvent(new CustomEvent("scirs-map-style-changed", { detail: resolved }));
  };

  return {
    mapStyle: overrideStyle || mapStyle,
    setMapStyle,
    currentConfig: MAP_STYLES[overrideStyle || mapStyle] || MAP_STYLES.osm,
    styles: MAP_STYLES,
  };
}
