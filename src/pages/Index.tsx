
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
    // In a real implementation, we'd load template code here
    // For now, we'll just show a welcome message in the chat
    setActiveTab("chat");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 mt-16 flex flex-col">
        {showWelcome && (
          <div className="bg-gradient-animation text-white">
            <div className="container py-12 px-4 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                Create Web Applications with AI
              </h1>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Describe what you want to build, and our AI will generate the code. 
                Preview, edit, and export your creation with ease.
              </p>
            </div>
          </div>
        )}
        
        <div className="container flex-1 flex flex-col lg:flex-row">
          <div className="lg:w-1/2 flex flex-col border-r">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="border-b">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                  <TabsTrigger 
                    value="chat" 
                    className="rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    Chat
                  </TabsTrigger>
                  <TabsTrigger 
                    value="templates" 
                    className="rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
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
          
          <div className="lg:w-1/2 flex flex-col">
            <PreviewPanel html={html} css={css} js={js} />
          </div>
        </div>
      </main>
      
      <footer className="border-t py-4">
        <div className="container text-sm text-center text-muted-foreground">
          WebCraft AI — Create web applications with AI assistance.
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default Index;
