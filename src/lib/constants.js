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

/** Report priority metadata, keyed by the backend's ReportPriority enum values. Only `URGENT` gets the red accent (ui-rules.md: "priority-urgent | Red accent for the urgent flag"). */
export const REPORT_PRIORITY = {
  LOW: { label: "Low", icon: ArrowDown, textClass: "text-slate-600 dark:text-slate-300", bgClass: "bg-slate-100 dark:bg-slate-500/10" },
  NORMAL: { label: "Normal", icon: Equal, textClass: "text-slate-600 dark:text-slate-300", bgClass: "bg-slate-100 dark:bg-slate-500/10" },
  HIGH: { label: "High", icon: ArrowUp, textClass: "text-amber-700 dark:text-amber-300", bgClass: "bg-amber-100 dark:bg-amber-500/10" },
  URGENT: { label: "Urgent", icon: TriangleAlert, textClass: "text-rose-700 dark:text-rose-300", bgClass: "bg-rose-100 dark:bg-rose-500/10" },
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
  { value: "zap", label: "Electricity", icon: Zap },
  { value: "construction", label: "Roads", icon: Construction },
  { value: "droplets", label: "Water", icon: Droplets },
  { value: "trash", label: "Sanitation", icon: Trash2 },
  { value: "trees", label: "Parks", icon: Trees },
  { value: "building", label: "Buildings", icon: Building2 },
  { value: "map-pin", label: "Other", icon: MapPin },
];

export const CATEGORY_ICON_MAP = Object.fromEntries(
  CATEGORY_ICON_OPTIONS.map((opt) => [opt.value, opt.icon])
);

/** Preset "what's wrong" chips per category icon, for the report submission form (ui-rules.md: "preset chips per category"). */
export const CATEGORY_PROBLEM_PRESETS = {
  zap: ["Streetlight out", "Power outage", "Exposed wiring"],
  construction: ["Pothole", "Blocked drain", "Damaged sidewalk"],
  droplets: ["Water leak", "No water supply", "Flooding"],
  trash: ["Overflowing bin", "Illegal dumping", "Missed collection"],
  trees: ["Damaged equipment", "Overgrown area", "Litter"],
  building: ["Structural damage", "Broken fixture", "Graffiti"],
  "map-pin": ["General issue"],
};

/** Point-transaction reasons, keyed by the backend's PointReason enum values (database-schema.md § point_transactions). */
export const POINT_REASON = {
  REPORT_APPROVED: { label: "Report approved" },
  REPORT_RESOLVED: { label: "Report resolved" },
  FEEDBACK_GIVEN: { label: "Feedback given" },
  REPORT_REJECTED: { label: "Report rejected" },
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
