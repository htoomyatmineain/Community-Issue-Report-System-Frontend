import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, CircleMarker, Tooltip, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { cn } from "@/lib/utils";
import { categoryDivIcon, clusterIconFn } from "./leafletIcons";

const DEFAULT_CENTER = [16.8409, 96.1735]; // Yangon — matches every sample coordinate across context-kit
const DEFAULT_ZOOM = 13;
const FOCUS_ZOOM = 18; // "View Location" / deep-link pan target — close enough to see the exact spot

/**
 * All viewport control (fit-to-pins, pan-to-selected-pin, resize nudges,
 * self-locate recenter) lives here instead of on a `ref` off `MapContainer`.
 * `MapContainer`'s `ref` only resolves to the real Leaflet map instance after
 * an internal two-commit dance (it creates the map in a DOM ref callback,
 * `setState`s its context, and only then does `useImperativeHandle` publish
 * it) — a parent's effects can easily run once, see the ref still `null`, and
 * never be re-triggered once it's ready, leaving the map permanently stuck at
 * its initial view. `useMap()` doesn't have that race: react-leaflet only
 * renders `MapContainer`'s children once its Leaflet context already exists.
 */
function MapController({ pins, selectedPinId, fitToPins, focusLatLng, resizeSignal }) {
  const map = useMap();
  const hasFitRef = useRef(false);
  const pannedToRef = useRef(null);
  const focusedRef = useRef(null);

  // The container's final flex-layout size isn't always settled at the instant
  // Leaflet reads it on mount (grid/flex parents especially) — a stale size
  // makes Leaflet request the wrong tile grid, leaving gaps. One nudge fixes it.
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 150);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (!fitToPins || hasFitRef.current || pins.length === 0) return;
    hasFitRef.current = true;
    // A deep-link that focuses one pin owns the viewport — skip the fit-to-all.
    if (selectedPinId != null && pins.some((p) => p.id === selectedPinId)) return;
    const bounds = L.latLngBounds(pins.map((p) => [p.latitude, p.longitude]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  }, [map, pins, fitToPins, selectedPinId]);

  // Pan to the selected pin (map deep-links, list "View Location", etc.).
  // Zooms to a fixed close-in level (not just "at least as close as now") so the
  // exact spot is always clearly visible, however far out the map happened to be.
  useEffect(() => {
    if (selectedPinId == null || pannedToRef.current === selectedPinId) return;
    const pin = pins.find((p) => p.id === selectedPinId);
    if (!pin) return;
    pannedToRef.current = selectedPinId;
    const target = [pin.latitude, pin.longitude];
    map.setView(target, FOCUS_ZOOM, { animate: true });
    // The container's layout size can still be settling right after mount (see
    // the invalidateSize workaround above) — re-assert once things stabilize so
    // the pan/zoom isn't silently lost to a stale tile grid.
    const timer = setTimeout(() => {
      map.invalidateSize();
      map.setView(target, FOCUS_ZOOM, { animate: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [map, selectedPinId, pins]);

  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 300);
    return () => clearTimeout(timer);
  }, [map, resizeSignal]);

  // Recenter on the caller's point ("Self-Locate"). A new object reference each
  // time re-triggers the pan even to the same coordinates.
  useEffect(() => {
    if (!focusLatLng || focusedRef.current === focusLatLng) return;
    focusedRef.current = focusLatLng;
    map.setView([focusLatLng.lat, focusLatLng.lng], Math.max(map.getZoom(), 16), { animate: true });
  }, [map, focusLatLng]);

  return null;
}

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
  const markers = pins.map((pin) => (
    <Marker
      key={pin.id}
      position={[pin.latitude, pin.longitude]}
      icon={categoryDivIcon(
        pin.categoryColor ?? "#475569",
        { name: pin.categoryName, icon: pin.categoryIcon },
        { selected: pin.id === selectedPinId }
      )}
      eventHandlers={{ click: () => onPinClick?.(pin) }}
    >
      {pin.categoryName && (
        <Tooltip direction="top" offset={[0, -16]} opacity={1}>
          {pin.categoryName}
        </Tooltip>
      )}
    </Marker>
  ));

  return (
    <div className={cn("relative isolate h-full w-full", className)}>
      <MapContainer
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
        <MapController
          pins={pins}
          selectedPinId={selectedPinId}
          fitToPins={fitToPins}
          focusLatLng={focusLatLng}
          resizeSignal={resizeSignal}
        />
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
