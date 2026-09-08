import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  sm: "h-9 w-9 text-sm",
  lg: "h-[72px] w-[72px] text-2xl",
};

/**
 * Per-account background colours. A stable seed (the name, or an explicit
 * `colorSeed`) is hashed into this list, so a given account always renders the
 * same colour. All pair with white text in both light and dark themes.
 */
const AVATAR_COLORS = [
  "bg-rose-500",
  "bg-orange-500",
  "bg-amber-600",
  "bg-lime-600",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-600",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-fuchsia-500",
  "bg-pink-500",
];

function hashIndex(seed, mod) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % mod;
}

/** Circular initials avatar (matches the Pencil "Avatar" component). */
export default function Avatar({ name, size = "sm", colorSeed, className }) {
  const initials = (name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const seed = String(colorSeed ?? name ?? "").trim();
  const colorClass = seed ? AVATAR_COLORS[hashIndex(seed, AVATAR_COLORS.length)] : "bg-primary";

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-display font-bold text-white",
        colorClass,
        SIZE_CLASSES[size],
        className
      )}
    >
      {initials || "?"}
    </span>
  );
}
