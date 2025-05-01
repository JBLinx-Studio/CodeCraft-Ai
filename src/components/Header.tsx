
import { Button } from "@/components/ui/button";
import { Github, Code, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-animation flex items-center justify-center shadow-glow">
            <Code className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="font-bold text-xl">WebCraft AI</span>
            <span className="text-xs text-muted-foreground">Build anything with AI</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Docs
          </Button>
          <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:border-primary/50">
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </Button>
          <Button variant="default" size="sm" className="gap-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pro</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
