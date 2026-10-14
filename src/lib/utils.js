import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** "Aung Thanlwin" -> "AT". Used for avatar initials in console shells. */
export function getInitials(fullName) {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/**
 * Formats overdue/elapsed hours into human-readable intervals:
 * - < 24h: "5h", "12.4h", "23h"
 * - >= 24h and < 7d: "1 day", "1 day 2hr", "2 days", "3 days 5hr"
 * - >= 7d and < 30d: "1 week", "2 weeks", "3 weeks", "4 weeks"
 * - >= 30d and < 365d: "1 month", "2 months", "3 months"
 * - >= 365d: "1 year", "2 years"
 */
export function formatOverdueDuration(hours) {
  if (hours == null || isNaN(hours) || hours <= 0) return "0h";

  if (hours < 24) {
    const formatted = hours % 1 === 0 ? hours : Number(hours.toFixed(1));
    return `${formatted}h`;
  }

  const totalHours = Math.round(hours);
  const days = Math.floor(totalHours / 24);
  const remHours = totalHours % 24;

  if (days < 7) {
    if (remHours > 0) {
      return `${days} ${days === 1 ? "day" : "days"} ${remHours}hr`;
    }
    return `${days} ${days === 1 ? "day" : "days"}`;
  }

  if (days < 30) {
    const weeks = Math.max(1, Math.floor(days / 7));
    return `${weeks} ${weeks === 1 ? "week" : "weeks"}`;
  }

  if (days < 365) {
    const months = Math.max(1, Math.floor(days / 30));
    return `${months} ${months === 1 ? "month" : "months"}`;
  }

  const years = Math.max(1, Math.floor(days / 365));
  return `${years} ${years === 1 ? "year" : "years"}`;
}

export const formatDuration = formatOverdueDuration;

