import { House, Map, Plus, Trophy, User } from "lucide-react";
import MobileNav from "./MobileNav";

const CITIZEN_NAV_ITEMS = [
  { href: "/", label: "Home", icon: House, end: true },
  { href: "/map", label: "Map", icon: Map },
  { href: "/report", label: "Report", icon: Plus, isFab: true },
  { href: "/leaderboard", label: "Board", icon: Trophy },
  { href: "/profile", label: "Me", icon: User },
];

/**
 * Mobile-first shell for the citizen app: page content + the bottom tab bar.
 * Content is capped to a phone-width column and centered so pages don't hug
 * the left edge on wider screens — individual pages no longer need their own
 * `mx-auto`.
 */
export default function CitizenShell({ children }) {
  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background pb-20 md:border-x md:border-border md:shadow-xl">
        {children}
      </div>
      <MobileNav items={CITIZEN_NAV_ITEMS} />
    </div>
  );
}
