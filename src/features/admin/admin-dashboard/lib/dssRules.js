import { SLA_TARGETS_HOURS } from "./dashboardAnalytics";
import { formatDuration } from "@/lib/utils";

/**
 * Municipal Decision Support System (DSS) Rules Engine
 *
 * Deterministic, explainable recommendation algorithms for municipal administrators.
 * Every recommendation answers:
 * 1. What requires attention right now? (title, severity)
 * 2. Why does it require attention? (reason)
 * 3. What action should the responsible person consider? (suggestedAction, actionLink)
 * 4. What evidence supports the recommendation? (evidence, metrics)
 * 5. What data limitations exist? (limitation)
 */

/**
 * Evaluates SLA breaches and near-breach risks across active reports.
 * @param {Array} reports - Evaluated reports list
 * @param {object} slaSummary - SLA analytics from analyzeSlaPerformance
 * @returns {Array<object>}
 */
export function generateSlaBreachRecommendations(reports = [], slaSummary = {}) {
  const recommendations = [];
  const breachedReports = slaSummary?.breachedReports || [];
  const breachedCount = slaSummary?.breachedCount || 0;
  const atRiskCount = slaSummary?.atRiskCount || 0;

  if (breachedCount > 0) {
    const criticalBreaches = breachedReports.filter((r) => r.sla?.status === "BREACHED");
    const sampleCodes = criticalBreaches.slice(0, 3).map((r) => r.reportCode).join(", ");
    const maxOverdue = Math.max(...criticalBreaches.map((r) => r.sla?.overdueHours || 0), 0);

    recommendations.push({
      id: "rec-sla-breach-critical",
      title: `${breachedCount} Overdue Report${breachedCount > 1 ? "s" : ""} Exceeded Municipal SLA Target`,
      severity: "CRITICAL",
      category: "SLA_BREACH",
      reason: `Civic reports have exceeded their official resolution deadlines (${SLA_TARGETS_HOURS.URGENT}h for Urgent, ${SLA_TARGETS_HOURS.HIGH}h for High, ${SLA_TARGETS_HOURS.NORMAL}h for Normal). Prolonged resolution delays erode public trust and risk citizen escalation.`,
      evidence: [
        `${breachedCount} ticket${breachedCount > 1 ? "s" : ""} currently past SLA threshold`,
        `Highest delay: +${formatDuration(maxOverdue)} past deadline`,
        criticalBreaches.length > 0 ? `Sample ticket codes: ${sampleCodes}` : null,
        atRiskCount > 0 ? `${atRiskCount} additional tickets at risk of breaching within 6 hours` : null,
      ].filter(Boolean),
      suggestedAction: "Triage overdue cases with responsible department dispatchers and reallocate field staff if necessary.",
      actionLabel: "Triage Overdue Reports",
      actionLink: "/admin/reports?status=IN_PROGRESS",
      limitation: "Calculated deterministically from report creation timestamps and municipal priority SLA policies.",
      isSimulated: false,
    });
  } else if (atRiskCount > 0) {
    const atRiskReports = breachedReports.filter((r) => r.sla?.status === "AT_RISK");
    const sampleCodes = atRiskReports.slice(0, 3).map((r) => r.reportCode).join(", ");

    recommendations.push({
      id: "rec-sla-at-risk-warning",
      title: `${atRiskCount} Report${atRiskCount > 1 ? "s" : ""} Approaching SLA Resolution Deadline`,
      severity: "WARNING",
      category: "SLA_RISK",
      reason: "Active incidents have consumed over 75% of their allotted municipal resolution window without reaching completion.",
      evidence: [
        `${atRiskCount} ticket${atRiskCount > 1 ? "s" : ""} in active progress approaching SLA deadline`,
        atRiskReports.length > 0 ? `Incidents to monitor: ${sampleCodes}` : null,
      ].filter(Boolean),
      suggestedAction: "Alert handling departments to verify work crew progress before deadlines expire.",
      actionLabel: "Review At-Risk Reports",
      actionLink: "/admin/reports?status=IN_PROGRESS",
      limitation: "Based on official SLA resolution windows (24h Urgent, 48h High, 72h Normal).",
      isSimulated: false,
    });
  }

  return recommendations;
}

/**
 * Evaluates department load imbalance and potential operational bottlenecks.
 * @param {Array} departments - Analyzed departments list
 * @returns {Array<object>}
 */
