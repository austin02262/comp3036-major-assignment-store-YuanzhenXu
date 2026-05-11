"use client";

import { Button } from "@repo/ui/button";
import { useTheme } from "@/components/Themes/ThemeContext";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();  // use theme:"light" | "dark", toggleTheme: () => void


  return (
    <Button onClick={toggleTheme}>  {/* change the theme button */}
      {theme === "light" ? "🌙 Dark Mode" : "🌞 Light Mode"} {/* change the word on the button */}
    </Button>
  );
}