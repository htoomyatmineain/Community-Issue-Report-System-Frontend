import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { consoleReportsApi } from "../api/consoleReportsApi";

const PAGE_SIZE = 10;

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

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
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
        setReports(data.content);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, status, categoryId, departmentId, startDate, endDate, page]);

  useEffect(() => {
    fetchReports();
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
