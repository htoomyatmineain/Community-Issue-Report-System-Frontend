import { useCallback, useMemo, useRef, useState } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { DAILY_SUPPORT_LIMIT } from "../supportEngine";
import { communitySupportApi } from "../api/communitySupportApi";

const STORAGE_PREFIX = "kh:community-support:v2:";
const keyFor = (userId) => `${STORAGE_PREFIX}${userId ?? "anon"}`;

function readSupportedIds(userId) {
  try {
    const parsed = JSON.parse(localStorage.getItem(keyFor(userId)) ?? "null");
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set();
  }
}

function writeSupportedIds(userId, set) {
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify([...set]));
  } catch {
    /* storage unavailable — the toggle still works for this session */
  }
}

/**
 * Owns the reversible community-feed "Support" toggle, backed by the real
 * endpoints (POST / DELETE `/api/reports/{id}/support`).
 *
 * Each toggle moves the supporter's leaderboard score by exactly ±3 on the
 * server; this hook flips the local "supported" flag optimistically, calls the
 * API, and rolls back if it fails — so the red button state and the leaderboard
 * never disagree. Which reports the citizen backs is mirrored to localStorage
 * so the red state survives a page reload (the public-feed payload carries no
 * per-user support flag).
 *
 * `toggleSupport` is async and returns the shape the feed card already reads:
 *   { ok: true,  removed: false, reward: 3 }   ← just supported (+3)
 *   { ok: true,  removed: true,  reward: 3 }   ← just withdrew  (−3)
 *   { ok: false, reason: "LIMIT_REACHED" | "PENDING" | "ALREADY_SUPPORTED" | "NOT_SUPPORTED" | "ERROR" }
 */
export function useCommunitySupport() {
  const { user } = useAuth();
  const userId = user?.id ?? user?.userId ?? "anon";

  const [supportedIds, setSupportedIds] = useState(() => readSupportedIds(userId));
  const [remainingToday, setRemainingToday] = useState(DAILY_SUPPORT_LIMIT);
  const pendingRef = useRef(new Set());
  const [, forceRender] = useState(0);

  // Functional set update + localStorage mirror, safe under concurrent
  // toggles on different cards.
  const mutate = useCallback(
    (mutator) => {
      setSupportedIds((prev) => {
        const next = new Set(prev);
        mutator(next);
        writeSupportedIds(userId, next);
        return next;
      });
    },
    [userId]
  );

  const isSupported = useCallback(
    (reportId) => supportedIds.has(String(reportId)),
    [supportedIds]
  );

  const isPending = useCallback((reportId) => pendingRef.current.has(String(reportId)), []);

  const setPending = useCallback((reportId, on) => {
    const key = String(reportId);
    if (on) pendingRef.current.add(key);
    else pendingRef.current.delete(key);
    forceRender((n) => n + 1);
  }, []);

  const toggleSupport = useCallback(
    async (reportId) => {
      const key = String(reportId);
      if (pendingRef.current.has(key)) return { ok: false, reason: "PENDING" };

      const adding = !supportedIds.has(key);
      if (adding && remainingToday <= 0) {
        return { ok: false, reason: "LIMIT_REACHED" };
      }

      // Optimistically flip the red state.
      mutate((set) => (adding ? set.add(key) : set.delete(key)));
      setPending(reportId, true);

      try {
        const result = adding
          ? await communitySupportApi.support(reportId)
          : await communitySupportApi.removeSupport(reportId);

        if (typeof result?.remainingToday === "number") {
          setRemainingToday(result.remainingToday);
        }
        const reward = Math.abs(result?.awardedPoints ?? 3);
        return { ok: true, removed: !adding, reward, totalPoints: result?.totalPoints };
      } catch (err) {
        const status = err?.response?.status;

        // 409: the server already has this support — settle on "supported".
        if (adding && status === 409) {
          mutate((set) => set.add(key));
          return { ok: false, reason: "ALREADY_SUPPORTED" };
        }
        // 400 while withdrawing: the server has no such support — settle on "not supported".
        if (!adding && status === 400) {
          mutate((set) => set.delete(key));
          return { ok: false, reason: "NOT_SUPPORTED" };
        }
        // 400 while adding: rolling-24h cap reached — roll back and lock out.
        if (adding && status === 400) {
          mutate((set) => set.delete(key));
          setRemainingToday(0);
          return { ok: false, reason: "LIMIT_REACHED" };
        }

        // Anything else — undo the optimistic flip.
        mutate((set) => (adding ? set.delete(key) : set.add(key)));
        return { ok: false, reason: "ERROR", message: err?.response?.data?.message };
      } finally {
        setPending(reportId, false);
      }
    },
    [supportedIds, remainingToday, mutate, setPending]
  );

  return useMemo(
    () => ({
      isSupported,
      isPending,
      toggleSupport,
      remainingToday,
      dailyLimit: DAILY_SUPPORT_LIMIT,
    }),
    [isSupported, isPending, toggleSupport, remainingToday]
  );
}
