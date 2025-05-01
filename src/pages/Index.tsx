
import { useState } from "react";
import Header from "@/components/Header";
import ChatPanel from "@/components/ChatPanel";
import PreviewPanel from "@/components/PreviewPanel";
import TemplateGallery from "@/components/TemplateGallery";
import { Template } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";

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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 mt-16 flex flex-col">
        {showWelcome && (
          <div className="bg-gradient-animation relative overflow-hidden">
            <div className="container py-16 px-4 text-center relative z-10">
              <h1 className="text-3xl sm:text-5xl font-bold mb-6 text-white drop-shadow-md">
                Create Web Applications with AI
              </h1>
              <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto text-white/90 mb-8">
                Describe what you want to build, and our AI will generate the code. 
                Preview, edit, and export your creation with ease.
              </p>
              <div className="flex justify-center gap-2 animate-float">
                <span className="inline-block w-2 h-2 rounded-full bg-white/80"></span>
                <span className="inline-block w-2 h-2 rounded-full bg-white/60 animation-delay-200"></span>
                <span className="inline-block w-2 h-2 rounded-full bg-white/40 animation-delay-400"></span>
              </div>
            </div>
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
          </div>
        )}
        
        <div className="container flex-1 flex flex-col lg:flex-row my-6 gap-6">
          <div className="lg:w-1/2 flex flex-col rounded-xl shadow-soft bg-card overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="border-b px-2">
                <TabsList className="w-full justify-start rounded-none bg-transparent p-0">
                  <TabsTrigger 
                    value="chat" 
                    className="rounded-t-lg border-b-2 border-transparent py-3 px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium"
                  >
                    Chat
                  </TabsTrigger>
                  <TabsTrigger 
                    value="templates" 
                    className="rounded-t-lg border-b-2 border-transparent py-3 px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium"
                  >
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
          
          <div className="lg:w-1/2 flex flex-col rounded-xl shadow-soft bg-card overflow-hidden">
            <PreviewPanel html={html} css={css} js={js} />
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6 bg-secondary/30">
        <div className="container text-sm text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="bg-gradient-animation h-2 w-2 rounded-full"></span>
            <span className="font-semibold">WebCraft AI</span>
            <span className="bg-gradient-animation h-2 w-2 rounded-full"></span>
          </div>
          Create web applications with AI assistance.
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default Index;
