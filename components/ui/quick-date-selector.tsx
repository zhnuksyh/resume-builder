"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ClockIcon, CalendarDaysIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickDateOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  description?: string;
}

interface QuickDateSelectorProps {
  onSelect: (value: string) => void;
  selectedValue?: string;
  className?: string;
  showIcons?: boolean;
}

const quickDateOptions: QuickDateOption[] = [
  {
    label: "This Month",
    value: "current-month",
    icon: <CalendarIcon className="h-4 w-4" />,
    description: "Current month",
  },
  {
    label: "Last Month",
    value: "last-month",
    icon: <CalendarIcon className="h-4 w-4" />,
    description: "Previous month",
  },
  {
    label: "This Year",
    value: "current-year",
    icon: <CalendarDaysIcon className="h-4 w-4" />,
    description: "Current year",
  },
  {
    label: "Last Year",
    value: "last-year",
    icon: <CalendarDaysIcon className="h-4 w-4" />,
    description: "Previous year",
  },
  {
    label: "Present",
    value: "present",
    icon: <ClockIcon className="h-4 w-4" />,
    description: "Currently ongoing",
  },
];

export function QuickDateSelector({
  onSelect,
  selectedValue,
  className,
  showIcons = true,
}: QuickDateSelectorProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Quick Select
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 gap-2">
          {quickDateOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedValue === option.value ? "default" : "ghost"}
              size="sm"
              onClick={() => onSelect(option.value)}
              className={cn(
                "justify-start h-auto py-2 px-3 text-left",
                selectedValue === option.value &&
                  "bg-primary text-primary-foreground"
              )}
            >
              <div className="flex items-center gap-2 w-full">
                {showIcons && option.icon && (
                  <span className="flex-shrink-0">{option.icon}</span>
                )}
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{option.label}</span>
                  {option.description && (
                    <span className="text-xs opacity-70">
                      {option.description}
                    </span>
                  )}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced month picker with quick selection
interface EnhancedMonthPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showQuickSelect?: boolean;
}

export function EnhancedMonthPicker({
  value,
  onChange,
  placeholder = "Select month",
  disabled = false,
  className,
  showQuickSelect = true,
}: EnhancedMonthPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value ? new Date(value + "-01") : undefined
  );

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const monthValue = date.toISOString().slice(0, 7); // YYYY-MM format
      onChange?.(monthValue);
    }
    setOpen(false);
  };

  const handleQuickSelect = (quickValue: string) => {
    const now = new Date();
    let targetDate: Date;

    switch (quickValue) {
      case "current-month":
        targetDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "last-month":
        targetDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case "current-year":
        targetDate = new Date(now.getFullYear(), 0, 1);
        break;
      case "last-year":
        targetDate = new Date(now.getFullYear() - 1, 0, 1);
        break;
      case "present":
        onChange?.("present");
        setOpen(false);
        return;
      default:
        return;
    }

    handleSelect(targetDate);
  };

  const displayValue = React.useMemo(() => {
    if (value === "present") {
      return "Present";
    }
    if (selectedDate) {
      return selectedDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
    return placeholder;
  }, [selectedDate, value, placeholder]);

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal h-10 px-3 py-2",
          !selectedDate && value !== "present" && "text-muted-foreground",
          "hover:bg-accent/50 transition-colors duration-200",
          "border-input focus:ring-2 focus:ring-ring focus:ring-offset-2",
          className
        )}
        disabled={disabled}
        onClick={() => setOpen(!open)}
      >
        <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
        <span className="truncate">{displayValue}</span>
      </Button>

      {open && (
        <div className="absolute z-50 mt-1 w-full max-w-sm">
          <div className="bg-background border rounded-lg shadow-lg p-4">
            {showQuickSelect && (
              <div className="mb-4">
                <QuickDateSelector
                  onSelect={handleQuickSelect}
                  selectedValue={value === "present" ? "present" : undefined}
                  className="border-0 shadow-none"
                />
              </div>
            )}
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedDate(undefined);
                  onChange?.("");
                  setOpen(false);
                }}
                className="h-8 px-3 text-xs"
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
