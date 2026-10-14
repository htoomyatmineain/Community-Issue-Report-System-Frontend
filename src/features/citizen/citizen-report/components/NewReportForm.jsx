import { useRef } from "react";
import { Camera, ChevronDown, LocateFixed, LocateOff, VenetianMask, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import LocationPicker from "@/components/map/LocationPicker";
import { CATEGORY_PROBLEM_PRESETS } from "@/lib/constants";
import { useNewReportForm } from "../hooks/useNewReportForm";
import DuplicateCheckDialog from "./DuplicateCheckDialog";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function NewReportForm({ onSubmitted }) {
  const { t } = useLanguage();
  const fileInputRef = useRef(null);
  const form = useNewReportForm({ onSubmitted });

  const selectedCategory = form.categories.find((c) => String(c.id) === form.category);
  const presets = CATEGORY_PROBLEM_PRESETS[selectedCategory?.icon] ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        <span className="text-[14px] font-semibold tracking-tight text-foreground">{t("Location")} *</span>
        <div className="overflow-hidden rounded-2xl border border-border/80 shadow-xs">
          <LocationPicker
            className="h-[260px] w-full"
            position={form.geolocation.position}
            follow={form.geolocation.isWatching}
            onStopFollow={form.geolocation.stopWatch}
            onChange={form.geolocation.setManualPosition}
          />
        </div>
        <span className="text-xs text-muted-foreground">{t("Drag the pin, or tap the map, to set the exact spot.")}</span>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full gap-2 rounded-xl text-sm font-semibold active:scale-[0.99]"
          onClick={form.geolocation.isWatching ? form.geolocation.stopWatch : form.geolocation.startWatch}
        >
          {form.geolocation.isWatching ? (
            <>
              <LocateOff className="h-4 w-4" />
              {t("Stop following my location")}
            </>
          ) : (
            <>
              <LocateFixed className="h-4 w-4" />
              {form.geolocation.isLocating ? t("Locating…") : t("Use my location")}
            </>
          )}
        </Button>
        {form.geolocation.isWatching && (
          <span className="text-xs text-muted-foreground">
            {form.geolocation.isLocating
              ? t("Finding your location…")
              : t("Following your live location. Drag the pin to set it manually.")}
          </span>
        )}
        {form.geolocation.position && (form.address?.line || form.isResolvingAddress) && (
          <span className="text-[13px] font-medium leading-snug text-foreground">
            {form.address?.line ?? `${t("Finding address…")}`}
          </span>
        )}
        {form.geolocation.position && (
          <span className="text-xs text-muted-foreground">
            {form.geolocation.position.latitude.toFixed(5)},{" "}
            {form.geolocation.position.longitude.toFixed(5)}
            {form.geolocation.accuracy != null &&
              ` · ${t("accurate to ~{m} m", { m: Math.round(form.geolocation.accuracy) })}`}
          </span>
        )}
        {form.geolocation.error && (
          <span className="text-xs text-destructive">{form.geolocation.error}</span>
        )}
        {form.missing.location && (
          <span className="text-xs font-medium text-destructive">
            {t("Set a location on the map to continue.")}
          </span>
        )}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[14px] font-semibold tracking-tight text-foreground">{t("Category")} *</span>
        <div className="relative">
          <select
            value={form.category}
            onChange={(e) => form.setCategory(e.target.value)}
            disabled={form.isLoadingCategories}
            className="h-12 w-full appearance-none rounded-xl border border-input bg-surface-muted/60 px-3.5 text-sm font-medium text-foreground transition-colors focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="" disabled>
              {form.isLoadingCategories ? t("Loading categories…") : t("Select an option")}
            </option>
            {form.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        {form.missing.category && (
          <span className="text-xs font-medium text-destructive">
            {t("Choose a category to continue.")}
          </span>
        )}
      </label>

      <div className="flex flex-col gap-2.5">
        <span className="text-[14px] font-semibold tracking-tight text-foreground">{t("What's wrong? *")}</span>
        {presets.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => {
              const active = form.description.startsWith(preset);
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => !form.description && form.setDescription(`${preset} — `)}
                  className={
                    active
                      ? "rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-transform active:scale-95"
                      : "rounded-xl border border-border bg-surface-muted/60 px-3.5 py-2 text-xs font-medium text-foreground transition-all hover:bg-muted active:scale-95"
                  }
                >
                  {t(preset)}
                </button>
              );
            })}
          </div>
        )}
        <textarea
          value={form.description}
          onChange={(e) => form.setDescription(e.target.value)}
          placeholder={t("Describe the issue…")}
          rows={3}
          className="w-full rounded-xl border border-input bg-surface-muted/60 p-3 text-sm placeholder:text-muted-foreground transition-colors focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {form.missing.description && (
          <span className="text-xs font-medium text-destructive">
            {t("Describe the issue to continue.")}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        <span className="text-[14px] font-semibold tracking-tight text-foreground">{t("Photo")} *</span>
        <div className="flex flex-wrap gap-3">
          {form.photos.map((photo, index) => (
            <div
              key={photo.previewUrl}
              className="relative h-20 w-20 overflow-hidden rounded-xl border border-border shadow-xs"
            >
              <img src={photo.previewUrl} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                aria-label={t("Remove photo")}
                onClick={() => form.removePhoto(index)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground/90 text-background shadow-xs active:scale-90"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {form.photos.length < form.maxPhotos && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border/80 bg-surface-muted/40 text-muted-foreground transition-all hover:border-brand/60 hover:text-brand active:scale-95"
            >
              <Camera className="h-5 w-5" />
              <span className="text-[11px] font-medium">{t("Add")}</span>
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
        {form.missing.photo && (
          <span className="text-xs font-medium text-destructive">
            {t("Add at least one photo to continue.")}
          </span>
        )}
        <div className="flex items-center gap-2 rounded-xl bg-brand/5 border border-brand/15 px-3 py-2 text-xs text-brand">
          <Sparkles className="size-3.5 shrink-0 text-brand" />
          <span>
            {t("Tip: Sharp, clear photos enable Kinn Htout's AI engine to auto-approve and dispatch repair crews instantly.")}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-3.5 rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
        <VenetianMask className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-[14px] font-semibold tracking-tight text-foreground">{t("Submit anonymously")}</span>
          <span className="text-xs text-muted-foreground">
            {t("Your name is hidden on the public feed. Admins can still see who reported, for accountability.")}
          </span>
        </div>
        <Switch
          checked={form.isAnonymous}
          onCheckedChange={form.setIsAnonymous}
          aria-label={t("Submit anonymously")}
        />
      </div>

      {form.error && <p className="text-sm text-destructive">{form.error}</p>}

      <Button
        size="lg"
        className="h-12 w-full rounded-xl text-base font-semibold shadow-md active:scale-[0.98]"
        disabled={form.isSubmitting || !form.canSubmit}
        onClick={form.submit}
      >
        {form.isSubmitting ? t("Submitting…") : t("Submit report")}
      </Button>

      <DuplicateCheckDialog
        open={Boolean(form.possibleDuplicates)}
        onOpenChange={(open) => !open && form.dismissDuplicates()}
        duplicates={form.possibleDuplicates}
        isSubmitting={form.isSubmitting}
        onConfirm={form.confirmDuplicate}
        onSubmitAnyway={form.submitAnyway}
      />
    </div>
  );
}
