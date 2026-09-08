import { useEffect, useRef, useState } from "react";

/**
 * Turns a { latitude, longitude } into a human-readable street address using
 * OpenStreetMap's free Nominatim reverse geocoder — the same data source as
 * the map tiles, so no API key and no extra vendor.
 *
 * Nominatim's usage policy allows light, browser-side use (the browser sends a
 * Referer that identifies the app). We still debounce and de-duplicate so a
 * live-location watch can't hammer it — at production traffic this should move
 * to a self-hosted Nominatim or a paid geocoder.
 */
const ENDPOINT = "https://nominatim.openstreetmap.org/reverse";
const DEBOUNCE_MS = 1200;

function buildAddress(data) {
  const a = data?.address ?? {};
  // OSM's tag set doesn't line up 1:1 with Myanmar's admin levels. For Yangon
  // the useful mapping is: road → quarter (ရပ်ကွက်) → township (မြို့နယ်, tagged
  // `suburb`) → city → region; `town`/`county` here is usually the district
  // (ခရိုင်), so it only sits at the tail of the fallback chains.
  const street = a.road || a.pedestrian || a.residential || a.footway || a.path;
  const quarter = a.neighbourhood || a.quarter || a.hamlet || a.city_block;
  const township =
    a.suburb || a.city_district || a.municipality || a.borough || a.town;
  const city = a.city || a.village || a.town || a.county;
  const region = a.state || a.region;

  const line = [];
  for (const part of [street, quarter, township, city, region]) {
    if (part && !line.includes(part)) line.push(part);
  }

  return {
    line: line.join(", ") || data?.display_name || null,
    full: data?.display_name || null,
    parts: { street, quarter, township, city, region },
  };
}

export function useReverseGeocode(position, { language } = {}) {
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const resolvedKeyRef = useRef(null);

  const lat = position?.latitude ?? null;
  const lng = position?.longitude ?? null;
  // ~11 m grid: fine enough for a street address, and a jittering GPS fix
  // rounding to the same key means we don't re-request on every watch tick.
  const key = lat != null && lng != null ? `${lat.toFixed(4)},${lng.toFixed(4)}` : null;

  useEffect(() => {
    if (!key) {
      setAddress(null);
      setError(null);
      return;
    }
    if (key === resolvedKeyRef.current) return;

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setIsLoading(true);
      setError(null);

      const url =
        `${ENDPOINT}?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1` +
        (language ? `&accept-language=${encodeURIComponent(language)}` : "");

      fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } })
        .then((res) => {
          if (!res.ok) throw new Error(`Geocoder responded ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (data?.error) throw new Error(data.error);
          resolvedKeyRef.current = key;
          setAddress(buildAddress(data));
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          setError("Couldn't look up the street address for this spot.");
        })
        .finally(() => setIsLoading(false));
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [key, lat, lng, language]);

  return { address, isLoading, error };
}
