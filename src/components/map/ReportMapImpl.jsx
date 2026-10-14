import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, CircleMarker, Tooltip, useMap, ZoomControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { cn } from "@/lib/utils";
import { categoryDivIcon, clusterIconFn } from "./leafletIcons";
import { useMapStyle, MAP_STYLES } from "./useMapStyle";
import MapStyleSwitcher from "./MapStyleSwitcher";

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
function MapController({ pins, selectedPinId, fitToPins, focusLatLng, resizeSignal, fitSignal }) {
  const map = useMap();
  const hasFitRef = useRef(false);
  const pannedToRef = useRef(null);
  const focusedRef = useRef(null);
  const prevFitSignalRef = useRef(fitSignal);
  // Filters recompute `pins` via useMemo on every keystroke of state, so this
  // ref (not a `pins` dependency below) is what lets the fitSignal effect read
  // the just-filtered set without re-firing on every unrelated pins update
  // (e.g. categories arriving async and joining icon/colour onto the pins).
  const pinsRef = useRef(pins);
  pinsRef.current = pins;

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

  // Re-fit whenever the caller bumps fitSignal (e.g. the status filter row) —
  // zooms out to frame every pin left by the new filter, or the default Yangon
  // view if the filter left none.
  useEffect(() => {
    if (fitSignal === undefined || fitSignal === prevFitSignalRef.current) return;
    prevFitSignalRef.current = fitSignal;
    const currentPins = pinsRef.current;
    if (currentPins.length === 0) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true });
      return;
    }
    const bounds = L.latLngBounds(currentPins.map((p) => [p.latitude, p.longitude]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitSignal, map]);

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
  zoomControlPosition = "topleft",
  fitToPins = true,
  initialCenter = DEFAULT_CENTER,
  initialZoom = DEFAULT_ZOOM,
  focusLatLng = null,
  resizeSignal,
  fitSignal,
  className,
  showLayerSwitcher = true,
  switcherClassName,
  mapStyle: propMapStyle = null,
}) {
  const { mapStyle, setMapStyle, currentConfig } = useMapStyle(propMapStyle);

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
        zoomControl={false}
        attributionControl={interactive}
        className="h-full w-full"
      >
        {zoomControl && <ZoomControl position={zoomControlPosition} />}
        <MapController
          pins={pins}
          selectedPinId={selectedPinId}
          fitToPins={fitToPins}
          focusLatLng={focusLatLng}
          resizeSignal={resizeSignal}
          fitSignal={fitSignal}
        />
        {/* Dynamic Keyless Map Tiles: OpenStreetMap English, Dark OSM, or Satellite */}
        {currentConfig.labelsUrl ? (
          <>
            <TileLayer
              key={`${currentConfig.id}-base`}
              url={currentConfig.url}
              className={currentConfig.tileClassName || undefined}
              attribution={currentConfig.attribution}
              maxZoom={currentConfig.maxZoom ?? 19}
              maxNativeZoom={currentConfig.maxNativeZoom ?? 19}
            />
            <TileLayer
              key={`${currentConfig.id}-labels`}
              url={currentConfig.labelsUrl}
              className={currentConfig.labelsClassName || undefined}
              maxZoom={currentConfig.maxZoom ?? 19}
              maxNativeZoom={currentConfig.maxNativeZoom ?? 19}
            />
          </>
        ) : (
          <TileLayer
            key={currentConfig.id}
            url={currentConfig.url}
            className={currentConfig.tileClassName || undefined}
            attribution={currentConfig.attribution}
            maxZoom={currentConfig.maxZoom ?? 19}
            maxNativeZoom={currentConfig.maxNativeZoom ?? 19}
          />
        )}
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

      {/* Floating Map Style Options Card (Satellite, Dark Mode, Light Mode in English) */}
      {interactive && showLayerSwitcher && (
        <MapStyleSwitcher
          currentStyle={mapStyle}
          onSelectStyle={setMapStyle}
          className={switcherClassName}
        />
      )}
    </div>
  );
}
