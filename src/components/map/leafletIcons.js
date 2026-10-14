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

/** Sleek badge showing the cluster's pin count in brand blue with low opacity matching dashboard charts. */
export function clusterIconFn(cluster) {
  const count = cluster.getChildCount();
  return L.divIcon({
    className: "",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:9999px;background:rgba(35,127,234,0.22);color:#1e40af;font-weight:800;font-size:13px;border:2px solid rgba(35,127,234,0.85);box-shadow:0 0 0 3px rgba(35,127,234,0.18),0 2px 8px rgba(0,0,0,0.15);">${count}</span>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
}
