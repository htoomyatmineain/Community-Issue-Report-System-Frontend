import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";
import MyanmarFlagCircle from "@/components/common/MyanmarFlagCircle";

const OPTIONS = [
  { value: "en", name: "English", native: "English" },
  { value: "my", name: "Myanmar", native: "မြန်မာ" },
];

/**
 * System-wide language toggle — dropdown styled after
 * ref-img/admin/language toggle-00.jpg: a rounded trigger (leading glyph +
 * current language + chevron) opening a radio-style option list.
 *
 * Languages: English and Myanmar. The leading glyph is a globe for English and
 * the circular Myanmar flag when Myanmar is active.
 */
export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const active = OPTIONS.find((o) => o.value === language) ?? OPTIONS[0];
  const isMyanmar = active.value === "my";

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function choose(value) {
    setLanguage(value);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative inline-block shrink-0 text-left">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t(`Language: ${active.name}`)}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-xl border border-console-border bg-surface px-3 py-2 text-sm font-medium text-ink shadow-sm transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-surface"
      >
        {isMyanmar ? (
          <MyanmarFlagCircle className="size-[18px]" />
        ) : (
          <Globe className="size-[18px] text-ink-muted" aria-hidden="true" />
        )}
        <span className="min-w-0 truncate">{active.native}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-ink-muted transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("Select language")}
          className="absolute right-0 z-50 mt-2 min-w-[200px] origin-top-right overflow-hidden rounded-xl border border-console-border bg-surface p-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-150"
        >
          {OPTIONS.map((option) => {
            const selected = option.value === language;
            return (
              <li key={option.value} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => choose(option.value)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:bg-surface-muted",
                    selected ? "font-semibold text-ink" : "text-ink-muted"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      selected ? "border-brand" : "border-ink-muted/50"
                    )}
                    aria-hidden="true"
                  >
                    {selected && <span className="size-2 rounded-full bg-brand" />}
                  </span>
                  {option.value === "my" ? (
                    <MyanmarFlagCircle className="size-[18px]" />
                  ) : (
                    <Globe className="size-[18px] text-ink-muted" aria-hidden="true" />
                  )}
                  <span className="truncate">{option.native}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
