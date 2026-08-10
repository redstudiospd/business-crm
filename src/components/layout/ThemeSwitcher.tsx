"use client";

import { useEffect, useState } from "react";

const themes = [
  { id: "system", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

export function ThemeSwitcher() {
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    const stored = window.localStorage.getItem("theme") || "system";
    setTheme(stored);
    applyTheme(stored);
  }, []);

  const applyTheme = (value: string) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    if (value === "light") {
      root.classList.add("light");
    } else if (value === "dark") {
      root.classList.add("dark");
    }
    window.localStorage.setItem("theme", value);
  };

  const handleChange = (value: string) => {
    setTheme(value);
    applyTheme(value);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs uppercase tracking-[0.18em] text-slate-500">Theme</span>
      <div className="flex items-center gap-2 rounded-full bg-slate-900/80 p-1 text-sm text-slate-200 ring-1 ring-slate-800">
        {themes.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleChange(option.id)}
            className={`rounded-full px-3 py-1 transition ${
              theme === option.id
                ? "bg-indigo-500 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
