
import Header from "@/components/Header";
import { ChatPanel } from "@/components/ChatPanel";
import PreviewPanel from "@/components/PreviewPanel";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Code, Zap, Layout, Star, Terminal, ShieldCheck, CircuitBoard, Cpu, Database, MicrochipIcon, MonitorSmartphone, Braces, ChevronsRight, ChevronsLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [expandedChat, setExpandedChat] = useState(false);
  const [expandedPreview, setExpandedPreview] = useState(false);
  
  const handleCodeGenerated = (html: string, css: string, js: string) => {
    setHtml(html);
    setCss(css);
    setJs(js);
  };
  
  const toggleChatExpansion = () => {
    setExpandedChat(!expandedChat);
    if (expandedPreview) setExpandedPreview(false);
  };
  
  const togglePreviewExpansion = () => {
    setExpandedPreview(!expandedPreview);
    if (expandedChat) setExpandedChat(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-code-pattern bg-fixed">
      <Header />
      
      <main className="flex-1 mt-16 flex flex-col">
        {/* Enhanced Hero Section with more depth and vivid colors */}
        <section className="relative overflow-hidden py-20 md:py-28">
          {/* Dynamic background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-theme-blue/15 to-theme-purple/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(30,174,219,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(139,92,246,0.1),transparent_50%)]"></div>
          
          {/* Animated circuit lines */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          <div className="absolute top-10 left-1/4 w-[1px] h-24 bg-gradient-to-b from-cyan-500/30 to-transparent"></div>
          <div className="absolute top-20 right-1/4 w-[1px] h-32 bg-gradient-to-b from-purple-500/30 to-transparent"></div>
          
          <div className="container relative z-10 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block px-4 py-1 mb-8 text-xs font-medium rounded-full bg-gradient-to-r from-cyan-500/25 to-purple-500/25 border border-cyan-500/30 text-cyan-400 animate-fade-in backdrop-blur-sm shadow-glow-sm">
                <span className="mr-2 text-cyan-300">✦</span>
                Enterprise AI Development Platform
                <span className="ml-2 text-purple-300">✦</span>
              </span>
              
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                Build production-ready applications with AI
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl mb-10 text-slate-300 max-w-3xl mx-auto animate-slide-up leading-relaxed font-light">
                Transform concepts into sophisticated web applications with our advanced AI engine.
                <span className="block mt-2 text-purple-300 font-medium">Enterprise-grade solutions for modern development teams.</span>
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 transition-opacity shadow-glow cyber-hover text-white font-medium text-lg px-8 py-6">
                  Start Building Free
                  <Zap className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2 backdrop-blur-sm bg-white/5 dark:bg-slate-900/20 hover:bg-white/10 dark:hover:bg-slate-900/30 cyber-hover border-cyan-500/40 text-slate-200 font-medium text-lg px-8 py-6">
                  View Demo
                  <Code className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in">
                {["React", "TypeScript", "Tailwind", "Full-stack", "API Integration"].map((tech, index) => (
                  <span 
                    key={tech} 
                    className={`px-4 py-2 text-sm rounded-full border shadow-sm backdrop-blur-sm ${
                      index % 2 === 0 
                        ? "bg-cyan-950/30 border-cyan-500/30 text-cyan-300 shadow-glow-sm" 
                        : "bg-purple-950/30 border-purple-500/30 text-purple-300 shadow-glow-sm"
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              {/* Added floating data visualization elements */}
              <div className="mt-12 relative h-20 hidden md:block">
                <div className="absolute left-1/4 top-0 w-2 h-2 rounded-full bg-cyan-400 animate-pulse-slow"></div>
                <div className="absolute left-1/4 top-0 w-8 h-8 rounded-full bg-cyan-400/10 animate-pulse-slow"></div>
                <div className="absolute right-1/4 top-10 w-2 h-2 rounded-full bg-purple-400 animate-pulse-slow"></div>
                <div className="absolute right-1/4 top-10 w-8 h-8 rounded-full bg-purple-400/10 animate-pulse-slow"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 top-5 w-3 h-3 rounded-full bg-green-400 animate-pulse-slow"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 top-5 w-12 h-12 rounded-full bg-green-400/10 animate-pulse-slow"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Improved AI Workspace Section with better visual connections */}
        <section className="py-16 bg-gradient-to-b from-slate-900/90 to-slate-800/90 relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <div className="container px-4">
            <div className="mb-12 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-cyan-500"></div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/30">
                  <CircuitBoard className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="w-12 h-[1px] bg-gradient-to-r from-cyan-500 to-transparent"></div>
              </div>
              <h2 className="font-heading text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                AI-Powered Development Environment
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto text-lg">
                Experience the future of web development with our AI-powered workspace.
                <span className="block mt-2 text-sm text-cyan-400 font-light">Seamless integration between AI assistant and live preview.</span>
              </p>
            </div>
            
            {/* Enhanced interconnected workspace */}
            <div className="relative">
              {/* Improved data flow visualization between panels */}
              <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 z-10 hidden lg:flex flex-col items-center">
                <div className="h-[20px] w-[2px] bg-gradient-to-b from-cyan-500 to-transparent"></div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center shadow-glow cyber-pulse mb-2">
                  <Cpu className="h-5 w-5 text-white" />
                </div>
                <div className="h-[20px] w-[2px] bg-gradient-to-b from-transparent to-purple-500 mb-2"></div>
                <div className="flex items-center gap-2 animate-pulse-slow">
                  <div className="h-[2px] w-20 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                  <div className="h-4 w-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center shadow-glow-sm"></div>
                  <div className="h-[2px] w-20 bg-gradient-to-r from-transparent to-purple-500"></div>
                </div>
              </div>
              
              {/* Interactive workspace with dynamic panel sizing */}
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6 relative ${
                expandedChat ? "lg:grid-cols-[2fr,1fr]" : 
                expandedPreview ? "lg:grid-cols-[1fr,2fr]" : 
                "lg:grid-cols-2"
              }`}>
                
                {/* Left Panel - AI Chat with expansion toggle */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleChatExpansion}
                    className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-20 h-6 w-6 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:bg-cyan-500/30 hidden lg:flex items-center justify-center"
                  >
                    {expandedChat ? <ChevronsLeft className="h-3 w-3 text-cyan-400" /> : <ChevronsRight className="h-3 w-3 text-cyan-400" />}
                  </Button>
                
                  <div className="relative p-1">
                    <div className="absolute -top-1 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                    <div className="absolute -bottom-1 left-20 right-20 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                    <div className="absolute -left-1 top-10 bottom-10 w-[1px] bg-gradient-to-b from-transparent via-cyan-500 to-transparent"></div>
                    <div className="absolute -right-1 top-20 bottom-20 w-[1px] bg-gradient-to-b from-transparent via-purple-500 to-transparent"></div>
                    
                    {/* Increased height for chat panel */}
                    <div className="h-[650px] overflow-hidden">
                      <ChatPanel onCodeGenerated={handleCodeGenerated} />
                    </div>
                    
                    {/* Enhanced interconnection indicator */}
                    <div className="absolute -bottom-3 right-10 z-20">
                      <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-full border border-cyan-500/20 shadow-glow-sm backdrop-blur-sm">
                        <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></div>
                        <div className="text-xs text-cyan-400">Connected to Preview</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Panel - Live Preview with expansion toggle */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={togglePreviewExpansion}
                    className="absolute -left-3 top-1/2 transform -translate-y-1/2 z-20 h-6 w-6 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 hover:bg-purple-500/30 hidden lg:flex items-center justify-center"
                  >
                    {expandedPreview ? <ChevronsRight className="h-3 w-3 text-purple-400" /> : <ChevronsLeft className="h-3 w-3 text-purple-400" />}
                  </Button>
                
                  <div className="relative p-1">
                    <div className="absolute -top-1 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                    <div className="absolute -bottom-1 left-20 right-20 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                    <div className="absolute -left-1 top-10 bottom-10 w-[1px] bg-gradient-to-b from-transparent via-purple-500 to-transparent"></div>
                    <div className="absolute -right-1 top-20 bottom-20 w-[1px] bg-gradient-to-b from-transparent via-cyan-500 to-transparent"></div>
                    
                    {/* Matched height with chat panel */}
                    <div className="h-[650px] overflow-hidden">
                      <PreviewPanel html={html} css={css} js={js} />
                    </div>
                    
                    {/* Enhanced interconnection indicator */}
                    <div className="absolute -bottom-3 left-10 z-20">
                      <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-full border border-purple-500/20 shadow-glow-sm backdrop-blur-sm">
                        <div className="text-xs text-purple-400">Receiving from AI</div>
                        <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced data flow visualization beneath panels */}
              <div className="flex justify-center mt-8">
                <div className="bg-slate-800/70 backdrop-blur-sm p-3 rounded-lg border border-gradient shadow-glow-sm flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-cyan-500 animate-pulse cyber-pulse"></div>
                  <span className="text-sm text-cyan-300 font-medium">Real-time code generation and preview</span>
                  <div className="h-3 w-3 rounded-full bg-purple-500 animate-pulse cyber-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Enhanced Features Section with more vibrant styling */}
        <section className="py-24 bg-gradient-to-b from-slate-900/90 to-slate-800/80 backdrop-blur-sm relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_50%,rgba(139,92,246,0.07),transparent_30%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_20%,rgba(30,174,219,0.07),transparent_30%)]"></div>
          
          <div className="container px-4 relative z-10">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-purple-500"></div>
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-900/50 to-purple-700/20 flex items-center justify-center border border-purple-500/30 shadow-glow-sm">
                  <MicrochipIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div className="w-16 h-[1px] bg-gradient-to-r from-purple-500 to-transparent"></div>
              </div>
              <h2 className="font-heading text-4xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-cyan-400 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                Enterprise-Grade Capabilities
              </h2>
              <p className="text-slate-300 dark:text-slate-300 max-w-2xl mx-auto text-lg">
                Built for professional development teams with advanced features
                <span className="block mt-2 text-sm text-purple-400 font-light">Designed for scalability and performance</span>
              </p>
            </div>
            
            {/* Enhanced feature cards with more depth and dimension */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="cyber-card p-6 transition-all duration-300 cyber-hover border-t-2 border-cyan-500/50 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md">
                <div className="cyber-icon cyber-icon-blue mb-6">
                  <Code className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold mb-3 text-xl text-cyan-400">Advanced Code Generation</h3>
                <p className="text-slate-300">Production-ready code that follows industry best practices and patterns</p>
              </div>
              
              <div className="cyber-card p-6 transition-all duration-300 cyber-hover border-t-2 border-purple-500/50 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md">
                <div className="cyber-icon cyber-icon-purple mb-6">
                  <Layout className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold mb-3 text-xl text-purple-400">Component Library</h3>
                <p className="text-slate-300">Access to a comprehensive library of reusable, customizable components</p>
              </div>
              
              <div className="cyber-card p-6 transition-all duration-300 cyber-hover border-t-2 border-cyan-500/50 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md">
                <div className="cyber-icon cyber-icon-blue mb-6">
                  <Terminal className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold mb-3 text-xl text-cyan-400">API Integration</h3>
                <p className="text-slate-300">Seamlessly connect your applications with third-party APIs and services</p>
              </div>
              
              <div className="cyber-card p-6 transition-all duration-300 cyber-hover border-t-2 border-purple-500/50 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md">
                <div className="cyber-icon cyber-icon-purple mb-6">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold mb-3 text-xl text-purple-400">Real-time Collaboration</h3>
                <p className="text-slate-300">Work together with your team in real-time with shared editing and commenting</p>
              </div>
              
              <div className="cyber-card p-6 transition-all duration-300 cyber-hover border-t-2 border-cyan-500/50 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md">
                <div className="cyber-icon cyber-icon-blue mb-6">
                  <Star className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold mb-3 text-xl text-cyan-400">Premium Templates</h3>
                <p className="text-slate-300">Start with industry-specific templates designed for professional use cases</p>
              </div>
              
              <div className="cyber-card p-6 transition-all duration-300 cyber-hover border-t-2 border-purple-500/50 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-md">
                <div className="cyber-icon cyber-icon-purple mb-6">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold mb-3 text-xl text-purple-400">Enterprise Security</h3>
                <p className="text-slate-300">Bank-grade security with encryption, audit logs, and compliance features</p>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Link to="/features">
                <Button variant="outline" size="lg" className="gap-3 backdrop-blur-sm bg-slate-800/50 dark:bg-slate-900/50 hover:bg-slate-700/50 dark:hover:bg-slate-800/50 cyber-hover border-purple-500/40 text-purple-300 font-medium px-8 py-6 text-lg">
                  Explore All Features
                  <Code className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Enhanced CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10"></div>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          
          {/* Added animated circuit elements */}
          <div className="absolute left-10 top-1/4 w-[1px] h-32 bg-gradient-to-b from-cyan-500/30 to-transparent"></div>
          <div className="absolute right-10 bottom-1/4 w-[1px] h-32 bg-gradient-to-b from-purple-500/30 to-transparent"></div>
          
          <div className="container px-4 relative z-10">
            <div className="max-w-4xl mx-auto cyber-panel p-12 text-center rounded-2xl bg-gradient-to-br from-slate-900/95 to-slate-800/95">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-cyan-500/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-purple-500/70 to-transparent"></div>
              
              {/* Enhanced visual elements */}
              <div className="mb-8 flex justify-center">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center shadow-glow cyber-pulse">
                  <Zap className="h-8 w-8 text-cyan-400" />
                </div>
              </div>
              
              <h2 className="font-heading text-4xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                Ready to build with AI?
              </h2>
              <p className="text-xl mb-10 text-slate-300 max-w-2xl mx-auto">
                Start building professional applications with our AI-powered platform today.
                <span className="block mt-2 text-cyan-400 font-light">No credit card required.</span>
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 transition-opacity shadow-glow cyber-hover text-white font-medium text-lg px-8 py-6">
                  Get Started Free
                  <Zap className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2 backdrop-blur-sm bg-slate-800/50 dark:bg-slate-900/50 hover:bg-slate-700/50 dark:hover:bg-slate-800/50 cyber-hover border-cyan-500/40 text-cyan-300 font-medium text-lg px-8 py-6">
                  Schedule Demo
                  <Database className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Enhanced Footer */}
      <footer className="border-t border-slate-700/30 bg-gradient-to-b from-slate-900/90 to-slate-800/90 backdrop-blur-sm relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        <div className="container py-10 px-4 text-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-cyan-500/80 to-purple-500/80 flex items-center justify-center text-white shadow-glow cyber-pulse">
                <CircuitBoard className="h-5 w-5" />
              </div>
              <span className="font-heading font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300">CodeCraft AI</span>
            </div>
            
            <div>
              <p className="text-slate-300 font-medium">Enterprise AI Development Platform</p>
            </div>
            
            <div className="flex gap-8">
              <Link to="/documentation" className="text-slate-300 hover:text-cyan-400 transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-cyan-500/70 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">Documentation</Link>
              <Link to="/features" className="text-slate-300 hover:text-cyan-400 transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-cyan-500/70 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">Features</Link>
              <Link to="/pricing" className="text-slate-300 hover:text-cyan-400 transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-cyan-500/70 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">Pricing</Link>
            </div>
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default Home;
