import { createElement } from "react";
import { CATEGORY_ICON_MAP, resolveCategoryIconKey } from "./constants";

/**
 * Per-category glyphs so a report category is identifiable by shape, not just
 * colour — used in the Categories table, the map pins, the map filter chips,
 * pin detail panels and the city-reports feed.
 *
 * Each entry is the inner markup of a 24×24 lucide-style icon (stroke-based).
 * Categories are matched by NAME (exact-normalised first, then keyword), which
 * is the field every surface reliably has (`/api/categories.name`,
 * `ReportMapDTO.categoryName`). Anything unmatched falls back to the coarse
 * `category.icon` keyword buckets in lib/constants (`resolveCategoryIconKey`).
 */
const GLYPHS = [
  {
    slug: "pothole-damaged-road",
    exact: "pothole / damaged road surface",
    keywords: ["pothole", "damaged road", "road surface"],
    body: '<path d="M4 19 8 4h8l4 15"/><line x1="12" y1="8" x2="12" y2="10"/><line x1="12" y1="14" x2="12" y2="17"/><path d="m8 15 2-1 2 1"/>',
  },
  {
    slug: "damaged-footpath",
    exact: "damaged footpath or pedestrian bridge",
    keywords: ["footpath", "pedestrian bridge", "sidewalk", "walkway"],
    body: '<circle cx="12" cy="4" r="1.75"/><path d="m9 20 3-6 2 2 3 4"/><path d="m6 15 4-4 2 2 4-3"/><line x1="3" y1="21" x2="21" y2="21"/>',
  },
  {
    slug: "unsafe-building",
    exact: "unsafe or damaged public building",
    keywords: ["public building", "damaged building", "unsafe building"],
    body: '<path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><rect x="8" y="9" width="2" height="2"/><rect x="14" y="9" width="2" height="2"/><rect x="8" y="14" width="2" height="2"/><rect x="14" y="14" width="2" height="2"/><path d="M10 21v-3h4v3"/>',
  },
  {
    slug: "illegal-construction",
    exact: "illegal or unsafe construction",
    keywords: ["construction"],
    body: '<path d="M2 20h20"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15a8 8 0 0 1 16 0"/><path d="M12 10v10"/>',
  },
  {
    slug: "water-pipe-leak",
    exact: "water pipe leak or burst main",
    keywords: ["pipe leak", "burst main", "water pipe", "water leak"],
    body: '<path d="M3 10h4v4H3z"/><path d="M17 10h4v4h-4z"/><path d="M7 8h10v8H7z"/><path d="M12 16a2 2 0 0 1 2 2c0 1.1-.9 2-2 2s-2-.9-2-2a2 2 0 0 1 2-2z"/>',
  },
  {
    slug: "water-supply-failure",
    exact: "water supply failure",
    keywords: ["water supply", "supply failure", "no water"],
    body: '<path d="M4 10h12v4H4z"/><path d="M10 6v4"/><line x1="7" y1="6" x2="13" y2="6"/><path d="M12 17a2 2 0 0 0 2 2"/><line x1="2" y1="2" x2="22" y2="22"/>',
  },
  {
    slug: "blocked-drain",
    exact: "blocked drain or clogged culvert",
    keywords: ["blocked drain", "clogged culvert", "culvert", "drain"],
    body: '<rect width="18" height="18" x="3" y="3" rx="3"/><line x1="8" y1="7" x2="8" y2="17"/><line x1="12" y1="7" x2="12" y2="17"/><line x1="16" y1="7" x2="16" y2="17"/><line x1="3" y1="12" x2="21" y2="12"/>',
  },
  {
    slug: "street-flooding",
    exact: "street flooding",
    keywords: ["flooding", "flood"],
    body: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M4 22c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/>',
  },
  {
    slug: "uncollected-garbage",
    exact: "uncollected garbage",
    keywords: ["uncollected garbage", "garbage", "rubbish collection"],
    body: '<path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1.5 13a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2L5 6"/><line x1="10" y1="10" x2="10" y2="16"/><line x1="14" y1="10" x2="14" y2="16"/>',
  },
  {
    slug: "illegal-dumping",
    exact: "illegal dumping",
    keywords: ["illegal dumping", "dumping", "fly tipping"],
    body: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><path d="m10 11 4 6"/><path d="m14 11-4 6"/>',
  },
  {
    slug: "damaged-playground",
    exact: "damaged park or playground equipment",
    keywords: ["playground", "park equipment", "park or playground"],
    body: '<path d="M3 20 8 4l5 16"/><path d="M13 4l5 16"/><line x1="5.5" y1="12" x2="10.5" y2="12"/><line x1="8" y1="4" x2="13" y2="4"/><line x1="10.5" y1="4" x2="10.5" y2="14"/><rect width="3" height="1" x="9" y="14" rx="0.5"/>',
  },
  {
    slug: "fallen-tree",
    exact: "fallen tree or overgrown vegetation",
    keywords: ["fallen tree", "overgrown", "vegetation", "tree"],
    body: '<path d="M12 14v7"/><path d="M8 21h8"/><path d="M12 3a5 5 0 0 0-4.9 4A4.5 4.5 0 0 0 4 11.5 4.5 4.5 0 0 0 8.5 16h7a4.5 4.5 0 0 0 4.5-4.5 4.5 4.5 0 0 0-3.1-4A5 5 0 0 0 12 3z"/>',
  },
  {
    slug: "street-light-outage",
    exact: "street light outage",
    keywords: ["street light", "streetlight", "light outage", "lamp"],
    body: '<path d="M8 21h8"/><path d="M12 21V5a3 3 0 0 1 3-3h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1"/><circle cx="16" cy="11" r="1.5"/><line x1="2" y1="2" x2="22" y2="22"/>',
  },
  {
    slug: "power-outage",
    exact: "power outage or exposed cable",
    keywords: ["power outage", "exposed cable", "power cut", "electrical fault"],
    body: '<polygon points="13 2 4 14 11 14 10 22 20 10 13 10 13 2"/><line x1="2" y1="2" x2="22" y2="22"/>',
  },
];

