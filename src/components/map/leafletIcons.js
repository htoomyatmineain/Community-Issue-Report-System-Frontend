import L from "leaflet";
import { categoryGlyphSvg } from "@/lib/categoryIcons";

/**
 * Every pin is a divIcon (inline-styled circle), never L.marker()/L.Icon.Default —
 * this sidesteps Vite's classic "default marker image 404s" bug entirely instead
 * of working around it, and lets both the fill colour (categoryColor) and the
 * glyph inside be dynamic per-pin so a category is identifiable by shape, not
 * just colour.
 *
 * @param {string} colorHex  pin fill
 * @param {{name?: string, icon?: string}} category  used to pick the glyph
 */
export function categoryDivIcon(colorHex, category, { selected = false, isBreached = false } = {}) {
  const size = selected ? 34 : 28;
  const glyph = selected ? 18 : 15;
  const shadow = "0 1px 3px rgba(0,0,0,0.4)";
  const ring = selected
    ? `0 0 0 3px rgba(37,99,235,0.4), ${shadow}`
    : isBreached
    ? `0 0 0 2.5px #ef4444, ${shadow}`
    : shadow;

  const breachedWaves = isBreached
    ? `<span class="sla-breached-wave-1"></span><span class="sla-breached-wave-2"></span>`
    : "";

  return L.divIcon({
    className: isBreached ? "sla-breached-marker" : "",
    html: `<span class="sla-marker-wrapper" style="position:relative;display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;overflow:visible;">${breachedWaves}<span style="position:relative;z-index:2;display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:9999px;background:${colorHex};border:2px solid white;box-shadow:${ring};">${categoryGlyphSvg(
      category ?? {},
      { size: glyph }
    )}</span></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

/** Low-opacity brand blue cluster badge with backdrop blur and soft glow halo. */
export function clusterIconFn(cluster) {
  const count = cluster.getChildCount();
  return L.divIcon({
    className: "",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:9999px;background:rgba(35,127,234,0.78);color:white;font-weight:700;font-size:13px;border:2.5px solid rgba(255,255,255,0.92);box-shadow:0 0 0 5px rgba(35,127,234,0.22),0 4px 12px rgba(0,0,0,0.2);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);">${count}</span>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
}
