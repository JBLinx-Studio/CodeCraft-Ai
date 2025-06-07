
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Message, AIProvider } from "@/types";
import AISettings from "./AISettings";
import { Settings, Zap, LinkIcon, ChevronsRight, ChevronsLeft, SquareTerminal } from "lucide-react";
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

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: nanoid(),
          role: "assistant",
          content: `Hello! I'm your AI assistant powered by ${usingFreeAPI ? 'Puter.js (Free GPT-4o mini)' : apiProvider}. I can build complete web applications for you. What would you like to create?`,
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

  const simulateAIThinking = () => {
    const thinkingSteps = [
      "🤔 Analyzing your request...",
      "📋 Planning the application structure...",
      "🎨 Designing the user interface...",
      "⚡ Generating HTML structure...",
      "🎭 Creating CSS styles...",
      "🚀 Writing JavaScript functionality...",
      "✨ Optimizing and finalizing code...",
      "🔍 Testing and validating...",
      "✅ Ready to deploy!"
    ];

    setAiThinkingSteps([]);
    
    thinkingSteps.forEach((step, index) => {
      setTimeout(() => {
        setAiThinkingSteps(prev => [...prev, step]);
      }, index * 800);
    });
  };

  const handleSendMessage = async (content: string) => {
    addMessage("user", content);
    
    if (isProcessing) {
      return;
    }
    
    // Start AI thinking simulation
    setAiThinkingSteps([]);
    simulateAIThinking();
    
    // Add a thinking message
    const thinkingId = nanoid();
    setMessages((prev) => [...prev, {
      id: thinkingId,
      role: "assistant",
      content: "🤖 AI is building your application...",
      timestamp: Date.now(),
    }]);
    
    try {
      const response = await generateCode(content);
      
      // Remove the thinking message
      setMessages(prev => prev.filter(msg => msg.id !== thinkingId));
      setAiThinkingSteps([]);
      
      if (response.error) {
        addMessage("assistant", `I encountered an issue: ${response.error}. But I've created something for you using my built-in capabilities!`);
      }
      
      const { html = "", css = "", js = "" } = response.code || {};
      
      // Update the preview if code was generated
      if (html || css || js) {
        onCodeGenerated(html, css, js);
      }
      
      // Add the AI's response message
      let responseMessage = response.explanation || "I've created your web application! Check the preview panel to see it in action.";
      
      if (usingFreeAPI) {
        responseMessage += "\n\n💡 Built with free Puter.js AI - no API keys required!";
      }
      
      addMessage("assistant", responseMessage);
      
      // Success notification
      if (html || css || js) {
        toast.success("Application Generated! 🎉", {
          description: "Your web app is ready in the preview panel",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error generating code:", error);
      
      // Remove the thinking message
      setMessages(prev => prev.filter(msg => msg.id !== thinkingId));
      setAiThinkingSteps([]);
      
      addMessage("assistant", "I encountered an issue, but I've generated something for you using my built-in templates. You can refine it by describing what you'd like to change!");
      
      toast.error("Generation Error", {
        description: "Used fallback mode to create your app",
      });
    }
  };

  // Fix the handler to match AISettings props signature
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
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <div className="flex flex-col">
            <h2 className="font-medium text-sm bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">AI Assistant</h2>
            <span className="text-xs text-cyan-300/70">
              {usingFreeAPI ? "Powered by Puter.js (Free)" : `${apiProvider} API`}
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
          
          {/* AI Thinking Steps Display */}
          {isProcessing && aiThinkingSteps.length > 0 && (
            <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-4 w-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse"></div>
                <span className="text-sm text-cyan-300 font-medium">AI Building Process</span>
              </div>
              <div className="space-y-2">
                {aiThinkingSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="animate-pulse">{step}</span>
                  </div>
                ))}
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