export function generateWorkloadRecommendations(departments = []) {
  const recommendations = [];
  if (!departments || departments.length === 0) return recommendations;

  const totalOpen = departments.reduce((acc, d) => acc + (d.openCount || 0), 0);
  if (totalOpen === 0) return recommendations;

  // Identify departments carrying disproportionate share of open tickets (>= 35% and at least 3 tickets)
  const overloadedDepts = departments.filter((d) => (d.shareOfOpenLoad >= 35 && d.openCount >= 3));

  overloadedDepts.forEach((dept) => {
    const isCritical = dept.shareOfOpenLoad >= 50;

    recommendations.push({
      id: `rec-workload-${dept.id}`,
      title: `${dept.name} Holds ${dept.shareOfOpenLoad}% of All City-Wide Active Tickets`,
      severity: isCritical ? "CRITICAL" : "WARNING",
      category: "WORKLOAD_BALANCE",
      reason: `Municipal report volume is heavily concentrated in ${dept.name}, which may indicate seasonal infrastructure stress or intake bottlenecks.`,
      evidence: [
        `${dept.openCount} active unresolved tickets out of ${totalOpen} city-wide (${dept.shareOfOpenLoad}% of total active load)`,
        `${dept.resolvedCount} completed tickets to date (Resolution Rate: ${dept.resolutionRate}%)`,
        dept.averageResolutionHours != null
          ? `Department Average Resolution Time: ${dept.averageResolutionHours}h`
          : "Historical resolution time benchmark not yet available",
      ],
      suggestedAction: `Review active assignments in ${dept.name} and assess whether inter-departmental workload redistribution or external support is required.`,
      actionLabel: `Inspect ${dept.name} Queue`,
      actionLink: `/admin/reports?departmentId=${dept.id}`,
      limitation: "Staffing roster and crew capacity data are not currently configured. This recommendation reflects ticket volume concentration rather than verified crew understaffing.",
      isSimulated: false,
    });
  });

  return recommendations;
}

/**
 * Evaluates intake bottlenecks in administrative verification and citizen registration queues.
 * @param {object} summary - GET /api/dashboard/admin summary data
 * @returns {Array<object>}
 */
export function generateTriageQueueRecommendations(summary = {}) {
  const recommendations = [];
  const pendingReports = summary?.pendingReportCount || 0;
  const pendingAccounts = summary?.pendingAccountCount || 0;
  const totalPending = pendingReports + pendingAccounts;

  if (pendingReports >= 4 || totalPending >= 6) {
    const isCritical = pendingReports >= 10 || totalPending >= 15;

    recommendations.push({
      id: "rec-triage-backlog",
      title: `${totalPending} Submission${totalPending > 1 ? "s" : ""} Pending Administrative Verification`,
      severity: isCritical ? "CRITICAL" : "WARNING",
      category: "TRIAGE_BACKLOG",
      reason: "Unapproved reports cannot be auto-routed to operational departments for dispatch, causing unnecessary delay in municipal response.",
      evidence: [
        `${pendingReports} citizen report${pendingReports > 1 ? "s" : ""} awaiting approval and category routing`,
        `${pendingAccounts} citizen registration${pendingAccounts > 1 ? "s" : ""} awaiting identity/NRC verification`,
      ],
      suggestedAction: "Process the pending approval queue so valid civic issues can be automatically dispatched to responsible municipal departments.",
      actionLabel: "Open Approvals Queue",
      actionLink: "/admin/approvals",
      limitation: "Live queue counts of records currently in PENDING status.",
      isSimulated: false,
    });
  }

  return recommendations;
}

/**
 * Aggregates all deterministic recommendation rules for the Admin Executive Dashboard.
 * @param {object} params
 * @param {object} params.summary - Raw summary response
 * @param {Array} params.departmentStats - Raw department performance
 * @param {Array} params.reports - Raw reports array
 * @param {object} params.analytics - Computed analytics engine output
 * @returns {Array<object>} Sorted list of recommendations by severity (CRITICAL -> WARNING -> ADVISORY)
 */
export function generateAdminRecommendations({ summary, departmentStats, reports, analytics }) {
  const recs = [
    ...generateSlaBreachRecommendations(reports, analytics?.sla),
    ...generateWorkloadRecommendations(analytics?.departments),
    ...generateTriageQueueRecommendations(summary),
  ];

  const severityOrder = { CRITICAL: 0, WARNING: 1, ADVISORY: 2 };

  return recs.sort((a, b) => {
    const orderA = severityOrder[a.severity] ?? 99;
    const orderB = severityOrder[b.severity] ?? 99;
    return orderA - orderB;
  });
}
