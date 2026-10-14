"use client";
import { LoaderCircle } from "lucide-react";
import { Toaster as Sonner } from "sonner";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import { ROLES } from "@/lib/rbac";

/**
 * Modern notification toast cards matching design spec:
 * Neutral elevated cards (solid white in light mode, deep dark in dark mode)
 * with dedicated status icon badges on the left (solid Info, Success, Warning, Error),
 * clear title + muted description hierarchy, and a clean minimalist close button.
 */
const Toaster = ({
  ...props
}) => {
  const { theme = "light" } = useTheme()
  const { role } = useAuth()
  // The citizen shell is a phone-width column, so its toasts drop in from the
  // top-centre as a pop-up rather than hiding in the far bottom-right corner.
  // The Admin/Staff console is a desktop layout, so its toasts behave like a
  // normal desktop app's and surface from the bottom-right instead.
  const isConsole = role === ROLES.ADMIN || role === ROLES.STAFF

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position={isConsole ? "bottom-right" : "top-center"}
      // Clears the fixed 56px top bar on the citizen shell; the console has no
      // such bar, so the bottom-right position needs no offset.
      offset={isConsole ? undefined : { top: "72px" }}
      mobileOffset={isConsole ? undefined : { top: "72px" }}
      closeButton
      icons={{
        info: (
          <svg className="size-5 shrink-0" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" className="fill-zinc-900 dark:fill-zinc-600" />
            <path
              d="M10 5.25a1 1 0 100 2 1 1 0 000-2zm-.75 3.5a.75.75 0 011.5 0v5.5a.75.75 0 01-1.5 0v-5.5z"
              fill="white"
            />
          </svg>
        ),
        success: (
          <svg className="size-5 shrink-0" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" className="fill-[#22C55E]" />
            <path
              d="M14.5 7L8.5 13L5.5 10"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        warning: (
          <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="none">
            <path
              d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              className="fill-[#F59E0B]"
            />
            <line x1="12" y1="9" x2="12" y2="13.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="12" cy="17" r="1.15" fill="white" />
          </svg>
        ),
        error: (
          <svg className="size-5 shrink-0" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" className="fill-[#EF4444]" />
            <path
              d="M7 7L13 13M13 7L7 13"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
        loading: <LoaderCircle className="size-5 shrink-0 animate-spin text-zinc-500 dark:text-zinc-400" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast flex w-full items-start gap-3 rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:border-white/[0.08] dark:bg-[#1E1E1E] dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)]",
          title: "text-[13px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight",
          description: "text-xs text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed mt-0.5",
          icon: "shrink-0 mt-0.5",
          closeButton:
            "group-[.toast]:border-none group-[.toast]:bg-transparent group-[.toast]:text-zinc-400 hover:group-[.toast]:text-zinc-700 dark:group-[.toast]:text-zinc-500 dark:hover:group-[.toast]:text-zinc-200 group-[.toast]:top-3.5 group-[.toast]:right-3.5 group-[.toast]:p-1 group-[.toast]:transition-colors",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props} />
  );
}

export { Toaster }
