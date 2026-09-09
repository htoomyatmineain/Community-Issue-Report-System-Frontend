import { cn } from "@/lib/utils";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useLanguage } from "@/app/providers/LanguageProvider";

/**
 * Shared split-screen shell for the public auth pages (ref: ref-img/Login,Signup/login-01.jpg).
 * The whole page sits on one soft cyan/blue blob gradient; the left side carries
 * the brand tagline directly on it (hidden below md — not the primary content
 * citizens need on a phone), and the form sits on the right in a bordered,
 * transparent card.
 *
 * The left panel is `fixed` (viewport-anchored), not a grid sibling of the
 * form — login and signup have different content heights, and a shared-row
 * grid would stretch to the taller one and drag `justify-end` down with it.
 * Fixed positioning keeps it pinned in the same spot on every auth page.
 */
export default function AuthLayout({ headline, description, children, className }) {
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        "relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-100 dark:from-[#0f0f0f] dark:via-[#141414] dark:to-[#171717]",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#237FEA]/30 blur-3xl dark:bg-[#237FEA]/20" />
        <div className="absolute -bottom-28 -right-16 h-[28rem] w-[28rem] rounded-full bg-blue-400/30 blur-3xl dark:bg-[#237FEA]/10" />
      </div>

      {/* Pinned top-left (viewport-fixed), left edge aligned with the brand
          panel's logo / headline — stays put while the form scrolls. */}
      <div className="fixed left-10 top-8 z-30 lg:left-16">
        <LanguageSwitcher size="sm" align="start" />
      </div>

      <div className="fixed inset-y-0 left-0 z-10 hidden w-1/2 flex-col justify-end p-10 pb-24 md:flex lg:p-16 lg:pb-36">
        <div className="flex flex-col items-start gap-6">
          <img
            src="/assets/Kinn Htout Logo.png"
            alt="Kinn Htout"
            className="h-16 w-auto object-contain lg:h-20"
          />

          <div className="flex flex-col gap-3">
            <h2 className="font-display text-[32px] font-medium leading-snug text-foreground lg:text-[36px]">
              {t(headline)}
            </h2>
            {description && (
              <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">{t(description)}</p>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6 py-10 sm:px-10 sm:py-12 md:ml-[50%] md:w-1/2">
        <div className="w-full max-w-md rounded-3xl border border-border p-8 sm:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
