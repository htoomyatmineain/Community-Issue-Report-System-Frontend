/**
 * Temporary mock data for the citizen-report feature (submit, history, detail,
 * feedback). None of POST /api/reports, GET /api/reports/my, GET
 * /api/reports/{id}, GET /api/reports/{id}/history or POST /api/feedback are
 * built on the backend yet. This file is the single, isolated stand-in for
 * all of them; delete it and switch citizenReportApi back to real requests
 * once those endpoints ship. State lives in memory for the session only.
 */
let nextId = 200;

const MOCK_REPORTS = [
  {
    id: 142,
    title: "Pothole on Thiri Street",
    category: "roads",
    reportCode: "RPT-2026-000142",
    status: "ASSIGNED",
    department: "Roads Department",
    createdAt: "2026-08-10T09:12:00Z",
    description:
      "Large pothole blocking one lane near the Thiri Street junction. Getting worse after the recent rain — please fix before it damages more vehicles.",
    photoCount: 2,
    resolutionPhoto: false,
    feedback: null,
    history: [
      { label: "Report submitted", at: "2026-08-10T09:12:00Z" },
      { label: "Approved by admin", at: "2026-08-10T15:40:00Z" },
      { label: "Assigned to Roads Dept.", at: "2026-08-12T10:15:00Z" },
    ],
  },
  {
    id: 139,
    title: "Broken streetlight",
    category: "electricity",
    reportCode: "RPT-2026-000139",
    status: "IN_PROGRESS",
    department: "Electricity Department",
    createdAt: "2026-08-09T14:00:00Z",
    description: "Streetlight has been out for a week, the corner is very dark at night.",
    photoCount: 1,
    resolutionPhoto: false,
    feedback: null,
    history: [
      { label: "Report submitted", at: "2026-08-09T14:00:00Z" },
      { label: "Approved by admin", at: "2026-08-09T18:20:00Z" },
      { label: "Assigned to Electricity Dept.", at: "2026-08-10T09:00:00Z" },
      { label: "In progress", at: "2026-08-13T11:05:00Z" },
    ],
  },
  {
    id: 131,
    title: "Overflowing bin",
    category: "sanitation",
    reportCode: "RPT-2026-000131",
    status: "RESOLVED",
    department: "Sanitation Department",
    createdAt: "2026-08-01T08:00:00Z",
    description: "Public bin has been overflowing for days, attracting pests.",
    photoCount: 1,
    resolutionPhoto: true,
    feedback: { rating: 5, comment: "Fixed quickly, thank you!" },
    history: [
      { label: "Report submitted", at: "2026-08-01T08:00:00Z" },
      { label: "Approved by admin", at: "2026-08-01T12:00:00Z" },
      { label: "Assigned to Sanitation Dept.", at: "2026-08-02T09:00:00Z" },
      { label: "In progress", at: "2026-08-03T10:00:00Z" },
      { label: "Resolved", at: "2026-08-14T11:00:00Z" },
    ],
  },
  {
    id: 125,
    title: "Water leak near market",
    category: "water",
    reportCode: "RPT-2026-000125",
    status: "RESOLVED",
    department: "Water Department",
    createdAt: "2026-07-28T07:30:00Z",
    description: "Steady water leak from a pipe joint near the Bogyoke Market entrance.",
    photoCount: 2,
    resolutionPhoto: true,
    feedback: null,
    history: [
      { label: "Report submitted", at: "2026-07-28T07:30:00Z" },
      { label: "Approved by admin", at: "2026-07-28T10:00:00Z" },
      { label: "Assigned to Water Dept.", at: "2026-07-29T09:00:00Z" },
      { label: "In progress", at: "2026-07-30T09:00:00Z" },
      { label: "Resolved", at: "2026-08-02T16:20:00Z" },
    ],
  },
  {
    id: 118,
    title: "Illegal dumping behind school",
    category: "sanitation",
    reportCode: "RPT-2026-000118",
    status: "REJECTED",
    department: null,
    createdAt: "2026-07-20T06:45:00Z",
    description: "Construction debris dumped behind Basic Education School 2.",
    photoCount: 1,
    resolutionPhoto: false,
    feedback: null,
    rejectionReason: "Duplicate of an existing report already assigned to Sanitation.",
    history: [
      { label: "Report submitted", at: "2026-07-20T06:45:00Z" },
      { label: "Rejected", at: "2026-07-20T17:10:00Z" },
    ],
  },
];

function clone(value) {
  return structuredClone(value);
}

export function getMockReportList() {
  const sorted = [...MOCK_REPORTS].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return Promise.resolve(clone(sorted));
}

export function getMockReportById(id) {
  const report = MOCK_REPORTS.find((r) => String(r.id) === String(id));
  return report ? Promise.resolve(clone(report)) : Promise.reject(new Error("Report not found"));
}

export function submitMockReport({ category, description, latitude, longitude }) {
  const id = nextId++;
  const now = new Date().toISOString();
  const created = {
    id,
    title: description.slice(0, 60) || "New report",
    category,
    reportCode: `RPT-2026-${String(id).padStart(6, "0")}`,
    status: "PENDING_APPROVAL",
    department: null,
    createdAt: now,
    description,
    latitude,
    longitude,
    photoCount: 0,
    resolutionPhoto: false,
    feedback: null,
    history: [{ label: "Report submitted", at: now }],
  };
  MOCK_REPORTS.unshift(created);
  return Promise.resolve(clone(created));
}

export function submitMockFeedback(id, { rating, comment }) {
  const report = MOCK_REPORTS.find((r) => String(r.id) === String(id));
  if (!report) return Promise.reject(new Error("Report not found"));
  report.feedback = { rating, comment };
  return Promise.resolve(clone(report));
}
