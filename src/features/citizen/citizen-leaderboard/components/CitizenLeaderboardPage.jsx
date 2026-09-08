import { Link } from "react-router-dom";
import { Award } from "lucide-react";
import Avatar from "@/components/common/Avatar";
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
        <div className="flex flex-col gap-4">
          {data.you && (
            <Link
              to="/score"
              className="flex items-center justify-between rounded-lg bg-primary p-6 text-primary-foreground"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs text-cyan-100">{t("Your score")}</span>
                <span className="font-display text-[26px] font-bold leading-none">
                  {data.you.points.toLocaleString()} pts
                </span>
                <span className="text-[11px] text-cyan-100">
                  Ranked #{data.you.rank} on the leaderboard
                </span>
              </div>
              <Award className="h-9 w-9 shrink-0 text-white" />
            </Link>
          )}

          <ul>
            {data.ranked.map((entry) => (
              <li
                key={entry.rank}
                className="flex items-center gap-3 border-b border-border py-3 last:border-0"
              >
                <span className="w-4 font-display text-sm font-bold text-muted-foreground">
                  {entry.rank}
                </span>
                <Avatar name={entry.name} />
                <span className="flex-1 text-[13px] font-semibold text-foreground">
                  {entry.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {entry.points.toLocaleString()} pts
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
