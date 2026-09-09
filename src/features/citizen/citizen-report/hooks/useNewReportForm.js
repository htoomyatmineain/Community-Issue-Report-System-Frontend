import { useEffect, useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useReverseGeocode } from "@/hooks/useReverseGeocode";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { citizenReportApi } from "../api/citizenReportApi";

const MAX_PHOTOS = 3;

export function useNewReportForm({ onSubmitted } = {}) {
  const geolocation = useGeolocation();
  const { language } = useLanguage();
  // Human-readable street/quarter/township/city for the current pin — shown in
  // the form and saved with the report (reports.address_text).
  const geocode = useReverseGeocode(geolocation.position, { language });
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  // Opt-in: hide the reporter's name on the public feed (admins still see it).
  const [isAnonymous, setIsAnonymous] = useState(false);
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
    setIsAnonymous(false);
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
    // A photo is required — every report must show at least one picture of the issue.
    if (photos.length === 0) {
      setError("Please add at least one photo of the issue.");
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
        addressText: geocode.address?.line ?? undefined,
        photos: photos.map((p) => p.file),
        isAnonymous,
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

  // Every required field must be filled before the citizen can submit. Each flag
  // drives a small red hint under its own field so the citizen sees exactly
  // which box is still left to fill.
  const missing = {
    location: !geolocation.position,
    category: !category,
    description: !description.trim(),
    photo: photos.length === 0,
  };
  const canSubmit = !Object.values(missing).some(Boolean);

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
    isAnonymous,
    setIsAnonymous,
    geolocation,
    address: geocode.address,
    isResolvingAddress: geocode.isLoading,
    isSubmitting,
    canSubmit,
    missing,
    error,
    submit,
    possibleDuplicates,
    confirmDuplicate,
    submitAnyway,
    dismissDuplicates,
  };
}
