/**
 * Community-support (upvote) engine for the "What's happening in Yangon" feed.
 *
 * The backend has no endorse / report-score / priority-escalation endpoints
 * yet, so support state, the rolling 24h quota, the supporter's bonus points,
 * and dynamic priority escalation are derived and persisted client-side (per
 * user, in localStorage). Swap the storage helpers for API calls once the
 * endpoints ship — the component only depends on this module's surface.
 */

const STORAGE_PREFIX = "kh:community-support:v1:";
const DAY_MS = 24 * 60 * 60 * 1000;

export const DAILY_SUPPORT_LIMIT = 5;
/** Points the original reporter earns when a report is approved. */
export const REPORT_BASE_POINTS = 25;
/** Supporter reward: 20% of the reporter's base points. */
export const SUPPORTER_REWARD = Math.round(REPORT_BASE_POINTS * 0.2);
/** Score points each support adds to a report. */
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

export function recentEventCount(events, now = Date.now()) {
  const cutoff = now - DAY_MS;
  return events.filter((event) => event.at > cutoff).length;
}

export function hasSupported(events, reportId) {
  return events.some((event) => String(event.reportId) === String(reportId));
}

/**
 * A freshly approved report has zero support — the count only grows as other
 * citizens actually tap Support (tracked in `extraSupports`, this device's
 * local ledger). There is no backend tally yet (see the module doc-comment
 * above), so this can't reflect support from OTHER devices — but it must not
 * fabricate a nonzero starting number the way the old id-hashed baseline did.
 */
export function supportCount(extraSupports = 0) {
  return extraSupports;
}

export function reportScore(report, extraSupports = 0) {
  const base = BASE_SCORE_BY_PRIORITY[report.priority] ?? BASE_SCORE_BY_PRIORITY.NORMAL;
  return base + supportCount(extraSupports) * SUPPORT_SCORE_WEIGHT;
}

/** Higher of the backend priority and the score-derived priority. */
export function escalatedPriority(report, score) {
  const backendRank = RANK_BY_PRIORITY[report.priority] ?? 1;
  const rule = ESCALATION_RULES.find((r) => score >= r.min);
  const scoreRank = rule ? RANK_BY_PRIORITY[rule.priority] : 0;
  return PRIORITY_BY_RANK[Math.max(backendRank, scoreRank)];
}
