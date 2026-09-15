"use client";
import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react"
import { Toaster as Sonner } from "sonner"
import { useTheme } from "@/app/providers/ThemeProvider"
import { useAuth } from "@/app/providers/AuthProvider"
import { ROLES } from "@/lib/rbac"

/**
 * Colored, icon-led toast cards (ref: ref-img/citizen/noti-00.jpg,
 * ref-img/noti card UI/noti-00.jpg) — each type gets its own tinted
 * background using the same status color tokens as StatusBadge, so toasts
 * and status pills read as one system.
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
        success: <CircleCheck className="h-5 w-5" />,
        info: <Info className="h-5 w-5" />,
        warning: <TriangleAlert className="h-5 w-5" />,
        error: <OctagonX className="h-5 w-5" />,
        loading: <LoaderCircle className="h-5 w-5 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast gap-3 rounded-2xl border-none py-3.5 shadow-lg group-[.toaster]:bg-background group-[.toaster]:text-foreground",
          title: "font-semibold",
          description: "group-[.toast]:text-current group-[.toast]:opacity-80",
          icon: "group-[.toast]:opacity-100",
          closeButton:
            "group-[.toast]:border-none group-[.toast]:bg-transparent group-[.toast]:text-current group-[.toast]:opacity-60 hover:group-[.toast]:opacity-100",
          success: "group-[.toaster]:bg-toast-success-bg group-[.toaster]:text-status-resolved",
          info: "group-[.toaster]:bg-toast-info-bg group-[.toaster]:text-status-assigned",
          warning: "group-[.toaster]:bg-toast-warning-bg group-[.toaster]:text-status-pending",
          error: "group-[.toaster]:bg-toast-error-bg group-[.toaster]:text-status-rejected",
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
