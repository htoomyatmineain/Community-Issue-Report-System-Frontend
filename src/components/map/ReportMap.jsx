import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { cn } from "@/lib/utils";
import { categoryDivIcon, clusterIconFn } from "./leafletIcons";

const DEFAULT_CENTER = [16.8409, 96.1735]; // Yangon — matches every sample coordinate across context-kit
const DEFAULT_ZOOM = 13;

function boundsToParams(map) {
  const b = map.getBounds();
  return {
    minLat: b.getSouth(),
    maxLat: b.getNorth(),
    minLng: b.getWest(),
    maxLng: b.getEast(),
  };
}

/** Fires onBoundsChange on user-driven moveend only — programmatic moves (the one-time fitBounds) are ignored via `programmaticRef`. */
function MapEvents({ onBoundsChange, programmaticRef }) {
  useMapEvents({
    moveend: (e) => {
      if (programmaticRef.current) {
        programmaticRef.current = false;
        return;
      }
      onBoundsChange?.(boundsToParams(e.target));
    },
  });
  return null;
}

/**
 * Shared Leaflet map — used by the citizen map tab, the console full map view,
 * and the report-detail Overview tab's single-pin snippet. Never fetches data
 * itself; callers own `pins`/filters via `useReportMap` and just render this.
 */
export default function ReportMap({
  pins = [],
  selectedPinId = null,
  onPinClick,
  onBoundsChange,
  cluster = true,
  interactive = true,
  fitToPins = true,
  initialCenter = DEFAULT_CENTER,
  initialZoom = DEFAULT_ZOOM,
  resizeSignal,
  className,
}) {
  const mapRef = useRef(null);
  const hasFitRef = useRef(false);
  const programmaticRef = useRef(false);

  // The container's final flex-layout size isn't always settled at the instant
  // Leaflet reads it on mount (grid/flex parents especially) — a stale size
  // makes Leaflet request the wrong tile grid, leaving gaps. One nudge fixes it.
  useEffect(() => {
    const timer = setTimeout(() => mapRef.current?.invalidateSize(), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!fitToPins || hasFitRef.current || pins.length === 0 || !mapRef.current) return;
    hasFitRef.current = true;
    programmaticRef.current = true;
    const bounds = L.latLngBounds(pins.map((p) => [p.latitude, p.longitude]));
    mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  }, [pins, fitToPins]);

  useEffect(() => {
    if (!mapRef.current) return;
    const timer = setTimeout(() => mapRef.current?.invalidateSize(), 300);
    return () => clearTimeout(timer);
  }, [resizeSignal]);

  const markers = pins.map((pin) => (
    <Marker
      key={pin.id}
      position={[pin.latitude, pin.longitude]}
      icon={categoryDivIcon(pin.categoryColor ?? "#475569", { selected: pin.id === selectedPinId })}
      eventHandlers={{ click: () => onPinClick?.(pin) }}
    />
  ));

  return (
    <div className={cn("relative isolate h-full w-full", className)}>
      <MapContainer
        ref={mapRef}
        center={initialCenter}
        zoom={initialZoom}
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        touchZoom={interactive}
        boxZoom={interactive}
        keyboard={interactive}
        zoomControl={interactive}
        attributionControl={interactive}
        className="h-full w-full"
      >
        {/* No {s} subdomain sharding — OSM's current tile usage policy discourages it, and the a/b/c hosts don't resolve everywhere. */}
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents onBoundsChange={onBoundsChange} programmaticRef={programmaticRef} />
        {cluster ? (
          <MarkerClusterGroup iconCreateFunction={clusterIconFn}>{markers}</MarkerClusterGroup>
        ) : (
          markers
        )}
      </MapContainer>
    </div>
  );
}
