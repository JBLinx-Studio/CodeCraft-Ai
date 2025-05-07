
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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
    setIsAnimating(true);
    
    setIsDark(prevDark => {
      const newDark = !prevDark;
      
      if (newDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        
        toast("Dark mode activated", {
          description: "Your eyes will thank you",
          icon: <Moon className="h-4 w-4" />
        });
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        
        toast("Light mode activated", {
          description: "Bright and cheerful",
          icon: <Sun className="h-4 w-4" />
        });
      }
      
      // Reset animation state
      setTimeout(() => setIsAnimating(false), 500);
      
      return newDark;
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`h-9 w-9 relative overflow-hidden transition-all duration-300 border-slate-200 dark:border-slate-700 ${
        isAnimating ? 'scale-90' : ''
      }`}
      disabled={isAnimating}
    >
      {/* Sun Icon */}
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          !isDark ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
      >
        <Sun className="h-4 w-4 text-yellow-500" />
      </span>
      
      {/* Moon Icon */}
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isDark ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <Moon className="h-4 w-4 text-blue-400" />
      </span>
    </Button>
  );
};

export default ThemeToggle;
