
import { Button } from "@/components/ui/button";
import { Github, Code, Sparkles, Menu, Moon, Sun, Coffee, Settings } from "lucide-react";
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
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-animation flex items-center justify-center shadow-glow animate-bounce-subtle">
            <Code className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="font-bold text-xl flex items-center gap-1">
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
              <Button variant="ghost" size="sm" className="text-muted-foreground hidden sm:flex">
                <Settings className="w-4 h-4 mr-1" /> Features
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-lg">
              <DropdownMenuLabel>Features</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex gap-2">
                <span className="bg-theme-blue/20 text-theme-blue p-1 rounded">
                  <Code className="h-4 w-4" />
                </span>
                Code Generation
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-2">
                <span className="bg-theme-purple/20 text-theme-purple p-1 rounded">
                  <Sparkles className="h-4 w-4" />
                </span>
                AI Templates
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-2">
                <span className="bg-theme-pink/20 text-theme-pink p-1 rounded">
                  <Coffee className="h-4 w-4" />
                </span>
                Custom Styles
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={toggleTheme}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          
          <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:border-primary/50">
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1 shadow-sm button-3d bg-gradient-to-r from-theme-blue to-theme-purple hover:from-theme-purple hover:to-theme-blue"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pro</span>
          </Button>
          
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
