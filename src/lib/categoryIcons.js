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
    body: '<path d="m2 22 1-3h18l1 3"/><path d="M5 19 11 3h2l6 16"/><path d="M8 12h8"/>',
  },
  {
    slug: "damaged-footpath",
    exact: "damaged footpath or pedestrian bridge",
    keywords: ["footpath", "pedestrian bridge", "sidewalk", "walkway"],
    body: '<path d="M4 19h16"/><path d="M4 15c2-3 5-5 8-5s6 2 8 5"/><path d="M12 10v9"/><path d="M8 12v7"/><path d="M16 12v7"/>',
  },
  {
    slug: "unsafe-building",
    exact: "unsafe or damaged public building",
    keywords: ["public building", "damaged building", "unsafe building"],
    body: '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/><path d="M12 2l-2 5 3 2-2 4"/>',
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
    body: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  },
  {
    slug: "water-supply-failure",
    exact: "water supply failure",
    keywords: ["water supply", "supply failure", "no water"],
    body: '<path d="M10.72 5.05A8 8 0 0 1 12 2c.5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a6.98 6.98 0 0 1-1.07 3.7"/><path d="M12 22a7 7 0 0 1-7-7c0-2 1-3.9 3-5.5.5-.4 1-.8 1.5-1.2"/><line x1="2" x2="22" y1="2" y2="22"/>',
  },
  {
    slug: "blocked-drain",
    exact: "blocked drain or clogged culvert",
    keywords: ["blocked drain", "clogged culvert", "culvert", "drain"],
    body: '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/><line x1="2" x2="22" y1="2" y2="22"/>',
  },
  {
    slug: "street-flooding",
    exact: "street flooding",
    keywords: ["flooding", "flood"],
    body: '<path d="M4 14.89c.63 0 1.25.25 1.7.7.9.9 2.48.9 3.38 0 .9-.9 2.48-.9 3.38 0 .9.9 2.48.9 3.38 0 .45-.45 1.07-.7 1.7-.7"/><path d="M4 19.89c.63 0 1.25.25 1.7.7.9.9 2.48.9 3.38 0 .9-.9 2.48-.9 3.38 0 .9.9 2.48.9 3.38 0 .45-.45 1.07-.7 1.7-.7"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>',
  },
  {
    slug: "uncollected-garbage",
    exact: "uncollected garbage",
    keywords: ["uncollected garbage", "garbage", "rubbish collection"],
    body: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
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
    body: '<path d="M10 10v.01"/><path d="M14 10v.01"/><path d="M18 10v.01"/><path d="M2 20h20"/><path d="M5 20a7 7 0 0 1 14 0"/>',
  },
  {
    slug: "fallen-tree",
    exact: "fallen tree or overgrown vegetation",
    keywords: ["fallen tree", "overgrown", "vegetation", "tree"],
    body: '<path d="M12 13V2"/><path d="M12 6 7.5 12h9L12 6z"/><path d="M12 2 4.5 12h15L12 2z"/><path d="M17 22l-5-5"/><path d="M17 17l5 5"/>',
  },
  {
    slug: "street-light-outage",
    exact: "street light outage",
    keywords: ["street light", "streetlight", "light outage", "lamp"],
    body: '<path d="M9 21h6"/><path d="M12 17v4"/><path d="M12 3a6 6 0 0 0-6 6c0 2.22 1.2 4.15 3 5.19V15a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-.81c1.8-1.04 3-2.97 3-5.19a6 6 0 0 0-6-6z"/><line x1="2" x2="22" y1="2" y2="22"/>',
  },
  {
    slug: "power-outage",
    exact: "power outage or exposed cable",
    keywords: ["power outage", "exposed cable", "power cut", "electrical fault"],
    body: '<path d="M10.58 10.58 3 18"/><path d="M13.41 13.41 21 6"/><path d="M13 2 9 8h6l-4 6"/><line x1="2" x2="22" y1="2" y2="22"/>',
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
