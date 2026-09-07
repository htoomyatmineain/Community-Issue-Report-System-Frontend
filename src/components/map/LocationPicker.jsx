import { lazy, Suspense } from "react";

// Lazy boundary so the Leaflet `map-vendor` chunk only loads when the citizen
// actually opens the "new report" form, not on every citizen route.
const LocationPickerImpl = lazy(() => import("./LocationPickerImpl"));

/** Lazy boundary around the draggable location picker — props in LocationPickerImpl.jsx. */
export default function LocationPicker(props) {
  return (
    <Suspense fallback={<div className="h-full w-full animate-pulse rounded-lg bg-muted" aria-hidden />}>
      <LocationPickerImpl {...props} />
    </Suspense>
  );
}
