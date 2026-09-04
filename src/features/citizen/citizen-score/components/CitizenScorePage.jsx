import { ChevronLeft, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import { POINT_REASON } from "@/lib/constants";
import { useCitizenScore } from "../hooks/useCitizenScore";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

export default function CitizenScorePage() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useCitizenScore();

  return (
    <div className="flex w-full max-w-md flex-col">
      <header className="flex items-center gap-3 px-5 pb-2 pt-4">
        <button type="button" aria-label="Back" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="font-display text-base font-bold text-foreground">My score</h1>
      </header>

      <div className="flex flex-col gap-5 px-5 pb-8 pt-2">
        {isLoading ? (
          <p className="py-6 text-sm text-muted-foreground">Loading…</p>
        ) : error ? (
          <p className="py-6 text-sm text-destructive">{error}</p>
        ) : (
          <>
            <section className="flex items-center justify-between rounded-lg bg-primary p-6 text-primary-foreground">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-blue-100">Total points</span>
                <span className="font-display text-[26px] font-bold leading-none">
                  {(data?.totalPoints ?? 0).toLocaleString()} pts
                </span>
              </div>
              <Award className="h-9 w-9 shrink-0 text-white" />
            </section>

            <section className="flex flex-col gap-2.5">
              <h2 className="text-sm font-semibold text-foreground">Point history</h2>

              {!data?.history?.length ? (
                <EmptyState
                  title="No points yet"
                  description="You'll earn points when your reports are approved, resolved, or you leave feedback."
                />
              ) : (
                <ul>
                  {data.history.map((entry) => (
                    <li
                      key={entry.id}
                      className="flex items-center justify-between gap-3 border-b border-border py-3 last:border-0"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[13px] font-semibold text-foreground">
                          {POINT_REASON[entry.reason]?.label ?? entry.reason}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{formatDate(entry.createdAt)}</span>
                      </div>
                      <span
                        className={
                          "font-display text-sm font-bold " +
                          (entry.points >= 0 ? "text-green-700" : "text-destructive")
                        }
                      >
                        {entry.points >= 0 ? "+" : ""}
                        {entry.points}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
