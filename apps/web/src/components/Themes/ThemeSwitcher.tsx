"use client";

import { useTheme } from "@/components/Themes/ThemeContext";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className="rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/20"
    >
      {theme === "light" ? "Dark" : "Light"}
    </button>
  );
}
