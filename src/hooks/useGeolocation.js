import { useCallback, useEffect, useRef, useState } from "react";

// How long to wait for a first real fix before telling the user to fall back
// to the map. The browser's own `timeout` option should fire a TIMEOUT error
// on its own, but some platforms (desktop Chrome with OS location services
// off) never call back at all — this guarantees the UI stops spinning.
const FIRST_FIX_TIMEOUT_MS = 12000;

/**
 * Wraps the browser Geolocation API. No backend involved — this is real, not mocked.
 *
 * Two real modes:
 *  - locate()      one-shot fix (the classic "Use my location" tap)
 *  - startWatch()  continuous, real-time tracking via watchPosition — the pin
 *                  follows the device as it moves until stopWatch() (or a
 *                  manual pin placement) turns it off.
 */
export function useGeolocation() {
  const [position, setPosition] = useState(null);
  // Metres of uncertainty reported by the device for the latest fix (or null).
  const [accuracy, setAccuracy] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [error, setError] = useState(null);
  const watchIdRef = useRef(null);
  const staleTimerRef = useRef(null);
  const gotFixRef = useRef(false);

  const clearStaleTimer = useCallback(() => {
    if (staleTimerRef.current != null) {
      clearTimeout(staleTimerRef.current);
      staleTimerRef.current = null;
    }
  }, []);

  const stopWatch = useCallback(() => {
    if (watchIdRef.current != null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    watchIdRef.current = null;
    clearStaleTimer();
    setIsWatching(false);
    // Nothing is trying to reach the device any more — never leave the
    // "locating…" spinner up after a watch is torn down (e.g. the citizen
    // placed the pin themselves).
    setIsLocating(false);
  }, [clearStaleTimer]);

  // The Geolocation API is only handed to secure contexts (https, or
  // localhost). A dev build opened over plain http on a phone via the
  // machine's LAN IP still has `navigator.geolocation` defined, but every
  // call fails silently — name that cause instead of a generic error.
  const unavailableReason = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return "Geolocation isn't supported on this device.";
    }
    if (typeof window !== "undefined" && window.isSecureContext === false) {
      return "Live location needs a secure (https) connection. Open this site over https, or drag the pin on the map to set your location instead.";
    }
    return null;
  }, []);

  const applyFix = useCallback(
    (result) => {
      gotFixRef.current = true;
      clearStaleTimer();
      setPosition({
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
      });
      setAccuracy(
        typeof result.coords.accuracy === "number" ? result.coords.accuracy : null
      );
      setIsLocating(false);
      setError(null);
    },
    [clearStaleTimer]
  );

  const locate = useCallback(() => {
    const reason = unavailableReason();
    if (reason) {
      setError(reason);
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (result) => {
        applyFix(result);
        setIsLocating(false);
      },
      (err) => {
        setError(messageFor(err));
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [applyFix, unavailableReason]);

  const startWatch = useCallback(() => {
    const reason = unavailableReason();
    if (reason) {
      setError(reason);
      return;
    }
    if (watchIdRef.current != null) return; // already following

    gotFixRef.current = false;
    setIsLocating(true);
    setError(null);
    setIsWatching(true);

    // Fast first fix: watchPosition can be slow to deliver its first reading,
    // so ask for one immediately in parallel. A cached fix (maximumAge) is
    // fine for the initial centre — the watch refines it from there.
    navigator.geolocation.getCurrentPosition(
      (result) => applyFix(result),
      () => {}, // the watch's own error handler reports failures
      { enableHighAccuracy: true, timeout: FIRST_FIX_TIMEOUT_MS, maximumAge: 30000 }
    );

    watchIdRef.current = navigator.geolocation.watchPosition(
      (result) => {
        applyFix(result);
        setIsLocating(false);
      },
      (err) => {
        clearStaleTimer();
        setError(messageFor(err));
        setIsLocating(false);
        // A denied / unavailable watch won't recover on its own — drop it so
        // the UI stops showing "following" and the user can fall back to the
        // draggable pin.
        if (
          err.code === err.PERMISSION_DENIED ||
          err.code === err.POSITION_UNAVAILABLE
        ) {
          stopWatch();
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );

    // Safety net for platforms that never invoke either callback (e.g. desktop
    // Chrome with the OS location service switched off — the request just
    // hangs). Give up cleanly so the citizen isn't stuck on a dead spinner.
    clearStaleTimer();
    staleTimerRef.current = setTimeout(() => {
      staleTimerRef.current = null;
      if (gotFixRef.current) return;
      stopWatch();
      setError(
        "Couldn't reach your location. Make sure location is enabled for your browser and device, then tap \"Use my location\" again — or just drag the pin on the map to set your spot."
      );
    }, FIRST_FIX_TIMEOUT_MS);
  }, [applyFix, clearStaleTimer, stopWatch, unavailableReason]);

  // Exposed so a manual placement (drag/click on the map fallback) can also
  // satisfy the "location is required" rule — see ui-rules.md's fallback
  // for when permission is denied. An explicit placement ends any spinner.
  const setManualPosition = useCallback(
    ({ latitude, longitude }) => {
      clearStaleTimer();
      setPosition({ latitude, longitude });
      setAccuracy(null);
      setIsLocating(false);
      setError(null);
    },
    [clearStaleTimer]
  );

  // Never leave a watch (or its timer) running after the component unmounts.
  useEffect(() => stopWatch, [stopWatch]);

  return {
    position,
    accuracy,
    isLocating,
    isWatching,
    error,
    locate,
    startWatch,
    stopWatch,
    setManualPosition,
  };
}

function messageFor(err) {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return "Location access was denied. Enable location permission for this site in your browser settings, or drag the pin on the map to set your location instead.";
    case err.POSITION_UNAVAILABLE:
      return "Your location couldn't be determined right now. Check that your device's location service is on, or drag the pin on the map to set it instead.";
    case err.TIMEOUT:
      return "Finding your location took too long. Try again, or drag the pin on the map to set it instead.";
    default:
      return "Couldn't get your location. Drag the pin on the map to set it instead.";
  }
}
