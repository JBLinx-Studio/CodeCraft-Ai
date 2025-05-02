
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { Code, Search, Filter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateGallery from "@/components/TemplateGallery";
import { Template } from "@/types";
import { useState } from "react";

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    // In a real app, you might navigate to the editor with this template
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-code-pattern bg-fixed">
      <Header />
      
      <main className="flex-1 mt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white/50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-800/50 backdrop-blur-sm py-16">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="font-heading text-4xl font-bold mb-6 text-center">
                Professional <span className="bg-clip-text text-transparent bg-gradient-to-r from-theme-blue to-theme-green">Template Gallery</span>
              </h1>
              <p className="text-lg text-center text-slate-600 dark:text-slate-300 mb-12">
                Start your projects faster with our collection of enterprise-ready templates.
                All templates are customizable and built with best practices.
              </p>
              
              <div className="relative mb-12">
                <Input 
                  type="text" 
                  placeholder="Search templates..." 
                  className="pl-10 py-6 glassmorphism-card"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Template Gallery Section */}
        <section className="py-12">
          <div className="container px-4">
            <Tabs defaultValue="all" className="mb-8">
              <div className="flex items-center justify-between">
                <TabsList className="glassmorphism h-10">
                  <TabsTrigger value="all">All Templates</TabsTrigger>
                  <TabsTrigger value="landing">Landing Pages</TabsTrigger>
                  <TabsTrigger value="dashboard">Dashboards</TabsTrigger>
                  <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
                  <TabsTrigger value="blog">Blogs</TabsTrigger>
                </TabsList>
                
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>
              
              <TabsContent value="all" className="mt-8">
                <TemplateGallery onSelectTemplate={handleSelectTemplate} />
              </TabsContent>
              
              <TabsContent value="landing" className="mt-8">
                <div className="text-center py-16">
                  <p className="text-slate-600 dark:text-slate-300">
                    Select "All Templates" to view landing page templates
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="dashboard" className="mt-8">
                <div className="text-center py-16">
                  <p className="text-slate-600 dark:text-slate-300">
                    Select "All Templates" to view dashboard templates
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="ecommerce" className="mt-8">
                <div className="text-center py-16">
                  <p className="text-slate-600 dark:text-slate-300">
                    Select "All Templates" to view e-commerce templates
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="blog" className="mt-8">
                <div className="text-center py-16">
                  <p className="text-slate-600 dark:text-slate-300">
                    Select "All Templates" to view blog templates
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Premium Templates */}
        <section className="py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="container px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto glassmorphism-card p-8">
              <div className="md:w-2/3">
                <span className="inline-block px-3 py-1 mb-3 text-xs font-medium rounded-full bg-gradient-to-r from-theme-blue/20 to-theme-green/20 border border-theme-blue/10 text-theme-blue">
                  Premium Access
                </span>
                <h2 className="font-heading text-2xl font-semibold mb-3">
                  Unlock Enterprise Templates
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Get access to our full collection of industry-specific templates, 
                  including complex enterprise applications with authentication, 
                  dashboards, and API integrations.
                </p>
                <Button className="gap-2 bg-gradient-to-r from-theme-blue to-theme-green hover:opacity-90 transition-opacity">
                  Upgrade to Pro
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-theme-blue to-theme-green rounded-lg blur opacity-30"></div>
                  <div className="w-32 h-32 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative">
                    <Code className="h-12 w-12 text-theme-blue" />
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

export default Templates;
