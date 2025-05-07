
import { Button } from "@/components/ui/button";
import { Github, Code, Moon, Sun, Menu, ExternalLink } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    // In a real app, you'd update the document class here
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphism-navbar">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-r from-theme-blue to-theme-green text-white">
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
            <Link to="/" className="nav-link nav-link-active">Home</Link>
            <Link to="/features" className="nav-link">Features</Link>
            <Link to="/templates" className="nav-link">Templates</Link>
            <Link to="/documentation" className="nav-link">Docs</Link>
          </nav>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={toggleTheme}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          
          <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1.5 bg-gradient-to-r from-theme-blue to-theme-green hover:opacity-90 transition-opacity"
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
