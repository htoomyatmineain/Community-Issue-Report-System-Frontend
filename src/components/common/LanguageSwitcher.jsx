import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/providers/LanguageProvider";
import MyanmarFlagCircle from "@/components/common/MyanmarFlagCircle";

const OPTIONS = [
  { value: "en", name: "English", native: "English" },
  { value: "my", name: "Myanmar", native: "မြန်မာ" },
];

const SIZE = {
  default: {
    trigger: "gap-2 px-3 py-2 text-sm",
    glyph: "size-[18px]",
    chevron: "size-4",
  },
  sm: {
    trigger: "gap-1.5 px-2.5 py-1.5 text-xs",
    glyph: "size-4",
    chevron: "size-3.5",
  },
};

/**
 * System-wide language toggle — dropdown styled after
 * ref-img/admin/language toggle-00.jpg: a rounded trigger (leading glyph +
 * current language + chevron) opening a radio-style option list.
 *
 * Languages: English and Myanmar. The leading glyph is a globe for English and
 * the circular Myanmar flag when Myanmar is active.
 *
 * @param {"default"|"sm"} [size] trigger scale
 * @param {"start"|"end"} [align] which edge the menu opens from
 */
export default function LanguageSwitcher({ size = "default", align = "end" }) {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const scale = SIZE[size] ?? SIZE.default;
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
        className={cn(
          "inline-flex items-center rounded-xl border border-console-border bg-transparent font-medium text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
          scale.trigger
        )}
      >
        {isMyanmar ? (
          <MyanmarFlagCircle className={scale.glyph} />
        ) : (
          <Globe className={cn(scale.glyph, "text-ink-muted")} aria-hidden="true" />
        )}
        <span className="min-w-0 truncate">{active.native}</span>
        <ChevronDown
          className={cn(
            "shrink-0 text-ink-muted transition-transform duration-200",
            scale.chevron,
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("Select language")}
          className={cn(
            "absolute z-50 mt-2 min-w-[200px] overflow-hidden rounded-xl border border-console-border bg-surface p-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-150",
            align === "start" ? "left-0 origin-top-left" : "right-0 origin-top-right"
          )}
        >
          {OPTIONS.map((option) => {
            const selected = option.value === language;
            return (
              <li key={option.value} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => choose(option.value)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:outline-none",
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
