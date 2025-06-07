
import { useState } from "react";
import Header from "@/components/Header";
import { ChatPanel } from "@/components/ChatPanel"; // Changed to named import
import PreviewPanel from "@/components/PreviewPanel";
import TemplateGallery from "@/components/TemplateGallery";
import { Template } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";
import { Code, Zap, Layout, Star } from "lucide-react";
import CompanyBranding from "@/components/CompanyBranding";
import GitHubIntegration from "@/components/GitHubIntegration";

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
          <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white">
            <div className="container py-16 px-4 text-center relative z-10">
              <div className="max-w-3xl mx-auto">
                <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-1 rounded-full text-white text-sm font-medium mb-4 animate-fade-in border border-white/20">
                  Enterprise-grade AI development by <span className="font-bold">JBLinx Studio</span>
                </div>
                
                <h1 className="font-heading text-3xl sm:text-5xl font-bold mb-6 animate-slide-up">
                  Build <span className="text-white/90">sophisticated web applications</span> <br className="hidden md:block" />with AI assistance
                </h1>
                
                <p className="text-lg max-w-2xl mx-auto text-white/70 mb-8 font-light animate-slide-up">
                  Transform concepts into production-ready code with our advanced AI engine.
                  Professional-grade solutions for modern development teams.
                </p>
                
                <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in">
                  {["React", "Tailwind CSS", "TypeScript", "Modern UI"].map((tech, index) => (
                    <span key={tech} className="px-3 py-1 bg-white/10 rounded-full text-white text-sm backdrop-blur-md border border-white/10">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
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
          
          <div className="lg:w-1/2 flex flex-col rounded-xl overflow-hidden premium-panel">
            <PreviewPanel 
              html={html} 
              css={css} 
              js={js} 
            />
            {(html || css || js) && (
              <div className="p-3 border-t bg-white/50 dark:bg-black/20">
                <GitHubIntegration html={html} css={css} js={js} />
              </div>
            )}
          </div>
        </div>
        
        {/* Features Section */}
        {showWelcome && (
          <div className="container my-12">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-heading font-semibold mb-2">
                Enterprise-grade Development Platform
              </h2>
              <p className="text-muted-foreground">Powerful tools for professional web application development</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="premium-card p-6 transition-all duration-300 hover:shadow-hover">
                <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center bg-primary/10">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-2 text-lg">Advanced Code Generation</h3>
                <p className="text-sm text-muted-foreground">Production-ready code that follows industry best practices and patterns</p>
              </div>
              
              <div className="premium-card p-6 transition-all duration-300 hover:shadow-hover">
                <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center bg-primary/10">
                  <Layout className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-2 text-lg">Real-time Preview</h3>
                <p className="text-sm text-muted-foreground">Instantly see your application with professional-grade UI components</p>
              </div>
              
              <div className="premium-card p-6 transition-all duration-300 hover:shadow-hover">
                <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold mb-2 text-lg">GitHub Integration</h3>
                <p className="text-sm text-muted-foreground">Deploy-ready code with one-click GitHub repository creation</p>
              </div>
            </div>
            
            <div className="mt-24 mb-12">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-heading font-semibold mb-2">
                  Enterprise Development Workflow
                </h2>
                <p className="text-muted-foreground">Streamlined process for creating professional web applications</p>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between max-w-4xl mx-auto relative">
                <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-neutral-200 to-neutral-300 hidden md:block"></div>
                
                <div className="flex-1 flex flex-col items-center text-center p-6 relative z-10 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-4">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  <div className="premium-card p-6 w-full">
                    <h3 className="font-heading font-semibold mb-2">1. Define Requirements</h3>
                    <p className="text-sm text-muted-foreground">Specify your application needs with detailed requirements</p>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col items-center text-center p-6 relative z-10 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-4">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div className="premium-card p-6 w-full">
                    <h3 className="font-heading font-semibold mb-2">2. Generate Solution</h3>
                    <p className="text-sm text-muted-foreground">Our AI creates enterprise-grade code that meets your specifications</p>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col items-center text-center p-6 relative z-10 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-4">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div className="premium-card p-6 w-full">
                    <h3 className="font-heading font-semibold mb-2">3. Deploy & Scale</h3>
                    <p className="text-sm text-muted-foreground">Export to GitHub and deploy your application with ease</p>
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
