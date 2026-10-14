import { useRef, useState } from "react";
import {
  AlertCircle,
  Camera,
  ChevronDown,
  LocateFixed,
  LocateOff,
  MapPin,
  Sparkles,
  VenetianMask,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import LocationPicker from "@/components/map/LocationPicker";
import { CATEGORY_PROBLEM_PRESETS } from "@/lib/constants";
import { useNewReportForm } from "../hooks/useNewReportForm";
import DuplicateCheckDialog from "./DuplicateCheckDialog";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { cn } from "@/lib/utils";

function RequiredIndicator() {
  return (
    <span className="ml-1 font-bold text-rose-500" aria-hidden="true">
      *
    </span>
  );
}

function StepBadge({ step }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white shadow-xs ring-2 ring-brand/20">
      {step}
    </span>
  );
}

export default function NewReportForm({ onSubmitted }) {
  const { t } = useLanguage();
  const fileInputRef = useRef(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const form = useNewReportForm({ onSubmitted });

  const selectedCategory = form.categories.find((c) => String(c.id) === form.category);
  const presets = CATEGORY_PROBLEM_PRESETS[selectedCategory?.icon] ?? [];

  function handleSubmit(e) {
    e?.preventDefault();
    setHasAttemptedSubmit(true);
    if (!form.canSubmit) {
      return;
    }
    form.submit();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* SECTION 1: INCIDENT LOCATION */}
      <section className="flex flex-col gap-3.5 rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <StepBadge step="1" />
            <h2 className="text-base font-semibold tracking-tight text-foreground flex items-center">
              {t("Incident Location")}
              <RequiredIndicator />
            </h2>
          </div>
          {form.geolocation.isWatching && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              {t("Live GPS")}
            </span>
          )}
        </div>

        <div
          className={cn(
            "overflow-hidden rounded-xl border transition-all shadow-xs",
            hasAttemptedSubmit && form.missing.location
              ? "border-destructive ring-2 ring-destructive/20"
              : "border-border/80"
          )}
        >
          <LocationPicker
            className="h-[230px] w-full"
            position={form.geolocation.position}
            follow={form.geolocation.isWatching}
            onStopFollow={form.geolocation.stopWatch}
            onChange={form.geolocation.setManualPosition}
          >
            {/* Floating button at the bottom right corner of the map */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "absolute bottom-2.5 right-2.5 z-[500] h-8 gap-1.5 rounded-xl border px-3 text-xs font-semibold shadow-md backdrop-blur-md transition-all active:scale-95",
                form.geolocation.isWatching
                  ? "border-emerald-500/40 bg-card/95 text-emerald-600 hover:bg-card hover:text-emerald-700 shadow-emerald-500/10"
                  : "border-border/80 bg-card/95 text-foreground hover:bg-card hover:text-brand shadow-black/10"
              )}
              onClick={form.geolocation.isWatching ? form.geolocation.stopWatch : form.geolocation.startWatch}
            >
              {form.geolocation.isWatching ? (
                <>
                  <LocateOff className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{t("Stop following")}</span>
                </>
              ) : (
                <>
                  <LocateFixed className="h-3.5 w-3.5 text-brand" />
                  <span>{form.geolocation.isLocating ? t("Locating…") : t("Use my location")}</span>
                </>
              )}
            </Button>
          </LocationPicker>
        </div>

        <p className="text-xs text-muted-foreground/80">
          {t("Drag the pin, or tap the map, to set the exact spot.")}
        </p>

        {form.geolocation.position && (
          <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-surface-muted/40 p-2.5 text-xs">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="font-semibold leading-snug text-foreground">
                {form.address?.line ??
                  (form.isResolvingAddress ? t("Finding address…") : t("Location selected"))}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {form.geolocation.position.latitude.toFixed(5)},{" "}
                {form.geolocation.position.longitude.toFixed(5)}
                {form.geolocation.accuracy != null &&
                  ` · ${t("accurate to ~{m} m", { m: Math.round(form.geolocation.accuracy) })}`}
              </span>
            </div>
          </div>
        )}

        {form.geolocation.error && (
          <span className="text-xs text-destructive">{form.geolocation.error}</span>
        )}

        {hasAttemptedSubmit && form.missing.location && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-destructive">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{t("Set a location on the map to continue.")}</span>
          </div>
        )}
      </section>

      {/* SECTION 2: ISSUE DETAILS */}
      <section className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2.5 pb-1.5 border-b border-border/40">
          <StepBadge step="2" />
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            {t("Issue Details")}
          </h2>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category-select" className="text-xs font-medium text-muted-foreground flex items-center">
            {t("Category")}
            <RequiredIndicator />
          </label>
          <div className="relative">
            <select
              id="category-select"
              value={form.category}
              onChange={(e) => form.setCategory(e.target.value)}
              disabled={form.isLoadingCategories}
              className={cn(
                "h-11 w-full appearance-none rounded-xl border bg-surface-muted/30 px-3.5 text-sm font-medium text-foreground transition-all focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                hasAttemptedSubmit && form.missing.category
                  ? "border-destructive ring-1 ring-destructive/30"
                  : "border-input/80 hover:border-border"
              )}
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
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
          </div>
          {hasAttemptedSubmit && form.missing.category && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-destructive">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{t("Choose a category to continue.")}</span>
            </div>
          )}
        </div>

        {/* What's wrong? */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="description-input" className="text-xs font-medium text-muted-foreground flex items-center">
            {t("What's wrong?")}
            <RequiredIndicator />
          </label>

          {presets.length > 0 && (
            <div className="flex flex-wrap gap-1.5 py-0.5">
              {presets.map((preset) => {
                const active = form.description.startsWith(preset);
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => !form.description && form.setDescription(`${preset} — `)}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs transition-all active:scale-95",
                      active
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "border border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
                    )}
                  >
                    {t(preset)}
                  </button>
                );
              })}
            </div>
          )}

          <textarea
            id="description-input"
            value={form.description}
            onChange={(e) => form.setDescription(e.target.value)}
            placeholder={t("Describe the issue…")}
            rows={3}
            className={cn(
              "w-full rounded-xl border bg-surface-muted/30 p-3 text-sm placeholder:text-muted-foreground/60 transition-all focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              hasAttemptedSubmit && form.missing.description
                ? "border-destructive ring-1 ring-destructive/30"
                : "border-input/80 hover:border-border"
            )}
          />
          {hasAttemptedSubmit && form.missing.description && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-destructive">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{t("Describe the issue to continue.")}</span>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: EVIDENCE PHOTOS */}
      <section className="flex flex-col gap-3.5 rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <StepBadge step="3" />
            <h2 className="text-base font-semibold tracking-tight text-foreground flex items-center">
              {t("Evidence Photos")}
              <RequiredIndicator />
            </h2>
          </div>
          <span className="rounded-full border border-border/50 bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {form.photos.length}/3
          </span>
        </div>

        <p className="text-xs font-medium text-muted-foreground">
          {t("Upload at least one Photo of the problem")}
        </p>

        {/* 3 dedicated photo spaces */}
        <div className="grid grid-cols-3 gap-2.5">
          {[0, 1, 2].map((index) => {
            const photo = form.photos[index];
            const isFirst = index === 0;
            const isSlotMissing = isFirst && hasAttemptedSubmit && form.missing.photo;

            if (photo) {
              return (
                <div
                  key={photo.previewUrl || index}
                  className="group relative aspect-square w-full overflow-hidden rounded-xl border border-border/80 bg-muted/30 shadow-xs"
                >
                  <img
                    src={photo.previewUrl}
                    alt={`Evidence ${index + 1}`}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                    #{index + 1}
                  </span>
                  <button
                    type="button"
                    aria-label={t("Remove photo")}
                    onClick={() => form.removePhoto(index)}
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-foreground/90 text-background shadow-md transition-transform hover:scale-110 active:scale-95"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            }

            return (
              <button
                key={index}
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "group relative flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed p-1.5 transition-all active:scale-[0.98]",
                  isSlotMissing
                    ? "border-destructive bg-destructive/5 text-destructive"
                    : "border-border/70 bg-surface-muted/20 text-muted-foreground hover:border-brand/50 hover:bg-brand/5 hover:text-brand"
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                    isSlotMissing
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted/70 text-muted-foreground group-hover:bg-brand/10 group-hover:text-brand"
                  )}
                >
                  <Camera className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-col items-center leading-tight">
                  <span className="text-[11px] font-medium text-foreground/80">
                    {t(index === 0 ? "Photo 1" : index === 1 ? "Photo 2" : "Photo 3")}
                    {isFirst && <RequiredIndicator />}
                  </span>
                  <span className="text-[10px] text-muted-foreground/75">
                    {isFirst ? t("Required") : t("Optional")}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

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

        {hasAttemptedSubmit && form.missing.photo && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-destructive">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{t("Upload at least one Photo of the problem")}</span>
          </div>
        )}

        <div className="flex items-start gap-2 rounded-xl border border-brand/15 bg-brand/5 px-3 py-2 text-xs text-brand">
          <Sparkles className="mt-0.5 size-3.5 shrink-0 text-brand" />
          <span className="text-[11px] leading-relaxed">
            {t(
              "Tip: Sharp, clear photos enable Kinn Htout's AI engine to auto-approve and dispatch repair crews instantly."
            )}
          </span>
        </div>
      </section>

      {/* SECTION 4: PRIVACY & SUBMISSION */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-card p-3.5 sm:p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <VenetianMask className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-foreground">
                {t("Submit anonymously")}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {t("Hide name on public feed")}
              </span>
            </div>
          </div>
          <Switch
            checked={form.isAnonymous}
            onCheckedChange={form.setIsAnonymous}
            aria-label={t("Submit anonymously")}
            className="shrink-0"
          />
        </div>

        {form.error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium text-destructive">
            {form.error}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={form.isSubmitting}
          className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98]"
        >
          {form.isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {t("Submitting…")}
            </span>
          ) : (
            t("Submit report")
          )}
        </Button>

        {hasAttemptedSubmit && !form.canSubmit && (
          <p className="text-center text-xs font-medium text-destructive">
            {t("Please complete all required fields marked with *")}
          </p>
        )}
      </section>

      <DuplicateCheckDialog
        open={Boolean(form.possibleDuplicates)}
        onOpenChange={(open) => !open && form.dismissDuplicates()}
        duplicates={form.possibleDuplicates}
        isSubmitting={form.isSubmitting}
        onConfirm={form.confirmDuplicate}
        onSubmitAnyway={form.submitAnyway}
      />
    </form>
  );
}
