
import { Button } from "@/components/ui/button";
import { Github, Code } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-background/80 border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-animation flex items-center justify-center">
            <Code className="text-white w-5 h-5" />
          </div>
          <span className="font-semibold text-xl">WebCraft AI</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
