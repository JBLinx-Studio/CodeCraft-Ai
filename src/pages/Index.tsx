
import { useState } from "react";
import Header from "@/components/Header";
import ChatPanel from "@/components/ChatPanel";
import PreviewPanel from "@/components/PreviewPanel";
import TemplateGallery from "@/components/TemplateGallery";
import { Template } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Code, Zap, Sparkles, Palette, Layout } from "lucide-react";

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

  const features = [
    {
      icon: <Code className="h-5 w-5" />,
      title: "AI Code Generation",
      description: "Describe your idea and get functional code in seconds"
    },
    {
      icon: <Layout className="h-5 w-5" />,
      title: "Live Preview",
      description: "See your application come to life in real-time"
    },
    {
      icon: <Palette className="h-5 w-5" />,
      title: "CSS Styling",
      description: "Automatically generate beautiful styles for your UI"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Instant Export",
      description: "Download your code with a single click"
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 mt-16 flex flex-col">
        {showWelcome && (
          <div className="bg-gradient-animation relative overflow-hidden">
            <div className="container py-16 px-4 text-center relative z-10">
              <div className="max-w-3xl mx-auto">
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-white text-sm font-medium mb-4 animate-float">
                  <Sparkles className="h-3 w-3 inline mr-1" />
                  AI-powered web development
                </div>
                
                <h1 className="text-3xl sm:text-5xl font-bold mb-6 text-white drop-shadow-md">
                  Create <span className="underline decoration-wavy decoration-accent/70">Web Applications</span> with AI
                </h1>
                
                <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto text-white/90 mb-8">
                  Describe what you want to build, and our AI will generate the code. 
                  Preview, edit, and export your creation with ease.
                </p>
                
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {["React", "Tailwind CSS", "JavaScript", "HTML5", "CSS3"].map(tech => (
                    <span key={tech} className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-center gap-2 animate-float">
                  <span className="inline-block w-2 h-2 rounded-full bg-white/80"></span>
                  <span className="inline-block w-2 h-2 rounded-full bg-white/60 animation-delay-200"></span>
                  <span className="inline-block w-2 h-2 rounded-full bg-white/40 animation-delay-400"></span>
                </div>
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
        
        {/* Features Section */}
        {showWelcome && (
          <div className="container my-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Powerful Features</h2>
              <p className="text-muted-foreground">Everything you need to build web applications quickly</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="icon-container mb-4" 
                    style={{ 
                      backgroundColor: `hsl(${260 + index * 30}, 90%, 97%)`,
                      color: `hsl(${260 + index * 30}, 70%, 60%)`
                    }}>
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <div className="divider-wave my-16"></div>
            
            <div className="bg-gradient-to-r from-theme-blue/5 to-theme-purple/5 rounded-2xl p-8 mt-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4">How It Works</h2>
                <p className="text-muted-foreground mb-8">Three simple steps to create your web application</p>
                
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="flex-1 flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-theme-blue/10 flex items-center justify-center mb-4">
                      <span className="text-theme-blue font-bold">1</span>
                    </div>
                    <h3 className="font-semibold mb-2">Describe Your Idea</h3>
                    <p className="text-sm text-muted-foreground">Tell the AI what you want to build in natural language</p>
                  </div>
                  
                  <div className="hidden md:block pt-6">
                    <div className="w-12 h-0.5 bg-theme-purple/30"></div>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-theme-purple/10 flex items-center justify-center mb-4">
                      <span className="text-theme-purple font-bold">2</span>
                    </div>
                    <h3 className="font-semibold mb-2">Generate Code</h3>
                    <p className="text-sm text-muted-foreground">Our AI creates the HTML, CSS and JavaScript for your app</p>
                  </div>
                  
                  <div className="hidden md:block pt-6">
                    <div className="w-12 h-0.5 bg-theme-purple/30"></div>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-theme-pink/10 flex items-center justify-center mb-4">
                      <span className="text-theme-pink font-bold">3</span>
                    </div>
                    <h3 className="font-semibold mb-2">Preview & Export</h3>
                    <p className="text-sm text-muted-foreground">See your app in action and download the code</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="border-t py-6 bg-secondary/30">
        <div className="container text-sm text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="bg-gradient-animation h-2 w-2 rounded-full"></span>
            <span className="font-semibold">WebCraft AI</span>
            <span className="bg-gradient-animation h-2 w-2 rounded-full"></span>
          </div>
          <div className="max-w-md mx-auto">
            <p>Create web applications with AI assistance.</p>
            <div className="flex justify-center gap-4 mt-3">
              <a href="#" className="text-xs hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs hover:text-primary transition-colors">Terms of Use</a>
              <a href="#" className="text-xs hover:text-primary transition-colors">Contact</a>
              <a href="#" className="text-xs hover:text-primary transition-colors">About</a>
            </div>
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default Index;
