"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonthYearPickerProps {
  value?: string; // Format: "YYYY-MM"
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  fromYear?: number;
  toYear?: number;
  showPresentOption?: boolean; // Whether to show "Set as Present" button
}

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export function MonthYearPicker({
  value,
  onChange,
  placeholder = "Select month and year",
  disabled = false,
  className,
  fromYear = 1950,
  toYear = 2030,
  showPresentOption = false,
}: MonthYearPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedMonth, setSelectedMonth] = React.useState<string>("");
  const [selectedYear, setSelectedYear] = React.useState<string>("");

  // Parse the value when it changes
  React.useEffect(() => {
    if (value && value !== "present") {
      const [year, month] = value.split("-");
      setSelectedYear(year || "");
      setSelectedMonth(month || "");
    } else {
      setSelectedYear("");
      setSelectedMonth("");
    }
  }, [value]);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    if (selectedYear && month) {
      const newValue = `${selectedYear}-${month}`;
      onChange?.(newValue);
    }
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    if (selectedMonth && year) {
      const newValue = `${year}-${selectedMonth}`;
      onChange?.(newValue);
    }
  };

  const handleClear = () => {
    setSelectedMonth("");
    setSelectedYear("");
    onChange?.("");
    setOpen(false);
  };

  const displayValue = React.useMemo(() => {
    if (value === "present") {
      return "Present";
    }
    if (selectedMonth && selectedYear) {
      const monthName = months.find((m) => m.value === selectedMonth)?.label;
      return `${monthName} ${selectedYear}`;
    }
    return placeholder;
  }, [selectedMonth, selectedYear, value, placeholder]);

  // Generate years array
  const years = React.useMemo(() => {
    const yearArray = [];
    for (let year = toYear; year >= fromYear; year--) {
      yearArray.push(year.toString());
    }
    return yearArray;
  }, [fromYear, toYear]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-10 px-3 py-2",
            !selectedMonth &&
              !selectedYear &&
              value !== "present" &&
              "text-muted-foreground",
            "hover:bg-accent/50 transition-colors duration-200",
            "border-input focus:ring-2 focus:ring-ring focus:ring-offset-2",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">{displayValue}</span>
          <ChevronDownIcon className="ml-auto h-4 w-4 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Month</label>
              <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <Select value={selectedYear} onValueChange={handleYearChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={`flex items-center ${showPresentOption ? 'justify-between' : 'justify-end'} pt-2 border-t`}>
            {showPresentOption && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange?.("present");
                  setOpen(false);
                }}
                className="h-8 px-3 text-xs"
              >
                Set as Present
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 px-3 text-xs"
            >
              Clear
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Quick month-year selector with preset options
interface QuickMonthYearSelectorProps {
  onSelect: (value: string) => void;
  selectedValue?: string;
  className?: string;
}

const quickOptions = [
  {
    label: "This Month",
    value: "current-month",
    description: "Current month and year",
  },
  {
    label: "Last Month",
    value: "last-month",
    description: "Previous month",
  },
  {
    label: "This Year",
    value: "current-year",
    description: "January of current year",
  },
  {
    label: "Last Year",
    value: "last-year",
    description: "January of previous year",
  },
  {
    label: "Present",
    value: "present",
    description: "Currently ongoing",
  },
];

export function QuickMonthYearSelector({
  onSelect,
  selectedValue,
  className,
}: QuickMonthYearSelectorProps) {
  const handleQuickSelect = (value: string) => {
    const now = new Date();
    let result: string;

    switch (value) {
      case "current-month":
        result = format(now, "yyyy-MM");
        break;
      case "last-month":
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        result = format(lastMonth, "yyyy-MM");
        break;
      case "current-year":
        result = format(now, "yyyy") + "-01";
        break;
      case "last-year":
        const lastYear = new Date(now.getFullYear() - 1, 0, 1);
        result = format(lastYear, "yyyy-MM");
        break;
      case "present":
        result = "present";
        break;
      default:
        return;
    }

    onSelect(result);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-sm font-medium text-muted-foreground mb-3">
        Quick Select
      </div>
      <div className="grid grid-cols-1 gap-2">
        {quickOptions.map((option) => (
          <Button
            key={option.value}
            variant={selectedValue === option.value ? "default" : "ghost"}
            size="sm"
            onClick={() => handleQuickSelect(option.value)}
            className={cn(
              "justify-start h-auto py-2 px-3 text-left",
              selectedValue === option.value &&
                "bg-primary text-primary-foreground"
            )}
          >
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{option.label}</span>
              <span className="text-xs opacity-70">{option.description}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
