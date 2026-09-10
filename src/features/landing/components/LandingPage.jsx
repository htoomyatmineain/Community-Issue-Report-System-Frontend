import { Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  Building2,
  Camera,
  Construction,
  Droplets,
  Languages,
  ListChecks,
  MapPin,
  Route as RouteIcon,
  Send,
  Trash2,
  Trees,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useAuth } from "@/app/providers/AuthProvider";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { ROLE_HOME_PATH } from "@/lib/rbac";

const STEPS = [
  {
    icon: MapPin,
    title: "Report it",
    body: "Drop a pin on the map, pick a category, add a photo and a short description of what's wrong.",
  },
  {
    icon: RouteIcon,
    title: "We route it",
    body: "Your report is auto-assigned to the right department, with an admin reviewing every step.",
  },
  {
    icon: ListChecks,
    title: "Track to resolved",
    body: "Get notified as staff assign, work on and close your report — completion photos included.",
  },
];

const FEATURES = [
  {
    icon: MapPin,
    title: "Live community map",
    body: "Every approved report as a map pin, filterable by category and status.",
  },
  {
    icon: Send,
    title: "Status tracking",
    body: "Follow each report through Assigned, In Progress and Resolved.",
  },
  {
    icon: Bell,
    title: "Notifications",
    body: "Know the moment something changes on a report you filed.",
  },
  {
    icon: Trophy,
    title: "Score & leaderboard",
    body: "Earn points for verified reports and climb your community leaderboard.",
  },
  {
    icon: Camera,
    title: "Photo evidence",
    body: "Attach photos when you report; see completion photos when it's fixed.",
  },
  {
    icon: Languages,
    title: "English & Myanmar",
    body: "Full English and မြန်မာ support across every screen.",
  },
];

const CATEGORIES = [
  { icon: Zap, label: "Electricity" },
  { icon: Construction, label: "Roads" },
  { icon: Droplets, label: "Water" },
  { icon: Trash2, label: "Sanitation" },
  { icon: Trees, label: "Parks" },
  { icon: Building2, label: "Buildings" },
];

