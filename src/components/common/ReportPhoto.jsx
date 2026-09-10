import { useState } from "react";
import { ImageOff } from "lucide-react";
import { assetUrl } from "@/lib/assetUrl";
import { cn } from "@/lib/utils";

/**
 * One report / resolution photo thumbnail. Resolves server-relative upload
 * paths to the API origin ([[assetUrl]]) and degrades to a placeholder tile if
 * the file is missing, so a broken image never leaks into the UI.
 */
export default function ReportPhoto({ src, alt = "", className }) {
  const [broken, setBroken] = useState(false);
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

  return (
    <img
      src={resolved}
      alt={alt}
      loading="lazy"
      onError={() => setBroken(true)}
      className={cn("rounded-md border border-border object-cover", className)}
    />
  );
}
