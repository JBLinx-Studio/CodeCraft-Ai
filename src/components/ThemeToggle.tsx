
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if the user has already set a preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(prevDark => {
      const newDark = !prevDark;
      
      if (newDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      
      return newDark;
    });
  };

  return (
    <Button
      variant={isDark ? "outline" : "default"}
      size="icon"
      onClick={toggleTheme}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "h-9 w-9 relative overflow-hidden transition-all duration-500",
        isDark ? "border-purple-500/50 bg-slate-800/90" : "border-cyan-500/50 bg-white/90"
      )}
    >
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-500",
          isDark ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        )}
      >
        <Moon className="h-4 w-4 text-purple-400" />
      </span>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-500",
          !isDark ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        )}
      >
        <Sun className="h-4 w-4 text-cyan-500" />
      </span>
    </Button>
  );
};

export default ThemeToggle;
