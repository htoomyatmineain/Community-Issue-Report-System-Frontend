import { useEffect, useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { citizenReportApi } from "../api/citizenReportApi";

const MAX_PHOTOS = 3;

export function useNewReportForm({ onSubmitted } = {}) {
  const geolocation = useGeolocation();
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  // Non-null while the backend's proximity duplicate check is waiting on the
  // citizen to say whether an existing report is the same issue.
  const [possibleDuplicates, setPossibleDuplicates] = useState(null);

  useEffect(() => {
    // ui-rules.md: "GPS is captured automatically on open." Use a live watch,
    // not a one-shot fix, so the pin tracks the citizen's real-time location
    // (and keeps refining as the first coarse fix sharpens). Dragging/tapping
    // the pin, or the "Stop following" toggle, ends the watch.
    geolocation.startWatch();
    citizenReportApi
      .listCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setIsLoadingCategories(false));
    return () => geolocation.stopWatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addPhotos(files) {
    const next = Array.from(files)
      .slice(0, MAX_PHOTOS - photos.length)
      .map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    setPhotos((prev) => [...prev, ...next]);
  }

  function removePhoto(index) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function reset() {
    setCategory("");
    setDescription("");
    setPhotos([]);
    setError(null);
    setPossibleDuplicates(null);
  }

  /**
   * Shared submit path. `extra` carries the duplicate-check round-trip fields
   * (`confirmDuplicateOfId` / `forceCreate`); on the first attempt it's empty.
   */
  async function send(extra = {}) {
    if (!category || !description.trim()) {
      setError("Please choose a category and describe the issue.");
      return;
    }
    // reports.latitude/longitude are NOT NULL (database-schema.md) — a location is required, not optional.
    if (!geolocation.position) {
      setError("We need your location to submit. Tap \"Use my location\" or enable location access.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const result = await citizenReportApi.submitReport({
        categoryId: Number(category),
        description: description.trim(),
        latitude: geolocation.position.latitude,
        longitude: geolocation.position.longitude,
        photos: photos.map((p) => p.file),
        ...extra,
      });

      if (result.outcome === "DUPLICATES_FOUND") {
        // Nothing was persisted — keep the form intact and ask the citizen.
        setPossibleDuplicates(result.possibleDuplicates);
        return;
      }

      reset();
      onSubmitted?.(result.report, { confirmed: extra.confirmDuplicateOfId != null });
    } catch (err) {
      // api-standards.md: a validation failure's real detail lives in
      // `errors` (per-field), not the generic top-level `message` ("Validation
      // failed") — surface the specific one so the citizen knows what to fix.
      const data = err?.response?.data;
      const fieldMessage = data?.errors && Object.values(data.errors)[0];
      setError(fieldMessage ?? data?.message ?? "Failed to submit report");
      setPossibleDuplicates(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  const submit = () => send();
  const confirmDuplicate = (reportId) => send({ confirmDuplicateOfId: reportId });
  const submitAnyway = () => send({ forceCreate: true });
  const dismissDuplicates = () => setPossibleDuplicates(null);

  return {
    categories,
    isLoadingCategories,
    category,
    setCategory,
    description,
    setDescription,
    photos,
    addPhotos,
    removePhoto,
    maxPhotos: MAX_PHOTOS,
    geolocation,
    isSubmitting,
    error,
    submit,
    possibleDuplicates,
    confirmDuplicate,
    submitAnyway,
    dismissDuplicates,
  };
}
