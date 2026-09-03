"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

const themes = [
  { id: "system", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window === "undefined") return "system";
    return window.localStorage.getItem("theme") || "system";
  });

  const applyTheme = useCallback((value: string) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    if (value === "light") {
      root.classList.add("light");
    } else if (value === "dark") {
      root.classList.add("dark");
    }
    window.localStorage.setItem("theme", value);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [applyTheme, theme]);

  const handleChange = (value: string) => {
    setTheme(value);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted">
        Theme
      </span>
      <div className="flex items-center gap-1.5 rounded-sm border border-hairline bg-surface-2 p-1 text-sm text-muted shadow-sm">
        {themes.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleChange(option.id)}
            className={cn(
              "theme-option rounded-sm px-3 py-1.5 text-xs font-medium transition-transform transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-[0.98]",
              theme === option.id ? "bg-ink text-surface shadow-sm" : "text-muted"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
