
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/themes";

/**
 * Theme toggle component that switches between light and dark modes
 */
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
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
