import { Pin } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import NotificationBell from "@/components/common/NotificationBell";
import { useCitizenLeaderboard } from "../hooks/useCitizenLeaderboard";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function CitizenLeaderboardPage() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useCitizenLeaderboard();

  return (
    <div className="flex w-full max-w-md flex-col px-5 pb-8 pt-4">
      <header className="flex items-center justify-between pb-4">
        <h1 className="font-display text-lg font-bold text-foreground">{t("Leaderboard")}</h1>
        <NotificationBell />
      </header>

      {isLoading ? (
        <p className="py-6 text-sm text-muted-foreground">{t("Loading…")}</p>
      ) : error ? (
        <p className="py-6 text-sm text-destructive">{error}</p>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-primary bg-blue-100 p-3.5">
            <span className="font-display text-base font-bold text-primary">#{data.you.rank}</span>
            <Avatar name={data.you.name} />
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-[13px] font-bold text-foreground">You ({data.you.name})</span>
              <span className="text-[11px] text-muted-foreground">
                {data.you.points.toLocaleString()} pts
              </span>
            </div>
            <Pin className="h-4 w-4 text-primary" />
          </div>

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
