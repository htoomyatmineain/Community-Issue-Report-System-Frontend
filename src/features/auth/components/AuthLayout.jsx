import { Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useLanguage } from "@/app/providers/LanguageProvider";

/**
 * Shared split-screen shell for the public auth pages (ref: ref-img/Login,Signup/login-00.jpg).
 * Left panel is decorative branding, hidden below md since it's not the primary
 * content citizens need on a phone.
 */
export default function AuthLayout({ eyebrow, headline, children, className }) {
  const { t } = useLanguage();

  return (
    <div className={cn("relative grid min-h-screen w-full grid-cols-1 bg-card md:grid-cols-2", className)}>
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <LanguageSwitcher />
      </div>
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-10 md:flex lg:p-16">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-sky-400/60 blur-3xl" />
          <div className="absolute -bottom-20 -right-12 h-80 w-80 rounded-full bg-fuchsia-400/40 blur-3xl" />
        </div>

        <Landmark className="relative z-10 h-8 w-8 text-white" />

        <div className="relative z-10 flex flex-col gap-2">
          <span className="text-[13px] font-medium text-white/70">{t(eyebrow)}</span>
          <h2 className="font-display text-[28px] font-bold leading-snug text-white">{t(headline)}</h2>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
