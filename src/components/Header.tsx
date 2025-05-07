
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code, Layout, Settings } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LicenseInfo from "./LicenseInfo";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/75 dark:bg-slate-900/75 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
      <div className="container flex items-center justify-between h-16 py-2">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-r from-theme-blue to-theme-green flex items-center justify-center text-white shadow-glow-sm">
            <Code className="h-5 w-5" />
          </div>
          <div>
            <h1 
              className="font-heading font-semibold cursor-pointer"
              onClick={() => navigate('/')}
            >
              CodeCraft AI
            </h1>
            <p className="text-xs text-muted-foreground">by JBLinx Studio</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-1">
            <Button 
              variant={location.pathname === "/" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-sm gap-1"
            >
              <Code className="h-4 w-4" />
              Editor
            </Button>
            <Button 
              variant={location.pathname === "/templates" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => navigate('/templates')}
              className="text-sm gap-1"
            >
              <Layout className="h-4 w-4" />
              Templates
            </Button>
          </nav>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <LicenseInfo className="absolute bottom-0 left-0 w-full px-2 py-1 bg-background/50 text-center translate-y-full opacity-0 transition-all group-hover:opacity-100 group-hover:translate-y-0" />
    </header>
  );
};

export default Header;
