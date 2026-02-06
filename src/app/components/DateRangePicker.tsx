"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
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

  const formatLabel = () => {
    if (!value?.from) return "Pick a date range";
    if (!value.to) return dayjs(value.from).format("MMM D, YYYY");
    return `${dayjs(value.from).format("MMM D, YYYY")} - ${dayjs(value.to).format("MMM D, YYYY")}`;
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
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto overflow-hidden p-0 bg-background border border-border rounded-md"
        align="start"
      >
        <Calendar
          mode="range"
          selected={value}
          onSelect={(range) => {
            onChange(range);
            if (range?.from && range?.to) {
              setOpen(false);
            }
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
