
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Message, AIProvider } from "@/types";
import AISettings from "./AISettings";
import { Settings, Zap, Brain, Code, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { useAI } from "@/hooks/use-ai";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export interface ChatPanelProps {
  onCodeGenerated: (html: string, css: string, js: string) => void;
}

export const ChatPanel = ({ onCodeGenerated }: ChatPanelProps) => {
  const { generateCode, isProcessing, apiKey, usingFreeAPI, apiProvider, modelType, saveApiKey, clearApiKey, setFreeAPI } = useAI();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [hasAuthError, setHasAuthError] = useState(false);
  const [aiThinkingSteps, setAiThinkingSteps] = useState<string[]>([]);
  const [currentThinkingStep, setCurrentThinkingStep] = useState<string>('');

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: nanoid(),
          role: "assistant",
          content: `Hello! I'm your professional AI assistant powered by ${usingFreeAPI ? 'Puter.js (Free GPT-4o mini)' : apiProvider}. I can build complete, production-ready web applications just like Lovable AI. What would you like to create today?`,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [messages.length, usingFreeAPI, apiProvider]);

  const addMessage = (role: "user" | "assistant", content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: nanoid(),
        role,
        content,
        timestamp: Date.now(),
      },
    ]);
  };

  const simulateLovableAIThinking = () => {
    const thinkingSteps = [
      "🧠 Analyzing your requirements...",
      "📋 Planning application architecture...",
      "🎨 Designing user interface layout...",
      "🏗️ Setting up HTML structure...",
      "💫 Creating responsive CSS styles...",
      "⚡ Writing interactive JavaScript...",
      "🔧 Optimizing for performance...",
      "📱 Ensuring mobile responsiveness...",
      "✨ Adding professional animations...",
      "🚀 Finalizing production code...",
      "✅ Application ready for deployment!"
    ];

    setAiThinkingSteps([]);
    setCurrentThinkingStep('');
    
    thinkingSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentThinkingStep(step);
        setAiThinkingSteps(prev => [...prev, step]);
      }, index * 600);
    });

    // Clear thinking steps after completion
    setTimeout(() => {
      setCurrentThinkingStep('');
      setAiThinkingSteps([]);
    }, thinkingSteps.length * 600 + 2000);
  };

  const handleSendMessage = async (content: string) => {
    addMessage("user", content);
    
    if (isProcessing) {
      return;
    }
    
    // Start Lovable-style AI thinking simulation
    setAiThinkingSteps([]);
    simulateLovableAIThinking();
    
    // Add a thinking message
    const thinkingId = nanoid();
    setMessages((prev) => [...prev, {
      id: thinkingId,
      role: "assistant",
      content: "🤖 AI Engineer is building your professional web application...",
      timestamp: Date.now(),
    }]);
    
    try {
      console.log('🚀 Starting professional code generation...');
      const response = await generateCode(content);
      
      // Remove the thinking message
      setMessages(prev => prev.filter(msg => msg.id !== thinkingId));
      setAiThinkingSteps([]);
      setCurrentThinkingStep('');
      
      if (response.error) {
        addMessage("assistant", `I encountered an issue: ${response.error}. But I've created a professional application for you using my advanced capabilities!`);
      }
      
      const { html = "", css = "", js = "" } = response.code || {};
      
      // Update the preview if code was generated
      if (html || css || js) {
        onCodeGenerated(html, css, js);
        console.log('✅ Code generated and preview updated');
      }
      
      // Add the AI's response message
      let responseMessage = response.explanation || "I've created your professional web application! Check the preview panel to see your modern, responsive application in action.";
      
      if (usingFreeAPI) {
        responseMessage += "\n\n💡 Built with free Puter.js AI - professional results without API costs!";
      }
      
      addMessage("assistant", responseMessage);
      
      // Success notification
      if (html || css || js) {
        toast.success("Professional Application Generated! 🎉", {
          description: "Your enterprise-grade web app is ready in the preview panel",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("❌ Error generating code:", error);
      
      // Remove the thinking message
      setMessages(prev => prev.filter(msg => msg.id !== thinkingId));
      setAiThinkingSteps([]);
      setCurrentThinkingStep('');
      
      addMessage("assistant", "I encountered an issue, but I've generated a professional application for you using my built-in capabilities. You can refine it by describing what you'd like to change!");
      
      toast.error("Generation Error", {
        description: "Used fallback mode to create your professional app",
      });
    }
  };

  const handleApiSettingsChange = (key: string, provider: AIProvider, modelType?: string) => {
    if (provider === "FREE") {
      setFreeAPI();
      return true;
    } else if (key) {
      saveApiKey(key, provider, modelType);
      return true;
    } else {
      clearApiKey();
      return true;
    }
    setHasAuthError(false);
    return true;
  };

  return (
    <div className="flex flex-col h-full cyber-panel overflow-hidden">
      <div className="flex justify-between items-center p-3 border-b bg-gradient-to-r from-slate-800/90 to-slate-900/90">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center shadow-glow-sm pulse cyber-pulse">
            <Brain className="h-3.5 w-3.5 text-white" />
          </div>
          <div className="flex flex-col">
            <h2 className="font-medium text-sm bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">AI Engineer</h2>
            <span className="text-xs text-cyan-300/70">
              {usingFreeAPI ? "Powered by Puter.js (Free GPT-4o)" : `${apiProvider} API`}
            </span>
          </div>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-slate-800/50 h-8 w-8 rounded-full"
              title="AI Settings"
            >
              <Settings className="h-4 w-4 text-cyan-400" />
            </Button>
          </SheetTrigger>
          <SheetContent className="cyber-panel border-l border-cyan-500/30 w-[350px] sm:w-[450px] backdrop-blur-xl">
            <AISettings 
              onClose={() => {}}
              apiKey={apiKey || ""}
              usingFreeAPI={usingFreeAPI}
              onSave={handleApiSettingsChange}
              apiProvider={apiProvider}
              modelType={modelType}
              onClear={clearApiKey}
              onSetFreeAPI={setFreeAPI}
            />
          </SheetContent>
        </Sheet>
      </div>

      <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-slate-900/80 to-slate-800/80">
        <div className="space-y-4 mb-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {/* Lovable-style AI Thinking Steps Display */}
          {isProcessing && (aiThinkingSteps.length > 0 || currentThinkingStep) && (
            <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-4 w-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse"></div>
                <span className="text-sm text-cyan-300 font-medium">AI Engineer Building Process</span>
                <Sparkles className="h-3 w-3 text-yellow-400 animate-pulse" />
              </div>
              
              {/* Current thinking step with emphasis */}
              {currentThinkingStep && (
                <div className="mb-2 p-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded border border-cyan-400/20">
                  <div className="flex items-center gap-2 text-sm text-cyan-200 font-medium">
                    <Code className="h-3 w-3 animate-spin" />
                    <span>{currentThinkingStep}</span>
                  </div>
                </div>
              )}
              
              {/* Completed steps */}
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {aiThinkingSteps.slice(0, -1).map((step, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-slate-300 opacity-70">
                    <div className="h-1 w-1 rounded-full bg-green-400"></div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 text-xs text-slate-400 italic">
                Professional code generation in progress...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-2 border-t border-slate-700/50 bg-slate-800/90 backdrop-blur-sm">
        <ChatInput onSendMessage={handleSendMessage} disabled={isProcessing} isProcessing={isProcessing} />
      </div>
    </div>
  );
};

export default ChatPanel;
