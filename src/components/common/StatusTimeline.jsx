import { useLanguage } from "@/app/providers/LanguageProvider";

const formatDateTime = (iso) =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

/** Vertical dot-and-line status stepper, matching the Report Detail design. */
export default function StatusTimeline({ steps }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col">
      <h2 className="mb-3 font-display text-sm font-bold text-foreground">{t("Status timeline")}</h2>
      <ol>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const label = t(step.labelKey ?? step.label) + (step.remarks ? ` — ${step.remarks}` : "");
          return (
            <li key={`${step.labelKey ?? step.label}-${step.at}`} className="flex gap-3">
              <div className="flex w-5 flex-col items-center">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                {!isLast && <span className="w-0.5 flex-1 bg-primary" />}
              </div>
              <div className={isLast ? "flex flex-col gap-0.5" : "flex flex-col gap-0.5 pb-5"}>
                <span className="text-[13px] font-semibold text-foreground">{label}</span>
                <span className="text-[11px] text-muted-foreground">{formatDateTime(step.at)}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
