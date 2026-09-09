/**
 * Lightweight cross-hook signal: the notifications page owns the list (via
 * useNotifications), while the nav dot / console bell badge poll a separate
 * count (useUnreadNotificationCount). A read action in one place fires this so
 * the other updates immediately instead of waiting for the 60s poll.
 */
export const NOTIFICATIONS_READ_EVENT = "kh:notifications-read";

export function emitNotificationsRead(detail) {
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_READ_EVENT, { detail }));
}
