"use client";

import { createContext, useContext, useState, useEffect } from "react";
// createContext:create the theme
// let the content to 'read' the theme
// keep the theme
// defult theme
type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;   //change theme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
// let the user to use the theme in Theme provider , if not,then will get error
// children is all those things will change theme in the Theme provider
export function ThemeProvider({ children }: { children: React.ReactNode }) { 
  const [theme, setTheme] = useState<Theme>("light"); // make the default theme light

  
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;  // take the theme that store before in local
    if (saved) {
      setTheme(saved); // if there's a theme save then update the theme
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";  // if light then change to dark
    setTheme(next);      //update 
    localStorage.setItem("theme", next);// store the new theme to local, next update then use this one
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);               // this part shows error to make sure everything can change theme
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}