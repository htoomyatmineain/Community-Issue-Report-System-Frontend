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

  useEffect(() => {
    // ui-rules.md: "GPS is captured automatically on open."
    geolocation.locate();
    citizenReportApi
      .listCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setIsLoadingCategories(false));
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
  }

  async function submit() {
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
      const created = await citizenReportApi.submitReport({
        categoryId: Number(category),
        description: description.trim(),
        latitude: geolocation.position.latitude,
        longitude: geolocation.position.longitude,
        photos: photos.map((p) => p.file),
      });
      reset();
      onSubmitted?.(created);
    } catch (err) {
      // api-standards.md: a validation failure's real detail lives in
      // `errors` (per-field), not the generic top-level `message` ("Validation
      // failed") — surface the specific one so the citizen knows what to fix.
      const data = err?.response?.data;
      const fieldMessage = data?.errors && Object.values(data.errors)[0];
      setError(fieldMessage ?? data?.message ?? "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  }

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
  };
}
