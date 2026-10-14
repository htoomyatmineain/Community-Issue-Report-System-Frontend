import { Link } from "react-router-dom";
import { Medal } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import { cn } from "@/lib/utils";
import { useCitizenLeaderboard } from "../hooks/useCitizenLeaderboard";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function CitizenLeaderboardPage() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useCitizenLeaderboard();

  return (
    <div className="flex w-full max-w-md flex-col px-5 pb-8 pt-4">
      {isLoading ? (
        <p className="py-6 text-sm text-muted-foreground">{t("Loading…")}</p>
      ) : error ? (
        <p className="py-6 text-sm text-destructive">{error}</p>
      ) : (
        <div className="flex flex-col gap-6">
          {data.you && (
            <Link
              to="/score"
              className="group relative flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-brand-hover p-5 text-white shadow-lg shadow-brand/25 transition-all duration-150 active:scale-[0.98]"
            >
              <div className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-white/80">
                  <Medal className="size-3.5 text-amber-300" />
                  {t("Your score")}
                </span>
                <span className="font-display text-3xl font-bold tracking-tight text-white">
                  {data.you.points.toLocaleString()} <span className="text-base font-medium text-white/80">pts</span>
                </span>
                <span className="inline-flex w-fit items-center rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  Ranked #{data.you.rank} on the leaderboard
                </span>
              </div>
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/20 transition-transform duration-200 group-hover:scale-105">
                <Medal className="size-6 text-amber-300" />
              </div>
            </Link>
          )}

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">{t("Community Rankings")}</h2>

            <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
              <ul className="divide-y divide-border/60">
                {data.ranked.map((entry) => {
                  const isTop1 = entry.rank === 1;
                  const isTop2 = entry.rank === 2;
                  const isTop3 = entry.rank === 3;

                  return (
                    <li
                      key={entry.rank}
                      className="flex items-center gap-3.5 p-3.5 transition-colors hover:bg-muted/40 active:bg-muted/70"
                    >
                      <div
                        className={cn(
                          "flex size-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold",
                          isTop1
                            ? "border border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            : isTop2
                              ? "border border-slate-400/30 bg-slate-400/15 text-slate-600 dark:text-slate-300"
                              : isTop3
                                ? "border border-orange-700/30 bg-orange-700/15 text-orange-700 dark:text-orange-400"
                                : "text-muted-foreground"
                        )}
                      >
                        {entry.rank}
                      </div>
                      <Avatar name={entry.name} className="size-8" />
                      <span className="min-w-0 flex-1 truncate text-[14px] font-semibold tracking-tight text-foreground">
                        {entry.name}
                      </span>
                      <span className="shrink-0 font-mono text-xs font-semibold tabular-nums text-muted-foreground">
                        {entry.points.toLocaleString()} pts
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
