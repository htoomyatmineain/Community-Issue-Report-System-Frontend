import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  sm: "h-9 w-9 text-sm",
  lg: "h-[72px] w-[72px] text-2xl",
};

/** Circular initials avatar (matches the Pencil "Avatar" component). */
export default function Avatar({ name, size = "sm", className }) {
  const initials = (name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary font-display font-bold text-primary-foreground",
        SIZE_CLASSES[size],
        className
      )}
    >
      {initials || "?"}
    </span>
  );
}
