import {
  ArrowDown,
  ArrowUp,
  CircleCheckBig,
  CircleX,
  Equal,
  LoaderCircle,
  Lock,
  Send,
  Timer,
  TriangleAlert,
  Zap,
  Construction,
  Droplets,
  Trash2,
  Trees,
  Building2,
  MapPin,
  Cone,
  Footprints,
  Waves,
  HardHat,
  Lightbulb,
} from "lucide-react";

/**
 * Report status metadata, keyed by the backend's ReportStatus enum values.
 * Light theme: Tailwind 100/700 pill pairs. Dark theme (THEME_SPEC §2): a
 * bright foreground on a low-alpha wash of the same hue.
 */
export const REPORT_STATUS = {
  PENDING_APPROVAL: {
    label: "Pending approval",
    icon: Timer,
    textClass: "text-amber-700 dark:text-amber-300",
    bgClass: "bg-amber-100 dark:bg-amber-500/10",
    dotClass: "bg-amber-500",
  },
  ASSIGNED: {
    label: "Assigned",
    icon: Send,
    textClass: "text-blue-700 dark:text-blue-300",
    bgClass: "bg-blue-100 dark:bg-blue-500/10",
    dotClass: "bg-blue-500",
  },
  IN_PROGRESS: {
    label: "In progress",
    icon: LoaderCircle,
    textClass: "text-indigo-700 dark:text-indigo-300",
    bgClass: "bg-indigo-100 dark:bg-indigo-500/10",
    dotClass: "bg-indigo-500",
  },
  RESOLVED: {
    label: "Resolved",
    icon: CircleCheckBig,
    textClass: "text-emerald-700 dark:text-emerald-300",
    bgClass: "bg-emerald-100 dark:bg-emerald-500/10",
    dotClass: "bg-emerald-500",
  },
  CLOSED: {
    label: "Closed",
    icon: Lock,
    textClass: "text-slate-600 dark:text-slate-300",
    bgClass: "bg-slate-100 dark:bg-slate-500/10",
    dotClass: "bg-slate-500",
  },
  REJECTED: {
    label: "Rejected",
    icon: CircleX,
    textClass: "text-rose-700 dark:text-rose-300",
    bgClass: "bg-rose-100 dark:bg-rose-500/10",
    dotClass: "bg-rose-500",
  },
};

/** Account status metadata, keyed by the backend's AccountStatus enum values. Same visual language as REPORT_STATUS. */
export const ACCOUNT_STATUS = {
  PENDING: {
    label: "Pending",
    icon: Timer,
    textClass: "text-amber-700 dark:text-amber-300",
    bgClass: "bg-amber-100 dark:bg-amber-500/10",
  },
  APPROVED: {
    label: "Approved",
    icon: CircleCheckBig,
    textClass: "text-emerald-700 dark:text-emerald-300",
    bgClass: "bg-emerald-100 dark:bg-emerald-500/10",
  },
  REJECTED: {
    label: "Rejected",
    icon: CircleX,
    textClass: "text-rose-700 dark:text-rose-300",
    bgClass: "bg-rose-100 dark:bg-rose-500/10",
  },
  SUSPENDED: {
    label: "Suspended",
    icon: Lock,
    textClass: "text-slate-600 dark:text-slate-300",
    bgClass: "bg-slate-100 dark:bg-slate-500/10",
  },
};

/** Report priority metadata, keyed by the backend's ReportPriority enum values. */
export const REPORT_PRIORITY = {
  LOW: { label: "Low", icon: ArrowDown, textClass: "text-blue-600 dark:text-blue-400", bgClass: "bg-blue-100 dark:bg-blue-500/10" },
  NORMAL: { label: "Normal", icon: Equal, textClass: "text-emerald-600 dark:text-emerald-400", bgClass: "bg-emerald-100 dark:bg-emerald-500/10" },
  HIGH: { label: "High", icon: ArrowUp, textClass: "text-amber-600 dark:text-amber-400", bgClass: "bg-amber-100 dark:bg-amber-500/10" },
  URGENT: { label: "Urgent", icon: TriangleAlert, textClass: "text-rose-600 dark:text-rose-400", bgClass: "bg-rose-100 dark:bg-rose-500/10" },
};

/** Issue categories, matching the Pencil map/report screens (`/api/categories` later). */
export const ISSUE_CATEGORIES = [
  { id: "electricity", label: "Electricity" },
  { id: "roads", label: "Roads" },
  { id: "water", label: "Water" },
  { id: "sanitation", label: "Sanitation" },
  { id: "parks", label: "Parks" },
  { id: "buildings", label: "Buildings" },
];

/** Icon choices for the category create/edit form — `value` is the `icon` key stored on the category and used for map pins/filter chips. */
export const CATEGORY_ICON_OPTIONS = [
  { value: "cone", label: "Roads & Potholes", icon: Cone },
  { value: "footprints", label: "Footpaths & Bridges", icon: Footprints },
  { value: "droplets", label: "Water & Pipe Leaks", icon: Droplets },
  { value: "waves", label: "Drainage & Flooding", icon: Waves },
  { value: "trash", label: "Sanitation & Waste", icon: Trash2 },
  { value: "trees", label: "Parks & Greenery", icon: Trees },
  { value: "building", label: "Buildings & Facilities", icon: Building2 },
  { value: "hard-hat", label: "Construction Safety", icon: HardHat },
  { value: "lightbulb", label: "Street Lighting", icon: Lightbulb },
  { value: "zap", label: "Power & Electricity", icon: Zap },
  { value: "construction", label: "Road Infrastructure", icon: Construction },
  { value: "map-pin", label: "Other", icon: MapPin },
];

