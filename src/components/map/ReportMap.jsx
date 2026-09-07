import { lazy, Suspense } from "react";

// The Leaflet stack (react-leaflet, markercluster, leaflet + its CSS) is heavy
// and only a few screens use it, so it lives in its own `map-vendor` chunk that
// downloads on demand here rather than in the initial bundle.
const ReportMapImpl = lazy(() => import("./ReportMapImpl"));

/** Lazy boundary around the real map — see ReportMapImpl.jsx for the props. */
export default function ReportMap(props) {
  return (
    <Suspense fallback={<div className="h-full w-full animate-pulse bg-muted" aria-hidden />}>
      <ReportMapImpl {...props} />
    </Suspense>
  );
}
