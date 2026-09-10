import { useCallback, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { citizenHomeApi } from "../api/citizenHomeApi";
import { DAILY_SUPPORT_LIMIT, hasSupported, readLedger, writeLedger } from "../supportEngine";

/**
 * Toggles the current user's report "supports" against the backend
 * (POST /api/reports/{id}/support to back it, DELETE to withdraw). Those
 * endpoints own the points (+3 / −3) and the rolling-24h quota, so the
 * leaderboard/score move for real in both directions.
 *
 * localStorage is kept only as UI memory of which reports this citizen has
 * currently backed, so the filled heart survives navigation and reload (there
 * is no "my supports" GET endpoint to rehydrate from). The server is still the
 * source of truth: a tap that contradicts it (repeat support, or un-support of
 * something not supported) is rejected and simply re-synced into that memory.
 */
export function useCommunitySupport() {
  const { user } = useAuth();
  const userId = user?.id ?? user?.userId ?? "anon";
  const [supported, setSupported] = useState(() => readLedger(userId).events);

  const remember = useCallback(
    (reportId) => {
      const key = String(reportId);
      setSupported((prev) => {
        if (prev.some((event) => event.reportId === key)) return prev;
        const next = [...prev, { reportId: key, at: Date.now() }];
        writeLedger(userId, { events: next, bonusPoints: 0 });
        return next;
      });
    },
    [userId]
  );

  const forget = useCallback(
    (reportId) => {
      const key = String(reportId);
      setSupported((prev) => {
        if (!prev.some((event) => event.reportId === key)) return prev;
        const next = prev.filter((event) => event.reportId !== key);
        writeLedger(userId, { events: next, bonusPoints: 0 });
        return next;
      });
    },
    [userId]
  );

  const isSupported = useCallback((reportId) => hasSupported(supported, reportId), [supported]);

  const support = useCallback(
    async (reportId) => {
      if (hasSupported(supported, reportId)) {
        return { ok: false, reason: "ALREADY_SUPPORTED" };
      }
      try {
        const result = await citizenHomeApi.supportReport(reportId);
        remember(reportId);
        return {
          ok: true,
          reward: result?.awardedPoints ?? 0,
          totalPoints: result?.totalPoints,
          supportCount: result?.supportCount,
          remainingToday: result?.remainingToday,
        };
      } catch (err) {
        const status = err?.response?.status;
        const message = err?.response?.data?.message;
        if (status === 409) {
          remember(reportId); // already recorded server-side — reflect it in the UI
          return { ok: false, reason: "ALREADY_SUPPORTED", message };
        }
        if (status === 400) {
          return { ok: false, reason: "LIMIT_REACHED", message };
        }
        return { ok: false, reason: "ERROR", message };
      }
    },
    [supported, remember]
  );

  const unsupport = useCallback(
    async (reportId) => {
      if (!hasSupported(supported, reportId)) {
        return { ok: false, reason: "NOT_SUPPORTED" };
      }
      try {
        const result = await citizenHomeApi.unsupportReport(reportId);
        forget(reportId);
        return {
          ok: true,
          reward: result?.awardedPoints ?? 0, // -3
          totalPoints: result?.totalPoints,
          supportCount: result?.supportCount,
          remainingToday: result?.remainingToday,
        };
      } catch (err) {
        const status = err?.response?.status;
        const message = err?.response?.data?.message;
        if (status === 400) {
          forget(reportId); // server says it isn't supported — sync the UI
          return { ok: false, reason: "NOT_SUPPORTED", message };
        }
        return { ok: false, reason: "ERROR", message };
      }
    },
    [supported, forget]
  );

  return { isSupported, support, unsupport, dailyLimit: DAILY_SUPPORT_LIMIT };
}
