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
 * Colors match the Pencil design's status color tokens, which are
 * themselves standard Tailwind 100/700 pairs.
 */
export const REPORT_STATUS = {
  PENDING_APPROVAL: {
    label: "Pending approval",
    icon: Timer,
    textClass: "text-amber-700",
    bgClass: "bg-amber-100",
    dotClass: "bg-amber-700",
  },
  ASSIGNED: {
    label: "Assigned",
    icon: Send,
    textClass: "text-blue-700",
    bgClass: "bg-blue-100",
    dotClass: "bg-blue-700",
  },
  IN_PROGRESS: {
    label: "In progress",
    icon: LoaderCircle,
    textClass: "text-indigo-700",
    bgClass: "bg-indigo-100",
    dotClass: "bg-indigo-700",
  },
  RESOLVED: {
    label: "Resolved",
    icon: CircleCheckBig,
    textClass: "text-green-700",
    bgClass: "bg-green-100",
    dotClass: "bg-green-700",
  },
  CLOSED: {
    label: "Closed",
    icon: Lock,
    textClass: "text-slate-600",
    bgClass: "bg-slate-100",
    dotClass: "bg-slate-600",
  },
  REJECTED: {
    label: "Rejected",
    icon: CircleX,
    textClass: "text-red-700",
    bgClass: "bg-red-100",
    dotClass: "bg-red-700",
  },
};

/** Account status metadata, keyed by the backend's AccountStatus enum values. Same visual language as REPORT_STATUS. */
export const ACCOUNT_STATUS = {
  PENDING: {
    label: "Pending",
    icon: Timer,
    textClass: "text-amber-700",
    bgClass: "bg-amber-100",
  },
  APPROVED: {
    label: "Approved",
    icon: CircleCheckBig,
    textClass: "text-green-700",
    bgClass: "bg-green-100",
  },
  REJECTED: {
    label: "Rejected",
    icon: CircleX,
    textClass: "text-red-700",
    bgClass: "bg-red-100",
  },
  SUSPENDED: {
    label: "Suspended",
    icon: Lock,
    textClass: "text-slate-600",
    bgClass: "bg-slate-100",
  },
};

/** Report priority metadata, keyed by the backend's ReportPriority enum values. Only `URGENT` gets the red accent (ui-rules.md: "priority-urgent | Red accent for the urgent flag"). */
export const REPORT_PRIORITY = {
  LOW: { label: "Low", icon: ArrowDown, textClass: "text-slate-600", bgClass: "bg-slate-100" },
  NORMAL: { label: "Normal", icon: Equal, textClass: "text-slate-600", bgClass: "bg-slate-100" },
  HIGH: { label: "High", icon: ArrowUp, textClass: "text-amber-700", bgClass: "bg-amber-100" },
  URGENT: { label: "Urgent", icon: TriangleAlert, textClass: "text-red-700", bgClass: "bg-red-100" },
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
