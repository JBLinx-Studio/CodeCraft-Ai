
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { Code, Zap, Layout, Star, Terminal, ShieldCheck, ArrowRight, Database, Bot, Cloud, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  return (
    <div className="min-h-screen flex flex-col bg-code-pattern bg-fixed">
      <Header />
      
      <main className="flex-1 mt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white/50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-800/50 backdrop-blur-sm py-20">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-theme-blue to-theme-green">
                Enterprise AI Development Features
              </h1>
              <p className="text-lg text-center text-slate-600 dark:text-slate-300 mb-12">
                Discover the powerful capabilities that make CodeCraft AI the choice for enterprise development teams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="glassmorphism-card">
                <CardHeader>
                  <div className="feature-icon feature-icon-blue mb-4">
                    <Code className="h-5 w-5" />
                  </div>
                  <CardTitle>Intelligent Code Generation</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                    AI-powered code that follows best practices
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-slate-600 dark:text-slate-300">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-theme-blue shrink-0 mr-2 mt-0.5" />
                      <span>Context-aware code completion</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-theme-blue shrink-0 mr-2 mt-0.5" />
                      <span>Type-safe suggestions with TypeScript</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-theme-blue shrink-0 mr-2 mt-0.5" />
                      <span>Framework-specific optimizations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="glassmorphism-card">
                <CardHeader>
                  <div className="feature-icon feature-icon-green mb-4">
                    <Layout className="h-5 w-5" />
                  </div>
                  <CardTitle>Component Library</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                    Extensive collection of UI components
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-slate-600 dark:text-slate-300">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-theme-green shrink-0 mr-2 mt-0.5" />
                      <span>Customizable shadcn/ui integration</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-theme-green shrink-0 mr-2 mt-0.5" />
                      <span>Design system consistency</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-theme-green shrink-0 mr-2 mt-0.5" />
                      <span>Responsive layout components</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="glassmorphism-card">
                <CardHeader>
                  <div className="feature-icon feature-icon-blue mb-4">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <CardTitle>API Integration</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                    Seamless third-party services connection
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-slate-600 dark:text-slate-300">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-theme-blue shrink-0 mr-2 mt-0.5" />
                      <span>Automatic API client generation</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-theme-blue shrink-0 mr-2 mt-0.5" />
                      <span>OAuth and authentication handling</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-theme-blue shrink-0 mr-2 mt-0.5" />
                      <span>Data transformation helpers</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Additional Features */}
        <section className="py-20">
          <div className="container px-4">
            <h2 className="font-heading text-3xl font-semibold mb-12 text-center">
              Additional Enterprise Capabilities
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="glassmorphism-card p-6 transition-all duration-300 hover:translate-y-[-5px]">
                <div className="feature-icon feature-icon-blue mb-4">
                  <Bot className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold mb-2">AI Assistant</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Context-aware AI that understands your codebase and helps solve complex problems
                </p>
              </div>
              
              <div className="glassmorphism-card p-6 transition-all duration-300 hover:translate-y-[-5px]">
                <div className="feature-icon feature-icon-green mb-4">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold mb-2">Data Management</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Automatic schema generation and type-safe database operations
                </p>
              </div>
              
              <div className="glassmorphism-card p-6 transition-all duration-300 hover:translate-y-[-5px]">
                <div className="feature-icon feature-icon-blue mb-4">
                  <Cloud className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold mb-2">Deployment</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  One-click deployments to your preferred cloud infrastructure
                </p>
              </div>
              
              <div className="glassmorphism-card p-6 transition-all duration-300 hover:translate-y-[-5px]">
                <div className="feature-icon feature-icon-green mb-4">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold mb-2">Enterprise Security</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Advanced security controls, audit logs, and compliance features
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Comparison Table */}
        <section className="py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="container px-4">
            <h2 className="font-heading text-3xl font-semibold mb-12 text-center">
              Compare Plans
            </h2>
            
            <div className="glassmorphism-card overflow-hidden max-w-4xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-theme-blue/10 to-theme-green/10">
                      <th className="px-6 py-3 text-left text-sm font-semibold">Feature</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold">Free</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold">Pro</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    <tr>
                      <td className="px-6 py-4 text-sm">AI Code Generation</td>
                      <td className="px-6 py-4 text-center"><Check limited /></td>
                      <td className="px-6 py-4 text-center"><Check /></td>
                      <td className="px-6 py-4 text-center"><Check /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm">Component Library</td>
                      <td className="px-6 py-4 text-center"><Check limited /></td>
                      <td className="px-6 py-4 text-center"><Check /></td>
                      <td className="px-6 py-4 text-center"><Check /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm">API Integration</td>
                      <td className="px-6 py-4 text-center">-</td>
                      <td className="px-6 py-4 text-center"><Check /></td>
                      <td className="px-6 py-4 text-center"><Check /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm">Database Management</td>
                      <td className="px-6 py-4 text-center">-</td>
                      <td className="px-6 py-4 text-center"><Check /></td>
                      <td className="px-6 py-4 text-center"><Check /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm">Priority Support</td>
                      <td className="px-6 py-4 text-center">-</td>
                      <td className="px-6 py-4 text-center">-</td>
                      <td className="px-6 py-4 text-center"><Check /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm">Custom Branding</td>
                      <td className="px-6 py-4 text-center">-</td>
                      <td className="px-6 py-4 text-center">-</td>
                      <td className="px-6 py-4 text-center"><Check /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm">Advanced Security</td>
                      <td className="px-6 py-4 text-center">-</td>
                      <td className="px-6 py-4 text-center"><Check limited /></td>
                      <td className="px-6 py-4 text-center"><Check /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-theme-blue to-theme-green opacity-10"></div>
          <div className="container px-4 relative z-10">
            <div className="max-w-4xl mx-auto glassmorphism-card p-12 text-center">
              <h2 className="font-heading text-3xl font-semibold mb-4">
                Ready to upgrade your development?
              </h2>
              <p className="text-lg mb-8 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Get access to all features with our Pro plan. 
                Enterprise customers get additional support and customization options.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-theme-blue to-theme-green hover:opacity-90 transition-opacity">
                  Upgrade to Pro
                  <Zap className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  Contact Sales
                  <ArrowRight className="w-4 h-4" />
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

// Helper component for feature checkmarks
const Check = ({ limited = false }) => {
  return limited ? (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-theme-blue/20 text-theme-blue">
      <span className="w-3 h-3 rounded-full bg-theme-blue"></span>
    </span>
  ) : (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-theme-green/20 text-theme-green">
      <CheckIcon />
    </span>
  );
};

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default Features;
