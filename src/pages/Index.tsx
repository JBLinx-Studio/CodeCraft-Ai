
import { useState } from "react";
import Header from "@/components/Header";
import { ChatPanel } from "@/components/ChatPanel";
import PreviewPanel from "@/components/PreviewPanel";
import TemplateGallery from "@/components/TemplateGallery";
import { Template } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";
import { Code, Zap, Layout, Star, ExternalLink } from "lucide-react";
import CompanyBranding from "@/components/CompanyBranding";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [showWelcome, setShowWelcome] = useState(true);
  
  const handleCodeGenerated = (html: string, css: string, js: string) => {
    setHtml(html);
    setCss(css);
    setJs(js);
    setShowWelcome(false);
  };
  
  const handleSelectTemplate = (template: Template) => {
    setActiveTab("chat");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-subtle-grid bg-fixed">
      <Header />
      
      <main className="flex-1 mt-16 flex flex-col">
        {showWelcome && (
          <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white overflow-hidden">
            {/* Animated dots background */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" 
                   style={{
                     backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                     backgroundSize: '20px 20px',
                   }}>
              </div>
            </div>
            
            {/* Content with enhanced animations */}
            <div className="container py-16 px-4 text-center relative z-10">
              <div className="max-w-3xl mx-auto">
                <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-1 rounded-full text-white text-sm font-medium mb-4 animate-fade-in border border-white/20 shadow-glow-sm">
                  Enterprise-grade AI development by <span className="font-bold text-gradient-primary">JBLinx Studio</span>
                </div>
                
                <h1 className="font-heading text-3xl sm:text-5xl font-bold mb-6 animate-slide-up">
                  Build <span className="text-gradient-primary">sophisticated web applications</span> <br className="hidden md:block" />
                  with AI assistance
                </h1>
                
                <p className="text-lg max-w-2xl mx-auto text-white/70 mb-8 font-light animate-slide-up delay-100">
                  Transform concepts into production-ready code with our advanced AI engine.
                  Professional-grade solutions for modern development teams.
                </p>
                
                <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in opacity-0" style={{animationDelay: '0.3s'}}>
                  {["React", "Tailwind CSS", "TypeScript", "Modern UI"].map((tech, index) => (
                    <span key={tech} className="px-3 py-1 bg-white/10 rounded-full text-white text-sm backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-4 justify-center animate-fade-in opacity-0" style={{animationDelay: '0.5s'}}>
                  <Button className="bg-gradient-to-r from-theme-blue to-theme-green hover:opacity-90 shadow-glow-sm hover:shadow-glow transition-all duration-300 gap-2">
                    Get Started
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 text-white">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-noise opacity-30"></div>
          </div>
        )}
        
        <div className="container flex-1 flex flex-col lg:flex-row my-6 gap-6">
          <div className="lg:w-1/2 flex flex-col rounded-xl overflow-hidden premium-panel">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="border-b bg-white/50 dark:bg-black/20">
                <TabsList className="w-full justify-start bg-transparent">
                  <TabsTrigger 
                    value="chat" 
                    className="rounded-t-lg border-b-2 border-transparent py-3 px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium"
                  >
                    <Code className="h-3.5 w-3.5 mr-1.5" />
                    AI Assistant
                  </TabsTrigger>
                  <TabsTrigger 
                    value="templates" 
                    className="rounded-t-lg border-b-2 border-transparent py-3 px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium"
                  >
                    <Layout className="h-3.5 w-3.5 mr-1.5" />
                    Templates
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="chat" className="flex-1 p-0 m-0">
                <ChatPanel onCodeGenerated={handleCodeGenerated} />
              </TabsContent>
              
              <TabsContent value="templates" className="flex-1 p-0 m-0">
                <TemplateGallery onSelectTemplate={handleSelectTemplate} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:w-1/2 flex flex-col rounded-xl overflow-hidden premium-panel cyber-hover">
            <PreviewPanel html={html} css={css} js={js} />
          </div>
        </div>
        
        {/* Features Section with enhanced styles */}
        {showWelcome && (
          <div className="container my-12">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-heading font-semibold mb-2 relative inline-block">
                <span className="relative z-10">Enterprise-grade Development Platform</span>
                <span className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-theme-blue/20 to-theme-green/20 -z-10 transform -rotate-1"></span>
              </h2>
              <p className="text-muted-foreground">Powerful tools for professional web application development</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="premium-card p-6 transition-all duration-300 hover:shadow-hover cyber-hover">
                <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center bg-primary/10">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-2 text-lg">Advanced Code Generation</h3>
                <p className="text-sm text-muted-foreground">Production-ready code that follows industry best practices and patterns</p>
              </div>
              
              <div className="premium-card p-6 transition-all duration-300 hover:shadow-hover cyber-hover">
                <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center bg-primary/10">
                  <Layout className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-2 text-lg">Real-time Preview</h3>
                <p className="text-sm text-muted-foreground">Instantly see your application with professional-grade UI components</p>
              </div>
              
              <div className="premium-card p-6 transition-all duration-300 hover:shadow-hover cyber-hover">
                <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-2 text-lg">Production Export</h3>
                <p className="text-sm text-muted-foreground">Deploy-ready code with optimized performance and accessibility</p>
              </div>
            </div>
            
            {/* How It Works - with enhanced styling */}
            <div className="mt-24 mb-12">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-heading font-semibold mb-2">
                  Enterprise Development Workflow
                </h2>
                <p className="text-muted-foreground">Streamlined process for creating professional web applications</p>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between max-w-4xl mx-auto relative">
                {/* Enhanced connection line with animation */}
                <div className="absolute top-16 left-0 right-0 h-0.5 hidden md:block">
                  <div className="h-full w-full bg-gradient-to-r from-slate-200/50 via-theme-blue/30 to-theme-green/30 
                                 dark:from-slate-700/50 dark:via-theme-blue/20 dark:to-theme-green/20"></div>
                  <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-theme-blue/50 to-transparent 
                                data-flow"></div>
                </div>
                
                <div className="flex-1 flex flex-col items-center text-center p-6 relative z-10 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800
                              flex items-center justify-center mb-4 shadow-lg">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  <div className="premium-card p-6 w-full hover:shadow-lg transition-all duration-300">
                    <h3 className="font-heading font-semibold mb-2">1. Define Requirements</h3>
                    <p className="text-sm text-muted-foreground">Specify your application needs with detailed requirements</p>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col items-center text-center p-6 relative z-10 animate-fade-in" 
                     style={{animationDelay: '0.2s'}}>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800
                              flex items-center justify-center mb-4 shadow-lg">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div className="premium-card p-6 w-full hover:shadow-lg transition-all duration-300">
                    <h3 className="font-heading font-semibold mb-2">2. Generate Solution</h3>
                    <p className="text-sm text-muted-foreground">Our AI creates enterprise-grade code that meets your specifications</p>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col items-center text-center p-6 relative z-10 animate-fade-in"
                     style={{animationDelay: '0.4s'}}>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800
                              flex items-center justify-center mb-4 shadow-lg">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div className="premium-card p-6 w-full hover:shadow-lg transition-all duration-300">
                    <h3 className="font-heading font-semibold mb-2">3. Deploy & Scale</h3>
                    <p className="text-sm text-muted-foreground">Export production-ready code that's optimized for performance</p>
                  </div>
                </div>
              </div>
            </div>
            
            <CompanyBranding />
          </div>
        )}
      </main>
      
      <footer className="border-t border-border">
        <div className="container py-8 text-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-theme-blue to-theme-green flex items-center justify-center text-white shadow-glow-sm">
                <Code className="h-4 w-4 text-white" />
              </div>
              <span className="font-heading font-semibold">CodeCraft AI</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                by JBLinx Studio
              </span>
            </div>
            
            <div>
              <p className="text-muted-foreground">Enterprise-grade web application platform</p>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">API</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </div>
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default Index;
