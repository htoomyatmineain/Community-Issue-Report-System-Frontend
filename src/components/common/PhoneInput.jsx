import { useId } from "react";
import { cn } from "@/lib/utils";

const PREFIX = "+959";

/**
 * Every phone number in the system is stored as "+959" followed by exactly
 * nine digits (CitizenRegisterDTO / CreateStaffDTO / UpdateUserDTO all
 * validate `^\+959[0-9]{9}$` on the backend). Letting people free-type that
 * whole string caused most submissions to fail validation — this locks the
 * "+959" prefix in place and only accepts the nine local digits, then hands
 * the full "+959XXXXXXXXX" string back through `onChange` so callers don't
 * need to change how they store the value.
 */
export default function PhoneInput({ id, value, onChange, className, disabled, ...props }) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const local = (value?.startsWith(PREFIX) ? value.slice(PREFIX.length) : value ?? "").replace(/\D/g, "");

  function handleChange(e) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
    onChange(digits ? `${PREFIX}${digits}` : "");
  }

  return (
    <div
      className={cn(
        "flex h-10 w-full items-stretch rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <span className="flex select-none items-center rounded-l-md border-r border-input bg-muted px-2.5 text-sm text-muted-foreground">
        {PREFIX}
      </span>
      <input
        id={inputId}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={local}
        onChange={handleChange}
        disabled={disabled}
        maxLength={9}
        placeholder="123456789"
        className="w-full min-w-0 rounded-r-md bg-transparent px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed md:text-sm"
        {...props}
      />
    </div>
  );
}
