import { useCallback, useEffect, useRef, useState } from "react";
import { citizenHomeApi } from "../api/citizenHomeApi";

// The backend has no websocket/SSE channel, so the "What's happening in Yangon"
// feed stays current by re-pulling on a timer while the page is open and
// immediately whenever the tab regains focus.
const REFRESH_INTERVAL_MS = 45_000;
const FEED_LIMIT = 8;

/** Recent citizen-visible reports from anyone in the city ("What's happening in Yangon"). */
export function useCityReports() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(false);

  const load = useCallback(async ({ background = false } = {}) => {
    if (!background) setIsLoading(true);
    try {
      const result = await citizenHomeApi.getCityPulse({ limit: FEED_LIMIT });
      if (!mountedRef.current) return;
      setReports(result);
      setError(null);
    } catch (err) {
      if (!mountedRef.current) return;
      // A failed background refresh keeps the last good feed on screen.
      if (!background) {
        setError(err?.response?.data?.message ?? "Failed to load city reports");
      }
    } finally {
      if (mountedRef.current && !background) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    load();

    const interval = setInterval(() => load({ background: true }), REFRESH_INTERVAL_MS);
    const refetchOnFocus = () => {
      if (document.visibilityState !== "hidden") load({ background: true });
    };
    document.addEventListener("visibilitychange", refetchOnFocus);
    window.addEventListener("focus", refetchOnFocus);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", refetchOnFocus);
      window.removeEventListener("focus", refetchOnFocus);
    };
  }, [load]);

  return { reports, isLoading, error, refresh: () => load({ background: true }) };
}
