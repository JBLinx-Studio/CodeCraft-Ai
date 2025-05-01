
import { useState } from "react";
import Header from "@/components/Header";
import ChatPanel from "@/components/ChatPanel";
import PreviewPanel from "@/components/PreviewPanel";
import TemplateGallery from "@/components/TemplateGallery";
import { Template } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Code, Zap, Sparkles, Palette, Layout, Star, Flame, Lightbulb, Layers } from "lucide-react";

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
      description: "Describe your idea and get functional code in seconds",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Layout className="h-5 w-5" />,
      title: "Live Preview",
      description: "See your application come to life in real-time",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Palette className="h-5 w-5" />,
      title: "CSS Styling",
      description: "Automatically generate beautiful styles for your UI",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Instant Export",
      description: "Download your code with a single click",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: <Flame className="h-5 w-5" />,
      title: "Ready-Made Templates",
      description: "Start with professionally designed templates",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Layers className="h-5 w-5" />,
      title: "Component Library",
      description: "Access a wide range of pre-built components",
      gradient: "from-emerald-500 to-teal-500"
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-pattern-dots">
      <Header />
      
      <main className="flex-1 mt-16 flex flex-col">
        {showWelcome && (
          <div className="relative overflow-hidden bg-gradient-to-br from-theme-purple/90 to-theme-blue/90 shadow-inner">
            <div className="container py-16 px-4 text-center relative z-10">
              <div className="max-w-3xl mx-auto">
                <div className="inline-block glass px-4 py-1 rounded-full text-white text-sm font-medium mb-4 animate-float-slow">
                  <Sparkles className="h-3 w-3 inline mr-1" />
                  AI-powered web development
                </div>
                
                <h1 className="font-heading text-3xl sm:text-5xl font-bold mb-6 text-white drop-shadow-md">
                  Create <span className="relative">
                    <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Web Applications</span>
                    <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 10" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0,5 C50,17 150,-7 200,5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="opacity-60"></path>
                    </svg>
                  </span> with AI
                </h1>
                
                <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto text-white/90 mb-8 font-light">
                  Describe what you want to build, and our AI will generate the code. 
                  Preview, edit, and export your creation with ease.
                </p>
                
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {["React", "Tailwind CSS", "JavaScript", "HTML5", "CSS3"].map(tech => (
                    <span key={tech} className="px-3 py-1 glass rounded-full text-white text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="relative h-12">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-bounce w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-noise opacity-10"></div>
            
            <div className="absolute -bottom-1 left-0 w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,170.7C384,181,480,171,576,144C672,117,768,75,864,74.7C960,75,1056,117,1152,128C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
            </div>
          </div>
        )}
        
        <div className="container flex-1 flex flex-col lg:flex-row my-6 gap-6">
          <div className="lg:w-1/2 flex flex-col rounded-xl overflow-hidden frost-panel">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="border-b px-2 bg-white/50">
                <TabsList className="w-full justify-start rounded-none bg-transparent p-0">
                  <TabsTrigger 
                    value="chat" 
                    className="rounded-t-lg border-b-2 border-transparent py-3 px-4 data-[state=active]:border-theme-purple data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium"
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1.5 text-theme-purple" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger 
                    value="templates" 
                    className="rounded-t-lg border-b-2 border-transparent py-3 px-4 data-[state=active]:border-theme-blue data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium"
                  >
                    <Layout className="h-3.5 w-3.5 mr-1.5 text-theme-blue" />
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
          
          <div className="lg:w-1/2 flex flex-col rounded-xl overflow-hidden frost-panel">
            <PreviewPanel html={html} css={css} js={js} />
          </div>
        </div>
        
        {/* Features Section */}
        {showWelcome && (
          <div className="container my-12">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-heading font-bold mb-2 bg-gradient-to-r from-theme-blue to-theme-purple bg-clip-text text-transparent inline-block">Powerful Features</h2>
              <p className="text-muted-foreground">Everything you need to build web applications quickly</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="glass-card hover:shadow-3d hover:-translate-y-1 transition-all duration-300 p-6 group">
                  <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${feature.gradient} text-white overflow-hidden relative`}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20"></div>
                    {feature.icon}
                  </div>
                  <h3 className="font-heading font-semibold mb-2 text-lg group-hover:text-theme-purple transition-colors">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
            
            {/* How It Works */}
            <div className="mt-24 mb-12">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-heading font-bold mb-2 bg-gradient-to-r from-theme-blue via-theme-purple to-theme-pink bg-clip-text text-transparent inline-block">How It Works</h2>
                <p className="text-muted-foreground">Three simple steps to create your web application</p>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between max-w-4xl mx-auto relative">
                {/* Connection line */}
                <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-theme-blue to-theme-purple hidden md:block"></div>
                
                <div className="flex-1 flex flex-col items-center text-center p-6 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-theme-blue to-theme-indigo flex items-center justify-center mb-4 shadow-neon">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">1. Describe Your Idea</h3>
                  <p className="text-sm text-muted-foreground">Tell the AI what you want to build in natural language</p>
                </div>
                
                <div className="flex-1 flex flex-col items-center text-center p-6 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-theme-purple to-theme-pink flex items-center justify-center mb-4 shadow-neon">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">2. Generate Code</h3>
                  <p className="text-sm text-muted-foreground">Our AI creates the HTML, CSS and JavaScript for your app</p>
                </div>
                
                <div className="flex-1 flex flex-col items-center text-center p-6 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-theme-pink to-theme-orange flex items-center justify-center mb-4 shadow-neon">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">3. Preview & Export</h3>
                  <p className="text-sm text-muted-foreground">See your app in action and download the code</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="relative overflow-hidden">
        <div className="wave-bottom bg-gradient-to-r from-theme-blue/10 to-theme-purple/10 pt-12 pb-24">
          <div className="container text-sm text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="bg-gradient-animation h-2 w-2 rounded-full"></span>
              <span className="font-heading font-semibold text-lg bg-gradient-to-r from-theme-blue to-theme-purple bg-clip-text text-transparent">WebCraft AI</span>
              <span className="bg-gradient-animation h-2 w-2 rounded-full"></span>
            </div>
            <div className="max-w-md mx-auto">
              <p className="text-muted-foreground">Create web applications with AI assistance.</p>
              <div className="flex justify-center gap-4 mt-3">
                <a href="#" className="text-xs hover:text-theme-purple transition-colors">Privacy Policy</a>
                <a href="#" className="text-xs hover:text-theme-purple transition-colors">Terms of Use</a>
                <a href="#" className="text-xs hover:text-theme-purple transition-colors">Contact</a>
                <a href="#" className="text-xs hover:text-theme-purple transition-colors">About</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default Index;
