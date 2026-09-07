import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { consoleReportsApi } from "../api/consoleReportsApi";

const PAGE_SIZE = 10;
/** How often the list silently re-fetches so newly approved reports appear without a manual reload. */
const AUTO_REFRESH_MS = 30_000;

/** Owns the console Reports list's filters, pagination, and the fetched rows. */
export function useConsoleReportsList() {
  const [reports, setReports] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [categoryId, setCategoryId] = useState("ALL");
  const [departmentId, setDepartmentId] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    consoleReportsApi.listCategories().then(setCategories).catch(() => setCategories([]));
    consoleReportsApi.listDepartments().then(setDepartments).catch(() => setDepartments([]));
  }, []);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, status, categoryId, departmentId, startDate, endDate]);

  const fetchReports = useCallback(async ({ silent = false } = {}) => {
    // A background refresh must not flash the skeleton or wipe the table.
    if (!silent) setIsLoading(true);
    if (!silent) setError(null);
    try {
      const data = await consoleReportsApi.list({
        search: debouncedSearch || undefined,
        status: status === "ALL" ? undefined : status,
        categoryId: categoryId === "ALL" ? undefined : categoryId,
        departmentId: departmentId === "ALL" ? undefined : departmentId,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page,
        size: PAGE_SIZE,
      });
      // api-standards.md: list endpoints return either a bare array or the paged envelope.
      if (Array.isArray(data)) {
        setReports(data);
        setTotalElements(data.length);
        setTotalPages(1);
      } else {
        setReports(data.content ?? []);
        setTotalElements(data.totalElements ?? 0);
        setTotalPages(data.totalPages ?? 1);
      }
    } catch (err) {
      // On a background refresh, keep the rows already on screen rather than
      // replacing the table with an error over a transient blip.
      if (!silent) setError(err?.response?.data?.message ?? "Failed to load reports");
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [debouncedSearch, status, categoryId, departmentId, startDate, endDate, page]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Poll while the tab is visible so reports approved elsewhere (or freshly
  // filed) surface on their own; also refetch the moment the tab regains focus.
  useEffect(() => {
    const refreshIfVisible = () => {
      if (document.visibilityState === "visible") fetchReports({ silent: true });
    };
    const intervalId = setInterval(refreshIfVisible, AUTO_REFRESH_MS);
    document.addEventListener("visibilitychange", refreshIfVisible);
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", refreshIfVisible);
    };
  }, [fetchReports]);

  return {
    reports,
    totalElements,
    totalPages,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    isLoading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    categoryId,
    setCategoryId,
    departmentId,
    setDepartmentId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    categories,
    departments,
  };
}
