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
export function categoryDivIcon(colorHex, category, { selected = false } = {}) {
  const size = selected ? 34 : 28;
  const glyph = selected ? 18 : 15;
  const shadow = "0 1px 3px rgba(0,0,0,0.4)";
  const ring = selected ? `0 0 0 3px rgba(37,99,235,0.35), ${shadow}` : shadow;
  return L.divIcon({
    className: "",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:9999px;background:${colorHex};border:2px solid white;box-shadow:${ring};">${categoryGlyphSvg(
      category ?? {},
      { size: glyph }
    )}</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

/** Neutral badge showing the cluster's pin count — not a category-color blend. */
export function clusterIconFn(cluster) {
  const count = cluster.getChildCount();
  return L.divIcon({
    className: "",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:9999px;background:#475569;color:white;font-weight:700;font-size:13px;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4);">${count}</span>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}
