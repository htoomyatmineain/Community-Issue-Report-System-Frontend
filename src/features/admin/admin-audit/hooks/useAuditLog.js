import { useSyncExternalStore } from "react";
import { getAuditEntries, subscribeAuditLog } from "../auditLogStore";

/** Live view of the centralized audit log. */
export function useAuditLog() {
  return useSyncExternalStore(subscribeAuditLog, getAuditEntries, getAuditEntries);
}
