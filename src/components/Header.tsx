
import { Button } from "@/components/ui/button";
import { Github, Code, Sparkles, Menu, Moon, Sun, Coffee, Settings, Flame, Zap, Star } from "lucide-react";
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

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    // In a real app, you'd update the document class here
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20 shadow-lg dark:shadow-gray-900/30">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-cool flex items-center justify-center shadow-neon animate-pulse-slow relative overflow-hidden">
            <div className="absolute inset-0 bg-mesh-pattern opacity-30"></div>
            <Code className="text-white w-6 h-6 relative z-10" />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="font-heading font-bold text-xl flex items-center gap-1 bg-gradient-to-r from-theme-blue via-theme-purple to-theme-pink bg-clip-text text-transparent">
              WebCraft AI
              <Badge className="ml-2 text-[10px] py-0 font-normal bg-theme-purple/20 text-theme-purple">BETA</Badge>
            </span>
            <span className="text-xs text-muted-foreground">Build anything with AI</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground hidden sm:flex">
            Docs
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hidden sm:flex gap-1.5">
                <Flame className="w-3.5 h-3.5 text-theme-orange" /> Features
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass">
              <DropdownMenuLabel>Features</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex gap-2">
                <span className="icon-wrapper icon-gradient">
                  <Code className="h-3.5 w-3.5" />
                </span>
                Code Generation
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-2">
                <span className="icon-wrapper icon-gradient" style={{ background: 'linear-gradient(to right, #8B5CF6, #D946EF)' }}>
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                AI Templates
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-2">
                <span className="icon-wrapper icon-gradient" style={{ background: 'linear-gradient(to right, #EC4899, #F43F5E)' }}>
                  <Coffee className="h-3.5 w-3.5" />
                </span>
                Custom Styles
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-2">
                <span className="icon-wrapper icon-gradient" style={{ background: 'linear-gradient(to right, #14B8A6, #06B6D4)' }}>
                  <Star className="h-3.5 w-3.5" />
                </span>
                Smart Components
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-white/20"
            onClick={toggleTheme}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          
          <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:border-primary/50 glass">
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1.5 shadow-neon bg-gradient-to-r from-theme-blue to-theme-purple hover:from-theme-purple hover:to-theme-blue relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <Zap className="w-3.5 h-3.5" />
            <span>Pro</span>
          </Button>
          
          <Button variant="ghost" size="icon" className="sm:hidden rounded-full">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
