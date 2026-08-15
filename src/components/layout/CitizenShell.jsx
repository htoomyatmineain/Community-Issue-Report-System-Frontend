import { House, Map, Plus, Trophy, User } from "lucide-react";
import MobileNav from "./MobileNav";

const CITIZEN_NAV_ITEMS = [
  { href: "/", label: "Home", icon: House, end: true },
  { href: "/map", label: "Map", icon: Map },
  { href: "/report", label: "Report", icon: Plus, isFab: true },
  { href: "/leaderboard", label: "Board", icon: Trophy },
  { href: "/profile", label: "Me", icon: User },
];

/** Mobile-first shell for the citizen app: page content + the bottom tab bar. */
export default function CitizenShell({ children }) {
  return (
    <div className="min-h-screen bg-background pb-20">
      {children}
      <MobileNav items={CITIZEN_NAV_ITEMS} />
    </div>
  );
}
