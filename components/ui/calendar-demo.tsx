"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { DatePicker, MonthPicker } from "@/components/ui/date-picker";
import {
  MonthYearPicker,
  QuickMonthYearSelector,
} from "@/components/ui/month-year-picker";
import { QuickDateSelector } from "@/components/ui/quick-date-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ClockIcon } from "lucide-react";

export function CalendarDemo() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [selectedMonth, setSelectedMonth] = React.useState<string>("");
  const [selectedMonthYear, setSelectedMonthYear] = React.useState<string>("");
  const [range, setRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const handleQuickSelect = (value: string) => {
    console.log("Quick select:", value);
    // Handle quick selection logic here
  };

  return (
    <div className="space-y-8 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Enhanced Calendar UI</h1>
        <p className="text-muted-foreground">
          Modern, accessible, and beautiful calendar components
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Basic Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-0"
            />
          </CardContent>
        </Card>

        {/* Date Range Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5" />
              Date Range
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="range"
              selected={range}
              onSelect={(range) =>
                setRange(range || { from: undefined, to: undefined })
              }
              numberOfMonths={2}
              className="rounded-md border-0"
            />
          </CardContent>
        </Card>

        {/* Date Picker */}
        <Card>
          <CardHeader>
            <CardTitle>Date Picker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select a date</Label>
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="Pick a date"
              />
            </div>
            <div className="space-y-2">
              <Label>Select date range</Label>
              <DatePicker
                mode="range"
                rangeValue={range}
                onRangeChange={setRange}
                placeholder="Pick a date range"
              />
            </div>
          </CardContent>
        </Card>

        {/* Month Picker */}
        <Card>
          <CardHeader>
            <CardTitle>Month Picker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select month</Label>
              <MonthPicker
                value={selectedMonth}
                onChange={setSelectedMonth}
                placeholder="Select month"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Selected: {selectedMonth || "None"}
            </div>
          </CardContent>
        </Card>

        {/* Month-Year Picker */}
        <Card>
          <CardHeader>
            <CardTitle>Month-Year Picker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select month and year</Label>
              <MonthYearPicker
                value={selectedMonthYear}
                onChange={setSelectedMonthYear}
                placeholder="Select month and year"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Selected: {selectedMonthYear || "None"}
            </div>
          </CardContent>
        </Card>

        {/* Quick Date Selector */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Date Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-3">
                  General Date Selection
                </h4>
                <QuickDateSelector
                  onSelect={handleQuickSelect}
                  className="max-w-md"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3">
                  Month-Year Selection
                </h4>
                <QuickMonthYearSelector
                  onSelect={setSelectedMonthYear}
                  selectedValue={selectedMonthYear}
                  className="max-w-md"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Smooth Animations</h4>
              <p className="text-sm text-muted-foreground">
                Hover effects, transitions, and focus animations for better UX
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Accessibility</h4>
              <p className="text-sm text-muted-foreground">
                Keyboard navigation, ARIA labels, and screen reader support
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Modern Design</h4>
              <p className="text-sm text-muted-foreground">
                Clean, modern styling with proper contrast and visual hierarchy
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
