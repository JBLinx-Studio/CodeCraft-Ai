
import { Button } from "@/components/ui/button";
import { Github, Code, Menu, Moon, Sun, Settings } from "lucide-react";
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
    <header className="fixed top-0 left-0 right-0 z-50 premium-nav">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary text-primary-foreground">
            <Code className="h-5 w-5" />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="font-heading font-semibold text-lg flex items-center gap-1.5">
              WebCraft AI
              <Badge variant="outline" className="ml-1 text-[10px] py-0 h-4 px-1 font-normal">BETA</Badge>
            </span>
            <span className="text-xs text-muted-foreground">Enterprise-grade AI development</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground hidden sm:flex">
            Documentation
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hidden sm:flex gap-1.5">
                Features
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 premium-card">
              <DropdownMenuLabel>Features</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex gap-2">
                <Code className="h-3.5 w-3.5" />
                Code Generation
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-2">
                <Settings className="h-3.5 w-3.5" />
                AI Templates
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-2">
                <Settings className="h-3.5 w-3.5" />
                Custom Styling
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
          
          <Button variant="outline" size="sm" className="gap-2">
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1.5"
          >
            Upgrade
          </Button>
          
          <Button variant="ghost" size="icon" className="sm:hidden rounded-full">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
