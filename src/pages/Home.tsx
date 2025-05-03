
import Header from "@/components/Header";
import ChatPanel from "@/components/ChatPanel";
import PreviewPanel from "@/components/PreviewPanel";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Code, Zap, Layout, Star, Terminal, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  
  const handleCodeGenerated = (html: string, css: string, js: string) => {
    setHtml(html);
    setCss(css);
    setJs(js);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-code-pattern bg-fixed">
      <Header />
      
      <main className="flex-1 mt-16 flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-theme-blue/5 to-theme-green/5"></div>
          <div className="container relative z-10 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block px-3 py-1 mb-6 text-xs font-medium rounded-full bg-gradient-to-r from-theme-blue/20 to-theme-green/20 border border-theme-blue/10 text-theme-blue">
                Enterprise AI Development Platform
              </span>
              
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-theme-blue to-theme-green">
                Build production-ready applications with AI
              </h1>
              
              <p className="text-lg md:text-xl mb-8 text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Transform concepts into sophisticated web applications with our advanced AI engine.
                Enterprise-grade solutions for modern development teams.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-theme-blue to-theme-green hover:opacity-90 transition-opacity">
                  Start Building Free
                  <Zap className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  View Demo
                  <Code className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {["React", "TypeScript", "Tailwind", "Full-stack", "API Integration"].map((tech, index) => (
                  <span key={tech} className="px-3 py-1.5 glassmorphism text-sm rounded-full border border-slate-200 dark:border-slate-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* AI Workspace Section */}
        <section className="py-16 bg-gradient-to-b from-background to-slate-100/50 dark:from-background dark:to-slate-900/10">
          <div className="container px-4">
            <div className="mb-12 text-center">
              <h2 className="font-heading text-3xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-theme-blue to-theme-green">
                AI-Powered Development Environment
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Experience the future of web development with our AI-powered workspace.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glassmorphism-card p-1 shadow-xl">
                <div className="code-panel h-full">
                  <div className="code-header">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-slate-400">AI Assistant</div>
                  </div>
                  <div className="p-0 h-[400px]">
                    <ChatPanel onCodeGenerated={handleCodeGenerated} />
                  </div>
                </div>
              </div>
              
              <div className="glassmorphism-card p-1 shadow-xl">
                <div className="code-panel h-full">
                  <div className="code-header">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-slate-400">Live Preview</div>
                  </div>
                  <div className="p-0 h-[400px]">
                    <PreviewPanel html={html} css={css} js={js} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl font-semibold mb-4">
                Enterprise-Grade Capabilities
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Built for professional development teams with advanced features
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="glassmorphism-card p-6 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-feature">
                <div className="feature-icon feature-icon-blue mb-4">
                  <Code className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold mb-2 text-lg">Advanced Code Generation</h3>
                <p className="text-slate-600 dark:text-slate-300">Production-ready code that follows industry best practices and patterns</p>
              </div>
              
              <div className="glassmorphism-card p-6 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-feature">
                <div className="feature-icon feature-icon-green mb-4">
                  <Layout className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold mb-2 text-lg">Component Library</h3>
                <p className="text-slate-600 dark:text-slate-300">Access to a comprehensive library of reusable, customizable components</p>
              </div>
              
              <div className="glassmorphism-card p-6 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-feature">
                <div className="feature-icon feature-icon-blue mb-4">
                  <Terminal className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold mb-2 text-lg">API Integration</h3>
                <p className="text-slate-600 dark:text-slate-300">Seamlessly connect your applications with third-party APIs and services</p>
              </div>
              
              <div className="glassmorphism-card p-6 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-feature">
                <div className="feature-icon feature-icon-green mb-4">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold mb-2 text-lg">Real-time Collaboration</h3>
                <p className="text-slate-600 dark:text-slate-300">Work together with your team in real-time with shared editing and commenting</p>
              </div>
              
              <div className="glassmorphism-card p-6 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-feature">
                <div className="feature-icon feature-icon-blue mb-4">
                  <Star className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold mb-2 text-lg">Premium Templates</h3>
                <p className="text-slate-600 dark:text-slate-300">Start with industry-specific templates designed for professional use cases</p>
              </div>
              
              <div className="glassmorphism-card p-6 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-feature">
                <div className="feature-icon feature-icon-green mb-4">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold mb-2 text-lg">Enterprise Security</h3>
                <p className="text-slate-600 dark:text-slate-300">Bank-grade security with encryption, audit logs, and compliance features</p>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Link to="/features">
                <Button variant="outline" size="lg" className="gap-2">
                  Explore All Features
                  <Code className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-theme-blue to-theme-green opacity-10"></div>
          <div className="container px-4 relative z-10">
            <div className="max-w-4xl mx-auto glassmorphism-card p-12 text-center">
              <h2 className="font-heading text-3xl font-semibold mb-4">
                Ready to build with AI?
              </h2>
              <p className="text-lg mb-8 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Start building professional applications with our AI-powered platform today.
                No credit card required.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-theme-blue to-theme-green hover:opacity-90 transition-opacity">
                  Get Started Free
                  <Zap className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  Schedule Demo
                  <Code className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container py-8 px-4 text-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-theme-blue to-theme-green flex items-center justify-center text-white">
                <Code className="h-4 w-4" />
              </div>
              <span className="font-heading font-semibold">CodeCraft AI</span>
            </div>
            
            <div>
              <p className="text-slate-600 dark:text-slate-300">Enterprise AI Development Platform</p>
            </div>
            
            <div className="flex gap-6">
              <Link to="/documentation" className="text-sm text-slate-600 dark:text-slate-300 hover:text-theme-blue transition-colors">Documentation</Link>
              <Link to="/features" className="text-sm text-slate-600 dark:text-slate-300 hover:text-theme-blue transition-colors">Features</Link>
              <Link to="/pricing" className="text-sm text-slate-600 dark:text-slate-300 hover:text-theme-blue transition-colors">Pricing</Link>
            </div>
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default Home;
