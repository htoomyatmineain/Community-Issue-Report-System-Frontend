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

/**
 * Colored, icon-led toast cards (ref: ref-img/citizen/noti-00.jpg) — each
 * type gets its own tinted background using the same status color tokens
 * as StatusBadge, so toasts and status pills read as one system.
 */
const Toaster = ({
  ...props
}) => {
  const { theme = "light" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
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
          success: "group-[.toaster]:bg-status-resolved-bg group-[.toaster]:text-status-resolved",
          info: "group-[.toaster]:bg-status-assigned-bg group-[.toaster]:text-status-assigned",
          warning: "group-[.toaster]:bg-status-pending-bg group-[.toaster]:text-status-pending",
          error: "group-[.toaster]:bg-status-rejected-bg group-[.toaster]:text-status-rejected",
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
