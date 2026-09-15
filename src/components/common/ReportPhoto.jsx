import { useState } from "react";
import { ImageOff, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { assetUrl } from "@/lib/assetUrl";
import { cn } from "@/lib/utils";

/**
 * One report / resolution photo thumbnail. Resolves server-relative upload
 * paths to the API origin ([[assetUrl]]) and degrades to a placeholder tile if
 * the file is missing, so a broken image never leaks into the UI.
 *
 * Clickable by default — opens a full-size lightbox so an admin/staff
 * reviewer can inspect the evidence closely. Pass `zoomable={false}` for
 * spots (e.g. small avatar-style previews) that shouldn't be interactive.
 */
export default function ReportPhoto({ src, alt = "", className, zoomable = true }) {
  const [broken, setBroken] = useState(false);
  const [open, setOpen] = useState(false);
  const resolved = assetUrl(src);

  if (!resolved || broken) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-md border border-border bg-muted text-muted-foreground",
          className
        )}
        role="img"
        aria-label={alt || "Image unavailable"}
      >
        <ImageOff className="size-5" aria-hidden="true" />
      </div>
    );
  }

  const thumbnail = (
    <img
      src={resolved}
      alt={alt}
      loading="lazy"
      onError={() => setBroken(true)}
      className={cn("rounded-md border border-border object-cover", zoomable && "cursor-zoom-in", className)}
    />
  );

  if (!zoomable) return thumbnail;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button type="button" className="block" aria-label={alt || "View photo full size"}>
          {thumbnail}
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/85 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <DialogPrimitive.Title className="sr-only">{alt || "Photo"}</DialogPrimitive.Title>
          <img
            src={resolved}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] rounded-md object-contain shadow-2xl"
          />
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute -right-3 -top-3 flex size-8 items-center justify-center rounded-full bg-background text-foreground shadow-md"
          >
            <X className="size-4" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
