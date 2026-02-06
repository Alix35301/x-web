"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";
import { useState, useEffect } from "react";
import type { DateRange } from "react-day-picker";
import dayjs from "dayjs";

const DateRangePicker = ({
  value,
  onChange,
}: {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [internalRange, setInternalRange] = useState<DateRange | undefined>(value);

  useEffect(() => {
    if (!open) {
      setInternalRange(value);
    }
  }, [open, value]);

  const formatLabel = () => {
    if (!value?.from) return "Pick a date range";
    if (!value.to) return dayjs(value.from).format("MMM D, YYYY");
    return `${dayjs(value.from).format("MMM D, YYYY")} - ${dayjs(value.to).format("MMM D, YYYY")}`;
  };

  const handleSelect = (range: DateRange | undefined) => {
    setInternalRange(range);
    // Only close when from and to are different (actual range selected)
    // or when user clicks the same date twice intentionally
    if (range?.from && range?.to && range.from.getTime() !== range.to.getTime()) {
      onChange(range);
      setOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setInternalRange(undefined);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-auto justify-start gap-2 font-normal"
        >
          <CalendarIcon className="h-4 w-4" />
          {formatLabel()}
          {value?.from && (
            <X
              className="h-4 w-4 ml-1 hover:text-destructive"
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto overflow-hidden p-0 bg-background border border-border rounded-md"
        align="start"
      >
        <Calendar
          mode="range"
          selected={internalRange}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
