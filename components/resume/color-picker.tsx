"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette, Check } from "lucide-react";

export type ResumeColor = "purple" | "dark-blue" | "grey";

interface ColorPickerProps {
  selectedColor: ResumeColor;
  onColorChange: (color: ResumeColor) => void;
}

const colorOptions = [
  {
    value: "purple" as ResumeColor,
    label: "Purple",
    className: "bg-purple-600 hover:bg-purple-700",
    preview: "bg-purple-500",
  },
  {
    value: "dark-blue" as ResumeColor,
    label: "Dark Blue",
    className: "bg-blue-800 hover:bg-blue-900",
    preview: "bg-blue-700",
  },
  {
    value: "grey" as ResumeColor,
    label: "Grey",
    className: "bg-gray-600 hover:bg-gray-700",
    preview: "bg-gray-500",
  },
];

export function ColorPicker({
  selectedColor,
  onColorChange,
}: ColorPickerProps) {
  const selectedOption = colorOptions.find(
    (option) => option.value === selectedColor
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Color</span>
          <div className={`w-3 h-3 rounded-full ${selectedOption?.preview}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {colorOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onColorChange(option.value)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${option.preview}`} />
              <span>{option.label}</span>
            </div>
            {selectedColor === option.value && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
