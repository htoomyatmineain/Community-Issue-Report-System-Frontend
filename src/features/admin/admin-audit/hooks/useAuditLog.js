import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { auditLogsApi } from "../api/auditLogsApi";

const PAGE_SIZE = 20;
/** The trail grows as admins/staff act elsewhere — refresh quietly so it stays live. */
const AUTO_REFRESH_MS = 30_000;

/**
 * Owns the Audit Logs table: server-side filters + pagination and the fetched
 * rows. Every filter change resets to page 0; the search box is debounced.
 */
export function useAuditLog() {
  const [entries, setEntries] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [action, setAction] = useState("ALL");
  const [actorId, setActorId] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [actors, setActors] = useState([]);

  useEffect(() => {
    auditLogsApi.listActors().then(setActors).catch(() => setActors([]));
  }, []);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, action, actorId, startDate, endDate]);

  const fetchEntries = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) {
        setIsLoading(true);
        setError(null);
      }
      try {
        const data = await auditLogsApi.list({
          search: debouncedSearch || undefined,
          action: action === "ALL" ? undefined : action,
          actorId: actorId === "ALL" ? undefined : actorId,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          page,
          size: PAGE_SIZE,
        });
        if (Array.isArray(data)) {
          setEntries(data);
          setTotalElements(data.length);
          setTotalPages(1);
        } else {
          setEntries(data.content ?? []);
          setTotalElements(data.totalElements ?? 0);
          setTotalPages(data.totalPages ?? 1);
        }
      } catch (err) {
        if (!silent) setError(err?.response?.data?.message ?? "Failed to load audit logs");
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [debouncedSearch, action, actorId, startDate, endDate, page]
  );

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Keep the newest entries flowing in without a manual reload.
  useEffect(() => {
    const refreshIfVisible = () => {
      if (document.visibilityState === "visible") fetchEntries({ silent: true });
    };
    const intervalId = setInterval(refreshIfVisible, AUTO_REFRESH_MS);
    document.addEventListener("visibilitychange", refreshIfVisible);
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", refreshIfVisible);
    };
  }, [fetchEntries]);

  return {
    entries,
    totalElements,
    totalPages,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    isLoading,
    error,
    search,
    setSearch,
    action,
    setAction,
    actorId,
    setActorId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    actors,
  };
}
