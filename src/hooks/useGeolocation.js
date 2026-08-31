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
        setError(messageFor(err));
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  // Exposed so a manual placement (drag/click on the map fallback) can also
  // satisfy the "location is required" rule — see ui-rules.md's fallback
  // for when permission is denied.
  function setManualPosition({ latitude, longitude }) {
    setPosition({ latitude, longitude });
    setError(null);
  }

  return { position, isLocating, error, locate, setManualPosition };
}

function messageFor(err) {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return "Location access was denied. Drag the pin on the map to set your location instead.";
    case err.POSITION_UNAVAILABLE:
      return "Your location couldn't be determined right now. Drag the pin on the map to set it instead.";
    case err.TIMEOUT:
      return "Finding your location took too long. Drag the pin on the map to set it instead.";
    default:
      return "Couldn't get your location. Drag the pin on the map to set it instead.";
  }
}
