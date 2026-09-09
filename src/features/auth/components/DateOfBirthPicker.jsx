import { useState } from "react";
import { format, isValid, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const ISO = "yyyy-MM-dd";

/**
 * Date-of-birth field: shadcn Calendar in a popover. Displays the chosen date
 * as `dd/mm/yy`; `value`/`onChange` stay in ISO (`yyyy-MM-dd`) so the signup
 * payload sent to the backend is unchanged.
 */
export default function DateOfBirthPicker({ id, value, onChange, max, invalid }) {
  const [open, setOpen] = useState(false);

  const selected = value ? parse(value, ISO, new Date()) : undefined;
  const maxDate = max ? parse(max, ISO, new Date()) : new Date();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          aria-invalid={invalid || undefined}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            !selected && "text-muted-foreground",
            invalid && "border-destructive"
          )}
        >
          {selected && isValid(selected) ? format(selected, "dd/MM/yy") : "dd/mm/yy"}
          <CalendarIcon className="size-4 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          startMonth={new Date(1920, 0)}
          endMonth={maxDate}
          defaultMonth={selected ?? maxDate}
          selected={selected}
          onSelect={(date) => {
            if (date) onChange(format(date, ISO));
            setOpen(false);
          }}
          disabled={{ after: maxDate }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
