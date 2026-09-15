import { jsPDF } from "jspdf";
import { REPORT_STATUS } from "./constants";
import { assetUrl } from "./assetUrl";

// No backend export endpoint exists for reports (api-standards.md documents
// none; build-plan.md's Phase 9 "Optional: CSV export" is a separate,
// server-side, summary-report feature). This is a fully client-side PDF
// built from data the detail page already has in memory.
//
// jsPDF's own text() draws vector glyphs from a font's cmap with no OpenType
// shaping (no reordering/ligatures) — that renders Latin fine but breaks
// Myanmar script, whose vowel signs and medials must be reordered/combined
// by a shaping engine to display correctly. Instead of embedding a Myanmar
// font directly into the PDF, every text block is rasterized on an offscreen
// <canvas> (using the same "Noto Sans Myanmar" webfont the app already loads
// in globals.css) and embedded as an image — the browser's own text layout
// engine does the shaping, so English and Myanmar both render correctly.

const PAGE_MARGIN = 14;
const PAGE_WIDTH = 210; // A4, mm
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;

// CSS px per mm at 96dpi — the "virtual" pixel space text is laid out in
// before being rasterized at RASTER_SCALE for crispness.
const PX_PER_MM = 96 / 25.4;
const RASTER_SCALE = 3;
const FONT_FAMILY = '"Noto Sans Myanmar", "Inter", sans-serif';

const measureCanvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
const measureCtx = measureCanvas?.getContext("2d") ?? null;

function ptToPx(pt) {
  return pt * (96 / 72);
}

let fontsReadyPromise = null;
/** Best-effort: wait for the Myanmar webfont so the first raster isn't tofu boxes. */
function ensureFontsReady() {
  if (typeof document === "undefined" || !document.fonts) return Promise.resolve();
  if (!fontsReadyPromise) {
    fontsReadyPromise = Promise.all([
      document.fonts.load(`400 16px ${FONT_FAMILY}`),
      document.fonts.load(`700 16px ${FONT_FAMILY}`),
    ])
      .catch(() => {})
      .then(() => document.fonts.ready)
      .catch(() => {});
  }
  return fontsReadyPromise;
}

/** Greedy word-wrap using real glyph metrics; falls back to a character split for a single word wider than the line. */
function wrapText(text, maxWidthPx, font) {
  measureCtx.font = font;
  const lines = [];
  for (const para of String(text).split("\n")) {
    if (para === "") {
      lines.push("");
      continue;
    }
    let current = "";
    for (const word of para.split(" ")) {
      const candidate = current ? `${current} ${word}` : word;
      if (measureCtx.measureText(candidate).width <= maxWidthPx) {
        current = candidate;
        continue;
      }
      if (!current) {
        // A single word/run wider than the line (common for Myanmar, which
        // rarely uses spaces) — break it char by char instead of overflowing.
        let chunk = "";
        for (const ch of word) {
          const testChunk = chunk + ch;
          if (chunk && measureCtx.measureText(testChunk).width > maxWidthPx) {
            lines.push(chunk);
            chunk = ch;
          } else {
            chunk = testChunk;
          }
        }
        current = chunk;
        continue;
      }
      lines.push(current);
      current = word;
    }
    lines.push(current);
  }
  return lines;
}

/** Rasterizes pre-wrapped lines to a data URL sized to exactly fit them. */
function rasterizeLines(lines, { font, colorRGB, lineHeightMM }) {
  const widthPx = Math.round(CONTENT_WIDTH * PX_PER_MM * RASTER_SCALE);
  const lineHeightVirtualPx = lineHeightMM * PX_PER_MM;
  const heightPx = Math.max(1, Math.round(lineHeightVirtualPx * lines.length * RASTER_SCALE));

  const canvas = document.createElement("canvas");
  canvas.width = widthPx;
  canvas.height = heightPx;
  const ctx = canvas.getContext("2d");
  ctx.scale(RASTER_SCALE, RASTER_SCALE);
  ctx.font = font;
  ctx.fillStyle = `rgb(${colorRGB.join(",")})`;
  ctx.textBaseline = "alphabetic";

  lines.forEach((line, index) => {
    if (!line) return;
    ctx.fillText(line, 0, (index + 1) * lineHeightVirtualPx - lineHeightVirtualPx * 0.28);
  });

  return canvas.toDataURL("image/png");
}

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
  await ensureFontsReady();

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = PAGE_MARGIN;

  function ensureSpace(next) {
    if (y + next > PAGE_HEIGHT - PAGE_MARGIN) {
      doc.addPage();
      y = PAGE_MARGIN;
    }
  }

  /** Draws one rasterized text block (wrapped to CONTENT_WIDTH) and advances y. */
  function drawText(text, { weight = "400", sizePt = 10, colorRGB = [0, 0, 0], lineHeightMM = 5, gap = 0 } = {}) {
    const font = `${weight} ${ptToPx(sizePt)}px ${FONT_FAMILY}`;
    const lines = wrapText(text, CONTENT_WIDTH * PX_PER_MM, font);
    const blockHeight = lines.length * lineHeightMM;
    ensureSpace(blockHeight + gap);
    const dataUrl = rasterizeLines(lines, { font, colorRGB, lineHeightMM });
    doc.addImage(dataUrl, "PNG", PAGE_MARGIN, y, CONTENT_WIDTH, blockHeight);
    y += blockHeight + gap;
  }

  function heading(text) {
    ensureSpace(9);
    drawText(text, { weight: "700", sizePt: 12, lineHeightMM: 6, gap: 2 });
  }

  function paragraph(text, gap = 4) {
    drawText(text, { weight: "400", sizePt: 10, lineHeightMM: 5, gap });
  }

  async function photoSection(title, photos) {
    if (!photos.length) return;
    heading(title);
    for (const photo of photos) {
      try {
        const dataUrl = await urlToDataUrl(assetUrl(photo.imageUrl));
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

  // Title block — the category, same lead information as the detail page
  // (the derived `title` is just a truncated copy of the description below).
  drawText(report.categoryName ?? "Report", { weight: "700", sizePt: 16, lineHeightMM: 7, gap: 1 });
  drawText(report.reportCode ?? "", { weight: "400", sizePt: 10, colorRGB: [100, 100, 100], lineHeightMM: 5, gap: 8 });

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
