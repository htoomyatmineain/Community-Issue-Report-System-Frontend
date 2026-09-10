/**
 * Display helpers for the "What's happening in Yangon" feed's Support control.
 *
 * The award itself now lives on the backend: POST /api/reports/{id}/support
 * grants the points and enforces the rolling-24h quota (see
 * `useCommunitySupport`). What stays here is purely presentational — a
 * deterministic "community backing so far" number and the score-driven
 * priority-badge escalation, neither of which the API exposes yet — plus the
 * tiny localStorage ledger that remembers which reports this citizen already
 * backed so the filled heart survives a reload.
 */

const STORAGE_PREFIX = "kh:community-support:v1:";

export const DAILY_SUPPORT_LIMIT = 5;
/** Score points each support adds to a report's escalation score (display only). */
export const SUPPORT_SCORE_WEIGHT = 5;

const RANK_BY_PRIORITY = { LOW: 0, NORMAL: 1, MEDIUM: 1, HIGH: 2, URGENT: 3 };
const PRIORITY_BY_RANK = ["LOW", "NORMAL", "HIGH", "URGENT"];
const BASE_SCORE_BY_PRIORITY = { LOW: 15, NORMAL: 45, MEDIUM: 45, HIGH: 85, URGENT: 140 };

/** A score at/above `min` forces the report's priority up to at least `priority`. */
const ESCALATION_RULES = [
  { min: 140, priority: "URGENT" },
  { min: 80, priority: "HIGH" },
  { min: 40, priority: "NORMAL" },
];

const keyFor = (userId) => `${STORAGE_PREFIX}${userId ?? "anon"}`;

export function readLedger(userId) {
  try {
    const parsed = JSON.parse(localStorage.getItem(keyFor(userId)) ?? "null");
    return {
      events: Array.isArray(parsed?.events) ? parsed.events : [],
      bonusPoints: Number(parsed?.bonusPoints) || 0,
    };
  } catch {
    return { events: [], bonusPoints: 0 };
  }
}

export function writeLedger(userId, ledger) {
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify(ledger));
  } catch {
    /* storage unavailable — support stays in memory for this session */
  }
}

export function hasSupported(events, reportId) {
  return events.some((event) => String(event.reportId) === String(reportId));
}

/**
 * Deterministic "community support so far" baseline, seeded from the report id —
 * lets scores and counts look alive without a backend tally.
 */
export function baselineSupport(reportId) {
  const hash = String(reportId)
    .split("")
    .reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7);
  return hash % 24;
}

export function supportCount(report, extraSupports = 0) {
  return baselineSupport(report.id) + extraSupports;
}

export function reportScore(report, extraSupports = 0) {
  const base = BASE_SCORE_BY_PRIORITY[report.priority] ?? BASE_SCORE_BY_PRIORITY.NORMAL;
  return base + supportCount(report, extraSupports) * SUPPORT_SCORE_WEIGHT;
}

/** Higher of the backend priority and the score-derived priority. */
export function escalatedPriority(report, score) {
  const backendRank = RANK_BY_PRIORITY[report.priority] ?? 1;
  const rule = ESCALATION_RULES.find((r) => score >= r.min);
  const scoreRank = rule ? RANK_BY_PRIORITY[rule.priority] : 0;
  return PRIORITY_BY_RANK[Math.max(backendRank, scoreRank)];
}
