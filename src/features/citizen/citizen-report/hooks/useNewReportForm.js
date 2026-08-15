import { useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { citizenReportApi } from "../api/citizenReportApi";

const MAX_PHOTOS = 3;

export function useNewReportForm({ onSubmitted } = {}) {
  const geolocation = useGeolocation();
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

    setIsSubmitting(true);
    setError(null);
    try {
      const created = await citizenReportApi.submitReport({
        category,
        description: description.trim(),
        latitude: geolocation.position?.latitude ?? null,
        longitude: geolocation.position?.longitude ?? null,
        photos: photos.map((p) => p.file),
      });
      reset();
      onSubmitted?.(created);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
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