/** Coarse fallback bodies (map pins for a category whose name matches nothing above). */
const FALLBACK_BODIES = {
  zap: '<path d="M13 2 3 14h8l-1 8 11-13h-8z"/>',
  construction:
    '<rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7M7 14v7M17 3v3M7 3v3M10 14 2.3 6.3M14 6l7.7 7.7M8 6l8 8"/>',
  droplets:
    '<path d="M7 16.3c2.2 0 4-1.8 4-4 0-1.2-.6-2.3-1.7-3.2S7.3 4.2 7 2c-.3 2.2-1.1 4.8-2.3 6S3 11.1 3 12.3c0 2.2 1.8 4 4 4Z"/><path d="M12.6 6.6A11 11 0 0 0 14 3c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a7 7 0 0 1-11.9 5"/>',
  trash:
    '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>',
  trees:
    '<path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6M13 19v3M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-2 2"/>',
  building:
    '<rect x="6" y="2" width="12" height="20" rx="1"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4"/>',
  "map-pin": '<path d="M20 10c0 4.4-8 12-8 12s-8-7.6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
};

const BY_EXACT = Object.fromEntries(GLYPHS.map((g) => [g.exact, g]));
const normalise = (s) => String(s ?? "").trim().toLowerCase().replace(/\s+/g, " ");

/** Category name → glyph body, or null if the name matches nothing. */
function bodyForName(name) {
  if (!name) return null;
  const n = normalise(name);
  const exact = BY_EXACT[n];
  if (exact) return exact.body;
  const hit = GLYPHS.find((g) => g.keywords.some((k) => n.includes(k)));
  return hit ? hit.body : null;
}

const SVG_BASE = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: 24,
  height: 24,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

// One stable component per glyph body — built once so `categoryIcon()` returns
// the same component reference across renders (no remount thrash in lists).
const componentCache = new Map();
function glyphComponent(key, body) {
  if (!componentCache.has(key)) {
    const Glyph = ({ className, style, ...rest }) =>
      createElement("svg", { ...SVG_BASE, className, style, dangerouslySetInnerHTML: { __html: body }, ...rest });
    Glyph.displayName = `CategoryGlyph(${key})`;
    componentCache.set(key, Glyph);
  }
  return componentCache.get(key);
}

function extract(input) {
  if (input && typeof input === "object") {
    return { name: input.name ?? input.categoryName, iconKey: input.icon ?? input.categoryIcon };
  }
  return { name: input, iconKey: input };
}

/**
 * A React component for a category's icon. Accepts a category-ish object
 * (`{ name, icon }` or `{ categoryName, categoryIcon }`) or a bare name string.
 * Always returns a component (falls back to a lucide bucket, then the pin).
 */
export function categoryIcon(input) {
  const { name, iconKey } = extract(input);
  const body = bodyForName(name);
  if (body) return glyphComponent(name ? normalise(name) : "?", body);
  return CATEGORY_ICON_MAP[resolveCategoryIconKey(iconKey)];
}

/** `<svg>` string for a Leaflet divIcon — same resolution order as `categoryIcon()`. */
export function categoryGlyphSvg({ name, icon } = {}, { size = 12, color = "#fff" } = {}) {
  const body = bodyForName(name) ?? FALLBACK_BODIES[resolveCategoryIconKey(icon)] ?? FALLBACK_BODIES["map-pin"];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}
