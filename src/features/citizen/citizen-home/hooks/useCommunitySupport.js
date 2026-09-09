import { useCallback, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import {
  DAILY_SUPPORT_LIMIT,
  SUPPORTER_REWARD,
  hasSupported,
  readLedger,
  recentEventCount,
  writeLedger,
} from "../supportEngine";

/**
 * Owns the current user's community-support ledger: which reports they've
 * backed, their rolling-24h quota, and the bonus points they've earned.
 */
export function useCommunitySupport() {
  const { user } = useAuth();
  const userId = user?.id ?? user?.userId ?? "anon";
  const [ledger, setLedger] = useState(() => readLedger(userId));

  const remainingToday = Math.max(0, DAILY_SUPPORT_LIMIT - recentEventCount(ledger.events));

  const isSupported = useCallback(
    (reportId) => hasSupported(ledger.events, reportId),
    [ledger.events]
  );

  const support = useCallback(
    (reportId) => {
      if (hasSupported(ledger.events, reportId)) {
        return { ok: false, reason: "ALREADY_SUPPORTED" };
      }
      if (recentEventCount(ledger.events) >= DAILY_SUPPORT_LIMIT) {
        return { ok: false, reason: "LIMIT_REACHED" };
      }
      const next = {
        events: [...ledger.events, { reportId: String(reportId), at: Date.now() }],
        bonusPoints: ledger.bonusPoints + SUPPORTER_REWARD,
      };
      setLedger(next);
      writeLedger(userId, next);
      return { ok: true, reward: SUPPORTER_REWARD };
    },
    [ledger, userId]
  );

  return {
    isSupported,
    support,
    remainingToday,
    dailyLimit: DAILY_SUPPORT_LIMIT,
    bonusPoints: ledger.bonusPoints,
  };
}
