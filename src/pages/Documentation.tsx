
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { Code, BookOpen, File, ChevronRight, Search, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Documentation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(`import { Button } from "@/components/ui/button";

const Example = () => {
  return (
    <Button>Click me</Button>
  );
};

export default Example;`);
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-code-pattern bg-fixed">
      <Header />
      
      <main className="flex-1 mt-16">
        {/* Documentation Header */}
        <section className="bg-gradient-to-b from-white/50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-800/50 backdrop-blur-sm py-16">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto mb-8">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-theme-blue" />
                <span className="text-sm text-slate-600 dark:text-slate-300">Documentation</span>
              </div>
              <h1 className="font-heading text-4xl font-bold mb-6">
                CodeCraft AI <span className="bg-clip-text text-transparent bg-gradient-to-r from-theme-blue to-theme-green">Documentation</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Comprehensive guides and API references to help you build sophisticated applications with our AI platform.
              </p>
              
              <div className="relative mb-8">
                <Input 
                  type="text" 
                  placeholder="Search documentation..." 
                  className="pl-10 py-6 glassmorphism-card"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="glassmorphism-card justify-start gap-2 h-auto py-3">
                  <div className="h-8 w-8 rounded-lg bg-theme-blue/10 flex items-center justify-center text-theme-blue">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span>Getting Started</span>
                </Button>
                
                <Button variant="outline" className="glassmorphism-card justify-start gap-2 h-auto py-3">
                  <div className="h-8 w-8 rounded-lg bg-theme-green/10 flex items-center justify-center text-theme-green">
                    <Code className="h-4 w-4" />
                  </div>
                  <span>API Reference</span>
                </Button>
                
                <Button variant="outline" className="glassmorphism-card justify-start gap-2 h-auto py-3">
                  <div className="h-8 w-8 rounded-lg bg-theme-blue/10 flex items-center justify-center text-theme-blue">
                    <File className="h-4 w-4" />
                  </div>
                  <span>Examples</span>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Documentation Content */}
        <section className="py-12">
          <div className="container px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <div className="lg:w-64 shrink-0">
                <div className="glassmorphism-card p-4 sticky top-20">
                  <h3 className="font-heading font-semibold mb-4">Documentation</h3>
                  
                  <nav className="space-y-1">
                    <a href="#introduction" className="flex items-center text-sm py-2 px-3 rounded-md bg-theme-blue/10 text-theme-blue">
                      Introduction
                    </a>
                    <a href="#installation" className="flex items-center text-sm py-2 px-3 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                      Installation
                    </a>
                    <a href="#usage" className="flex items-center text-sm py-2 px-3 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                      Basic Usage
                    </a>
                    <a href="#components" className="flex items-center text-sm py-2 px-3 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                      Components
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </a>
                    <a href="#api" className="flex items-center text-sm py-2 px-3 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                      API Integration
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </a>
                    <a href="#templates" className="flex items-center text-sm py-2 px-3 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                      Templates
                    </a>
                    <a href="#faq" className="flex items-center text-sm py-2 px-3 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                      FAQ
                    </a>
                  </nav>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="lg:flex-1">
                <div className="glassmorphism-card p-8">
                  <div id="introduction" className="mb-12">
                    <h2 className="font-heading text-2xl font-semibold mb-4">Introduction</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      CodeCraft AI is an enterprise-grade AI development platform that helps developers build 
                      sophisticated web applications faster. It combines the power of artificial intelligence 
                      with modern web development best practices to streamline the development process.
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      With our platform, you can:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300 mb-4">
                      <li>Generate production-ready code with AI assistance</li>
                      <li>Access a library of customizable components</li>
                      <li>Integrate with third-party APIs seamlessly</li>
                      <li>Deploy your applications with confidence</li>
                    </ul>
                    <p className="text-slate-600 dark:text-slate-300">
                      This documentation will guide you through the process of getting started with CodeCraft AI 
                      and making the most of its features.
                    </p>
                  </div>
                  
                  <div id="installation" className="mb-12">
                    <h2 className="font-heading text-2xl font-semibold mb-4">Installation</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      Get started with CodeCraft AI by installing our dependencies:
                    </p>
                    <div className="relative">
                      <div className="code-panel mb-4">
                        <div className="code-header">
                          <span className="text-xs font-mono">Terminal</span>
                          <button 
                            className="text-xs text-slate-400 hover:text-white transition-colors"
                            onClick={handleCopyCode}
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                        <div className="code-content">
                          <pre className="text-sm">
                            <code>npm install @codecraft/core @codecraft/components @codecraft/ai</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      After installation, you'll need to configure your API keys in the environment variables.
                    </p>
                  </div>
                  
                  <div id="usage" className="mb-12">
                    <h2 className="font-heading text-2xl font-semibold mb-4">Basic Usage</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      Here's a simple example of using a button component:
                    </p>
                    <div className="relative">
                      <div className="code-panel mb-4">
                        <div className="code-header">
                          <span className="text-xs font-mono">Example.tsx</span>
                          <button 
                            className="text-xs text-slate-400 hover:text-white transition-colors"
                            onClick={handleCopyCode}
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                        <div className="code-content">
                          <pre className="text-sm">
                            <code>
{`import { Button } from "@/components/ui/button";

const Example = () => {
  return (
    <Button>Click me</Button>
  );
};

export default Example;`}
                            </code>
                          </pre>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      For more advanced usage, check out the component documentation and examples.
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-16 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <Button variant="outline" className="gap-2" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" className="gap-2">
                      Next: Installation
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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
              <a href="#" className="text-sm text-slate-600 dark:text-slate-300 hover:text-theme-blue transition-colors">Documentation</a>
              <a href="#" className="text-sm text-slate-600 dark:text-slate-300 hover:text-theme-blue transition-colors">Features</a>
              <a href="#" className="text-sm text-slate-600 dark:text-slate-300 hover:text-theme-blue transition-colors">Pricing</a>
            </div>
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default Documentation;
