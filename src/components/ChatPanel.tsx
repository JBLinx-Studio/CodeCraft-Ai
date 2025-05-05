
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

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: nanoid(),
          role: "assistant",
          content: "Hello! I'm your AI assistant. Describe the web app you'd like me to build for you.",
          timestamp: Date.now(),
        },
      ]);
    }
  }, [messages.length]);

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

  const handleSendMessage = async (content: string) => {
    addMessage("user", content);
    
    if (isProcessing) {
      return;
    }
    
    // Check for API authentication issues before attempting to generate
    if (hasAuthError && usingFreeAPI && !apiKey) {
      toast.error("API Authentication Error", {
        description: "Please configure your API key in settings to continue.",
        duration: 5000,
      });
      
      setShowSettings(true);
      return;
    }
    
    // Add a thinking message
    const thinkingId = nanoid();
    const thinkingMessages = [
      "Analyzing your request...",
      "Thinking about the best approach...",
      "Processing your question...",
      "Considering different solutions..."
    ];
    const thinkingMessage = thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)];
    
    setMessages((prev) => [...prev, {
      id: thinkingId,
      role: "assistant",
      content: thinkingMessage,
      timestamp: Date.now(),
    }]);
    
    try {
      const response = await generateCode(content);
      
      // Remove the thinking message
      setMessages(prev => prev.filter(msg => msg.id !== thinkingId));
      
      if (response.error) {
        if (response.error.includes("401") || response.error.includes("Authentication")) {
          setHasAuthError(true);
          addMessage("assistant", `I'm having trouble connecting to the AI service. Please check your API settings by clicking the settings icon.`);
          
          toast.error("Authentication Error", {
            description: "Please check your API settings",
          });
          
          return;
        }
        
        addMessage("assistant", `I encountered an error: ${response.error}. Please try again with a different request.`);
        toast.error("Error", {
          description: response.error,
        });
        return;
      }
      
      const { html = "", css = "", js = "" } = response.code || {};
      
      // Only update the preview if code was actually generated
      if (html || css || js) {
        onCodeGenerated(html, css, js);
      }
      
      // Add the AI's response message
      let responseMessage = response.explanation || "I've created a web app based on your description.";
      addMessage("assistant", responseMessage);
      
      // Success notification
      if (html || css || js) {
        toast.success("Code generated successfully!", {
          description: "Check the preview panel to see your application",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error generating code:", error);
      
      // Remove the thinking message
      setMessages(prev => prev.filter(msg => msg.id !== thinkingId));
      
      // Check if it's an authentication error
      if (error instanceof Error && 
          (error.message.includes("401") || 
           error.message.includes("authentication") || 
           error.message.includes("Unauthorized"))) {
        setHasAuthError(true);
        addMessage("assistant", "I'm having trouble authenticating with the AI service. Please check your API settings by clicking the settings icon above.");
        
        toast.error("Authentication Error", {
          description: "Please configure your API key in settings"
        });
      } else {
        addMessage("assistant", "I'm having trouble generating code right now. Please try again later.");
        
        toast.error("Generation Error", {
          description: "Failed to generate code. Using fallback mode.",
        });
      }
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

  // Added onClear handler to fix TypeScript error
  const handleClearSettings = () => {
    clearApiKey();
    setHasAuthError(false);
    return true;
  };

  return (
    <div className="flex flex-col h-full cyber-panel overflow-hidden">
      <div className="flex justify-between items-center p-3 border-b bg-gradient-to-r from-slate-800/90 to-slate-900/90">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center shadow-glow-sm cyber-pulse">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <h2 className="font-medium text-base bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">AI Assistant</h2>
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
          <SheetContent className="cyber-panel border-l border-cyan-500/30 w-[350px] sm:w-[500px] backdrop-blur-xl">
            <AISettings 
              onClose={() => {}}
              onClear={handleClearSettings}
              apiKey={apiKey || ""}
              usingFreeAPI={usingFreeAPI}
              onSave={handleApiSettingsChange}
              apiProvider={apiProvider}
              modelType={modelType}
            />
          </SheetContent>
        </Sheet>
      </div>

      <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-slate-900/80 to-slate-800/80">
        <div className="space-y-4 mb-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-slate-700/50 bg-slate-800/90 backdrop-blur-sm">
        <ChatInput onSendMessage={handleSendMessage} disabled={isProcessing} isProcessing={isProcessing} />
      </div>
    </div>
  );
};

export default ChatPanel;
