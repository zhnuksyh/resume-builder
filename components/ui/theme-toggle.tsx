"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative h-9 w-16 rounded-full bg-muted p-0 transition-colors hover:bg-muted/80"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`absolute h-7 w-7 rounded-full bg-foreground transition-transform duration-200 ease-in-out ${
            theme === "dark" ? "translate-x-4" : "-translate-x-4"
          }`}
        >
          <div className="flex h-full w-full items-center justify-center">
            {theme === "dark" ? (
              <Moon className="h-4 w-4 text-background" />
            ) : (
              <Sun className="h-4 w-4 text-background" />
            )}
          </div>
        </div>
      </div>
    </Button>
  );
}