export default function LandingPage() {
  const { t } = useLanguage();
  const { isAuthenticated, isInitializing, role } = useAuth();

  // A signed-in user has no use for the marketing page — send them to their shell.
  if (isInitializing) return null;
  if (isAuthenticated) return <Navigate to={ROLE_HOME_PATH[role] ?? "/home"} replace />;

  const year = new Date().getFullYear();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-100 text-foreground dark:from-[#0f0f0f] dark:via-[#141414] dark:to-[#171717]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#237FEA]/30 blur-3xl dark:bg-[#237FEA]/20" />
        <div className="absolute -right-16 top-1/3 h-[28rem] w-[28rem] rounded-full bg-blue-400/25 blur-3xl dark:bg-[#237FEA]/10" />
      </div>

      {/* Fixed header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link to="/" className="flex items-center">
            <img
              src="/assets/Kinn Htout Logo.png"
              alt="Kinn Htout"
              className="h-11 w-auto object-contain sm:h-12"
            />
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <a href="#how-it-works" className="transition-colors hover:text-foreground">
              {t("How it works")}
            </a>
            <a href="#features" className="transition-colors hover:text-foreground">
              {t("Features")}
            </a>
            <a href="#for-you" className="transition-colors hover:text-foreground">
              {t("Who it's for")}
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher size="sm" align="end" />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/login">{t("Log in")}</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full">
              <Link to="/signup">{t("Get started")}</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-10 pt-[76px] sm:pt-20">

        {/* Hero */}
        <section className="mx-auto w-full max-w-6xl px-5 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur">
              <span className="size-1.5 rounded-full bg-primary" />
              {t("An intelligent civic response and issue management system")}
            </span>

            <h1 className="mt-6 font-display text-[34px] font-bold leading-[1.15] tracking-tight text-foreground sm:text-[52px]">
              {t("Report civic issues. Track every fix.")}
            </h1>

            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {t(
                "Kinn Htout gives your neighbourhood one place to report potholes, broken streetlights, overflowing bins and blocked drains — then follow each report from submitted to resolved."
              )}
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg" className="w-full rounded-full text-base sm:w-auto sm:px-8">
                <Link to="/signup">
                  {t("Get started")}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full rounded-full text-base sm:w-auto sm:px-8"
              >
                <Link to="/login">{t("I already have an account")}</Link>
              </Button>
            </div>

            <p className="mt-5 text-xs text-muted-foreground">
              {t("Free for citizens · Aligned with UN SDG 11 — Sustainable Cities and Communities")}
            </p>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-y border-border bg-background/60 backdrop-blur">
          <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                {t("How it works")}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                {t("Three steps from a problem on your street to an accountable, tracked fix.")}
              </p>
            </div>

            <ol className="mt-10 grid gap-6 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <step.icon className="size-5" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("Step")} {i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{t(step.title)}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{t(step.body)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              {t("Everything you need to follow a report")}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              {t("Built for citizens on mobile and for the authorities resolving issues on desktop.")}
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="text-base font-semibold text-foreground">{t(feature.title)}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(feature.body)}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("Report categories")}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {CATEGORIES.map((cat) => (
                <li
                  key={cat.label}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-2 text-sm font-medium text-foreground"
                >
                  <cat.icon className="size-4 text-primary" />
                  {t(cat.label)}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Who it's for */}
        <section id="for-you" className="border-y border-border bg-background/60 backdrop-blur">
          <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-14 sm:px-8 sm:py-20 md:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-7">
              <h3 className="text-lg font-semibold text-foreground">{t("For citizens")}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(
                  "Sign up in a minute with your name, contact and NRC number. Your account activates once an admin approves it — then you can report, track and earn points."
                )}
              </p>
              <Button asChild className="mt-1 w-fit rounded-full">
                <Link to="/signup">
                  {t("Create your account")}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-7">
              <h3 className="text-lg font-semibold text-foreground">
                {t("For government staff & admins")}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(
                  "Staff and admin accounts are provisioned by your administrator — there is no public sign-up. Already have one? Just log in."
                )}
              </p>
              <Button asChild variant="outline" className="mt-1 w-fit rounded-full">
                <Link to="/login">{t("Log in")}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl border border-border px-6 py-14 text-center sm:px-12 sm:py-20">
            <img
              src="/assets/landing/bg-00.jpg"
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Dark layer for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/80" />

            <div className="relative flex flex-col items-center gap-6">
              <h2 className="max-w-lg font-display text-2xl font-bold text-white sm:text-3xl">
                {t("Ready to make your community better?")}
              </h2>
              <p className="max-w-md text-sm text-white/80 sm:text-base">
                {t("Join Kinn Htout and turn everyday problems into tracked, accountable action.")}
              </p>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button asChild size="lg" className="w-full rounded-full text-base sm:w-auto sm:px-8">
                  <Link to="/signup">{t("Get started")}</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="w-full rounded-full border border-white/30 bg-white/10 text-base text-white backdrop-blur hover:bg-white/20 hover:text-white sm:w-auto sm:px-8"
                >
                  <Link to="/login">{t("Log in")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <img
                src="/assets/Kinn Htout Logo.png"
                alt="Kinn Htout"
                className="h-10 w-auto self-start object-contain"
              />
              <p className="text-xs leading-relaxed text-muted-foreground">
                {t(
                  "A CST-4105 J2EE Keystone Project — University of Information Technology, 2025–2026. Section-C, Group-II."
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("© {year} Kinn Htout. Aligned with UN SDG 11.", { year })}
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm font-medium">
              <Link to="/login" className="text-muted-foreground transition-colors hover:text-foreground">
                {t("Log in")}
              </Link>
              <Link to="/signup" className="font-semibold text-primary">
                {t("Create account")}
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
