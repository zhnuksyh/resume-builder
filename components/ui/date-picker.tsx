"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, ClockIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showTime?: boolean;
  mode?: "single" | "range";
  rangeValue?: { from: Date | undefined; to: Date | undefined };
  onRangeChange?: (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
  showTime = false,
  mode = "single",
  rangeValue,
  onRangeChange,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (mode === "single") {
      onChange?.(selectedDate);
      setOpen(false);
    }
  };

  const handleRangeSelect = (
    range: { from: Date | undefined; to: Date | undefined } | undefined
  ) => {
    if (mode === "range" && range) {
      onRangeChange?.(range);
      if (range.from && range.to) {
        setOpen(false);
      }
    }
  };

  const displayValue = React.useMemo(() => {
    if (mode === "range" && rangeValue) {
      if (rangeValue.from && rangeValue.to) {
        return `${format(rangeValue.from, "MMM dd, yyyy")} - ${format(
          rangeValue.to,
          "MMM dd, yyyy"
        )}`;
      } else if (rangeValue.from) {
        return `${format(rangeValue.from, "MMM dd, yyyy")} - ...`;
      }
      return placeholder;
    }

    if (value) {
      return format(value, showTime ? "MMM dd, yyyy HH:mm" : "MMM dd, yyyy");
    }

    return placeholder;
  }, [value, rangeValue, placeholder, showTime, mode]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-10 px-3 py-2",
            !value && !rangeValue?.from && "text-muted-foreground",
            "hover:bg-accent/50 transition-colors duration-200",
            "border-input focus:ring-2 focus:ring-ring focus:ring-offset-2",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">{displayValue}</span>
          {showTime && <ClockIcon className="ml-auto h-4 w-4 flex-shrink-0" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode={mode}
          selected={mode === "single" ? value : undefined}
          onSelect={handleSelect}
          defaultMonth={value || rangeValue?.from}
          numberOfMonths={mode === "range" ? 2 : 1}
          className="rounded-md border-0"
          {...(mode === "range" && {
            selected: rangeValue,
            onSelect: handleRangeSelect,
          })}
        />
        {mode === "range" && (
          <div className="p-3 border-t bg-muted/50">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Select date range</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onRangeChange?.({ from: undefined, to: undefined });
                  setOpen(false);
                }}
                className="h-6 px-2 text-xs"
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

// Month picker component for resume sections
interface MonthPickerProps {
  value?: string; // Format: "YYYY-MM"
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MonthPicker({
  value,
  onChange,
  placeholder = "Select month",
  disabled = false,
  className,
}: MonthPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value ? new Date(value + "-01") : undefined
  );

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const monthValue = format(date, "yyyy-MM");
      onChange?.(monthValue);
    }
    setOpen(false);
  };

  const displayValue = React.useMemo(() => {
    if (selectedDate) {
      return format(selectedDate, "MMMM yyyy");
    }
    return placeholder;
  }, [selectedDate, placeholder]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-10 px-3 py-2",
            !selectedDate && "text-muted-foreground",
            "hover:bg-accent/50 transition-colors duration-200",
            "border-input focus:ring-2 focus:ring-ring focus:ring-offset-2",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">{displayValue}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          defaultMonth={selectedDate}
          className="rounded-md border-0"
          captionLayout="dropdown-buttons"
          fromYear={1950}
          toYear={2030}
        />
        <div className="p-3 border-t bg-muted/50">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Select month and year</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedDate(undefined);
                onChange?.("");
                setOpen(false);
              }}
              className="h-6 px-2 text-xs"
            >
              Clear
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
