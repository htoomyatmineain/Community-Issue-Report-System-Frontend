import { useState, useEffect } from "react";
import { useTheme } from "@/app/providers/ThemeProvider";

export const MAP_STORAGE_KEY = "scirs_map_style";

export const MAP_STYLES = {
  light: {
    id: "light",
    name: "Light Mode",
    sublabel: "English Streets",
    description: "Clean English street map with landmarks and parks",
    badge: "English",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    subdomains: "abcd",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  },
  dark: {
    id: "dark",
    name: "Dark Mode",
    sublabel: "English Dark Matter",
    description: "Sleek low-light contrast with clear English street names",
    badge: "Night",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    subdomains: "abcd",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  },
  satellite: {
    id: "satellite",
    name: "Satellite",
    sublabel: "Aerial Imagery + English Labels",
    description: "High-resolution satellite view with English roads & boundaries",
    badge: "Hybrid",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    labelsUrl: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png",
    subdomains: "abcd",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP &copy; CARTO',
    maxZoom: 19,
  },
};

export function useMapStyle(overrideStyle = null) {
  let theme = "light";
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
  } catch {
    // Graceful fallback if rendered outside ThemeProvider in isolated tests
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
