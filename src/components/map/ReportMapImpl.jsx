import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, CircleMarker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { cn } from "@/lib/utils";
import { categoryDivIcon, clusterIconFn } from "./leafletIcons";

const DEFAULT_CENTER = [16.8409, 96.1735]; // Yangon — matches every sample coordinate across context-kit
const DEFAULT_ZOOM = 13;

/**
 * Shared Leaflet map — used by the citizen map tab, the console full map view,
 * the staff dashboard mini-map, and the report-detail Overview tab's single-pin
 * snippet. Never fetches data itself; callers own `pins`/filters via
 * `useReportMap` and just render this.
 *
 * Loaded lazily through ./ReportMap.jsx so the Leaflet stack (the `map-vendor`
 * chunk) only downloads on screens that actually show a map.
 */
export default function ReportMapImpl({
  pins = [],
  selectedPinId = null,
  onPinClick,
  cluster = true,
  interactive = true,
  zoomControl = interactive,
  fitToPins = true,
  initialCenter = DEFAULT_CENTER,
  initialZoom = DEFAULT_ZOOM,
  focusLatLng = null,
  resizeSignal,
  className,
}) {
  const mapRef = useRef(null);
  const hasFitRef = useRef(false);
  const pannedToRef = useRef(null);
  const focusedRef = useRef(null);

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
    // A deep-link that focuses one pin owns the viewport — skip the fit-to-all.
    if (selectedPinId != null && pins.some((p) => p.id === selectedPinId)) return;
    const bounds = L.latLngBounds(pins.map((p) => [p.latitude, p.longitude]));
    mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  }, [pins, fitToPins, selectedPinId]);

  // Pan to the selected pin (map deep-links, list "View Location", etc.).
  useEffect(() => {
    if (selectedPinId == null || !mapRef.current || pannedToRef.current === selectedPinId) return;
    const pin = pins.find((p) => p.id === selectedPinId);
    if (!pin) return;
    pannedToRef.current = selectedPinId;
    mapRef.current.setView([pin.latitude, pin.longitude], Math.max(mapRef.current.getZoom(), 16), {
      animate: true,
    });
  }, [selectedPinId, pins]);

  useEffect(() => {
    if (!mapRef.current) return;
    const timer = setTimeout(() => mapRef.current?.invalidateSize(), 300);
    return () => clearTimeout(timer);
  }, [resizeSignal]);

  // Recenter on the caller's point ("Self-Locate"). A new object reference each
  // time re-triggers the pan even to the same coordinates.
  useEffect(() => {
    if (!focusLatLng || !mapRef.current || focusedRef.current === focusLatLng) return;
    focusedRef.current = focusLatLng;
    mapRef.current.setView(
      [focusLatLng.lat, focusLatLng.lng],
      Math.max(mapRef.current.getZoom(), 16),
      { animate: true }
    );
  }, [focusLatLng]);

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
        zoomControl={zoomControl}
        attributionControl={interactive}
        className="h-full w-full"
      >
        {/* OpenStreetMap standard tiles — bare domain, no {s} subdomain sharding
            (OSM now discourages it, and the sharded hosts were found unreliable
            here). CARTO's keyless basemap CDN was tried and dropped: its tiles
            loaded slowly/intermittently, which is what made the map look like it
            wasn't working. */}
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {cluster ? (
          <MarkerClusterGroup iconCreateFunction={clusterIconFn}>{markers}</MarkerClusterGroup>
        ) : (
          markers
        )}
        {focusLatLng && (
          <CircleMarker
            center={[focusLatLng.lat, focusLatLng.lng]}
            radius={7}
            pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#237FEA", fillOpacity: 1 }}
          />
        )}
      </MapContainer>
    </div>
  );
}
