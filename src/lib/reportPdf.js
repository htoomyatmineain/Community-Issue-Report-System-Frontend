import { jsPDF } from "jspdf";
import { REPORT_STATUS } from "./constants";

// No backend export endpoint exists for reports (api-standards.md documents
// none; build-plan.md's Phase 9 "Optional: CSV export" is a separate,
// server-side, summary-report feature). This is a fully client-side PDF
// built from data the detail page already has in memory.

const PAGE_MARGIN = 14;
const PAGE_WIDTH = 210; // A4, mm
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;

const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

/** Fetches an image and inlines it as a data URL. Best-effort — a storage host without permissive CORS just fails here, caught by the caller. */
async function urlToDataUrl(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * Builds and downloads a one-report PDF summary: details, description,
 * photos (embedded when the storage host allows a cross-origin fetch,
 * otherwise listed as a link so the export never fails outright), status
 * timeline, optional internal comments (console only), and citizen feedback.
 *
 * @param {object} report - the ReportDTO-shaped object the detail page already holds.
 * @param {object} [options]
 * @param {{label: string, at: string}[]} [options.steps] - status timeline, already labelled (see TimelineTab.stepLabel).
 * @param {{authorName?: string, body: string, createdAt: string, mentionedDepartmentName?: string}[]} [options.comments] - internal notes, console-only.
 */
export async function exportReportPdf(report, { steps = [], comments = [] } = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = PAGE_MARGIN;

  function ensureSpace(next) {
    if (y + next > PAGE_HEIGHT - PAGE_MARGIN) {
      doc.addPage();
      y = PAGE_MARGIN;
    }
  }

  function heading(text) {
    ensureSpace(10);
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.text(text, PAGE_MARGIN, y);
    y += 6;
    doc.setFont("helvetica", "normal").setFontSize(10);
  }

  function paragraph(text, gap = 4) {
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
    ensureSpace(lines.length * 5 + gap);
    doc.text(lines, PAGE_MARGIN, y);
    y += lines.length * 5 + gap;
  }

  async function photoSection(title, photos) {
    if (!photos.length) return;
    heading(title);
    for (const photo of photos) {
      try {
        const dataUrl = await urlToDataUrl(photo.imageUrl);
        const { width, height, fileType } = doc.getImageProperties(dataUrl);
        const w = Math.min(CONTENT_WIDTH, 80);
        const h = (height / width) * w;
        ensureSpace(h + 4);
        doc.addImage(dataUrl, fileType, PAGE_MARGIN, y, w, h);
        y += h + 4;
      } catch {
        paragraph(`Photo unavailable to embed — ${photo.imageUrl}`, 2);
      }
    }
  }

  // Title block
  doc.setFont("helvetica", "bold").setFontSize(16);
  doc.text(report.title ?? "Report", PAGE_MARGIN, y);
  y += 7;
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(100);
  doc.text(report.reportCode ?? "", PAGE_MARGIN, y);
  doc.setTextColor(0);
  y += 8;

  heading("Details");
  paragraph(`Status: ${REPORT_STATUS[report.status]?.label ?? report.status ?? "—"}`, 1);
  if (report.priority) paragraph(`Priority: ${report.priority}`, 1);
  paragraph(`Category: ${report.categoryName ?? "—"}`, 1);
  paragraph(`Department: ${report.departmentName ?? "Not yet routed"}`, 1);
  if (report.assignedStaffName) paragraph(`Assigned staff: ${report.assignedStaffName}`, 1);
  if (report.reporterName) paragraph(`Reporter: ${report.reporterName}`, 1);
  paragraph(`Submitted: ${formatDateTime(report.createdAt)}`, 1);
  if (report.latitude != null && report.longitude != null) {
    paragraph(`Location: ${report.addressText ?? `${report.latitude.toFixed(5)}, ${report.longitude.toFixed(5)}`}`, 1);
  }
  y += 2;

  heading("Description");
  paragraph(report.description || "—");

  if (report.status === "REJECTED" && report.rejectionReason) {
    heading("Rejection reason");
    paragraph(report.rejectionReason);
  }

  const reportPhotos = report.images?.filter((img) => img.imageType === "REPORT_PHOTO") ?? [];
  const resolutionPhotos = report.images?.filter((img) => img.imageType === "RESOLUTION_PHOTO") ?? [];
  await photoSection("Photos", reportPhotos);
  await photoSection("Completion photos", resolutionPhotos);

  if (steps.length) {
    heading("Status timeline");
    steps.forEach((step) => paragraph(`${formatDateTime(step.at)} — ${step.label}`, 2));
  }

  if (comments.length) {
    heading("Internal comments");
    comments.forEach((c) => {
      const who = c.mentionedDepartmentName ? `${c.authorName ?? "Staff"} → @${c.mentionedDepartmentName}` : c.authorName ?? "Staff";
      paragraph(`${formatDateTime(c.createdAt)} — ${who}: ${c.body}`, 3);
    });
  }

  if (report.feedback) {
    heading("Citizen feedback");
    paragraph(`Rating: ${report.feedback.rating}/5`, 1);
    if (report.feedback.comment) paragraph(report.feedback.comment);
  }

  doc.save(`${report.reportCode ?? "report"}.pdf`);
}