export const CATEGORY_ICON_MAP = {
  ...Object.fromEntries(CATEGORY_ICON_OPTIONS.map((opt) => [opt.value, opt.icon])),
  road: Cone,
  pothole: Cone,
  droplet: Droplets,
  "droplet-off": Droplets,
  "cloud-rain": Waves,
  "trash-2": Trash2,
  tree: Trees,
  "tree-deciduous": Trees,
  bolt: Zap,
};

/**
 * A backend `category.icon` value doesn't always match a CATEGORY_ICON_OPTIONS
 * key — older seed rows, free-text entries, or a different naming scheme. Map
 * the common alternates onto a known icon key so every category still shows a
 * meaningful glyph (categories table, map pins, filter chips) instead of
 * silently falling back to the generic pin.
 */
const CATEGORY_ICON_ALIASES = {
  electricity: "zap",
  electric: "zap",
  power: "zap",
  bolt: "zap",
  light: "lightbulb",
  lighting: "lightbulb",
  streetlight: "lightbulb",
  road: "cone",
  roads: "cone",
  pothole: "cone",
  asphalt: "cone",
  footpath: "footprints",
  pavement: "footprints",
  sidewalk: "footprints",
  bridge: "footprints",
  walkway: "footprints",
  water: "droplets",
  droplet: "droplets",
  "droplet-off": "droplets",
  leak: "droplets",
  pipe: "droplets",
  drain: "waves",
  drainage: "waves",
  culvert: "waves",
  flood: "waves",
  flooding: "waves",
  "cloud-rain": "waves",
  sewage: "waves",
  sanitation: "trash",
  garbage: "trash",
  waste: "trash",
  rubbish: "trash",
  "trash-2": "trash",
  trash2: "trash",
  dumping: "trash",
  park: "trees",
  parks: "trees",
  tree: "trees",
  "tree-deciduous": "trees",
  greenery: "trees",
  playground: "trees",
  vegetation: "trees",
  buildings: "building",
  "building-2": "building",
  building2: "building",
  structure: "building",
  construction: "hard-hat",
  "hard-hat": "hard-hat",
  hardhat: "hard-hat",
  other: "map-pin",
  general: "map-pin",
  misc: "map-pin",
  pin: "map-pin",
  location: "map-pin",
};

/**
 * Normalise any `category.icon` string to a key that exists in CATEGORY_ICON_MAP.
 * This is the *fallback* path — `categoryIcon()` in lib/categoryIcons.js tries a
 * per-category-name glyph first and only lands here for unrecognised categories.
 */
export function resolveCategoryIconKey(raw) {
  if (!raw) return "map-pin";
  const key = String(raw).trim().toLowerCase();
  if (CATEGORY_ICON_MAP[key]) return key;
  return CATEGORY_ICON_ALIASES[key] ?? "map-pin";
}

/** Preset "what's wrong" chips per category icon, for the report submission form (ui-rules.md: "preset chips per category"). */
export const CATEGORY_PROBLEM_PRESETS = {
  cone: ["Pothole on road surface", "Damaged asphalt", "Sunken manhole cover"],
  road: ["Pothole on road surface", "Damaged asphalt", "Sunken manhole cover"],
  footprints: ["Broken pedestrian paving", "Damaged sidewalk", "Cracked bridge walkway"],
  building: ["Structural crack in public building", "Hazardous loose plaster", "Damaged entrance ramp"],
  "hard-hat": ["Unpermitted construction", "Unsafe scaffolding", "Construction debris on street"],
  droplets: ["Burst water main", "Water pipe leak", "Low tap pressure"],
  waves: ["Blocked storm drain", "Street flooded after rain", "Clogged drainage culvert"],
  trash: ["Overflowing waste dumpster", "Uncollected garbage pile", "Illegal street dumping"],
  trees: ["Fallen tree branch on road", "Damaged playground equipment", "Overgrown bushes blocking path"],
  lightbulb: ["Street light fixture outage", "Broken lamp post", "Flickering street lamp"],
  zap: ["Fallen power line", "Power outage in neighborhood", "Exposed electrical wiring"],
  construction: ["Road repair needed", "Missing barrier", "Open road trench"],
  "map-pin": ["General municipal issue"],
};

/** Point-transaction reasons, keyed by the backend's PointReason enum values (database-schema.md § point_transactions). */
export const POINT_REASON = {
  REPORT_APPROVED: { label: "Report approved" },
  REPORT_RESOLVED: { label: "Report resolved" },
  FEEDBACK_GIVEN: { label: "Feedback given" },
  REPORT_REJECTED: { label: "Report rejected" },
  CONFIRMATION_GIVEN: { label: "Confirmed a duplicate report" },
  SUPPORT_GIVEN: { label: "Supported a report" },
  SUPPORT_WITHDRAWN: { label: "Support withdrawn" },
};

/** Preset swatches for the category colour picker (map pin colour). */
export const CATEGORY_COLOR_OPTIONS = [
  "#F97316",
  "#2563EB",
  "#0EA5E9",
  "#16A34A",
  "#7C3AED",
  "#DC2626",
  "#CA8A04",
  "#475569",
];
