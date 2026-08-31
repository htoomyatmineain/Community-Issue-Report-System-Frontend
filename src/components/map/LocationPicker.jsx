import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

const DEFAULT_CENTER = [16.8409, 96.1735]; // Yangon — matches ReportMap.jsx
const DEFAULT_ZOOM = 15;

/** A draggable teardrop pin — divIcon, matching the "never L.marker()/L.Icon.Default" rule in leafletIcons.js. */
function pickerDivIcon() {
  return L.divIcon({
    className: "",
    html: `<svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4))">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 27 15 27s15-16.5 15-27C30 6.7 23.3 0 15 0z" fill="var(--primary, #2563eb)"/>
      <circle cx="15" cy="15" r="6" fill="white"/>
    </svg>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });
}

function ClickToPlace({ onChange }) {
  useMapEvents({
    click(e) {
      onChange({ latitude: e.latlng.lat, longitude: e.latlng.lng });
    },
  });
  return null;
}

/**
 * ui-rules.md: "GPS is captured automatically on open; if permission is
 * denied, show the map with a draggable pin and a plain message explaining
 * what to do." This is that fallback (and the primary picker either way) —
 * a real, always-interactive map with a draggable/click-to-place marker, so
 * a citizen can complete a report even with location permission denied.
 */
export default function LocationPicker({ position, onChange, className }) {
  const mapRef = useRef(null);
  const hasCenteredRef = useRef(false);
  const icon = useMemo(() => pickerDivIcon(), []);

  const center = position ? [position.latitude, position.longitude] : DEFAULT_CENTER;

  // No position yet (geolocation hasn't resolved, or was denied) — seed the
  // form with the default center so "location is required" never blocks
  // submission outright; the citizen can still drag/click to correct it.
  useEffect(() => {
    if (position) return;
    onChange({ latitude: DEFAULT_CENTER[0], longitude: DEFAULT_CENTER[1] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-center the view (without fighting the user's own pan/zoom) the first
  // time a real position arrives — e.g. "Use my location" resolving after
  // the map already mounted at the default center.
  useEffect(() => {
    if (!position || hasCenteredRef.current || !mapRef.current) return;
    hasCenteredRef.current = true;
    mapRef.current.setView([position.latitude, position.longitude], DEFAULT_ZOOM);
  }, [position]);

  useEffect(() => {
    const timer = setTimeout(() => mapRef.current?.invalidateSize(), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("relative isolate h-full w-full overflow-hidden rounded-lg", className)}>
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ClickToPlace onChange={onChange} />
        <Marker
          position={center}
          icon={icon}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const { lat, lng } = e.target.getLatLng();
              onChange({ latitude: lat, longitude: lng });
            },
          }}
        />
      </MapContainer>
    </div>
  );
}
