/**
 * Centralized in-memory audit log for the admin console.
 *
 * Admin operations (account reviews today; department/role/report changes as
 * those flows adopt it) append here via `addAuditEntry`, and the Audit Logs
 * page subscribes. There is no backend audit endpoint yet — when one lands,
 * replace `entries` with an API feed and keep this module's surface.
 *
 * Entry shape:
 *   { id, timestamp, actor, actorEmail?, action, target, details }
 */

export const AUDIT_ACTIONS = [
  "APPROVE_USER",
  "DENY_USER",
  "CREATE_DEPT",
  "UPDATE_ROLE",
  "RESOLVE_ISSUE",
];

const base = Date.now();
const minutesAgo = (m) => new Date(base - m * 60_000).toISOString();

let entries = [
  {
    id: "seed-1",
    timestamp: minutesAgo(14),
    actor: "System Administrator",
    actorEmail: "admin@kinnhtout.gov",
    action: "APPROVE_USER",
    target: "Hnin Ei Phyu (citizen)",
    details: "PENDING → APPROVED",
  },
  {
    id: "seed-2",
    timestamp: minutesAgo(52),
    actor: "System Administrator",
    actorEmail: "admin@kinnhtout.gov",
    action: "DENY_USER",
    target: "Zaw Min Latt (citizen)",
    details: "PENDING → DENIED · Reason: Duplicate NRC on file",
  },
  {
    id: "seed-3",
    timestamp: minutesAgo(186),
    actor: "System Administrator",
    actorEmail: "admin@kinnhtout.gov",
    action: "CREATE_DEPT",
    target: "Parks & Recreation Dept.",
    details: "Department created · Head: Daw Khin Mya",
  },
  {
    id: "seed-4",
    timestamp: minutesAgo(263),
    actor: "Ko Myat Thu (staff)",
    actorEmail: "myatthu@kinnhtout.gov",
    action: "RESOLVE_ISSUE",
    target: "RPT-10432 — Broken streetlight, 42nd St",
    details: "IN_PROGRESS → RESOLVED",
  },
  {
    id: "seed-5",
    timestamp: minutesAgo(1_440),
    actor: "System Administrator",
    actorEmail: "admin@kinnhtout.gov",
    action: "UPDATE_ROLE",
    target: "Ma Thida (staff)",
    details: "Role: STAFF → DEPARTMENT_HEAD",
  },
];

const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn(entries));

/** Current snapshot — stable reference until the next `addAuditEntry`. */
export function getAuditEntries() {
  return entries;
}

/** Subscribe to changes; returns an unsubscribe fn (useSyncExternalStore-ready). */
export function subscribeAuditLog(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Prepend an entry. `id` + `timestamp` are filled in if omitted. */
export function addAuditEntry(entry) {
  const full = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  entries = [full, ...entries];
  emit();
  return full;
}
