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
    body: '<path d="M4 22 8 2M20 22 16 2"/><line x1="12" y1="4" x2="12" y2="7"/><line x1="12" y1="11" x2="12" y2="14"/><ellipse cx="14" cy="18" rx="3.5" ry="1.8"/><path d="m16.5 17 2-2M11.5 18.5l-2 1"/>',
  },
  {
    slug: "damaged-footpath",
    exact: "damaged footpath or pedestrian bridge",
    keywords: ["footpath", "pedestrian bridge", "sidewalk", "walkway"],
    body: '<path d="M2 18h20M3 14c3-2.5 6-2.5 9 0s6 2.5 9 0M6 14v4M12 14v4M18 14v4"/><circle cx="9" cy="6" r="1.5"/><path d="M9 7.5v3.5l-2 3M9 9.5l3 2"/><path d="m14 15 2 3-1 2"/>',
  },
  {
    slug: "unsafe-building",
    exact: "unsafe or damaged public building",
    keywords: ["public building", "damaged building", "unsafe building"],
    body: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 11h.01M16 11h.01"/><path d="m13 2-3 6 4 3-3 6"/>',
  },
  {
    slug: "illegal-construction",
    exact: "illegal or unsafe construction",
    keywords: ["construction"],
    body: '<path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15a8 8 0 0 1 16 0"/><line x1="8" y1="15" x2="10" y2="10"/><line x1="16" y1="15" x2="14" y2="10"/>',
  },
  {
    slug: "water-pipe-leak",
    exact: "water pipe leak or burst main",
    keywords: ["pipe leak", "burst main", "water pipe", "water leak"],
    body: '<path d="M2 11h6m8 0h6M2 15h6m8 0h6M2 9v8M22 9v8M8 8v8M16 8v8"/><path d="m10 11 2-2 2 2"/><path d="M12 6V2M9 4l3-2 3 2M12 16v4M10 19l2 2 2-2"/>',
  },
  {
    slug: "water-supply-failure",
    exact: "water supply failure",
    keywords: ["water supply", "supply failure", "no water"],
    body: '<path d="M5 10h14M12 6v4M7 6h10M8 10v3a4 4 0 0 0 8 0v-3"/><line x1="2" x2="22" y1="2" y2="22"/><circle cx="12" cy="18" r="1"/>',
  },
  {
    slug: "blocked-drain",
    exact: "blocked drain or clogged culvert",
    keywords: ["blocked drain", "clogged culvert", "culvert", "drain"],
    body: '<rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="4" x2="7" y2="20"/><line x1="10.5" y1="4" x2="10.5" y2="20"/><line x1="13.5" y1="4" x2="13.5" y2="20"/><line x1="17" y1="4" x2="17" y2="20"/><line x1="3" y1="12" x2="21" y2="12"/><path d="m8 8 4 4-2 3M13 7l3 5"/>',
  },
  {
    slug: "street-flooding",
    exact: "street flooding",
    keywords: ["flooding", "flood"],
    body: '<path d="M20 11A5 5 0 0 0 18 4h-1.26A8 8 0 1 0 4 10.5"/><path d="M2 16c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/><path d="M2 20c2-1 4-1 6 0s4 1 6 0 4-1 6 0"/><line x1="8" y1="12" x2="8" y2="13"/><line x1="12" y1="12" x2="12" y2="13"/><line x1="16" y1="12" x2="16" y2="13"/>',
  },
  {
    slug: "uncollected-garbage",
    exact: "uncollected garbage",
    keywords: ["uncollected garbage", "garbage", "rubbish collection"],
    body: '<path d="M4 8h16M18 8l-1 13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8"/><path d="M3 6l16-2M10 12v6M14 12v6"/><path d="M8 6c0-2 2-3 4-3s3 1 3 3"/>',
  },
  {
    slug: "illegal-dumping",
    exact: "illegal dumping",
    keywords: ["illegal dumping", "dumping", "fly tipping"],
    body: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/><path d="m6 18 12-12"/><circle cx="12" cy="12" r="9"/>',
  },
  {
    slug: "damaged-playground",
    exact: "damaged park or playground equipment",
    keywords: ["playground", "park equipment", "park or playground"],
    body: '<path d="M3 21 7 3h10l4 18"/><path d="M4.5 15h3M16.5 15h3"/><line x1="10" y1="3" x2="10" y2="13"/><line x1="14" y1="3" x2="14" y2="13"/><rect x="8.5" y="13" width="7" height="2" rx="0.5"/><path d="m13 13 2 3"/>',
  },
  {
    slug: "fallen-tree",
    exact: "fallen tree or overgrown vegetation",
    keywords: ["fallen tree", "overgrown", "vegetation", "tree"],
    body: '<path d="M2 21h20M4 21v-4l2-1M6 16l13-6"/><path d="M15 11c1.5-2 3.5-2.5 5-1s1.5 3.5 0 5-4.5.5-5-2z"/><path d="m11 14-2-3M14 13l-1-3"/><path d="m8 18 2 3"/>',
  },
  {
    slug: "street-light-outage",
    exact: "street light outage",
    keywords: ["street light", "streetlight", "light outage", "lamp"],
    body: '<path d="M6 21h6M9 21V5a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v2"/><path d="M15 7h6l-1 5h-4z"/><line x1="3" y1="3" x2="21" y2="21"/>',
  },
  {
    slug: "power-outage",
    exact: "power outage or exposed cable",
    keywords: ["power outage", "exposed cable", "power cut", "electrical fault"],
    body: '<path d="M2 12h7M15 12h7M4 8v8M20 8v8"/><path d="m11 6 3 4-4 2 4 4"/><circle cx="12" cy="12" r="1"/>',
  },
];

/** Coarse fallback bodies (map pins for a category whose name matches nothing above). */
const FALLBACK_BODIES = {
  zap: '<path d="M2 12h7M15 12h7M4 8v8M20 8v8"/><path d="m11 6 3 4-4 2 4 4"/>',
  construction:
    '<rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7M7 14v7M17 3v3M7 3v3M10 14 2.3 6.3M14 6l7.7 7.7M8 6l8 8"/>',
  droplets:
    '<path d="M2 11h6m8 0h6M2 15h6m8 0h6M2 9v8M22 9v8M8 8v8M16 8v8"/><path d="M12 6V2M9 4l3-2 3 2"/>',
  trash:
    '<path d="M4 8h16M18 8l-1 13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8"/><path d="M3 6l16-2M10 12v6M14 12v6"/>',
  trees:
    '<path d="M12 2 7 8h3l-4 6h4l-5 6h14l-5-6h4l-4-6h3L12 2zM12 20v2"/>',
  building:
    '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 11h.01M16 11h.01"/>',
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
