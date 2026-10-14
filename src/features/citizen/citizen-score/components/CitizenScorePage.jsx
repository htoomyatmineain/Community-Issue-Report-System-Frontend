import { Medal } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import { POINT_REASON } from "@/lib/constants";
import { useCitizenScore } from "../hooks/useCitizenScore";
import { useLanguage } from "@/app/providers/LanguageProvider";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

export default function CitizenScorePage() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useCitizenScore();

  return (
    <div className="flex w-full max-w-md flex-col">
      <div className="flex flex-col gap-6 px-5 pb-8 pt-4">
        {isLoading ? (
          <p className="py-6 text-sm text-muted-foreground">{t("Loading…")}</p>
        ) : error ? (
          <p className="py-6 text-sm text-destructive">{error}</p>
        ) : (
          <>
            <section className="relative flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-brand-hover p-5 text-white shadow-lg shadow-brand/25">
              <div className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-white/80">
                  <Medal className="size-3.5 text-amber-300" />
                  {t("Total points")}
                </span>
                <span className="font-display text-3xl font-bold tracking-tight text-white">
                  {(data?.totalPoints ?? 0).toLocaleString()} <span className="text-base font-medium text-white/80">pts</span>
                </span>
                <span className="inline-flex w-fit items-center rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  {t("Verified civic score")}
                </span>
              </div>
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
                <Medal className="size-6 text-amber-300" />
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">{t("Point history")}</h2>

              {!data?.history?.length ? (
                <EmptyState
                  title={t("No points yet")}
                  description={t("You'll earn points when your reports are approved, resolved, or you leave feedback.")}
                />
              ) : (
                <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
                  <ul className="divide-y divide-border/60">
                    {data.history.map((entry) => (
                      <li
                        key={entry.id}
                        className="flex items-center justify-between gap-3 p-3.5 transition-colors hover:bg-muted/40"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[14px] font-semibold tracking-tight text-foreground">
                            {POINT_REASON[entry.reason]?.label ?? entry.reason}
                          </span>
                          <span className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</span>
                        </div>
                        <span
                          className={
                            "font-mono text-sm font-semibold tabular-nums " +
                            (entry.points >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive")
                          }
                        >
                          {entry.points >= 0 ? "+" : ""}
                          {entry.points}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
