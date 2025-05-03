
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "sonner";
import { Code, Search, Filter, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateGallery from "@/components/TemplateGallery";
import PreviewPanel from "@/components/PreviewPanel";
import { Template } from "@/types";
import { useState, useEffect } from "react";
import { smartFallbackGenerator } from "@/lib/template-generator";

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templatePreview, setTemplatePreview] = useState({
    html: "",
    css: "",
    js: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSelectTemplate = async (template: Template) => {
    try {
      setIsLoading(true);
      setSelectedTemplate(template);
      
      // Generate template preview based on template type
      const templateColors = {
        blue: template.id.includes("dashboard") || template.id === "portfolio",
        green: template.id === "ecommerce" || template.id === "landing-page",
        red: false,
        purple: template.id === "blog",
        dark: false,
        light: true
      };
      
      const templateFeatures = {
        responsive: true,
        animation: true,
        form: template.id === "landing-page" || template.id === "portfolio",
        navigation: true
      };
      
      // Generate template with fake chat history for context
      const response = await smartFallbackGenerator(
        `Generate a ${template.name} template`, 
        [
          { role: "user", content: `I need a ${template.name} template` },
          { role: "assistant", content: `I'll create a ${template.name} template for you` }
        ]
      );
      
      if (response && response.code) {
        setTemplatePreview({
          html: response.code.html || "",
          css: response.code.css || "",
          js: response.code.js || ""
        });
        
        toast.success(`${template.name} template loaded`, {
          description: "Preview ready to explore"
        });
      }
    } catch (error) {
      console.error("Error loading template:", error);
      toast.error("Failed to load template", {
        description: "Please try again or select a different template"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter templates based on search query
  const filterTemplates = (searchTerm: string) => {
    setSearchQuery(searchTerm);
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
                  onChange={(e) => filterTemplates(e.target.value)}
                />
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              </div>
            </div>
          </div>
        </section>
        
        <div className="container px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Template Gallery Column */}
            <div className="lg:w-1/2 lg:pr-4">
              <Tabs defaultValue="all" className="mb-8">
                <div className="flex items-center justify-between">
                  <TabsList className="glassmorphism h-10">
                    <TabsTrigger value="all">All Templates</TabsTrigger>
                    <TabsTrigger value="landing">Landing</TabsTrigger>
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
                    <TabsTrigger value="blog">Blogs</TabsTrigger>
                  </TabsList>
                  
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </div>
                
                <TabsContent value="all" className="mt-8">
                  <TemplateGallery 
                    onSelectTemplate={handleSelectTemplate}
                    searchQuery={searchQuery} 
                    selectedTemplateId={selectedTemplate?.id}
                    isLoading={isLoading}
                  />
                </TabsContent>
                
                <TabsContent value="landing" className="mt-8">
                  <TemplateGallery
                    onSelectTemplate={handleSelectTemplate}
                    searchQuery={searchQuery}
                    selectedTemplateId={selectedTemplate?.id}
                    isLoading={isLoading}
                    categoryFilter="landing"
                  />
                </TabsContent>
                
                <TabsContent value="dashboard" className="mt-8">
                  <TemplateGallery
                    onSelectTemplate={handleSelectTemplate}
                    searchQuery={searchQuery}
                    selectedTemplateId={selectedTemplate?.id}
                    isLoading={isLoading}
                    categoryFilter="dashboard"
                  />
                </TabsContent>
                
                <TabsContent value="ecommerce" className="mt-8">
                  <TemplateGallery
                    onSelectTemplate={handleSelectTemplate}
                    searchQuery={searchQuery}
                    selectedTemplateId={selectedTemplate?.id}
                    isLoading={isLoading}
                    categoryFilter="ecommerce"
                  />
                </TabsContent>
                
                <TabsContent value="blog" className="mt-8">
                  <TemplateGallery
                    onSelectTemplate={handleSelectTemplate}
                    searchQuery={searchQuery}
                    selectedTemplateId={selectedTemplate?.id}
                    isLoading={isLoading}
                    categoryFilter="blog"
                  />
                </TabsContent>
              </Tabs>
              
              {/* Premium Templates */}
              <section className="py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 glassmorphism-card p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                  <div className="md:w-2/3">
                    <span className="inline-block px-3 py-1 mb-3 text-xs font-medium rounded-full bg-gradient-to-r from-theme-blue/20 to-theme-green/20 border border-theme-blue/10 text-theme-blue">
                      Premium Access
                    </span>
                    <h2 className="font-heading text-xl font-semibold mb-2">
                      Unlock Enterprise Templates
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm">
                      Get access to our full collection of industry-specific templates with authentication, dashboards, and API integrations.
                    </p>
                    <Button className="gap-2 bg-gradient-to-r from-theme-blue to-theme-green hover:opacity-90 transition-opacity text-sm">
                      Upgrade to Pro
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="md:w-1/3 flex justify-center">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-theme-blue to-theme-green rounded-lg blur opacity-30"></div>
                      <div className="w-24 h-24 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative">
                        <Code className="h-10 w-10 text-theme-blue" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            
            {/* Template Preview Column */}
            <div className="lg:w-1/2 lg:pl-4 mt-8 lg:mt-0">
              <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 h-[700px]">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    {selectedTemplate ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {selectedTemplate.name} Template Preview
                      </>
                    ) : (
                      "Template Preview"
                    )}
                  </h3>
                  {selectedTemplate && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-xs gap-1"
                      onClick={() => toast.success("Template applied to project", {
                        description: "You can now customize it in the editor"
                      })}
                    >
                      Use This Template
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                
                <PreviewPanel 
                  html={templatePreview.html}
                  css={templatePreview.css}
                  js={templatePreview.js}
                />
              </div>
            </div>
          </div>
        </div>
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
