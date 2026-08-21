import { useCallback, useEffect, useState } from "react";
import { consoleReportsApi } from "../api/consoleReportsApi";

/** Loads one report's detail, history and comments, and exposes the console mutation actions. */
export function useConsoleReportDetail(id) {
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [reportData, historyData, commentsData] = await Promise.all([
        consoleReportsApi.getById(id),
        consoleReportsApi.getHistory(id),
        consoleReportsApi.getComments(id),
      ]);
      setReport(reportData);
      setHistory(historyData);
      setComments(commentsData);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load report");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function changeStatus(payload) {
    const updated = await consoleReportsApi.changeStatus(id, payload);
    setReport(updated);
    setHistory(await consoleReportsApi.getHistory(id));
  }

  async function setPriority(priority) {
    const updated = await consoleReportsApi.setPriority(id, priority);
    setReport(updated);
  }

  async function assign(payload) {
    const updated = await consoleReportsApi.assign(id, payload);
    setReport(updated);
  }

  async function addComment(payload) {
    const comment = await consoleReportsApi.addComment(id, payload);
    setComments((prev) => [...prev, comment]);
  }

  async function uploadResolutionPhotos(files) {
    await consoleReportsApi.uploadResolutionPhotos(id, files);
    setReport(await consoleReportsApi.getById(id));
  }

  return {
    report,
    history,
    comments,
    isLoading,
    error,
    changeStatus,
    setPriority,
    assign,
    addComment,
    uploadResolutionPhotos,
    reload: load,
  };
}
