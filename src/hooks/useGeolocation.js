import { useState } from "react";

/** Wraps the browser Geolocation API. No backend involved — this is real, not mocked. */
export function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState(null);

  function locate() {
    if (!navigator.geolocation) {
      setError("Geolocation isn't supported on this device.");
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (result) => {
        setPosition({
          latitude: result.coords.latitude,
          longitude: result.coords.longitude,
        });
        setIsLocating(false);
      },
      (err) => {
        setError(err.message || "Couldn't get your location.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return { position, isLocating, error, locate };
}
