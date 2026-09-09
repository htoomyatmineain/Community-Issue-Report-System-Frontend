import { House, Map, Settings, Siren, Trophy } from "lucide-react";
import MobileNav from "./MobileNav";
import CitizenTopBar from "./CitizenTopBar";
import { useLanguage } from "@/app/providers/LanguageProvider";

const CITIZEN_NAV_ITEMS = [
  { href: "/", label: "Home", icon: House, end: true },
  { href: "/map", label: "Map", icon: Map },
  { href: "/report", label: "Report", icon: Siren, isFab: true },
  { href: "/leaderboard", label: "Board", icon: Trophy },
  { href: "/settings", label: "Settings", icon: Settings },
];

/**
 * Mobile-first shell for the citizen app: page content + the bottom tab bar.
 * Content is capped to a phone-width column and centered so pages don't hug
 * the left edge on wider screens — individual pages no longer need their own
 * `mx-auto`.
 */
export default function CitizenShell({ children }) {
  const { t } = useLanguage();
  const localizedItems = CITIZEN_NAV_ITEMS.map((item) => ({ ...item, label: t(item.label) }));

  return (
    <div className="min-h-screen bg-surface-muted">
      <CitizenTopBar />
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background pb-20 pt-14 md:border-x md:border-border md:shadow-xl">
        {children}
      </div>
      <MobileNav items={localizedItems} />
    </div>
  );
}
