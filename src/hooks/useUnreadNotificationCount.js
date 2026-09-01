import { useEffect, useState } from "react";
import { api } from "@/services/apiClient";

const POLL_INTERVAL_MS = 60000; // ui-rules.md: "polled every 60 s"

/** Powers the console notification bell's badge — GET /api/notifications/unread-count. */
export function useUnreadNotificationCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    function fetchCount() {
      api
        .get("/notifications/unread-count")
        .then(({ data }) => {
          if (!cancelled) setCount(data.count);
        })
        .catch(() => {
          // Silent — a stale/missing badge count isn't worth surfacing an error for.
        });
    }

    fetchCount();
    const interval = setInterval(fetchCount, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return count;
}
