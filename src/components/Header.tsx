
import { Button } from "@/components/ui/button";
import { Github, Code, Moon, Sun, Menu, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const location = useLocation();
  
  // Get system preference and saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const initialTheme = (savedTheme === "dark" || (!savedTheme && prefersDark)) ? "dark" : "light";
    setTheme(initialTheme);
    
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    localStorage.setItem("theme", newTheme);
    
    toast(`${newTheme === "light" ? "Light" : "Dark"} mode activated`, {
      description: `Visual preference updated`,
      duration: 2000,
    });
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleUpgradeClick = () => {
    toast("Pro Upgrade", {
      description: "Redirecting to upgrade options",
      action: {
        label: "View Plans",
        onClick: () => console.log("Viewing upgrade plans"),
      },
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphism-navbar">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-r from-theme-blue to-theme-green text-white transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow">
              <Code className="h-5 w-5" />
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="font-heading font-semibold text-lg flex items-center gap-1.5">
                CodeCraft AI
                <Badge variant="outline" className="ml-1 text-[10px] py-0 h-4 px-1 font-normal">BETA</Badge>
              </span>
              <span className="text-xs text-muted-foreground">Enterprise AI Development</span>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className={`nav-link ${isActive('/') ? 'nav-link-active' : ''}`}>Home</Link>
            <Link to="/features" className={`nav-link ${isActive('/features') ? 'nav-link-active' : ''}`}>Features</Link>
            <Link to="/templates" className={`nav-link ${isActive('/templates') ? 'nav-link-active' : ''}`}>Templates</Link>
            <Link to="/documentation" className={`nav-link ${isActive('/documentation') ? 'nav-link-active' : ''}`}>Docs</Link>
          </nav>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full transition-all duration-300 hover:bg-primary/10"
            onClick={toggleTheme}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? 
              <Moon className="h-4 w-4 transition-transform duration-300 hover:rotate-12" /> : 
              <Sun className="h-4 w-4 transition-transform duration-300 hover:rotate-45" />
            }
          </Button>
          
          <Button variant="outline" size="sm" className="gap-2 hidden sm:flex hover:bg-primary/10 hover:border-primary/30 transition-all duration-300">
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1.5 bg-gradient-to-r from-theme-blue to-theme-green hover:opacity-90 shadow-glow-sm hover:shadow-glow transition-all duration-300"
            onClick={handleUpgradeClick}
          >
            Upgrade Pro
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glassmorphism-card w-56">
              <DropdownMenuLabel>Navigation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/" className="flex gap-2 cursor-pointer w-full">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/features" className="flex gap-2 cursor-pointer w-full">Features</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/templates" className="flex gap-2 cursor-pointer w-full">Templates</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/documentation" className="flex gap-2 cursor-pointer w-full">Documentation</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
