import { useEffect, useState } from "react";

/** Browser geolocation for citizen-report/citizen-map/staff-map pin placement. */
export function useGeolocation(options) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error("Geolocation is not supported"));
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      setError,
      options
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [options]);

  return { position, error };
}
