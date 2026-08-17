import { useRef } from "react";
import { Camera, ChevronDown, LocateFixed, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ISSUE_CATEGORIES } from "@/lib/constants";
import { useNewReportForm } from "../hooks/useNewReportForm";

const PROBLEM_PRESETS = ["Pothole", "Blocked drain", "Damaged sidewalk"];

export default function NewReportForm({ onSubmitted }) {
  const fileInputRef = useRef(null);
  const form = useNewReportForm({ onSubmitted });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-semibold text-foreground">Location</span>
        <div className="relative flex h-[140px] w-full items-center justify-center rounded-lg bg-muted">
          <MapPin className="h-[26px] w-[26px] text-primary" />
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={form.geolocation.locate}
        >
          <LocateFixed className="h-4 w-4" />
          {form.geolocation.isLocating ? "Locating…" : "Use my location"}
        </Button>
        {form.geolocation.position && (
          <span className="text-xs text-muted-foreground">
            {form.geolocation.position.latitude.toFixed(5)},{" "}
            {form.geolocation.position.longitude.toFixed(5)}
          </span>
        )}
        {form.geolocation.error && (
          <span className="text-xs text-destructive">{form.geolocation.error}</span>
        )}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-foreground">Category *</span>
        <div className="relative">
          <select
            value={form.category}
            onChange={(e) => form.setCategory(e.target.value)}
            className="w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="" disabled>
              Select an option
            </option>
            {ISSUE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </label>

      <div className="flex flex-col gap-2.5">
        <span className="text-[13px] font-semibold text-foreground">What&apos;s wrong? *</span>
        <div className="flex flex-wrap gap-2">
          {PROBLEM_PRESETS.map((preset) => {
            const active = form.description.startsWith(preset);
            return (
              <button
                key={preset}
                type="button"
                onClick={() => !form.description && form.setDescription(`${preset} — `)}
                className={
                  active
                    ? "rounded-full bg-primary px-3.5 py-2 text-[13px] font-semibold text-primary-foreground"
                    : "rounded-full border border-border bg-background px-3.5 py-2 text-[13px] font-semibold text-foreground"
                }
              >
                {preset}
              </button>
            );
          })}
        </div>
        <textarea
          value={form.description}
          onChange={(e) => form.setDescription(e.target.value)}
          placeholder="Describe the issue…"
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <span className="text-[13px] font-semibold text-foreground">Photo</span>
        <div className="flex gap-2.5">
          {form.photos.map((photo, index) => (
            <div
              key={photo.previewUrl}
              className="relative h-[72px] w-[72px] overflow-hidden rounded-md border border-border"
            >
              <img src={photo.previewUrl} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => form.removePhoto(index)}
                className="absolute -right-1.5 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-foreground"
              >
                <X className="h-2.5 w-2.5 text-background" />
              </button>
            </div>
          ))}
          {form.photos.length < form.maxPhotos && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-[72px] w-[72px] flex-col items-center justify-center gap-1 rounded-md border border-border text-muted-foreground"
            >
              <Camera className="h-5 w-5" />
              <span className="text-[10px]">Add</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) form.addPhotos(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {form.error && <p className="text-sm text-destructive">{form.error}</p>}

      <Button size="lg" className="w-full text-base" disabled={form.isSubmitting} onClick={form.submit}>
        {form.isSubmitting ? "Submitting…" : "Submit report"}
      </Button>
    </div>
  );
}
