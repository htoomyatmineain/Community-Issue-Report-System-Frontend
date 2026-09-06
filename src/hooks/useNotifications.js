import { useCallback, useEffect, useState } from "react";
import { notificationsApi } from "@/services/notificationsApi";

/**
 * Owns the current user's own notification list and read-state mutations.
 * Role-agnostic — used by the citizen, staff, and admin notification pages.
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await notificationsApi.list();
      setNotifications(data);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function markRead(id) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await notificationsApi.markRead(id);
    } catch {
      fetchAll(); // out of sync with the server — reload rather than leave a false "read" shown
    }
  }

  async function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await notificationsApi.markAllRead();
    } catch {
      fetchAll();
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, isLoading, error, markRead, markAllRead, unreadCount, refetch: fetchAll };
}
