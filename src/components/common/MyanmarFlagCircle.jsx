import { cn } from "@/lib/utils";

/**
 * Myanmar national flag (yellow / green / red thirds + white star), clipped to
 * a circle. Inline SVG rather than the 🇲🇲 emoji, which Windows renders as the
 * letters "MM". Used as the language glyph for Myanmar across the app.
 */
export default function MyanmarFlagCircle({ className }) {
  return (
    <span
      className={cn(
        "inline-block shrink-0 overflow-hidden rounded-full ring-1 ring-black/10 dark:ring-white/15",
        className
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <rect width="24" height="24" fill="#FECB00" />
        <rect y="8" width="24" height="16" fill="#34B233" />
        <rect y="16" width="24" height="8" fill="#EA2839" />
        <path
          d="M12 2 L14.25 8.91 L21.51 8.91 L15.63 13.18 L17.88 20.09 L12 15.82 L6.12 20.09 L8.37 13.18 L2.49 8.91 L9.75 8.91 Z"
          fill="#fff"
        />
      </svg>
    </span>
  );
}
