import { useCallback, useEffect, useState } from "react";
import { citizenReportApi } from "../api/citizenReportApi";

/** Loads a single report's detail and exposes a feedback-submit action. */
export function useReportDetail(id) {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const load = useCallback(() => {
    let cancelled = false;
    setIsLoading(true);
    citizenReportApi
      .getReportById(id)
      .then((result) => {
        if (!cancelled) setReport(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message ?? "Report not found");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => load(), [load]);

  async function submitFeedback(feedback) {
    setIsSubmittingFeedback(true);
    try {
      const updated = await citizenReportApi.submitFeedback(id, feedback);
      setReport(updated);
    } finally {
      setIsSubmittingFeedback(false);
    }
  }

  return { report, isLoading, error, submitFeedback, isSubmittingFeedback };
}
