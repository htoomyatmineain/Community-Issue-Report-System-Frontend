import { CircleCheckBig, CircleX, LoaderCircle, Lock, Send, Timer } from "lucide-react";

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

/** Issue categories, matching the Pencil map/report screens (`/api/categories` later). */
export const ISSUE_CATEGORIES = [
  { id: "electricity", label: "Electricity" },
  { id: "roads", label: "Roads" },
  { id: "water", label: "Water" },
  { id: "sanitation", label: "Sanitation" },
  { id: "parks", label: "Parks" },
  { id: "buildings", label: "Buildings" },
];
